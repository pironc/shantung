import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import type { Health } from '@shantung/shared-types'
import { env, migrate, redis } from './infra.js'
import { catalogRoutes } from './catalog.js'
import { memberRoutes } from './members.js'
import { reservationRoutes } from './reservations.js'
import { wecomRoutes } from './wecom.js'

const app = Fastify({ logger: true })
redis.on('error', (err) => app.log.warn({ err: err.message }, 'redis'))

// ponytail: any origin, restrict to the two frontends before anything is deployed
await app.register(cors, { methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] })
await app.register(jwt, { secret: env.jwtSecret })

app.get('/health', async (): Promise<Health> => {
  const [redisUp, cmsUp] = await Promise.all([
    redis.ping().then(() => true, () => false),
    fetch(`${env.cmsUrl}/jsonapi`, { signal: AbortSignal.timeout(2000) }).then((r) => r.ok, () => false),
  ])
  return { status: 'ok', redis: redisUp, cms: cmsUp }
})

await migrate()
await app.register(wecomRoutes)
memberRoutes(app)
catalogRoutes(app)
reservationRoutes(app)

await app.listen({ port: 3000, host: '0.0.0.0' })
