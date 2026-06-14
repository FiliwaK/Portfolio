import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Stars } from '@react-three/drei'
import * as THREE from 'three'

import Alien     from './Alien'
import Spaceship from './Spaceship'
import Planet    from './Planet'
import Nebula    from './Nebula'
import { PROJECTS } from '../data/projects.jsx'
import scrollRef    from '../store/scrollRef.jsx'

// Nébuleuses décorative liées aux couleurs des planètes
const NEBULAE = [
  { position: [ 5,  0, -22], color: '#3b82f6' },
  { position: [-8,  3, -40], color: '#22c55e' },
  { position: [ 6, -2, -56], color: '#a855f7' },
  { position: [-5,  1, -73], color: '#f97316' },
  { position: [ 3, -1, -90], color: '#ef4444' },
]

// Points de passage de la caméra selon la section (0 à 6)
function getCameraTarget(s) {
  if      (s < 1) return [0,   0,   THREE.MathUtils.lerp(5,  0,  s)]
  else if (s < 2) { const p = s-1; return [THREE.MathUtils.lerp(0,  1,p), 0,                              THREE.MathUtils.lerp(0,  -7, p)] }
  else if (s < 3) { const p = s-2; return [THREE.MathUtils.lerp(1,  4,p), THREE.MathUtils.lerp(0,  0.3,p), THREE.MathUtils.lerp(-7, -14,p)] }
  else if (s < 4) { const p = s-3; return [THREE.MathUtils.lerp(4, -5,p), THREE.MathUtils.lerp(0.3,1.5,p), THREE.MathUtils.lerp(-14,-30,p)] }
  else if (s < 5) { const p = s-4; return [THREE.MathUtils.lerp(-5, 3,p), THREE.MathUtils.lerp(1.5,-0.5,p),THREE.MathUtils.lerp(-30,-46,p)] }
  else if (s < 6) { const p = s-5; return [THREE.MathUtils.lerp(3, -4,p), THREE.MathUtils.lerp(-0.5,0.8,p),THREE.MathUtils.lerp(-46,-63,p)] }
  else             { const p = Math.min(s-6,1); return [THREE.MathUtils.lerp(-4,2,p), THREE.MathUtils.lerp(0.8,-1,p), THREE.MathUtils.lerp(-63,-81,p)] }
}

export default function Scene() {
  const scroll   = useScroll()
  const { camera } = useThree()
  const alienRef = useRef()

  useFrame(() => {
    const t = scroll.offset
    scrollRef.current = t

    const [tx, ty, tz] = getCameraTarget(t * 7)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, 0.05)

    // L'alien disparaît après l'intro
    if (alienRef.current) alienRef.current.visible = t < 0.22
  })

  return (
    <>
      <ambientLight intensity={0.08} />

      <Stars radius={200} depth={100} count={4000} factor={4} saturation={0} fade speed={0.3} />

      {NEBULAE.map((n, i) => (
        <Nebula key={i} position={n.position} color={n.color} />
      ))}

      <group ref={alienRef}>
        <Alien />
      </group>

      <Spaceship />

      {PROJECTS.map((p) => (
        <Planet key={p.id} pos={p.pos} color={p.color} emissive={p.emissive} size={p.size} />
      ))}

      <fog attach="fog" args={['#000008', 90, 230]} />
    </>
  )
}