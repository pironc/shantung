import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { Health } from '@shantung/shared-types'

// The browser runs on the host, so the BFF is reached through its published port, not the compose service name.
const BFF_URL = import.meta.env.VITE_BFF_URL ?? 'http://localhost:3000'

function App() {
  const [health, setHealth] = useState<Health | string>('loading…')

  useEffect(() => {
    fetch(`${BFF_URL}/health`)
      .then((r) => r.json())
      .then(setHealth, (e) => setHealth(`BFF unreachable: ${e}`))
  }, [])

  return (
    <main>
      <h1>Shantung Clienteling</h1>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
