import Taro, { useRouter } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useEffect } from 'react'
import type { Story } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { t } from '../../services/i18n'
import { Notice, Paragraphs, Photo, useReveal } from '../../components/ui'

export default function StoryPage() {
  useLang()
  const { id } = useRouter().params
  const story = useData<Story>(`/api/stories/${id}`)
  const reveal = useReveal(story.data)
  const st = story.data

  useEffect(() => {
    if (st) Taro.setNavigationBarTitle({ title: st.title })
  }, [st?.title])

  if (!st) return <View className='ds'>{story.error && <Notice text={t().error} tone='danger' />}</View>

  return (
    <View className='ds'>
      <Photo image={st.image} ratio={118} />
      <View className='page-head'>
        <View>
          <Text className='t-display'>{st.title}</Text>
          <Text className='t-sub'>{st.subtitle}</Text>
        </View>
      </View>
      <View className='wrap'>
        <Paragraphs text={st.text} />
      </View>
      <View className='section stagger'>
        {st.gallery.map((img, i) => (
          <View key={img.url} id={`g-${i}`} className={`${['', 'stagger__item--left', 'stagger__item--right'][i % 3]} ${reveal(`g-${i}`)}`}>
            <Photo image={img} ratio={i % 3 === 0 ? 66 : 125} />
          </View>
        ))}
      </View>
      <View className='spacer' />
    </View>
  )
}
