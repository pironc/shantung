import Taro, { useDidShow } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useState } from 'react'
import type { Product } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { price, t } from '../../services/i18n'
import { go, Notice, Photo, useReveal } from '../../components/ui'

export default function Collection() {
  useLang()
  const s = t()
  const products = useData<Product[]>('/api/products')
  const [category, setCategory] = useState('')
  const reveal = useReveal(products.data)
  useDidShow(() => Taro.setNavigationBarTitle({ title: s.collection }))

  const categories = [...new Set((products.data ?? []).map((p) => p.category))]
  const shown = (products.data ?? []).filter((p) => !category || p.category === category)

  return (
    <View className='ds'>
      <View className='page-head'>
        <View>
          <Text className='t-display'>{s.collection}</Text>
          <Text className='t-sub'>Shantung</Text>
        </View>
      </View>
      <View className='tabs' ariaRole='tablist'>
        {['', ...categories].map((c) => (
          <Text
            key={c || 'all'}
            className={`tabs__item ${category === c ? 'is-active' : ''}`}
            ariaRole='tab'
            ariaSelected={category === c}
            onClick={() => setCategory(c)}
          >
            {c || s.all}
          </Text>
        ))}
      </View>
      <View className='wrap'>
        <Notice text={products.offline ? s.offline : products.error && s.error} />
      </View>
      <View className='section'>
        <View className='grid'>
          {shown.map((p) => (
            <View key={p.id} id={`p-${p.id}`} className={`stack ${reveal(`p-${p.id}`)} reveal--quick`} onClick={() => go(`/pages/product/index?id=${p.id}`)}>
              <Photo image={p.images[0]} ratio={125} />
              {p.limited && <Text className='t-label t-label--accent'>{s.limited}</Text>}
              <Text className='t-sub'>{p.title}</Text>
              <Text className='t-small t-muted'>{p.subtitle}</Text>
              <Text className='t-small'>{price(p.price)}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className='spacer' />
    </View>
  )
}
