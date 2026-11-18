import Taro from '@tarojs/taro'

type Entry<T> = { v: T; at: number }

/** Local storage with a timestamp, so screens can show the last good copy offline and know how old it is. */
export const store = {
  get<T>(key: string, maxAgeMs = Infinity): T | undefined {
    try {
      const e = Taro.getStorageSync(key) as Entry<T> | ''
      if (e && Date.now() - e.at <= maxAgeMs) return e.v
    } catch {
      // storage unavailable (private mode, quota): behave as empty
    }
    return undefined
  },
  set<T>(key: string, v: T) {
    try {
      Taro.setStorageSync(key, { v, at: Date.now() } satisfies Entry<T>)
    } catch {
      // ignore: the app works without the offline copy
    }
  },
  remove(key: string) {
    try {
      Taro.removeStorageSync(key)
    } catch {
      // ignore
    }
  },
}

/** A random id kept on this phone: it stands in for the WeChat identity in the mock login. */
export function deviceId() {
  let id = store.get<string>('device')
  if (!id) {
    id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
    store.set('device', id)
  }
  return id
}
