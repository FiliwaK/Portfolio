import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Spaceship() {
  const group = useRef()

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.x = Math.sin(clock.elapsedTime * 0.4) * 0.07
      group.current.position.y = -0.55 + Math.sin(clock.elapsedTime * 0.65) * 0.04
    }
  })

  const hullMat = {
    color: '#0f172a',
    emissive: '#1e293b',
    emissiveIntensity: 0.15,
    metalness: 0.95,
    roughness: 0.05,
  }

  return (
    <group ref={group} position={[0, -0.55, 1.6]}>
      {/* Fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.12, 0.72, 8, 16]} />
        <meshStandardMaterial {...hullMat} />
      </mesh>

      {/* Cockpit vitré */}
      <mesh position={[0.52, 0.04, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#38bdf8"
          emissiveIntensity={0.6}
          transparent
          opacity={0.75}
          metalness={0.2}
          roughness={0.05}
        />
      </mesh>

      {/* Aile gauche */}
      <mesh position={[-0.1, -0.22, 0.33]} rotation={[0.3, 0, 0.15]}>
        <boxGeometry args={[0.56, 0.035, 0.38]} />
        <meshStandardMaterial {...hullMat} emissive="#334155" emissiveIntensity={0.12} />
      </mesh>

      {/* Aile droite */}
      <mesh position={[-0.1, -0.22, -0.33]} rotation={[-0.3, 0, 0.15]}>
        <boxGeometry args={[0.56, 0.035, 0.38]} />
        <meshStandardMaterial {...hullMat} emissive="#334155" emissiveIntensity={0.12} />
      </mesh>

      {/* Réacteur */}
      <mesh position={[-0.48, 0, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
      <pointLight position={[-0.65, 0, 0]} color="#00e5ff" intensity={1.5} distance={2.5} />
    </group>
  )
}