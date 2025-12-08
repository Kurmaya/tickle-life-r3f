import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const GridTop = ({trigger,triggerExplosion,props}) => {
  const grid = useTexture("./textures/floor tiles.png");
  const aM = useTexture("./textures/alphamap.jpg");
  const materialRef = useRef();
  const timeRef = useRef(0);

  useEffect(() => {
    grid.wrapS = grid.wrapT = THREE.RepeatWrapping;
    grid.repeat.set(2, 2);
    grid.needsUpdate = true;
  }, [grid]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (materialRef.current?.uniforms) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
    }
  });

  // ✨ Custom shader with moving diagonal glow + fading trail
  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };

    shader.vertexShader = `
      varying vec2 vUv;
      ${shader.vertexShader}
    `.replace(
      `#include <uv_vertex>`,
      `
      #include <uv_vertex>
      vUv = uv;
      `
    );

    shader.fragmentShader = `
      uniform float uTime;
      varying vec2 vUv;
      ${shader.fragmentShader}
    `.replace(
      `#include <emissivemap_fragment>`,
      `
      #include <emissivemap_fragment>

      // Move diagonally ↘
      vec2 uvMove = vUv + vec2(uTime * 0.1, uTime * 0.1);

      // Compute diagonal progress
      float diag = mod(uvMove.x + uvMove.y, 1.0);

      // Band with smooth edges
      float band = smoothstep(0.45, 0.5, diag) - smoothstep(0.5, 0.55, diag);

      // Add a soft trailing fade behind the band
      float trail = smoothstep(0.0, 0.5, diag) * 0.5; 

      // Breathing pulse
      float pulse = 0.5 + 0.5 * sin(uTime * 2.0);

      // Combine main band + trail
      float glow = band * 1.5 + trail * 0.5;

      // Final glow color — teal with subtle variation
      vec3 glowColor = vec3(0.2, 0.9, 1.0) * glow * pulse * 1.6;

      // Add to emissive
      totalEmissiveRadiance += glowColor*2.0;
      `
    );

    materialRef.current.uniforms = shader.uniforms;
    materialRef.current.userData.shader = shader;
  };

  return (
    <mesh
      position={[0, -8.69, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
      visible={(triggerExplosion|| trigger)?false:true}
    >
      <planeGeometry args={[150, 150]} />
      <meshPhongMaterial
        ref={materialRef}
        map={grid}
        alphaMap={aM}
        transparent
        side={THREE.DoubleSide}
        emissive={"#d6d6d6"}
        emissiveIntensity={0.2}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
};

export default GridTop;
