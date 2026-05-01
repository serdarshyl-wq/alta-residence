import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../css/Footer.css'

function Footer() {
  const sectionRef = useRef()
  const itemRefs = useRef([])

  useEffect(() => {
    gsap.set(itemRefs.current, { y: '110%' })

    gsap.to(itemRefs.current, {
      y: '0%',
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <footer
      ref={sectionRef}
      className="footer-section relative px-24"
      style={{
        background: 'var(--color-bg)',
        paddingTop: '10rem',
        paddingBottom: '5rem',
      }}
    >

      <div className="footer-top-grid grid grid-cols-[2fr_1fr_1.2fr] gap-12">

        <div className="footer-col-1">
          <span className="footer-label">(Get in Touch)</span>
          <div className="footer-divider mt-4" />
          <div className="footer-clip" style={{ marginTop: '6rem' }}>
            <h2
              ref={el => { itemRefs.current[0] = el }}
              className="footer-brand footer-inner"
            >
              ALTRA
            </h2>
          </div>
        </div>

        <div className="footer-col-2">
          <span className="footer-label">(Location)</span>
          <div className="footer-divider mt-4" />
          <div className="footer-clip" style={{ marginTop: '6rem' }}>
            <p
              ref={el => { itemRefs.current[1] = el }}
              className="footer-text footer-inner"
            >
              This is a custom project —<br />
              location is for display only.
            </p>
          </div>
        </div>

        <div className="footer-col-3">
          <span className="footer-label">(Contact)</span>
          <div className="footer-divider mt-4" />
          <div className="footer-clip" style={{ marginTop: '6rem' }}>
            <p
              ref={el => { itemRefs.current[2] = el }}
              className="footer-text footer-inner"
              style={{ fontStyle: 'italic' }}
            >
              This is a custom project —<br />
              contact details are not real.
            </p>
          </div>
        </div>

      </div>

      <div
        className="footer-bottom grid grid-cols-[2fr_1fr_1.2fr] gap-12 items-center"
        style={{ marginTop: '5rem', paddingTop: '2.5rem' }}
      >
        <span className="footer-bottom-text footer-copy">
          ©2026. Altra Residence. All rights reserved.
        </span>
        <div className="footer-links-wrap" style={{ display: 'contents' }}>
          <a href="#" className="footer-bottom-text hover:opacity-70 justify-self-start">
            Manage cookies
          </a>
          <span className="footer-bottom-text">
            Made by{' '}
            <a
              href="https://temnyy.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-credit-link"
            >
              <em>temnyy</em>
            </a>
          </span>
        </div>
      </div>

    </footer>
  )
}

export default Footer
