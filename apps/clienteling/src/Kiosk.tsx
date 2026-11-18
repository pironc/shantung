import { useEffect, useState } from 'react'
import qrcode from 'qrcode-generator'
import type { Boutique } from '@shantung/shared-types'
import { api, MINI } from './api'

// QR specification: scanners need a blank border of at least 4 modules around the code.
const QUIET_ZONE_MODULES = 4

/** QR code as an SVG string: dark modules on white, with the quiet zone scanners need. */
function qrSvg(text: string) {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  return qr.createSvgTag({ cellSize: 6, margin: QUIET_ZONE_MODULES, scalable: true })
}

export function Kiosk({ code }: { code: string }) {
  const [shop, setShop] = useState<Boutique | null>(null)
  const [token, setToken] = useState<{ token: string; expiresAt: string } | null>(null)
  const [welcome, setWelcome] = useState(false)

  useEffect(() => {
    api.boutiques().then((list) => setShop(list.find((b) => b.code === code) ?? null), () => {})
  }, [code])

  // The token changes every five minutes; fetch the next one when this one expires.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const refresh = () =>
      api.kioskToken(code).then(
        (t) => {
          setToken(t)
          timer = setTimeout(refresh, Math.max(5_000, new Date(t.expiresAt).getTime() - Date.now() + 1_000))
        },
        () => (timer = setTimeout(refresh, 10_000)),
      )
    refresh()
    return () => clearTimeout(timer)
  }, [code])

  // A public screen: greet the arrival without showing who it is.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const stop = api.feed(
      (e) => {
        if (e.type === 'arrival' && shop && e.boutique === shop.title) {
          setWelcome(true)
          clearTimeout(timer)
          timer = setTimeout(() => setWelcome(false), 8_000)
        }
      },
      () => {},
    )
    return () => {
      stop()
      clearTimeout(timer)
    }
  }, [shop])

  // In WeChat this would be a Mini Program code (wxacode) carrying the same two values; the demo opens the browser build.
  const url = token && `${MINI}/#/pages/checkin/index?b=${code}&t=${token.token}`

  return (
    <div className="kiosk">
      {shop?.image && <img className="kiosk__photo" src={shop.image.url} alt="" />}
      <div className="kiosk__panel">
        <p className="wordmark">Shantung</p>
        {welcome ? (
          <div className="enter" key="welcome">
            <h1 className="display">Welcome</h1>
            <p className="kiosk__line">Your advisor has been told and will be with you shortly.</p>
            <p className="kiosk__line" lang="zh-Hans">
              欢迎光临，您的专属顾问即刻为您服务。
            </p>
          </div>
        ) : (
          <div className="enter" key="scan">
            <h1 className="display">{shop ? shop.city : ' '}</h1>
            {url ? (
              <a className="kiosk__qr" href={url} target="_blank" rel="noreferrer" aria-label="Check in (opens the client app)">
                <span dangerouslySetInnerHTML={{ __html: qrSvg(url) }} />
              </a>
            ) : (
              <div className="kiosk__qr kiosk__qr--loading" />
            )}
            <p className="kiosk__line">Scan with WeChat to let your advisor know you have arrived.</p>
            <p className="kiosk__line" lang="zh-Hans">
              微信扫一扫，通知您的专属顾问。
            </p>
            <p className="label">The code renews every five minutes</p>
          </div>
        )}
      </div>
    </div>
  )
}
