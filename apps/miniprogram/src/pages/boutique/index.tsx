import Taro, { useRouter } from '@tarojs/taro'
import { Button, Text, View } from '@tarojs/components'
import { useEffect } from 'react'
import type { Boutique } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { t } from '../../services/i18n'
import { go, InfoStrip, Paragraphs, Photo, usePageEnter } from '../../components/ui'

/** A boutique: its city's landmark, how to find it, and the way to book a visit. */
export default function BoutiquePage() {
  useLang()
  const s = t()
  const enter = usePageEnter()
  const { code } = useRouter().params
  const boutiques = useData<Boutique[]>('/api/boutiques')
  const b = boutiques.data?.find((x) => x.code === code)
  useEffect(() => {
    if (b) Taro.setNavigationBarTitle({ title: b.title })
  }, [b?.title])

  if (!b) return <View className={`ds ${enter}`} />

  return (
    <View className={`ds ${enter}`}>
      <Photo image={b.image} ratio={100} />
      <InfoStrip place={{ code: b.code, city: b.city }} />
      <View className='section stack'>
        <Text className='t-name'>{b.title}</Text>
        <Paragraphs text={b.text} />
      </View>
      <View className='section'>
        <Text className='t-title'>{s.practical}</Text>
        <View className='facts'>
          <View className='fact'>
            <Text className='t-label'>{s.address}</Text>
            <Text>{b.address}</Text>
          </View>
          <View className='fact'>
            <Text className='t-label'>{s.hours}</Text>
            <Text>{b.hours}</Text>
          </View>
        </View>
      </View>
      <View className='section'>
        <Button className='btn' hoverClass='is-pressed' onClick={() => go(`/pages/appointment/index?b=${b.code}`)}>
          {s.bookAppointment}
        </Button>
      </View>
      <View className='spacer' />
    </View>
  )
}
