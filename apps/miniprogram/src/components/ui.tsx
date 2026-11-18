import Taro, { useDidShow } from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
import { useEffect, useState, type ReactNode } from 'react'
import type { Boutique, Image as Img } from '@shantung/shared-types'
import { t, when } from '../services/i18n'
import { theme } from '../theme'
import { iconUri, type IconName } from './art'

type Chrome = { statusBar: number; barTop: number; barHeight: number; contentTop: number }
let chromeCache: Chrome | undefined

/**
 * Where the top of the screen is free. Pages draw their own top (no title bar): the status bar and, in WeChat,
 * the capsule (… and ✕, always top right) take the first row. The back button lines up with the capsule;
 * content starts below that row, so on notched iPhones nothing hides behind the notch.
 */
export function chrome(): Chrome {
  if (chromeCache) return chromeCache
  let statusBar = 0
  try {
    statusBar = Taro.getSystemInfoSync().statusBarHeight || 0
  } catch {
    // keep 0
  }
  let barTop = statusBar + 8
  let barHeight = 32
  // Only WeChat has the capsule; Taro's browser build answers this call with a rejected promise.
  if (process.env.TARO_ENV === 'weapp') {
    const capsule = Taro.getMenuButtonBoundingClientRect()
    if (capsule?.height) {
      barTop = capsule.top
      barHeight = capsule.height
    }
  }
  chromeCache = { statusBar, barTop, barHeight, contentTop: barTop + barHeight + 8 }
  return chromeCache
}

/** The page root's custom properties for the top offsets (CSS reads --content-top, --bar-top, --bar-h). */
export const chromeStyle = () => {
  const c = chrome()
  return `--status-bar: ${c.statusBar}px; --bar-top: ${c.barTop}px; --bar-h: ${c.barHeight}px; --content-top: ${c.contentTop}px`
}

const back = () => (Taro.getCurrentPages().length > 1 ? Taro.navigateBack() : Taro.switchTab({ url: '/pages/index/index' }))

/**
 * A round back button floating at the capsule's height: no page title (the page says what it is), nothing
 * covered. Opened from a shared link with no history, it goes to Discover. iOS edge-swipe works too.
 */
export const TopBar = () => (
  <View className='topbar' hoverClass='is-pressed' ariaRole='button' ariaLabel={t().back} onClick={back}>
    <Icon name='back' />
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

/** A photo at a fixed ratio (height / width, in %), cropped to fill: layout never jumps while it loads. */
export function Photo({ image, ratio = 125, className = '' }: { image: Img | null | undefined; ratio?: number; className?: string }) {
  return (
    <View className={`photo ${className}`} style={{ paddingTop: `${ratio}%` }}>
      {image && <Image className='photo__img' src={image.url} mode='aspectFill' lazyLoad ariaLabel={image.alt} />}
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
export const Icon = ({ name, light = false }: { name: IconName; light?: boolean }) => (
  <Image className='icon' src={iconUri(name, light ? theme.paper : theme.accent)} ariaHidden />
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
        <Text className='t-title'>{msg.title}</Text>
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
