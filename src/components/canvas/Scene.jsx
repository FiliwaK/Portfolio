import { Suspense, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { scrollRef }       from '../../store/scrollRef.jsx'
import EnvironmentCave     from './EnvironmentCave.jsx'
import EnvironmentSpace    from './EnvironmentSpace.jsx'
import SpartanCharacter    from './SpartanCharacter.jsx'

/* Caméra fixée sur la zone buste/tête (y ≈ 5.4, z = 5.5)
   Visible : y ≈ 3.2 → 7.6  (poitrine → dessus du casque) */
const CAM_Y = 5.4
const CAM_Z = 5.5

export default function Scene() {
  const { camera } = useThree()
  const cy = useRef(CAM_Y)
  const cx  = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    /* Léger flottement ambiant de la caméra */
    const tx = Math.sin(t * 0.09) * 0.03
    const ty = CAM_Y + Math.sin(t * 0.13) * 0.02
    cx.current  = THREE.MathUtils.lerp(cx.current,  tx, 0.015)
    cy.current  = THREE.MathUtils.lerp(cy.current,  ty, 0.015)

    camera.position.x = cx.current
    camera.position.y = cy.current
    camera.position.z = CAM_Z

    /* Toujours regarder le buste/tête du personnage */
    camera.lookAt(0, CAM_Y, 0)
  })

  return (
    <>
      <ambientLight intensity={0.05} />

      {/* Éclairage de scène — zône buste (y 5–8) */}
      <pointLight position={[ 0,  8, 5]}  color="#1a44ff" intensity={4.0} distance={20} decay={2} />
      <pointLight position={[-4,  7, 4]}  color="#00e5ff" intensity={1.4} distance={16} decay={2} />
      <pointLight position={[ 4,  6, 3]}  color="#7b2fff" intensity={0.9} distance={12} decay={2} />
      <pointLight position={[ 0,  8, -5]} color="#001a44" intensity={2.2} distance={18} decay={2} />

      <Suspense fallback={null}>
        <EnvironmentCave />
        <EnvironmentSpace />
        <SpartanCharacter />
      </Suspense>

      <EffectComposer>
        <Bloom intensity={1.6} luminanceThreshold={0.10} luminanceSmoothing={0.88} mipmapBlur />
      </EffectComposer>
    </>
  )
}
