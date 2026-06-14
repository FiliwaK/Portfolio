import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollRef } from '../../store/scrollRef.jsx'

export default function EnvironmentSpace() {
  const { scene } = useGLTF('/models/deep_space_skybox_16k_with_planets.glb')
  const groupRef  = useRef()

  const mats = useMemo(() => {
    const list = []
    scene.traverse(child => {
      if (!child.isMesh) return
      child.renderOrder = -100
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
    // Fade in sc 0.28→0.50 · pleine opacité 0.50→1.0
    const op = sc < 0.28 ? 0 : Math.min(1.0, (sc - 0.28) / 0.22)
    for (const m of mats) m.opacity = op
    groupRef.current.visible = op > 0.004

    // Rotation lente liée au scroll
    groupRef.current.rotation.y = sc * Math.PI * 0.5
  })

  return (
    <group ref={groupRef} renderOrder={-100}>
      <primitive object={scene} scale={180} />
    </group>
  )
}

useGLTF.preload('/models/deep_space_skybox_16k_with_planets.glb')
