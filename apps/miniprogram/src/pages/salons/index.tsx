import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Text, View } from '@tarojs/components'
import { useState } from 'react'
import type { Member, Salon } from '@shantung/shared-types'
import { api, ApiError, useData, useLang } from '../../services/api'
import { t, TIERS } from '../../services/i18n'
import { store } from '../../services/store'
import { DateStrip, Notice, Paragraphs, Photo, usePageEnter, useReveal } from '../../components/ui'

export default function Salons() {
  useLang()
  const s = t()
  const enter = usePageEnter()
  const salons = useData<Salon[]>('/api/salons')
  const [busy, setBusy] = useState('')
  const [messages, setMessages] = useState<Record<string, { text: string; tone: 'accent' | 'danger' }>>({})
  const rank = store.get<Member>('member')?.tierRank ?? 1
  const reveal = useReveal(salons.data)
  useDidShow(() => {
    Taro.setNavigationBarTitle({ title: s.salons })
    salons.reload() // seats change while the tab sits in the background
  })

  const book = async (salon: Salon) => {
    // A disabled button already says why (invitation tier, full, passed); tapping it does nothing more.
    if (rank < salon.minTierRank || salon.seatsLeft === 0 || Date.parse(salon.date) < Date.now() || busy) return
    setBusy(salon.id)
    try {
      await api('POST', `/api/salons/${salon.id}/book`)
      setMessages((m) => ({ ...m, [salon.id]: { text: s.booked, tone: 'accent' } }))
      salons.reload()
    } catch (e) {
      const status = e instanceof ApiError ? e.status : 0
      setMessages((m) => ({ ...m, [salon.id]: { text: status === 409 ? s.already : status === 403 ? s.notYet : s.error, tone: 'danger' } }))
    } finally {
      setBusy('')
    }
  }

  return (
    <View className={`ds ${enter}`}>
      <View className='page-head'>
        <View>
          <Text className='t-display'>{s.privateSalons}</Text>
          <Text className='t-sub'>Shantung</Text>
        </View>
      </View>
      <View className='wrap'>
        <Notice text={salons.offline ? s.offline : salons.error && s.error} />
      </View>
      {(salons.data ?? []).map((salon) => {
        const invited = rank >= salon.minTierRank
        const past = Date.parse(salon.date) < Date.now()
        const full = salon.seatsLeft === 0
        const label = past ? s.passed : full ? s.full : !invited ? `${s.invitedFrom} ${TIERS[salon.minTierRank].zh} ${TIERS[salon.minTierRank].en}` : s.reserveSeat
        return (
          <View key={salon.id} id={`salon-${salon.id}`} className={`section ${reveal(`salon-${salon.id}`)}`}>
            <Photo image={salon.image} ratio={66} />
            <DateStrip iso={salon.date} />
            <View className='stack salon__body'>
              <Text className='t-label t-label--accent'>{salon.boutique?.title}</Text>
              <Text className='t-name'>{salon.title}</Text>
              <Text className='t-muted'>{salon.subtitle}</Text>
              <Paragraphs text={salon.text} />
              <View className='split-row t-label'>
                <Text>{s.seatsLeft(salon.seatsLeft, salon.seats)}</Text>
                <Text>
                  {s.invitedFrom} {TIERS[salon.minTierRank].en}
                </Text>
              </View>
              <Button className={`btn ${!invited || past || full || busy === salon.id ? 'is-disabled' : ''}`} hoverClass='is-pressed' disabled={!invited || past || full || busy === salon.id} onClick={() => book(salon)}>
                {label}
              </Button>
              <Notice text={messages[salon.id]?.text} tone={messages[salon.id]?.tone} />
            </View>
          </View>
        )
      })}
      <View className='spacer' />
    </View>
  )
}
