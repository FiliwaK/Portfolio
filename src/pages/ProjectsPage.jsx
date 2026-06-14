import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { mouseRef } from '../store/mouseRef.jsx'
import { PROJECTS } from '../constants/index.jsx'
import Navbar from '../components/ui/Navbar.jsx'

/* ── Scène 3D — Futuristic Room ─────────────────────────────────────── */
function RoomScene() {
  const { scene } = useGLTF('/models/futuristic_room.glb')
  const groupRef  = useRef()
  const { camera } = useThree()

  useEffect(() => {
    scene.traverse(child => {
      if (!child.isMesh) return
      const apply = m => {
        m.transparent = false
        m.needsUpdate = true
      }
      Array.isArray(child.material) ? child.material.forEach(apply) : apply(child.material)
    })
  }, [scene])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t  = clock.elapsedTime
    const mx = mouseRef.x
    const my = mouseRef.y
    groupRef.current.rotation.y = mx * 0.08 + Math.sin(t * 0.06) * 0.04
    groupRef.current.rotation.x = my * 0.04 + Math.sin(t * 0.09) * 0.015
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} scale={1.8} position={[0, -1.8, 0]} />
      </group>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 6, 4]}   color="#00e5ff" intensity={3} distance={20} decay={2} />
      <pointLight position={[-4, 4, -2]} color="#7b2fff" intensity={2} distance={16} decay={2} />
      <pointLight position={[0, 8, 0]}   color="#ffffff" intensity={1} distance={14} decay={2} />
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.12} luminanceSmoothing={0.85} mipmapBlur />
      </EffectComposer>
    </>
  )
}

useGLTF.preload('/models/futuristic_room.glb')

/* ── Page ───────────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.x =  (e.clientX / window.innerWidth)  * 2 - 1
      mouseRef.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [0, 2, 7], fov: 52, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#00000e' }}
      >
        <Suspense fallback={null}>
          <RoomScene />
        </Suspense>
      </Canvas>

      {/* UI */}
      <div className="ui-layer">
        <Navbar />

        {/* Overlay sombre pour lisibilité */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,14,.78) 0%, rgba(0,0,14,.18) 55%, rgba(0,0,14,.72) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Header section */}
        <div ref={overlayRef} style={{ position: 'absolute', inset: 0, padding: '0 44px', overflowY: 'auto' }}>
          <div style={{ paddingTop: '110px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Titre */}
            <p style={{ fontSize: '8px', letterSpacing: '.28em', color: 'rgba(0,229,255,.45)', marginBottom: '10px' }}>
              [ PROJETS · COMPUTER VISION ]
            </p>
            <h1 style={{
              fontFamily: '"Bebas Neue", cursive',
              fontSize: 'clamp(52px, 7vw, 96px)',
              lineHeight: '.9', letterSpacing: '.03em',
              color: '#d8eeff', marginBottom: '10px',
            }}>
              MES <span style={{ WebkitTextStroke: '1.5px #00e5ff', color: 'transparent', filter: 'drop-shadow(0 0 14px rgba(0,229,255,.38))' }}>CRÉATIONS</span>
            </h1>
            <p style={{ fontSize: '10px', letterSpacing: '.08em', color: 'rgba(180,220,255,.35)', marginBottom: '48px', lineHeight: 1.7 }}>
              5 projets · Computer Vision · IA Embarquée · Interfaces 3D
            </p>

            {/* Grille projets */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '18px',
            }}>
              {PROJECTS.map((proj, i) => (
                <ProjectCard key={proj.id} proj={proj} idx={i} />
              ))}
            </div>

            {/* Retour */}
            <div style={{ marginTop: '48px', paddingBottom: '40px' }}>
              <Link to="/" className="btn-ghost" style={{ textDecoration: 'none' }}>
                ← Retour à l'univers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Carte projet ───────────────────────────────────────────────────── */
function ProjectCard({ proj, idx }) {
  const ref = useRef(null)

  useEffect(() => {
    const card = ref.current
    if (!card) return
    const onMove = (e) => {
      const r  = card.getBoundingClientRect()
      const cx = ((e.clientX - r.left)  / r.width  - 0.5) * 2
      const cy = ((e.clientY - r.top)   / r.height - 0.5) * 2
      card.style.transform = `perspective(700px) rotateY(${cx * 7}deg) rotateX(${-cy * 4}deg) scale(1.02)`
      card.style.boxShadow = `0 0 40px ${proj.color}33, 0 20px 40px rgba(0,0,24,.8)`
    }
    const onLeave = () => { card.style.transform = ''; card.style.boxShadow = '' }
    card.addEventListener('mousemove',  onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
  }, [proj.color])

  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(3,3,22,0.82)',
        border: `1px solid ${proj.color}33`,
        borderRadius: '12px', padding: '24px',
        backdropFilter: 'blur(20px)',
        transition: 'transform .25s, box-shadow .25s',
        willChange: 'transform',
        position: 'relative', overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      {/* Accent top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: proj.color, borderRadius: '12px 12px 0 0' }} />

      {/* Numéro */}
      <p style={{ fontSize: '8px', letterSpacing: '.22em', color: proj.color, marginBottom: '8px' }}>
        [ {String(idx + 1).padStart(2, '0')} · {proj.planet} ]
      </p>

      {/* Titre */}
      <h3 style={{
        fontFamily: '"Bebas Neue", cursive',
        fontSize: 'clamp(20px, 2.2vw, 28px)',
        color: '#d8eeff', marginBottom: '10px', lineHeight: 1.05,
      }}>
        {proj.name}
      </h3>

      {/* Description */}
      <p style={{ fontSize: '10px', lineHeight: 1.9, color: 'rgba(180,220,255,.38)', marginBottom: '14px', whiteSpace: 'pre-line' }}>
        {proj.description}
      </p>

      {/* Chips tech */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
        {proj.tech.split(' · ').map(t => (
          <span key={t} style={{
            padding: '3px 8px',
            background: `${proj.color}0d`,
            border: `1px solid ${proj.color}33`,
            borderRadius: '3px',
            fontSize: '7.5px', color: 'rgba(180,220,255,.4)',
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Lien */}
      {proj.url && (
        <a
          href={proj.url}
          target="_blank" rel="noreferrer"
          style={{
            fontSize: '8.5px', letterSpacing: '.16em',
            color: proj.color, textDecoration: 'none', opacity: .7,
            transition: 'opacity .2s',
          }}
          onMouseEnter={e => (e.target.style.opacity = '1')}
          onMouseLeave={e => (e.target.style.opacity = '.7')}
        >
          ↗ VOIR SUR GITHUB
        </a>
      )}
    </div>
  )
}
