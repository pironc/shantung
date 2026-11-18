import type { FastifyInstance } from 'fastify'
import type { Boutique, Image, Lang, Product, Salon, Story, Tier } from '@shantung/shared-types'
import { env, langOf, redis } from './infra.js'
import { booked, remaining, windows } from './counter.js'

type Resource = { id: string; attributes: any; relationships: any }
type Doc = { data: Resource[]; included?: Resource[] }

async function jsonapi(lang: Lang, path: string): Promise<{ data: Resource[]; inc: Map<string, Resource> }> {
  const prefix = lang === 'zh-hans' ? '/zh-hans' : ''
  const res = await fetch(`${env.cmsUrl}${prefix}/jsonapi/${path}`, { signal: AbortSignal.timeout(5000) })
  if (!res.ok) throw new Error(`CMS answered ${res.status} for ${path}`)
  const doc = (await res.json()) as Doc
  return { data: doc.data, inc: new Map((doc.included ?? []).map((r) => [r.id, r])) }
}

// ponytail: a 60 s TTL instead of cache invalidation hooks; add a Drupal hook that deletes these keys if editors need instant updates
async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = await redis.get(key).catch(() => null)
  if (hit) return JSON.parse(hit) as T
  const value = await load()
  await redis.set(key, JSON.stringify(value), 'EX', 60).catch(() => {})
  return value
}

const list = (rel: any): any[] => (rel?.data == null ? [] : Array.isArray(rel.data) ? rel.data : [rel.data])

function images(rel: any, inc: Map<string, Resource>): Image[] {
  return list(rel).flatMap((d) => {
    const file = inc.get(d.id)
    return file ? [{ url: env.cmsPublicUrl + file.attributes.uri.url, alt: d.meta.alt ?? '', width: d.meta.width, height: d.meta.height }] : []
  })
}

const ref = (rel: any, inc: Map<string, Resource>) => inc.get(list(rel)[0]?.id ?? '')

export const tiers = (lang: Lang) =>
  cached(`catalog:${lang}:tiers`, async () => {
    const { data } = await jsonapi(lang, 'taxonomy_term/tier?sort=field_rank')
    return data.map((t): Tier => ({
      id: t.id,
      rank: t.attributes.field_rank,
      name: t.attributes.name,
      hanzi: t.attributes.field_hanzi ?? '',
      threshold: t.attributes.field_threshold ?? 0,
      invitationOnly: Boolean(t.attributes.field_invitation),
      description: t.attributes.description?.value ?? '',
    }))
  })

type BaseProduct = Omit<Product, 'limited'> & { limited: Omit<NonNullable<Product['limited']>, 'remaining'> | null }

const baseProducts = (lang: Lang) =>
  cached(`catalog:${lang}:products`, async () => {
    const { data, inc } = await jsonapi(lang, 'node/product?include=field_images,field_category&sort=field_sku')
    return data.map((p): BaseProduct => {
      const a = p.attributes
      return {
        id: p.id,
        sku: a.field_sku,
        title: a.title,
        subtitle: a.field_subtitle ?? '',
        text: a.field_text ?? '',
        price: Number(a.field_price),
        category: ref(p.relationships.field_category, inc)?.attributes.name ?? '',
        images: images(p.relationships.field_images, inc),
        limited:
          a.field_limited && a.field_release
            ? { pieces: a.field_stock ?? 0, releaseAt: new Date(a.field_release).toISOString(), windows: windows(a.field_release) }
            : null,
      }
    })
  })

/** Products with live stock: the catalog is cached, the counters never are. */
export async function products(lang: Lang): Promise<Product[]> {
  const counts = await booked('limited')
  return Promise.all(
    (await baseProducts(lang)).map(async (p) => ({
      ...p,
      limited: p.limited && { ...p.limited, remaining: await remaining('limited', p.id, p.limited.pieces, counts.get(p.id) ?? 0) },
    })),
  )
}

export const boutiques = (lang: Lang) =>
  cached(`catalog:${lang}:boutiques`, async () => {
    const { data, inc } = await jsonapi(lang, 'node/boutique?include=field_image&sort=title')
    return data.map((b): Boutique => ({
      id: b.id,
      code: b.attributes.field_code,
      title: b.attributes.title,
      city: b.attributes.field_city ?? '',
      address: b.attributes.field_address ?? '',
      hours: b.attributes.field_hours ?? '',
      text: b.attributes.field_text ?? '',
      image: images(b.relationships.field_image, inc)[0] ?? null,
    }))
  })

const baseSalons = (lang: Lang) =>
  cached(`catalog:${lang}:salons`, async () => {
    const { data, inc } = await jsonapi(lang, 'node/salon?include=field_image,field_boutique,field_tier&sort=field_date')
    return data.map((s): Omit<Salon, 'seatsLeft'> => {
      const b = ref(s.relationships.field_boutique, inc)
      return {
        id: s.id,
        title: s.attributes.title,
        subtitle: s.attributes.field_subtitle ?? '',
        text: s.attributes.field_text ?? '',
        date: new Date(s.attributes.field_date).toISOString(),
        boutique: b ? { id: b.id, code: b.attributes.field_code, title: b.attributes.title, city: b.attributes.field_city ?? '' } : null,
        seats: s.attributes.field_seats,
        minTierRank: ref(s.relationships.field_tier, inc)?.attributes.field_rank ?? 1,
        image: images(s.relationships.field_image, inc)[0] ?? null,
      }
    })
  })

export async function salons(lang: Lang): Promise<Salon[]> {
  const counts = await booked('salon')
  return Promise.all(
    (await baseSalons(lang)).map(async (s) => ({ ...s, seatsLeft: await remaining('salon', s.id, s.seats, counts.get(s.id) ?? 0) })),
  )
}

export const stories = (lang: Lang) =>
  cached(`catalog:${lang}:stories`, async () => {
    const { data, inc } = await jsonapi(lang, 'node/story?include=field_image,field_images&sort=created')
    return data.map((s): Story => ({
      id: s.id,
      title: s.attributes.title,
      subtitle: s.attributes.field_subtitle ?? '',
      text: s.attributes.field_text ?? '',
      image: images(s.relationships.field_image, inc)[0] ?? null,
      gallery: images(s.relationships.field_images, inc),
    }))
  })

export function catalogRoutes(app: FastifyInstance) {
  const lang = (req: { headers: { 'accept-language'?: string } }) => langOf(req.headers['accept-language'])
  const one = <T extends { id: string }>(items: T[], id: string) => items.find((i) => i.id === id) ?? null
  const notFound = { statusCode: 404, error: 'Not Found', message: 'No such item' }

  app.get('/api/tiers', (req) => tiers(lang(req)))
  app.get('/api/products', (req) => products(lang(req)))
  app.get<{ Params: { id: string } }>('/api/products/:id', async (req, reply) => one(await products(lang(req)), req.params.id) ?? reply.code(404).send(notFound))
  app.get('/api/boutiques', (req) => boutiques(lang(req)))
  app.get('/api/salons', (req) => salons(lang(req)))
  app.get<{ Params: { id: string } }>('/api/salons/:id', async (req, reply) => one(await salons(lang(req)), req.params.id) ?? reply.code(404).send(notFound))
  app.get('/api/stories', (req) => stories(lang(req)))
  app.get<{ Params: { id: string } }>('/api/stories/:id', async (req, reply) => one(await stories(lang(req)), req.params.id) ?? reply.code(404).send(notFound))
}
