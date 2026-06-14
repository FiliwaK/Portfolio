import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { scrollRef } from '../../store/scrollRef.jsx'
import * as THREE from 'three'

// 57MB — modification in-place (pas de clone)
export default function EnvironmentRoom() {
  const { scene } = useGLTF('/models/futuristic_room.glb')
  const groupRef = useRef()

  const mats = useMemo(() => {
    const list = []
    scene.traverse(child => {
      if (!child.isMesh) return
      const apply = m => {
        if (m._roomDone) return
        m.side = THREE.DoubleSide
        m.transparent = true
        m.depthWrite = false
        m._roomDone = true
        list.push(m)
      }
      Array.isArray(child.material) ? child.material.forEach(apply) : apply(child.material)
    })
    return list
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return
    const t = scrollRef.current
    // Section "about" : fondu in 1.5→2.2 · plein 2.2→3.0 · fondu out 3.0→4.0
    // (décalé pour ne pas chevaucher la séquence d'embarquement)
    let op = 0
    if      (t >= 1.5 && t < 2.2) op = (t - 1.5) / 0.7
    else if (t >= 2.2 && t < 3.0) op = 1.0
    else if (t >= 3.0 && t < 4.0) op = 1.0 - (t - 3.0)
    for (const m of mats) m.opacity = op
    groupRef.current.visible = op > 0.005
  })

  return (
    // Caméra en section 1 : [0→1, 0, 0→-7] → pièce centrée autour de ça
    <group ref={groupRef} position={[0.5, -1.5, -4]}>
      <primitive object={scene} scale={1.5} />
    </group>
  )
}

useGLTF.preload('/models/futuristic_room.glb')
