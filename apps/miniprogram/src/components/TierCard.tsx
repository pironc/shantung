import { Image, Text, View } from '@tarojs/components'
import type { Member } from '@shantung/shared-types'
import { TIERS } from '../services/i18n'
import { cardArt } from './art'
import './tier-card.css'

/**
 * The membership card, Shantung's one signature element (DESIGN.md, "Membership cards").
 * Thread: ivory warp with one looping red thread · Satin: black twill with a sheen that glides once ·
 * Brocade: red woven with medallions · Kesi: black, with the sea-and-cliff hem woven in slit tapestry.
 * The tier's character is a seal stamp, as on a scroll.
 */
export function TierCard({ member }: { member: Member }) {
  const tier = TIERS[member.tierRank]
  return (
    // key: switching tier replays the entrance and the sheen.
    <View key={member.tierRank} className={`card card--${member.tierRank}`} ariaLabel={`${tier.en} ${tier.zh} member card`}>
      <Image className='card__art' src={cardArt[member.tierRank]} mode='scaleToFill' ariaHidden />
      {member.tierRank === 2 && <View className='card__sheen' />}
      <View className='card__face'>
        <View className='card__top'>
          <Text className='card__brand'>Shantung</Text>
          <Text className='card__seal'>{tier.zh}</Text>
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
