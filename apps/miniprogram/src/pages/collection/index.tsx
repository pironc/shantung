import Taro, { useDidShow } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useState } from 'react'
import type { Product } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { price, t } from '../../services/i18n'
import { Notice, Photo, chromeStyle, go, usePageEnter, useReveal } from '../../components/ui'

export default function Collection() {
  useLang()
  const s = t()
  const enter = usePageEnter()
  const products = useData<Product[]>('/api/products')
  const [category, setCategory] = useState('')
  const [swaps, setSwaps] = useState(0)
  const reveal = useReveal(products.data)
  useDidShow(() => Taro.setNavigationBarTitle({ title: s.collection }))

  const categories = [...new Set((products.data ?? []).map((p) => p.category))]

  return (
    <View className={`ds ${enter}`} style={chromeStyle()}>
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
            onClick={() => {
              if (c === category) return
              setCategory(c)
              setSwaps((n) => n + 1)
            }}
          >
            {c || s.all}
          </Text>
        ))}
      </View>
      <View className='wrap'>
        <Notice text={products.offline ? s.offline : products.error && s.error} />
      </View>
      <View className='section'>
        {/* Every card stays mounted and a tab only hides the others: loaded photos never reload and blink,
            and the reveal observer, which watches the cards present on load, still sees them all. */}
        <View className={`grid ${swaps ? (swaps % 2 ? 'swap-a' : 'swap-b') : ''}`}>
          {(products.data ?? []).map((p) => (
            <View
              key={p.id}
              id={`p-${p.id}`}
              className={`stack ${reveal(`p-${p.id}`)} reveal--quick ${category && p.category !== category ? 'is-hidden' : ''}`}
              onClick={() => go(`/pages/product/index?id=${p.id}`)}>
              <Photo image={p.images[0]} ratio={125}>
                {p.limited && <Text className='photo__tag'>{s.limited}</Text>}
              </Photo>
              <Text className='t-sub card-title'>{p.title}</Text>
              {/* Material only ("Kesi-woven silk"); the size stays on the product page. */}
              <Text className='t-small t-muted card-line'>{p.subtitle.split(/[,，]/)[0]}</Text>
              <Text className='t-small'>{price(p.price)}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className='spacer' />
    </View>
  )
}
