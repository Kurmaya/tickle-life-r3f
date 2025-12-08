import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import React, { useMemo } from 'react'

const CubeWithEquirectMap = ({ src,src2, scale = [150, 85, 150] }) => {
  const texture = useTexture(src);
  const texture2 = useTexture(src2);
  const aMap = useTexture('./textures/alphamap.jpg');
  // Configure texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  // texture.flipX = true
  texture.flipY = true

  // Define materials for each cube face
  const materials = useMemo(() => {
    const texturedMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      toneMapped: true,
      color:'gray',
      // opacity:1,
      // transparent:true
    })

    const blackMat = new THREE.MeshBasicMaterial({
      color: 'black',
      side: THREE.BackSide,
      // map:texture2,
      toneMapped:true,
      // color:'rgba(44, 34, 34, 1)',
      transparent:false,
      // alphaMap:aMap
    //   metalness:1,
    //   roughness:0,
    //   envMapIntensity:1,
      
      
    })

    // Material order: [px, nx, py, ny, pz, nz]
    return [
      texturedMat, // +X (right)
      texturedMat, // -X (left)
      blackMat,    // +Y (top)
      blackMat,    // -Y (bottom)
      texturedMat, // +Z (front)
      texturedMat, // -Z (back)
    ]
  }, [texture])

  return (
    <mesh position={[0, 15, 0]}>
      <boxGeometry args={scale} />
      <meshStandardMaterial attach="material" metalness={1}/>
      <primitive attach="material" object={materials} />
    </mesh>
  )
}

export default CubeWithEquirectMap
