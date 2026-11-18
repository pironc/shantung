import type { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { signIn } from './services/api'
import { loadFonts } from './services/fonts'
import { lang, setLang } from './services/i18n'
import { store } from './services/store'
import './app.css'

export default function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    loadFonts()
    setLang(lang()) // labels the native tab bar in the saved language
    if (!store.get('token')) signIn().catch(() => {}) // pages also sign in on demand
  })
  return children
}
