'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { useEnvironment, useGLTF, useScroll } from '@react-three/drei'
import * as THREE from 'three'

const Clump2 = (props) => {
  const group = useRef()
  const scroll = useScroll()
  const { nodes, materials } = useGLTF('./models/three-coin-opt.glb')
  const envMap = useEnvironment({ files: '/textures/gold2.jpg' })
  const { size } = useThree()

  /* ------------------ Responsive scale ------------------ */
  const responsiveScale = useMemo(() => {
    if (size.width < 500) return 1.2
    if (size.width < 900) return 1.4
    return 2
  }, [size])

  /* ------------------ Coin metadata (immutable) ------------------ */
  const coins = useMemo(() => [], [])

  /* ------------------ Init coins once ------------------ */
  useEffect(() => {
    if (!group.current) return

    group.current.traverse((child) => {
      if (!child.isMesh) return

      // Material setup
      child.material.envMap = envMap
      child.material.envMapIntensity = 3
      child.material.metalness = 1
      child.material.roughness = 0.2
      child.material.transparent = true
      child.material.depthWrite = true

      const initialPos = child.position.clone()
      const initialQuat = child.quaternion.clone()

      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      ).normalize()

      const targetPos = initialPos.clone().add(dir.multiplyScalar(20))

      // Random rotation axis & speed for continuous rotation
      const rotAxis = new THREE.Vector3(
        Math.random(),
        Math.random(),
        Math.random()
      ).normalize()
      const rotSpeed = THREE.MathUtils.randFloat(2, 6) // radians per scroll unit

      // Random target rotation for scroll-driven animation
      const angle = Math.PI * (2 + Math.random() * 3)
      const targetQuat = initialQuat.clone().multiply(
        new THREE.Quaternion().setFromAxisAngle(rotAxis, angle)
      )

      coins.push({
        mesh: child,
        initialPos,
        targetPos,
        initialQuat,
        targetQuat,
        rotAxis,
        rotSpeed,
      })
    })
  }, [envMap, coins])

  /* ------------------ Scroll-driven interpolation ------------------ */
  useFrame(() => {
    if (!scroll) return

    // Start animation only after scroll offset > 0.1
    const t = scroll.offset < 0.1 ? 0 : (scroll.offset - 0.1) / 0.8

    coins.forEach(({ mesh, initialPos, targetPos, initialQuat, targetQuat, rotAxis, rotSpeed }) => {
      // Position and quaternion interpolation
      mesh.position.lerpVectors(initialPos, targetPos, t)
      mesh.quaternion.slerpQuaternions(initialQuat, targetQuat, t)

      // Additional rotation along axis proportional to scroll offset
      const extraAngle = rotSpeed * t * Math.PI // extra rotation
      const extraQuat = new THREE.Quaternion().setFromAxisAngle(rotAxis, extraAngle)
      mesh.quaternion.multiply(extraQuat)
    })
  })

  /* ------------------ Render ------------------ */
  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      rotation={[0, Math.PI * 0.4, 0]}
      scale={responsiveScale}
    >
      {Object.values(nodes).map((node, i) =>
        node.isMesh ? (
          <mesh
            key={i}
            geometry={node.geometry}
            material={materials['Gold.001']}
            position={node.position}
            rotation={node.rotation}
            scale={node.scale}
            castShadow
            receiveShadow
          />
        ) : null
      )}
    </group>
  )
}

useGLTF.preload('./models/three-coin-opt.glb')

export default Clump2
