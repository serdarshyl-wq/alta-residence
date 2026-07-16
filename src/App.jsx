import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import About from './components/About'
import OurLivings from './components/OurLivings'
import OurBeliefs from './components/OurBeliefs'
import Amenities from './components/Amenities'
import Faq from './components/Faq'
import Reservation from './components/Reservation'
import Footer from './components/Footer'
import HomeDetails from './components/HomeDetails'
import { preloadAllLivingImages } from './utils/preloadLivingImages'
import { initLenis, destroyLenis } from './utils/lenis'
import { LIVING_SLUGS, SLUG_TO_LIVING } from './utils/livingSlugs'
import { SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, OG_IMAGE, getHomeSchema } from './utils/seo'

gsap.registerPlugin(ScrollTrigger)

function App({ url } = {}) {
  const navbarHeaderRef    = useRef()
  const navbarLineRef      = useRef()
  const heroLogoLettersRef = useRef([])
  const heroTextRef        = useRef()

  const [activeLiving, setActiveLiving] = useState(() => {
    const pathname = url ?? (typeof window !== 'undefined' ? window.location.pathname : '/')
    const slug = pathname.replace(/^\/+|\/+$/g, '')
    return SLUG_TO_LIVING[slug] || null
  })

  useEffect(() => {
    initLenis()
    return () => destroyLenis()
  }, [])

  // Keep the URL in sync with the open HomeDetails overlay — one living per
  // path, "/" when closed — and let back/forward navigate the overlay too.
  useEffect(() => {
    const targetPath = activeLiving ? `/${LIVING_SLUGS[activeLiving]}` : '/'
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ activeLiving }, '', targetPath)
    }
  }, [activeLiving])

  useEffect(() => {
    const handlePopState = () => {
      const slug = window.location.pathname.replace(/^\/+|\/+$/g, '')
      setActiveLiving(SLUG_TO_LIVING[slug] || null)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const handleVideoReady = ({ detail: { duration: d } }) => {
      const seg = d / 4  // 3s ÷ 4 = 0.75s per step

      gsap.set(heroLogoLettersRef.current, { y: '110%' })
      gsap.set(heroTextRef.current,        { y: 70, opacity: 0 })
      gsap.set(navbarHeaderRef.current,    { y: -120, opacity: 0 })
      gsap.set(navbarLineRef.current,      { scaleX: 0, transformOrigin: 'center' })

      gsap.timeline()
        .to(heroLogoLettersRef.current, {
          y: '0%',
          duration: seg * 0.6,
          stagger: seg * 0.1,
          ease: 'power3.out',
        })
        .to(heroTextRef.current,        { y: 0, opacity: 1, duration: seg, ease: 'power3.out' })
        .to(navbarHeaderRef.current,    { y: 0, opacity: 1, duration: seg, ease: 'power3.out' })
        .to(navbarLineRef.current,      { scaleX: 1,        duration: seg, ease: 'power2.inOut' })
    }

    window.addEventListener('videoReady', handleVideoReady)
    return () => window.removeEventListener('videoReady', handleVideoReady)
  }, [])

  // Warm the browser cache for room detail images so the first HomeDetails
  // open doesn't stall on decoding multi-megapixel images mid-animation.
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preloadAllLivingImages, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(preloadAllLivingImages, 1500)
    return () => clearTimeout(id)
  }, [])

  // Images/fonts finishing to load after mount can change section heights,
  // which leaves every already-registered ScrollTrigger pointing at a stale
  // scroll position. A refresh once everything has actually settled fixes it.
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <>
      {/* React 19 hoists <title>/<meta>/<link>/<script> anywhere in the tree
          into <head> on its own, both during SSR and on the client — no
          Helmet library needed, and none of the double-management conflicts
          that come with layering one on top of React's native handling.
          Still only one of these blocks may be mounted at a time — HomeDetails
          renders its own when a living is open. */}
      {!activeLiving && (
        <>
          <title>{DEFAULT_TITLE}</title>
          <meta name="description" content={DEFAULT_DESCRIPTION} />
          <link rel="canonical" href={`${SITE_URL}/`} />

          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="og:title" content={DEFAULT_TITLE} />
          <meta property="og:description" content={DEFAULT_DESCRIPTION} />
          <meta property="og:image" content={OG_IMAGE} />
          <meta property="og:url" content={`${SITE_URL}/`} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={DEFAULT_TITLE} />
          <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
          <meta name="twitter:image" content={OG_IMAGE} />

          <script type="application/ld+json">
            {JSON.stringify(getHomeSchema())}
          </script>
        </>
      )}

      <Navbar headerRef={navbarHeaderRef} lineRef={navbarLineRef} setActiveLiving={setActiveLiving} />
      <Hero   logoLettersRef={heroLogoLettersRef} textRef={heroTextRef} />
      <About />
      <OurLivings setActiveLiving={setActiveLiving} />
      <OurBeliefs />
      <Amenities />
      <Faq />
      <Reservation />
      <Footer />
      <HomeDetails
        key={activeLiving || 'closed'}
        activeLiving={activeLiving}
        onClose={() => setActiveLiving(null)}
      />
    </>
  )
}

export default App
