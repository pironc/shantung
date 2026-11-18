import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '../../../opendesigner/build/css/tokens.css'
import './styles.css'
import { Portal } from './Portal'
import { Kiosk } from './Kiosk'

// Two screens, no router: /kiosk/<boutique code> is the entrance screen, everything else is the advisor portal.
const kiosk = location.pathname.match(/^\/kiosk\/([A-Z0-9]+)/i)?.[1]?.toUpperCase()
document.title = kiosk ? 'Shantung · Welcome' : 'Shantung · Advisor'

createRoot(document.getElementById('root')!).render(<StrictMode>{kiosk ? <Kiosk code={kiosk} /> : <Portal />}</StrictMode>)
