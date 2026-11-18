import Taro, { useDidShow } from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Boutique, Image as Img } from '@shantung/shared-types'
import { clock, day } from '../services/i18n'

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

/** Date on the left, time on the right, on a red strip under a photo: legible whatever the photo's colours. */
export const DateStrip = ({ iso }: { iso: string }) => (
  <View className='date-strip'>
    <Text>{day(iso)}</Text>
    <Text>{clock(iso)}</Text>
  </View>
)

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
