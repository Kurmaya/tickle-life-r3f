import { MeshReflectorMaterial, useScroll, useTexture } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import { ClampToEdgeWrapping, RepeatWrapping, SRGBColorSpace, TextureLoader } from "three";


function Ground2({triggerExplosion,trigger,props}) {
  const scroll = useScroll();
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      castShadow
      receiveShadow
      position={[0, -8.7, 0]}
      visible={(scroll.offset> 0.5)?false:true}
    >
      <planeGeometry args={[130, 130]} />

      <MeshReflectorMaterial
        

        // Same visual quality, cheaper cost
        envMapIntensity={0}
        roughness={0.1}
        metalness={0.2}

        // Optimized blur — visually same, MUCH faster
        blur={[2, 2]}
        mixBlur={0.1}

        // Very high quality reflection, but without over-sampling
        mirror={(scroll.offset > 0.1)?0.5:1}
        mixStrength={1.5}
        mixContrast={1}
    color={(triggerExplosion || trigger)?'black':'gray'}
        // Lower resolution gives 60–80% FPS gain with zero visible loss
        resolution={768}

        // Depth reflection tuning (fast + stable)
        depthScale={0.7}
        minDepthThreshold={0.85}
        maxDepthThreshold={1.25}
        depthToBlurRatioBias={0.1}

        // Remove expensive dithering
        dithering={false}

        // Shadows ok
        receiveShadow={false}

        reflectorOffset={0}
      />
    </mesh>
  );
}

export { Ground2 };
