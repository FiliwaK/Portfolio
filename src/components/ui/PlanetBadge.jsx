import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { PROJECTS } from '../../constants/index.jsx'
import { scrollRef } from '../../store/scrollRef.jsx'

export default function PlanetBadge() {
  const badgeRef = useRef()
  const techRef  = useRef()

  useEffect(() => {
    let raf
    let lastSection = -1

    const update = () => {
      const s = Math.floor(scrollRef.current + 0.15)

      if (s !== lastSection) {
        lastSection = s
        const projectIndex = s - 2

        if (projectIndex >= 0 && projectIndex < PROJECTS.length) {
          const proj = PROJECTS[projectIndex]

          gsap.to(badgeRef.current, {
            opacity: 0,
            y: 8,
            duration: 0.2,
            onComplete: () => {
              if (!badgeRef.current) return
              badgeRef.current.querySelector('.badge-name').textContent = `◉ ${proj.planet}`
              badgeRef.current.querySelector('.badge-name').style.color = proj.color
              badgeRef.current.style.borderColor = proj.color + '55'
              if (techRef.current) techRef.current.textContent = proj.tech
              gsap.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.3 })
            },
          })
        } else {
          gsap.to(badgeRef.current, { opacity: 0, y: 8, duration: 0.2 })
        }
      }

      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={badgeRef} className="planet-badge" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span className="badge-name" style={{ letterSpacing: '0.18em' }} />
      <span ref={techRef} style={{ fontSize: '8px', color: 'rgba(224,247,250,0.35)', letterSpacing: '0.08em' }} />
    </div>
  )
}
