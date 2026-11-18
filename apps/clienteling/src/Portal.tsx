import { useEffect, useMemo, useState } from 'react'
import type { Boutique, ClientProfile, FeedEvent, Product } from '@shantung/shared-types'
import { api, day, time, TIERS } from './api'

const KIND: Record<FeedEvent['type'], string> = {
  reservation: 'Reservation',
  booking: 'Salon',
  appointment: 'Appointment',
  arrival: 'Arrival',
  wishlist: 'Wishlist',
}
const RESERVATION: Record<string, string> = { limited: 'Limited piece', try: 'To try', salon: 'Salon seat', appointment: 'Appointment' }

// Event details carry ISO times; advisors read boutique time.
const readable = (s: string) => s.replace(/\d{4}-\d{2}-\d{2}T[\d:.]+Z/g, day)

function Avatar({ src, label, large }: { src: string; label: string; large?: boolean }) {
  return src ? (
    <img className={large ? 'avatar avatar--lg' : 'avatar'} src={src} alt="" />
  ) : (
    <span className={large ? 'avatar avatar--lg' : 'avatar'} aria-hidden="true">
      {label.slice(0, 1)}
    </span>
  )
}

const Tier = ({ rank }: { rank: number }) => (
  <span className={`tier tier--${rank}`}>
    <span lang="zh-Hans">{TIERS[rank].hanzi}</span> {TIERS[rank].name}
  </span>
)

export function Portal() {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [live, setLive] = useState(false)
  const [shop, setShop] = useState('')
  const [boutiques, setBoutiques] = useState<Boutique[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.recent().then(setEvents, (e) => setError(String(e)))
    api.boutiques().then(setBoutiques, () => {})
    api.products().then(setProducts, () => {})
    return api.feed((e) => setEvents((list) => [e, ...list.filter((x) => x.id !== e.id)].slice(0, 200)), setLive)
  }, [])

  // Refresh the open profile whenever that client does something new.
  const latestForSelected = events.find((e) => e.member.unionid === selected)?.id
  useEffect(() => {
    if (selected) api.client(selected).then(setProfile, () => setProfile(null))
  }, [selected, latestForSelected])

  const shown = useMemo(() => events.filter((e) => !shop || e.boutique === shop), [events, shop])
  const title = (id: string) => products.find((p) => p.id === id)?.title ?? id

  return (
    <div className="portal">
      <header className="bar">
        <div className="brand">
          <span className="wordmark">Shantung</span>
          <span className="label">Advisor</span>
        </div>
        <nav className="tabs" aria-label="Boutique">
          {[{ title: 'All', code: '' }, ...boutiques].map((b) => (
            <button key={b.code} className="tab" aria-pressed={shop === (b.code ? b.title : '')} onClick={() => setShop(b.code ? b.title : '')}>
              {b.code ? (b as Boutique).city : 'All'}
            </button>
          ))}
        </nav>
        <span className={live ? 'status status--live' : 'status'} role="status">
          {live ? 'Live' : 'Reconnecting…'}
        </span>
      </header>

      <main className="split">
        <section className="feed" aria-label="Client activity">
          {error && <p className="empty">The feed is unavailable: {error}</p>}
          {!error && shown.length === 0 && <p className="empty">Nothing yet today. Bookings, reservations and arrivals appear here as they happen.</p>}
          <ol className="feed__list">
            {shown.map((e) => (
              <li key={e.id} className="enter">
                <button className="event" aria-pressed={selected === e.member.unionid} onClick={() => setSelected(e.member.unionid)}>
                  <span className="event__meta">
                    <span className="label label--accent">{KIND[e.type]}</span>
                    <time className="label" dateTime={e.at}>
                      {time(e.at)}
                    </time>
                  </span>
                  <span className="event__title">{e.title}</span>
                  {e.detail && <span className="event__detail">{readable(e.detail)}</span>}
                  <span className="event__client">
                    <Avatar src={e.member.avatarUrl} label={e.member.nickname || 'S'} />
                    <span>{e.member.nickname || e.member.memberNo}</span>
                    <Tier rank={e.member.tierRank} />
                    {e.boutique && <span className="muted">· {e.boutique}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <aside className="profile" aria-live="polite">
          {!profile ? (
            <p className="empty">Select a client in the feed to see their tier, reservations and wishlist.</p>
          ) : (
            <div className="enter" key={profile.member.unionid}>
              <div className="profile__head">
                <Avatar src={profile.member.avatarUrl} label={profile.member.nickname || 'S'} large />
                <div>
                  <h1 className="headline">{profile.member.nickname || 'Client'}</h1>
                  <p className="muted">
                    {profile.member.memberNo} · member since {new Date(profile.member.since).getFullYear()}
                  </p>
                  <Tier rank={profile.member.tierRank} />
                </div>
              </div>

              <h2 className="section-title">Reservations</h2>
              {profile.reservations.length === 0 ? (
                <p className="muted">None yet.</p>
              ) : (
                <ul className="rows">
                  {profile.reservations.map((r) => (
                    <li key={r.id} className="row">
                      <span className="label label--accent">{RESERVATION[r.kind]}</span>
                      <span className="row__title">{r.title}</span>
                      <span className="muted">
                        {boutiques.find((b) => b.code === r.boutique)?.title ?? r.boutique}
                        {r.at && ` · ${day(r.at)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <h2 className="section-title">Wishlist</h2>
              {profile.wishlist.length === 0 ? (
                <p className="muted">Nothing saved yet.</p>
              ) : (
                <ul className="rows">
                  {profile.wishlist.map((id) => (
                    <li key={id} className="row">
                      <span className="row__title">{title(id)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}
