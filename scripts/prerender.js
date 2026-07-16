import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '../dist-ssr/entry-server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')

const routes = ['/', '/maison-aurelie', '/marbre-grand', '/lumiere-atelier']

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')
  // Drop the static fallback tags — the SSR output supplies the real ones.
  .replace(/<title>[\s\S]*?<\/title>\s*/, '')
  .replace(/<meta name="description"[^>]*\/?>\s*/, '')

// React 19 hoists <title>/<meta>/<link>/<script> anywhere in the tree into
// the renderToString() output itself rather than a separate head buffer, so
// they show up inline in `html` ahead of the visible markup. Pull them back
// out here: the extracted tags go into <head>, the remainder is the real
// #root content.
const HEAD_TAG_RE = /<title>[\s\S]*?<\/title>|<meta[^>]*\/?>|<link[^>]*\/?>|<script type="application\/ld\+json">[\s\S]*?<\/script>/g

for (const url of routes) {
  const { html } = render(url)
  const headTags = html.match(HEAD_TAG_RE) ?? []
  const rootHtml = html.replace(HEAD_TAG_RE, '')

  const page = template
    .replace('</head>', `${headTags.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`)

  const outPath = url === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, url, 'index.html')

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, page)
  console.log(`prerendered ${url} -> ${path.relative(root, outPath)}`)
}
