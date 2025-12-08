'use client'

import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const teamMembers = [
  { name: "Ahmed Serghini", role: "Chief Executive Officer", imgSrc: "/images/ahmed.jpg" },
  { name: "Franco Scucchiero", role: "Chief Technology Officer", imgSrc: "/images/franco.jpg" },
  { name: "Ramiro Vignolo", role: "Head of Engineering", imgSrc: "/images/ramiro.jpg" },
  { name: "Ariel Chang", role: "VP of Engineering", imgSrc: "/images/ariel.jpg" },
  { name: "Pablo Altamura", role: "Senior Blockchain Engineer", imgSrc: "/images/pablo.jpg" },
  { name: "Carlos Alvarez", role: "Senior Blockchain Engineer", imgSrc: "/images/carlos.jpg" },
  { name: "Federico Cavazzoli", role: "Senior Blockchain Engineer", imgSrc: "/images/federico.jpg" },
  { name: "Rey Almicar", role: "Senior Backend Engineer", imgSrc: "/images/rey.jpg" },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartOpacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1])
  const chartScale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1])

  // Animated chart background component
  const AnimatedChart = () => (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 800 400"
      className="absolute inset-0 opacity-20"
      style={{ opacity: chartOpacity, scale: chartScale }}
    >
      <motion.path
        d="M0,350 Q100,300 200,250 T400,200 T600,150 T800,100"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-gray-400"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M0,380 Q150,330 300,280 T600,230 T800,180"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="text-gray-300"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
      />
      <circle cx="700" cy="120" r="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-200" opacity="0.5" />
    </motion.svg>
  )

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black relative overflow-x-hidden">

      {/* Navigation Sidebar */}
      <div className="fixed left-20 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col items-center space-y-8 pl-4">
          {["STORY", "OUR TEAM", "PARTNERS"].map((item) => (
            <div
              key={item}
              className="writing-mode-vertical text-md tracking-wider text-gray-600 rotate-180 cursor-pointer hover:text-gray-900"
              style={{ writingMode: 'vertical-rl' }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Section 1: Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center relative pt-20">
        <div
          className="border p-8 max-w-7xl w-full mx-4 flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <AnimatedChart />

          <motion.div
            className="relative z-10 w-full max-w-5xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <motion.h1
              className="mx-auto leading-tight mb-12 max-w-full"
              style={{ fontFamily: "'OC Mikola', sans-serif", fontSize: "clamp(2rem, 14vw, 9rem)" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>A state-of-the-art </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>liquidity hub built </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>to forge the new </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>financial frontier</span>
            </motion.h1>
          </motion.div>
        </div>

        <div
          className="border p-8 max-w-7xl w-full mx-4 mt-8 flex flex-col items-end"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <motion.div
            className="relative z-10 w-full max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <motion.p
              className="text-lg md:text-lg max-w-xl leading-relaxed text-gray-700 text-right w-full p-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 2.2 }}
            >
              Effortlessly unlock liquidity &<br/>
              boost your capital efficiency.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Decentralized Protocol */}
      <section className="flex items-center justify-center relative px-8">
        <div
          className="border p-8 max-w-7xl w-full mx-4 mt-8 flex flex-col items-end"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <AnimatedChart />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center w-full">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight">
                A decentralized, algorithmic protocol for lending, borrowing, and staking assets, featuring robust design and enhanced security.
              </h2>

              <motion.p
                className="text-lg md:text-xl leading-relaxed text-gray-600 max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Governed by HTM token holders and grounded on the principle of inclusivity, setting new industry standards.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 80, rotate: -10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="w-48 h-48 lg:w-64 lg:h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <motion.path
                    d="M100 30L60 170h20l20-70 20 70h20L100 30z"
                    fill="currentColor"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    viewport={{ once: true }}
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Product Suite */}
      <section className="relative bg-white overflow-x-hidden justify-center px-8 flex flex-col items-center">
        <div
          className="border p-8 max-w-7xl w-full mt-8 flex flex-col items-end"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <div className="max-w-[1440px] mx-auto px-3 py-20">
            <div className="flex flex-col lg:flex-row items-center lg:items-start mb-8">
              <div className="flex items-center justify-left mb-6 lg:mb-0">
                <div className="border border-gray-300 w-40 h-40 lg:w-64 lg:h-64 flex items-center justify-center bg-white relative">
                  <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400" />
                  <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400" />
                  <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400" />
                  <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400" />
                  <svg viewBox="0 0 120 120" className="w-40 h-40 text-black">
                    <ellipse cx="60" cy="60" rx="45" ry="55" stroke="currentColor" strokeWidth="3" fill="none" />
                    <ellipse cx="60" cy="60" rx="30" ry="45" stroke="currentColor" strokeWidth="2" fill="none" />
                    <line x1="60" y1="15" x2="60" y2="105" stroke="currentColor" strokeWidth="2" />
                    <line x1="35" y1="60" x2="85" y2="60" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold leading-tight text-black lg:ml-6">
                Hatom delivers a powerful suite of DeFi products, crafting a seamless ecosystem. Each of these products, backed by top-tier security audits, guarantees a secure and reliable user experience.
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-[1328px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 w-full mt-0">
          <div className="flex items-start border border-gray-200 bg-white p-26">
            <span className="block w-6 mt-1 text-xl text-gray-800 mr-4">›</span>
            <p className="text-base md:text-2xl text-black">
              Gain access to sustainable yield generated through various revenue streams, ensuring consistent long-term growth.
            </p>
          </div>
          <div className="flex items-start border border-gray-200 bg-white p-26">
            <p className="text-base md:text-2xl text-black">
              Discover seamless navigation with our user-friendly and intuitively designed products.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Our Team */}
      <section className="flex items-center justify-center relative px-8">
        <div
          className="border p-8 max-w-7xl w-full flex flex-col items-end"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <AnimatedChart />

          <motion.div
            className="text-center relative z-10 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <motion.h2
              className="text-9xl md:text-10xl lg:text-[13rem] font-bold leading-[0.8] tracking-tight mb-16"
              initial={{ scale: 0.8, y: 100 }}
              whileInView={{ scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-200px" }}
            >
              OUR TEAM
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl max-w-sm leading-relaxed text-gray-600 pt-15 text-left ml-220"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              A dedicated team, driven by the common goal of creating the infrastructure to disrupt existing financial barriers.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="relative py-24 px-8 bg-[#f9f9f9] overflow-hidden max-w-7xl mx-auto">
        <AnimatedChart />
        <div className="flex flex-col divide-y divide-gray-300 text-black">
          {teamMembers.map((member, i) => {
            const isActive = hoveredIndex === i

            return (
              <div
                key={i}
                className={`flex items-center cursor-pointer select-none min-h-[80px] transition-colors duration-300 ease-in-out ${
                  isActive ? "bg-black text-white" : "bg-transparent text-black"
                } ${i === 0 ? "border-t border-gray-300" : ""}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`w-16 flex justify-center items-center text-2xl ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                  aria-hidden="true"
                >
                  ›
                </div>

                <div className="flex-1 flex items-center space-x-4 px-4 py-6">
                  <span className="text-lg font-normal select-text">
                    {member.name}
                  </span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-20 h-20 rounded-md overflow-hidden"
                      >
                        <img
                          src={member.imgSrc}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                        <div className="animate-glitch-green" />
                        <div className="animate-glitch-green2" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 px-4 py-6 text-right text-base whitespace-nowrap font-normal">
                  {member.role}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 5: Partners */}
      <section className="py-24 px-4 md:px-8 bg-[#fafafa] relative overflow-hidden">
        <div
          className="border p-8 max-w-7xl mx-auto flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          {/* Decorative crack SVG behind text */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <svg
              width="100%"
              height="100"
              viewBox="0 0 1600 100"
              fill="none"
              className="opacity-40"
            >
              <path
                d="M0,60 Q400,100 800,40 T1600,80"
                stroke="#bebebe"
                strokeWidth="0.8"
                fill="none"
              />
            </svg>
          </div>

          <div className="w-full max-w-[1200px] flex flex-col md:flex-row md:items-start md:justify-between relative z-10 mb-12">
            <div className="flex-1 text-left">
              <h2
                className="text-[3rem] md:text-[5rem] leading-[0.95] font-normal font-sans break-words mb-8 md:mb-0"
                style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
              >
                Backers and<br />
                Security<br />
                Partners
              </h2>
            </div>
            <div className="flex-1 md:pl-12 pt-2 md:pt-10">
              <p className="text-lg md:text-2xl leading-relaxed text-black max-w-lg">
                We are joined by a vast network of partners ready to drive forward our vision and innovate the industry.
              </p>
            </div>
          </div>

          <div className="w-full max-w-[1200px] grid grid-cols-2 mt-10 md:grid-cols-4 lg:grid-cols-6 gap-8 px-4 md:px-8 items-center relative z-10">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center relative"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
                <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
                <div className="w-8 h-8 bg-gray-300 rounded" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
