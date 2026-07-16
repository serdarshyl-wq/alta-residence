import livingDetails from '../data/livingDetails.json'

const preloaded = new Set()

export function preloadLivingImages(name) {
  if (preloaded.has(name)) return
  const details = livingDetails[name]
  if (!details) return
  preloaded.add(name)

  details.rooms.forEach(({ image, thumb }) => {
    [image, thumb].filter(Boolean).forEach((src) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
      // .src alone only fetches the bytes — nothing rasterizes an off-DOM
      // image until decode() is called, so force it here instead of paying
      // that cost when the real <img> mounts mid-animation.
      img.decode?.().catch(() => {})
    })
  })
}

export function preloadAllLivingImages() {
  Object.keys(livingDetails).forEach(preloadLivingImages)
}
