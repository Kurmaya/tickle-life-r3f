import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAnimations, useEnvironment, useGLTF, useScroll, useTexture } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { Points, PointMaterial } from '@react-three/drei'
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


const HeartScroll = ({triggerExplosion,active,trigger,...props}) => {
  
 const group = useRef();
  const { camera } = useThree();
  const scroll = useScroll();
  const timeline = useRef();
  const [clicked, setClicked] = useState(false)
  const { nodes, materials, animations } = useGLTF("./models/heart-med.glb");
  const { actions } = useAnimations(animations, group);


const { size } = useThree()

const responsiveScale = useMemo(() => {
  if (size.width < 500) return 1.35     // Mobile portrait
  if (size.width < 900) return 1.4     // Tablets
  return 2.1                           // Desktop default
}, [size])

const responsivePosition = useMemo(() => {
  if (size.width < 500) return [0, -0.5, 0]   // Move slightly down for mobile
  if (size.width < 900) return [0, -0.4, 0]
  return [0, 3, 0]
}, [size])

const responsiveRotation = useMemo(() => {
  if (size.width < 500) return [Math.PI * 1.9, Math.PI * 0.2, 0] // reduce horizontal tilt
  return [Math.PI*1.9, Math.PI*0.4, 0]
}, [size])
 //  Setup timeline for explosion
  useEffect(() => {
    if (!group.current) return

    const tl = gsap.timeline({ paused: true,timeScale:3 })
    timeline.current = tl

    group.current.traverse((child) => {
      if (!child.isMesh) return
      const isHeart = child.name === "HEART_"

      child.userData.originalPosition = child.position.clone()
      child.userData.originalRotation = child.rotation.clone()

      child.material.transparent = true
      child.material.opacity = 1
      child.material.depthWrite = isHeart
if(isHeart){
  tl.to(child,{
    visible:false,
    duration:0.5,
  })
}
      if (!isHeart) {
        const targetPos = child.position.clone().multiplyScalar(25)
        const targetRot = new THREE.Euler(
          child.rotation.x + Math.random() * 2,
          child.rotation.y + Math.random() * 2,
          child.rotation.z + Math.random() * 2
        )

        tl.to(child.position, { x: targetPos.x, y: targetPos.y, z: targetPos.z, duration: 5, ease: "power1.out" }, "+0.5")
        tl.to(child.rotation, { x: targetRot.x, y: targetRot.y, z: targetRot.z, duration: 4.5, ease: "power1.out" }, "<")
        tl.to(child.material, { opacity: 0, duration: 1, ease: "power1" }, "<")
        tl.to('#heading1',{opacity:0,duration:1,ease:'none'},'<')
        tl.to('#heading2',{opacity:0,duration:1,ease:'none'},'<')
        tl.to('#rates',{opacity:0,duration:1,ease:'none'},'<')
        
      }
    })

    tl.eventCallback("onReverseComplete", () => {
      group.current.traverse((child) => {
        if (!child.isMesh) return
        const origPos = child.userData.originalPosition
        const origRot = child.userData.originalRotation
        if (origPos && origRot) {
          child.position.copy(origPos)
          child.rotation.copy(origRot)
        }
        if (child.material) child.material.opacity = 1
      })
    })

    return () => tl.kill()
  }, [])

  // 🌎 Environment map 
   const envMap2 = useTexture({ files: "./textures/film-opt.jpg" })
 useEffect(() => {
     if (!group.current) return
 
     group.current.children[0].children.forEach((mesh) => {
       if (!mesh.isMesh) return
       mesh.castShadow = mesh.receiveShadow = true
 
       mesh.material = new THREE.MeshStandardMaterial({
         roughness: 0.5,
         metalness: 0.7,
         envMap: envMap2,
         envMapIntensity: 0.9,
         color: 'rgb(22,174,143)',
         depthTest: true,
         transparent: true,
       })
 
      
     })
   }, [envMap2])
useEffect(() => {
  if (!actions) return;

  const action = actions["Polygonal_Model_1 raw_mesh.003Action"];
  if (!action) return;

  action.reset();
  action.timeScale = active ? 0.5 : 1;
  action.fadeIn(active ? 0.3 : 0.2).play();

  return () => action.fadeOut(0.5);
}, [actions, active]);

const handleClick = (target=0.9) => {

    triggerExplosion=true;
    setClicked(true);
    const el = scroll.el // 👈 THIS is the scroll container

  gsap.to(el, {
    scrollTop: target * (el.scrollHeight - el.clientHeight),
    duration: 2.5,
    ease: 'power2.inOut',
  })
  }
useEffect(() => {
  if (!timeline.current) return;

  if (triggerExplosion || trigger) {
    setClicked(true);
    timeline.current.play();
  } else {
    setClicked(false);
    timeline.current.reverse();
  }
}, [triggerExplosion, trigger]);

  // 🧭 Scroll-linked timeline progress
  useFrame(() => {
    if (!group.current || !scroll) return;

  const offset = scroll.offset;
  const scrollProgress = THREE.MathUtils.lerp(0, 1, offset);

  timeline.current?.progress(scrollProgress);
 if (timeline.current.progress() >= 0.8) {
    document.querySelector('.form')?.classList.add('active');
  } else {
    document.querySelector('.form')?.classList.remove('active');
  }


    // Visibility logic
    group.current.children[0]?.children.forEach((mesh) => {
      if(offset < 0.01){
          if(mesh.name === 'HEART_'){
            mesh.visible=true;
            
          }
          else{
            mesh.visible=false;
          }
        }
        
        
        else {
          if(mesh.name === 'HEART_'){
            mesh.visible = false
          }
          else{
            mesh.visible = true;
          }
          
          
        }
    });
  });
console.log(actions);
 
  return (
      <group ref={group} {...props} dispose={null} scale={responsiveScale}
  position={responsivePosition}
  rotation={responsiveRotation} onClick={(e) => {
      e.stopPropagation();
      handleClick(1.0);
    }}>
      <group name="Scene">
         <mesh
            name="HEART_"
            castShadow
            receiveShadow
            geometry={nodes.HEART_.geometry}
            material={materials['Material_0.001']}
            morphTargetDictionary={nodes.HEART_.morphTargetDictionary}
            morphTargetInfluences={nodes.HEART_.morphTargetInfluences}
            position={[-0.352, 0.887, 0.122]}
            // scale={1.05}
          />
          <mesh
            name="MAIN__cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell.geometry}
            material={materials['Material_0.001']}
            position={[-0.204, 1.061, 2.285]}
          />
          <mesh
            name="MAIN__cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell001.geometry}
            material={materials['Material_0.001']}
            position={[-0.17, 1.071, -2.15]}
          />
          <mesh
            name="MAIN__cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell002.geometry}
            material={materials['Material_0.001']}
            position={[-2.339, 2.444, -1.071]}
          />
          <mesh
            name="MAIN__cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell003.geometry}
            material={materials['Material_0.001']}
            position={[0.548, 3.145, 1.336]}
          />
          <mesh
            name="MAIN__cell004_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell004_cell.geometry}
            material={materials['Material_0.001']}
            position={[-1.618, 3.728, -0.208]}
          />
          <mesh
            name="MAIN__cell004_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell004_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-1.316, 4.174, -0.447]}
          />
          <mesh
            name="MAIN__cell004_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell004_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-1.374, 4.156, -0.268]}
          />
          <mesh
            name="MAIN__cell004_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell004_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-1.43, 3.929, -0.081]}
          />
          <mesh
            name="MAIN__cell004_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell004_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-1.456, 4.227, -0.332]}
          />
          <mesh
            name="MAIN__cell004_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell004_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-1.492, 4.147, -0.204]}
          />
          <mesh
            name="MAIN__cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell005.geometry}
            material={materials['Material_0.001']}
            position={[-1.457, -2.029, -0.303]}
          />
          <mesh
            name="MAIN__cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell006.geometry}
            material={materials['Material_0.001']}
            position={[1.405, 3.787, 0.747]}
          />
          <mesh
            name="MAIN__cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell007.geometry}
            material={materials['Material_0.001']}
            position={[-0.146, -2.303, -1.128]}
          />
          <mesh
            name="MAIN__cell008"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell008.geometry}
            material={materials['Material_0.001']}
            position={[0.841, 2.335, 1.61]}
          />
          <mesh
            name="MAIN__cell009"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell009.geometry}
            material={materials['Material_0.001']}
            position={[-1.341, -0.752, -1.892]}
          />
          <mesh
            name="MAIN__cell010_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell010_cell.geometry}
            material={materials['Material_0.001']}
            position={[2.013, 2.23, 0.938]}
          />
          <mesh
            name="MAIN__cell010_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell010_cell002.geometry}
            material={materials['Material_0.001']}
            position={[1.931, 2.344, 0.974]}
          />
          <mesh
            name="MAIN__cell010_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell010_cell003.geometry}
            material={materials['Material_0.001']}
            position={[1.978, 2.322, 0.872]}
          />
          <mesh
            name="MAIN__cell010_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell010_cell004.geometry}
            material={materials['Material_0.001']}
            position={[1.912, 2.465, 0.819]}
          />
          <mesh
            name="MAIN__cell010_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell010_cell006.geometry}
            material={materials['Material_0.001']}
            position={[1.98, 2.278, 0.959]}
          />
          <mesh
            name="MAIN__cell010_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell010_cell007.geometry}
            material={materials['Material_0.001']}
            position={[1.938, 2.374, 0.911]}
          />
          <mesh
            name="MAIN__cell011_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell011_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-1.08, 5.514, 1.429]}
          />
          <mesh
            name="MAIN__cell011_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell011_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-1.034, 5.479, 1.364]}
          />
          <mesh
            name="MAIN__cell011_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell011_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-0.998, 5.309, 1.477]}
          />
          <mesh
            name="MAIN__cell011_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell011_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-1.047, 5.386, 1.518]}
          />
          <mesh
            name="MAIN__cell012"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell012.geometry}
            material={materials['Material_0.001']}
            position={[-0.139, -2.862, -0.247]}
          />
          <mesh
            name="MAIN__cell013"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell013.geometry}
            material={materials['Material_0.001']}
            position={[-0.195, 2.882, -1.593]}
          />
          <mesh
            name="MAIN__cell014_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell014_cell.geometry}
            material={materials['Material_0.001']}
            position={[-1.128, 3.765, 2.11]}
          />
          <mesh
            name="MAIN__cell014_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell014_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-1.056, 4.37, 1.812]}
          />
          <mesh
            name="MAIN__cell014_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell014_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-1.131, 4.122, 1.778]}
          />
          <mesh
            name="MAIN__cell014_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell014_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-1.15, 3.993, 1.93]}
          />
          <mesh
            name="MAIN__cell014_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell014_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-1.197, 4.341, 1.837]}
          />
          <mesh
            name="MAIN__cell014_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell014_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-1.116, 4.417, 1.907]}
          />
          <mesh
            name="MAIN__cell015"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell015.geometry}
            material={materials['Material_0.001']}
            position={[-0.259, 4.494, 0.806]}
          />
          <mesh
            name="MAIN__cell016"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell016.geometry}
            material={materials['Material_0.001']}
            position={[-0.297, -2.81, 0.367]}
          />
          <mesh
            name="MAIN__cell017_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell017_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-1.497, 3.194, -0.487]}
          />
          <mesh
            name="MAIN__cell017_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell017_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-1.54, 3.062, -0.704]}
          />
          <mesh
            name="MAIN__cell017_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell017_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-1.452, 3.003, -0.948]}
          />
          <mesh
            name="MAIN__cell017_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell017_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-2.225, 3.494, -0.405]}
          />
          <mesh
            name="MAIN__cell017_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell017_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-1.449, 2.955, -0.635]}
          />
          <mesh
            name="MAIN__cell017_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell017_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-1.82, 3.283, -0.491]}
          />
          <mesh
            name="MAIN__cell018"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell018.geometry}
            material={materials['Material_0.001']}
            position={[2.559, -1.13, 0.257]}
          />
          <mesh
            name="MAIN__cell019"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell019.geometry}
            material={materials['Material_0.001']}
            position={[-0.29, 4.656, 0.274]}
          />
          <mesh
            name="MAIN__cell020"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell020.geometry}
            material={materials['Material_0.001']}
            position={[-1.201, -0.278, 2.055]}
          />
          <mesh
            name="MAIN__cell021"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell021.geometry}
            material={materials['Material_0.001']}
            position={[2.17, 1.98, -0.444]}
          />
          <mesh
            name="MAIN__cell022"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell022.geometry}
            material={materials['Material_0.001']}
            position={[-2.406, 0.676, 1.85]}
          />
          <mesh
            name="MAIN__cell023"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell023.geometry}
            material={materials['Material_0.001']}
            position={[-1.755, 3.443, 0.236]}
          />
          <mesh
            name="MAIN__cell024_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell024_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-0.827, 4.434, 0.266]}
          />
          <mesh
            name="MAIN__cell024_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell024_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-0.834, 4.433, 0.249]}
          />
          <mesh
            name="MAIN__cell024_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell024_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-0.859, 4.427, 0.237]}
          />
          <mesh
            name="MAIN__cell024_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell024_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-0.837, 4.433, 0.232]}
          />
          <mesh
            name="MAIN__cell025"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell025.geometry}
            material={materials['Material_0.001']}
            position={[-1.022, 4.709, 1.353]}
          />
          <mesh
            name="MAIN__cell026"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell026.geometry}
            material={materials['Material_0.001']}
            position={[-0.406, -1.504, 1.081]}
          />
          <mesh
            name="MAIN__cell027"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell027.geometry}
            material={materials['Material_0.001']}
            position={[2.184, -2.526, -0.509]}
          />
          <mesh
            name="MAIN__cell028_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell028_cell.geometry}
            material={materials['Material_0.001']}
            position={[-2.937, 1.823, -1.637]}
          />
          <mesh
            name="MAIN__cell028_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell028_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-3.173, 1.763, -1.443]}
          />
          <mesh
            name="MAIN__cell028_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell028_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-3.242, 1.982, -1.248]}
          />
          <mesh
            name="MAIN__cell028_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell028_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-3.216, 2.006, -1.254]}
          />
          <mesh
            name="MAIN__cell028_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell028_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-3.066, 1.629, -1.674]}
          />
          <mesh
            name="MAIN__cell028_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell028_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-2.978, 1.54, -1.673]}
          />
          <mesh
            name="MAIN__cell029_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell029_cell.geometry}
            material={materials['Material_0.001']}
            position={[-1.242, 3.424, 1.657]}
          />
          <mesh
            name="MAIN__cell029_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell029_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-1.149, 3.624, 2.036]}
          />
          <mesh
            name="MAIN__cell029_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell029_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-1.217, 3.654, 1.836]}
          />
          <mesh
            name="MAIN__cell029_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell029_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-1.161, 3.785, 1.827]}
          />
          <mesh
            name="MAIN__cell029_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell029_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-1.254, 3.623, 1.664]}
          />
          <mesh
            name="MAIN__cell029_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell029_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-1.201, 3.377, 1.783]}
          />
          <mesh
            name="MAIN__cell029_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell029_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-1.234, 3.35, 1.641]}
          />
          <mesh
            name="MAIN__cell030_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell030_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-1.464, 5.357, 1.497]}
          />
          <mesh
            name="MAIN__cell030_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell030_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-1.508, 5.246, 1.55]}
          />
          <mesh
            name="MAIN__cell030_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell030_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-1.341, 5.677, 1.276]}
          />
          <mesh
            name="MAIN__cell030_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell030_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-1.249, 5.375, 1.607]}
          />
          <mesh
            name="MAIN__cell030_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell030_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-1.36, 5.559, 1.415]}
          />
          <mesh
            name="MAIN__cell030_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell030_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-1.202, 5.601, 1.509]}
          />
          <mesh
            name="MAIN__cell030_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell030_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-1.4, 5.495, 1.555]}
          />
          <mesh
            name="MAIN__cell033"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell033.geometry}
            material={materials['Material_0.001']}
            position={[0.913, -2.977, 0.119]}
          />
          <mesh
            name="MAIN__cell035"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell035.geometry}
            material={materials['Material_0.001']}
            position={[1.566, 0.846, 1.401]}
          />
          <mesh
            name="MAIN__cell036"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell036.geometry}
            material={materials['Material_0.001']}
            position={[-0.419, 2.316, 1.918]}
          />
          <mesh
            name="MAIN__cell039"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell039.geometry}
            material={materials['Material_0.001']}
            position={[-3.37, 1.272, -0.615]}
          />
          <mesh
            name="MAIN__cell040"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell040.geometry}
            material={materials['Material_0.001']}
            position={[-2.019, -0.271, 1.377]}
          />
          <mesh
            name="MAIN__cell042_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell042_cell001.geometry}
            material={materials['Material_0.001']}
            position={[0.244, -2.634, -0.726]}
          />
          <mesh
            name="MAIN__cell042_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell042_cell002.geometry}
            material={materials['Material_0.001']}
            position={[0.52, -2.662, -0.584]}
          />
          <mesh
            name="MAIN__cell042_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell042_cell003.geometry}
            material={materials['Material_0.001']}
            position={[0.608, -2.977, -0.503]}
          />
          <mesh
            name="MAIN__cell042_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell042_cell004.geometry}
            material={materials['Material_0.001']}
            position={[0.564, -2.695, -0.806]}
          />
          <mesh
            name="MAIN__cell042_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell042_cell005.geometry}
            material={materials['Material_0.001']}
            position={[0.313, -2.786, -0.65]}
          />
          <mesh
            name="MAIN__cell042_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell042_cell007.geometry}
            material={materials['Material_0.001']}
            position={[0.334, -2.839, -0.455]}
          />
          <mesh
            name="MAIN__cell044"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell044.geometry}
            material={materials['Material_0.001']}
            position={[1.955, -2.093, 0.58]}
          />
          <mesh
            name="MAIN__cell045"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell045.geometry}
            material={materials['Material_0.001']}
            position={[0.72, -2.052, -1.036]}
          />
          <mesh
            name="MAIN__cell046"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell046.geometry}
            material={materials['Material_0.001']}
            position={[-3.085, -0.029, -0.507]}
          />
          <mesh
            name="MAIN__cell048"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell048.geometry}
            material={materials['Material_0.001']}
            position={[-2.978, 4.157, 2.074]}
          />
          <mesh
            name="MAIN__cell050"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell050.geometry}
            material={materials['Material_0.001']}
            position={[-0.075, -2.085, -0.281]}
          />
          <mesh
            name="MAIN__cell051_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell051_cell.geometry}
            material={materials['Material_0.001']}
            position={[-0.604, 5.372, 0.108]}
          />
          <mesh
            name="MAIN__cell051_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell051_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-0.544, 5.449, 0.197]}
          />
          <mesh
            name="MAIN__cell051_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell051_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-0.53, 5.468, 0.22]}
          />
          <mesh
            name="MAIN__cell051_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell051_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-0.57, 5.415, 0.157]}
          />
          <mesh
            name="MAIN__cell052"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell052.geometry}
            material={materials['Material_0.001']}
            position={[1.234, 3.108, 0.282]}
          />
          <mesh
            name="MAIN__cell053"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell053.geometry}
            material={materials['Material_0.001']}
            position={[1.324, -2.72, -0.684]}
          />
          <mesh
            name="MAIN__cell054"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell054.geometry}
            material={materials['Material_0.001']}
            position={[-0.944, 1.119, 0.119]}
          />
          <mesh
            name="MAIN__cell055"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell055.geometry}
            material={materials['Material_0.001']}
            position={[0.459, -0.78, 1.861]}
          />
          <mesh
            name="MAIN__cell056"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell056.geometry}
            material={materials['Material_0.001']}
            position={[2.898, 0.732, -0.579]}
          />
          <mesh
            name="MAIN__cell060_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell060_cell.geometry}
            material={materials['Material_0.001']}
            position={[2.05, 2.438, 0.477]}
          />
          <mesh
            name="MAIN__cell060_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell060_cell001.geometry}
            material={materials['Material_0.001']}
            position={[2.118, 2.357, 0.402]}
          />
          <mesh
            name="MAIN__cell060_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell060_cell002.geometry}
            material={materials['Material_0.001']}
            position={[2.15, 2.319, 0.373]}
          />
          <mesh
            name="MAIN__cell060_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell060_cell003.geometry}
            material={materials['Material_0.001']}
            position={[2.005, 2.448, 0.568]}
          />
          <mesh
            name="MAIN__cell062"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell062.geometry}
            material={materials['Material_0.001']}
            position={[-2.073, -0.729, 0.439]}
          />
          <mesh
            name="MAIN__cell064_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell064_cell.geometry}
            material={materials['Material_0.001']}
            position={[2.728, 1.367, -0.429]}
          />
          <mesh
            name="MAIN__cell064_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell064_cell001.geometry}
            material={materials['Material_0.001']}
            position={[2.77, 1.251, -0.502]}
          />
          <mesh
            name="MAIN__cell064_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell064_cell002.geometry}
            material={materials['Material_0.001']}
            position={[2.724, 1.419, -0.333]}
          />
          <mesh
            name="MAIN__cell064_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell064_cell003.geometry}
            material={materials['Material_0.001']}
            position={[2.775, 1.234, -0.134]}
          />
          <mesh
            name="MAIN__cell064_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell064_cell004.geometry}
            material={materials['Material_0.001']}
            position={[2.738, 1.303, -0.289]}
          />
          <mesh
            name="MAIN__cell066"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell066.geometry}
            material={materials['Material_0.001']}
            position={[-0.877, -1.909, -1.231]}
          />
          <mesh
            name="MAIN__cell067_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell067_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-1.416, -1.404, 1.439]}
          />
          <mesh
            name="MAIN__cell067_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell067_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-1.516, -1.492, 1.247]}
          />
          <mesh
            name="MAIN__cell067_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell067_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-1.349, -1.225, 1.542]}
          />
          <mesh
            name="MAIN__cell067_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell067_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-1.512, -1.217, 1.578]}
          />
          <mesh
            name="MAIN__cell067_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell067_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-1.388, -1.299, 1.41]}
          />
          <mesh
            name="MAIN__cell069"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell069.geometry}
            material={materials['Material_0.001']}
            position={[-2.052, 0.891, 0.197]}
          />
          <mesh
            name="MAIN__cell070_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell070_cell.geometry}
            material={materials['Material_0.001']}
            position={[0.544, 0.124, -2.178]}
          />
          <mesh
            name="MAIN__cell070_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell070_cell003.geometry}
            material={materials['Material_0.001']}
            position={[0.628, 0.082, -2.14]}
          />
          <mesh
            name="MAIN__cell070_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell070_cell006.geometry}
            material={materials['Material_0.001']}
            position={[0.579, 0.105, -2.16]}
          />
          <mesh
            name="MAIN__cell071_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell071_cell.geometry}
            material={materials['Material_0.001']}
            position={[-0.999, -1.217, 1.778]}
          />
          <mesh
            name="MAIN__cell071_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell071_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-1.122, -1.098, 1.839]}
          />
          <mesh
            name="MAIN__cell071_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell071_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-1.247, -1.181, 1.695]}
          />
          <mesh
            name="MAIN__cell071_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell071_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-0.725, -0.689, 2.155]}
          />
          <mesh
            name="MAIN__cell071_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell071_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-0.856, -0.88, 1.975]}
          />
          <mesh
            name="MAIN__cell071_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell071_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-1.112, -0.987, 1.828]}
          />
          <mesh
            name="MAIN__cell071_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell071_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-0.709, -0.921, 2.024]}
          />
          <mesh
            name="MAIN__cell072"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell072.geometry}
            material={materials['Material_0.001']}
            position={[0.097, -1.578, -1.553]}
          />
          <mesh
            name="MAIN__cell075"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell075.geometry}
            material={materials['Material_0.001']}
            position={[-2.36, 3.971, 2.321]}
          />
          <mesh
            name="MAIN__cell076"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell076.geometry}
            material={materials['Material_0.001']}
            position={[0.776, 0.594, 0.907]}
          />
          <mesh
            name="MAIN__cell079_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell079_cell.geometry}
            material={materials['Material_0.001']}
            position={[1.799, 1.862, 1.531]}
          />
          <mesh
            name="MAIN__cell079_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell079_cell001.geometry}
            material={materials['Material_0.001']}
            position={[1.825, 1.833, 1.51]}
          />
          <mesh
            name="MAIN__cell079_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell079_cell004.geometry}
            material={materials['Material_0.001']}
            position={[1.803, 1.86, 1.524]}
          />
          <mesh
            name="MAIN__cell079_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell079_cell005.geometry}
            material={materials['Material_0.001']}
            position={[1.82, 1.818, 1.52]}
          />
          <mesh
            name="MAIN__cell079_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell079_cell006.geometry}
            material={materials['Material_0.001']}
            position={[1.812, 1.84, 1.524]}
          />
          <mesh
            name="MAIN__cell082"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell082.geometry}
            material={materials['Material_0.001']}
            position={[-0.238, -1.201, -1.911]}
          />
          <mesh
            name="MAIN__cell084"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell084.geometry}
            material={materials['Material_0.001']}
            position={[2.061, 0.009, 0.859]}
          />
          <mesh
            name="MAIN__cell085"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell085.geometry}
            material={materials['Material_0.001']}
            position={[-2.934, 2.768, 0.185]}
          />
          <mesh
            name="MAIN__cell090"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell090.geometry}
            material={materials['Material_0.001']}
            position={[-2.326, -0.318, -0.921]}
          />
          <mesh
            name="MAIN__cell091"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell091.geometry}
            material={materials['Material_0.001']}
            position={[1.942, 0.991, 0.19]}
          />
          <mesh
            name="MAIN__cell093"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell093.geometry}
            material={materials['Material_0.001']}
            position={[2.087, 1.589, 0.777]}
          />
          <mesh
            name="MAIN__cell094"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell094.geometry}
            material={materials['Material_0.001']}
            position={[-1.184, 0.526, 1.912]}
          />
          <mesh
            name="MAIN__cell097"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell097.geometry}
            material={materials['Material_0.001']}
            position={[0.689, 1.588, -1.02]}
          />
          <mesh
            name="MAIN__cell101"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell101.geometry}
            material={materials['Material_0.001']}
            position={[1.453, 2.9, -0.864]}
          />
          <mesh
            name="MAIN__cell102"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell102.geometry}
            material={materials['Material_0.001']}
            position={[0.913, 2.008, -1.807]}
          />
          <mesh
            name="MAIN__cell103"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell103.geometry}
            material={materials['Material_0.001']}
            position={[0.539, -2.361, 1.218]}
          />
          <mesh
            name="MAIN__cell104"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell104.geometry}
            material={materials['Material_0.001']}
            position={[-2.07, 1.036, -1.946]}
          />
          <mesh
            name="MAIN__cell105"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell105.geometry}
            material={materials['Material_0.001']}
            position={[-3.123, 0.532, 0.882]}
          />
          <mesh
            name="MAIN__cell106"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell106.geometry}
            material={materials['Material_0.001']}
            position={[1.682, -1.686, -1.016]}
          />
          <mesh
            name="MAIN__cell108"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell108.geometry}
            material={materials['Material_0.001']}
            position={[1.571, -2.281, 0.257]}
          />
          <mesh
            name="MAIN__cell109"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell109.geometry}
            material={materials['Material_0.001']}
            position={[-2.264, 3.121, -0.823]}
          />
          <mesh
            name="MAIN__cell111"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell111.geometry}
            material={materials['Material_0.001']}
            position={[-0.535, 5.418, 0.801]}
          />
          <mesh
            name="MAIN__cell112_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell112_cell.geometry}
            material={materials['Material_0.001']}
            position={[-0.323, 4.039, 1.612]}
          />
          <mesh
            name="MAIN__cell112_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell112_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-0.173, 4.066, 1.646]}
          />
          <mesh
            name="MAIN__cell112_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell112_cell002.geometry}
            material={materials['Material_0.001']}
            position={[0.248, 4.006, 1.772]}
          />
          <mesh
            name="MAIN__cell112_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell112_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-0.336, 3.986, 1.733]}
          />
          <mesh
            name="MAIN__cell112_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell112_cell007.geometry}
            material={materials['Material_0.001']}
            position={[0.11, 4.036, 1.713]}
          />
          <mesh
            name="MAIN__cell113"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell113.geometry}
            material={materials['Material_0.001']}
            position={[2.069, -0.514, 1.362]}
          />
          <mesh
            name="MAIN__cell114"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell114.geometry}
            material={materials['Material_0.001']}
            position={[-0.291, 0.726, 0.885]}
          />
          <mesh
            name="MAIN__cell116_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell116_cell.geometry}
            material={materials['Material_0.001']}
            position={[-1.533, 3.98, -0.003]}
          />
          <mesh
            name="MAIN__cell116_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell116_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-1.586, 3.9, -0.029]}
          />
          <mesh
            name="MAIN__cell116_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell116_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-1.261, 4.04, 0.21]}
          />
          <mesh
            name="MAIN__cell116_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell116_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-1.389, 4.142, -0.045]}
          />
          <mesh
            name="MAIN__cell116_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell116_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-1.332, 4.261, -0.115]}
          />
          <mesh
            name="MAIN__cell116_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell116_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-1.381, 3.985, 0.082]}
          />
          <mesh
            name="MAIN__cell118_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell118_cell.geometry}
            material={materials['Material_0.001']}
            position={[-1.629, 2.539, 2.487]}
          />
          <mesh
            name="MAIN__cell118_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell118_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-1.86, 3.287, 2.567]}
          />
          <mesh
            name="MAIN__cell118_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell118_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-2.113, 3.284, 2.52]}
          />
          <mesh
            name="MAIN__cell118_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell118_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-1.548, 3.23, 2.632]}
          />
          <mesh
            name="MAIN__cell118_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell118_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-1.807, 2.835, 2.459]}
          />
          <mesh
            name="MAIN__cell118_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell118_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-2.082, 3.11, 2.384]}
          />
          <mesh
            name="MAIN__cell119"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell119.geometry}
            material={materials['Material_0.001']}
            position={[-1.883, -1.198, -0.946]}
          />
          <mesh
            name="MAIN__cell125"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell125.geometry}
            material={materials['Material_0.001']}
            position={[-1.096, 2.326, -1.176]}
          />
          <mesh
            name="MAIN__cell126"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell126.geometry}
            material={materials['Material_0.001']}
            position={[0.733, 1.162, 1.986]}
          />
          <mesh
            name="MAIN__cell127"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell127.geometry}
            material={materials['Material_0.001']}
            position={[1.241, -0.363, -0.255]}
          />
          <mesh
            name="MAIN__cell128_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell128_cell.geometry}
            material={materials['Material_0.001']}
            position={[-2.04, 0.41, 1.877]}
          />
          <mesh
            name="MAIN__cell128_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell128_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-2.05, 0.41, 1.853]}
          />
          <mesh
            name="MAIN__cell128_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell128_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-1.961, 0.35, 1.827]}
          />
          <mesh
            name="MAIN__cell128_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell128_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-2.003, 0.361, 1.842]}
          />
          <mesh
            name="MAIN__cell128_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell128_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-2.041, 0.391, 1.859]}
          />
          <mesh
            name="MAIN__cell129"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell129.geometry}
            material={materials['Material_0.001']}
            position={[2.78, 0.26, -0.349]}
          />
          <mesh
            name="MAIN__cell130"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell130.geometry}
            material={materials['Material_0.001']}
            position={[1.254, 0.743, -1.738]}
          />
          <mesh
            name="MAIN__cell132"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell132.geometry}
            material={materials['Material_0.001']}
            position={[-3.335, 1.805, 0.956]}
          />
          <mesh
            name="MAIN__cell136"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell136.geometry}
            material={materials['Material_0.001']}
            position={[-0.684, -1.05, -0.238]}
          />
          <mesh
            name="MAIN__cell137_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell137_cell.geometry}
            material={materials['Material_0.001']}
            position={[-3.08, 1.15, -1.77]}
          />
          <mesh
            name="MAIN__cell137_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell137_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-3.119, 1.256, -1.675]}
          />
          <mesh
            name="MAIN__cell137_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell137_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-3.009, 0.62, -1.622]}
          />
          <mesh
            name="MAIN__cell137_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell137_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-3.041, 0.866, -1.748]}
          />
          <mesh
            name="MAIN__cell137_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell137_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-3.031, 0.955, -1.668]}
          />
          <mesh
            name="MAIN__cell137_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell137_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-3.144, 1.016, -1.603]}
          />
          <mesh
            name="MAIN__cell137_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell137_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-3.225, 1.32, -1.575]}
          />
          <mesh
            name="MAIN__cell138"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell138.geometry}
            material={materials['Material_0.001']}
            position={[-0.401, 3.685, 1.55]}
          />
          <mesh
            name="MAIN__cell139"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell139.geometry}
            material={materials['Material_0.001']}
            position={[0.294, 1.693, 1.143]}
          />
          <mesh
            name="MAIN__cell140"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell140.geometry}
            material={materials['Material_0.001']}
            position={[2.18, 1.472, -1.065]}
          />
          <mesh
            name="MAIN__cell142"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell142.geometry}
            material={materials['Material_0.001']}
            position={[-0.679, 3.514, -0.504]}
          />
          <mesh
            name="MAIN__cell143"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell143.geometry}
            material={materials['Material_0.001']}
            position={[0.95, 1.831, 0.358]}
          />
          <mesh
            name="MAIN__cell144"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell144.geometry}
            material={materials['Material_0.001']}
            position={[-1.037, 5.197, 0.867]}
          />
          <mesh
            name="MAIN__cell145"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell145.geometry}
            material={materials['Material_0.001']}
            position={[-0.099, 0.645, -0.193]}
          />
          <mesh
            name="MAIN__cell146"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell146.geometry}
            material={materials['Material_0.001']}
            position={[-2.655, 3.472, 2.245]}
          />
          <mesh
            name="MAIN__cell148"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell148.geometry}
            material={materials['Material_0.001']}
            position={[-1.443, 2.966, 1.918]}
          />
          <mesh
            name="MAIN__cell149"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell149.geometry}
            material={materials['Material_0.001']}
            position={[-1.561, 4.353, 2.193]}
          />
          <mesh
            name="MAIN__cell151"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell151.geometry}
            material={materials['Material_0.001']}
            position={[1.49, -0.832, -1.552]}
          />
          <mesh
            name="MAIN__cell152"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell152.geometry}
            material={materials['Material_0.001']}
            position={[1.651, 0.938, 1.619]}
          />
          <mesh
            name="MAIN__cell154_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell154_cell.geometry}
            material={materials['Material_0.001']}
            position={[-0.314, 4.037, 1.173]}
          />
          <mesh
            name="MAIN__cell154_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell154_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-0.06, 4.172, 1.543]}
          />
          <mesh
            name="MAIN__cell154_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell154_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-0.132, 4.15, 1.467]}
          />
          <mesh
            name="MAIN__cell154_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell154_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-0.064, 4.135, 1.499]}
          />
          <mesh
            name="MAIN__cell154_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell154_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-0.266, 4.084, 1.36]}
          />
          <mesh
            name="MAIN__cell155"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell155.geometry}
            material={materials['Material_0.001']}
            position={[0.697, -0.867, -1.679]}
          />
          <mesh
            name="MAIN__cell158"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell158.geometry}
            material={materials['Material_0.001']}
            position={[0.84, 4.067, 0.897]}
          />
          <mesh
            name="MAIN__cell159"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell159.geometry}
            material={materials['Material_0.001']}
            position={[-0.019, 2.217, 0.193]}
          />
          <mesh
            name="MAIN__cell164"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell164.geometry}
            material={materials['Material_0.001']}
            position={[1.364, 1.057, -0.092]}
          />
          <mesh
            name="MAIN__cell165"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell165.geometry}
            material={materials['Material_0.001']}
            position={[1.624, 4.086, 1.019]}
          />
          <mesh
            name="MAIN__cell171"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell171.geometry}
            material={materials['Material_0.001']}
            position={[-0.565, 3.654, 0.635]}
          />
          <mesh
            name="MAIN__cell173"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell173.geometry}
            material={materials['Material_0.001']}
            position={[-1.345, 2.041, 0.612]}
          />
          <mesh
            name="MAIN__cell175"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell175.geometry}
            material={materials['Material_0.001']}
            position={[2.492, -1.08, -0.914]}
          />
          <mesh
            name="MAIN__cell176"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell176.geometry}
            material={materials['Material_0.001']}
            position={[-1.791, 1.79, 1.939]}
          />
          <mesh
            name="MAIN__cell177_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell177_cell.geometry}
            material={materials['Material_0.001']}
            position={[-2.938, -0.448, 0.437]}
          />
          <mesh
            name="MAIN__cell177_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell177_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-2.893, -0.463, 0.547]}
          />
          <mesh
            name="MAIN__cell177_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell177_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-2.95, -0.395, 0.171]}
          />
          <mesh
            name="MAIN__cell177_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell177_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-2.934, -0.465, 0.232]}
          />
          <mesh
            name="MAIN__cell177_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell177_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-3.009, -0.364, 0.243]}
          />
          <mesh
            name="MAIN__cell178"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell178.geometry}
            material={materials['Material_0.001']}
            position={[-0.282, -0.018, -1.293]}
          />
          <mesh
            name="MAIN__cell181_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell181_cell.geometry}
            material={materials['Material_0.001']}
            position={[2.925, -0.759, -0.487]}
          />
          <mesh
            name="MAIN__cell181_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell181_cell002.geometry}
            material={materials['Material_0.001']}
            position={[2.869, -0.996, -0.537]}
          />
          <mesh
            name="MAIN__cell181_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell181_cell003.geometry}
            material={materials['Material_0.001']}
            position={[2.984, -0.571, -0.523]}
          />
          <mesh
            name="MAIN__cell181_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell181_cell004.geometry}
            material={materials['Material_0.001']}
            position={[2.987, -0.537, -0.65]}
          />
          <mesh
            name="MAIN__cell181_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell181_cell006.geometry}
            material={materials['Material_0.001']}
            position={[2.873, -1.115, -0.472]}
          />
          <mesh
            name="MAIN__cell181_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell181_cell007.geometry}
            material={materials['Material_0.001']}
            position={[2.825, -1.35, -0.514]}
          />
          <mesh
            name="MAIN__cell183"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell183.geometry}
            material={materials['Material_0.001']}
            position={[-1.736, 3.992, 1.394]}
          />
          <mesh
            name="MAIN__cell184"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell184.geometry}
            material={materials['Material_0.001']}
            position={[0.293, 3.47, -1.078]}
          />
          <mesh
            name="MAIN__cell185"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell185.geometry}
            material={materials['Material_0.001']}
            position={[1.95, 0.47, -1.267]}
          />
          <mesh
            name="MAIN__cell186"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell186.geometry}
            material={materials['Material_0.001']}
            position={[-0.712, 0.025, -2.673]}
          />
          <mesh
            name="MAIN__cell187"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell187.geometry}
            material={materials['Material_0.001']}
            position={[-0.909, 3.236, 1.643]}
          />
          <mesh
            name="MAIN__cell188_cell"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell188_cell.geometry}
            material={materials['Material_0.001']}
            position={[-1.772, 5.064, 1.684]}
          />
          <mesh
            name="MAIN__cell188_cell001"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell188_cell001.geometry}
            material={materials['Material_0.001']}
            position={[-1.583, 5.156, 2.033]}
          />
          <mesh
            name="MAIN__cell188_cell002"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell188_cell002.geometry}
            material={materials['Material_0.001']}
            position={[-1.938, 5.076, 1.87]}
          />
          <mesh
            name="MAIN__cell188_cell003"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell188_cell003.geometry}
            material={materials['Material_0.001']}
            position={[-1.7, 5.11, 1.74]}
          />
          <mesh
            name="MAIN__cell188_cell004"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell188_cell004.geometry}
            material={materials['Material_0.001']}
            position={[-1.607, 5.133, 1.583]}
          />
          <mesh
            name="MAIN__cell188_cell005"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell188_cell005.geometry}
            material={materials['Material_0.001']}
            position={[-1.817, 5.127, 1.884]}
          />
          <mesh
            name="MAIN__cell188_cell006"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell188_cell006.geometry}
            material={materials['Material_0.001']}
            position={[-1.526, 5.163, 1.906]}
          />
          <mesh
            name="MAIN__cell188_cell007"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell188_cell007.geometry}
            material={materials['Material_0.001']}
            position={[-1.652, 5.184, 2.035]}
          />
          <mesh
            name="MAIN__cell191"
            castShadow
            receiveShadow
            geometry={nodes.MAIN__cell191.geometry}
            material={materials['Material_0.001']}
            position={[-2.664, 2.884, 1.588]}
          />
      </group>
    </group>
  )
}


useGLTF.preload('./models/heart-med.glb')

export default HeartScroll;