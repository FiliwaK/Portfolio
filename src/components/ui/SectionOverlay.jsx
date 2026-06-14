import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { scrollRef }  from '../../store/scrollRef.jsx'
import { mouseRef }   from '../../store/mouseRef.jsx'
import { PROJECTS, getCharRot } from '../../constants/index.jsx'

/* ── Seuils de chaque section ────────────────────────────────────────
   side dérivé de la rotation du Spartan :
   ry > 0 (regarde droite) → panel DROITE | ry < 0 → panel GAUCHE
   ─────────────────────────────────────────────────────────────────── */
const PANELS = [
  { id: 'hero',  start: 0.00, peak: 0.05, end: 0.18, side: 0 },
  { id: 'about', start: 0.20, peak: 0.28, end: 0.38, side: 1 },
  { id: 'p0',    start: 0.40, peak: 0.44, end: 0.53, proj: 0, side: 1 },
  { id: 'p1',    start: 0.55, peak: 0.60, end: 0.68, proj: 1, side: 0 },
  { id: 'p2',    start: 0.70, peak: 0.75, end: 0.82, proj: 2, side: 1 },
  { id: 'p3',    start: 0.84, peak: 0.87, end: 0.93, proj: 3, side: 0 },
  { id: 'p4',    start: 0.95, peak: 0.97, end: 1.00, proj: 4, side: 1 },
]

/* ── Chips skill hero — flottent sur le fond ─────────────────────── */
const CHIPS = [
  { label: 'PYTHON',          left: '7%',  top: '24%', depth: 0.80 },
  { label: 'C#',              left: '11%', top: '50%', depth: 0.55 },
  { label: 'MEDIAPIPE',       left: '6%',  top: '70%', depth: 0.90 },
  { label: 'YOLO',            left: '78%', top: '20%', depth: 0.65 },
  { label: 'COMPUTER VISION', left: '72%', top: '46%', depth: 0.45 },
  { label: 'REALSENSE D455',  left: '74%', top: '68%', depth: 0.75 },
  { label: 'THREE.JS',        left: '43%', top: '86%', depth: 0.60 },
]

const lerp = (a, b, t) => a + (b - a) * t

function fade(sc, p) {
  if (sc <= p.start || sc >= p.end) return 0
  if (sc <= p.peak) return (sc - p.start) / (p.peak - p.start)
  return 1 - (sc - p.peak) / (p.end - p.peak)
}

function getLabel(sc) {
  if (sc < 0.20) return 'INTRO'
  if (sc < 0.40) return 'PROFIL'
  const n = Math.min(5, Math.floor((sc - 0.40) / 0.12) + 1)
  return `PROJET ${n} / 5`
}

/* ════════════════════════════════════════════════════════════════════ */
export default function SectionOverlay() {
  const wrapRefs    = useRef([])
  const posRefs     = useRef([])
  const cardRefs    = useRef([])
  const chipWraps   = useRef([])
  const heroNameRef = useRef(null)
  const progRef     = useRef(null)
  const statusRef   = useRef(null)
  const pctRef      = useRef(null)
  const dotsRef     = useRef([])

  /* ── Tilt 3D sur les cartes ──────────────────────────────────────── */
  useEffect(() => {
    const cleanup = []
    cardRefs.current.forEach(card => {
      if (!card) return
      const onMove = (e) => {
        const r  = card.getBoundingClientRect()
        const cx = ((e.clientX - r.left)  / r.width  - 0.5) * 2
        const cy = ((e.clientY - r.top)   / r.height - 0.5) * 2
        card.style.transform = `perspective(700px) rotateY(${cx * 8}deg) rotateX(${-cy * 5}deg) translateY(-5px) scale(1.012)`
        card.style.boxShadow = `${-cx * 12}px ${-cy * 6}px 36px rgba(0,0,28,.9), 0 0 24px rgba(0,229,255,.06)`
      }
      const onLeave = () => { card.style.transform = ''; card.style.boxShadow = '' }
      card.addEventListener('mousemove',  onMove)
      card.addEventListener('mouseleave', onLeave)
      cleanup.push(() => {
        card.removeEventListener('mousemove',  onMove)
        card.removeEventListener('mouseleave', onLeave)
      })
    })
    return () => cleanup.forEach(f => f())
  }, [])

  /* ── RAF ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    let raf
    let smoothSide = 0
    let smoothHX   = 0
    let smoothHY   = 0
    const PANEL_W  = 420
    const MARGIN   = 44

    const tick = () => {
      const sc = scrollRef.current
      const mx = mouseRef.x
      const my = mouseRef.y

      /* Progression */
      if (progRef.current) progRef.current.style.width = `${sc * 100}%`
      if (pctRef.current)  pctRef.current.textContent  = `${Math.round(sc * 100)}%`
      if (statusRef.current) statusRef.current.textContent = getLabel(sc)

      /* Dots */
      dotsRef.current.forEach((el, i) => {
        if (!el) return
        const op = fade(sc, PANELS[i])
        el.style.opacity    = op > 0.4 ? '1' : '0.22'
        el.style.transform  = op > 0.4 ? 'scale(2)' : 'scale(1)'
        el.style.background = op > 0.4 ? 'var(--cyan)' : 'rgba(255,255,255,.22)'
      })

      /* Visibilité panneaux */
      wrapRefs.current.forEach((el, i) => {
        if (!el) return
        const op = fade(sc, PANELS[i])
        el.style.opacity    = op
        el.style.visibility = op > 0.01 ? 'visible' : 'hidden'
      })

      /* Panel côté = côté où regarde le Spartan */
      let targetSide = 0
      PANELS.forEach(p => { if (fade(sc, p) > 0.01) targetSide = p.side })
      smoothSide = lerp(smoothSide, targetSide, 0.045)
      const slideX = smoothSide * Math.max(0, window.innerWidth - PANEL_W - MARGIN * 2)
      posRefs.current.forEach(el => {
        if (el) el.style.left = `${MARGIN + slideX}px`
      })

      /* Nom hero — drift souris */
      smoothHX = lerp(smoothHX, mx * 12, 0.04)
      smoothHY = lerp(smoothHY, -my * 7,  0.04)
      if (heroNameRef.current) {
        heroNameRef.current.style.transform = `translate(${smoothHX}px, ${smoothHY}px)`
      }

      /* Chips parallaxe */
      chipWraps.current.forEach(wrap => {
        if (!wrap) return
        const d = parseFloat(wrap.dataset.depth || '0.6')
        wrap.style.transform = `translate(${mx * 26 * d}px, ${-my * 15 * d}px)`
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      {/* ── Barre de progression ──────────────────────────────────── */}
      <div className="prog-bg"><div ref={progRef} className="prog-fill" /></div>

      {/* ── HUD ───────────────────────────────────────────────────── */}
      <div className="hud-rot">
        <span ref={statusRef}>INTRO</span>
      </div>
      <div className="hud-pct"><span ref={pctRef}>0%</span></div>

      {/* ── Dots nav ──────────────────────────────────────────────── */}
      <div className="ind-col">
        {PANELS.map((p, i) => {
          const label = p.id === 'hero' ? 'Intro'
            : p.id === 'about' ? 'Profil'
            : `Projet ${(p.proj ?? 0) + 1}`
          return (
            <div
              key={p.id}
              ref={el => (dotsRef.current[i] = el)}
              className="ind-dot"
              title={label}
              onClick={() => window.dispatchEvent(new CustomEvent('portfolio:snap', { detail: p.peak }))}
            />
          )
        })}
      </div>

      {/* ── Panneaux ──────────────────────────────────────────────── */}
      {PANELS.map((panel, i) => (
        <div
          key={panel.id}
          ref={el => (wrapRefs.current[i] = el)}
          className="ov-wrap"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          {panel.id === 'hero' ? (
            <>
              {/* Chips skill flottantes */}
              {CHIPS.map((c, ci) => (
                <div
                  key={c.label}
                  ref={el => (chipWraps.current[ci] = el)}
                  className="chip-wrap"
                  data-depth={c.depth}
                  style={{ left: c.left, top: c.top }}
                >
                  <span className="skill-chip">{c.label}</span>
                </div>
              ))}

              {/* Nom + CTA — bas gauche */}
              <div ref={heroNameRef} className="hero-name-block">
                <p className="hero-eyebrow">
                  [ DEC TECHNIQUES DE L'INFORMATIQUE · CÉGEP BEAUCE-APPALACHES ]
                </p>
                <h1 className="hero-name">
                  <span className="hero-solid">FABRICE</span>
                  <span className="hero-outline">KOUAKOUI</span>
                </h1>
                <p className="hero-sub">Computer Vision · IA embarquée · Interfaces 3D</p>
                <div className="hero-ctas">
                  <Link to="/projets" className="btn-primary" style={{ textDecoration: 'none' }}>
                    Voir mes projets →
                  </Link>
                  <Link to="/contact" className="btn-ghost" style={{ textDecoration: 'none' }}>
                    Me contacter
                  </Link>
                </div>
              </div>

              {/* Scroll hint */}
              <div className="scroll-hint">
                <div className="scroll-line" />
                <span>DÉFILER</span>
              </div>

              {/* Badge diplôme */}
              <div className="hero-badge">
                <span className="badge-icon">◈</span>
                <span className="badge-label">DIPLÔMÉ 2024</span>
              </div>
            </>
          ) : (
            <div ref={el => (posRefs.current[i] = el)} className="panel-pos">
              <div ref={el => (cardRefs.current[i] = el)} className="info-card">
                {panel.id === 'about' && <AboutContent />}
                {panel.proj != null && (
                  <ProjectContent project={PROJECTS[panel.proj]} idx={panel.proj} />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

/* ── ABOUT ────────────────────────────────────────────────────────── */
function AboutContent() {
  return (
    <>
      <p className="card-eyebrow">[ PROFIL ]</p>
      <h2 className="card-title">À PROPOS</h2>
      <p className="card-text">
        Diplômé en Techniques de l'informatique du Cégep de
        Beauce-Appalaches (Québec). Passionné par la Computer Vision
        et l'IA embarquée — je construis des interfaces qui effacent
        la frontière entre le corps humain et la machine.{'\n\n'}
        Projets notables : 5 applications de vision par ordinateur
        autour de la caméra Intel RealSense D455, un projet 3D Unity
        et des systèmes de gestion de bases de données SQL.
      </p>
      <div className="chip-row">
        {[
          'Python','C#','MediaPipe','YOLO','RealSense D455',
          'OpenVINO','ONNX','Unity','SQL Server','React','Three.js'
        ].map(t => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>
      <a
        href="https://github.com/FiliwaK"
        target="_blank" rel="noreferrer"
        className="card-link"
      >
        ↗ GITHUB · FiliwaK
      </a>
    </>
  )
}

/* ── PROJECT ──────────────────────────────────────────────────────── */
function ProjectContent({ project, idx }) {
  if (!project) return null
  return (
    <>
      <div className="card-accent" style={{ background: project.color }} />
      <p className="card-eyebrow" style={{ color: project.color }}>
        [ {idx + 1} / 5 · {project.planet} ]
      </p>
      <h2 className="card-title">{project.name}</h2>
      <p className="card-text">{project.description}</p>
      <div className="chip-row">
        {project.tech.split(' · ').map(t => (
          <span
            key={t}
            className="chip"
            style={{ borderColor: `${project.color}44` }}
          >
            {t}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        {project.url && (
          <a
            href={project.url}
            target="_blank" rel="noreferrer"
            className="card-link"
            style={{ color: project.color }}
          >
            ↗ GITHUB
          </a>
        )}
        <Link
          to="/projets"
          className="card-link"
          style={{ textDecoration: 'none', color: 'rgba(180,220,255,.35)' }}
        >
          ↗ TOUS LES PROJETS
        </Link>
      </div>
    </>
  )
}
