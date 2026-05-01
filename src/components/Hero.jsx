import { useRef, useEffect } from 'react'
import '../css/Hero.css'
import Logo from './Logo'

function Hero({ logoLettersRef, textRef }) {
  const videoRef = useRef()

  useEffect(() => {
    const video = videoRef.current
    const handleMetadata = () => {
      window.dispatchEvent(new CustomEvent('videoReady', { detail: { duration: video.duration } }))
    }
    video.addEventListener('loadedmetadata', handleMetadata)
    return () => video.removeEventListener('loadedmetadata', handleMetadata)
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="hero-video"
        src="/products/hero.mp4"
        autoPlay
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="hero-bottom-bar absolute bottom-8 left-24 right-16 flex items-end gap-10">

        <Logo className="hero-logo text-[24rem]" lettersRef={logoLettersRef} />

        <div ref={textRef} className="hero-text-container flex flex-col items-start gap-6 pb-4 w-md shrink-0">
          <div className="flex flex-col gap-4">
            <p
              className="hero-subtitle text-[1.6rem] font-semibold uppercase leading-snug"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', letterSpacing: '0.06em' }}
            >
              holistic luxury in perfect harmony
            </p>
            <p
              className="hero-description text-[1.2rem] font-semibold leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
            >
              Welcome to Altra Residence, where timeless design, wellness-focused living and cultural enrichment converge in order to create an unparalleled sanctuary of elegance and serenity.
            </p>
          </div>

          <div
            className="hero-scroll flex flex-col items-start gap-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', letterSpacing: '0.25em' }}
          >
            <span className="text-[1rem] font-medium uppercase">Scroll</span>
            <div className="w-px h-10" style={{ background: 'var(--color-text)' }} />
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
