import { useRef, useEffect } from 'react'
import { SECTIONS } from '../data/projects.jsx'
import scrollRef from '../store/scrollRef.jsx'

export default function SectionText() {
  const containerRef = useRef()

  useEffect(() => {
    let raf
    let lastSection = -1

    const update = () => {
      const s = Math.min(
        Math.floor(scrollRef.current * 7.2),
        SECTIONS.length - 1
      )

      if (s !== lastSection && containerRef.current) {
        lastSection = s
        const sec = SECTIONS[s]
        const el  = containerRef.current

        el.querySelector('.s-eye').textContent     = sec.eyebrow
        el.querySelector('.s-title').textContent   = sec.title
        el.querySelector('.s-outline').textContent = sec.outline || ''
        el.querySelector('.s-sub').textContent     = sec.sub

        // Transition douce
        el.style.opacity   = '0'
        el.style.transform = 'translateY(12px)'
        setTimeout(() => {
          el.style.opacity   = '1'
          el.style.transform = 'translateY(0)'
        }, 60)
      }

      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={containerRef} className="section-text">
      <p className="eyebrow s-eye">{SECTIONS[0].eyebrow}</p>
      <h1>
        <span className="s-title">{SECTIONS[0].title}</span>
        <span className="outline s-outline">{SECTIONS[0].outline}</span>
      </h1>
      <p className="sub s-sub">{SECTIONS[0].sub}</p>
    </div>
  )
}