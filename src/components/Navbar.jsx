import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Logo from './Logo'
import '../css/Navbar.css'

function Navbar({ headerRef, lineRef, setActiveLiving }) {
  // 'top' | 'scrolled' | 'hidden'
  const [scrollState, setScrollState] = useState('top')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToReservation = () => {
    const el = document.getElementById('reservation-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    let lastY = window.scrollY
    const threshold = 80

    const handleScroll = () => {
      const currentY = window.scrollY
      const goingDown = currentY > lastY

      if (currentY < threshold) {
        setScrollState('top')
      } else {
        setScrollState(goingDown ? 'scrolled' : 'hidden')
      }

      lastY = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isMenuOpen])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className={`navbar fixed left-0 right-0 z-50 navbar-${scrollState}`}
      >
        <div className="navbar-inner flex items-center relative z-50">

          <div className="nav-logo-container shrink-0">
            <Logo className="text-[3rem]" />
          </div>

          <nav className="nav-links flex-1 flex items-center justify-center gap-10">
            {['Maison Solène', 'Velour Grand', 'Obsidian Atelier'].map((item) => (
              <a
                key={item}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (setActiveLiving) setActiveLiving(item)
                }}
                className="nav-link text-[1rem] uppercase tracking-[0.2em]"
                style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Book a visit */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); scrollToReservation() }}
            className="nav-button flex items-center justify-center text-[0.9rem] uppercase tracking-[0.2em] rounded-full px-10 py-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-bg-deep)',
              background: 'var(--color-text)',
              minWidth: '11rem',
              height: '3rem',
            }}
          >
            Book a Visit
          </a>

          {/* Hamburger menu for mobile */}
          <button
            className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="hamburger-line top-line"></span>
            <span className="hamburger-line bottom-line"></span>
          </button>

        </div>

        <div
          ref={lineRef}
          className="nav-line h-px relative z-50"
          style={{ marginTop: '1.2rem', background: '#ffffff' }}
        />
      </header>

      {mounted && createPortal(
        <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav-links">
            {['Maison Solène', 'Velour Grand', 'Obsidian Atelier'].map((item) => (
              <a
                key={item}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setIsMenuOpen(false)
                  if (setActiveLiving) setActiveLiving(item)
                }}
                className="mobile-nav-link"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item}
              </a>
            ))}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); scrollToReservation() }}
              className="mobile-nav-button"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Book a Visit
            </a>
          </nav>
        </div>,
        document.body
      )}
    </>
  )
}

export default Navbar
