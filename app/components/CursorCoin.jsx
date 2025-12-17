import React, { useEffect, useRef, useMemo } from "react";
import { useEnvironment, useGLTF, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const CursorCoin = ({ active, ...props }) => {
  const { nodes, materials } = useGLTF("./models/bitcoin.glb");

  const coinRef = useRef();
  const env = useEnvironment({ files: "./textures/gold.jpg" });
  const scroll = useScroll();
  const { viewport, mouse } = useThree();

  /* ---------------- Responsive ---------------- */

  const { scale } = useMemo(() => {
    if (typeof window === "undefined") return { scale: 2 };
    if (window.innerWidth < 480) return { scale: 1.5 };
    if (window.innerWidth < 769) return { scale: 2 };
    return { scale: 2 };
  }, []);

  /* ---------------- Material ---------------- */

  useEffect(() => {
    if (!coinRef.current) return;
    const mat = coinRef.current.material;
    mat.envMap = env;
    mat.metalness = 1;
    mat.roughness = 0.25;
    mat.transparent = true;
    mat.opacity = 1;
  }, [env]);

  /* ---------------- Cursor Follow ---------------- */

  const targetPos = useRef(new THREE.Vector3());
  const lastMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!coinRef.current) return;

    /* Mouse → world position */
    targetPos.current.set(
      10,
      mouse.y * viewport.height * 0.5,
      -mouse.x * viewport.width * 0.5,
    );

    /* Smooth follow */
    coinRef.current.position.lerp(targetPos.current, 0.05);

    /* Mouse velocity */
    velocity.current.x = mouse.x - lastMouse.current.x;
    velocity.current.y = mouse.y - lastMouse.current.y;

    lastMouse.current.x = mouse.x;
    lastMouse.current.y = mouse.y;

    /* Inertia damping */
    velocity.current.x *= 0.9;
    velocity.current.y *= 0.9;

    /* Velocity-based spin */
    coinRef.current.rotation.y += velocity.current.x * 6;
    coinRef.current.rotation.x += velocity.current.y * 6;

    /* Return to neutral slowly */
    coinRef.current.rotation.x = THREE.MathUtils.lerp(
      coinRef.current.rotation.x,
      Math.PI * 1.5,
      0.05
    );
  });

  /* ---------------- Render ---------------- */

  return (
    <group {...props} scale={scale}>
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
export default CursorCoin;
