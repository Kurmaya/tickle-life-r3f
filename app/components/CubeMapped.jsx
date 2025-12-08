import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useCubeTexture } from '@react-three/drei'

const CubeMappedBox = ({
  path = '/textures/cubemap_images/', // folder containing your 6 cube faces
  files = [
    '_px.png', // +X (right)
    '_nx.png', // -X (left)
    '_py.png', // +Y (top)
    '_ny.png', // -Y (bottom)
    '_pz.png', // +Z (front)
    '_nz.png', // -Z (back)
  ],
}) => {
  const { scene } = useThree()

  // Load cube map texture
  const cubeTexture = useCubeTexture(files, { path })

  // Apply as environment map (optional, if you want reflections)
  useMemo(() => {
    scene.environment = cubeTexture
  }, [cubeTexture, scene])

  return (
    <mesh position={[0, 11, 0]}>
      <boxGeometry args={[100, 45, 100]} />
      <meshStandardMaterial
        envMap={cubeTexture}
        metalness={1}
        roughness={0}
        side={THREE.BackSide} // inside-facing cube
      />
    </mesh>
  )
}

export default CubeMappedBox
