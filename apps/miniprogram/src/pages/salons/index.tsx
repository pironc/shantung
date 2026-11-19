import Taro, { useDidShow } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import type { Salon } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { t } from '../../services/i18n'
import { SeatAction, useSalonBooking } from '../../components/salonBooking'
import { InfoStrip, Notice, Photo, StatusCover, chromeStyle, go, useReveal } from '../../components/ui'

/** The list stays short: photo, when and where, title, one line, seats and the action. Details are one tap away. */
export default function Salons() {
  useLang()
  const s = t()
  const salons = useData<Salon[]>('/api/salons')
  const booking = useSalonBooking()
  const reveal = useReveal(salons.data)
  useDidShow(() => {
    Taro.setNavigationBarTitle({ title: s.salons })
    salons.reload() // seats change while the tab sits in the background
    booking.reload()
  })

  return (
    <View className='ds' style={chromeStyle()}>
      <StatusCover />
      <View className='page-head'>
        <View>
          <Text className='t-display'>{s.privateSalons}</Text>
          <Text className='t-sub'>Shantung</Text>
        </View>
      </View>
      <View className='wrap'>
        <Notice text={salons.offline ? s.offline : salons.error && s.error} />
      </View>
      {(salons.data ?? []).map((salon) => (
        <View key={salon.id} id={`salon-${salon.id}`} className={`section ${reveal(`salon-${salon.id}`)}`} onClick={() => go(`/pages/salon/index?id=${salon.id}`)}>
          <Photo image={salon.image} ratio={66} />
          <InfoStrip iso={salon.date} place={salon.boutique} />
          <View className='stack salon__body'>
            <Text className='t-name'>{salon.title}</Text>
            <Text className='t-muted'>{salon.subtitle}</Text>
            <View className='split-row salon__foot'>
              <Text className='t-label'>{s.seatsLeft(salon.seatsLeft, salon.seats)}</Text>
              <SeatAction salon={salon} booking={booking} />
            </View>
          </View>
        </View>
      ))}
      <View className='spacer' />
      {booking.popup}
    </View>
  )
}
