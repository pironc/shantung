import Taro, { useDidShow } from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
import { useEffect, useState, type ReactNode } from 'react'
import type { Boutique, Image as Img } from '@shantung/shared-types'
import { t, when } from '../services/i18n'
import { theme } from '../theme'
import { iconUri, type IconName } from './art'

type Chrome = { statusBar: number; barTop: number; barLeft: number; barHeight: number; contentTop: number; hairline: number }
let chromeCache: Chrome | undefined

/**
 * Where the top of the screen is free. Pages draw their own top (no title bar): the status bar and, in WeChat,
 * the capsule (… and ✕, always top right) take the first row. The back button lines up with the capsule;
 * content starts below that row, so on notched iPhones nothing hides behind the notch.
 */
export function chrome(): Chrome {
  if (chromeCache) return chromeCache
  let statusBar = 0
  let windowWidth = 0
  let pixelRatio = 2
  try {
    const info = Taro.getSystemInfoSync()
    statusBar = info.statusBarHeight || 0
    windowWidth = info.windowWidth
    pixelRatio = info.pixelRatio || 2
  } catch {
    // keep 0
  }
  // The same gap above and beside the back button. In WeChat it mirrors the capsule's own right-hand gap.
  const GAP = 12
  let barTop = statusBar + GAP
  let barLeft = GAP
  let barHeight = 32
  // Only WeChat has the capsule; Taro's browser build answers this call with a rejected promise.
  if (process.env.TARO_ENV === 'weapp') {
    const capsule = Taro.getMenuButtonBoundingClientRect()
    if (capsule?.height) {
      barTop = capsule.top
      barHeight = capsule.height
      barLeft = windowWidth ? windowWidth - capsule.right : GAP
    }
  }
  // One device pixel, as WeChat draws its capsule's outline (1/3pt on a 3x iPhone).
  chromeCache = { statusBar, barTop, barLeft, barHeight, contentTop: barTop + barHeight + 8, hairline: 1 / pixelRatio }
  return chromeCache
}

/** The page root's custom properties for the top offsets (CSS reads --content-top, --bar-top, --bar-h). */
export const chromeStyle = () => {
  const c = chrome()
  return `--status-bar: ${c.statusBar}px; --bar-top: ${c.barTop}px; --bar-left: ${c.barLeft}px; --bar-h: ${c.barHeight}px; --content-top: ${c.contentTop}px; --hairline: ${c.hairline}px`
}

/**
 * WeChat only: a band in the page colour behind the status bar (clock, notch or island). Clear at the top, so a
 * photo can still run to the edge; once the page scrolls it fades in, and text never runs under the clock.
 */
export function StatusCover() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (process.env.TARO_ENV !== 'weapp') return
    let io: Taro.IntersectionObserver | undefined
    // A marker at the very top of the page: once it leaves the screen, the page has scrolled. One frame first, so it exists.
    const timer = setTimeout(() => {
      io = Taro.createIntersectionObserver(Taro.getCurrentInstance().page as never)
      io.relativeToViewport({ top: 0 }).observe('.status-sentinel', (r) => setOn((r.intersectionRatio ?? 0) === 0))
    }, 50)
    return () => {
      clearTimeout(timer)
      io?.disconnect()
    }
  }, [])
  if (process.env.TARO_ENV !== 'weapp') return null
  return (
    <>
      <View className='status-sentinel' />
      <View className={`status-cover ${on ? 'is-on' : ''}`} />
    </>
  )
}

const back = () => (Taro.getCurrentPages().length > 1 ? Taro.navigateBack() : Taro.switchTab({ url: '/pages/index/index' }))

/**
 * A round back button floating at the capsule's height: no page title (the page says what it is), nothing
 * covered. Opened from a shared link with no history, it goes to Discover. iOS edge-swipe works too.
 */
export const TopBar = () => (
  <View className='topbar' hoverClass='is-pressed' ariaRole='button' ariaLabel={t().back} onClick={back}>
    {/* Ink and 2.4 units at 20px: the 2pt weight of WeChat's own capsule icons, right beside it. */}
    <Icon name='back' ink weight={2.4} />
  </View>
)

/**
 * A fresh entrance every time the page is shown: tab pages stay mounted, so a mount animation would play once.
 * Switching between two identical animations restarts it.
 */
export function usePageEnter() {
  const [shows, setShows] = useState(0)
  useDidShow(() => setShows((n) => n + 1))
  return shows % 2 ? 'page-in-a' : 'page-in-b'
}

/**
 * WeChat on iPhone won't load a plain-http photo in <image> (HTTPS only), and the local stack serves http on the
 * Wi-Fi. So the WeChat build downloads such a photo (debug mode allows it, like the API calls) and shows the local
 * copy. Production photos are HTTPS and skip this. A few at a time: WeChat caps parallel downloads.
 */
const copies = new Map<string, Promise<string>>()
let downloading = 0
const queue: (() => void)[] = []
const turn = () => new Promise<void>((go) => (downloading < 6 ? (downloading++, go()) : queue.push(() => (downloading++, go()))))
const done1 = () => {
  downloading--
  queue.shift()?.()
}
const localCopy = (url: string) => {
  if (!copies.has(url)) {
    const p = turn()
      .then(() => Taro.downloadFile({ url }))
      .then(
        (r) => (done1(), r.statusCode === 200 ? r.tempFilePath : Promise.reject(r.statusCode)),
        (e) => (done1(), Promise.reject(e)),
      )
    p.catch(() => copies.delete(url))
    copies.set(url, p)
  }
  return copies.get(url)!
}
function usePhotoSrc(url: string | undefined) {
  const local = process.env.TARO_ENV === 'weapp' && !!url && url.startsWith('http://')
  const [src, setSrc] = useState(local ? '' : url)
  useEffect(() => {
    if (!local || !url) return setSrc(url)
    let live = true
    localCopy(url).then(
      (p) => live && setSrc(p),
      () => live && setSrc(url),
    )
    return () => {
      live = false
    }
  }, [url])
  return src
}

/** Photos this session has already shown: a second copy of one appears at once instead of fading in again. */
const shown = new Set<string>()
/** Pages waiting for photos (usePhotosReady) hear each one land. */
const landed = new Set<() => void>()

/**
 * True once these photos have loaded in the page itself, so a page can fade in whole: photos, titles and text in
 * the same frames, instead of text first and each photo on its own clock. `undefined` (data still loading) waits too.
 * Pass the first screen's photos only; the rest load while the page is already showing.
 * ponytail: waits at most `capMs`; past that the page shows and a late photo fades in on its own.
 */
export function usePhotosReady(urls: string[] | undefined, capMs = 1000) {
  const all = () => !!urls?.length && urls.every((u) => shown.has(u))
  // 0 waiting, 1 photos in (drawn while the page is still hidden), 2 show the page.
  const [phase, setPhase] = useState(() => (all() ? 2 : 0))
  useEffect(() => {
    const cap = setTimeout(() => setPhase(2), capMs)
    return () => clearTimeout(cap)
  }, [])
  useEffect(() => {
    if (phase !== 1) return
    // A few frames after phase 1 is drawn, so the photos are already opaque when their own fade comes back on.
    const t = setTimeout(() => setPhase(2), 50)
    return () => clearTimeout(t)
  }, [phase])
  const key = urls?.join('|')
  useEffect(() => {
    if (!urls || phase) return
    const check = () => all() && setPhase((n) => n || 1)
    landed.add(check)
    check()
    return () => {
      landed.delete(check)
    }
  }, [key])
  return phase === 2
}

/**
 * A photo at a fixed ratio (height / width, in %), cropped to fill: layout never jumps while it loads.
 * It fades in the first time it loads instead of popping; children (a tag) sit over it.
 * `packshot`: a product on the studio ground, which the empty frame already shows, so only the product fades in.
 * `eager`: load now even if hidden (a small set kept mounted, like the Collection's tabs).
 * `still`: no fade of its own while its page waits for its photos to fade in whole (usePhotosReady).
 */
export function Photo({
  image,
  ratio = 125,
  className = '',
  packshot = false,
  eager = false,
  still = false,
  children,
}: {
  image: Img | null | undefined
  ratio?: number
  className?: string
  packshot?: boolean
  eager?: boolean
  still?: boolean
  children?: ReactNode
}) {
  const [loaded, setLoaded] = useState(false)
  const src = usePhotoSrc(image?.url)
  // Checked on every render, not only the first: a copy mounted while hidden must not fade in a photo already shown.
  const ready = loaded || (!!image && shown.has(image.url))
  const done = () => {
    if (image) shown.add(image.url)
    setLoaded(true)
    landed.forEach((f) => f())
  }
  return (
    <View className={`photo ${packshot ? 'photo--packshot' : ''} ${className}`} style={{ paddingTop: `${ratio}%` }}>
      {image && src && (
        <Image
          className={`photo__img ${ready ? 'is-loaded' : ''} ${still ? 'is-still' : ''}`}
          src={src}
          mode='aspectFill'
          // WeChat lazy-loads three screens ahead. Taro's H5 lazyLoad only starts once the photo is on screen (the tab
          // bar's scroller clips its observer), so the browser's own lazy loading, which looks further ahead, does it there.
          lazyLoad={!eager && process.env.TARO_ENV !== 'h5'}
          nativeProps={{ loading: eager ? 'eager' : 'lazy' }}
          onLoad={done}
          onError={done}
          ariaLabel={image.alt}
        />
      )}
      {children}
    </View>
  )
}

/**
 * Reveal on scroll, the WeChat way: one IntersectionObserver per page adds a class; CSS does the motion.
 * Fail-safe: until the observer has answered once, everything stays visible.
 */
export function useReveal(ready: unknown) {
  const [state, setState] = useState<{ armed: boolean; seen: Set<string> }>({ armed: false, seen: new Set() })
  useEffect(() => {
    if (!ready) return
    let io: Taro.IntersectionObserver | undefined
    // Wait one frame so the observed nodes exist.
    const timer = setTimeout(() => {
      try {
        io = Taro.createIntersectionObserver(Taro.getCurrentInstance().page as never, { observeAll: true, thresholds: [0, 0.15] })
        io.relativeToViewport({ bottom: 0 }).observe('.reveal', (res) => {
          setState((s) => {
            const id = (res as unknown as { id: string }).id // WeChat reports the target's id; Taro's types omit it
            const visible = (res.intersectionRatio ?? 0) > 0
            if (s.armed && (!visible || s.seen.has(id))) return s
            const seen = new Set(s.seen)
            if (visible && id) seen.add(id)
            return { armed: true, seen }
          })
        })
      } catch {
        // No observer on this platform: content simply stays visible.
      }
    }, 50)
    return () => {
      clearTimeout(timer)
      io?.disconnect()
    }
  }, [ready])
  return (id: string) => (!state.armed || state.seen.has(id) ? 'reveal is-in' : 'reveal')
}

/** A line icon from components/art.ts; decorative, so hidden from screen readers (the text beside it carries the meaning). */
export const Icon = ({
  name,
  light = false,
  muted = false,
  ink = false,
  weight,
}: {
  name: IconName
  light?: boolean
  muted?: boolean
  ink?: boolean
  weight?: number
}) => (
  <Image
    className='icon'
    src={iconUri(name, light ? theme.paper : ink ? theme.text : muted ? theme.textSecondary : theme.accent, weight)}
    ariaHidden
  />
)

/**
 * Open a boutique in the phone's map app. WeChat shows its map, with a choice of Amap, Tencent or Apple Maps;
 * the browser build opens Amap (高德), the default in China, which hands over to its app when installed.
 */
export function openMap(b: Pick<Boutique, 'title' | 'address' | 'latitude' | 'longitude'>) {
  if (b.latitude == null || b.longitude == null) return
  if (process.env.TARO_ENV === 'weapp') {
    Taro.openLocation({ latitude: b.latitude, longitude: b.longitude, name: b.title, address: b.address, scale: 16 })
    return
  }
  window.location.href = `https://uri.amap.com/marker?position=${b.longitude},${b.latitude}&name=${encodeURIComponent(b.title)}&coordinate=gaode&callnative=1&src=shantung`
}

/** The address, once, as a row that opens the map. */
export const AddressFact = ({ boutique, label }: { boutique: Boutique; label: string }) => (
  <View className='fact fact--link' hoverClass='is-pressed-row' ariaRole='link' onClick={() => openMap(boutique)}>
    <Text className='t-label'>{label}</Text>
    <View className='fact__row'>
      <Text>{boutique.address}</Text>
      <Icon name='pin' />
    </View>
  </View>
)

const isIcon = (code: string): code is IconName => ['BJ01', 'QD01', 'SH01'].includes(code)

/** Under a photo, on red: when (calendar) on the left, where (the city's landmark) on the right. */
export const InfoStrip = ({ iso, place }: { iso?: string; place?: { code: string; city: string } | null }) => (
  <View className='info-strip'>
    {iso ? (
      <View className='info-strip__item'>
        <Icon name='calendar' light />
        <Text>{when(iso)}</Text>
      </View>
    ) : (
      <View />
    )}
    {place && (
      <View className='info-strip__item'>
        {isIcon(place.code) && <Icon name={place.code} light />}
        <Text>{place.city}</Text>
      </View>
    )}
  </View>
)

export type SheetOption = { label: string; selected?: boolean; run: () => void }

/**
 * A bottom sheet of choices, drawn by the app so every word (Cancel included) follows the app's language.
 * The current choice is bold, with a check. Each page renders `sheet` once at its end.
 */
/**
 * The frame of a bottom sheet. WeChat's tab bar is native and sits above the page, so it hides while a sheet
 * is open (and comes back when it closes).
 */
export function SheetFrame({ title, onClose, children }: { title?: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    Taro.hideTabBar({ animation: false }).catch(() => {}) // not a tab page: nothing to hide
    return () => {
      Taro.showTabBar({ animation: false }).catch(() => {})
    }
  }, [])
  return (
    <View className='sheet' onClick={onClose}>
      <View className='sheet__box' ariaRole='dialog' onClick={(e) => e.stopPropagation()}>
        {title && <Text className='t-label sheet__title'>{title}</Text>}
        {children}
        <View className='sheet__cancel' hoverClass='is-pressed-row' ariaRole='button' onClick={onClose}>
          {t().cancel}
        </View>
      </View>
    </View>
  )
}

/**
 * A bottom sheet of choices, drawn by the app so every word (Cancel included) follows the app's language.
 * The current choice is bold, with a check. Each page renders `sheet` once at its end.
 */
export function useSheet() {
  const [open, setOpen] = useState<{ title?: string; options: SheetOption[] } | null>(null)
  const close = () => setOpen(null)
  const sheet = open && (
    <SheetFrame title={open.title} onClose={close}>
      {open.options.map((o) => (
        <View
          key={o.label}
          className={`sheet__option ${o.selected ? 'is-selected' : ''}`}
          hoverClass='is-pressed-row'
          ariaRole='menuitemradio'
          ariaChecked={o.selected}
          onClick={() => {
            close()
            o.run()
          }}
        >
          <Text>{o.label}</Text>
          {o.selected && <Icon name='check' />}
        </View>
      ))}
    </SheetFrame>
  )
  return { sheet, show: (title: string | undefined, options: SheetOption[]) => setOpen({ title, options }) }
}

type PopupMessage = { title: string; text?: string; action?: { label: string; run: () => void } }

/**
 * Action results open in a pop-up, so the page itself never shifts. Tap outside or Close to dismiss.
 * Each page renders `popup` once at its end.
 */
export function usePopup() {
  const [msg, setMsg] = useState<PopupMessage | null>(null)
  const close = () => setMsg(null)
  const popup = msg && (
    <View className='popup' onClick={close}>
      <View className='popup__box' ariaRole='alertdialog' ariaLabel={msg.title} onClick={(e) => e.stopPropagation()}>
        <Text className='t-sub popup__title'>{msg.title}</Text>
        {msg.text && <Text className='popup__text'>{msg.text}</Text>}
        <View className='popup__actions'>
          {msg.action && (
            <View
              className='btn-text'
              hoverClass='is-pressed'
              ariaRole='button'
              onClick={() => {
                close()
                msg.action!.run()
              }}
            >
              {msg.action.label} →
            </View>
          )}
          <View className='btn-text popup__close' hoverClass='is-pressed' ariaRole='button' onClick={close}>
            {t().close}
          </View>
        </View>
      </View>
    </View>
  )
  return { popup, show: (m: PopupMessage) => setMsg(m) }
}

/** Boutiques as three portrait cards, each showing its city's landmark. */
export function BoutiquePicker({ boutiques, value, onChange }: { boutiques: Boutique[]; value: string; onChange: (code: string) => void }) {
  return (
    <View className='places' ariaRole='radiogroup'>
      {boutiques.map((b) => (
        <View key={b.code} className={`place ${value === b.code ? 'is-active' : ''}`} ariaRole='radio' ariaChecked={value === b.code} onClick={() => onChange(b.code)}>
          <Photo image={b.image} ratio={177.78} />
          <View className='place__bar' />
          <Text className='place__city'>{b.city}</Text>
        </View>
      ))}
    </View>
  )
}

/** A list of actions, one per row, all the same height: label on the left, value and arrow on the right. */
export const MenuRow = ({ label, value, onClick }: { label: string; value?: string; onClick: () => void }) => (
  <View className='menu__row' hoverClass='is-pressed-row' ariaRole='button' onClick={onClick}>
    <Text>{label}</Text>
    <Text className='menu__value'>
      {value ? `${value} ` : ''}›
    </Text>
  </View>
)

export function Notice({ text, tone = 'neutral' }: { text: string | null | undefined; tone?: 'neutral' | 'accent' | 'danger' }) {
  if (!text) return null
  return (
    <View className={`notice notice--${tone}`} ariaRole='status'>
      <Text>{text}</Text>
    </View>
  )
}

/** Paragraphs from Drupal's plain text (blank lines separate them). */
export const Paragraphs = ({ text }: { text: string }) => (
  <View className='prose'>
    {text.split(/\n\s*\n/).map((p, i) => (
      <Text key={i} className='prose__p'>
        {p}
      </Text>
    ))}
  </View>
)

/** Navigate, or go to a tab page (WeChat refuses navigateTo for tab pages). */
export const go = (url: string) => {
  const tabs = ['/pages/index/index', '/pages/collection/index', '/pages/salons/index', '/pages/membership/index']
  return tabs.includes(url.split('?')[0]) ? Taro.switchTab({ url }) : Taro.navigateTo({ url })
}
