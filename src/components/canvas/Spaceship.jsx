import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Alloués une fois, réutilisés chaque frame (évite la GC)
const _off = new THREE.Vector3(0, -0.62, -2.2)
const _worldOff = new THREE.Vector3()

export default function Spaceship() {
  const group = useRef()

  // Le vaisseau suit la caméra en bas de l'écran à chaque frame
  useFrame(({ camera, clock }) => {
    if (!group.current) return
    _worldOff.copy(_off).applyQuaternion(camera.quaternion)
    group.current.position.copy(camera.position).add(_worldOff)
    group.current.quaternion.copy(camera.quaternion)
    // Légère dérive organique
    group.current.position.x += Math.sin(clock.elapsedTime * 0.4) * 0.06
    group.current.position.y += Math.sin(clock.elapsedTime * 0.65) * 0.03
  })

  const hullMat = {
    color: '#0f172a',
    emissive: '#1e293b',
    emissiveIntensity: 0.15,
    metalness: 0.95,
    roughness: 0.05,
  }

  return (
    <group ref={group}>
      {/* Fuselage — capsule orientée z (nez vers -z = avant) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.72, 8, 16]} />
        <meshStandardMaterial {...hullMat} />
      </mesh>

      {/* Cockpit vitré (avant = -z) */}
      <mesh position={[0, 0.04, -0.52]}>
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
      <mesh position={[-0.38, -0.05, 0.08]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.48, 0.035, 0.38]} />
        <meshStandardMaterial {...hullMat} emissive="#334155" emissiveIntensity={0.12} />
      </mesh>

      {/* Aile droite */}
      <mesh position={[0.38, -0.05, 0.08]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.48, 0.035, 0.38]} />
        <meshStandardMaterial {...hullMat} emissive="#334155" emissiveIntensity={0.12} />
      </mesh>

      {/* Réacteur arrière (+z) */}
      <mesh position={[0, 0, 0.46]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
      <pointLight position={[0, 0, 0.72]} color="#00e5ff" intensity={1.5} distance={2.5} />
    </group>
  )
}
