import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import type { Member } from '@shantung/shared-types'
import { deviceId, store } from './store'
import { lang } from './i18n'

export const BFF = process.env.TARO_APP_BFF_URL

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

async function raw<T>(method: Method, path: string, data?: object): Promise<T> {
  const token = store.get<string>('token')
  const res = await Taro.request<T>({
    url: `${BFF}${path}`,
    method,
    // A JSON content type with an empty body is refused by the BFF, so writes always send an object.
    data: method === 'GET' ? undefined : (data ?? {}),
    header: {
      'content-type': 'application/json',
      'accept-language': lang() === 'zh-hans' ? 'zh-CN' : 'en',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    timeout: 8000,
  })
  if (res.statusCode >= 400) throw new ApiError(res.statusCode, (res.data as { message?: string })?.message ?? 'Error')
  return res.data
}

/**
 * Sign in. A real Mini Program sends the code from Taro.login() and the BFF exchanges it with WeChat;
 * without a registered AppID this demo sends `mock_<device id>`, so the same phone stays the same client.
 * `persona` (1-4) lets the demo show each tier's card.
 */
export async function signIn(persona?: number) {
  const { token, member } = await raw<{ token: string; member: Member }>('POST', '/api/auth/wx-login', {
    code: `mock_${deviceId()}`,
    ...(persona ? { persona } : {}),
  })
  store.set('token', token)
  store.set('member', member)
  return member
}

/** Any call; signs in on the first 401 and tries once more. */
export async function api<T>(method: Method, path: string, data?: object): Promise<T> {
  if (!store.get<string>('token') && method !== 'GET') await signIn()
  try {
    return await raw<T>(method, path, data)
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await signIn()
      return raw<T>(method, path, data)
    }
    throw e
  }
}

const cacheKey = (path: string) => `cache:${lang()}:${path}`

/**
 * Offline-first read: shows the stored copy at once, then the network's. In a basement boutique with no
 * signal, the last good copy (up to a week old) stays on screen.
 */
export function useData<T>(path: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | undefined>(() => (path ? store.get<T>(cacheKey(path)) : undefined))
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!path) return
    const key = cacheKey(path)
    setData((d) => d ?? store.get<T>(key))
    let live = true
    api<T>('GET', path).then(
      (fresh) => {
        if (!live) return
        store.set(key, fresh)
        setData(fresh)
        setOffline(false)
        setError(null)
      },
      (e: Error) => {
        if (!live) return
        const copy = store.get<T>(key, 7 * 86_400_000)
        if (copy !== undefined) {
          setData(copy)
          setOffline(true)
        } else setError(e.message)
      },
    )
    return () => {
      live = false
    }
  }, [path, tick, lang(), ...deps])

  return { data, offline, error, reload: () => setTick((n) => n + 1) }
}

/** Re-render the page when the language changes (strings and catalog both switch). */
export function useLang() {
  const [current, setCurrent] = useState(lang())
  useEffect(() => {
    const on = (next: typeof current) => setCurrent(next)
    Taro.eventCenter.on('lang', on)
    return () => {
      Taro.eventCenter.off('lang', on)
    }
  }, [])
  return current
}
