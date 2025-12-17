import React, { useEffect, useRef, useMemo } from "react";
import { useEnvironment, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const Bitcoin = ({ active, ...props }) => {
  const { nodes, materials } = useGLTF("./models/bitcoin.glb");

  const coinRef = useRef();
  const tl = useRef();

  const env = useEnvironment({ files: "./textures/gold.jpg" });
  const scroll = useScroll();

  const fadeRef = useRef(0); // 0 = visible, 1 = fully faded

  /* ---------------- Responsive ---------------- */

  const { radius, scale } = useMemo(() => {
    if (typeof window === "undefined") return { radius: 4.5, scale: 2 };

    if (window.innerWidth < 769) return { radius: 3.5, scale: 2 };
    if (window.innerWidth < 480) return { radius: 2.8, scale: 1.5 };

    return { radius: 4.5, scale: 2 };
  }, []);

  /* ---------------- Material Setup ---------------- */

  useEffect(() => {
    if (!coinRef.current) return;

    const mat = coinRef.current.material;
    mat.envMap = env;
    mat.transparent = true;
    mat.opacity = 1;
  }, [env]);

  /* ---------------- Orbit + Spin Timeline ---------------- */

  useEffect(() => {
    const coin = coinRef.current;
    if (!coin) return;

    if (tl.current) tl.current.kill();

    const state = { angle: 0 };

    tl.current = gsap.timeline({ repeat: -1 });

    tl.current.to(state, {
      angle: Math.PI * 2,
      duration: 8,
      ease: "none",
      onUpdate: () => {
        coin.position.x = -radius * -Math.sin(state.angle);
        coin.position.z = -radius * Math.cos(state.angle);
        coin.position.y = 0.8 * Math.sin(state.angle * 2);

        coin.rotation.y -= 0.03;
        coin.rotation.x -= 0.05;
        coin.rotation.z -= 0.05;
      },
    });

    return () => tl.current?.kill();
  }, [radius]);

  /* ---------------- Scroll Logic ---------------- */

  useFrame(() => {
    const coin = coinRef.current;
    if (!coin || !coin.material) return;

    /* ---- STOP ORBIT WHEN scroll > 0.2 ---- */
    if (scroll.offset > 0.2) {
      tl.current?.pause();
    } else if (!active) {
      tl.current?.resume();
    }

    /* ---- FADE AFTER scroll > 0.5 ---- */
    const targetFade = THREE.MathUtils.clamp(
      (scroll.offset - 0.2) * 5,
      0,
      1
    );

    fadeRef.current = THREE.MathUtils.lerp(
      fadeRef.current,
      targetFade,
      0.1
    );

    coin.material.opacity = 1 - fadeRef.current;
    coin.visible = coin.material.opacity > 0.01;
  });

  /* ---------------- Active (external pause) ---------------- */

  useEffect(() => {
    if (!tl.current) return;

    if (active) tl.current.pause();
    else if (scroll.offset <= 0.2) tl.current.resume();
  }, [active, scroll.offset]);

  /* ---------------- Render ---------------- */

  return (
    <group {...props} dispose={null} scale={scale}>
      <mesh
        ref={coinRef}
        geometry={nodes.Cylinder001.geometry}
        material={materials["Gold.004"]}
        rotation={[Math.PI * 1.5, 0, Math.PI]}
        scale={[0.388, 0.039, 0.388]}
      />
    </group>
  );
};

useGLTF.preload("./models/bitcoin.glb");
export default Bitcoin;
