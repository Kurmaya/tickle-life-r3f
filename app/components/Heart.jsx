'use client'
import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function Heart() {
  const heartRef = useRef(null)

  useEffect(() => {
    if (heartRef.current) {
      gsap.set(heartRef.current, { transformOrigin: "50% 50%" })

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 })
      tl.to(heartRef.current, { scale: 1.15, duration: 0.2, ease: "power1.inOut" })
        .to(heartRef.current, { scale: 1, duration: 0.2, ease: "power1.inOut" })
        .to(heartRef.current, { scale: 1.12, duration: 0.18, ease: "power1.inOut" })
        .to(heartRef.current, { scale: 1, duration: 0.25, ease: "power1.inOut" })
    }
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <img
        ref={heartRef}
        src="/heart2.svg"
        alt="Beating Heart"
        className="w-[65%] opacity-100 pointer-events-none select-none"
        style={{ transformOrigin: "50% 50%" }}
      />
    </div>
  )
}
