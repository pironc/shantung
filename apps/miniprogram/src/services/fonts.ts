import Taro from '@tarojs/taro'
import { BFF } from './api'

export const DISPLAY_FONT = 'Cormorant Garamond'

let loading: Promise<unknown> | undefined

/**
 * The display face (Cormorant Garamond, SIL OFL), served by the BFF: WeChat loads fonts from a URL.
 * `native` scope makes it usable on a 2D canvas too. Resolves either way: the system serif stands in.
 */
export function loadFonts() {
  loading ??= Promise.all(
    ['500', '600'].map((weight) =>
      Taro.loadFontFace({
        global: true,
        family: DISPLAY_FONT,
        source: `url("${BFF}/fonts/cormorant-garamond-latin-${weight}-normal.woff2")`,
        desc: { weight },
        scopes: ['webview', 'native'],
      } as Taro.loadFontFace.Option).catch(() => {}),
    ),
  )
  return loading
}
