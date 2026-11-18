import { Text, View } from '@tarojs/components'
import { useState } from 'react'
import { t } from '../services/i18n'
import { Icon } from './ui'

/** YYYY-MM-DD in boutique time (Shanghai, UTC+8), `offset` days from today. */
export const shanghaiDay = (offset = 0) => new Date(Date.now() + 8 * 3_600_000 + offset * 86_400_000).toISOString().slice(0, 10)

const iso = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10)

/**
 * A month calendar (weeks start on Monday). Days outside [min, max] are shown but not selectable.
 * Dates are plain YYYY-MM-DD strings, so no time zone can shift a day.
 */
export function Calendar({ value, onChange, min, max }: { value: string; onChange: (day: string) => void; min: string; max: string }) {
  const s = t()
  const [month, setMonth] = useState(() => ({ y: +value.slice(0, 4), m: +value.slice(5, 7) - 1 }))
  const first = new Date(Date.UTC(month.y, month.m, 1))
  const lead = (first.getUTCDay() + 6) % 7 // Monday first
  const days = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => iso(month.y, month.m, i + 1))]
  const shift = (n: number) => setMonth(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }))
  const canBack = iso(month.y, month.m, 1) > min.slice(0, 8) + '01'
  const canForward = iso(month.y, month.m + 1, 1) <= max

  return (
    <View className='calendar'>
      <View className='calendar__head'>
        <View className={`calendar__nav ${canBack ? '' : 'is-off'}`} hoverClass='is-pressed' ariaRole='button' ariaLabel={s.prevMonth} onClick={() => canBack && shift(-1)}>
          <Icon name='back' />
        </View>
        <Text className='t-sub'>{s.monthTitle(month.y, month.m)}</Text>
        <View className={`calendar__nav ${canForward ? '' : 'is-off'}`} hoverClass='is-pressed' ariaRole='button' ariaLabel={s.nextMonth} onClick={() => canForward && shift(1)}>
          <Icon name='chevron' />
        </View>
      </View>
      <View className='calendar__grid'>
        {s.weekdays.map((w, i) => (
          <Text key={`w${i}`} className='calendar__weekday'>
            {w}
          </Text>
        ))}
        {cells.map((day, i) =>
          day ? (
            <View
              key={day}
              className={`calendar__day ${day === value ? 'is-selected' : ''} ${day < min || day > max ? 'is-off' : ''}`}
              ariaRole='radio'
              ariaChecked={day === value}
              ariaLabel={day}
              onClick={() => day >= min && day <= max && onChange(day)}
            >
              <Text>{+day.slice(8)}</Text>
            </View>
          ) : (
            <View key={`e${i}`} className='calendar__day is-empty' />
          ),
        )}
      </View>
    </View>
  )
}
