import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { X } from 'lucide-react'
import livingDetails from '../data/livingDetails.json'
import { getLenis } from '../utils/lenis'
import { LIVING_SLUGS } from '../utils/livingSlugs'
import { SITE_URL, SITE_NAME, getLivingSchema } from '../utils/seo'
import '../css/HomeDetails.css'

const SLICES = 28

function HomeDetails({ activeLiving, onClose }) {
  const [activeRoomIdx, setActiveRoomIdx] = useState(0)

  const overlayRef = useRef(null)
  const leftPaneRef = useRef(null)
  const rightPaneRef = useRef(null)
  const dividerRef = useRef(null)
  const closeBtnRef = useRef(null)
  const textInnerRefs = useRef([])
  const tlRef = useRef(null)
  const imgAnimating = useRef(false)
  const areaValRef = useRef(null)
  const closeIdRef = useRef(0)

  useEffect(() => {
    if (activeLiving) {
      setActiveRoomIdx(0)
      imgAnimating.current = false
      document.body.classList.add('hd-overlay-open')
      document.documentElement.classList.add('hd-overlay-open')
      getLenis()?.stop()
    } else {
      document.body.classList.remove('hd-overlay-open')
      document.documentElement.classList.remove('hd-overlay-open')
      getLenis()?.start()
    }

    return () => {
      document.body.classList.remove('hd-overlay-open')
      document.documentElement.classList.remove('hd-overlay-open')
      getLenis()?.start()
    }
  }, [activeLiving])


  useLayoutEffect(() => {
    if (!activeLiving) return

    gsap.set(overlayRef.current, { x: '100%' })
    gsap.set(textInnerRefs.current, { y: '110%' })
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'center' })
    gsap.set(closeBtnRef.current, { opacity: 0, scale: 0.8 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 })
      tlRef.current = tl
      tl.to(overlayRef.current, { x: '0%', duration: 1.3, ease: 'power2.inOut' })
        .to(dividerRef.current, { scaleX: 1, duration: 0.4, ease: 'power3.out' }, 1.3)
        .to(closeBtnRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' }, 1.3)
        .to(textInnerRefs.current, { y: '0%', duration: 0.4, stagger: 0.04, ease: 'power3.out' }, 1.35)
    })

    return () => {
      closeIdRef.current++
      ctx.revert()
    }
  }, [activeLiving])

  const handleRoomChange = useCallback((newIdx) => {
    if (newIdx === activeRoomIdx || imgAnimating.current) return
    if (!leftPaneRef.current) return
    imgAnimating.current = true

    const container = leftPaneRef.current
    const details = livingDetails[activeLiving]
    const newRoom = details.rooms[newIdx]
    const oldArea = details.rooms[activeRoomIdx].area || 0
    const newArea = newRoom.area || 0

    const overlay = document.createElement('div')
    overlay.className = 'hd-blinds-overlay'
    container.appendChild(overlay)

    const sliceEls = []
    for (let s = 0; s < SLICES; s++) {
      const slice = document.createElement('div')
      slice.className = 'hd-blind-slice'
      slice.style.cssText = `
        position: absolute;
        left: 0;
        top: ${(s / SLICES) * 100}%;
        width: 100%;
        height: 0%;
        overflow: hidden;
      `

      const img = document.createElement('img')
      img.src = newRoom.image
      img.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: ${container.offsetWidth}px;
        height: ${container.offsetHeight}px;
        object-fit: cover;
        margin-top: -${(s / SLICES) * container.offsetHeight}px;
      `
      if (newRoom.objectPosition) {
        img.style.objectPosition = newRoom.objectPosition
      }

      slice.appendChild(img)
      overlay.appendChild(slice)
      sliceEls.push(slice)
    }

    if (areaValRef.current) {
      const proxy = { val: oldArea }
      gsap.to(proxy, {
        val: newArea,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          if (areaValRef.current) {
            areaValRef.current.textContent = Math.round(proxy.val)
          }
        },
      })
    }

    gsap.to(sliceEls, {
      height: `calc(${100 / SLICES}% + 1px)`,
      stagger: 0.02,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        flushSync(() => {
          setActiveRoomIdx(newIdx)
        })
        overlay.remove()
        imgAnimating.current = false
      }
    })
  }, [activeRoomIdx, activeLiving])

  const handleClose = () => {
    const myId = ++closeIdRef.current
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        x: '100%',
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          if (myId === closeIdRef.current) onClose()
        },
      })
    } else {
      onClose()
    }
  }

  const handleBookVisit = () => {
    const reservationEl = document.getElementById('reservation-section')
    const myId = ++closeIdRef.current

    const jumpToReservation = () => {
      const lenis = getLenis()
      if (lenis) {
        lenis.start()
        lenis.scrollTo(reservationEl, { immediate: true })
      } else {
        reservationEl.scrollIntoView({ behavior: 'instant' })
      }
    }

    if (!overlayRef.current || !reservationEl) {
      onClose()
      if (reservationEl) jumpToReservation()
      return
    }

    reservationEl.style.opacity = '0'
    document.body.classList.remove('hd-overlay-open')
    document.documentElement.classList.remove('hd-overlay-open')
    jumpToReservation()

    const fadeInReservation = () => {
      gsap.to(reservationEl, {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        onComplete: () => { reservationEl.style.opacity = '' },
      })
    }

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        if (myId === closeIdRef.current) onClose()
        fadeInReservation()
      },
    })
  }

  if (!activeLiving) return null

  const details = livingDetails[activeLiving]
  if (!details) return null

  const activeRoom = details.rooms[activeRoomIdx]
  const pageUrl = `${SITE_URL}/${LIVING_SLUGS[activeLiving]}`
  const pageTitle = `${details.name} — ${SITE_NAME}`
  const ogImageUrl = `${SITE_URL}${encodeURI(activeRoom.image)}`

  return (
    <div ref={overlayRef} className="home-details-overlay">
      {/* React 19 hoists these into <head> on its own — no Helmet needed. */}
      <title>{pageTitle}</title>
      <meta name="description" content={details.description} />
      <link rel="canonical" href={pageUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={details.description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={pageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={details.description} />
      <meta name="twitter:image" content={ogImageUrl} />

      <script type="application/ld+json">
        {JSON.stringify(getLivingSchema(details, pageUrl, ogImageUrl))}
      </script>

      {/* Left Pane */}
      <div ref={leftPaneRef} className="hd-left">
        <img
          src={activeRoom.image}
          alt={`${details.name} ${activeRoom.name}`}
          className="hd-main-img"
          decoding="async"
          fetchPriority="high"
          style={activeRoom.objectPosition ? { objectPosition: activeRoom.objectPosition } : undefined}
        />

        <div className="hd-thumbnails-container">
          {details.rooms.map((room, idx) => (
            <img
              key={idx}
              src={room.thumb || room.image}
              alt={room.name}
              className={`hd-thumbnail ${idx === activeRoomIdx ? 'active' : ''}`}
              decoding="async"
              onClick={() => handleRoomChange(idx)}
            />
          ))}
        </div>
      </div>

      {/* Right Pane */}
      <div ref={rightPaneRef} className="hd-right flex flex-col">
        <div className="hd-header hd-m-order-1">
          <div className="hd-clip">
            <span ref={el => { textInnerRefs.current[0] = el }} className="hd-inner hd-logo">ALTA</span>
          </div>
          <button ref={closeBtnRef} className="hd-close-btn" onClick={handleClose} aria-label="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div ref={dividerRef} className="hd-divider hd-m-order-2" />

        <div className="hd-clip hd-m-order-5 mb-8">
          <h2 ref={el => { textInnerRefs.current[1] = el }} className="hd-inner hd-subtitle m-0">{details.name} RESIDENCES</h2>
        </div>

        <div className="hd-clip hd-m-order-6 mb-16">
          <p ref={el => { textInnerRefs.current[2] = el }} className="hd-inner hd-description m-0">
            {details.description}
          </p>
        </div>

        <div className="hd-clip hd-m-order-4 mb-auto">
          <div ref={el => { textInnerRefs.current[3] = el }} className="hd-inner">
            <button className="hd-book-btn" onClick={handleBookVisit}>BOOK A VISIT</button>
          </div>
        </div>

        <div className="hd-room-info hd-m-order-3 mt-12">
          <div className="hd-clip mb-2">
            <h3 ref={el => { textInnerRefs.current[4] = el }} className="hd-inner hd-room-name m-0">{activeRoom.name}</h3>
          </div>
          <div className="hd-clip">
            <div ref={el => { textInnerRefs.current[5] = el }} className="hd-inner hd-room-area-container">
              <span ref={areaValRef} className="hd-room-area-val">{activeRoom.area || 0}</span>
              <span className="hd-room-area-unit">m²</span>
            </div>
          </div>
          <div className="hd-clip">
            <p ref={el => { textInnerRefs.current[6] = el }} className="hd-inner hd-room-area-label">total {activeRoom.name.toLowerCase()} area</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeDetails
