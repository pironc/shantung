import qrcode from 'qrcode-generator'
import type { Member } from '@shantung/shared-types'
import { theme as c } from '../../theme'
import { KESI_ROWS } from '../../components/art'
import { DISPLAY_FONT } from '../../services/fonts'
import { TIERS } from '../../services/i18n'

/** Logical size of the card, in CSS px; the canvas is scaled by the device pixel ratio. */
export const W = 320
export const H = 520
const PAD = 24
const BAND = 200
const SERIF = `"${DISPLAY_FONT}", "Songti SC", "Noto Serif SC", serif`
const SANS = `-apple-system, "PingFang SC", "Noto Sans SC", sans-serif`
const QR_SIZE = 112
const QUIET_ZONE_MODULES = 4 // QR specification: a blank border of at least 4 modules

type Ctx = CanvasRenderingContext2D
type Img = { width: number; height: number; onload: unknown; onerror: unknown; src: string }

/** Letter-spaced capitals: canvas letterSpacing is missing in WeChat, so draw letter by letter. */
function caps(ctx: Ctx, text: string, x: number, y: number, size: number, tracking: number, color: string) {
  ctx.font = `600 ${size}px ${SERIF}`
  ctx.fillStyle = color
  ctx.textAlign = 'left'
  let cx = x
  for (const ch of text.toUpperCase()) {
    ctx.fillText(ch, cx, y)
    cx += ctx.measureText(ch).width + tracking
  }
}

/** The tier's motif across the top band, the same four designs as the member card. */
function band(ctx: Ctx, rank: number) {
  const fill = [c.paper, c.paper, c.ink, c.brand, c.ink][rank]
  ctx.fillStyle = fill
  ctx.fillRect(0, 0, W, BAND)
  ctx.save()
  if (rank === 1) {
    ctx.strokeStyle = c.brand
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-10, BAND * 0.78)
    ctx.lineTo(W + 10, BAND * 0.56)
    ctx.stroke()
  } else if (rank === 2) {
    const g = ctx.createLinearGradient(W * 0.2, 0, W * 0.75, BAND)
    g.addColorStop(0, c.ink)
    g.addColorStop(0.5, c.slit)
    g.addColorStop(1, c.ink)
    ctx.globalAlpha = 0.35
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, BAND)
  } else if (rank === 3) {
    ctx.strokeStyle = c.paper
    ctx.globalAlpha = 0.14
    ctx.lineWidth = 1
    for (let d = -BAND; d < W + BAND; d += 12) {
      ctx.beginPath()
      ctx.moveTo(d, 0)
      ctx.lineTo(d + BAND, BAND)
      ctx.moveTo(d + BAND, 0)
      ctx.lineTo(d, BAND)
      ctx.stroke()
    }
  } else if (rank === 4) {
    // Kesi: the same slit-woven swatch as the member card, under the seal.
    const left = W * 0.58
    const width = W - PAD - left
    const scale = 0.6
    let y = 68 // ends inside the band
    for (const [h, segments] of KESI_ROWS) {
      let x = left
      for (const [f, k] of segments) {
        if (k !== '-') {
          ctx.fillStyle = k === 'r' ? c.brand : c.paper
          ctx.fillRect(x, y, width * f - 2, h * scale)
        }
        x += width * f
      }
      y += h * scale + 2
    }
  }
  ctx.restore()
}

function qr(ctx: Ctx, text: string, x: number, y: number, size: number) {
  const code = qrcode(0, 'M')
  code.addData(text)
  code.make()
  const n = code.getModuleCount()
  const cell = size / (n + QUIET_ZONE_MODULES * 2)
  ctx.fillStyle = c.paper
  ctx.fillRect(x, y, size, size)
  ctx.fillStyle = c.ink
  for (let r = 0; r < n; r++)
    for (let col = 0; col < n; col++)
      if (code.isDark(r, col)) ctx.fillRect(x + (col + QUIET_ZONE_MODULES) * cell, y + (r + QUIET_ZONE_MODULES) * cell, Math.ceil(cell), Math.ceil(cell))
}

export async function drawPass(
  ctx: Ctx,
  member: Member,
  copy: { invite: [string, string]; scan: string; greeting: string },
  link: string,
  loadImage: (src: string) => Promise<Img | null>,
) {
  const rank = member.tierRank
  const onBand = rank === 1 ? c.brand : c.paper
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = c.paper
  ctx.fillRect(0, 0, W, H)
  band(ctx, rank)

  caps(ctx, 'Shantung', PAD, 44, 18, 2, onBand)
  ctx.font = `600 40px ${SERIF}`
  ctx.textAlign = 'right'
  ctx.fillStyle = onBand
  ctx.fillText(TIERS[rank].zh, W - PAD, 56)
  caps(ctx, TIERS[rank].en, PAD, BAND - 22, 16, 2, onBand)

  // Who is invited.
  const avatar = member.avatarUrl ? await loadImage(member.avatarUrl) : null
  const textX = avatar ? PAD + 60 : PAD
  if (avatar) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(PAD + 24, BAND + 48, 24, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(avatar as unknown as CanvasImageSource, PAD, BAND + 24, 48, 48)
    ctx.restore()
  }
  ctx.textAlign = 'left'
  ctx.fillStyle = c.ink
  ctx.font = `500 24px ${SERIF}`
  ctx.fillText(member.nickname || copy.greeting, textX, BAND + 50)
  ctx.font = `11px ${SANS}`
  ctx.fillStyle = c.muted
  ctx.fillText(member.memberNo, textX, BAND + 70)

  ctx.fillStyle = c.ink
  ctx.font = `15px ${SANS}`
  ctx.fillText(copy.invite[0], PAD, BAND + 112)
  ctx.fillText(copy.invite[1], PAD, BAND + 134)

  qr(ctx, link, (W - QR_SIZE) / 2, BAND + 156, QR_SIZE)
  ctx.font = `11px ${SANS}`
  ctx.fillStyle = c.muted
  ctx.textAlign = 'center'
  ctx.fillText(copy.scan, W / 2, H - 18)
}
