import React, { useEffect, useRef, useState, useMemo } from "react";
import { useGLTF, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const Mat = (props) => {
  const { nodes, materials } = useGLTF("/models/new-podium.glb");

  const group = useRef();
  const goldMesh = useRef();
  const matte = useRef();
  const tl = useRef();

  const [hovered, setHovered] = useState(false);

  const scroll = useScroll();
  const fadeRef = useRef(0); // 0 = visible, 1 = fully faded

  /* ---------------- Responsive ---------------- */

  const { size } = useThree();

  const responsiveScale = useMemo(() => {
    if (size.width < 480) return 5.5;
    if (size.width < 769) return 6.4;
    if (size.width < 1200) return 8.0;
    return 8.1;
  }, [size]);

  const responsivePosition = useMemo(() => {
    if (size.width < 480) return [0, -8.5, 0];
    if (size.width < 768) return [0, -8.5, 0];
    return [0, -8.6, 0];
  }, [size]);

  const responsiveRotation = useMemo(() => {
    if (size.width < 480) return [0, Math.PI * 0.15, 0];
    if (size.width < 768) return [0, Math.PI * 0.22, 0];
    return [0, Math.PI * 0.3, 0];
  }, [size]);

  /* ---------------- Initial Materials ---------------- */

  useEffect(() => {
    if (!group.current) return;

    group.current.children.forEach((mesh) => {
      if (!mesh.material) return;
      mesh.material.transparent = true;
      mesh.material.opacity = 1;
      mesh.visible = true;
    });

    // Matte base color
    matte.current.material.color = new THREE.Color(0x062f31);

    // Gold material
    const mat = goldMesh.current.material;
    mat.emissive = new THREE.Color("#D7B750");
    mat.emissiveIntensity = 2.5;
    mat.metalness = 1;
    mat.roughness = 0.2;

    // Glow pulse
    tl.current = gsap.timeline({ repeat: -1, yoyo: true });
    tl.current.to(mat, {
      emissiveIntensity: 4,
      duration: 1.2,
      ease: "sine.inOut",
    });

    return () => tl.current?.kill();
  }, []);

  /* ---------------- Scroll Fade ---------------- */

  useFrame(() => {
    if (!group.current) return;

    // Fade after 50% scroll
    const targetFade = THREE.MathUtils.clamp(
      (scroll.offset )*2.0 ,
      0,
      1
    );

    fadeRef.current = THREE.MathUtils.lerp(
      fadeRef.current,
      targetFade,
      0.1
    );

    const opacity = 1 - fadeRef.current;

    group.current.children.forEach((mesh) => {
      if (!mesh.material) return;
      mesh.material.opacity = opacity;
      mesh.visible = opacity > 0.01;
    });

    // Pause glow while fading
    if (fadeRef.current > 0.05) {
      tl.current?.pause();
    } else {
      tl.current?.play();
    }
  });



  /* ---------------- Render ---------------- */

  return (
    <group
      ref={group}
      scale={responsiveScale}
      position={responsivePosition}
      rotation={responsiveRotation}
      {...props}
    >
      <mesh
        ref={matte}
        geometry={nodes.Cylinder_1.geometry}
        material={materials["material "]}
      />

      <mesh
        ref={goldMesh}
        geometry={nodes.Cylinder_2.geometry}
        material={materials["golden emiision "]}
        // onPointerOver={() => setHovered(true)}
        // onPointerOut={() => setHovered(false)}
      />
    </group>
  );
};

useGLTF.preload("/models/new-podium.glb");

export default Mat;
