import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { mouseRef } from '../store/mouseRef.jsx'
import Navbar from '../components/ui/Navbar.jsx'

/* ── Scène 3D — Hovercar + Space ────────────────────────────────────── */
function HovercarScene() {
  const { scene: carScene }   = useGLTF('/models/free_cyberpunk_hovercar.glb')
  const { scene: spaceScene } = useGLTF('/models/deep_space_skybox_16k_with_planets.glb')
  const carRef   = useRef()
  const spaceRef = useRef()
  const floatY   = useRef(0)

  /* Skybox space — DoubleSide transparent */
  useEffect(() => {
    spaceScene.traverse(child => {
      if (!child.isMesh) return
      const apply = m => { m.side = THREE.DoubleSide; m.depthWrite = false; m.transparent = false }
      Array.isArray(child.material) ? child.material.forEach(apply) : apply(child.material)
    })
  }, [spaceScene])

  useFrame(({ camera, clock }) => {
    const t  = clock.elapsedTime
    const mx = mouseRef.x
    const my = mouseRef.y

    /* Skybox suit la caméra */
    if (spaceRef.current) {
      spaceRef.current.position.copy(camera.position)
      spaceRef.current.rotation.y = t * 0.03
    }

    if (!carRef.current) return
    /* Flottement vertical */
    floatY.current = Math.sin(t * 0.8) * 0.12
    carRef.current.position.y = floatY.current - 0.4

    /* Réaction douce à la souris */
    carRef.current.rotation.y = THREE.MathUtils.lerp(
      carRef.current.rotation.y,
      mx * 0.35 + Math.PI * 0.18,
      0.04,
    )
    carRef.current.rotation.x = THREE.MathUtils.lerp(
      carRef.current.rotation.x,
      my * 0.08,
      0.04,
    )
    /* Inclinaison légère (roll) */
    carRef.current.rotation.z = THREE.MathUtils.lerp(
      carRef.current.rotation.z,
      -mx * 0.06,
      0.04,
    )
  })

  return (
    <>
      {/* Skybox */}
      <group ref={spaceRef} renderOrder={-100}>
        <primitive object={spaceScene} scale={180} />
      </group>

      {/* Hovercar */}
      <group ref={carRef} position={[0, 0, 0]}>
        <primitive object={carScene} scale={1.2} />
      </group>

      <ambientLight intensity={0.1} />
      <pointLight position={[3,  4, 5]}  color="#00e5ff" intensity={5}  distance={18} decay={2} />
      <pointLight position={[-3, 3, 3]}  color="#7b2fff" intensity={2}  distance={12} decay={2} />
      <pointLight position={[0,  6, -4]} color="#ff3c6e" intensity={1.5} distance={14} decay={2} />
      <pointLight position={[0, -2, 2]}  color="#1a44ff" intensity={1}  distance={10} decay={2} />

      <EffectComposer>
        <Bloom intensity={2.0} luminanceThreshold={0.08} luminanceSmoothing={0.90} mipmapBlur />
      </EffectComposer>
    </>
  )
}

useGLTF.preload('/models/free_cyberpunk_hovercar.glb')
useGLTF.preload('/models/deep_space_skybox_16k_with_planets.glb')

/* ── Page Contact ───────────────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'ok'

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.x =  (e.clientX / window.innerWidth)  * 2 - 1
      mouseRef.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')
    /* Ouvre le client mail avec les infos pré-remplies */
    const subject = encodeURIComponent(`Portfolio — message de ${form.name}`)
    const body    = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:kouakoufabrice7@gmail.com?subject=${subject}&body=${body}`
    setTimeout(() => setStatus('ok'), 800)
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 58, near: 0.1, far: 250 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#00000e' }}
      >
        <Suspense fallback={null}>
          <HovercarScene />
        </Suspense>
      </Canvas>

      <div className="ui-layer">
        <Navbar />

        {/* Overlay latéral */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,14,.88) 0%, rgba(0,0,14,.3) 48%, rgba(0,0,14,.02) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Formulaire */}
        <div style={{
          position: 'absolute', top: '50%', left: '44px',
          transform: 'translateY(-50%)',
          width: '420px', pointerEvents: 'auto',
        }}>
          <p style={{ fontSize: '8px', letterSpacing: '.28em', color: 'rgba(0,229,255,.45)', marginBottom: '10px' }}>
            [ CONTACT · COLLABORATION ]
          </p>
          <h1 style={{
            fontFamily: '"Bebas Neue", cursive',
            fontSize: 'clamp(48px, 6vw, 86px)',
            lineHeight: '.9', letterSpacing: '.03em',
            color: '#d8eeff', marginBottom: '10px',
          }}>
            TRAVAILLONS<br />
            <span style={{ WebkitTextStroke: '1.5px #00e5ff', color: 'transparent', filter: 'drop-shadow(0 0 14px rgba(0,229,255,.38))' }}>
              ENSEMBLE
            </span>
          </h1>
          <p style={{ fontSize: '10px', color: 'rgba(180,220,255,.35)', letterSpacing: '.08em', marginBottom: '32px', lineHeight: 1.7 }}>
            Computer Vision · IA embarquée · Interfaces 3D
          </p>

          {status === 'ok' ? (
            <div style={{
              background: 'rgba(0,229,255,.06)', border: '1px solid rgba(0,229,255,.2)',
              borderRadius: '10px', padding: '28px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '28px', marginBottom: '8px' }}>◈</p>
              <p style={{ fontFamily: '"Bebas Neue", cursive', fontSize: '22px', color: '#00e5ff', letterSpacing: '.08em' }}>
                MESSAGE ENVOYÉ
              </p>
              <p style={{ fontSize: '9px', color: 'rgba(180,220,255,.35)', marginTop: '6px' }}>
                Merci ! Je te réponds rapidement.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ContactInput
                  name="name" placeholder="Ton prénom / nom"
                  value={form.name} onChange={handleChange}
                />
                <ContactInput
                  name="email" type="email" placeholder="Ton adresse email"
                  value={form.email} onChange={handleChange}
                />
                <ContactTextarea
                  name="message" placeholder="Ton message..."
                  value={form.message} onChange={handleChange}
                />
                <button
                  type="submit"
                  disabled={!form.name || !form.email || !form.message || status === 'sending'}
                  className="btn-primary"
                  style={{ cursor: 'pointer', border: 'none', textAlign: 'center', marginTop: '4px' }}
                >
                  {status === 'sending' ? 'Envoi…' : 'Envoyer →'}
                </button>
              </div>
            </form>
          )}

          {/* Liens directs */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href="mailto:kouakoufabrice7@gmail.com"
              className="card-link"
              style={{ textDecoration: 'none' }}
            >
              ↗ EMAIL DIRECT
            </a>
            <a
              href="https://github.com/FiliwaK"
              target="_blank" rel="noreferrer"
              className="card-link"
              style={{ textDecoration: 'none' }}
            >
              ↗ GITHUB
            </a>
          </div>

          <div style={{ marginTop: '32px' }}>
            <Link to="/" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '8px' }}>
              ← Retour
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Input / Textarea stylisés ──────────────────────────────────────── */
const inputStyle = {
  width: '100%', background: 'rgba(3,3,22,.75)',
  border: '1px solid rgba(0,229,255,.12)', borderRadius: '6px',
  padding: '11px 14px', color: '#d8eeff',
  fontFamily: '"Space Mono", monospace', fontSize: '10px',
  letterSpacing: '.05em', outline: 'none',
  transition: 'border-color .2s, box-shadow .2s',
}

function ContactInput({ name, type = 'text', placeholder, value, onChange }) {
  return (
    <input
      type={type} name={name} placeholder={placeholder}
      value={value} onChange={onChange} required
      style={inputStyle}
      onFocus={e  => { e.target.style.borderColor = 'rgba(0,229,255,.40)'; e.target.style.boxShadow = '0 0 10px rgba(0,229,255,.08)' }}
      onBlur={e   => { e.target.style.borderColor = 'rgba(0,229,255,.12)'; e.target.style.boxShadow = 'none' }}
    />
  )
}

function ContactTextarea({ name, placeholder, value, onChange }) {
  return (
    <textarea
      name={name} placeholder={placeholder}
      value={value} onChange={onChange} required rows={4}
      style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
      onFocus={e  => { e.target.style.borderColor = 'rgba(0,229,255,.40)'; e.target.style.boxShadow = '0 0 10px rgba(0,229,255,.08)' }}
      onBlur={e   => { e.target.style.borderColor = 'rgba(0,229,255,.12)'; e.target.style.boxShadow = 'none' }}
    />
  )
}
