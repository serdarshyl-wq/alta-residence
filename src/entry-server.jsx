import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'

export function render(url) {
  const helmetContext = {}

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <App url={url} />
      </HelmetProvider>
    </StrictMode>
  )

  const { helmet } = helmetContext
  return { html, helmet }
}
