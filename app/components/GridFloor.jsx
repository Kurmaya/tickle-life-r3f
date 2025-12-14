import { useTexture, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const GridTop = (props) => {
  const grid = useTexture("./textures/floor tiles.png");
  const aM = useTexture("./textures/alphamap.jpg");

  const scroll = useScroll();
  const materialRef = useRef();
  const meshRef = useRef();

  const timeRef = useRef(0);
  const fadeRef = useRef(0); // 0 = visible, 1 = faded

  /* ---------------- Texture setup ---------------- */

  useEffect(() => {
    grid.wrapS = grid.wrapT = THREE.RepeatWrapping;
    grid.repeat.set(2, 2);
    grid.needsUpdate = true;
  }, [grid]);

  /* ---------------- Animation + Fade ---------------- */

  useFrame((_, delta) => {
    timeRef.current += delta;

    if (materialRef.current?.uniforms) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
    }

    // Fade starts after 50% scroll
    const targetFade = THREE.MathUtils.clamp(
      (scroll.offset - 0.2) * 5,
      0,
      1
    );

    fadeRef.current = THREE.MathUtils.lerp(
      fadeRef.current,
      targetFade,
      0.08
    );

    const opacity = 1 - fadeRef.current;

    if (materialRef.current) {
      materialRef.current.opacity = opacity;
      materialRef.current.emissiveIntensity =
        THREE.MathUtils.lerp(0.2, 0.0, fadeRef.current);
    }

    if (meshRef.current) {
      meshRef.current.visible = opacity > 0.01;
    }
  });

  /* ---------------- Shader Injection ---------------- */

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

        vec2 uvMove = vUv + vec2(uTime * 0.1, uTime * 0.1);
        float diag = mod(uvMove.x + uvMove.y, 1.0);

        float band = smoothstep(0.45, 0.5, diag) - smoothstep(0.5, 0.55, diag);
        float trail = smoothstep(0.0, 0.5, diag) * 0.5;

        float pulse = 0.5 + 0.5 * sin(uTime * 2.0);
        float glow = band * 1.5 + trail * 0.5;

        vec3 glowColor = vec3(0.2, 0.9, 1.0) * glow * pulse * 1.6;
        totalEmissiveRadiance += glowColor * 2.0;
      `
    );

    materialRef.current.uniforms = shader.uniforms;
    materialRef.current.userData.shader = shader;
  };

  /* ---------------- Render ---------------- */

  return (
    <mesh
      ref={meshRef}
      position={[0, -8.69, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
      {...props}
    >
      <planeGeometry args={[150, 150]} />

      <meshPhongMaterial
        ref={materialRef}
        map={grid}
        alphaMap={aM}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        emissive={"#d6d6d6"}
        emissiveIntensity={0.2}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
};

export default GridTop;
