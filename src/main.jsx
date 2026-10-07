import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts (bundled by Vite — no request to a third-party font
// service). Each is a variable font, so one file covers every weight, and
// Noto Sans KR is split into small unicode-range subsets so a visitor only
// downloads the Hangul blocks this site actually uses.
import '@fontsource-variable/unbounded'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/noto-sans-kr'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
