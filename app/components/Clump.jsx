import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAnimations, useEnvironment, useGLTF, useScroll, useTexture } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { Points, PointMaterial } from '@react-three/drei'
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
  const Clump2 =(props) =>{
  const group = useRef();
  const scroll = useScroll();
  const { nodes, materials, animations } = useGLTF("./models/three-coin-opt.glb");
  const { actions } = useAnimations(animations, group);
  const envMap = useEnvironment({ files: "/textures/gold.jpg" });
   const { size } = useThree()
const responsiveScale = useMemo(() => {
  if (size.width < 500) return 1.2     // Mobile portrait
  if (size.width < 900) return 1.4     // Tablets
  return 2                         // Desktop default
}, [size])
  // ✅ Store coin metadata
  const coins = useMemo(() => [], []);
  const timeline = useRef();

  useEffect(() => {
    if (!group.current) return;

    // Build coins array only once
    group.current.traverse((child) => {
      if (child.isMesh) {
        coins.push({
          mesh: child,
          initialPos: child.position.clone(),
          initialQuat: child.quaternion.clone(),
          dir: new THREE.Vector3(
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5
          ).normalize(),
          rotAxis: new THREE.Vector3(
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 18
          ).normalize(),
          rotSpeed: THREE.MathUtils.randFloat(5, 10),
        });

        // Material setup
        child.material.envMap = envMap;
        child.material.envMapIntensity = 3;
        child.material.metalness = 1;
        child.material.roughness = 0.2;
        child.material.transparent = true;
        child.material.depthWrite = true;
      }
    });

    // 🧨 Create GSAP timeline
    const tl = gsap.timeline({ paused: true });
    timeline.current = tl;

    coins.forEach(({ mesh, initialPos, initialQuat, dir, rotAxis, rotSpeed }) => {
      const targetPos = initialPos.clone().add(dir.clone().multiplyScalar(20));
      // const rotationAngle = Math.PI * rotSpeed;
      // const targetQuat = new THREE.Quaternion().setFromAxisAngle(rotAxis, rotationAngle);
  const targetRot = new THREE.Euler(
          mesh.rotation.x + Math.random() * 8,
          mesh.rotation.y + Math.random() * 5,
          mesh.rotation.z + Math.random() * 22
        );
      const combinedQuat = initialQuat.clone().multiply(targetRot);

      // Animate outward position
      tl.to(
        mesh.position,
        {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 5,
          ease: "power1.inOut",
        },
        0
      );

      // Animate rotation (quaternion slerp)
      tl.to(
        mesh.rotation,
        {
          x: targetRot.x,
          y: targetRot.y,
          z: targetRot.z,
          // w: combinedQuat.w,
          duration: 4,
          ease: "power1.inOut",
        },
        0
      );
    });

    // Restore exact originals after reverse
    // tl.eventCallback("onReverseComplete", () => {
    //   coins.forEach(({ mesh, initialPos, initialQuat }) => {
    //     mesh.position.copy(initialPos);
    //     mesh.quaternion.copy(initialQuat);
    //   });
    // });

    return () => tl.kill();
  }, [coins, envMap]);

  // 🧭 Scroll-based trigger (auto-play & reverse)
  useFrame(() => {
    if (!timeline.current || !scroll) return;
    const t = timeline.current;
    const progress = t.progress();
 const offset = scroll.offset;

    if (timeline.current) {
      timeline.current.progress(offset);
    }
  
  });

  return (
     <group {...props} dispose={null} ref={group} rotation={[0, Math.PI * 0.4, 0]} scale={responsiveScale}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0001.geometry}
        material={materials['Gold.001']}
        position={[0.855, -1.154, -0.448]}
        rotation={[-2.765, -0.188, -2.891]}
        scale={0.467}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0002.geometry}
        material={materials['Gold.001']}
        position={[0.311, -1.642, -0.359]}
        rotation={[-0.316, -0.239, -0.058]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0003.geometry}
        material={materials['Gold.001']}
        position={[1.896, -2.098, -0.399]}
        rotation={[-1.793, 0.878, -1.496]}
        scale={0.467}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0004.geometry}
        material={materials['Gold.001']}
        position={[-1.075, -0.992, -0.171]}
        rotation={[-3.019, -1.498, -2.907]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0005.geometry}
        material={materials['Gold.001']}
        position={[-1.196, -1.48, -0.441]}
        rotation={[3.005, 0.121, -0.033]}
        scale={0.467}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pa002.geometry}
        material={materials['Gold.001']}
        position={[1.765, -1.092, 0.179]}
        rotation={[-2.91, -0.114, -0.17]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0006.geometry}
        material={materials['Gold.001']}
        position={[-0.451, -1.043, -0.848]}
        rotation={[-2.893, 0.547, -0.231]}
        scale={0.467}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0007.geometry}
        material={materials['Gold.001']}
        position={[-0.739, -1.869, -0.528]}
        rotation={[0.041, -0.801, -0.354]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0008.geometry}
        material={materials['Gold.001']}
        position={[-0.409, -0.918, -1.008]}
        rotation={[-2.925, 0.421, -0.216]}
        scale={0.467}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0011.geometry}
        material={materials['Gold.001']}
        position={[0.526, -1.081, 0.679]}
        rotation={[2.909, -0.193, 0.702]}
        scale={0.467}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0015.geometry}
        material={materials['Gold.001']}
        position={[-0.471, -1.475, 1.534]}
        rotation={[-1.148, -0.112, -0.101]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0016.geometry}
        material={materials['Gold.001']}
        position={[0.261, -1.528, 0.69]}
        rotation={[2.877, -0.326, 0.239]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pa003.geometry}
        material={materials['Gold.001']}
        position={[2.108, -1.374, 0.685]}
        rotation={[-0.957, 1.051, 0.604]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0019.geometry}
        material={materials['Gold.001']}
        position={[-0.606, -1.059, 1.136]}
        rotation={[-1.358, -0.792, 2.008]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0024.geometry}
        material={materials['Gold.001']}
        position={[0.126, -1.392, 0.474]}
        rotation={[3.101, -0.558, 0.513]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0029.geometry}
        material={materials['Gold.001']}
        position={[-1.164, -1.232, 0.902]}
        rotation={[-3.1, -0.353, -0.125]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Coin_Coin_0030.geometry}
        material={materials['Gold.001']}
        position={[0.813, -2.466, 0.27]}
        rotation={[2.933, -0.468, 0.144]}
        scale={0.414}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder015.geometry}
        material={materials['Gold.001']}
        position={[-1.166, -1.411, 0.883]}
        scale={[0.388, 0.039, 0.388]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder016.geometry}
        material={materials['Gold.001']}
        position={[1.105, -1.582, 0.883]}
        scale={[0.388, 0.039, 0.388]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder017.geometry}
        material={materials['Gold.001']}
        position={[-0.02, -2.275, 0.883]}
        rotation={[0, 0, -0.493]}
        scale={[0.388, 0.039, 0.388]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder018.geometry}
        material={materials['Gold.001']}
        position={[1.1, -0.868, 0.883]}
        rotation={[-0.046, 0.1, -0.154]}
        scale={[0.388, 0.039, 0.388]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder019.geometry}
        material={materials['Gold.001']}
        position={[-0.426, -0.628, 0.883]}
        rotation={[-0.046, 0.1, -0.154]}
        scale={[0.388, 0.039, 0.388]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder020.geometry}
        material={materials['Gold.001']}
        position={[-1.555, -0.949, 0.883]}
        rotation={[-0.046, 0.1, -0.154]}
        scale={[0.388, 0.039, 0.388]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder021.geometry}
        material={materials['Gold.001']}
        position={[-1.363, -0.731, 0.883]}
        rotation={[-0.046, 0.1, -0.154]}
        scale={[0.388, 0.039, 0.388]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder022.geometry}
        material={materials['Gold.001']}
        position={[-1.343, -0.567, 0.876]}
        rotation={[-0.025, -0.097, -0.02]}
        scale={[0.365, 0.025, 0.365]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder023.geometry}
        material={materials['Gold.001']}
        position={[0.335, -0.621, 0.876]}
        rotation={[-0.025, -0.097, -0.02]}
        scale={[0.365, 0.025, 0.365]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder024.geometry}
        material={materials['Gold.001']}
        position={[1.107, -0.698, 0.876]}
        rotation={[-0.025, -0.097, -0.02]}
        scale={[0.365, 0.025, 0.365]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder025.geometry}
        material={materials['Gold.001']}
        position={[1.003, -1.045, 0.274]}
        rotation={[-0.025, -0.097, -0.02]}
        scale={[0.365, 0.025, 0.365]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder026.geometry}
        material={materials['Gold.001']}
        position={[0.32, -0.813, -0.404]}
        rotation={[-0.025, -0.097, -0.02]}
        scale={[0.365, 0.025, 0.365]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder027.geometry}
        material={materials['Gold.001']}
        position={[-0.398, -0.683, -0.208]}
        rotation={[-0.025, -0.097, -0.02]}
        scale={[0.365, 0.025, 0.365]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder028.geometry}
        material={materials['Gold.001']}
        position={[0.938, -2.03, -0.273]}
        rotation={[-0.025, -0.097, -0.02]}
        scale={[0.351, 0.025, 0.365]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text005.geometry}
        material={materials['Gold.001']}
        position={[0.817, -2.001, -0.778]}
        scale={0.429}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text006.geometry}
        material={materials['Gold.001']}
        position={[1.354, -1.801, -0.778]}
        scale={0.429}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text007.geometry}
        material={materials['Gold.001']}
        position={[0.177, -1.958, -0.778]}
        rotation={[0, 0, -0.577]}
        scale={0.429}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text008.geometry}
        material={materials['Gold.001']}
        position={[1.727, -1.611, -0.778]}
        rotation={[0, 0, -0.577]}
        scale={0.429}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text009.geometry}
        material={materials['Gold.001']}
        position={[1.727, -1.611, -0.216]}
        rotation={[0, 0, -0.577]}
        scale={0.429}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve003.geometry}
        material={materials['Gold.001']}
        position={[0.819, -1.98, 0.805]}
        rotation={[0.006, 0, 0]}
        scale={1.566}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve007.geometry}
        material={materials['Gold.001']}
        position={[0.316, -1.736, 0.693]}
        rotation={[0.006, 0, 0]}
        scale={1.566}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve008.geometry}
        material={materials['Gold.001']}
        position={[0.316, -1.966, 1.403]}
        rotation={[0.719, 0, 0]}
        scale={1.566}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve009.geometry}
        material={materials['Gold.001']}
        position={[0.316, -2.025, 1.333]}
        rotation={[0.719, 0, 0]}
        scale={1.566}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve010.geometry}
        material={materials['Gold.001']}
        position={[0.316, -2.19, 0.247]}
        rotation={[2.297, 0, 0]}
        scale={1.566}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve011.geometry}
        material={materials['Gold.001']}
        position={[0.316, -1.374, -0.964]}
        rotation={[3.111, 0, 0]}
        scale={1.566}
      />
    </group>
    
  );
  }

  useGLTF.preload('./models/three-coin-opt.glb')

  export default Clump2;