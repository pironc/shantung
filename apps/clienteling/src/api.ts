import type { Boutique, ClientProfile, FeedEvent, Product } from '@shantung/shared-types'

// The browser runs on the host, so the BFF is reached through its published port, not the compose service name.
export const BFF = import.meta.env.VITE_BFF_URL ?? 'http://localhost:3000'
// ponytail: one shared demo key for every boutique device; issue per-advisor WeCom identities before real use
export const KEY = import.meta.env.VITE_ASSOCIATE_KEY ?? 'demo-associate'
/** Where the client's phone opens the check-in page (the Mini Program's browser build in this demo). */
export const MINI = import.meta.env.VITE_MINI_URL ?? 'http://localhost:3001'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BFF}${path}`, { headers: { 'x-associate-key': KEY, 'accept-language': 'en' } })
  if (!res.ok) throw new Error(`${res.status} on ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  recent: () => get<FeedEvent[]>('/api/feed/recent'),
  client: (unionid: string) => get<ClientProfile>(`/api/clients/${unionid}`),
  products: () => get<Product[]>('/api/products'),
  boutiques: () => get<Boutique[]>('/api/boutiques'),
  kioskToken: (code: string) => get<{ token: string; expiresAt: string }>(`/api/kiosk/${code}/token`),
  /** Live events, reconnecting on its own after a drop (EventSource does that natively). */
  feed: (onEvent: (e: FeedEvent) => void, onStatus: (live: boolean) => void) => {
    const source = new EventSource(`${BFF}/api/feed?key=${encodeURIComponent(KEY)}`)
    source.onopen = () => onStatus(true)
    source.onerror = () => onStatus(false)
    source.onmessage = (m) => onEvent(JSON.parse(m.data) as FeedEvent)
    return () => source.close()
  },
}

export const TIERS = [
  { name: '', hanzi: '' },
  { name: 'Thread', hanzi: '丝' },
  { name: 'Satin', hanzi: '缎' },
  { name: 'Brocade', hanzi: '锦' },
  { name: 'Kesi', hanzi: '缂丝' },
]

const shanghai = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', ...opts })
export const time = (iso: string) => shanghai({ hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
export const day = (iso: string) => shanghai({ weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
