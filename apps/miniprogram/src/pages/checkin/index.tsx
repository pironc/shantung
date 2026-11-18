import { useRouter } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Boutique } from '@shantung/shared-types'
import { api, useData, useLang } from '../../services/api'
import { t } from '../../services/i18n'
import { go, usePageEnter } from '../../components/ui'

/**
 * Opened by scanning the boutique's entrance screen. In WeChat the code would be a Mini Program code
 * carrying the same two values (boutique `b`, five-minute token `t`) in its `scene`.
 */
export default function CheckIn() {
  useLang()
  const s = t()
  const enter = usePageEnter()
  const { b = '', t: token = '' } = useRouter().params
  const boutiques = useData<Boutique[]>('/api/boutiques')
  const [state, setState] = useState<'pending' | 'done' | 'expired'>('pending')
  const shop = boutiques.data?.find((x) => x.code === b)

  useEffect(() => {
    api('POST', '/api/checkin', { boutique: b, token }).then(
      () => setState('done'),
      () => setState('expired'),
    )
  }, [b, token])

  return (
    <View className={`ds checkin ${enter}`}>
      <Text className='t-label t-label--accent'>Shantung</Text>
      <Text className='t-display'>{s.welcome}</Text>
      {shop && <Text className='t-sub'>{shop.title}</Text>}
      <Text className='checkin__line' ariaRole='status'>
        {state === 'pending' ? s.checkingIn : state === 'done' ? s.checkedIn : s.expired}
      </Text>
      {state === 'done' && (
        <View className='btn-text' hoverClass='is-pressed' ariaRole='button' onClick={() => go('/pages/membership/index')}>
          {s.cardTitle} →
        </View>
      )}
    </View>
  )
}
