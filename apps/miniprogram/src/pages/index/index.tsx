import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import type { Health } from '@shantung/shared-types'

export default function Index() {
  const [health, setHealth] = useState('loading…')

  useLoad(() => {
    Taro.request<Health>({ url: `${process.env.TARO_APP_BFF_URL}/health` }).then(
      (res) => setHealth(JSON.stringify(res.data)),
      (err) => setHealth(`BFF unreachable: ${err.errMsg ?? err}`),
    )
  })

  return (
    <View>
      <Text>Shantung · {process.env.TARO_ENV}</Text>
      <View>
        <Text>{health}</Text>
      </View>
    </View>
  )
}
