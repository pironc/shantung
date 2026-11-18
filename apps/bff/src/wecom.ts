import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { Redis } from 'ioredis'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { ClientProfile, FeedEvent, FeedEventType, Member } from '@shantung/shared-types'
import { env, redis, sql } from './infra.js'
import { boutiques } from './catalog.js'
import { member, toMember } from './members.js'
import { reservationsOf } from './reservations.js'

const TIERS = ['', 'Thread', 'Satin', 'Brocade', 'Kesi']

// Server to server only: the secret never ships in an app bundle, so the signature proves who sent the message.
export const sign = (body: string, ts: string, nonce: string) => createHmac('sha256', env.wecomSecret).update(`${ts}.${nonce}.${body}`).digest('hex')

const sameHex = (a: string, b: string) => {
  const x = Buffer.from(a, 'hex')
  const y = Buffer.from(b, 'hex')
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y)
}

/** Valid signature, and sent within the last 5 minutes (a nonce check in Redis stops exact replays inside that window). */
export function verify(body: string, ts: string, nonce: string, signature: string, now = Date.now()) {
  return /^\d+$/.test(ts) && Math.abs(now / 1000 - Number(ts)) <= 300 && sameHex(signature, sign(body, ts, nonce))
}

type Draft = Omit<FeedEvent, 'id' | 'at'>

const card = (e: Draft) =>
  [
    `**${e.title}**`,
    `> Client: ${e.member.nickname || e.member.memberNo} · <font color="warning">${TIERS[e.member.tierRank]}</font>`,
    e.detail && `> ${e.detail}`,
    e.boutique && `> Boutique: ${e.boutique}`,
  ]
    .filter(Boolean)
    .join('\n')

/**
 * Tell the boutique. Shaped like WeCom's group-robot webhook (`msgtype: markdown`) and signed, as a real
 * integration would be. Here WECOM_URL points at this server's own simulated WeCom endpoint below.
 */
export async function emit(type: FeedEventType, m: Member, title: string, detail: string, boutique: string) {
  const event: Draft = {
    type,
    member: { unionid: m.unionid, nickname: m.nickname, avatarUrl: m.avatarUrl, tierRank: m.tierRank, memberNo: m.memberNo },
    title,
    detail,
    boutique,
  }
  const body = JSON.stringify({ msgtype: 'markdown', markdown: { content: card(event) }, event })
  const ts = String(Math.floor(Date.now() / 1000))
  const nonce = randomUUID()
  // ponytail: sent once, no retry queue; add an outbox table with retries if an alert must never be lost
  await fetch(env.wecomUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-timestamp': ts, 'x-nonce': nonce, 'x-signature': sign(body, ts, nonce) },
    body,
    signal: AbortSignal.timeout(3000),
  }).catch((e) => console.warn('wecom webhook failed:', e.message))
}

const KIOSK_WINDOW_S = 300
export const kioskToken = (code: string, window = Math.floor(Date.now() / 1000 / KIOSK_WINDOW_S)) => sign(code, String(window), 'kiosk').slice(0, 20)

export async function wecomRoutes(app: FastifyInstance) {
  // One subscriber connection fans the feed out to every open advisor screen (works across several BFF instances).
  const sub = new Redis(env.redisUrl)
  const screens = new Set<(msg: string) => void>()
  await sub.subscribe('feed')
  sub.on('message', (_channel, msg) => screens.forEach((send) => send(msg)))
  app.addHook('onClose', async () => void sub.disconnect())

  // The simulated WeCom server: verify, refuse replays, store, publish.
  await app.register(async (scope) => {
    scope.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => done(null, body))
    scope.post('/wecom/webhook', async (req, reply) => {
      const raw = req.body as string
      const h = req.headers as Record<string, string>
      if (!verify(raw, h['x-timestamp'] ?? '', h['x-nonce'] ?? '', h['x-signature'] ?? '')) return reply.code(401).send({ errcode: 40001, errmsg: 'invalid signature' })
      if (!(await redis.set(`nonce:${h['x-nonce']}`, 1, 'EX', 300, 'NX'))) return reply.code(409).send({ errcode: 40002, errmsg: 'replayed message' })
      const { event } = JSON.parse(raw) as { event: Draft }
      const [row] = await sql`INSERT INTO events (body) VALUES (${sql.json(event as any)}) RETURNING id, at`
      await redis.publish('feed', JSON.stringify({ ...event, id: row.id, at: new Date(row.at).toISOString() } satisfies FeedEvent))
      return { errcode: 0, errmsg: 'ok' }
    })
  })

  // Advisor screens. EventSource cannot send headers, so the key may also come as ?key=.
  const isAssociate = (req: FastifyRequest) =>
    (req.headers['x-associate-key'] ?? (req.query as { key?: string }).key) === env.associateKey
  app.addHook('onRequest', async (req, reply) => {
    if ((req.url.startsWith('/api/feed') || req.url.startsWith('/api/clients/')) && !isAssociate(req)) {
      return reply.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Associate key required' })
    }
  })

  app.get('/api/feed/recent', async () =>
    (await sql`SELECT id, at, body FROM events ORDER BY id DESC LIMIT 50`).map((r) => ({ ...r.body, id: r.id, at: new Date(r.at).toISOString() }) as FeedEvent),
  )

  app.get('/api/feed', (req, reply) => {
    reply.hijack()
    reply.raw.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'access-control-allow-origin': '*',
    })
    const send = (msg: string) => reply.raw.write(`data: ${msg}\n\n`)
    const ping = setInterval(() => reply.raw.write(': ping\n\n'), 25_000)
    screens.add(send)
    req.raw.on('close', () => {
      screens.delete(send)
      clearInterval(ping)
    })
  })

  app.get<{ Params: { unionid: string } }>('/api/clients/:unionid', async (req, reply) => {
    const [m] = await sql`SELECT * FROM members WHERE unionid = ${req.params.unionid}`
    if (!m) return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'No such client' })
    const wishlist = (await sql`SELECT product_id FROM wishlist WHERE unionid = ${m.unionid}`).map((r) => r.product_id as string)
    return { member: toMember(m), reservations: await reservationsOf(m.unionid), wishlist } satisfies ClientProfile
  })

  // Entrance kiosk: a QR that changes every 5 minutes, so a photo of it cannot check anyone in later.
  app.get<{ Params: { code: string } }>('/api/kiosk/:code/token', async (req) => {
    const window = Math.floor(Date.now() / 1000 / KIOSK_WINDOW_S)
    return { token: kioskToken(req.params.code, window), expiresAt: new Date((window + 1) * KIOSK_WINDOW_S * 1000).toISOString() }
  })

  app.post<{ Body: { boutique: string; token: string } }>(
    '/api/checkin',
    {
      schema: {
        body: {
          type: 'object',
          required: ['boutique', 'token'],
          additionalProperties: false,
          properties: { boutique: { type: 'string', maxLength: 8 }, token: { type: 'string', maxLength: 64 } },
        },
      },
    },
    async (req, reply) => {
      const me = await member(req)
      const shop = (await boutiques('en')).find((b) => b.code === req.body.boutique)
      const window = Math.floor(Date.now() / 1000 / KIOSK_WINDOW_S)
      const fresh = [window, window - 1].some((w) => req.body.token === kioskToken(req.body.boutique, w))
      if (!shop || !fresh) return reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: 'This code has expired, scan the screen again' })
      await emit('arrival', me, 'Arrived at the boutique', '', shop.title)
      return { boutique: shop.code }
    },
  )
}
