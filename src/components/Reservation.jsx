import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../css/Reservation.css'

export default function Reservation() {
  const wrapperRef = useRef()
  const imageRef = useRef()

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
      className="res-section relative overflow-hidden z-50"
      style={{ minHeight: '125vh', background: 'var(--color-bg)' }}
    >

      <div className="res-img-wrap absolute top-0 left-0 w-full" style={{ height: '100vh' }}>
        <img
          ref={imageRef}
          src="/products/r-1.webp"
          alt="Alta exterior at dusk"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-[55%] res-overlay-gradient z-10" />
      </div>

      <div className="res-text-wrap absolute z-20" style={{ top: '12vh', left: '6vw', maxWidth: '32rem' }}>
        <h2
          className="res-text-title italic uppercase leading-[1.05]"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            letterSpacing: '0.02em',
          }}
        >
          Discover the essence<br />of calm living
        </h2>
        <p
          className="res-text-desc mt-10 leading-relaxed"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            fontSize: '1.1rem',
            maxWidth: '28rem',
          }}
        >
          Experience the harmony of timeless design and wellness-centered
          living. Schedule a private viewing or request a brochure to begin
          your journey toward refined serenity.
        </p>
      </div>

      <div
        className="res-card-wrap absolute z-30 flex flex-col justify-start"
        style={{
          top: '20vh',
          right: '5vw',
          width: '42vw',
          maxWidth: '46rem',
          height: '100vh',
          background: '#1d3834',
          padding: '5rem 5rem 4rem',
        }}
      >
        <h3
          className="res-card-title text-center uppercase leading-[1.05]"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
            fontSize: 'clamp(2.8rem, 4.5vw, 4.5rem)',
            letterSpacing: '0.02em',
          }}
        >
          Envision <em>your</em><br /><em>life at Elyse</em>
        </h3>

        <p
          className="res-card-desc text-center mt-8"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-muted)',
            fontSize: '1.2rem',
          }}
        >
          Our manager will contact you as soon as possible.
        </p>

        <form className="mt-16 flex flex-col gap-10">
          <input className="res-form-input" placeholder="NAME" />
          <input className="res-form-input" placeholder="EMAIL" />
          <input className="res-form-input" placeholder="PHONE" />

          <button
            type="button"
            className="mt-10 rounded-full py-8 uppercase tracking-[0.2em] transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-heading)',
              background: 'var(--color-text)',
              color: 'var(--color-bg-deep)',
              fontSize: '1.35rem',
            }}
          >
            Request
          </button>

          <p
            className="text-center mx-auto leading-relaxed"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-muted)',
              fontSize: '1.1rem',
              maxWidth: '30rem',
            }}
          >
            By sending your request, you're agreeing to our privacy policy.<br />
            We promise to keep your personal information safe and secure.
          </p>
        </form>
      </div>

    </section>
  )
}
