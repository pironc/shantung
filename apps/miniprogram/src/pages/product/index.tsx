import Taro, { useRouter } from '@tarojs/taro'
import { Button, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Boutique, Member, Product, Reservation } from '@shantung/shared-types'
import { api, ApiError, useData, useLang } from '../../services/api'
import { price, t, TIERS, when, windowLine } from '../../services/i18n'
import { store } from '../../services/store'
import { theme } from '../../theme'
import { ReleaseWindows } from '../../components/ReleaseWindows'
import { BoutiquePicker, Icon, Notice, Paragraphs, Photo, TopBar, StatusCover, chromeStyle, usePopup } from '../../components/ui'

export default function ProductPage() {
  useLang()
  const s = t()
  const { id } = useRouter().params
  const product = useData<Product>(`/api/products/${id}`)
  const boutiques = useData<Boutique[]>('/api/boutiques')
  const wishlist = useData<string[]>('/api/wishlist')
  const mine = useData<Reservation[]>('/api/me/reservations')
  const { popup, show } = usePopup()
  const [shop, setShop] = useState('')
  const [busy, setBusy] = useState(false)
  const rank = store.get<Member>('member')?.tierRank ?? 1
  const p = product.data

  useEffect(() => {
    if (p) Taro.setNavigationBarTitle({ title: p.title })
  }, [p?.title])
  useEffect(() => {
    if (!shop && boutiques.data?.[0]) setShop(boutiques.data[0].code)
  }, [boutiques.data])

  if (!p) return <View className='ds' style={chromeStyle()}>{product.error && <Notice text={s.error} tone='danger' />}</View>

  const myOpens = p.limited?.windows.find((w) => w.tierRank === rank)?.opensAt
  const closed = Boolean(myOpens && Date.parse(myOpens) > Date.now())
  const soldOut = p.limited?.remaining === 0
  const saved = wishlist.data?.includes(p.id)
  const held = mine.data?.find((r) => r.itemId === p.id && (r.kind === 'limited' || r.kind === 'try'))
  const shopName = (code: string) => boutiques.data?.find((b) => b.code === code)?.title ?? code

  const reserve = async () => {
    if (held) return show({ title: s.alreadyTitle, text: s.alreadyPiece(shopName(held.boutique)) })
    // The button already says why it is unavailable; tapping it does nothing more.
    if (closed || soldOut || !shop || busy) return
    setBusy(true)
    try {
      await api('POST', `/api/products/${p.id}/reserve`, { boutique: shop })
      show({ title: s.reservedTitle, text: (p.limited ? s.reservedText : s.tryText)(shopName(shop)) })
      product.reload()
    } catch (e) {
      const status = e instanceof ApiError ? e.status : 0
      show(status === 409 ? { title: e instanceof ApiError && e.message === 'Nothing left' ? s.fullTitle : s.alreadyTitle } : { title: s.errorTitle, text: s.error })
    } finally {
      setBusy(false)
      mine.reload()
    }
  }

  const save = async () => {
    await api('PUT', `/api/wishlist/${p.id}`, { title: p.title }).catch(() => {})
    wishlist.reload()
  }

  return (
    <View className='ds' style={chromeStyle()}>
      <StatusCover />
      <TopBar />
      <Swiper indicatorDots={p.images.length > 1} indicatorActiveColor={theme.accent} style={{ height: '125vw' }}>
        {p.images.map((img) => (
          <SwiperItem key={img.url}>
            <Photo image={img} ratio={125} packshot={img === p.images[0]} />
          </SwiperItem>
        ))}
      </Swiper>

      <View className='section stack'>
        {p.limited && <Text className='t-label t-label--accent'>{s.limitedRelease}</Text>}
        <Text className='t-name'>{p.title}</Text>
        <Text className='t-muted'>{p.subtitle}</Text>
        <Text className='t-sub'>{price(p.price)}</Text>
      </View>

      <View className='section'>
        <Paragraphs text={p.text} />
      </View>

      {p.limited && <ReleaseWindows release={p.limited} rank={rank} />}

      <View className='section stack'>
        <Text className='t-label'>{s.pickBoutique}</Text>
        <BoutiquePicker boutiques={boutiques.data ?? []} value={shop} onChange={setShop} />
        <View className='spacer-sm' />
        <Button
          className={`btn ${held ? 'btn--ghost' : ''} ${!held && (busy || !shop || closed || soldOut) ? 'is-disabled' : ''}`}
          hoverClass='is-pressed'
          disabled={!held && (busy || !shop || closed || soldOut)}
          onClick={reserve}
        >
          {held && <Icon name='check' />}
          {/* A bare text node beside the icon is dropped by Taro's browser build: keep the label in Text. */}
          <Text>{held ? s.reservedState : soldOut ? s.full : closed ? s.notYet : p.limited ? s.reserve : s.reserveTry}</Text>
        </Button>
        <View className='btn-text' hoverClass='is-pressed' ariaRole='button' onClick={save}>
          {saved ? s.saved : `${s.saveWishlist} →`}
        </View>
      </View>
      <View className='spacer' />
      {popup}
    </View>
  )
}
