import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PROJECTS } from '../../constants/index.jsx'

const _v = new THREE.Vector3()

export default function SpacePlanets() {
  const meshRefs  = useRef([])
  const lightRefs = useRef([])
  const ringRefs  = useRef([])

  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime
    PROJECTS.forEach((p, i) => {
      const mesh  = meshRefs.current[i]
      const light = lightRefs.current[i]
      const ring  = ringRefs.current[i]
      if (!mesh) return

      mesh.rotation.y = t * 0.06 * (i % 2 === 0 ? 1 : -0.8)
      mesh.rotation.z = t * 0.015

      _v.set(...p.pos)
      const dist  = camera.position.distanceTo(_v)
      const prox  = Math.max(0, Math.min(1, 1 - (dist - 6) / 20))
      const emInt = 0.18 + prox * 2.2

      if (mesh.material) mesh.material.emissiveIntensity = emInt
      if (light)  light.intensity  = 1 + prox * 8
      if (ring)   ring.material.opacity = 0.08 + prox * 0.28
    })
  })

  return (
    <>
      {PROJECTS.map((p, i) => (
        <group key={p.id} position={p.pos}>
          <mesh ref={el => (meshRefs.current[i] = el)}>
            <sphereGeometry args={[p.size, 48, 48]} />
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.18}
              roughness={0.55}
              metalness={0.25}
            />
          </mesh>

          {/* Halo atmosphere */}
          <mesh ref={el => (ringRefs.current[i] = el)} rotation={[Math.PI * 0.08 * (i + 1), 0, 0]}>
            <ringGeometry args={[p.size * 1.45, p.size * 1.75, 64]} />
            <meshBasicMaterial
              color={p.color}
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          <pointLight
            ref={el => (lightRefs.current[i] = el)}
            color={p.color}
            intensity={1}
            distance={32}
            decay={1.8}
          />
        </group>
      ))}
    </>
  )
}
