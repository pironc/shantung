// Types only: consumers use `import type`, so nothing here exists at runtime and no build step is needed.

export type Lang = 'en' | 'zh-hans'

export interface Health {
  status: 'ok'
  redis: boolean
  cms: boolean
}

export interface Image {
  url: string
  alt: string
  width: number
  height: number
}

/** Membership tier. rank 1 = Thread … 4 = Kesi (by invitation). */
export interface Tier {
  id: string
  rank: number
  name: string
  hanzi: string
  threshold: number
  invitationOnly: boolean
  description: string
}

export interface LimitedRelease {
  pieces: number
  remaining: number
  releaseAt: string
  /** One window per tier: Kesi opens at releaseAt, each lower tier one day later. */
  windows: { tierRank: number; opensAt: string }[]
}

export interface Product {
  id: string
  sku: string
  title: string
  subtitle: string
  text: string
  price: number
  category: string
  images: Image[]
  limited: LimitedRelease | null
}

export interface Boutique {
  id: string
  code: string
  title: string
  city: string
  address: string
  hours: string
  text: string
  image: Image | null
}

export interface Salon {
  id: string
  title: string
  subtitle: string
  text: string
  date: string
  boutique: Pick<Boutique, 'id' | 'code' | 'title' | 'city'> | null
  seats: number
  seatsLeft: number
  minTierRank: number
  image: Image | null
}

export interface Story {
  id: string
  title: string
  subtitle: string
  text: string
  image: Image | null
  gallery: Image[]
}

export interface Member {
  unionid: string
  memberNo: string
  nickname: string
  avatarUrl: string
  tierRank: number
  since: string
}

export type ReservationKind = 'limited' | 'try' | 'salon' | 'appointment'

export interface Reservation {
  id: number
  kind: ReservationKind
  itemId: string
  title: string
  boutique: string
  at: string | null
  createdAt: string
}

export type FeedEventType = 'reservation' | 'booking' | 'appointment' | 'arrival' | 'wishlist'

/** What a boutique advisor sees, and what the WeCom-style webhook carries. */
export interface FeedEvent {
  id: number
  type: FeedEventType
  at: string
  member: Pick<Member, 'unionid' | 'nickname' | 'avatarUrl' | 'tierRank' | 'memberNo'>
  title: string
  detail: string
  boutique: string
}

export interface ClientProfile {
  member: Member
  reservations: Reservation[]
  wishlist: string[]
}
