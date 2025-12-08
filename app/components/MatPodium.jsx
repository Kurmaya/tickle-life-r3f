import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";

const Mat = ({trigger,triggerExplosion,...props}) => {
  const { nodes, materials } = useGLTF("/models/new-podium.glb");
  const group = useRef();
  const goldMesh = useRef();
  const matte = useRef();
  const [hovered, setHovered] = useState(false);
  const tl = useRef();
// ✅ Responsive scaling, position, and rotation
const { size } = useThree();

const responsiveScale = React.useMemo(() => {
  if (size.width < 480) return 5.5;      // Mobile portrait
  if (size.width < 769) return 6.4;      // Small tablets
  if (size.width < 1200) return 8.0;     // Large tablets / small laptops
  return 8.1;                             // Desktop
}, [size]);

const responsivePosition = React.useMemo(() => {
  if (size.width < 480) return [0, -8.5, 0]; 
  if (size.width < 768) return [0, -8.5, 0];
  return [0, -8.6, 0];
}, [size]);

const responsiveRotation = React.useMemo(() => {
  if (size.width < 480) return [0, Math.PI * 0.15, 0]; 
  if (size.width < 768) return [0, Math.PI * 0.22, 0];
  return [0, Math.PI * 0.3, 0];
}, [size]);

  useEffect(() => {
    // if (!goldMesh.current) return;
    matte.current.material.color= new THREE.Color(0x062F31);
    const mat = goldMesh.current.material;
    mat.emissive = new THREE.Color(0xffd700); // gold emissive color
    mat.emissiveIntensity = 1.2;

    // 🌀 GSAP Timeline for pulsing glow
    tl.current = gsap.timeline({ repeat: -1, yoyo: true });
    tl.current.to(mat, {
      emissiveIntensity: 3.5,
      duration: 1.2,
      ease: "sine.inOut",
    });

    // Stop when hovered to make hover effect distinct
    return () => tl.current?.kill();
  }, []);
useEffect(() => {
  if (!group.current) return;

  const meshes = group.current.children;

  meshes.forEach((mesh) => {
    if (!mesh.material) return;

    const mat = mesh.material;
    mat.transparent = true;
  });

  if (trigger || triggerExplosion) {
    // ---- FADE OUT ----
    tl.current?.pause(); // pause the pulsing glow immediately

    meshes.forEach((mesh) => {
      const mat = mesh.material;
      mesh.visible = true; // ensure visible before fading

      gsap.to(mat, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          mesh.visible = false; // fully hide after fading
        }
      });
    });
  } else {
    // ---- FADE IN ----
    meshes.forEach((mesh) => {
      const mat = mesh.material;
      mesh.visible = true; // must be visible before fading in

      gsap.to(mat, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
      });
    });

    // Resume glow pulse AFTER fade-in starts
    gsap.delayedCall(0.15, () => {
      tl.current?.play();
    });
  }
}, [trigger,triggerExplosion]);

  useEffect(() => {
    if (!goldMesh.current) return;

    const mat = goldMesh.current.material;
    mat.emissive = new THREE.Color('#D7B750');
    mat.emissiveIntensity =4;
    mat.metalness = 1;
    mat.roughness =0.2;
    if (hovered) {
      tl.current.pause();
      gsap.to(mat, {
        emissiveIntensity: 6,
        duration: 0.4,
        ease: "power2.out",
      });

      // Subtle shine rotation on hover
      gsap.to(goldMesh.current.rotation, {
        y: "+=0.5",
        duration: 0.8,
        ease: "power2.out",
      });
    } else {
      // Resume pulse and restore rotation
      tl.current.play();
      gsap.to(mat, {
        emissiveIntensity: 2,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }
  }, [hovered]);

  return (
    <group {...props} ref={group} scale={responsiveScale}
  position={responsivePosition}
  rotation={responsiveRotation}>
      <mesh
      ref={matte}
        name="Cylinder_1"
        geometry={nodes.Cylinder_1.geometry}
        material={materials["material "]}
      />
      <mesh
        ref={goldMesh}
        name="Cylinder_2"
        geometry={nodes.Cylinder_2.geometry}
        material={materials["golden emiision "]}
       
      />
    </group>
  );
};

useGLTF.preload("/models/new-podium.glb");
export default Mat;
