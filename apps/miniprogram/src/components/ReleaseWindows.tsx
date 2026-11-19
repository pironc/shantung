import { Text, View } from '@tarojs/components'
import type { LimitedRelease } from '@shantung/shared-types'
import { day, t, TIERS } from '../services/i18n'

/** Each tier's window, Kesi (4) first, with whether it is open yet. */
const steps = (release: LimitedRelease) =>
  [...release.windows].sort((a, b) => b.tierRank - a.tierRank).map((w) => ({ ...w, open: Date.parse(w.opensAt) <= Date.now() }))

/**
 * The release windows as a four-step line, Kesi to Thread: open steps are filled, yours is marked, with your date
 * and what is left above it (the owner chose this one, option A, over a compact line and a countdown).
 */
export function ReleaseWindows({ release, rank }: { release: LimitedRelease; rank: number }) {
  const s = t()
  const mine = release.windows.find((w) => w.tierRank === rank)!
  const open = Date.parse(mine.opensAt) <= Date.now()
  return (
    <View className='section'>
      <View className='band stack'>
        <View className='split-row t-label'>
          <Text>{s.yourWindow}</Text>
          <Text>{s.piecesLeft(release.remaining, release.pieces)}</Text>
        </View>
        <Text className='t-title'>{open ? s.windowIsOpen : day(mine.opensAt)}</Text>
        <View className='timeline'>
          {steps(release).map((w) => (
            <View key={w.tierRank} className={`timeline__step ${w.open ? 'is-open' : ''} ${w.tierRank === rank ? 'is-mine' : ''}`}>
              <View className='timeline__dot' />
              <Text className='timeline__tier'>{TIERS[w.tierRank].zh}</Text>
              <Text className='timeline__date'>{day(w.opensAt).replace(/^\S+\s/, '')}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
