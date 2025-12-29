'use client'

import React, { useState, useCallback, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useProgress, useGLTF, useEnvironment } from '@react-three/drei'
import * as THREE from 'three'
import { Oxanium } from 'next/font/google'

/* ------------------- FONT ------------------- */
const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['600'],
})

/* ------------------- PROGRESS RING ------------------- */
function ProgressRing({ progress, size = 64, stroke = 3 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress / 100)

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(20,20,20,1)"
        strokeWidth={stroke}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#D7B790"
        strokeWidth={stroke}
        fill="transparent"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 0.25s ease',
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
    </svg>
  )
}

/* ------------------- COIN ------------------- */
function Coin({ data, modelPath }) {
  const ref = useRef()
  const { scene } = useGLTF(modelPath)
const env = useEnvironment({ files: "./textures/gold.jpg" });
  useFrame(({ clock }) => {
    if (!ref.current) return

    const t = (clock.getElapsedTime() + data.delay) % data.duration

    let y = THREE.MathUtils.lerp(
      window.innerHeight / 50 + 1,
      -window.innerHeight / 50 + 1,
      t / data.duration
    )

    if (y <= -window.innerHeight / 50 + 1) {
      y += Math.abs(Math.sin(t * 10)) * 0.4
    }

    ref.current.position.y = y
    ref.current.rotation.x += 0.02
    ref.current.rotation.z += 0.015
  })

  return (
    <group ref={ref} position={[data.x, 0, 0]}>
      <primitive object={scene.clone()} scale={1} />
    </group>
  )
}

/* ------------------- LOADING SCREEN ------------------- */
export default function LoadingScreen({ onFinish }) {
  const { progress } = useProgress()
  const word = 'HEARTBEAT OF YOUR BUSINESS'

  const [fadeOut, setFadeOut] = useState(false)
  const [finished, setFinished] = useState(false)

  const startFadeOut = useCallback(() => {
    if (fadeOut || !finished) return
    setFadeOut(true)
    setTimeout(() => onFinish?.(), 800)
  }, [fadeOut, finished, onFinish])

  const coins = useMemo(
    () =>
      Array.from({ length: 5 }).map(() => ({
        x: (Math.random() - 0.5) * 24,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 3,
      })),
    []
  )

  const visibleLetters = Math.floor((progress / 100) * word.length)
  if (progress >= 100 && !finished) setFinished(true)

  return (
    <div
      onClick={startFadeOut}
      className={`fixed inset-0 z-[9999] transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 🎥 VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster='./textures/vid-poster.jpg'
      >
        <source src="./textures/black bg.mp4" type="video/mp4" />
      </video>

      {/* 🌌 TRANSPARENT CANVAS */}
      <Canvas
      id={'loading-canvas'}
        camera={{ position: [0, 0, 10] }}
        gl={{ alpha: true }}
        // style={{ background: 'transparent' }}
      >
        <ambientLight intensity={2.5} />
        {/* <directionalLight position={[2, 2, 2]} intensity={10} lookAt={[0,0,0]}/> */}
        {/* <directionalLight position={[3, 0, 2]} intensity={10} lookAt={[0,0,0]}/> */}
        <spotLight color={'rgba(255, 132, 1, 1)'} position={[-7,-8,12]} intensity={250}  angle={0.5} decay={1.2} distance={18} penumbra={0.7}/>
        {coins.map((c, i) => (
          <Coin key={i} data={c} modelPath="./models/bitcoin.glb" />
        ))}
      </Canvas>
{/* ⏳ LOADING TEXT */}
{!finished && (
  <div
    className={`${oxanium.className} absolute bottom-12 w-full text-center z-10`}
    style={{
      color: '#D7B790',
      fontSize: '1.1rem',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      opacity: 0.85,
      animation: 'loadingPulse 1.5s ease-in-out infinite',
    }}
  >
    LOADING...
  </div>
)}

      {/* 🧠 CENTER TEXT */}
      {/* <div className="pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        {word.split('').map((char, i) => (
          <span
            key={i}
            className={oxanium.className}
            style={{
              opacity: i < visibleLetters ? 1 : 0,
              transition: 'opacity 0.3s',
              minWidth: char === ' ' ? '0.5em' : 'auto',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div> */}

      {/* 🔘 PROGRESS RING */}
      <div className="absolute bottom-6 right-6 z-10">
        <ProgressRing progress={progress} />
      </div>

      {/* 👆 CLICK TO CONTINUE */}
      {finished && (
        <div className={`${oxanium.className} absolute bottom-10 w-full text-center text-white text-lg sm:text-xl md:text-2xl font-semibold animate-pulse`}>
          CLICK TO CONTINUE
        </div>
      )}
    </div>
  )
}

/* ------------------- PRELOAD ------------------- */
useGLTF.preload('./models/bitcoin.glb')
