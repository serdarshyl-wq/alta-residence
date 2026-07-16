import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X } from 'lucide-react'
import { getLenis } from '../utils/lenis'
import '../css/Reservation.css'

function ReservationNotice({ onClose }) {
  const overlayRef = useRef()
  const cardRef = useRef()

  const handleClose = () => {
    gsap.to(cardRef.current, { opacity: 0, y: 12, scale: 0.97, duration: 0.25, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: onClose })
  }

  const handleCloseRef = useRef(handleClose)
  useEffect(() => {
    handleCloseRef.current = handleClose
  })

  useEffect(() => {
    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'

    gsap.set(overlayRef.current, { opacity: 0 })
    gsap.set(cardRef.current, { opacity: 0, y: 24, scale: 0.96 })
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    gsap.to(cardRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', delay: 0.05 })

    const handleKeyDown = (e) => { if (e.key === 'Escape') handleCloseRef.current() }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [])

  return createPortal(
    <div
      ref={overlayRef}
      className="res-notice-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div ref={cardRef} className="res-notice-card">
        <button className="res-notice-close" onClick={handleClose} aria-label="Close">
          <X size={20} strokeWidth={1.5} />
        </button>
        <span className="res-notice-eyebrow">A Small Note</span>
        <h3 className="res-notice-title">This Is a Design Concept</h3>
        <p className="res-notice-text">
          Altra Residence is a fully custom web project, built purely to explore
          interactive design and motion craft — it isn't a real property listing.
          This form doesn't send anywhere, and no one will be in touch. Thank you
          for taking the time to look around. If you'd like a fully functional
          site like this one built for you, feel free to reach out at{' '}
          <a href="mailto:serdar.shyl@gmail.com" className="res-notice-link">serdar.shyl@gmail.com</a>{' '}
          or through{' '}
          <a href="https://temnyy.dev" target="_blank" rel="noopener noreferrer" className="res-notice-link">temnyy.dev</a>.
        </p>
        <button className="res-notice-btn" onClick={handleClose}>Understood</button>
      </div>
    </div>,
    document.body
  )
}

export default function Reservation() {
  const wrapperRef = useRef()
  const imageRef = useRef()
  const [showNotice, setShowNotice] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prevEl = wrapperRef.current.previousElementSibling
      if (prevEl) {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: 'top bottom',
          end: 'top top',
          pin: prevEl,
          pinSpacing: false,
        })
      }

      gsap.fromTo(
        imageRef.current,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      )
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="reservation-section"
      ref={wrapperRef}
      className="res-section relative overflow-hidden z-50 min-h-[125vh] bg-(--color-bg)"
    >

      <div className="res-img-wrap absolute top-0 left-0 w-full h-screen">
        <img
          ref={imageRef}
          src="/products/r-1.webp"
          alt="Alta exterior at dusk"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-[55%] res-overlay-gradient z-10" />
      </div>

      <div className="res-text-wrap absolute z-20 top-[12vh] left-[6vw] max-w-lg">
        <h2
          className="res-text-title italic uppercase leading-[1.05] font-(--font-heading) text-(--color-text) text-[clamp(2rem,3vw,3rem)] tracking-[0.02em]"
        >
          Discover the essence<br />of calm living
        </h2>
        <p
          className="res-text-desc mt-10 leading-relaxed font-(--font-body) text-(--color-text) text-[1.1rem] max-w-md"
        >
          Experience the harmony of timeless design and wellness-centered
          living. Schedule a private viewing or request a brochure to begin
          your journey toward refined serenity.
        </p>
      </div>

      <div
        className="res-card-wrap absolute z-30 flex flex-col justify-start top-[20vh] right-[5vw] w-[42vw] max-w-184 h-screen bg-[#1d3834] px-20 pt-20 pb-16"
      >
        <h3
          className="res-card-title text-center uppercase leading-[1.05] font-(--font-heading) text-(--color-text) text-[clamp(2.8rem,4.5vw,4.5rem)] tracking-[0.02em]"
        >
          Envision <em>your</em><br /><em>life at Altra</em>
        </h3>

        <p
          className="res-card-desc text-center mt-8 font-(--font-body) text-(--color-text-muted) text-[1.2rem]"
        >
          Our manager will contact you as soon as possible.
        </p>

        <form className="mt-16 flex flex-col gap-10">
          <input className="res-form-input" placeholder="NAME" />
          <input className="res-form-input" placeholder="EMAIL" />
          <input className="res-form-input" placeholder="PHONE" />

          <button
            type="button"
            onClick={() => setShowNotice(true)}
            className="mt-10 rounded-full py-8 uppercase tracking-[0.2em] transition-colors duration-300 font-(--font-heading) bg-(--color-text) text-(--color-bg-deep) text-[1.75rem]"
          >
            Request
          </button>

          <p
            className="text-center mx-auto leading-relaxed font-(--font-body) text-(--color-text-muted) text-[1.1rem] max-w-120"
          >
            By sending your request, you're agreeing to our privacy policy.<br />
            We promise to keep your personal information safe and secure.
          </p>
        </form>
      </div>

      {showNotice && <ReservationNotice onClose={() => setShowNotice(false)} />}

    </section>
  )
}
