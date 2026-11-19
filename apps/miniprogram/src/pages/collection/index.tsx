import Taro, { useDidShow } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useState } from 'react'
import type { Product } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { price, t } from '../../services/i18n'
import { Notice, Photo, StatusCover, chromeStyle, go } from '../../components/ui'

export default function Collection() {
  useLang()
  const s = t()
  const products = useData<Product[]>('/api/products')
  const [category, setCategory] = useState('')
  const [leaving, setLeaving] = useState<string | null>(null)
  useDidShow(() => Taro.setNavigationBarTitle({ title: s.collection }))

  const categories = [...new Set((products.data ?? []).map((p) => p.category))]

  return (
    <View className='ds' style={chromeStyle()}>
      <StatusCover />
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
              setLeaving(category)
              setCategory(c)
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
        {/* One grid per tab, all kept mounted: the old grid lies over the new one and dissolves, never through white. */}
        <View className='grid-stack'>
          {['', ...categories].map((c) => (
            <View
              key={c || 'all'}
              className={`grid ${c === category ? '' : c === leaving ? 'is-leaving' : 'is-off'}`}
              onAnimationEnd={c === leaving ? () => setLeaving(null) : undefined}>
              {(products.data ?? [])
                .filter((p) => !c || p.category === c)
                .map((p) => (
                  <View key={p.id} className='stack grid__item' onClick={() => go(`/pages/product/index?id=${p.id}`)}>
                    <Photo image={p.images[0]} ratio={125} packshot eager>
                      {p.limited && <Text className='photo__tag'>{s.limited}</Text>}
                    </Photo>
                    <Text className='t-sub card-title'>{p.title}</Text>
                    {/* Material only ("Kesi-woven silk"); the size stays on the product page. */}
                    <Text className='t-small t-muted card-line'>{p.subtitle.split(/[,，]/)[0]}</Text>
                    <Text className='t-small'>{price(p.price)}</Text>
                  </View>
                ))}
            </View>
          ))}
        </View>
      </View>
      <View className='spacer' />
    </View>
  )
}
