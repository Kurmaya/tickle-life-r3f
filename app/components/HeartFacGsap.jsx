import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAnimations, useEnvironment, useGLTF, useScroll, useTexture } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { Points, PointMaterial } from '@react-three/drei'
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);



  const Clump2 =({triggerExplosion,trigger,...props}) =>{
  const group = useRef();
  const { size } = useThree()

const responsiveScale = useMemo(() => {
  if (size.width < 500) return 1.4     // Mobile portrait
  if (size.width < 900) return 1.5     // Tablets
  return 2.1                           // Desktop default (your original)
}, [size])
  // const scroll = useScroll();
  const { nodes, materials, animations } = useGLTF("./models/three-coin.glb");
  const { actions } = useAnimations(animations, group);
  const envMap = useEnvironment({ files: "/textures/gold.jpg" });
const [clicked, setClicked] = useState(false);
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

    // Create GSAP timeline
    const tl = gsap.timeline({ paused: true });
    timeline.current = tl;

    coins.forEach(({ mesh, initialPos, initialQuat, dir, rotAxis, rotSpeed }) => {
      const targetPos = initialPos.clone().add(dir.clone().multiplyScalar(20));
      // const rotationAngle = Math.PI * rotSpeed;
      // const targetQuat = new THREE.Quaternion().setFromAxisAngle(rotAxis, rotationAngle);
  const targetRot = new THREE.Euler(
          mesh.rotation.x + Math.random() * Math.sin(-4),
          mesh.rotation.y + Math.random() * Math.sin(5),
          mesh.rotation.z + Math.random() * 12
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
          x: Math.sin(2)*(targetRot.x),
          y: (targetRot.y)*Math.cos(20),
          z: targetRot.z*Math.sin(20),
          // w: combinedQuat.w,
          duration: 4,
          ease: "power1.inOut",
        },
        0
      );
    });

    // Restore exact originals after reverse
    tl.eventCallback("onReverseComplete", () => {
      coins.forEach(({ mesh, initialPos, initialQuat }) => {
        mesh.position.copy(initialPos);
        mesh.quaternion.copy(initialQuat);
      });
    });

    return () => tl.kill();
  }, [coins, envMap]);
useEffect(() => {
  if (!timeline.current) return;
  timeline.current.timeScale(3);
  if (triggerExplosion || trigger) {
    // timeline.current.timeScale(3);
    timeline.current.play();
    setClicked(true);
  }
   else {
    timeline.current.reverse();
    setClicked(false);
  }
}, [triggerExplosion,trigger]);
 const handleClick = () => {
    if (!timeline.current) return
    timeline.timeScale=3;
    if (!clicked) timeline.current.play()
    else timeline.current.reverse()
    setClicked(!clicked)
 
  }
 
  return (
    <group {...props} ref={group} rotation={[0, Math.PI * 0.4, 0]} dispose={null} scale={responsiveScale} >
      {Object.entries(nodes).map(([key, node]) => {
        if (node.isMesh) {
          return (
            <mesh
              key={key}
              geometry={node.geometry}
              material={node.material}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            />
          );
        }
        return null;
      })}
    </group>
  );
  }
useGLTF.preload('./models/three-coin.glb')

export {Clump2}
