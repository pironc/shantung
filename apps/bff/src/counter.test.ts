// Needs a real Redis (it tests the atomic script itself): `docker compose exec bff pnpm --filter bff test`
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { redis, sql } from './infra.js'
import { claim, opensAt, unclaim } from './counter.js'

before(() => new Promise<void>((ready) => (redis.status === 'ready' ? ready() : redis.once('ready', () => ready()))))
after(async () => {
  redis.disconnect()
  await sql.end()
})

const fresh = async (fn: (id: string) => Promise<void>) => {
  const id = `test-${process.pid}-${Math.random()}`
  try {
    await fn(id)
  } finally {
    await redis.del(`left:salon:${id}`, `holders:salon:${id}`)
  }
}

test('12 seats, 50 clients at the same moment: exactly 12 get one', () =>
  fresh(async (id) => {
    const results = await Promise.all(Array.from({ length: 50 }, (_, i) => claim('salon', id, 12, `client-${i}`)))
    assert.equal(results.filter((r) => r === 'ok').length, 12)
    assert.equal(results.filter((r) => r === 'full').length, 38)
  }))

test('the same client tapping twice holds one seat', () =>
  fresh(async (id) => {
    const results = await Promise.all([claim('salon', id, 5, 'same'), claim('salon', id, 5, 'same')])
    assert.deepEqual(results.sort(), ['already', 'ok'])
    assert.equal(await redis.get(`left:salon:${id}`), '4')
  }))

test('a seat given back can be taken again', () =>
  fresh(async (id) => {
    assert.equal(await claim('salon', id, 1, 'a'), 'ok')
    assert.equal(await claim('salon', id, 1, 'b'), 'full')
    await unclaim('salon', id, 'a')
    assert.equal(await claim('salon', id, 1, 'b'), 'ok')
  }))

test('limited releases open for Kesi first, then one day later per tier', () => {
  const release = '2026-11-17T10:00:00.000Z'
  assert.equal(opensAt(release, 4).toISOString(), release)
  assert.equal(opensAt(release, 3).toISOString(), '2026-11-18T10:00:00.000Z')
  assert.equal(opensAt(release, 1).toISOString(), '2026-11-20T10:00:00.000Z')
})
