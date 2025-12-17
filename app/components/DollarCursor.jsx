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

    document.body.style.cursor = 'none'

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let x = mouseX
    let y = mouseY

    let lastX = mouseX
    let lastY = mouseY

    let rotX = 0
    let rotY = 0
    let velX = 0
    let velY = 0

    const FOLLOW = 0.18
    const ROTATE_STRENGTH = 0.35
    const FRICTION = 0.88
    const RETURN_FORCE = 0.06

    const move = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const startSpin = () => coin.classList.add('active')
    const stopSpin = () => coin.classList.remove('active')

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', startSpin)
    window.addEventListener('mouseup', stopSpin)

    gsap.set(cursor, { xPercent: -50, yPercent: -50, force3D: true })

    gsap.ticker.add(() => {
      // Smooth follow
      x += (mouseX - x) * FOLLOW
      y += (mouseY - y) * FOLLOW
      gsap.set(cursor, { x, y, xPercent: -50, yPercent: -50 })

      // Mouse velocity → rotation
      velX = mouseX - lastX
      velY = mouseY - lastY
      lastX = mouseX
      lastY = mouseY

      rotY += velX * ROTATE_STRENGTH
      rotX -= velY * ROTATE_STRENGTH
      rotX *= FRICTION
      rotY *= FRICTION
      rotX += (0 - rotX) * RETURN_FORCE
      rotY += (0 - rotY) * RETURN_FORCE

      gsap.set(coin, { rotateX: rotX, rotateY: rotY })

      // Dynamic shine
      const rect = coin.getBoundingClientRect()
      const relX = ((mouseX - rect.left) / rect.width) * 100
      const relY = ((mouseY - rect.top) / rect.height) * 100
      coin.style.setProperty('--lightX', `${relX}%`)
      coin.style.setProperty('--lightY', `${relY}%`)
    })

    return () => {
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', startSpin)
      window.removeEventListener('mouseup', stopSpin)
      gsap.ticker.remove(() => {})
    }
  }, [])

  return (
    <div ref={cursorRef} className="coin-cursor">
      <div className="container">
        <div ref={coinRef} className="coin dollar">
          <div className="face front">
            <div className="symbol">$</div>
            <div className="circle" />
          </div>
          <div className="face back">
            <div className="symbol">$</div>
            <div className="circle" />
          </div>
          {[...Array(20)].map((_, i) => (
            <figure className="side" key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
