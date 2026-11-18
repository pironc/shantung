import type { FastifyInstance } from 'fastify'
import type { Member, Reservation, ReservationKind } from '@shantung/shared-types'
import { sql } from './infra.js'
import { boutiques, products, salons } from './catalog.js'
import { booked, claim, opensAt, unclaim } from './counter.js'
import { member } from './members.js'
import { emit } from './wecom.js'

const conflict = (message: string) => Object.assign(new Error(message), { statusCode: 409 })
const forbidden = (message: string) => Object.assign(new Error(message), { statusCode: 403 })
const isUniqueViolation = (e: unknown) => (e as { code?: string }).code === '23505'

const toReservation = (r: any): Reservation => ({
  id: r.id,
  kind: r.kind,
  itemId: r.item_id,
  title: r.title,
  boutique: r.boutique,
  at: r.at && new Date(r.at).toISOString(),
  createdAt: new Date(r.created_at).toISOString(),
})

export async function reservationsOf(unionid: string) {
  return (await sql`SELECT * FROM reservations WHERE unionid = ${unionid} ORDER BY created_at DESC`).map(toReservation)
}

async function insert(me: Member, kind: ReservationKind, itemId: string, title: string, boutique: string, at: Date | null) {
  const [r] = await sql`
    INSERT INTO reservations (kind, item_id, unionid, title, boutique, at)
    VALUES (${kind}, ${itemId}, ${me.unionid}, ${title}, ${boutique}, ${at})
    RETURNING *`
  return toReservation(r)
}

/** Seat or piece first in Redis (fast, atomic), then the row in Postgres; give the unit back if the row is refused. */
async function claimAndInsert(me: Member, kind: 'limited' | 'salon', itemId: string, capacity: number, row: () => Promise<Reservation>) {
  const result = await claim(kind, itemId, capacity - ((await booked(kind)).get(itemId) ?? 0), me.unionid)
  if (result === 'already') throw conflict('Already reserved')
  if (result === 'full') throw conflict('Nothing left')
  try {
    return await row()
  } catch (e) {
    await unclaim(kind, itemId, me.unionid)
    throw isUniqueViolation(e) ? conflict('Already reserved') : e
  }
}

const SHANGHAI = '+08:00'
const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

export function reservationRoutes(app: FastifyInstance) {
  const boutiqueBody = { type: 'object', required: ['boutique'], additionalProperties: false, properties: { boutique: { type: 'string', maxLength: 8 } } }

  app.get('/api/me/reservations', async (req) => reservationsOf((await member(req)).unionid))

  // A limited piece (tier window, counted stock) or any other piece held 48 h to try in the boutique.
  app.post<{ Params: { id: string }; Body: { boutique: string } }>('/api/products/:id/reserve', { schema: { body: boutiqueBody } }, async (req, reply) => {
    const me = await member(req)
    const product = (await products('en')).find((p) => p.id === req.params.id)
    const shop = (await boutiques('en')).find((b) => b.code === req.body.boutique)
    if (!product || !shop) return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'No such piece or boutique' })

    if (product.limited) {
      const opens = opensAt(product.limited.releaseAt, me.tierRank)
      if (opens > new Date()) throw forbidden(`Your window opens ${opens.toISOString()}`)
      const r = await claimAndInsert(me, 'limited', product.id, product.limited.pieces, () =>
        insert(me, 'limited', product.id, product.title, shop.code, null),
      )
      await emit('reservation', me, `Limited piece reserved: ${product.title}`, product.subtitle, shop.title)
      return reply.code(201).send(r)
    }

    const until = new Date(Date.now() + 48 * 3_600_000)
    const r = await insert(me, 'try', product.id, product.title, shop.code, until)
    await emit('reservation', me, `To try in boutique: ${product.title}`, `Held until ${until.toISOString()}`, shop.title)
    return reply.code(201).send(r)
  })

  app.post<{ Params: { id: string } }>('/api/salons/:id/book', async (req, reply) => {
    const me = await member(req)
    const salon = (await salons('en')).find((s) => s.id === req.params.id)
    if (!salon?.boutique) return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'No such salon' })
    if (me.tierRank < salon.minTierRank) throw forbidden('This salon is by invitation from a higher tier')
    if (new Date(salon.date) < new Date()) throw conflict('This salon has passed')
    const r = await claimAndInsert(me, 'salon', salon.id, salon.seats, () =>
      insert(me, 'salon', salon.id, salon.title, salon.boutique!.code, new Date(salon.date)),
    )
    await emit('booking', me, `Salon seat: ${salon.title}`, new Date(salon.date).toISOString(), salon.boutique.title)
    return reply.code(201).send(r)
  })

  // One-to-one appointments: hourly slots in boutique time (Shanghai, UTC+8); the database refuses a taken slot.
  app.get<{ Params: { code: string }; Querystring: { date: string } }>(
    '/api/boutiques/:code/slots',
    { schema: { querystring: { type: 'object', required: ['date'], properties: { date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' } } } } },
    async (req) => {
      const slots = HOURS.map((h) => new Date(`${req.query.date}T${String(h).padStart(2, '0')}:00:00${SHANGHAI}`))
      const taken = new Set(
        (await sql`SELECT at FROM reservations WHERE kind = 'appointment' AND boutique = ${req.params.code} AND at BETWEEN ${slots[0]} AND ${slots.at(-1)!}`).map((r) =>
          new Date(r.at).getTime(),
        ),
      )
      return slots.map((at) => ({ at: at.toISOString(), free: at > new Date() && !taken.has(at.getTime()) }))
    },
  )

  app.post<{ Body: { boutique: string; at: string } }>(
    '/api/appointments',
    {
      schema: {
        body: {
          type: 'object',
          required: ['boutique', 'at'],
          additionalProperties: false,
          properties: { boutique: { type: 'string', maxLength: 8 }, at: { type: 'string', format: 'date-time' } },
        },
      },
    },
    async (req, reply) => {
      const me = await member(req)
      const shop = (await boutiques('en')).find((b) => b.code === req.body.boutique)
      const at = new Date(req.body.at)
      const hour = (at.getUTCHours() + 8) % 24
      const valid = at.getUTCMinutes() === 0 && at.getUTCSeconds() === 0 && HOURS.includes(hour) && at > new Date()
      if (!shop || !valid) return reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: 'Pick a free hourly slot' })
      try {
        const r = await insert(me, 'appointment', shop.code, `Appointment at ${shop.title}`, shop.code, at)
        await emit('appointment', me, 'One-to-one appointment', at.toISOString(), shop.title)
        return reply.code(201).send(r)
      } catch (e) {
        if (isUniqueViolation(e)) throw conflict('This slot was just taken')
        throw e
      }
    },
  )
}
