import Taro, { useRouter } from '@tarojs/taro'
import { Button, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Boutique, Member, Product } from '@shantung/shared-types'
import { api, ApiError, useData, useLang } from '../../services/api'
import { price, t, TIERS, when, windowLine } from '../../services/i18n'
import { store } from '../../services/store'
import { theme } from '../../theme'
import { Notice, Paragraphs, Photo } from '../../components/ui'

export default function ProductPage() {
  useLang()
  const s = t()
  const { id } = useRouter().params
  const product = useData<Product>(`/api/products/${id}`)
  const boutiques = useData<Boutique[]>('/api/boutiques')
  const wishlist = useData<string[]>('/api/wishlist')
  const [shop, setShop] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ text: string; tone: 'accent' | 'danger' } | null>(null)
  const rank = store.get<Member>('member')?.tierRank ?? 1
  const p = product.data

  useEffect(() => {
    if (p) Taro.setNavigationBarTitle({ title: p.title })
  }, [p?.title])
  useEffect(() => {
    if (!shop && boutiques.data?.[0]) setShop(boutiques.data[0].code)
  }, [boutiques.data])

  if (!p) return <View className='ds'>{product.error && <Notice text={s.error} tone='danger' />}</View>

  const myOpens = p.limited?.windows.find((w) => w.tierRank === rank)?.opensAt
  const closed = Boolean(myOpens && Date.parse(myOpens) > Date.now())
  const soldOut = p.limited?.remaining === 0
  const saved = wishlist.data?.includes(p.id)

  const reserve = async () => {
    setBusy(true)
    setMessage(null)
    try {
      await api('POST', `/api/products/${p.id}/reserve`, { boutique: shop })
      setMessage({ text: s.reserved, tone: 'accent' })
      product.reload()
    } catch (e) {
      const status = e instanceof ApiError ? e.status : 0
      setMessage({ text: status === 409 ? (soldOut ? s.full : s.already) : status === 403 ? s.notYet : s.error, tone: 'danger' })
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    await api('PUT', `/api/wishlist/${p.id}`, { title: p.title }).catch(() => {})
    wishlist.reload()
  }

  return (
    <View className='ds'>
      <Swiper indicatorDots={p.images.length > 1} indicatorActiveColor={theme.accent} style={{ height: '125vw' }}>
        {p.images.map((img) => (
          <SwiperItem key={img.url}>
            <Photo image={img} ratio={125} />
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

      {p.limited && (
        <View className='section'>
          <View className='band stack'>
            <Text className='t-label'>
              {s.pieces(p.limited.pieces)} · {s.left(p.limited.remaining)}
            </Text>
            <Text className='t-title'>{windowLine(p, rank)}</Text>
            <Text className='t-label'>{s.windows}</Text>
            {p.limited.windows.map((w) => (
              <View key={w.tierRank} className={`windows__row ${w.tierRank === rank ? 'is-mine' : ''}`}>
                <Text>
                  {TIERS[w.tierRank].zh} {TIERS[w.tierRank].en}
                </Text>
                <Text>{when(w.opensAt)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className='section stack'>
        <Text className='t-label'>{s.pickBoutique}</Text>
        <View className='chips'>
          {(boutiques.data ?? []).map((b) => (
            <Text key={b.code} className={`chip ${shop === b.code ? 'is-active' : ''}`} ariaRole='radio' ariaChecked={shop === b.code} onClick={() => setShop(b.code)}>
              {b.city}
            </Text>
          ))}
        </View>
        <View className='spacer-sm' />
        <Button className='btn' hoverClass='is-pressed' disabled={busy || !shop || closed || soldOut} onClick={reserve}>
          {soldOut ? s.full : closed ? s.notYet : p.limited ? s.reserve : s.reserveTry}
        </Button>
        <Notice text={message?.text} tone={message?.tone} />
        <View className='btn-text' hoverClass='is-pressed' ariaRole='button' onClick={save}>
          {saved ? s.saved : `${s.saveWishlist} →`}
        </View>
      </View>
      <View className='spacer' />
    </View>
  )
}
