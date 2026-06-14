import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { SECTIONS } from '../../constants/index.jsx'
import { scrollRef } from '../../store/scrollRef.jsx'

export default function SectionText() {
  const containerRef = useRef()
  const eyebrowRef  = useRef()
  const titleRef    = useRef()
  const outlineRef  = useRef()
  const subRef      = useRef()

  useEffect(() => {
    let raf
    let lastSection = -1

    const update = () => {
      const s = Math.min(
        Math.floor(scrollRef.current + 0.15),
        SECTIONS.length - 1
      )

      if (s !== lastSection) {
        lastSection = s
        const sec = SECTIONS[s]

        // GSAP : sortie puis entrée
        const els = [eyebrowRef.current, titleRef.current, outlineRef.current, subRef.current]

        gsap.to(els, {
          y: -28,
          opacity: 0,
          duration: 0.22,
          stagger: 0.04,
          ease: 'power2.in',
          onComplete: () => {
            if (!eyebrowRef.current) return
            eyebrowRef.current.textContent  = sec.eyebrow
            titleRef.current.textContent    = sec.title
            outlineRef.current.textContent  = sec.outline || ''
            subRef.current.textContent      = sec.sub

            gsap.fromTo(
              els,
              { y: 28, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.38, stagger: 0.06, ease: 'power2.out' }
            )
          },
        })
      }

      raf = requestAnimationFrame(update)
    }

    // Initialise à la section 0 sans animation
    lastSection = 0
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={containerRef} className="section-text">
      <p ref={eyebrowRef}  className="eyebrow">{SECTIONS[0].eyebrow}</p>
      <h1>
        <span ref={titleRef}>{SECTIONS[0].title}</span>
        <span ref={outlineRef} className="outline">{SECTIONS[0].outline}</span>
      </h1>
      <p ref={subRef} className="sub">{SECTIONS[0].sub}</p>
    </div>
  )
}
