import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollRef } from '../../store/scrollRef.jsx'

export default function EnvironmentCave() {
  const { scene } = useGLTF('/models/cave_on_an_alien_planet_skybox.glb')
  const groupRef  = useRef()

  const mats = useMemo(() => {
    const list = []
    scene.traverse(child => {
      if (!child.isMesh) return
      child.renderOrder = -200
      const apply = m => {
        m.side        = THREE.DoubleSide
        m.transparent = true
        m.depthWrite  = false
        m.needsUpdate = true
        list.push(m)
      }
      Array.isArray(child.material) ? child.material.forEach(apply) : apply(child.material)
    })
    return list
  }, [scene])

  useFrame(({ camera }) => {
    if (!groupRef.current) return
    groupRef.current.position.copy(camera.position)

    const sc = scrollRef.current
    // Pleine opacité sc 0→0.28 · fondu sc 0.28→0.50
    const op = sc < 0.28 ? 1.0 : Math.max(0, 1.0 - (sc - 0.28) / 0.22)
    for (const m of mats) m.opacity = op
    groupRef.current.visible = op > 0.004

    groupRef.current.rotation.y += 0.00025
  })

  return (
    <group ref={groupRef} renderOrder={-200}>
      <primitive object={scene} scale={150} />
    </group>
  )
}

useGLTF.preload('/models/cave_on_an_alien_planet_skybox.glb')
