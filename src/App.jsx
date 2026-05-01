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

gsap.registerPlugin(ScrollTrigger)

function App() {
  const navbarHeaderRef    = useRef()
  const navbarLineRef      = useRef()
  const heroLogoLettersRef = useRef([])
  const heroTextRef        = useRef()

  const [activeLiving, setActiveLiving] = useState(null)

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

  return (
    <>
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
