import { redis, sql } from './infra.js'

const DAY = 86_400_000

/** Limited releases open by tier: Kesi (rank 4) at release time, then one day later for each lower tier. */
export const opensAt = (releaseAt: string | Date, tierRank: number) => new Date(new Date(releaseAt).getTime() + (4 - tierRank) * DAY)

export const windows = (releaseAt: string | Date) =>
  [4, 3, 2, 1].map((tierRank) => ({ tierRank, opensAt: opensAt(releaseAt, tierRank).toISOString() }))

// Atomic in Redis: refuse a second claim by the same client, then take one unit or refuse when none is left.
// A lock would only make requests wait in line; this counter is what guarantees nothing is promised twice.
const CLAIM = `
if redis.call('SISMEMBER', KEYS[2], ARGV[1]) == 1 then return -1 end
redis.call('SET', KEYS[1], ARGV[2], 'NX')
if redis.call('DECR', KEYS[1]) < 0 then
  redis.call('INCR', KEYS[1])
  return -2
end
redis.call('SADD', KEYS[2], ARGV[1])
return 1`

const keys = (kind: string, id: string) => [`left:${kind}:${id}`, `holders:${kind}:${id}`] as const

/**
 * Take one seat or piece for `member`. `initial` seeds the counter the first time (capacity minus what the
 * database already holds), so a Redis restart cannot hand out units that are already booked.
 */
export async function claim(kind: string, id: string, initial: number, member: string): Promise<'ok' | 'already' | 'full'> {
  const r = await redis.eval(CLAIM, 2, ...keys(kind, id), member, initial)
  return r === -1 ? 'already' : r === -2 ? 'full' : 'ok'
}

/** Give a unit back, when the database refused the booking after Redis accepted it. */
export async function unclaim(kind: string, id: string, member: string) {
  const [left, holders] = keys(kind, id)
  await redis.multi().incr(left).srem(holders, member).exec()
}

export async function remaining(kind: string, id: string, capacity: number, bookedCount: number) {
  const v = await redis.get(keys(kind, id)[0]).catch(() => null)
  return Math.max(0, v === null ? capacity - bookedCount : Number(v))
}

export async function booked(kind: string): Promise<Map<string, number>> {
  const rows = await sql<{ item_id: string; n: number }[]>`SELECT item_id, count(*)::int AS n FROM reservations WHERE kind = ${kind} GROUP BY item_id`
  return new Map(rows.map((r) => [r.item_id, r.n]))
}
