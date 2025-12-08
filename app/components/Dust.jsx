import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

function DustParticles() {
  const ref = useRef();
const dust = useTexture('./textures/dust-particle.jpg');
const aMap = useTexture('./textures/alphamap.jpg')
  // Generate random positions once
  const positions = useMemo(() => {
    const count = 3000;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      let x = (Math.random() - 0.5) * 20;
      

      // 🔸 If x is between -5 and 5, regenerate until it's outside that range
      while (x > -10 && x < 10) {
        x = (Math.random() - 0.5) * 50;
      }

      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;

      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }

    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <group ref={ref}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          
          transparent={true}
          color='rgba(202,224,35,1)'
          size={0.15}
          sizeAttenuation={true}
          depthWrite={true}
          opacity={0.2}
          map={dust}
          // alphaMap={aMap}
          
        />
      </Points>
    </group>
  );
}
export default DustParticles;