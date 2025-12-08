'use client';
import { CameraControls, Cylinder, Effects, Environment, Float, Html, OrbitControls, Plane, ScrollControls, Text, Text3D,  useHelper, useScroll, useTexture } from "@react-three/drei";
import {Ground2} from "./Ground2";
import * as THREE from 'three';
import { Bloom, BrightnessContrast, ColorAverage, ColorDepth, DotScreen, EffectComposer,  HueSaturation, Noise,  Outline,  Pixelation,  Ramp,  RampType,  ShockWave,  Vignette } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef, useState } from "react";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import { extend, useFrame, useThree } from "@react-three/fiber";

import { BlendFunction, Resizer, KernelSize,GlitchMode } from "postprocessing";


import gsap  from "gsap";
import HeartFac from "./HeartFac";

import FuturisticRing from "./FutureRing";

import { ShaderPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { Pencil } from "./Pencil";
import WaveShape2 from "./WaveShape2";

export const Experience2 = ({ triggerExplosion, active, onHeartClick }) => {
  const [trigger, setTrigger] = useState(false);
  const { scene, camera } = useThree();


  const dir = useRef();
  const spot = useRef();

  // mouse position
  const mouse = useRef({ x: 0, y: 0 });
  
  // target camera position
  const targetCamera = useRef(new THREE.Vector3(40, -2,   3.5));

  function trig() {
    setTrigger((prev) => !prev);
    console.log(trigger);
  }

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.set(camera.position, { x: 25, y: 30, z: -58 });
    tl.to(camera.position, {
      x: targetCamera.current.x,
      y: targetCamera.current.y,
      z: targetCamera.current.z,
      duration: 2.5,
      onUpdate: () => camera.lookAt(0, 5, 0),
      immediateRender: false,
    });
    tl.play();

    return () => tl.kill();
  }, [camera]);
//hide calculator
document.querySelector('.form').classList.remove('active');
document.querySelector('#scroll').style.color='black';
  // hide initial DOM elements
  const list = ['heading1', 'heading2', 'rates'];
  useEffect(() => {
    list.forEach(i => {
      const el = document.getElementById(i);
      if (el) el.style.visibility = 'hidden';
    });
  }, []);

  // listen to mouse movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // smooth camera movement using mouse
  useFrame(() => {
    if (!camera) return;
    // adjust the multiplier for sensitivity
    const xOffset = mouse.current.x * 0.9;
    const yOffset = -mouse.current.y * 0.5;

    camera.position.lerp(
      new THREE.Vector3(
        targetCamera.current.x - xOffset,
        targetCamera.current.y - yOffset,
        targetCamera.current.z
      ),
      0.05
    );
    camera.lookAt(0, 5, 0);
  });
const fluidRef = useRef();
console.log('fluidRef:', fluidRef.current);


  return (
    <>
      <directionalLight ref={dir} color={'yellow'} position={[7,1,-18]} intensity={0.2} />
      
      <WaveShape2 position={[-45,10,20]} thickness={0.3} color={'#D7B750'} rotation={[0,Math.PI*0.5,0]} scale={8} animate={false} triggerExplosion={triggerExplosion} trigger={trigger}/>
      <Float floatIntensity={0.5} rotationIntensity={0.25}>
        <HeartFac active={active} />
      </Float>
      <FuturisticRing position={[0,-8.68,0]} glowIntensity={0.1} color={'#D7B750'} haloSpread={0} rippleCount={0.02} rippleSpeed={active ? 0.1 : 0.5} />
      <spotLight ref={spot} color={'yellow'} position={[4,22,8]} intensity={50} angle={0.6} decay={1.2} distance={18} penumbra={0.7} />
      <spotLight ref={spot} color={'yellow'} position={[4,22,-5]} intensity={50} angle={0.4} decay={1.2} distance={18} penumbra={0.7} />
      <ambientLight intensity={3} />
      <EffectComposer multisampling={0}>  
         <Fluid  
          intensity={0.3} 
          radius={0.04} 
          fluidColor={'#ff0000'} 
          backgroundColor={'#37e6b1'}
          distortion={0} 
          showBackground={true} 
          blend={5} 
          pressure={0.2}
          densitionDissipation={0.1}
          swirl={0.2}
          ref={fluidRef}
          />  
        <Pencil />
        <Bloom intensity={0.1} luminanceThreshold={0.02} luminanceSmoothing={0.8} kernelSize={2}/>
        <Noise opacity={0.04} />
      </EffectComposer>
    </>
  );
};


export default Experience2;