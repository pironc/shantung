import { Image, Text, View } from '@tarojs/components'
import type { Member } from '@shantung/shared-types'
import { TIERS } from '../services/i18n'
import { cardArt } from './art'
import './tier-card.css'

/** The client's photo, or a monogram in a fine ring: their initial, or the maison's S until they give a name. */
export function Monogram({ member, className = '' }: { member: Member; className?: string }) {
  return member.avatarUrl ? (
    <Image className={`monogram ${className}`} src={member.avatarUrl} mode='aspectFill' />
  ) : (
    <View className={`monogram monogram--empty ${className}`}>
      <Text>{(member.nickname.trim()[0] ?? 'S').toUpperCase()}</Text>
    </View>
  )
}

/**
 * The membership card, Shantung's one signature element: one quiet motif per tier (components/art.ts) and the
 * tier's character as a seal. The member number sits top left; once the client gives a name, name and number
 * move together to the bottom.
 */
export function TierCard({ member }: { member: Member }) {
  const tier = TIERS[member.tierRank]
  const named = Boolean(member.nickname.trim())
  return (
    <View key={member.tierRank} className={`card card--${member.tierRank}`} ariaLabel={`${tier.en} ${tier.zh}, ${member.memberNo}`}>
      <Image className='card__art' src={cardArt[member.tierRank]} mode='scaleToFill' ariaHidden />
      <View className='card__face'>
        <View className='card__top'>
          <Text className='card__no'>{named ? '' : member.memberNo}</Text>
          <Text className='card__seal'>{tier.zh}</Text>
        </View>
        <View className='card__bottom'>
          <View className='card__holder'>
            <Monogram member={member} className='card__avatar' />
            {named && (
              <View className='card__who'>
                <Text className='card__name'>{member.nickname}</Text>
                <Text className='card__no'>{member.memberNo}</Text>
              </View>
            )}
          </View>
          <Text className='card__tier'>{tier.en}</Text>
        </View>
      </View>
    </View>
  )
}
