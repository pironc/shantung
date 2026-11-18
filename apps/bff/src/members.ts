import { createHmac } from 'node:crypto'
import type {} from '@fastify/jwt'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { Member } from '@shantung/shared-types'
import { env, sql } from './infra.js'
import { emit } from './wecom.js'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string }
    user: { sub: string }
  }
}

const hmac = (key: string, data: string) => createHmac('sha256', key).update(data).digest('hex')

export const toMember = (m: any): Member => ({
  unionid: m.unionid,
  memberNo: `ST${String(m.member_no).padStart(6, '0')}`,
  nickname: m.nickname,
  avatarUrl: m.avatar_url,
  tierRank: m.tier_rank,
  since: new Date(m.since).toISOString(),
})

/** The signed-in client, or a 401. */
export async function member(req: FastifyRequest): Promise<Member> {
  await req.jwtVerify()
  const [m] = await sql`SELECT * FROM members WHERE unionid = ${req.user.sub}`
  if (!m) throw Object.assign(new Error('Unknown member'), { statusCode: 401 })
  return toMember(m)
}

export function memberRoutes(app: FastifyInstance) {
  app.post<{ Body: { code: string; persona?: number } }>(
    '/api/auth/wx-login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['code'],
          additionalProperties: false,
          properties: { code: { type: 'string', minLength: 6, maxLength: 128 }, persona: { type: 'integer', minimum: 1, maximum: 4 } },
        },
      },
    },
    async (req) => {
      const { code, persona } = req.body
      // The real flow sends `code` to WeChat's jscode2session with the AppID and AppSecret, which never leave the server,
      // and gets back the OpenID (this app) and UnionID (every app of the brand). Without a registered AppID, the client
      // sends `mock_<device id>` and both IDs are derived from it, so the same phone is always the same client.
      const key = code.startsWith('mock_') ? code.slice(5) : code
      const openid = 'o' + hmac(env.appSecret, `openid:${key}`).slice(0, 27)
      const unionid = 'u' + hmac(env.appSecret, `unionid:${key}`).slice(0, 27)
      // ponytail: `persona` lets the demo sign in at any tier; tiers come from yearly spend in a real CRM
      const [m] = await sql`
        INSERT INTO members (unionid, openid, tier_rank) VALUES (${unionid}, ${openid}, ${persona ?? 1})
        ON CONFLICT (unionid) DO UPDATE SET tier_rank = COALESCE(${persona ?? null}::int, members.tier_rank)
        RETURNING *`
      return { token: app.jwt.sign({ sub: unionid }, { expiresIn: '30d' }), member: toMember(m) }
    },
  )

  app.get('/api/me', member)

  // WeChat no longer shares the profile silently: the client picks an avatar and nickname with WeChat's own buttons.
  app.patch<{ Body: { nickname?: string; avatarUrl?: string } }>(
    '/api/me',
    {
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          properties: {
            nickname: { type: 'string', minLength: 1, maxLength: 32 },
            avatarUrl: { type: 'string', maxLength: 400_000, pattern: '^(data:image/(png|jpeg|webp);base64,|https://)' },
          },
        },
      },
    },
    async (req) => {
      const me = await member(req)
      const [m] = await sql`
        UPDATE members SET nickname = ${req.body.nickname ?? me.nickname}, avatar_url = ${req.body.avatarUrl ?? me.avatarUrl}
        WHERE unionid = ${me.unionid} RETURNING *`
      return toMember(m)
    },
  )

  app.get('/api/wishlist', async (req) => {
    const me = await member(req)
    return (await sql`SELECT product_id FROM wishlist WHERE unionid = ${me.unionid}`).map((r) => r.product_id as string)
  })

  app.put<{ Params: { id: string }; Body: { title?: string } }>('/api/wishlist/:id', async (req, reply) => {
    const me = await member(req)
    const added = await sql`INSERT INTO wishlist VALUES (${me.unionid}, ${req.params.id}) ON CONFLICT DO NOTHING RETURNING 1`
    if (added.length) await emit('wishlist', me, 'Added to wishlist', req.body?.title ?? req.params.id, '')
    return reply.code(204).send()
  })

  app.delete<{ Params: { id: string } }>('/api/wishlist/:id', async (req, reply) => {
    const me = await member(req)
    await sql`DELETE FROM wishlist WHERE unionid = ${me.unionid} AND product_id = ${req.params.id}`
    return reply.code(204).send()
  })
}
