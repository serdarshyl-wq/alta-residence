import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../css/Faq.css'

gsap.registerPlugin(ScrollTrigger)

const FAQS = [
  {
    id: 1,
    question: "WHAT TYPES OF HOMES ARE AVAILABLE?",
    answer: "Alta offers a selection of refined living spaces, including garden suites, duplex residences, and a signature penthouse. Each home is thoughtfully designed to balance elegance, comfort, and a deep connection to the surrounding landscape."
  },
  {
    id: 2,
    question: "DOES ALTA OFFER PRIVATE WELLNESS FACILITIES?",
    answer: "Yes. Residents enjoy exclusive access to our state-of-the-art wellness pavilion. This includes a private spa, temperature-controlled infinity pools, and dedicated meditation rooms designed to foster everyday tranquility."
  },
  {
    id: 3,
    question: "HOW CAN I SCHEDULE A PRIVATE VIEWING?",
    answer: "Private viewings are arranged strictly by appointment to ensure discretion and personalized attention. You may contact our dedicated concierge team via the inquiry form below or schedule directly through our sales gallery."
  }
]

export default function Faq() {
  const containerRef = useRef()
  const [activeIndex, setActiveIndex] = useState(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector
      const labels = q('.faq-header-label')
      const titles = q('.faq-header-title')
      const rows = q('.faq-row')

      // Hide all targets initially
      gsap.set([...labels, ...titles, ...q('.faq-row .faq-inner')], { yPercent: 100 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(labels, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1 }, 0)
        .to(titles, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1 }, 0.1)

      rows.forEach((row, i) => {
        const items = row.querySelectorAll('.faq-inner')
        tl.to(items, { yPercent: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08 }, 0.2 + (i * 0.15))
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="faq-section min-h-screen py-32 px-40 flex flex-col justify-center mt-8">

      <div className="faq-header-wrap flex justify-between items-start pb-20 mb-10 border-b border-[rgba(255,255,255,0.15)] relative">
        <div className="faq-mask faq-mask-padded mt-4">
          <span className="faq-inner faq-header-label text-[#aaaaaa] italic text-xl tracking-widest font-(--font-body)">
            ( FAQ )
          </span>
        </div>

        <div className="faq-titles-wrap text-right">
          <div className="faq-mask faq-mask-padded">
            <h2 className="faq-inner faq-header-title text-[10.5rem] leading-[0.9] uppercase whitespace-nowrap font-(--font-display) tracking-tight text-white">
              YOUR QUESTIONS,
            </h2>
          </div>
          <div className="faq-mask faq-mask-padded">
            <h2 className="faq-inner faq-header-title text-[10.5rem] leading-[0.9] uppercase whitespace-nowrap font-(--font-display) tracking-tight text-white">
              ANSWERED
            </h2>
          </div>
        </div>
      </div>

      <div className="faq-list flex flex-col flex-1 mt-[8vh]">
        {FAQS.map((faq, i) => (
          <div
            key={faq.id}
            className={`faq-row flex items-start relative cursor-pointer ${activeIndex === i ? 'is-active' : ''}`}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          >

            <div className="faq-id-wrap w-[10%] pt-2 faq-mask">
              <div className="faq-inner text-gray-500 font-(--font-body) text-[1.5rem] tracking-wider">
                ( {faq.id} )
              </div>
            </div>

            <div className="faq-a-wrap w-[45%] px-8 faq-mask faq-mask-padded">
              <div className="faq-inner faq-answer text-[#b8b8b8] font-(--font-body) text-[1.05rem] pr-10 leading-[1.6]">
                {faq.answer}
              </div>
            </div>

            <div className="faq-q-wrap w-[45%] text-right faq-mask faq-mask-padded">
              <div className="faq-inner faq-question text-[1.8rem] leading-tight italic font-(--font-heading) text-[#f0ece4]">
                {faq.question}
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  )
}
