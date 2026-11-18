import type { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import { BFF, signIn } from './services/api'
import { lang, setLang } from './services/i18n'
import { store } from './services/store'
import './app.css'

export default function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    // The display face (Cormorant Garamond, SIL OFL), served by the BFF: WeChat loads fonts from a URL.
    for (const weight of ['500', '600']) {
      Taro.loadFontFace({
        global: true,
        family: 'Cormorant Garamond',
        source: `url("${BFF}/fonts/cormorant-garamond-latin-${weight}-normal.woff2")`,
        desc: { weight },
      }).catch(() => {}) // the system serif stands in
    }
    setLang(lang()) // labels the native tab bar in the saved language
    if (!store.get('token')) signIn().catch(() => {}) // pages also sign in on demand
  })
  return children
}
