import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollRef }  from '../../store/scrollRef.jsx'
import { getCharRot } from '../../constants/index.jsx'

const TARGET_HEIGHT = 7.0

const BONE_HEAD   = 'mixamorig:Head_06'
const BONE_NECK   = 'mixamorig:Neck_05'
const BONE_SPINE  = 'mixamorig:Spine2_04'
const BONE_SPINE1 = 'mixamorig:Spine1_03'

export default function SpartanCharacter() {
  const group = useRef()
  const bones = useRef({ head: null, neck: null, spine: null, spine1: null })
  const smooth = useRef({
    rotY: 0, bodyX: 0, bodyZ: 0,
    headY: 0, headX: 0,
    neckY: 0, neckX: 0,
    spineY: 0,
    posX: 0,  posY: 0,
  })

  const { scene, animations } = useGLTF('/models/spartan_armour_mkv_-_halo_reach.glb')
  const { actions }           = useAnimations(animations, group)

  const { scale, yOffset } = useMemo(() => {
    const box  = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const s    = size.y > 0 ? TARGET_HEIGHT / size.y : 1.0
    const yOff = -box.min.y * s
    scene.traverse(child => {
      if (!child.isMesh) return
      const apply = m => { m.transparent = true; m.opacity = 1.0 }
      Array.isArray(child.material) ? child.material.forEach(apply) : apply(child.material)
    })
    return { scale: s, yOffset: yOff }
  }, [scene])

  useEffect(() => {
    scene.traverse(obj => {
      if (obj.name === BONE_HEAD)   bones.current.head   = obj
      if (obj.name === BONE_NECK)   bones.current.neck   = obj
      if (obj.name === BONE_SPINE)  bones.current.spine  = obj
      if (obj.name === BONE_SPINE1) bones.current.spine1 = obj
    })
  }, [scene])

  useEffect(() => {
    const anim = actions['Take 001'] ?? Object.values(actions)[0]
    if (anim) {
      anim.reset().fadeIn(0.3).play()
      anim.setLoop(THREE.LoopRepeat, Infinity)
    }
    return () => Object.values(actions).forEach(a => a?.stop())
  }, [actions])

  useFrame(({ pointer, clock }) => {
    if (!group.current) return
    const sc = scrollRef.current
    const t  = clock.elapsedTime
    const s  = smooth.current
    const b  = bones.current

    /* Flottement vertical subtil */
    s.posY = THREE.MathUtils.lerp(s.posY, pointer.y * -0.04, 0.04)
    s.posX = THREE.MathUtils.lerp(s.posX, pointer.x * 0.06, 0.04)
    group.current.position.x = s.posX
    group.current.position.y = yOffset + s.posY + Math.sin(t * 0.55) * 0.05
    group.current.position.z = 0

    /* Rotation Y : section courante via CHAR_WAYPOINTS */
    const targetRY = getCharRot(sc)
    s.rotY  = THREE.MathUtils.lerp(s.rotY,  targetRY + pointer.x * 0.10, 0.035)
    s.bodyZ = THREE.MathUtils.lerp(s.bodyZ, pointer.y * -0.03, 0.04)
    group.current.rotation.y = s.rotY
    group.current.rotation.z = s.bodyZ

    /* Tête & cou suivent la souris */
    if (b.head) {
      s.headY = THREE.MathUtils.lerp(s.headY, pointer.x *  0.40, 0.07)
      s.headX = THREE.MathUtils.lerp(s.headX, -pointer.y * 0.28, 0.07)
      b.head.rotation.y = s.headY
      b.head.rotation.x = s.headX
    }
    if (b.neck) {
      s.neckY = THREE.MathUtils.lerp(s.neckY, pointer.x *  0.18, 0.06)
      s.neckX = THREE.MathUtils.lerp(s.neckX, -pointer.y * 0.12, 0.06)
      b.neck.rotation.y = s.neckY
      b.neck.rotation.x = s.neckX
    }
    if (b.spine) {
      s.spineY = THREE.MathUtils.lerp(s.spineY, pointer.x * 0.08, 0.04)
      b.spine.rotation.y = s.spineY
    }
    if (b.spine1) {
      b.spine1.rotation.y = THREE.MathUtils.lerp(b.spine1.rotation.y ?? 0, pointer.x * 0.04, 0.03)
    }
  }, 1)

  return (
    <group ref={group}>
      <primitive object={scene} scale={scale} />
      {/* Éclairage buste — y ≈ 5.5–7 (zone tête/épaules) */}
      <pointLight color="#00c8ff" intensity={5}   distance={7}  decay={2} position={[ 0.6, 6.8, 1.8]} />
      <pointLight color="#7b2fff" intensity={2.2} distance={5}  decay={2} position={[-1.2, 5.5, 1.0]} />
      <pointLight color="#ffffff" intensity={1.0} distance={4}  decay={2} position={[ 0,   6.5, 2.2]} />
    </group>
  )
}

useGLTF.preload('/models/spartan_armour_mkv_-_halo_reach.glb')
