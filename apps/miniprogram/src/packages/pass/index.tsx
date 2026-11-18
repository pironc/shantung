import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Canvas, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Member } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { loadFonts } from '../../services/fonts'
import { lang, t } from '../../services/i18n'
import { Notice, TopBar, chromeStyle, usePageEnter, usePopup } from '../../components/ui'
import { drawPass, H, W } from './draw'
import './index.css'

const COPY = {
  en: { invite: ['is delighted to invite you', 'to discover the maison.'] as [string, string], scan: 'Scan to discover Shantung', greeting: 'Dear member', save: 'Save to album', download: 'Download the image', saved: 'Saved to your album.' },
  'zh-hans': { invite: ['诚挚邀请您莅临本坊，', '品鉴山东的丝与茶。'] as [string, string], scan: '扫码探索 Shantung', greeting: '尊敬的会员', save: '保存到相册', download: '下载图片', saved: '已保存到相册。' },
}

type Node = { width: number; height: number; getContext(type: '2d'): CanvasRenderingContext2D; createImage?: () => any }
type Size = { w: number; h: number }

const query = <T,>(select: (q: Taro.SelectorQuery) => Taro.NodesRef, fields: (n: Taro.NodesRef) => Taro.SelectorQuery) =>
  new Promise<T | null>((resolve) => fields(select(Taro.createSelectorQuery())).exec(([res]) => resolve((res as T) ?? null)))

/** The canvas element: WeChat hands back a native node through a selector query; the browser build has a real <canvas>. */
function canvasNode(): Promise<Node | null> {
  if (process.env.TARO_ENV === 'h5') {
    const host = document.querySelector('#pass')
    return Promise.resolve((host?.tagName === 'CANVAS' ? host : host?.querySelector('canvas')) as unknown as Node | null)
  }
  return query<{ node: Node }>((q) => q.select('#pass'), (n) => n.fields({ node: true })).then((r) => r?.node ?? null)
}

export default function Pass() {
  useLang()
  const s = t()
  const enter = usePageEnter()
  const copy = COPY[lang()]
  const me = useData<Member>('/api/me')
  const [size, setSize] = useState<Size | null>(null)
  const [canvas, setCanvas] = useState<Node | null>(null)
  const { popup, show } = usePopup()
  useDidShow(() => Taro.setNavigationBarTitle({ title: s.vipPass }))

  // Fit the card to the space between the title and the button, at its own proportions: the page never scrolls.
  useEffect(() => {
    const timer = setTimeout(async () => {
      const box = await query<{ width: number; height: number }>((q) => q.select('#pass-frame'), (n) => n.boundingClientRect())
      if (!box) return
      const w = Math.floor(Math.min(box.width, (box.height * W) / H))
      setSize({ w, h: Math.floor((w * H) / W) })
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const member = me.data
    if (!member || !size) return
    let live = true
    setCanvas(null)
    ;(async () => {
      await loadFonts()
      const node = await canvasNode()
      if (!node || !live) return
      const dpr = Taro.getSystemInfoSync().pixelRatio || 2
      node.width = size.w * dpr
      node.height = size.h * dpr
      const ctx = node.getContext('2d')
      const k = (size.w / W) * dpr
      ctx.setTransform(k, 0, 0, k, 0, 0)
      const loadImage = (src: string) =>
        new Promise<any>((resolve) => {
          const img = node.createImage ? node.createImage() : new window.Image()
          img.onload = () => resolve(img)
          img.onerror = () => resolve(null) // no avatar on the card rather than no card
          img.src = src
        })
      // The QR invites a friend to the maison with this member as the referrer.
      const link = `${process.env.TARO_APP_H5_URL}/#/pages/index/index?ref=${member.memberNo}`
      await drawPass(ctx, member, copy, link, loadImage)
      if (live) setCanvas(node)
    })()
    return () => {
      live = false
    }
  }, [me.data, size, lang()])

  const save = async () => {
    if (!canvas) return
    if (process.env.TARO_ENV === 'h5') {
      const a = document.createElement('a')
      a.href = (canvas as unknown as HTMLCanvasElement).toDataURL('image/png')
      a.download = 'shantung-invitation.png'
      a.click()
      return
    }
    try {
      const { tempFilePath } = await Taro.canvasToTempFilePath({ canvas } as unknown as Taro.canvasToTempFilePath.Option)
      await Taro.saveImageToPhotosAlbum({ filePath: tempFilePath })
      show({ title: s.savedTitle, text: copy.saved })
    } catch {
      show({ title: s.errorTitle, text: s.error }) // includes the client declining photo access
    }
  }

  const box = size ? { width: `${size.w}px`, height: `${size.h}px` } : undefined
  return (
    <View className={`ds pass ${process.env.TARO_ENV === 'h5' ? 'pass--h5' : ''} ${enter}`} style={chromeStyle()}>
      <TopBar />
      <Text className='t-sub'>{s.vipPass}</Text>
      <View id='pass-frame' className='pass__frame'>
        <View className='pass__slot' style={box}>
          <Canvas type='2d' id='pass' className={`pass__canvas ${canvas ? 'is-ready' : ''}`} style={box} ariaLabel={`${copy.invite[0]} ${copy.invite[1]}`} />
          {/* Until the card is drawn (fonts, avatar, QR), a satin sheen passes over its outline. */}
          <View className={`pass__loader ${canvas ? 'is-done' : ''}`} ariaHidden>
            <View className='pass__sheen' />
          </View>
        </View>
      </View>
      <Button className={`btn ${!canvas ? 'is-disabled' : ''}`} hoverClass='is-pressed' disabled={!canvas} onClick={save}>
        {process.env.TARO_ENV === 'h5' ? copy.download : copy.save}
      </Button>
      <Notice text={me.error && s.error} />
      {popup}
    </View>
  )
}
