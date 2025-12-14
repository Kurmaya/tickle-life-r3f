'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CoinCursor() {
  const cursorRef = useRef(null)
  const coinRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const coin = coinRef.current
    if (!cursor || !coin) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    let x = mouseX
    let y = mouseY

    let lastX = mouseX
    let lastY = mouseY

    let rotX = 0
    let rotY = 0

    const move = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', move)

    gsap.ticker.add(() => {
      // Smooth follow
      x += (mouseX - x) * 0.18
      y += (mouseY - y) * 0.18

      // Mouse velocity
      const dx = mouseX - lastX
      const dy = mouseY - lastY
      lastX = mouseX
      lastY = mouseY

      // Velocity → rotation
      rotY += dx * 0.35   // horizontal movement → Y spin
      rotX -= dy * 0.35   // vertical movement → X spin

      // Inertia damping
      rotX *= 0.92
      rotY *= 0.92

      // Position (centered exactly on pointer)
      gsap.set(cursor, {
        x,
        y,
        xPercent: -50,
        yPercent: -50
      })

      // Rotation
      gsap.set(coin, {
        rotateX: rotX,
        rotateY: rotY
      })
    })

    return () => {
      window.removeEventListener('mousemove', move)
      gsap.ticker.remove(() => {})
    }
  }, [])

  return (
    <div ref={cursorRef} className="coin-cursor">
      <div ref={coinRef} className="coin">
        <div className="face front">$</div>
        <div className="face back">$</div>
        <div className="edge" />
      </div>
    </div>
  )
}
