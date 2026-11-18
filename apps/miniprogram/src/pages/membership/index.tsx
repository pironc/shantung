import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Input, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Boutique, Member, Product, Reservation, Salon, Tier } from '@shantung/shared-types'
import { api, signIn, useData, useLang } from '../../services/api'
import { lang, setLang, t, TIERS, when } from '../../services/i18n'
import { store } from '../../services/store'
import { Monogram, TierCard } from '../../components/TierCard'
import { Icon, MenuRow, Notice, Photo, SheetFrame, chromeStyle, go, usePageEnter, usePopup, useSheet } from '../../components/ui'
import { fretUri } from '../../components/art'
import { theme } from '../../theme'

const AVATAR_PX = 256

/** A square JPEG data URL, small enough to store with the profile. */
function squareJpeg(img: HTMLImageElement) {
  const side = Math.min(img.width, img.height)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = AVATAR_PX
  canvas.getContext('2d')!.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, AVATAR_PX, AVATAR_PX)
  return canvas.toDataURL('image/jpeg', 0.85)
}

/** WeChat hands back a local file from its own (localised) avatar picker. */
const weappAvatar = (path: string) => `data:image/jpeg;base64,${Taro.getFileSystemManager().readFileSync(path, 'base64') as string}`

/** The browser build opens the phone's own photo picker (localised by the phone, unlike Taro's menu). */
const browserAvatar = () =>
  new Promise<string | null>((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      const img = new window.Image()
      img.onload = () => resolve(squareJpeg(img))
      img.onerror = () => resolve(null)
      img.src = URL.createObjectURL(file)
    }
    input.click()
  })

export default function Membership() {
  useLang()
  const s = t()
  const enter = usePageEnter()
  const me = useData<Member>('/api/me')
  const tiers = useData<Tier[]>('/api/tiers')
  const reservations = useData<Reservation[]>('/api/me/reservations')
  const products = useData<Product[]>('/api/products')
  const salons = useData<Salon[]>('/api/salons')
  const boutiques = useData<Boutique[]>('/api/boutiques')
  const { popup, show } = usePopup()
  const { sheet, show: choose } = useSheet()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  useDidShow(() => {
    me.reload()
    reservations.reload()
  })

  const member = me.data
  useEffect(() => setName(member?.nickname ?? ''), [member?.nickname, editing])
  const tier = tiers.data?.find((x) => x.rank === member?.tierRank)

  const update = async (patch: Partial<Pick<Member, 'nickname' | 'avatarUrl'>>) => {
    try {
      store.set('member', await api<Member>('PATCH', '/api/me', patch))
      me.reload()
    } catch {
      show({ title: s.errorTitle, text: s.error })
    }
  }

  const saveName = async () => {
    setEditing(false)
    if (name.trim() && name.trim() !== member?.nickname) await update({ nickname: name.trim() })
  }

  const chooseLanguage = () =>
    choose(s.language, [
      { label: 'English', selected: lang() === 'en', run: () => setLang('en') },
      { label: '简体中文', selected: lang() === 'zh-hans', run: () => setLang('zh-hans') },
    ])

  const viewAs = async (rank: number) => {
    await signIn(rank)
    me.reload()
  }

  return (
    <View className={`ds ${enter}`} style={chromeStyle()}>
      {/* The card sits on a coloured stage so it reads as an object: lacquer red, or ink for the red Brocade card. */}
      <View
        className={`stage ${member?.tierRank === 3 ? 'stage--ink' : ''}`}
        // Hui wen fret, the border motif of silk, faded into the stage: ink on red, ivory on ink.
        style={{ backgroundImage: `url(${member?.tierRank === 3 ? fretUri(theme.paper, 0.08) : fretUri()})` }}
      >
        <Text className='t-display'>{s.membership}</Text>
        {member && <TierCard member={member} />}
        {tier && (
          <View className='stack'>
            <Text className='t-title'>
              {TIERS[tier.rank].zh} {TIERS[tier.rank].en}
            </Text>
            <Text className='clamp-2'>{tier.description}</Text>
          </View>
        )}
      </View>

      <View className='wrap'>
        <Notice text={me.offline ? s.offline : me.error && s.error} />
      </View>

      {member && (
        <View className='section'>
          <View className='profile-row' hoverClass='is-pressed-row' ariaRole='button' onClick={() => setEditing(true)}>
            <Monogram member={member} className='profile-row__photo' />
            <Text className={`profile-row__name ${member.nickname ? '' : 't-muted'}`}>{member.nickname || s.addName}</Text>
            <Text className='btn-text'>{s.edit}</Text>
          </View>
        </View>
      )}

      <View className='section'>
        <View className='menu'>
          <MenuRow label={s.vipPass} onClick={() => go('/packages/pass/index')} />
          <MenuRow label={s.bookAppointment} onClick={() => go('/pages/appointment/index')} />
          <MenuRow label={s.language} value={s.languageName} onClick={chooseLanguage} />
        </View>
      </View>

      <View className='section'>
        <Text className='t-title'>{s.reservations}</Text>
        {(reservations.data ?? []).length === 0 && <Text className='t-muted'>{s.none}</Text>}
        <View className='bookings'>
          {(reservations.data ?? []).map((r) => {
            // Each reservation opens what it is for: the piece, the salon, or the boutique of the appointment.
            const product = products.data?.find((x) => x.id === r.itemId)
            const salon = salons.data?.find((x) => x.id === r.itemId)
            const shop = boutiques.data?.find((x) => x.code === r.boutique)
            const target =
              r.kind === 'salon' ? `/pages/salon/index?id=${r.itemId}` : r.kind === 'appointment' ? `/pages/boutique/index?code=${r.boutique}` : `/pages/product/index?id=${r.itemId}`
            return (
              <View key={r.id} className='booking' hoverClass='is-pressed-row' ariaRole='link' onClick={() => go(target)}>
                <View className='booking__thumb'>
                  <Photo image={salon?.image ?? product?.images[0] ?? shop?.image} ratio={125} />
                </View>
                <View className='booking__text'>
                  <Text className='t-label t-label--accent'>{s.kind[r.kind]}</Text>
                  <Text className='booking__title'>{salon?.title ?? product?.title ?? shop?.title ?? r.title}</Text>
                  {r.at && (
                    <Text className='t-small t-muted'>
                      {r.kind === 'try' ? `${s.until} ` : ''}
                      {when(r.at)}
                    </Text>
                  )}
                  <Text className='t-small t-muted'>{shop?.title}</Text>
                </View>
                <Icon name='chevron' />
              </View>
            )
          })}
        </View>
      </View>

      <View className='section stack'>
        <Text className='t-label'>{s.demo}</Text>
        <View className='chips'>
          {[1, 2, 3, 4].map((rank) => (
            <Text key={rank} className={`chip ${member?.tierRank === rank ? 'is-active' : ''}`} ariaRole='radio' ariaChecked={member?.tierRank === rank} onClick={() => viewAs(rank)}>
              {TIERS[rank].zh} {TIERS[rank].en}
            </Text>
          ))}
        </View>
      </View>
      <View className='spacer' />

      {/* Profile editor: photo and name in a sheet, so the page itself stays compact. */}
      {editing && member && (
        <SheetFrame title={s.profile} onClose={() => setEditing(false)}>
          <View className='profile-edit'>
            <Monogram member={member} className='profile-edit__photo' />
            {process.env.TARO_ENV === 'weapp' ? (
              <Button className='btn-text profile-edit__photo-btn' openType='chooseAvatar' onChooseAvatar={(e) => update({ avatarUrl: weappAvatar(e.detail.avatarUrl) })}>
                {s.changePhoto}
              </Button>
            ) : (
              <View className='btn-text' hoverClass='is-pressed' ariaRole='button' onClick={() => browserAvatar().then((url) => (url ? update({ avatarUrl: url }) : undefined))}>
                {s.changePhoto}
              </View>
            )}
          </View>
          <Text className='t-label'>{s.nickname}</Text>
          <Input className='field' type='nickname' maxlength={32} value={name} placeholder={s.nicknamePlaceholder} onInput={(e) => setName(e.detail.value)} onConfirm={saveName} />
          <Button className='btn profile-edit__save' hoverClass='is-pressed' onClick={saveName}>
            <Text>{s.save}</Text>
          </Button>
        </SheetFrame>
      )}
      {sheet}
      {popup}
    </View>
  )
}
