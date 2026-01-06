'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CoinCursor() {
  const cursorRef = useRef(null)
  const coinRef = useRef(null)
  const tickerRef = useRef(null)

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

    /* ---------------- POINTER TARGETS ---------------- */

    const pointerFadeSelector = `
      a, button, input, textarea, select,
      [role="button"],
      p, span, li, h1, h2, h3, h4, h5, h6
    `

    /* ---------------- MOUSE MOVE ---------------- */

    const move = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    /* ---------------- SPIN ---------------- */

    const startSpin = () => coin.classList.add('active')
    const stopSpin = () => coin.classList.remove('active')

    /* ---------------- FADE ---------------- */

    const fadeOut = (e) => {
      const t = e.target

      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') {
        document.body.style.cursor = 'text'
      } else if (t.closest('a, button, [role="button"]')) {
        document.body.style.cursor = 'pointer'
      } else {
        document.body.style.cursor = 'default'
      }

      gsap.to(cursor, {
        autoAlpha: 0,
        scale: 0.85,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const fadeIn = () => {
      document.body.style.cursor = 'none'

      gsap.to(cursor, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const handlePointerOver = (e) => {
      if (e.target.closest(pointerFadeSelector)) fadeOut(e)
    }

    const handlePointerOut = (e) => {
      if (e.target.closest(pointerFadeSelector)) fadeIn()
    }

    /* ---------------- EVENTS ---------------- */

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', startSpin)
    window.addEventListener('mouseup', stopSpin)

    document.addEventListener('pointerover', handlePointerOver)
    document.addEventListener('pointerout', handlePointerOut)

    gsap.set(cursor, { xPercent: -50, yPercent: -50, force3D: true })

    /* ---------------- GSAP TICKER ---------------- */

    tickerRef.current = () => {
      x += (mouseX - x) * FOLLOW
      y += (mouseY - y) * FOLLOW
      gsap.set(cursor, { x, y })

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

      const rect = coin.getBoundingClientRect()
      const relX = ((mouseX - rect.left) / rect.width) * 100
      const relY = ((mouseY - rect.top) / rect.height) * 100
      coin.style.setProperty('--lightX', `${relX}%`)
      coin.style.setProperty('--lightY', `${relY}%`)
    }

    gsap.ticker.add(tickerRef.current)

    /* ---------------- CLEANUP ---------------- */

    return () => {
      document.body.style.cursor = 'auto'

      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', startSpin)
      window.removeEventListener('mouseup', stopSpin)

      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)

      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current)
      }
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
