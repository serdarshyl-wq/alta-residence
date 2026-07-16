import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../css/Amenities.css'

gsap.registerPlugin(ScrollTrigger)

const SLIDES = [
  {
    id: 1,
    titleLines: ['WELLNESS-', 'CENTERED', 'AMENITIES'],
    desc: 'From private fitness studios to\nguided meditation sessions, our\namenities are designed to enhance\nyour well-being and foster a sense\nof harmony.',
    smallImg: '/products/gym.webp',
    largeImg: '/products/interior-2.webp'
  },
  {
    id: 2,
    titleLines: ['ART', 'INSPIRED', 'SPACES'],
    desc: 'Every corner acts as a canvas.\nCurated art pieces and striking\ninterior lines blend harmoniously\nto stimulate creativity.',
    smallImg: '/products/interior-3.webp',
    largeImg: '/products/spa.webp'
  },
  {
    id: 3,
    titleLines: ['REFINED', 'AESTHETICS', 'EVERYWHERE'],
    desc: 'Panoramic views and world-class\nconcierge services ensure that your\nevery need is met with uncompromising\nelegance.',
    smallImg: '/products/interior-1.webp',
    largeImg: '/products/exterior-2.webp'
  }
]

export default function Amenities() {
  const containerRef = useRef()
  const textRefs = useRef([])
  const lineRefs = useRef([])
  const descRefs = useRef([])
  const smallImgRefs = useRef([])
  const largeImgSlices = useRef([])

  useLayoutEffect(() => {
    let mm = gsap.matchMedia(containerRef)

    mm.add({
      isDesktop: "(min-width: 1025px)",
      isMobile: "(max-width: 1024px)"
    }, (context) => {
      let { isDesktop } = context.conditions

      SLIDES.forEach((_, i) => {
        if (i === 0) {
          gsap.set(lineRefs.current[i], isDesktop ? { scaleY: 1, scaleX: 1 } : { scaleX: 1, scaleY: 1 })
        } else {
          gsap.set(smallImgRefs.current[i], { yPercent: 100 })
          gsap.set(largeImgSlices.current[i], { clipPath: 'inset(0% 0% 100% 0%)' })
          gsap.set(textRefs.current[i], { yPercent: 100 })
          gsap.set(descRefs.current[i], { yPercent: 100, opacity: 0 })
          gsap.set(lineRefs.current[i], isDesktop ? { scaleY: 0, scaleX: 1 } : { scaleX: 0, scaleY: 1 })
        }
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${SLIDES.length * 120}%`,
          pin: true,
          scrub: 1,
        }
      })

      // 3. Step Animations (Interpolating between slides)
      for (let i = 0; i < SLIDES.length - 1; i++) {
        const next = i + 1;
        const stepTime = `step${i}`

        tl.to(textRefs.current[i], { yPercent: -100, duration: 1 }, stepTime)
          .to(descRefs.current[i], { yPercent: -50, opacity: 0, duration: 1 }, stepTime)
          .to(smallImgRefs.current[i], { yPercent: -20, duration: 1 }, stepTime)
          .to(textRefs.current[next], { yPercent: 0, duration: 1 }, stepTime)
          .to(descRefs.current[next], { yPercent: 0, opacity: 1, duration: 1 }, stepTime)

        if (isDesktop) {
          tl.to(lineRefs.current[next], { scaleY: 1, duration: 1 }, stepTime)
        } else {
          tl.to(lineRefs.current[next], { scaleX: 1, duration: 1 }, stepTime)
        }

        tl.to(smallImgRefs.current[next], {
          yPercent: 0,
          duration: 1,
          ease: 'power2.inOut'
        }, stepTime)

          // Same venetian-blinds reveal as the HomeDetails room switcher,
          // but clip-path driven instead of height so a scrub-tied, pinned
          // scroll doesn't force a layout recalc on every frame.
          .to(largeImgSlices.current[next], {
            clipPath: 'inset(0% 0% 0% 0%)',
            stagger: 0.04,
            duration: 1,
            ease: 'power3.inOut'
          }, stepTime)
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={containerRef} className="amenities-section relative w-full h-screen overflow-hidden flex items-center">
      <div className="amenities-container relative w-full h-full flex items-center pl-4 pr-40">

        <div className="am-text-column relative w-2/5 h-[60%] flex flex-col justify-center">
          {SLIDES.map((slide, i) => (
            <div key={slide.id} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
              <div className="am-text-row flex flex-col lg:flex-row items-stretch lg:items-center h-full lg:h-auto">
                <div
                  ref={el => lineRefs.current[i] = el}
                  className="am-line"
                />

                <div className="flex flex-col gap-8 justify-center">
                  <div className="amenities-text-mask pb-2">
                    <h2
                      ref={el => textRefs.current[i] = el}
                      className="am-title text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]"
                    >
                      {slide.titleLines.map((line, idx) => (
                        <span key={idx} className="block">{line}</span>
                      ))}
                    </h2>
                  </div>

                  <div className="amenities-text-mask">
                    <p
                      ref={el => descRefs.current[i] = el}
                      className="am-desc text-lg max-w-22rem whitespace-pre-line"
                    >
                      {slide.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="am-slider-large">

          {SLIDES.map((slide, i) => {
            const slices = 12
            if (!largeImgSlices.current[i]) largeImgSlices.current[i] = []

            return (
              <div key={slide.id} className="absolute inset-0" style={{ zIndex: i }}>
                {[...Array(slices)].map((_, s) => (
                  <div
                    key={s}
                    ref={el => largeImgSlices.current[i][s] = el}
                    className="am-slice-mask"
                    style={{
                      top: `${(s / slices) * 100}%`,
                      height: `calc(${100 / slices}% + 1px)`, // +1px overlap so adjacent slices don't leave a seam
                      clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)'
                    }}
                  >
                    <img
                      src={slide.largeImg}
                      className="am-slice-img"
                      style={{ top: `-${s * 100}%` }}
                      alt="Large Amenities Visual"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            )
          })}

          <div className="am-slider-small">
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                ref={el => smallImgRefs.current[i] = el}
                className="absolute inset-0"
                style={{ zIndex: i }}
              >
                <img
                  src={slide.smallImg}
                  className="am-small-img"
                  alt="Small Amenities Visual"
                  decoding="async"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
