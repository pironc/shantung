import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { Button, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Boutique } from '@shantung/shared-types'
import { api, ApiError, useData, useLang } from '../../services/api'
import { t, when } from '../../services/i18n'
import { usePageEnter, usePopup } from '../../components/ui'

/** The next seven days in boutique time (Shanghai, UTC+8), as YYYY-MM-DD. */
const days = () =>
  Array.from({ length: 7 }, (_, i) => new Date(Date.now() + 8 * 3_600_000 + (i + 1) * 86_400_000).toISOString().slice(0, 10))

export default function Appointment() {
  useLang()
  const s = t()
  const enter = usePageEnter()
  const boutiques = useData<Boutique[]>('/api/boutiques')
  // Arriving from a boutique's page preselects it.
  const [shop, setShop] = useState(useRouter().params.b ?? '')
  const { popup, show } = usePopup()
  const [day, setDay] = useState(days()[0])
  const [slot, setSlot] = useState('')
  const [busy, setBusy] = useState(false)
  const slots = useData<{ at: string; free: boolean }[]>(shop ? `/api/boutiques/${shop}/slots?date=${day}` : null)
  useDidShow(() => Taro.setNavigationBarTitle({ title: s.appointment }))
  useEffect(() => {
    if (!shop && boutiques.data?.[0]) setShop(boutiques.data[0].code)
  }, [boutiques.data])

  const confirm = async () => {
    setBusy(true)
    try {
      await api('POST', '/api/appointments', { boutique: shop, at: slot })
      const shopName = boutiques.data?.find((b) => b.code === shop)?.title ?? shop
      show({ title: s.appointmentTitle, text: `${when(slot)}, ${shopName}. ${s.appointmentDone}` })
    } catch (e) {
      show(e instanceof ApiError && e.status === 409 ? { title: s.slotTaken } : { title: s.errorTitle, text: s.error })
    } finally {
      setSlot('')
      setBusy(false)
      slots.reload()
    }
  }

  return (
    <View className={`ds ${enter}`}>
      <View className='page-head'>
        <View>
          <Text className='t-display'>{s.appointment}</Text>
          <Text className='t-sub'>{s.bookAppointment}</Text>
        </View>
      </View>
      <View className='wrap stack'>
        <Text className='t-label'>{s.pickBoutique}</Text>
        <View className='chips'>
          {(boutiques.data ?? []).map((b) => (
            <Text key={b.code} className={`chip ${shop === b.code ? 'is-active' : ''}`} ariaRole='radio' ariaChecked={shop === b.code} onClick={() => (setShop(b.code), setSlot(''))}>
              {b.city}
            </Text>
          ))}
        </View>
      </View>
      <View className='section stack'>
        <Text className='t-label'>{s.pickDay}</Text>
        <View className='chips'>
          {days().map((d) => (
            <Text key={d} className={`chip ${day === d ? 'is-active' : ''}`} ariaRole='radio' ariaChecked={day === d} onClick={() => (setDay(d), setSlot(''))}>
              {when(`${d}T00:00:00+08:00`, false)}
            </Text>
          ))}
        </View>
      </View>
      <View className='section stack'>
        <Text className='t-label'>{s.pickTime}</Text>
        <View className='chips'>
          {(slots.data ?? []).map((x) => (
            <Text
              key={x.at}
              className={`chip ${slot === x.at ? 'is-active' : ''} ${x.free ? '' : 'is-off'}`}
              ariaRole='radio'
              ariaChecked={slot === x.at}
              onClick={() => x.free && setSlot(x.at)}
            >
              {when(x.at).split(' ').pop()}
            </Text>
          ))}
        </View>
        <Button className={`btn ${!slot || busy ? 'is-disabled' : ''}`} hoverClass='is-pressed' disabled={!slot || busy} onClick={confirm}>
          {s.confirm}
        </Button>
      </View>
      <View className='spacer' />
      {popup}
    </View>
  )
}
