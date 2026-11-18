import { Text, View } from '@tarojs/components'
import type { LimitedRelease } from '@shantung/shared-types'
import { day, t, TIERS, when } from '../services/i18n'
import { SheetFrame } from './ui'
import { useState } from 'react'

const DAY = 86_400_000

/** Each tier's window, Kesi (4) first, with whether it is open yet. */
const steps = (release: LimitedRelease) =>
  [...release.windows].sort((a, b) => b.tierRank - a.tierRank).map((w) => ({ ...w, open: Date.parse(w.opensAt) <= Date.now() }))

const Seal = ({ rank, filled }: { rank: number; filled: boolean }) => (
  <Text className={`seal ${filled ? 'seal--filled' : ''}`}>{TIERS[rank].zh}</Text>
)

/** A: a four-step line, Kesi to Thread. Open steps are filled; yours is marked. */
function Timeline({ release, rank }: { release: LimitedRelease; rank: number }) {
  const s = t()
  const mine = release.windows.find((w) => w.tierRank === rank)!
  const open = Date.parse(mine.opensAt) <= Date.now()
  return (
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
  )
}

/** B: one quiet line on white: your seal, your date, what is left. The full schedule opens in a sheet. */
function Compact({ release, rank }: { release: LimitedRelease; rank: number }) {
  const s = t()
  const [all, setAll] = useState(false)
  const mine = release.windows.find((w) => w.tierRank === rank)!
  const open = Date.parse(mine.opensAt) <= Date.now()
  return (
    <View className='compact'>
      <Seal rank={rank} filled={open} />
      <View className='compact__text'>
        <Text className='t-label'>{s.yourWindow}</Text>
        <Text className='t-sub'>{open ? s.windowIsOpen : when(mine.opensAt)}</Text>
      </View>
      <View className='compact__side'>
        <Text className='t-label'>{s.piecesLeft(release.remaining, release.pieces)}</Text>
        <Text className='btn-text' onClick={() => setAll(true)}>
          {s.allWindows}
        </Text>
      </View>
      {all && (
        <SheetFrame title={s.windows} onClose={() => setAll(false)}>
          {steps(release).map((w) => (
            <View key={w.tierRank} className={`sheet__option ${w.tierRank === rank ? 'is-selected' : ''}`}>
              <Text>
                {TIERS[w.tierRank].zh} {TIERS[w.tierRank].en}
              </Text>
              <Text>{when(w.opensAt)}</Text>
            </View>
          ))}
        </SheetFrame>
      )}
    </View>
  )
}

/** C: how long until your window, large; the four seals beneath, filled as each window opens. */
function Countdown({ release, rank }: { release: LimitedRelease; rank: number }) {
  const s = t()
  const mine = release.windows.find((w) => w.tierRank === rank)!
  const daysLeft = Math.ceil((Date.parse(mine.opensAt) - Date.now()) / DAY)
  return (
    <View className='band countdown'>
      <Text className='t-label'>{s.yourWindow}</Text>
      <Text className='countdown__value'>{daysLeft <= 0 ? s.windowIsOpen : s.daysUntil(daysLeft)}</Text>
      <View className='countdown__seals'>
        {steps(release).map((w) => (
          <Seal key={w.tierRank} rank={w.tierRank} filled={w.open} />
        ))}
      </View>
      <Text className='t-label'>{s.piecesLeft(release.remaining, release.pieces)}</Text>
    </View>
  )
}

/** Three candidate designs, stacked so the owner can compare them; the chosen one stays, the others go. */
export function ReleaseWindows({ release, rank }: { release: LimitedRelease; rank: number }) {
  const s = t()
  return (
    <View className='section stack options'>
      <Text className='t-label'>{s.option('A', 'Timeline')}</Text>
      <Timeline release={release} rank={rank} />
      <Text className='t-label options__label'>{s.option('B', 'Compact')}</Text>
      <Compact release={release} rank={rank} />
      <Text className='t-label options__label'>{s.option('C', 'Countdown')}</Text>
      <Countdown release={release} rank={rank} />
    </View>
  )
}
