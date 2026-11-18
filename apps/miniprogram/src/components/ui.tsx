import Taro from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Image as Img } from '@shantung/shared-types'
import { lang, setLang } from '../services/i18n'

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

export function LangToggle({ onDark = false }: { onDark?: boolean }) {
  const current = lang()
  return (
    <View className={`lang ${onDark ? 'lang--on-photo' : ''}`}>
      {(
        [
          ['en', 'EN'],
          ['zh-hans', '中文'],
        ] as const
      ).map(([code, label]) => (
        <Text
          key={code}
          className={`lang__item ${current === code ? 'is-active' : ''}`}
          onClick={() => setLang(code)}
          ariaRole='button'
          ariaLabel={code === 'en' ? 'English' : '简体中文'}
        >
          {label}
        </Text>
      ))}
    </View>
  )
}

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
