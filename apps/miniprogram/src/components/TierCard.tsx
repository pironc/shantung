import { Image, Text, View } from '@tarojs/components'
import type { Member } from '@shantung/shared-types'
import { TIERS } from '../services/i18n'
import './tier-card.css'

/**
 * The membership card, Shantung's one signature element (DESIGN.md, "Membership cards").
 * Thread: white with one red thread · Satin: black with a sheen that glides once · Brocade: red woven lattice ·
 * Kesi: black with red and white blocks parted by hairline slits.
 */
export function TierCard({ member }: { member: Member }) {
  const tier = TIERS[member.tierRank]
  return (
    // key: switching tier replays the entrance and the sheen.
    <View key={member.tierRank} className={`card card--${member.tierRank}`} ariaLabel={`${tier.en} ${tier.zh} member card`}>
      <View className='card__weave' />
      <View className='card__face'>
        <View className='card__top'>
          <Text className='card__brand'>Shantung</Text>
          <Text className='card__hanzi'>{tier.zh}</Text>
        </View>
        <View className='card__bottom'>
          <View className='card__holder'>
            {member.avatarUrl ? <Image className='card__avatar' src={member.avatarUrl} mode='aspectFill' /> : <View className='card__avatar' />}
            <View className='card__who'>
              <Text className='card__name'>{member.nickname || ' '}</Text>
              <Text className='card__no'>{member.memberNo}</Text>
            </View>
          </View>
          <Text className='card__tier'>{tier.en}</Text>
        </View>
      </View>
    </View>
  )
}
