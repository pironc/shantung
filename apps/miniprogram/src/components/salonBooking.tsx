import { Text, View } from '@tarojs/components'
import { useState } from 'react'
import type { Member, Reservation, Salon } from '@shantung/shared-types'
import { api, ApiError, useData } from '../services/api'
import { t, tierName, when } from '../services/i18n'
import { store } from '../services/store'
import { go, Icon, usePopup } from './ui'

export type SeatState = 'reserved' | 'locked' | 'full' | 'past' | 'open'

/** One place for a salon seat's state and what tapping it does: book, or explain why not in a pop-up. */
export function useSalonBooking() {
  const s = t()
  const rank = store.get<Member>('member')?.tierRank ?? 1
  const mine = useData<Reservation[]>('/api/me/reservations')
  const { popup, show } = usePopup()
  const [busy, setBusy] = useState('')

  const state = (x: Salon): SeatState =>
    mine.data?.some((r) => r.kind === 'salon' && r.itemId === x.id)
      ? 'reserved'
      : Date.parse(x.date) < Date.now()
        ? 'past'
        : rank < x.minTierRank
          ? 'locked'
          : x.seatsLeft === 0
            ? 'full'
            : 'open'

  const label = (x: Salon) =>
    ({ reserved: s.reservedState, past: s.passed, locked: s.membersOnly(tierName(x.minTierRank)), full: s.full, open: s.reserveSeat })[state(x)]

  const act = async (x: Salon, after?: () => void) => {
    const place = x.boutique?.title ?? ''
    switch (state(x)) {
      case 'reserved':
        return show({ title: s.alreadyTitle, text: s.alreadySeat(when(x.date), place) })
      case 'locked':
        return show({ title: s.byInvitationTitle(tierName(x.minTierRank)), text: s.byInvitationText, action: { label: s.seeTiers, run: () => go('/pages/membership/index') } })
      case 'open':
        break
      default:
        return // full or passed: the label already says so
    }
    if (busy) return
    setBusy(x.id)
    try {
      await api('POST', `/api/salons/${x.id}/book`)
      show({ title: s.bookedTitle, text: s.bookedText(when(x.date), place) })
    } catch (e) {
      const full = e instanceof ApiError && e.message === 'Nothing left'
      show(e instanceof ApiError && e.status === 409 ? { title: full ? s.fullTitle : s.alreadyTitle } : { title: s.errorTitle, text: s.error })
    } finally {
      setBusy('')
      mine.reload()
      after?.()
    }
  }

  return { state, label, act, popup, busy, reload: mine.reload }
}

const ICON: Partial<Record<SeatState, 'check' | 'lock'>> = { reserved: 'check', locked: 'lock' }

/** The compact action at the end of a salon row: a red text link when open, a quiet state otherwise. */
export function SeatAction({ salon, booking }: { salon: Salon; booking: ReturnType<typeof useSalonBooking> }) {
  const st = booking.state(salon)
  const icon = ICON[st]
  return (
    <View
      className={`seat-action seat-action--${st}`}
      hoverClass='is-pressed'
      ariaRole='button'
      onClick={(e) => {
        e.stopPropagation()
        booking.act(salon)
      }}
    >
      {icon && <Icon name={icon} />}
      <Text>
        {booking.label(salon)}
        {st === 'open' ? ' →' : ''}
      </Text>
    </View>
  )
}
