import Taro from '@tarojs/taro'
import type { Lang, Product } from '@shantung/shared-types'
import { store } from './store'

const en = {
  discover: 'Discover',
  collection: 'Collection',
  salons: 'Salons',
  membership: 'Membership',
  tagline: 'Silk and tea from Shandong',
  limitedRelease: 'Limited release',
  pieces: (n: number) => `${n} pieces`,
  left: (n: number) => `${n} left`,
  windowOpen: 'Your window is open',
  windowOpens: (d: string) => `Your window opens ${d}`,
  windows: 'Release windows',
  discoverMore: 'Discover',
  privateSalons: 'Private salons',
  reserveSeat: 'Reserve a seat',
  seatsLeft: (n: number, of: number) => `${n} of ${of} seats left`,
  invitedFrom: 'Invited from',
  stories: 'Stories',
  read: 'Read',
  boutiques: 'Boutiques',
  bookAppointment: 'Book an appointment',
  all: 'All',
  limited: 'Limited',
  reserve: 'Reserve this piece',
  reserveTry: 'Reserve to try in boutique',
  pickBoutique: 'Choose a boutique',
  saveWishlist: 'Save to wishlist',
  saved: 'Saved to your wishlist',
  reserved: 'Reserved. Your advisor has been told.',
  booked: 'Your seat is reserved. Your advisor has been told.',
  full: 'Fully reserved',
  passed: 'This salon has passed',
  already: 'Already reserved',
  notYet: 'Not open for your tier yet',
  cardTitle: 'Member card',
  memberNo: 'Member',
  chooseAvatar: 'Choose avatar',
  nickname: 'Your name',
  nicknamePlaceholder: 'How should we greet you?',
  reservations: 'Your reservations',
  none: 'Nothing reserved yet.',
  vipPass: 'Your invitation card',
  demo: 'Demo: view as',
  appointment: 'Appointment',
  pickDay: 'Choose a day',
  pickTime: 'Choose a time',
  confirm: 'Confirm',
  appointmentDone: 'Your appointment is confirmed. Your advisor has been told.',
  slotTaken: 'This time was just taken. Please choose another.',
  welcome: 'Welcome',
  checkingIn: 'Letting your advisor know…',
  checkedIn: 'Your advisor has been told and will be with you shortly.',
  expired: 'This code has expired. Please scan the screen again.',
  offline: 'Offline: showing what you saw last.',
  error: 'Something went wrong. Please try again.',
  retry: 'Try again',
  kind: { limited: 'Limited piece', try: 'To try', salon: 'Salon seat', appointment: 'Appointment' } as Record<string, string>,
  until: 'Held until',
  nextTier: (name: string, amount: string) => `${name} from ${amount} spent in a year`,
  invitationOnly: 'By invitation',
}

type Strings = typeof en

const zh: Strings = {
  discover: '探索',
  collection: '系列',
  salons: '沙龙',
  membership: '会员',
  tagline: '来自山东的丝与茶',
  limitedRelease: '限量发售',
  pieces: (n) => `限量${n}件`,
  left: (n) => `余${n}件`,
  windowOpen: '您的预留通道已开放',
  windowOpens: (d) => `您的预留通道将于${d}开放`,
  windows: '预留通道',
  discoverMore: '了解更多',
  privateSalons: '私享沙龙',
  reserveSeat: '预留席位',
  seatsLeft: (n, of) => `共${of}席，余${n}席`,
  invitedFrom: '受邀等级',
  stories: '故事',
  read: '阅读',
  boutiques: '精品店',
  bookAppointment: '预约到店',
  all: '全部',
  limited: '限量',
  reserve: '预留此作品',
  reserveTry: '预约到店试戴',
  pickBoutique: '选择精品店',
  saveWishlist: '加入心愿单',
  saved: '已加入心愿单',
  reserved: '已为您预留，专属顾问已收到通知。',
  booked: '席位已为您预留，专属顾问已收到通知。',
  full: '已全部预留',
  passed: '此沙龙已结束',
  already: '您已预留',
  notYet: '尚未对您的等级开放',
  cardTitle: '会员卡',
  memberNo: '会员号',
  chooseAvatar: '选择头像',
  nickname: '您的称呼',
  nicknamePlaceholder: '我们该如何称呼您？',
  reservations: '您的预留',
  none: '暂无预留。',
  vipPass: '您的邀请卡',
  demo: '演示：切换等级',
  appointment: '预约',
  pickDay: '选择日期',
  pickTime: '选择时间',
  confirm: '确认',
  appointmentDone: '预约已确认，专属顾问已收到通知。',
  slotTaken: '该时段刚被预约，请选择其他时间。',
  welcome: '欢迎光临',
  checkingIn: '正在通知您的专属顾问…',
  checkedIn: '您的专属顾问已收到通知，即刻为您服务。',
  expired: '此二维码已过期，请重新扫描屏幕。',
  offline: '离线中：显示您上次浏览的内容。',
  error: '出现问题，请重试。',
  retry: '重试',
  kind: { limited: '限量作品', try: '到店试戴', salon: '沙龙席位', appointment: '预约' },
  until: '保留至',
  nextTier: (name, amount) => `年消费满${amount}即可升至${name}`,
  invitationOnly: '仅限受邀',
}

export const lang = (): Lang => store.get<Lang>('lang') ?? 'en'
export const t = (): Strings => (lang() === 'zh-hans' ? zh : en)

export const TIERS = [
  { en: '', zh: '' },
  { en: 'Thread', zh: '丝' },
  { en: 'Satin', zh: '缎' },
  { en: 'Brocade', zh: '锦' },
  { en: 'Kesi', zh: '缂丝' },
]

export function setLang(next: Lang) {
  store.set('lang', next)
  const s = t()
  // Tab labels live in the native tab bar, outside the pages.
  ;[s.discover, s.collection, s.salons, s.membership].forEach((text, index) => Taro.setTabBarItem({ index, text }).catch(() => {}))
  Taro.eventCenter.trigger('lang', next)
}

const pad = (n: number) => String(n).padStart(2, '0')
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_ZH = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/** Boutique time (Shanghai, UTC+8), formatted by hand: Intl is incomplete in some WeChat JS engines. */
export function when(iso: string, withTime = true) {
  const d = new Date(Date.parse(iso) + 8 * 3_600_000)
  const time = withTime ? ` ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}` : ''
  return lang() === 'zh-hans'
    ? `${d.getUTCMonth() + 1}月${d.getUTCDate()}日 ${DAYS_ZH[d.getUTCDay()]}${time}`
    : `${DAYS_EN[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}${time ? ' ·' + time : ''}`
}

export const price = (n: number) => `¥${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`

/** When this client's window opens for a limited piece (Kesi first, a day later per tier). */
export function windowLine(p: Product, rank: number) {
  const opens = p.limited?.windows.find((w) => w.tierRank === rank)?.opensAt
  return opens && Date.parse(opens) > Date.now() ? t().windowOpens(when(opens, false)) : t().windowOpen
}
