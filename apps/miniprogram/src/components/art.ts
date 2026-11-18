// Shantung's own line icons, background pattern and card art, as SVG.
// One construction for every icon: 24-unit grid, 1.5 stroke, round caps and joins, square corners (radius 0).
// WeChat's <image> renders SVG from a base64 data URI, so everything is encoded here (no btoa in WeChat).
import { theme as c } from '../theme'

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
function base64(ascii: string) {
  let out = ''
  for (let i = 0; i < ascii.length; i += 3) {
    const n = (ascii.charCodeAt(i) << 16) | ((ascii.charCodeAt(i + 1) || 0) << 8) | (ascii.charCodeAt(i + 2) || 0)
    out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (i + 1 < ascii.length ? B64[(n >> 6) & 63] : '=') + (i + 2 < ascii.length ? B64[n & 63] : '=')
  }
  return out
}
export const svgUri = (svg: string) => `data:image/svg+xml;base64,${base64(svg)}`

const ICONS = {
  calendar: 'M3.5 5h17v15.5h-17z M3.5 9.5h17 M8 3v4 M16 3v4',
  // Beijing: the Temple of Heaven, three round roofs on a terrace.
  BJ01: 'M12 2.5v2 M8.5 7.5c1-1.6 2.2-2.6 3.5-3 1.3.4 2.5 1.4 3.5 3z M9.5 7.5V10h5V7.5 M6.5 12.5C8.1 10.9 9.9 10 12 10s3.9.9 5.5 2.5z M8 12.5V15h8v-2.5 M4.5 17.5C6.5 15.9 9 15 12 15s5.5.9 7.5 2.5z M6.5 17.5V20h11v-2.5 M3 21h18',
  // Qingdao: Huilan Pavilion, two eaves on a pier over the sea.
  QD01: 'M12 3v1.5 M8 8.5c1.5-.6 2.8-2 4-4 1.2 2 2.5 3.4 4 4z M9.5 8.5V11h5V8.5 M5 13.5c2.4-.6 4.7-1.6 7-2.5 2.3.9 4.6 1.9 7 2.5z M7.5 13.5V17 M12 13.5V17 M16.5 13.5V17 M3 17h18 M3 20.5c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1',
  // Shanghai: Jing'an Temple, a sweeping hall roof under its spire.
  SH01: 'M12 2.5V8 M10.5 4.5h3 M10 6.5h4 M3 12c3.2-.4 6.2-1.8 9-4 2.8 2.2 5.8 3.6 9 4z M5 12v8h14v-8 M10.5 20v-4.5h3V20 M3 20.5h18',
  lock: 'M6.5 11h11v9.5h-11z M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  chevron: 'M9.5 6l6 6-6 6',
  back: 'M14.5 5.5L8 12l6.5 6.5',
} as const
export type IconName = keyof typeof ICONS

export const iconUri = (name: IconName, colour: string) =>
  svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${colour}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[name]}"/></svg>`,
  )

/**
 * Hui wen (回纹), the "returning" fret of silk borders, as a seamless tile. Drawn in ink at low opacity:
 * on the red stage it reads as woven texture, never as something to read.
 */
export const fretUri = (colour: string = c.ink, opacity = 0.16) =>
  svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="${colour}" stroke-opacity="${opacity}" stroke-width="1.6" stroke-linecap="square"><path d="M0 30h30V2H6v22h18V8H12v10h6"/><path d="M30 30h2"/></svg>`,
  )

const W = 856
const H = 540
const svg = (body: string) => svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${body}</svg>`)
const range = (from: number, to: number, step: number) => Array.from({ length: Math.ceil((to - from) / step) }, (_, i) => from + i * step)

// One quiet motif per tier (owner: simple and elegant, nothing busy).

/** Thread 丝: a single fine red thread in one gentle curve. */
const thread = () => svg(`<path d="M-20 290C260 220 560 340 880 240" fill="none" stroke="${c.brand}" stroke-width="2.5" stroke-linecap="round"/>`)

/** Satin 缎: the soft, still lustre of satin, a slightly lighter diagonal in the black. */
const satin = () =>
  svg(
    `<defs><linearGradient id="l" x1="0" y1="1" x2="1" y2="0"><stop offset="0.25" stop-color="${c.paper}" stop-opacity="0"/><stop offset="0.55" stop-color="${c.paper}" stop-opacity="0.07"/><stop offset="0.85" stop-color="${c.paper}" stop-opacity="0"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#l)"/>`,
  )

/** Brocade 锦: one large medallion (团花), tone on tone, mostly off the card's edge. */
const brocade = () =>
  svg(
    `<g transform="translate(860 400)" fill="none" stroke="${c.paper}" stroke-opacity="0.14" stroke-width="2"><circle r="230"/><circle r="200"/><circle r="48"/>${range(0, 360, 30)
      .map((a) => `<ellipse rx="34" ry="92" transform="rotate(${a}) translate(0 -130)"/>`)
      .join('')}</g>`,
  )

/** Kesi 缂丝: a narrow woven selvedge along the bottom edge, three blocks parted by the slits kesi is known for. */
const kesi = () => {
  const SLIT = 4
  const h = 16
  const stops = [0, 0.46, 0.62, 1]
  const colours = [c.brand, c.paper, c.brand]
  return svg(
    colours.map((colour, i) => `<rect x="${stops[i] * W + (i ? SLIT : 0)}" y="${H - h}" width="${(stops[i + 1] - stops[i]) * W - (i ? SLIT : 0)}" height="${h}" fill="${colour}"/>`).join(''),
  )
}

export const cardArt = [null, thread, satin, brocade, kesi].map((f) => (f ? f() : ''))
