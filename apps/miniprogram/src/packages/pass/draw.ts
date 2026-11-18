import qrcode from 'qrcode-generator'
import type { Member } from '@shantung/shared-types'
import { theme as c } from '../../theme'
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

/** The tier's motif across the top band: the same single, quiet motif as the member card. */
function band(ctx: Ctx, rank: number) {
  ctx.fillStyle = [c.paper, c.paper, c.ink, c.brand, c.ink][rank]
  ctx.fillRect(0, 0, W, BAND)
  ctx.save()
  if (rank === 1) {
    // Thread: one fine red thread in a gentle curve.
    ctx.strokeStyle = c.brand
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(-10, BAND * 0.74)
    ctx.bezierCurveTo(W * 0.3, BAND * 0.6, W * 0.65, BAND * 0.84, W + 10, BAND * 0.64)
    ctx.stroke()
  } else if (rank === 2) {
    // Satin: a still, soft lustre.
    const g = ctx.createLinearGradient(0, BAND, W, 0)
    g.addColorStop(0.25, c.ink)
    g.addColorStop(0.55, c.slit)
    g.addColorStop(0.85, c.ink)
    ctx.globalAlpha = 0.12
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, BAND)
  } else if (rank === 3) {
    // Brocade: one large tone-on-tone medallion, mostly off the edge.
    ctx.strokeStyle = c.paper
    ctx.globalAlpha = 0.14
    ctx.lineWidth = 1
    for (const r of [90, 78, 20]) {
      ctx.beginPath()
      ctx.arc(W - 30, BAND - 10, r, 0, Math.PI * 2)
      ctx.stroke()
    }
  } else if (rank === 4) {
    // Kesi: a woven selvedge along the band's lower edge, blocks parted by slits.
    const h = 6
    const stops = [0, 0.46, 0.62, 1]
    const colours = [c.brand, c.paper, c.brand]
    colours.forEach((colour, i) => {
      ctx.fillStyle = colour
      ctx.fillRect(stops[i] * W + (i ? 2 : 0), BAND - h, (stops[i + 1] - stops[i]) * W - (i ? 2 : 0), h)
    })
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
