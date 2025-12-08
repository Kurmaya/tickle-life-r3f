'use client'  ;
  import { CameraControls, Cylinder, Effects, Environment, Float, Html, OrbitControls, Plane, ScrollControls, Text, Text3D,  useHelper, useScroll, useTexture } from "@react-three/drei";
  import {Ground2} from "./Ground2";
  import * as THREE from 'three';
  import { Bloom, BrightnessContrast, ColorAverage, ColorDepth, DotScreen, EffectComposer,  HueSaturation, Noise,  Outline,  Pixelation,  Ramp,  RampType,  ShockWave,  Vignette } from '@react-three/postprocessing';
  import { useEffect, useMemo, useRef,useState } from "react";
  import { extend, useFrame, useThree } from "@react-three/fiber";
import DustParticles from "./Dust";
import { BlendFunction, Resizer, KernelSize,GlitchMode} from "postprocessing";
import {Clump2} from "./HeartFacGsap";
import CubeWithEquirectMap from "./CubeTex";
import GridTop from "./GridFloor";
import gsap  from "gsap";
import HeartFac from "./HeartFac";
import Mat from "./MatPodium";
import CurvedPlane from "./FadingCylinder";
import FuturisticRing from "./FutureRing";
import Bitcoin from "./Bitcoin";
import WaveShape from "./Wave";
import OrbitCoin from "./OrbitCoin";
import { ShaderPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import { Pencil } from "./Pencil";
import { Pencil2 } from "./Pencil2";
import { Fluid } from "@whatisjery/react-fluid-distortion";










  export const Experience = ({ triggerExplosion,active,onHeartClick }) => {
    document.querySelector('#scroll').style.color='white';
    const list = ['heading1', 'heading2', 'rates', 'scroll'];
  useEffect(() => {
    list.forEach(i => {
      const el = document.getElementById(i);
      if (el) el.style.visibility = 'visible';
    });
  }, []);
    const [trigger,setTrigger] = useState(false);
const { scene,camera } = useThree();

function trig(){
  
  setTrigger((prev)=> !prev)
  console.log(trigger)
}

  const dir = useRef();
  const spot = useRef();
  
// load animation
useEffect(() => {
  // Set initial state
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  tl.set(camera.position, { x: 25, y: 30, z: -58 });

  
  // Create a timeline 
  
  tl.to(camera.position, {
    x: 40,
    y: -3,
    z: 3.5,
    duration: 2.5,
      onUpdate: () => camera.lookAt(0, 0, 0),
      immediateRender: false,
    })
   
    tl.to("#heading1", { opacity: 1, duration: 1 })
    tl.to("#heading2", { opacity: 1, duration: 1 }, '<')
    tl.to('#rates',{opacity:1,duration:1},'<')
    tl.to('#scroll',{opacity:1,duration:1},'<')
   

    
    
    tl.play();
    
    // Cleanup on unmount
    return () => tl.kill();
  }, [camera]);

  

  
  
  return (
    <>
   
  
        {/* <OrbitControls  enableZoom={false}/> */}
   
            <Bitcoin position={[2,5,0]}  triggerExplosion={triggerExplosion} active={active} trigger={trigger}/>
            <OrbitCoin position={[2,-2,0]} triggerExplosion={triggerExplosion} active={active} trigger={trigger}/>
           
          
    <directionalLight ref={dir} color={'gray'} position={[7,20,-18]} intensity={30}  />
    <spotLight ref={spot}  color={'rgba(255, 132, 1, 1)'} position={[-7,-8,12]} intensity={250}  angle={0.5} decay={1.2} distance={18} penumbra={0.7}/>
  

        <GridTop triggerExplosion={triggerExplosion} trigger={trigger}/>
 
        <Ground2 triggerExplosion={triggerExplosion} trigger={trigger}/>        
      <DustParticles />
      <FuturisticRing position={[0,-8.68,0]}  glowIntensity={0.5} color={'#D7B750'} haloSpread={0} rippleCount={0.1} rippleSpeed={active ? 0.1 : 0.6} visible={trigger?false:true} triggerExplosion={triggerExplosion}/>
      <CurvedPlane 
      triggerExplosion={triggerExplosion}
      trigger={trigger}
      position={[-65,32,0]}
      rotation={[0,-Math.PI*0.5,0]}
      textureUrl="./textures/new-bg-big.jpg"
      fadeStrengthX={0.4}
      fadeStrengthY={1}
      brightness={0.5}
      
      />
      <CurvedPlane
       position={[65,32,0]}
      rotation={[0,Math.PI*0.5,0]}
      textureUrl="./textures/chrome-texture.jpg"
      fadeStrengthX={0.5}
      fadeStrengthY={0.9}
      />
        
 
<WaveShape position={[-45,5,10]} thickness={2} color={'#D7B750'} rotation={[0,Math.PI*0.5,0]} scale={5} animate={false} triggerExplosion={triggerExplosion} trigger={trigger}/>
       
        <Mat scale={8} position={[0,-8.3,0]} trigger={trigger} triggerExplosion={triggerExplosion}/>
        <Float floatIntensity={0.5} rotationIntensity={0.25}>

        <HeartFac position={[0,2.5,0]} scale={2.1} rotation={[0,Math.PI,0]} triggerExplosion={triggerExplosion} active={active} 
         onClick={() => {
    trig();              // internal
    onHeartClick();      // parent state update
  }} trigger={trigger} renderOrder={0}
        />
        <Clump2 position={[0,3.4,0]} scale={1.9} triggerExplosion={triggerExplosion} trigger={trigger}/>
       
        </Float>
     
      
       <EffectComposer multisampling={0}>  {/* multisampling 0 = faster */}

         <Fluid  
  intensity={0.3} 
  radius={0.04} 
  fluidColor={'#1b1b1b'} 
  distortion={1.3} 
  showBackground={true} 
  blend={1} 
  pressure={0.4}
  densitionDissipation={0.1}
  />  
 
  <Bloom
    intensity={0.5}               // slightly reduced for realism
    luminanceThreshold={0.02}
    luminanceSmoothing={0.8}
    kernelSize={2}
  />
  <Noise opacity={0.04} />         {/* GPU-friendly */}

  <Vignette eskil={false} offset={0.2} darkness={0.6} />
 
  {active && (
  
    <HueSaturation saturation={-1} hue={0} />

)}


</EffectComposer>



      </>
    );
  };
export default Experience;