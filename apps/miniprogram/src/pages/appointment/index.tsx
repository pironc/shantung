import { useRouter } from '@tarojs/taro'
import { Button, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Boutique } from '@shantung/shared-types'
import { api, ApiError, useData, useLang } from '../../services/api'
import { clock, day as dayLabel, t, when } from '../../services/i18n'
import { Calendar, shanghaiDay } from '../../components/Calendar'
import { BoutiquePicker, TopBar, StatusCover, chromeStyle, usePopup } from '../../components/ui'

const BOOKABLE_DAYS = 60

/** Boutique (landmark cards), day (a month calendar), time (a grid of hours), then one line to confirm. */
export default function Appointment() {
  useLang()
  const s = t()
  const boutiques = useData<Boutique[]>('/api/boutiques')
  // Arriving from a boutique's page preselects it; otherwise the first boutique. The day starts as tomorrow.
  const [shop, setShop] = useState(useRouter().params.b ?? '')
  const [day, setDay] = useState(shanghaiDay(1))
  const [slot, setSlot] = useState('')
  const [busy, setBusy] = useState(false)
  const { popup, show } = usePopup()
  const slots = useData<{ at: string; free: boolean }[]>(shop ? `/api/boutiques/${shop}/slots?date=${day}` : null)
  useEffect(() => {
    if (!shop && boutiques.data?.[0]) setShop(boutiques.data[0].code)
  }, [boutiques.data])

  const shopName = boutiques.data?.find((b) => b.code === shop)?.title ?? ''

  const confirm = async () => {
    if (!slot || busy) return
    setBusy(true)
    try {
      await api('POST', '/api/appointments', { boutique: shop, at: slot })
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
    <View className='ds' style={chromeStyle()}>
      <StatusCover />
      <TopBar />
      <View className='page-head'>
        <View>
          <Text className='t-display'>{s.appointment}</Text>
          <Text className='t-sub'>{s.bookAppointment}</Text>
        </View>
      </View>

      <View className='wrap stack'>
        <Text className='t-label'>{s.pickBoutique}</Text>
        <BoutiquePicker boutiques={boutiques.data ?? []} value={shop} onChange={(code) => (setShop(code), setSlot(''))} />
      </View>

      <View className='section stack'>
        <Text className='t-label'>{s.pickDay}</Text>
        <Calendar value={day} min={shanghaiDay(0)} max={shanghaiDay(BOOKABLE_DAYS)} onChange={(d) => (setDay(d), setSlot(''))} />
      </View>

      <View className='section stack'>
        <Text className='t-label'>{s.pickTime}</Text>
        <View className='times'>
          {(slots.data ?? []).map((x) => (
            <View
              key={x.at}
              className={`time ${slot === x.at ? 'is-selected' : ''} ${x.free ? '' : 'is-off'}`}
              ariaRole='radio'
              ariaChecked={slot === x.at}
              onClick={() => x.free && setSlot(x.at)}
            >
              <Text>{clock(x.at)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='section stack'>
        <Text className='t-small t-muted'>{slot ? `${shopName} · ${dayLabel(slot)} · ${clock(slot)}` : `${shopName} · ${dayLabel(`${day}T12:00:00+08:00`)}`}</Text>
        <Button className={`btn ${!slot || busy ? 'is-disabled' : ''}`} hoverClass='is-pressed' disabled={!slot || busy} onClick={confirm}>
          <Text>{s.confirm}</Text>
        </Button>
      </View>
      <View className='spacer' />
      {popup}
    </View>
  )
}
