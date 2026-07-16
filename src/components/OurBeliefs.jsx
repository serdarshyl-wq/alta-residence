import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../css/OurBeliefs.css'

gsap.registerPlugin(ScrollTrigger)

const TITLE_LINES = ['A vision of', 'Inspired living']

const BELIEF_BOXES = [
  { id: 1, title: 'Holistic Well-being', text: 'Spaces designed to nurture the mind, body, and soul.' },
  { id: 2, title: 'Discretion & Exclusivity', text: 'Privacy and personal growth at the forefront.' },
  { id: 3, title: 'Cultural Enrichment', text: 'Spaces designed to nurture the mind, body, and soul.' },
  { id: 4, title: 'Community & Connection', text: 'Privacy and personal growth at the forefront.' },
  { id: 5, title: 'Sustainable Elegance', text: 'Luxury that respects our environment.' },
]

function OurBeliefs() {
  const sectionRef = useRef()
  const imageBoxRef = useRef()
  const imageRef = useRef()
  const titleInnerRefs = useRef([])
  const descClipRef = useRef()
  const descInnerRef = useRef()
  const labelClipRef = useRef()
  const labelInnerRef = useRef()

  // Part 2 refs
  const part2Ref = useRef()
  const bgImageRef = useRef()
  const boxRefs = useRef([])
  const sideTextRefs = useRef([])

  useEffect(() => {
    gsap.set(titleInnerRefs.current, { y: '110%' })
    gsap.set(descInnerRef.current, { y: '110%' })
    gsap.set(labelInnerRef.current, { y: '110%' })

    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
    })
      .to(imageRef.current,
        { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power3.out' }, 0)
      .to(labelInnerRef.current,
        { y: '0%', duration: 0.6, ease: 'power3.out' }, 0)
      .to(titleInnerRefs.current,
        { y: '0%', duration: 1.4, stagger: 0.18, ease: 'power3.out' }, 0)
      .to(descInnerRef.current, { y: '0%', duration: 0.6, ease: 'power3.out' }, 1.2)

    gsap.to(imageBoxRef.current, {
      y: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: imageBoxRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    })
    gsap.to(imageRef.current, {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: {
        trigger: imageBoxRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    })

    /* ───────── Part 2 animations ───────── */
    gsap.set(bgImageRef.current, { clipPath: 'inset(100% 0 0 0)' })
    gsap.set(boxRefs.current, { y: 60, opacity: 0 })
    gsap.set(sideTextRefs.current, { y: 40, opacity: 0 })

    const part2Tl = gsap.timeline({
      scrollTrigger: {
        trigger: part2Ref.current,
        start: 'top 75%',
        once: true,
      },
    })

    part2Tl.to(bgImageRef.current, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.4,
      ease: 'power3.out',
    })

    part2Tl.to(boxRefs.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    }, '-=0.5')

    part2Tl.to(sideTextRefs.current, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
    }, '-=0.4')

    // Part 2 parallax on background image
    gsap.to(bgImageRef.current, {
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: part2Ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-(--color-bg)"
    >
      <div className="beliefs-top-label-wrap px-40 pt-24 flex justify-end">
        <div ref={labelClipRef} className="beliefs-clip">
          <span
            ref={labelInnerRef}
            className="beliefs-inner beliefs-label text-[2rem]"
          >
            (Our Beliefs)
          </span>
        </div>
      </div>

      <div className="beliefs-grid relative grid grid-cols-2 gap-16 px-40 mt-12 pb-32">

        <div
          ref={imageBoxRef}
          className="beliefs-image-container h-[110vh]"
        >
          <img
            ref={imageRef}
            src="/products/beliefs-3.webp"
            alt="A vision of inspired living"
          />
        </div>

        <div className="beliefs-right-col flex flex-col">

          <div
            className="beliefs-title-wrap text-right w-[180%] -ml-[90%] mt-56"
          >
            {TITLE_LINES.map((line, i) => (
              <div key={i} className="beliefs-clip">
                <h2
                  ref={el => { titleInnerRefs.current[i] = el }}
                  className="beliefs-inner beliefs-title text-[clamp(4.5rem,8vw,10rem)]"
                >
                  {line}
                </h2>
              </div>
            ))}
          </div>

          <div
            ref={descClipRef}
            className="beliefs-desc-wrap beliefs-clip self-start relative -top-12 mt-[30vh] max-w-md"
          >
            <p
              ref={descInnerRef}
              className="beliefs-desc-text beliefs-inner text-[2.2rem] leading-relaxed font-(family-name:--font-body) text-white font-medium max-w-none"
            >
              To inspire and nurture an enriched lifestyle that harmonizes
              beauty, wellness, and cultural connection, creating a sanctuary
              that feels like home.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════ Part 2 — Full-width image + belief boxes ═══════════ */}
      <div ref={part2Ref} className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden beliefs-part2-bg">
          <img
            ref={bgImageRef}
            src="/products/beliefs4.webp"
            alt="Our beliefs background"
            className="beliefs-part2-bg-img absolute inset-0 w-full h-full object-cover object-center block"
          />
        </div>

        <div className="beliefs-part2-grid relative z-2 grid grid-cols-3 gap-x-8 gap-y-30 w-full min-h-screen items-start content-start">

          <div
            ref={el => { boxRefs.current[0] = el }}
            className="beliefs-box relative mt-[25px] h-80 max-w-[16rem] flex flex-col items-center justify-center px-6 py-5 bg-white/10 border border-white/15 rounded-3xl shadow-xl"
          >
            <h3 className="font-(--font-heading) text-[1.3rem] text-center uppercase tracking-wider leading-snug mb-3">
              {BELIEF_BOXES[0].title}
            </h3>
            <p className="font-(--font-body) text-[1.05rem] text-center leading-relaxed">
              {BELIEF_BOXES[0].text}
            </p>
            <span className="absolute bottom-4 left-4 font-(--font-body) text-xs tracking-widest">
              ({BELIEF_BOXES[0].id})
            </span>
          </div>

          <div
            ref={el => { boxRefs.current[1] = el }}
            className="beliefs-box relative mt-[25px] h-80 max-w-[16rem] flex flex-col items-center justify-center px-6 py-5 bg-white/10 border border-white/15 rounded-3xl shadow-xl"
          >
            <h3 className="font-(--font-heading) text-[1.3rem] text-center uppercase tracking-wider leading-snug mb-3">
              {BELIEF_BOXES[1].title}
            </h3>
            <p className="font-(--font-body) text-[1.05rem] text-center leading-relaxed">
              {BELIEF_BOXES[1].text}
            </p>
            <span className="absolute bottom-4 left-4 font-(--font-body) text-xs tracking-widest">
              ({BELIEF_BOXES[1].id})
            </span>
          </div>

          <div className="beliefs-side-text-wrap flex flex-col gap-8 mt-[25px] pt-4 pr-4">
            <p
              ref={el => { sideTextRefs.current[0] = el }}
              className="beliefs-side-text font-(--font-body) text-[1.4rem] leading-relaxed"
            >
              At Alta, we believe that a home is more than a physical space
              — it's a reflection of your aspirations, well-being, and values.
            </p>
            <p
              ref={el => { sideTextRefs.current[1] = el }}
              className="beliefs-side-text font-(--font-body) text-[1.4rem] leading-relaxed"
            >
              Our mission is to immerse you in a lifestyle that balances refined
              aesthetics, architectural excellence, and a profound sense of community.
            </p>
          </div>

          <div
            ref={el => { boxRefs.current[2] = el }}
            className="beliefs-box relative h-80 max-w-[16rem] flex flex-col items-center justify-center px-6 py-5 bg-white/10 border border-white/15 rounded-3xl shadow-xl"
          >
            <h3 className="font-(--font-heading) text-[1.3rem] text-center uppercase tracking-wider leading-snug mb-3">
              {BELIEF_BOXES[2].title}
            </h3>
            <p className="font-(--font-body) text-[1.05rem] text-center leading-relaxed">
              {BELIEF_BOXES[2].text}
            </p>
            <span className="absolute bottom-4 left-4 font-(--font-body) text-xs tracking-widest">
              ({BELIEF_BOXES[2].id})
            </span>
          </div>

          <div
            ref={el => { boxRefs.current[3] = el }}
            className="beliefs-box relative h-80 max-w-[16rem] flex flex-col items-center justify-center px-6 py-5 bg-white/10 border border-white/15 rounded-3xl shadow-xl"
          >
            <h3 className="font-(--font-heading) text-[1.3rem] text-center uppercase tracking-wider leading-snug mb-3">
              {BELIEF_BOXES[3].title}
            </h3>
            <p className="font-(--font-body) text-[1.05rem] text-center leading-relaxed">
              {BELIEF_BOXES[3].text}
            </p>
            <span className="absolute bottom-4 left-4 font-(--font-body) text-xs tracking-widest">
              ({BELIEF_BOXES[3].id})
            </span>
          </div>

          <div
            ref={el => { boxRefs.current[4] = el }}
            className="beliefs-box relative h-80 max-w-[16rem] flex flex-col items-center justify-center px-6 py-5 bg-white/10 border border-white/15 rounded-3xl shadow-xl"
          >
            <h3 className="font-(--font-heading) text-[1.3rem] text-center uppercase tracking-wider leading-snug mb-3">
              {BELIEF_BOXES[4].title}
            </h3>
            <p className="font-(--font-body) text-[1.05rem] text-center leading-relaxed">
              {BELIEF_BOXES[4].text}
            </p>
            <span className="absolute bottom-4 left-4 font-(--font-body) text-xs tracking-widest">
              ({BELIEF_BOXES[4].id})
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}

export default OurBeliefs
