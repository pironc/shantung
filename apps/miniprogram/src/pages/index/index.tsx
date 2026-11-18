import Taro, { useDidShow } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import type { Boutique, Member, Product, Salon, Story } from '@shantung/shared-types'
import { useData, useLang } from '../../services/api'
import { t, when, windowLine } from '../../services/i18n'
import { store } from '../../services/store'
import { go, LangToggle, Notice, Photo, useReveal } from '../../components/ui'

export default function Discover() {
  useLang()
  const s = t()
  const stories = useData<Story[]>('/api/stories')
  const products = useData<Product[]>('/api/products')
  const salons = useData<Salon[]>('/api/salons')
  const boutiques = useData<Boutique[]>('/api/boutiques')
  const rank = store.get<Member>('member')?.tierRank ?? 1
  const reveal = useReveal(stories.data && products.data)
  useDidShow(() => Taro.setNavigationBarTitle({ title: 'Shantung' }))

  const hero = stories.data?.find((x) => x.gallery.length > 4) ?? stories.data?.[0]
  const limited = (products.data ?? []).filter((p) => p.limited)
  const salon = salons.data?.find((x) => Date.parse(x.date) > Date.now())
  const offline = stories.offline || products.offline

  return (
    <View className='ds'>
      <View className='hero'>
        <Photo image={hero?.image} ratio={118} />
        <View className='hero__lang'>
          <LangToggle onDark />
        </View>
      </View>
      <View className='masthead'>
        <Text className='t-display'>Shantung</Text>
        <Text className='t-label'>{s.tagline}</Text>
      </View>
      <View className='wrap'>
        <Notice text={offline ? s.offline : stories.error && s.error} />
      </View>

      {limited.length > 0 && (
        <View className='section'>
          {limited.map((p) => (
            <View key={p.id} id={`l-${p.id}`} className={`feature ${reveal(`l-${p.id}`)}`} onClick={() => go(`/pages/product/index?id=${p.id}`)}>
              <Photo image={p.images[0]} ratio={100} />
              <View className='band stack'>
                <Text className='t-label'>{s.limitedRelease}</Text>
                <Text className='t-title'>{p.title}</Text>
                <Text className='t-small'>{p.subtitle}</Text>
                <Text className='t-label'>
                  {s.pieces(p.limited!.pieces)} · {s.left(p.limited!.remaining)}
                </Text>
                <Text className='t-small'>{windowLine(p, rank)}</Text>
                <View className='btn-text' hoverClass='is-pressed' ariaRole='button'>
                  {s.discoverMore} →
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {salon && (
        <View className='section'>
          <View className='section__head'>
            <Text className='t-title'>{s.privateSalons}</Text>
          </View>
          <View id='salon' className={`stack ${reveal('salon')}`} onClick={() => go('/pages/salons/index')}>
            <Photo image={salon.image} ratio={66} />
            <Text className='t-label t-label--accent'>
              {when(salon.date)} · {salon.boutique?.city}
            </Text>
            <Text className='t-name'>{salon.title}</Text>
            <Text className='t-muted'>{salon.subtitle}</Text>
            <View className='btn-text' hoverClass='is-pressed' ariaRole='button'>
              {s.reserveSeat} →
            </View>
          </View>
        </View>
      )}

      {stories.data && (
        <View className='section'>
          <View className='section__head'>
            <Text className='t-title'>{s.stories}</Text>
          </View>
          <View className='stagger'>
            {stories.data.map((story, i) => (
              <View
                key={story.id}
                id={`s-${story.id}`}
                className={`${['', 'stagger__item--left', 'stagger__item--right'][i % 3]} ${reveal(`s-${story.id}`)}`}
                onClick={() => go(`/pages/story/index?id=${story.id}`)}
              >
                <Photo image={story.image} ratio={i % 3 === 0 ? 66 : 125} />
                <View className='stagger__caption stack'>
                  <Text className='t-sub'>{story.title}</Text>
                  <Text className='t-small t-muted'>{story.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {boutiques.data && (
        <View className='section'>
          <View className='section__head'>
            <Text className='t-title'>{s.boutiques}</Text>
          </View>
          {boutiques.data.map((b) => (
            <View key={b.id} className='row stack'>
              <Text className='t-sub'>{b.city}</Text>
              <Text>{b.title}</Text>
              <Text className='t-small t-muted'>{b.address}</Text>
              <Text className='t-small t-muted'>{b.hours}</Text>
            </View>
          ))}
          <View className='btn-text' hoverClass='is-pressed' ariaRole='button' onClick={() => go('/pages/appointment/index')}>
            {s.bookAppointment} →
          </View>
        </View>
      )}
      <View className='spacer' />
    </View>
  )
}
