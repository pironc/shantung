import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Canvas, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Member } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { loadFonts } from '../../services/fonts'
import { lang, t } from '../../services/i18n'
import { Notice } from '../../components/ui'
import { drawPass, H, W } from './draw'
import './index.css'

const COPY = {
  en: { invite: ['is delighted to invite you', 'to discover the maison.'] as [string, string], scan: 'Scan to discover Shantung', greeting: 'Dear member', save: 'Save to album', download: 'Download the image', saved: 'Saved to your album.' },
  'zh-hans': { invite: ['诚挚邀请您莅临本坊，', '品鉴山东的丝与茶。'] as [string, string], scan: '扫码探索 Shantung', greeting: '尊敬的会员', save: '保存到相册', download: '下载图片', saved: '已保存到相册。' },
}

type Node = { width: number; height: number; getContext(type: '2d'): CanvasRenderingContext2D; createImage?: () => any }

/** The canvas element: WeChat hands back a native node through a selector query; the browser build has a real <canvas>. */
function canvasNode(): Promise<Node | null> {
  if (process.env.TARO_ENV === 'h5') {
    const host = document.querySelector('#pass')
    return Promise.resolve((host?.tagName === 'CANVAS' ? host : host?.querySelector('canvas')) as unknown as Node | null)
  }
  return new Promise((resolve) =>
    Taro.createSelectorQuery()
      .select('#pass')
      .fields({ node: true, size: true })
      .exec(([res]) => resolve((res?.node as Node) ?? null)),
  )
}

export default function Pass() {
  useLang()
  const s = t()
  const copy = COPY[lang()]
  const me = useData<Member>('/api/me')
  const [canvas, setCanvas] = useState<Node | null>(null)
  const [notice, setNotice] = useState('')
  useDidShow(() => Taro.setNavigationBarTitle({ title: s.vipPass }))

  useEffect(() => {
    const member = me.data
    if (!member) return
    let live = true
    ;(async () => {
      await loadFonts()
      const node = await canvasNode()
      if (!node || !live) return
      const dpr = Taro.getSystemInfoSync().pixelRatio || 2
      node.width = W * dpr
      node.height = H * dpr
      const ctx = node.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
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
      setCanvas(node)
    })()
    return () => {
      live = false
    }
  }, [me.data, lang()])

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
      setNotice(copy.saved)
    } catch {
      setNotice(s.error) // includes the client declining photo access
    }
  }

  return (
    <View className='ds pass'>
      <View className='page-head'>
        <View>
          <Text className='t-display'>{s.vipPass}</Text>
          <Text className='t-sub'>Shantung</Text>
        </View>
      </View>
      <View className='pass__frame'>
        <Canvas type='2d' id='pass' className='pass__canvas' ariaLabel={`${copy.invite[0]} ${copy.invite[1]}`} />
      </View>
      <View className='section'>
        <Button className='btn' hoverClass='is-pressed' disabled={!canvas} onClick={save}>
          {process.env.TARO_ENV === 'h5' ? copy.download : copy.save}
        </Button>
        <Notice text={notice || (me.error && s.error)} />
      </View>
      <View className='spacer' />
    </View>
  )
}
