import Taro, { useRouter } from '@tarojs/taro'
import { Button, Text, View } from '@tarojs/components'
import { useEffect } from 'react'
import type { Boutique, Salon } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { t } from '../../services/i18n'
import { useSalonBooking } from '../../components/salonBooking'
import { AddressFact, Icon, InfoStrip, Notice, Paragraphs, Photo, TopBar, chromeStyle, usePageEnter } from '../../components/ui'

/** One salon in full: the story, then the practical facts, then one action. */
export default function SalonPage() {
  useLang()
  const s = t()
  const enter = usePageEnter()
  const { id } = useRouter().params
  const salon = useData<Salon>(`/api/salons/${id}`)
  const boutiques = useData<Boutique[]>('/api/boutiques')
  const booking = useSalonBooking()
  const x = salon.data
  useEffect(() => {
    if (x) Taro.setNavigationBarTitle({ title: x.title })
  }, [x?.title])

  if (!x) return <View className={`ds ${enter}`} style={chromeStyle()}>{salon.error && <Notice text={s.error} tone='danger' />}</View>

  const shop = boutiques.data?.find((b) => b.code === x.boutique?.code)
  const st = booking.state(x)
  // Locked, full or passed: a greyed button that does nothing (the label says why).
  const quiet = st === 'full' || st === 'past' || st === 'locked'

  return (
    <View className={`ds ${enter}`} style={chromeStyle()}>
      <TopBar />
      <Photo image={x.image} ratio={100} />
      <InfoStrip iso={x.date} place={x.boutique} />
      <View className='section stack'>
        <Text className='t-name'>{x.title}</Text>
        <Text className='t-muted'>{x.subtitle}</Text>
      </View>
      <View className='section'>
        <Paragraphs text={x.text} />
      </View>
      <View className='section'>
        <Text className='t-title'>{s.practical}</Text>
        <View className='facts'>
          {shop && <AddressFact boutique={shop} label={s.address} />}
          {shop && (
            <View className='fact'>
              <Text className='t-label'>{s.hours}</Text>
              <Text>{shop.hours}</Text>
            </View>
          )}
          <View className='fact'>
            <Text className='t-label'>{s.seatsLabel}</Text>
            <Text>{s.seatsLeft(x.seatsLeft, x.seats)}</Text>
          </View>
        </View>
      </View>
      <View className='section'>
        <Button className={`btn ${st === 'reserved' ? 'btn--ghost' : ''} ${quiet ? 'is-disabled' : ''}`} hoverClass='is-pressed' disabled={quiet || booking.busy === x.id} onClick={() => booking.act(x, salon.reload)}>
          {st === 'reserved' && <Icon name='check' />}
          {st === 'locked' && <Icon name='lock' muted />}
          <Text>{booking.label(x)}</Text>
        </Button>
      </View>
      <View className='spacer' />
      {booking.popup}
    </View>
  )
}
