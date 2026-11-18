import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { redis, sql } from './infra.js'
import { sign, verify } from './wecom.js'

after(async () => {
  redis.disconnect()
  await sql.end()
})

const body = JSON.stringify({ msgtype: 'markdown', markdown: { content: '**Salon seat**' } })
const now = Date.now()
const ts = String(Math.floor(now / 1000))

test('a signed message verifies', () => {
  assert.equal(verify(body, ts, 'n1', sign(body, ts, 'n1'), now), true)
})

test('a changed body, nonce or signature is refused', () => {
  const sig = sign(body, ts, 'n1')
  assert.equal(verify(body.replace('Salon', 'Free'), ts, 'n1', sig, now), false)
  assert.equal(verify(body, ts, 'n2', sig, now), false)
  assert.equal(verify(body, ts, 'n1', 'abcd', now), false)
  assert.equal(verify(body, ts, 'n1', '', now), false)
})

test('a message older than five minutes is refused', () => {
  const old = String(Math.floor(now / 1000) - 301)
  assert.equal(verify(body, old, 'n1', sign(body, old, 'n1'), now), false)
})
