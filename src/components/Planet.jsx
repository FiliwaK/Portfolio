import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Planet({ pos, color, emissive, size }) {
  const mesh = useRef()
  const ring = useRef()

  useFrame(() => {
    if (mesh.current) mesh.current.rotation.y += 0.002
    if (ring.current) ring.current.rotation.z += 0.001
  })

  return (
    <group position={pos}>
      {/* Aura externe */}
      <mesh>
        <sphereGeometry args={[size * 1.3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.04} />
      </mesh>

      {/* Corps de la planète */}
      <mesh ref={mesh}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.25}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Anneau orbital */}
      <mesh ref={ring} rotation={[Math.PI / 5, 0, 0]}>
        <ringGeometry args={[size * 1.45, size * 1.65, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* Lumière émise par la planète */}
      <pointLight color={color} intensity={2} distance={size * 5} />
    </group>
  )
}