import * as THREE from 'three'

export default function Nebula({ position, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[12, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.022} side={THREE.BackSide} />
    </mesh>
  )
}