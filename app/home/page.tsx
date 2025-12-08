'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PSPHomepage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showQualificationModal, setShowQualificationModal] = useState(false)
  const [showComplianceModal, setShowComplianceModal] = useState(false)
  const [calculatorResult, setCalculatorResult] = useState<{
    rate: number
    fee: string
    setupDays: string
  } | null>(null)
  const [formData, setFormData] = useState({
    geography: '',
    vertical: ''
  })

  const chartOpacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1])
  const chartScale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1])

  const testimonials = [
    {
      text: "TrustPay transformed our iGaming operations across Europe. Their compliance expertise and technical reliability are unmatched.",
      author: "— Marcus Chen, CEO at EuroGaming Ltd"
    },
    {
      text: "Finally found a PSP that understands Forex. 95% approval rates in our key markets and excellent fraud protection.",
      author: "— Sarah Ahmed, Director at ForexPro International"
    },
    {
      text: "As an agent, I've never seen merchant approval rates this high. TrustPay's transparency and support are exceptional.",
      author: "— David Rodriguez, Senior Payment Agent"
    }
  ]

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleCalculatorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.geography || !formData.vertical) return
    
    const approvalRates: Record<string, number> = {
      'eu-igaming': 85,
      'india-igaming': 92,
      'gcc-forex': 88,
      'uk-adult': 78,
      'apac-crypto': 82
    }
    
    const key = `${formData.geography}-${formData.vertical}`
    const rate = approvalRates[key] ?? Math.floor(Math.random() * 30) + 60
    const fee = (Math.random() * 1 + 2).toFixed(2)
    const setupDays = `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 3) + 3}`
    
    setCalculatorResult({ rate, fee, setupDays })
  }

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  const Modal: React.FC<{
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
  }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 backdrop-blur z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-6 text-2xl text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black relative overflow-x-hidden">

      {/* Navigation Sidebar */}
      <div className="fixed left-20 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col items-center space-y-8 pl-4">
          {["SERVICES", "CALCULATOR", "COMPLIANCE"].map((item) => (
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

      {/* Hero Section */}
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
              style={{ fontFamily: "'OC Mikola', sans-serif", fontSize: "clamp(2rem, 12vw, 7rem)" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>The trusted PSP for </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>regulated, high-risk </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>merchants</span>
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
              Not everyone is eligible — see if you fit.<br/>
              Get approved where others can&apos;t.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges & Stats Section */}
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
              <div className="flex flex-wrap gap-4 mb-6">
                {[
                  '🛡️ PCI DSS Level 1',
                  '🏦 27 Bank Partners',
                  '🌍 Multi-Geo Licensed',
                  '🏆 Industry Awards'
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className="px-6 py-3 rounded-full bg-gray-100 text-black border border-gray-300 text-sm font-medium"
                  >
                    {badge}
                  </div>
                ))}
              </div>

              <motion.div
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {[
                  { number: '27', label: 'Bank Partners' },
                  { number: '99.99%', label: 'Uptime' },
                  { number: '<48h', label: 'Approval Time' },
                  { number: '15+', label: 'Licensed Geos' }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl md:text-4xl font-bold">{stat.number}</div>
                    <div className="text-sm text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 80, rotate: -10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <button
                onClick={() => setShowQualificationModal(true)}
                className="bg-black text-white px-14 py-4 rounded-full text-lg font-semibold transition-transform transform hover:-translate-y-1 shadow-lg cursor-pointer"
              >
                Check if you qualify
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes Us Unique Section */}
      <section className="relative bg-white overflow-x-hidden justify-center px-8 flex flex-col items-center">
        <div
          className="border p-8 max-w-7xl w-full mt-8 flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <div className="max-w-[1440px] mx-auto px-3 py-20">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold leading-tight text-black text-center mb-12">
                What Makes Us Unique
              </h2>
              
              <div className="grid md:grid-cols-3 gap-10 mb-12">
                {[
                  {
                    icon: '🌍',
                    title: 'Geo Flexibility',
                    description: 'Process payments across 15+ regulated jurisdictions with local acquiring and compliance expertise.'
                  },
                  {
                    icon: '🧩',
                    title: 'Modular Product Stack',
                    description: 'Mix and match payment methods, risk tools, and reporting features to fit your exact business needs.'
                  },
                  {
                    icon: '🛡️',
                    title: 'Custom Fraud & Routing',
                    description: 'AI-powered fraud detection and intelligent routing optimize your approval rates and minimize chargebacks.'
                  }
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="p-8 bg-gray-50 border border-gray-300 text-center hover:shadow-lg hover:-translate-y-1 transition-transform cursor-pointer"
                  >
                    <div className="text-5xl mb-5">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1328px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 w-full mt-0">
          <div className="flex items-start border border-gray-200 bg-white p-8">
            <span className="block w-6 mt-1 text-xl text-gray-800 mr-4">›</span>
            <div>
              <p className="text-base md:text-2xl text-black mb-4">
                🎯 90%+ approval rates in India & GCC markets
              </p>
              <p className="text-base text-gray-600">
                Our localized approach delivers exceptional results where others struggle
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center border border-gray-200 bg-white p-8">
            <button
              onClick={scrollToCalculator}
              className="bg-black text-white px-10 py-4 rounded-full text-lg font-semibold transition-transform hover:-translate-y-1 cursor-pointer"
            >
              Try eligibility calculator
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="flex items-center justify-center relative px-8">
        <div
          className="border p-8 max-w-7xl w-full flex flex-col items-center"
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.8] tracking-tight mb-16"
              initial={{ scale: 0.8, y: 100 }}
              whileInView={{ scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-200px" }}
            >
              TRUSTED BY INDUSTRY LEADERS
            </motion.h2>

            <div className="bg-gray-50 p-10 rounded-2xl border border-gray-300 text-center mb-10 max-w-3xl mx-auto">
              <motion.p
                key={currentTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="italic text-gray-700 text-xl mb-5"
              >
                {testimonials[currentTestimonial].text}
              </motion.p>
              <motion.div
                key={currentTestimonial + '-author'}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-semibold text-black"
              >
                {testimonials[currentTestimonial].author}
              </motion.div>
            </div>

            <motion.button
              onClick={() => setShowComplianceModal(true)}
              className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-transform hover:-translate-y-1 cursor-pointer"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              ✅ Compliance Verified - View Certificates
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Merchant/Agent Split Section */}
      <section className="relative py-24 px-8 bg-[#f9f9f9] overflow-hidden max-w-7xl mx-auto">
        <AnimatedChart />
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Are you a merchant or agent?</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-8">
          {[
            {
              title: '💳 Process Payments',
              description: 'Get approved for high-risk merchant processing with transparent pricing and instant dashboard access.'
            },
            {
              title: '🤝 Agent? Refer & Earn',
              description: 'Join our agent network and earn competitive commissions with industry-leading merchant approval rates.'
            }
          ].map((card, i) => (
            <div
              key={i}
              className="p-10 bg-gradient-to-br from-black to-gray-800 text-white text-center cursor-pointer shadow-lg hover:-translate-y-1 transition-transform"
            >
              <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
              <p className="opacity-90 text-lg">{card.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-700 text-lg max-w-xl mx-auto">
          Get instant dashboard access with transparent commissions. 90%+ merchant approval rates for our agents.
        </p>
      </section>

      {/* Interactive Eligibility Calculator */}
      <section id="calculator" className="py-24 px-4 md:px-8 bg-[#fafafa] relative overflow-hidden">
        <div
          className="border p-8 max-w-7xl mx-auto flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
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

          <div className="w-full max-w-[1200px] flex flex-col items-center relative z-10">
            <h2
              className="text-[3rem] md:text-[5rem] leading-[0.95] font-normal font-sans text-center mb-8"
              style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
            >
              Eligibility Calculator
            </h2>
            <p className="text-lg md:text-2xl leading-relaxed text-black max-w-lg text-center mb-12">
              Pick your geo & vertical, see live approval odds and pricing
            </p>

            <form onSubmit={handleCalculatorSubmit} className="bg-white p-10 rounded-2xl border border-gray-300 max-w-2xl w-full space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-black">Select Geography :</label>
                <select
                  value={formData.geography}
                  onChange={(e) => setFormData({...formData, geography: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-black focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">Choose your region...</option>
                  <option value="eu">European Union</option>
                  <option value="uk">United Kingdom</option>
                  <option value="india">India</option>
                  <option value="gcc">GCC Countries</option>
                  <option value="latam">Latin America</option>
                  <option value="apac">Asia Pacific</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-black">Select Business Vertical :</label>
                <select
                  value={formData.vertical}
                  onChange={(e) => setFormData({...formData, vertical: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-black focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">Choose your industry...</option>
                  <option value="igaming">iGaming</option>
                  <option value="forex">Forex/CFD Trading</option>
                  <option value="adult">Adult Entertainment</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="nutra">Nutraceuticals</option>
                  <option value="travel">High-Risk Travel</option>
                  <option value="cbd">CBD/Cannabis</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-900 transition-colors cursor-pointer"
              >
                Calculate My Approval Odds
              </button>

              {calculatorResult && (
                <div className="mt-5 p-5 border-l-4 border-gray-800 rounded-lg bg-gray-50">
                  <h4 className="text-black font-bold mb-2">Your Eligibility Results:</h4>
                  <div className="space-y-1 text-black">
                    <div><strong>Approval Probability: {calculatorResult.rate}%</strong></div>
                    <div><strong>Estimated Processing Fee: {calculatorResult.fee}%</strong></div>
                    <div><strong>Setup Time: {calculatorResult.setupDays} business days</strong></div>
                  </div>
                  <button
                    onClick={() => setShowQualificationModal(true)}
                    className="mt-4 bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-full font-semibold cursor-pointer"
                  >
                    Start Full Application
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Qualification Modal */}
      <Modal isOpen={showQualificationModal} onClose={() => setShowQualificationModal(false)}>
        <h3 className="text-2xl font-bold mb-5">Quick Qualification Check</h3>
        <form className="space-y-5 text-black">
          <div>
            <label className="block mb-2 font-semibold">Business Type:</label>
            <select className="w-full p-3 border-2 border-gray-300 rounded-lg" required>
              <option value="">Select...</option>
              <option>iGaming/Online Casino</option>
              <option>Forex/CFD Trading</option>
              <option>Adult Entertainment</option>
              <option>Cryptocurrency Exchange</option>
              <option>Other High-Risk</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Monthly Volume (USD):</label>
            <select className="w-full p-3 border-2 border-gray-300 rounded-lg" required>
              <option value="">Select...</option>
              <option>$50K - $250K</option>
              <option>$250K - $1M</option>
              <option>$1M - $5M</option>
              <option>$5M+</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Primary Markets:</label>
            <select className="w-full p-3 border-2 border-gray-300 rounded-lg" required>
              <option value="">Select...</option>
              <option>Europe</option>
              <option>Asia Pacific</option>
              <option>India/GCC</option>
              <option>Latin America</option>
              <option>Multiple Regions</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-lg font-semibold cursor-pointer hover:bg-gray-900 transition-colors"
          >
            Check My Eligibility
          </button>
        </form>
      </Modal>

      {/* Compliance Modal */}
      <Modal isOpen={showComplianceModal} onClose={() => setShowComplianceModal(false)}>
        <h3 className="text-2xl font-bold mb-5">Compliance Certifications</h3>
        <div className="space-y-5 text-black text-center">
          <div>
            <h4 className="text-lg font-semibold">🛡️ PCI DSS Level 1 Certified</h4>
            <p className="text-gray-700">Highest level of payment card security compliance</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">🏛️ Multi-Jurisdictional Licenses</h4>
            <p className="text-gray-700">Licensed and regulated across 15+ jurisdictions</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">🔒 ISO 27001 Security Management</h4>
            <p className="text-gray-700">International standard for information security</p>
          </div>
          <button className="bg-gray-800 hover:bg-black text-white px-8 py-3 rounded-full font-semibold mt-5 cursor-pointer transition-colors">
            Download Certificate Pack
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default PSPHomepage
