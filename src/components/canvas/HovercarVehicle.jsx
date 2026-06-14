import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollRef } from '../../store/scrollRef.jsx'

const TARGET_SIZE  = 1.2
const CAM_OFFSET_SM = new THREE.Vector3(0.65, -0.62, -2.0)   // petit — suit caméra
const CAM_OFFSET_LG = new THREE.Vector3(0,    -0.3,  -2.8)   // centré — moment vaisseau

const _worldOff = new THREE.Vector3()
const _lerpPos  = new THREE.Vector3()

export default function HovercarVehicle() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/free_cyberpunk_hovercar.glb')
  const { actions }           = useAnimations(animations, group)

  const scale = useMemo(() => {
    const box  = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    return maxDim > 0 ? TARGET_SIZE / maxDim : 0.35
  }, [scene])

  useEffect(() => {
    const first = Object.values(actions)[0]
    if (first) first.reset().play()
    return () => Object.values(actions).forEach(a => a?.stop())
  }, [actions])

  useFrame(({ camera, clock }) => {
    if (!group.current) return
    const sc  = scrollRef.current   // 0-1
    const t   = clock.elapsedTime
    const bob  = Math.sin(t * 0.7)  * 0.035
    const sway = Math.sin(t * 0.38) * 0.018

    if (sc < 0.20) {
      // ── Petit · suit caméra ──────────────────────────────────
      _worldOff.copy(CAM_OFFSET_SM).applyQuaternion(camera.quaternion)
      group.current.position.copy(camera.position).add(_worldOff)
      group.current.quaternion.copy(camera.quaternion)
      group.current.scale.setScalar(scale)

    } else if (sc < 0.50) {
      // ── Vaisseau grandit, glisse au centre ───────────────────
      const p = (sc - 0.20) / 0.30
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

      _worldOff.copy(CAM_OFFSET_LG).applyQuaternion(camera.quaternion)
      _lerpPos.copy(camera.position).add(_worldOff)
      group.current.position.lerp(_lerpPos, 0.05)
      group.current.quaternion.slerp(camera.quaternion, 0.04)
      group.current.scale.setScalar(scale * (1 + ease * 1.8)) // grandit 2.8×

    } else {
      // ── Pilotage — suit caméra, taille normale ───────────────
      _worldOff.copy(CAM_OFFSET_SM).applyQuaternion(camera.quaternion)
      group.current.position.copy(camera.position).add(_worldOff)
      group.current.quaternion.copy(camera.quaternion)
      group.current.scale.setScalar(scale)
    }

    group.current.position.y += bob
    group.current.position.x += sway
  })

  return (
    <group ref={group}>
      <primitive object={scene} scale={scale} />
      <pointLight color="#00aaff" intensity={4}   distance={5}   decay={2} />
      <pointLight color="#7b2fff" intensity={2}   distance={3}   decay={2} position={[0, 0.3, -0.4]} />
      <pointLight color="#00e5ff" intensity={1.5} distance={2.5} decay={2} position={[0, -0.4, 0.5]} />
    </group>
  )
}

useGLTF.preload('/models/free_cyberpunk_hovercar.glb')
