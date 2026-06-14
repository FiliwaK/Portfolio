import { Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'

import Scene          from './components/canvas/Scene.jsx'
import Loader         from './components/ui/Loader.jsx'
import Navbar         from './components/ui/Navbar.jsx'
import SectionOverlay from './components/ui/SectionOverlay.jsx'
import ProjectsPage   from './pages/ProjectsPage.jsx'
import ContactPage    from './pages/ContactPage.jsx'

import { scrollRef }  from './store/scrollRef.jsx'
import { mouseRef }   from './store/mouseRef.jsx'
import './index.css'

export const SECTION_PEAKS = [0.05, 0.28, 0.44, 0.60, 0.75, 0.87, 0.97]

/* ── Page d'accueil ─────────────────────────────────────────────────── */
function HomePage() {
  const progRef = useRef(null)

  useEffect(() => {
    let progress  = 0
    let snapTo    = null
    let snapTimer = null
    let snapRaf   = null

    const animateSnap = () => {
      if (snapTo === null) return
      progress += (snapTo - progress) * 0.07
      scrollRef.current = progress
      if (Math.abs(progress - snapTo) < 0.0008) {
        progress = snapTo; scrollRef.current = snapTo; snapTo = null; return
      }
      snapRaf = requestAnimationFrame(animateSnap)
    }

    const triggerSnap = () => {
      let nearest = null, minDist = Infinity
      SECTION_PEAKS.forEach(p => {
        const d = Math.abs(progress - p)
        if (d < minDist && d < 0.09) { minDist = d; nearest = p }
      })
      if (nearest !== null) { snapTo = nearest; cancelAnimationFrame(snapRaf); animateSnap() }
    }

    const onWheel = (e) => {
      snapTo = null; cancelAnimationFrame(snapRaf); clearTimeout(snapTimer)
      progress = Math.max(0, Math.min(1, progress + e.deltaY / (window.innerHeight * 3)))
      scrollRef.current = progress
      snapTimer = setTimeout(triggerSnap, 750)
    }

    let touchY = 0
    const onTouchStart = (e) => { touchY = e.touches[0].clientY }
    const onTouchMove  = (e) => {
      const delta = touchY - e.touches[0].clientY
      touchY = e.touches[0].clientY
      snapTo = null; cancelAnimationFrame(snapRaf); clearTimeout(snapTimer)
      progress = Math.max(0, Math.min(1, progress + delta / (window.innerHeight * 3)))
      scrollRef.current = progress
      snapTimer = setTimeout(triggerSnap, 750)
    }

    const onKeyDown = (e) => {
      if (!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','PageDown','PageUp'].includes(e.key)) return
      e.preventDefault()
      const fwd  = ['ArrowDown','ArrowRight','PageDown'].includes(e.key)
      const next = fwd
        ? SECTION_PEAKS.find(p => p > progress + 0.01)
        : [...SECTION_PEAKS].reverse().find(p => p < progress - 0.01)
      if (next !== undefined) { snapTo = next; cancelAnimationFrame(snapRaf); animateSnap() }
    }

    const onMouseMove = (e) => {
      mouseRef.x =  (e.clientX / window.innerWidth)  * 2 - 1
      mouseRef.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }

    const onSnapTo = (e) => {
      snapTo = e.detail; cancelAnimationFrame(snapRaf); animateSnap()
    }

    window.addEventListener('wheel',          onWheel,      { passive: true })
    window.addEventListener('touchstart',     onTouchStart, { passive: true })
    window.addEventListener('touchmove',      onTouchMove,  { passive: true })
    window.addEventListener('mousemove',      onMouseMove,  { passive: true })
    window.addEventListener('keydown',        onKeyDown)
    window.addEventListener('portfolio:snap', onSnapTo)

    return () => {
      clearTimeout(snapTimer); cancelAnimationFrame(snapRaf)
      window.removeEventListener('wheel',          onWheel)
      window.removeEventListener('touchstart',     onTouchStart)
      window.removeEventListener('touchmove',      onTouchMove)
      window.removeEventListener('mousemove',      onMouseMove)
      window.removeEventListener('keydown',        onKeyDown)
      window.removeEventListener('portfolio:snap', onSnapTo)
    }
  }, [])

  return (
    <>
      <Canvas
        camera={{ position: [0, 5.4, 5.5], fov: 44, near: 0.1, far: 250 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#00000e' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className="ui-layer">
        <Navbar />
        <SectionOverlay />
      </div>
    </>
  )
}

/* ── App ────────────────────────────────────────────────────────────── */
export default function App() {
  const location = useLocation()

  return (
    <>
      <Loader />
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/"        element={<HomePage />} />
          <Route path="/projets" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </PageTransition>
    </>
  )
}

/* ── Transition fade entre pages ────────────────────────────────────── */
function PageTransition({ children, key }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.style.opacity = '0'
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (ref.current) ref.current.style.opacity = '1'
      })
    })
    return () => cancelAnimationFrame(id)
  }, [key])

  return (
    <div ref={ref} style={{ transition: 'opacity 0.45s ease', opacity: 0, width: '100%', height: '100%' }}>
      {children}
    </div>
  )
}
