import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './index.css'
import { primeVoices } from './lib/speech'
import { requestPersist } from './db/db'

primeVoices()
void requestPersist()
registerSW({ immediate: true })

if ('serviceWorker' in navigator) {
  const checkForUpdate = () => {
    if (document.visibilityState !== 'visible') return
    void navigator.serviceWorker
      .getRegistration()
      .then((registration) => registration?.update())
      .catch(() => undefined)
  }
  document.addEventListener('visibilitychange', checkForUpdate)
  window.addEventListener('focus', checkForUpdate)
  void navigator.serviceWorker.ready
    .then((registration) => registration.update())
    .catch(() => undefined)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
