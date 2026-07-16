import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../css/About.css'

const OVERLAY_WORDS = [
  { word: 'TIMELESS', type: 'desktop-word' },
  { word: 'DESIGN', type: 'desktop-word' },
  { word: 'TIMELESS DESIGN', type: 'mobile-word' },
  { word: 'WELLNESS-', type: 'desktop-word' },
  { word: 'FOCUSED', type: 'desktop-word' },
  { word: 'WELLNESS-FOCUSED', type: 'mobile-word' },
  { word: 'LIVING', type: 'both-word' },
]

function About() {
  const sectionRef = useRef()
  const imageRef = useRef()
  const imageBoxRef = useRef()
  const para1ClipRef = useRef()
  const para1InnerRef = useRef()
  const para2ClipRef = useRef()
  const para2InnerRef = useRef()
  const wordRefs = useRef([])
  const wordsBoxRef = useRef()
  const stat60Ref = useRef()
  const stat30Ref = useRef()
  const stat150kRef = useRef()
  const stat247Ref = useRef()

  useEffect(() => {
    let mm = gsap.matchMedia()

    // Setup initial states
    gsap.set([para1InnerRef.current, para2InnerRef.current], { y: '100%' })
    gsap.set('.about-word-inner', { y: '100%' })
    gsap.set(stat247Ref.current, { y: 30, opacity: 0 })

    mm.add({
      isDesktop: "(min-width: 1025px)",
      isMobile: "(max-width: 1024px)"
    }, (context) => {
      let { isDesktop, isMobile } = context.conditions;

      function animateCounter(ref, target, suffix = '', startPos = 'top 85%', duration = 1.5) {
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            if (ref.current) {
              ref.current.textContent = Math.round(proxy.val) + suffix
            }
          },
          scrollTrigger: { trigger: ref.current, start: startPos, once: true },
        })
      }

      if (isDesktop) {
        // ── Desktop Animations ─────────────────────────────────────────
        gsap.to('.desktop-words .about-word-inner', {
          y: '0%', duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.desktop-words', start: 'top 85%', once: true },
        })

        gsap.timeline({ scrollTrigger: { trigger: para1ClipRef.current, start: 'top 80%', once: true } })
          .to(para1InnerRef.current, { y: '0%', duration: 0.5, ease: 'power3.out' })
          .to(para2InnerRef.current, { y: '0%', duration: 0.5, ease: 'power3.out' }, '+=0.2')

        gsap.to(imageBoxRef.current, { y: 40, ease: 'none', scrollTrigger: { trigger: imageBoxRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
        gsap.to(imageRef.current, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: imageRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 } })

        animateCounter(stat60Ref, 60, '%', 'top 85%')
        animateCounter(stat30Ref, 30, '', 'top 85%')
        animateCounter(stat150kRef, 1400, '', 'top 85%')
        gsap.to(stat247Ref.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: stat247Ref.current, start: 'top 85%', once: true } })
      }

      if (isMobile) {
        const observers = []
        const revealOnEnter = (target, run) => {
          if (!target) return
          const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                run()
                io.disconnect()
              }
            })
          }, { threshold: 0.1 })
          io.observe(target)
          observers.push(io)
        }

        // 1. TIMELESS DESIGN / WELLNESS-FOCUSED / LIVING
        revealOnEnter(document.querySelector('.mobile-words'), () => {
          gsap.to('.mobile-words .about-word-inner', {
            y: '0%',
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
          })
        })

        // 2. Görsel — fade + slight slide-up
        const imgContainer = document.querySelector('.about-image-container')
        revealOnEnter(imgContainer, () => {
          gsap.fromTo(imgContainer,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          )
        })

        // 3. Description — iki paragraf sırayla
        revealOnEnter(para1ClipRef.current, () => {
          gsap.timeline()
            .to(para1InnerRef.current, { y: '0%', duration: 0.6, ease: 'power3.out' })
            .to(para2InnerRef.current, { y: '0%', duration: 0.6, ease: 'power3.out' }, '-=0.3')
        })

        // 4. Stats sayaçları — her biri kendi konumuna gelince
        const runCounter = (ref, target, suffix = '') => {
          revealOnEnter(ref.current, () => {
            const proxy = { val: 0 }
            gsap.to(proxy, {
              val: target,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                if (ref.current) ref.current.textContent = Math.round(proxy.val) + suffix
              },
            })
          })
        }
        runCounter(stat60Ref, 60, '%')
        runCounter(stat30Ref, 30, '')
        runCounter(stat150kRef, 1400, '')

        revealOnEnter(stat247Ref.current, () => {
          gsap.to(stat247Ref.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
          })
        })

        // 6. Subtle Parallax (scroll'a bağlı kaldığı için ScrollTrigger uygun)
        gsap.to(imageBoxRef.current, {
          y: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: imageBoxRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
        gsap.to(imageRef.current, {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })

        return () => observers.forEach((io) => io.disconnect())
      }
    })
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250)

    return () => {
      clearTimeout(refreshTimer)
      mm.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-(--color-bg)">

      <div className="about-intro-grid grid grid-cols-[1fr_1.2fr_1.4fr] gap-16 px-24 pt-[clamp(8rem,14vw,14rem)] pb-0">

        <div className="about-label-container flex items-start pt-4 translate-x-24">
          <span
            className="italic text-[4rem] font-(--font-body) text-(--color-text-muted)"
          >
            (About)
          </span>
        </div>

        <div
          ref={imageBoxRef}
          className="about-image-wrapper relative justify-self-start w-full max-w-152 h-screen mt-32"
        >
          <div
            className="desktop-words about-words-container absolute bottom-0 flex-col items-end gap-3 pointer-events-none lg:flex hidden right-[calc(100%+3rem)] min-w-200"
          >
            {['TIMELESS', 'DESIGN', 'WELLNESS-', 'FOCUSED', 'LIVING'].map((word) => (
              <div key={word} className="about-word-clip">
                <span className="about-word-inner italic uppercase whitespace-nowrap font-(family-name:--font-body) text-(--color-text) text-[clamp(2.8rem,5.5vw,5rem)] font-normal tracking-[0.01em] leading-[1.05]"
                >
                  {word}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mobile-words about-words-container absolute bottom-0 flex flex-col items-start gap-1 pointer-events-none lg:hidden right-[calc(100%+3rem)] min-w-200"
          >
            {['TIMELESS DESIGN', 'WELLNESS-FOCUSED', 'LIVING'].map((word) => (
              <div key={word} className="about-word-clip">
                <span className="about-word-inner italic uppercase whitespace-nowrap font-(family-name:--font-body) text-(--color-text) text-[clamp(2.8rem,5.5vw,5rem)] font-normal tracking-[0.01em] leading-[1.05]"
                >
                  {word}
                </span>
              </div>
            ))}
          </div>

          <div className="about-image-container">
            <img
              ref={imageRef}
              src="/products/interior-2.webp"
              alt="Altra Residence interior"
            />
          </div>
        </div>

        <div className="about-text-container flex flex-col gap-8 mt-40">
          <div ref={para1ClipRef} className="about-para-clip">
            <p
              ref={para1InnerRef}
              className="about-para-inner text-[1.5rem] leading-relaxed font-(family-name:--font-body) text-(--color-text) font-semibold max-w-none"
            >
              Every element of Altra Residence reflects a commitment to excellence.
              From the timeless elegance of its interiors to its thoughtfully curated
              amenities, the property embodies a holistic approach to luxury living.
            </p>
          </div>

          <div ref={para2ClipRef} className="about-para-clip">
            <p
              ref={para2InnerRef}
              className="about-para-inner text-[1.5rem] leading-relaxed font-(family-name:--font-body) text-(--color-text) font-semibold max-w-none"
            >
              Whether you're seeking a serene retreat, cultural hub, or a space that
              fosters personal growth, Altra Residence offers it all.
            </p>
          </div>
        </div>
      </div>

      <div
        className="about-stats-wrapper px-24 pb-[clamp(4rem,8vw,8rem)] pt-[clamp(6rem,10vw,10rem)]"
      >
        <div className="about-stats-grid grid grid-cols-3 grid-rows-3 gap-y-16 gap-x-8">

          <div className="about-empty-cell" />

          <div className="about-stat-item flex flex-col gap-3">
            <span ref={stat60Ref} className="about-stat-number">0</span>
            <span className="about-stat-label">green spaces for tranquility &amp; wellness.</span>
          </div>

          <div className="about-stat-item flex flex-col gap-3">
            <span ref={stat30Ref} className="about-stat-number">0</span>
            <span className="about-stat-label">exclusive residences, each tailored for comfort &amp; elegance.</span>
          </div>

          <div className="about-stat-item about-stat-150k flex flex-col gap-3 ml-[60%]">
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span ref={stat150kRef} className="about-stat-number">0</span>
              <span className="about-stat-number whitespace-nowrap about-stat-m2 text-[clamp(4rem,7vw,8rem)]">m²</span>
            </div>
            <span className="about-stat-label">total green spaces for tranquility &amp; wellness.</span>
          </div>
          <div className="about-empty-cell" />
          <div className="about-empty-cell" />

          <div className="about-empty-cell" />
          <div className="about-stat-item flex flex-col gap-3">
            <span ref={stat247Ref} className="about-stat-number">24/7</span>
            <span className="about-stat-label">concierge services, meeting every need effortlessly.</span>
          </div>
          <div className="about-empty-cell" />

        </div>
      </div>

    </section>
  )
}

export default About
