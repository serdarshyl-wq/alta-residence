// Client-side counterpart to the <title>/<meta>/<script> JSX rendered
// server-side for prerendering. Those tags are NOT part of the hydrated
// React tree (see App.jsx / HomeDetails.jsx) — the prerender script strips
// them out of the SSR string and places them directly in the static file's
// <head>, so if the client tried to render the same tags as JSX, hydration
// would expect them at that tree position and find nothing there, which is
// exactly the mismatch (#418) this file exists to avoid. Plain DOM writes
// in an effect never participate in hydration comparison.
function setMeta(selector, attr, content) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [, name] = selector.match(/\[(\w+)=/)
    const [, value] = selector.match(/=(?:"|')([^"']+)/)
    el.setAttribute(name, value)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, content)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(data) {
  let el = document.head.querySelector('script[type="application/ld+json"][data-dynamic]')
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-dynamic', '')
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function applyMeta({ title, description, canonical, ogTitle, ogDescription, ogImage, ogUrl, jsonLd }) {
  document.title = title
  setMeta('meta[name="description"]', 'content', description)
  setLink('canonical', canonical)

  setMeta('meta[property="og:title"]', 'content', ogTitle)
  setMeta('meta[property="og:description"]', 'content', ogDescription)
  setMeta('meta[property="og:image"]', 'content', ogImage)
  setMeta('meta[property="og:url"]', 'content', ogUrl)

  setMeta('meta[name="twitter:title"]', 'content', ogTitle)
  setMeta('meta[name="twitter:description"]', 'content', ogDescription)
  setMeta('meta[name="twitter:image"]', 'content', ogImage)

  if (jsonLd) setJsonLd(jsonLd)
}
