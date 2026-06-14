import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const LINKS = [
  { label: 'UNIVERS',  to: '/'        },
  { label: 'PROJETS',  to: '/projets' },
  { label: 'CONTACT',  to: '/contact' },
]

export default function Navbar() {
  const linksRef = useRef([])
  const location = useLocation()

  useEffect(() => {
    const cleanup = []
    linksRef.current.forEach((el) => {
      if (!el) return
      const enter = () =>
        gsap.to(el, { color: '#00e5ff', textShadow: '0 0 10px rgba(0,229,255,0.5)', duration: 0.2 })
      const leave = () => {
        const isActive = el.getAttribute('data-active') === 'true'
        gsap.to(el, {
          color: isActive ? '#00e5ff' : 'rgba(180,220,255,0.35)',
          textShadow: isActive ? '0 0 10px rgba(0,229,255,0.3)' : 'none',
          duration: 0.2,
        })
      }
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
      cleanup.push(() => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave) })
    })
    return () => cleanup.forEach(f => f())
  }, [])

  return (
    <header className="header">
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>F.DEV</Link>

      <nav className="nav">
        {LINKS.map(({ label, to }, i) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              ref={el => (linksRef.current[i] = el)}
              data-active={active}
              style={{
                textDecoration: 'none',
                color:       active ? '#00e5ff' : 'rgba(180,220,255,0.35)',
                textShadow:  active ? '0 0 10px rgba(0,229,255,0.3)' : 'none',
                fontSize: '9px', letterSpacing: '.20em',
                fontFamily: '"Space Mono", monospace',
                textTransform: 'uppercase',
                transition: 'color .2s',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <a
        className="cta-btn"
        href="https://github.com/FiliwaK"
        target="_blank"
        rel="noreferrer"
      >
        GitHub →
      </a>
    </header>
  )
}
