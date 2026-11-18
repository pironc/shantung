import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Input, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import type { Member, Reservation, Tier } from '@shantung/shared-types'
import { api, signIn, useData, useLang } from '../../services/api'
import { price, t, TIERS, when } from '../../services/i18n'
import { store } from '../../services/store'
import { TierCard } from '../../components/TierCard'
import { go, LangToggle, Notice } from '../../components/ui'

const AVATAR_PX = 256

/** WeChat hands back a local file; the browser build gets one from the file picker. Either way: a small JPEG data URL. */
async function avatarDataUrl(path: string): Promise<string> {
  if (process.env.TARO_ENV === 'weapp') {
    const base64 = Taro.getFileSystemManager().readFileSync(path, 'base64') as string
    return `data:image/jpeg;base64,${base64}`
  }
  const img = new window.Image()
  img.src = path
  await img.decode()
  const side = Math.min(img.width, img.height)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = AVATAR_PX
  canvas.getContext('2d')!.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, AVATAR_PX, AVATAR_PX)
  return canvas.toDataURL('image/jpeg', 0.85)
}

export default function Membership() {
  useLang()
  const s = t()
  const me = useData<Member>('/api/me')
  const tiers = useData<Tier[]>('/api/tiers')
  const reservations = useData<Reservation[]>('/api/me/reservations')
  const [notice, setNotice] = useState('')
  const [name, setName] = useState('')
  useDidShow(() => {
    Taro.setNavigationBarTitle({ title: s.membership })
    me.reload()
    reservations.reload()
  })

  const member = me.data
  // The field keeps what the client types; it is saved when they leave it.
  useEffect(() => setName(member?.nickname ?? ''), [member?.nickname])
  const saveName = () => name.trim() && name.trim() !== member?.nickname && update({ nickname: name.trim() })
  const tier = tiers.data?.find((x) => x.rank === member?.tierRank)
  const next = tiers.data?.find((x) => x.rank === (member?.tierRank ?? 0) + 1 && !x.invitationOnly)

  const update = async (patch: Partial<Pick<Member, 'nickname' | 'avatarUrl'>>) => {
    try {
      store.set('member', await api<Member>('PATCH', '/api/me', patch))
      me.reload()
    } catch {
      setNotice(s.error)
    }
  }

  const pickAvatarInBrowser = async () => {
    const { tempFilePaths } = await Taro.chooseImage({ count: 1, sizeType: ['compressed'] })
    if (tempFilePaths[0]) update({ avatarUrl: await avatarDataUrl(tempFilePaths[0]) })
  }

  const viewAs = async (rank: number) => {
    await signIn(rank)
    me.reload()
  }

  return (
    <View className='ds'>
      <View className='page-head'>
        <View>
          <Text className='t-display'>{s.membership}</Text>
          <Text className='t-sub'>Shantung</Text>
        </View>
        <LangToggle />
      </View>

      <View className='wrap'>
        <Notice text={me.offline ? s.offline : notice || (me.error && s.error)} />
        {member && <TierCard member={member} />}
      </View>

      {member && (
        <View className='section stack'>
          {process.env.TARO_ENV === 'weapp' ? (
            // WeChat's own avatar picker: the client chooses what to share.
            <Button className='btn btn--ghost' openType='chooseAvatar' onChooseAvatar={async (e) => update({ avatarUrl: await avatarDataUrl(e.detail.avatarUrl) })}>
              {s.chooseAvatar}
            </Button>
          ) : (
            <Button className='btn btn--ghost' hoverClass='is-pressed' onClick={pickAvatarInBrowser}>
              {s.chooseAvatar}
            </Button>
          )}
          <Text className='t-label'>{s.nickname}</Text>
          <Input
            className='field'
            type='nickname'
            maxlength={32}
            value={name}
            placeholder={s.nicknamePlaceholder}
            onInput={(e) => setName(e.detail.value)}
            onBlur={saveName}
            onConfirm={saveName}
          />
        </View>
      )}

      {tier && (
        <View className='section stack'>
          <Text className='t-title'>
            {TIERS[tier.rank].zh} {TIERS[tier.rank].en}
          </Text>
          <Text>{tier.description}</Text>
          {next && <Text className='t-small t-muted'>{s.nextTier(`${TIERS[next.rank].zh} ${TIERS[next.rank].en}`, price(next.threshold))}</Text>}
          <View className='btn-text' hoverClass='is-pressed' ariaRole='button' onClick={() => go('/packages/pass/index')}>
            {s.vipPass} →
          </View>
          <View className='btn-text' hoverClass='is-pressed' ariaRole='button' onClick={() => go('/pages/appointment/index')}>
            {s.bookAppointment} →
          </View>
        </View>
      )}

      <View className='section'>
        <Text className='t-title'>{s.reservations}</Text>
        {(reservations.data ?? []).length === 0 && <Text className='t-muted'>{s.none}</Text>}
        {(reservations.data ?? []).map((r) => (
          <View key={r.id} className='row stack'>
            <Text className='t-label t-label--accent'>{s.kind[r.kind]}</Text>
            <Text>{r.title}</Text>
            {r.at && (
              <Text className='t-small t-muted'>
                {r.kind === 'try' ? `${s.until} ` : ''}
                {when(r.at)}
              </Text>
            )}
          </View>
        ))}
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
    </View>
  )
}
