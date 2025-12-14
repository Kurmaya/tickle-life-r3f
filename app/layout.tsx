"use client";
import './globals.css'
import './style.css'
import { Bebas_Neue, IBM_Plex_Sans, Saira_Condensed, Oxanium } from 'next/font/google'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import  React, { Suspense, useState } from 'react'
import {Canvas} from '@react-three/fiber'
import Experience from './components/Experience.jsx';
import Experience2 from './components/Experience2.jsx'
import LoadingScreen from './components/LoadingScreen'
import Header from './components/Header';
import HeroText from './components/HeroText';
import TabletForm from './components/TabletForm';
import { Scroll } from 'lucide-react';
import { usePathname } from "next/navigation";
import { ScrollControls } from '@react-three/drei';
import DollarCursor from './components/DollarCursor';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  const [triggerExplosion, setTriggerExplosion] = useState(false);
const [active,setActive]= useState(false);
const handleExplosion = () => {
    // Toggle or trigger the explosion
    setTriggerExplosion((prev) => !prev); 
  };
const handleClick=()=>{
 setActive((prev)=> !prev);
}
  return (
    <html lang="en">
      
      <body className="flex flex-col min-h-screen font-inter bg-gray-100"  style={{ cursor: pathname === "/" ? "none" : "auto" }}>
        <LoadingScreen />
        <Navbar />
        <main className="flex-grow">
   <DollarCursor />
    <div className="w-full h-screen">
        <Canvas shadows camera={{ position: [40, -2, 3], fov: 50 }} dpr={[1,1.5]}>
      <Suspense fallback={null} >
          <color attach="background" args={["#111"]} />
          {/* Render based on page */}
              {(pathname === "/" ) ? (
          <ScrollControls pages={3} damping={0.2}>
                <Experience 
                  triggerExplosion={triggerExplosion}
                  active={active}
                  onHeartClick={handleExplosion}
                  />
                  </ScrollControls>
              ) : (
                <Experience2 active={active} />
              )}
      </Suspense>
        </Canvas>
      </div>
      {/* <Header active={active} onToggle={handleClick}/> */}
      {(pathname === "/" && <><HeroText active={active} triggerExplosion={handleExplosion}/> <TabletForm triggerExplosion={triggerExplosion} /></>)}

          {children}
          </main>
        {/* <Footer /> */}
      </body>
    </html>
  )
}