import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { livings } from '../data/Livings'
import '../css/OurLivings.css'

const total = livings.length
const SLIDE_DUR = 1
const CENTER_LIFT = 90

function slotForElement(i, atIdx) {
  return (i - atIdx + 1 + total) % total
}

function getSlotState(slot, stageWidth, slideW) {
  const gap = stageWidth * 0.08
  switch (slot) {
    case 0: return { x: -(slideW + gap), y: 0, opacity: 0.7 }
    case 1: return { x: 0, y: -CENTER_LIFT, opacity: 1 }
    case 2: return { x: (slideW + gap), y: 0, opacity: 0.7 }
    default: return { x: 0, y: 0, opacity: 1 }
  }
}

function isMobileNow() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches
}

function OurLivings({ setActiveLiving }) {
  const sectionRef = useRef()
  const stageRef = useRef()
  const slideRefs = useRef([])
  const titleClipRef = useRef()
  const titleInnerRef = useRef()
  const descClipRef = useRef()
  const descInnerRef = useRef()

  const [idx, setIdx] = useState(0)
  const animatingRef = useRef(false)
  const isFirstMountRef = useRef(true)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)

  useLayoutEffect(() => {
    if (isFirstMountRef.current) {
      const mobile = isMobileNow()

      if (mobile) {
        // Mobile: all slides stacked at top-left of slides-wrap, only active will fade in via entrance
        livings.forEach((_, i) => {
          gsap.set(slideRefs.current[i], {
            xPercent: -50, yPercent: -50,
            x: 0, y: 0,
            opacity: 0,
          })
        })
      } else {
        const stageWidth = stageRef.current.offsetWidth
        const centerW = slideRefs.current[0].offsetWidth
        livings.forEach((_, i) => {
          const slot = slotForElement(i, idx)
          const state = getSlotState(slot, stageWidth, centerW)
          gsap.set(slideRefs.current[i], {
            xPercent: -50, yPercent: -50,
            x: state.x, y: state.y,
            opacity: 0,
          })
        })
      }

      gsap.set([titleInnerRef.current, descInnerRef.current], { y: '100%' })
      isFirstMountRef.current = false
      return
    }

    // Slide change: text clips in
    gsap.set([titleInnerRef.current, descInnerRef.current], { y: '100%' })
    gsap.to(titleInnerRef.current, { y: '0%', duration: 0.5, ease: 'power3.out' })
    gsap.to(descInnerRef.current, { y: '0%', duration: 0.5, ease: 'power3.out' })
  }, [idx])

  // ── Entrance animation ─────────────────────────────────────────
  useEffect(() => {
    const mobile = isMobileNow()
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
    })

    if (mobile) {
      tl.to(slideRefs.current[idx], { opacity: 1, duration: 0.9, ease: 'power3.out' })
        .to(titleInnerRef.current, { y: '0%', duration: 0.6, ease: 'power3.out' }, '-=0.5')
        .to(descInnerRef.current, { y: '0%', duration: 0.5, ease: 'power3.out' }, '-=0.3')
    } else {
      tl.to(slideRefs.current[idx],
        { opacity: 1, duration: 0.9, ease: 'power3.out' })
        .to(slideRefs.current.filter((_, i) => i !== idx),
          { opacity: 0.7, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .to(titleInnerRef.current, { y: '0%', duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to(descInnerRef.current, { y: '0%', duration: 0.5, ease: 'power3.out' }, '-=0.3')
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  // ── Slide change dispatcher ────────────────────────────────────
  function go(dir) {
    if (animatingRef.current) return
    if (isMobileNow()) goMobile(dir)
    else goDesktop(dir)
  }

  // ── Mobile slide change: simple horizontal slide + fade ────────
  function goMobile(dir) {
    animatingRef.current = true
    const newIdx = dir === 'next' ? (idx + 1) % total : (idx - 1 + total) % total
    const direction = dir === 'next' ? 1 : -1

    const tl = gsap.timeline({
      onComplete: () => { animatingRef.current = false },
    })

    tl.to(slideRefs.current[idx], {
      x: -direction * 80,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
    }, 0)

    tl.to([titleInnerRef.current, descInnerRef.current],
      { y: '-100%', duration: 0.35, ease: 'power2.in' }, 0)

    tl.call(() => setIdx(newIdx), null, 0.35)

    tl.set(slideRefs.current[newIdx], {
      x: direction * 80,
      opacity: 0,
    }, 0.35)
    tl.to(slideRefs.current[newIdx], {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
    }, 0.35)
  }

  function goDesktop(dir) {
    animatingRef.current = true

    const stageWidth = stageRef.current.offsetWidth
    const centerW = slideRefs.current[0].offsetWidth

    const newIdx = dir === 'next'
      ? (idx + 1) % total
      : (idx - 1 + total) % total

    const tl = gsap.timeline({
      onComplete: () => { animatingRef.current = false },
    })

    tl.to([titleInnerRef.current, descInnerRef.current],
      { y: '-100%', duration: 0.5, ease: 'power2.in' }, 0)

    tl.call(() => setIdx(newIdx), null, 0.5)

    livings.forEach((_, i) => {
      const oldSlot = slotForElement(i, idx)
      const newSlot = slotForElement(i, newIdx)
      const newState = getSlotState(newSlot, stageWidth, centerW)

      const isWrap = Math.abs(oldSlot - newSlot) === 2

      if (isWrap) {
        const el = slideRefs.current[i]
        const clone = el.cloneNode(true)
        el.parentNode.appendChild(clone)

        const outSide = (newSlot === 2) ? -1 : 1
        const outX = outSide * (stageWidth / 2 + 1.5 * centerW)

        gsap.to(clone, {
          x: outX,
          opacity: 0,
          duration: SLIDE_DUR,
          ease: 'power3.out',
          onComplete: () => clone.remove()
        })

        const startSide = (newSlot === 2) ? 1 : -1
        const startX = startSide * (stageWidth / 2 + 1.5 * centerW)

        tl.set(el, { x: startX, y: 0, opacity: 0 }, 0)
          .to(el,
            {
              x: newState.x, y: newState.y, opacity: newState.opacity,
              duration: SLIDE_DUR, ease: 'power3.out'
            }, 0)
      } else {
        tl.to(slideRefs.current[i], {
          x: newState.x,
          y: newState.y,
          opacity: newState.opacity,
          duration: SLIDE_DUR,
          ease: 'power3.out',
        }, 0)
      }
    })
  }

  function handleTouchStart(e) {
    if (animatingRef.current) return
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
  }
  function handleTouchEnd(e) {
    if (!isMobileNow()) return
    const dx = e.changedTouches[0].clientX - touchStartXRef.current
    const dy = e.changedTouches[0].clientY - touchStartYRef.current
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) go('next')
    else go('prev')
  }

  return (
    <section
      ref={sectionRef}
      className="ourlivings-section relative overflow-hidden pt-40"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        ref={stageRef}
        className="ourlivings-stage relative"
        style={{ height: '100vh', minHeight: '700px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        <div className="ourlivings-header absolute -top-10 left-0 right-0 px-24 flex items-end justify-between z-50 pointer-events-none">
          <span
            className="ourlivings-header-label italic text-[4rem]"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-muted)',
              transform: 'translateX(6rem)',
            }}
          >
            (Our Livings)
          </span>
          <span className="living-counter">
            {String(idx + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}
          </span>
        </div>

        <div
          ref={titleClipRef}
          className="living-title-clip living-clip absolute left-0 right-0 z-20 text-center pointer-events-none"
          style={{ top: '15%' }}
        >
          <h2
            ref={titleInnerRef}
            className="living-inner living-title whitespace-nowrap"
            style={{ fontSize: 'clamp(3.5rem, 7vw, 7.5rem)' }}
          >
            {livings[idx].name}
          </h2>
        </div>

        <div className="ourlivings-slides-wrap absolute inset-0">
          {livings.map((item, i) => {
            const slot = slotForElement(i, idx)
            const isCenter = slot === 1
            const isLeft = slot === 0

            return (
              <div
                key={item.id}
                ref={el => { slideRefs.current[i] = el }}
                role={isCenter ? undefined : 'button'}
                tabIndex={isCenter ? -1 : 0}
                aria-label={isLeft ? 'Previous living' : (!isCenter ? 'Next living' : undefined)}
                onClick={isCenter ? undefined : () => go(isLeft ? 'prev' : 'next')}
                className={`living-slide absolute ${isCenter ? '' : 'living-side'}`}
                style={{
                  left: '50%',
                  top: '50%',
                  width: 'clamp(28rem, 36vw, 40rem)',
                  aspectRatio: '3/4',
                }}
              >
                <img src={item.image} alt={item.name} />
              </div>
            )
          })}
        </div>

        <div className="ourlivings-bottom absolute left-0 right-0 flex justify-center z-30 pointer-events-auto" style={{ bottom: '4%' }}>
          <div
            className="ourlivings-bottom-inner flex items-center gap-10"
            style={{ width: 'clamp(28rem, 36vw, 40rem)' }}
          >
            <div ref={descClipRef} className="living-clip flex-1">
              <p
                ref={descInnerRef}
                className="living-inner text-[1.1rem] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', maxWidth: 'none' }}
              >
                {livings[idx].description}
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (setActiveLiving) setActiveLiving(livings[idx].name)
              }}
              className="living-explore shrink-0 flex items-center justify-center text-[0.85rem] uppercase tracking-[0.2em] px-8 py-3"
              style={{
                fontFamily: 'var(--font-heading)',
                minWidth: '9rem',
                height: '2.75rem',
              }}
            >
              Explore
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurLivings
