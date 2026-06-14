import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { scrollRef } from '../../store/scrollRef.jsx'

// Lumière bleue qui illumine la scène d'embarquement (sections 0-1.5)
// Positionnée au-dessus du hovercar garé
export default function BoardingLight() {
  const ref = useRef()

  useFrame(() => {
    if (!ref.current) return
    const t = scrollRef.current
    // Fade out 1.0 → 1.6
    const intensity = t < 1.0 ? 3.5 : Math.max(0, 3.5 * (1.0 - (t - 1.0) / 0.6))
    ref.current.intensity = intensity
  })

  return (
    <pointLight
      ref={ref}
      position={[2.5, 1.5, -0.5]}
      color="#3388ff"
      intensity={3.5}
      distance={8}
      decay={2}
    />
  )
}
