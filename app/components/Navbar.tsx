'use client'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import React from 'react';
const navItems = [
  { title: 'Simulator', href: '/' },
  { title: 'Home', href: '/home' },
  { title: 'Industry', href: '/industry' },
  { title: 'Services', href: '/services' },
  { title: 'Resources', href: '/resources' },
  { title: 'Contact Us', href: '/contact-us' },
  { title: 'About Us', href: '/about-us' },
]

export default function FullscreenMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)


  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
       {/* Top Navbar */}
       <nav className="fixed top-0 w-full z-50 flex justify-end p-6 bg-transparent">
                <img
        src="../images/logo.png"
        alt="Logo"
        style={{
          position: "absolute",
          top: "15%",
          left: "5%",
          width: "clamp(50px, 8vw, 70px)",
          height: "auto",
          zIndex: 11,
        }}
      />
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(true) }
          className="text-white text-3xl font-bold cursor-pointer transition-transform duration-300 hover:scale-120 outline-bg-black focus:outline-none"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ☰
        </button>
      </nav>

      {/* Overlay Fullscreen Menu */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-700
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
       
        
        <div className="absolute inset-0 bg-gray-950 bg-opacity-20 z-0" />

        <div className="relative z-10 flex flex-col h-full">

          <div className="w-full flex justify-end items-center pt-8 pr-12 gap-8 text-white text-base tracking-wide">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="text-xl sm:text-2xl font-semibold tracking-widest cursor-pointer hover:scale-110 transition-colors duration-300 outline-none hover:text-[#b2ff2b]"
              style={{letterSpacing: '0.2em'}}
            >
              CLOSE
            </button>
          </div>

          <div className="flex-1 flex flex-row">
            {/* Navigation */}
            <div className="flex flex-col justify-center pl-[8vw] pt-0" style={{height: '100%'}}>
              {navItems.map(({ title, href }) => (
                <div key={href} className="flex flex-row items-center mb-8">
                  {pathname === href &&
                    <span className="text-[#b2ff2b] text-5xl mr-4 -ml-6">&#8250;</span> 
                  }
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`
                      ${pathname === href
                        ? 'text-[#b2ff2b]'
                        : 'text-white'}
                      hover:text-[#b2ff2b] transition-colors
                      font-sans
                      font-bold
                      tracking-tight
                      leading-none
                      text-[5.5vw]
                      md:text-[5vw]
                      lg:text-[4vw]
                      xl:text-[4vw]
                      2xl:text-[3.8vw]
                      opacity-95
                      hover:opacity-100
                      duration-400
                      cursor-pointer
                      hover:scale-110
                      hover:decoration-smooth
                    `}
                    style={{
                      lineHeight: '1.0',
                      letterSpacing: '-0.04em',
                      textShadow: '2px 2px 24px rgba(0,0,0,0.12)'
                    }}
                  >
                    {title}
                  </Link>
                </div>
              ))}
            </div>

            {/* Side Content: Description Block */}
            <div className="flex-1 hidden md:flex items-center justify-center">
              <div className="ml-150 w-full max-w-sm text-left pr-10">
                <div className="text-white text-[1.3vw] font-sans opacity-95 leading-snug tracking-tight"
                  style={{textShadow: '0 1px 8px rgba(0,0,0,0.13)'}}>
                  The trusted PSP for regulated,<br/>
                  high-risk merchants<br/>
                  Not everyone is eligible<br/>
                  see if you fit.
                </div>
                <div className="pt-7">
                  <a
                    href="https://www.ticklecharge.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="uppercase text-[0.9vw] font-semibold text-white opacity-80 tracking-widest border-b border-white/40 hover:text-[#b2ff2b] cursor-pointer"
                    style={{ letterSpacing: '0.12em' }}
                  >
                    TICKLE LIFE &nbsp; &#8250;
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-12 text-white opacity-80 select-none">
            <a
              href="mailto:your.email@example.com"
              target="_blank"
              rel="noreferrer"
              className="grid place-items-center w-7 h-7 rounded-full border border-white/40 hover:border-[#b2ff2b] transition-colors duration-300 hover:bg-[#b2ff2b] hover:text-black"
            >
              <Mail className="w-4 h-4" />
              <span className="sr-only">Mail</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
