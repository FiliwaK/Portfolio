import * as THREE from 'three'

export default function Nebula({ position, color, scale = 12 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[scale, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.022}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
