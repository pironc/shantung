import { Redis } from 'ioredis'
import postgres from 'postgres'
import type { Lang } from '@shantung/shared-types'

export const env = {
  cmsUrl: process.env.CMS_URL ?? 'http://localhost:8081',
  /** Where phones and browsers fetch images from: the CMS as seen from the host, not from inside Docker. */
  cmsPublicUrl: process.env.CMS_PUBLIC_URL ?? 'http://localhost:8081',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://drupal:drupal@localhost:5432/app',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-only-jwt-secret',
  /** Stands in for the WeChat AppSecret used to derive stable mock OpenIDs. */
  appSecret: process.env.WX_APP_SECRET ?? 'dev-only-app-secret',
  wecomSecret: process.env.WECOM_SECRET ?? 'dev-only-wecom-secret',
  wecomUrl: process.env.WECOM_URL ?? 'http://localhost:3000/wecom/webhook',
  associateKey: process.env.ASSOCIATE_KEY ?? 'demo-associate',
}

// Fail fast instead of queueing commands while Redis is down.
export const redis = new Redis(env.redisUrl, { enableOfflineQueue: false })
export const sql = postgres(env.databaseUrl, { onnotice: () => {} })

export const langOf = (acceptLanguage?: string): Lang => (acceptLanguage?.toLowerCase().startsWith('zh') ? 'zh-hans' : 'en')

/** The app's own tables. Drupal keeps its content in the `drupal` database; this is the `app` database. */
export async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS members (
      unionid     text PRIMARY KEY,
      openid      text NOT NULL UNIQUE,
      member_no   serial,
      nickname    text NOT NULL DEFAULT '',
      avatar_url  text NOT NULL DEFAULT '',
      tier_rank   int  NOT NULL DEFAULT 1 CHECK (tier_rank BETWEEN 1 AND 4),
      since       timestamptz NOT NULL DEFAULT now()
    )`
  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id         serial PRIMARY KEY,
      kind       text NOT NULL CHECK (kind IN ('limited', 'try', 'salon', 'appointment')),
      item_id    text NOT NULL,
      unionid    text NOT NULL REFERENCES members,
      title      text NOT NULL,
      boutique   text NOT NULL,
      at         timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  // The database's last word on double bookings: one seat or piece per client, one client per appointment slot.
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS one_per_client ON reservations (kind, item_id, unionid) WHERE kind IN ('limited', 'salon')`
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS one_per_slot ON reservations (boutique, at) WHERE kind = 'appointment'`
  await sql`
    CREATE TABLE IF NOT EXISTS wishlist (
      unionid    text NOT NULL REFERENCES members,
      product_id text NOT NULL,
      PRIMARY KEY (unionid, product_id)
    )`
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id   serial PRIMARY KEY,
      at   timestamptz NOT NULL DEFAULT now(),
      body jsonb NOT NULL
    )`
}
