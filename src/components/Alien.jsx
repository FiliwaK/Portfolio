import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Alien() {
  const group   = useRef()
  const antenna = useRef()

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.12
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.3
    }
    if (antenna.current) {
      antenna.current.material.emissiveIntensity =
        0.5 + Math.sin(clock.elapsedTime * 4) * 0.5
    }
  })

  const bodyMat = {
    color: '#00e5ff',
    emissive: '#006064',
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8,
  }

  return (
    <group ref={group} position={[1.8, 0.3, 1]}>
      {/* Corps */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 8, 16]} />
        <meshStandardMaterial {...bodyMat} />
      </mesh>

      {/* Tête */}
      <mesh position={[0, 0.63, 0]}>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial {...bodyMat} emissiveIntensity={0.4} />
      </mesh>

      {/* Œil gauche */}
      <mesh position={[-0.13, 0.68, 0.3]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#000814" />
      </mesh>
      <pointLight position={[-0.13, 0.68, 0.45]} color="#00e5ff" intensity={0.5} distance={0.8} />

      {/* Œil droit */}
      <mesh position={[0.13, 0.68, 0.3]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#000814" />
      </mesh>
      <pointLight position={[0.13, 0.68, 0.45]} color="#00e5ff" intensity={0.5} distance={0.8} />

      {/* Tige antenne */}
      <mesh position={[0, 1.08, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.32, 8]} />
        <meshStandardMaterial color="#00e5ff" emissive="#006064" emissiveIntensity={0.6} />
      </mesh>

      {/* Boule antenne (clignote) */}
      <mesh ref={antenna} position={[0, 1.26, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1} />
      </mesh>

      {/* Bras gauche */}
      <mesh position={[-0.42, 0.1, 0]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.065, 0.38, 6, 12]} />
        <meshStandardMaterial {...bodyMat} emissiveIntensity={0.4} />
      </mesh>

      {/* Bras droit */}
      <mesh position={[0.42, 0.1, 0]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.065, 0.38, 6, 12]} />
        <meshStandardMaterial {...bodyMat} emissiveIntensity={0.4} />
      </mesh>

      {/* Jambe gauche */}
      <mesh position={[-0.13, -0.62, 0]}>
        <capsuleGeometry args={[0.08, 0.38, 6, 12]} />
        <meshStandardMaterial {...bodyMat} emissiveIntensity={0.3} />
      </mesh>

      {/* Jambe droite */}
      <mesh position={[0.13, -0.62, 0]}>
        <capsuleGeometry args={[0.08, 0.38, 6, 12]} />
        <meshStandardMaterial {...bodyMat} emissiveIntensity={0.3} />
      </mesh>

      {/* Halo corps */}
      <pointLight position={[0, 0.3, 0]} color="#00e5ff" intensity={1} distance={3} />
    </group>
  )
}