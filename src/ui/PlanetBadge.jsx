import { useRef, useEffect } from 'react'
import { PROJECTS } from '../data/projects.jsx'
import scrollRef from '../store/scrollRef.jsx'

export default function PlanetBadge() {
  const badgeRef = useRef()

  useEffect(() => {
    let raf
    let lastSection = -1

    const update = () => {
      const s = Math.floor(scrollRef.current * 7.2)

      if (s !== lastSection && badgeRef.current) {
        lastSection = s
        const el = badgeRef.current
        const projectIndex = s - 2

        if (projectIndex >= 0 && projectIndex < PROJECTS.length) {
          const proj = PROJECTS[projectIndex]
          el.textContent          = `◉ ${proj.planet}`
          el.style.color          = proj.color
          el.style.borderColor    = proj.color + '66'
          el.style.opacity        = '1'
        } else {
          el.style.opacity = '0'
        }
      }

      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <div ref={badgeRef} className="planet-badge" />
}