import Fastify from 'fastify'
import cors from '@fastify/cors'
import { Redis } from 'ioredis'
import type { Health } from '@shantung/shared-types'

const CMS_URL = process.env.CMS_URL ?? 'http://localhost:8081'

const app = Fastify({ logger: true })
// Fail fast instead of queueing commands while Redis is down, so /health answers immediately.
const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', { enableOfflineQueue: false })
redis.on('error', (err) => app.log.warn({ err: err.message }, 'redis'))

// ponytail: allows any origin, restrict to the two frontends before anything is deployed
await app.register(cors)

app.get('/health', async (): Promise<Health> => {
  const [redisUp, cmsUp] = await Promise.all([
    redis.ping().then(() => true, () => false),
    fetch(`${CMS_URL}/jsonapi`, { signal: AbortSignal.timeout(2000) }).then((r) => r.ok, () => false),
  ])
  return { status: 'ok', redis: redisUp, cms: cmsUp }
})

await app.listen({ port: 3000, host: '0.0.0.0' })
