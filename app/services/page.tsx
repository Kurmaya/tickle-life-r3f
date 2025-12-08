'use client'

import React, { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

interface Module {
  id: string
  icon: string
  title: string
  description: string
  selected: boolean
}

interface StackCalculation {
  setupFee: string
  processingRate: string
  integrationTime: string
  goLiveTime: string
}

interface EligibilityResult {
  eligible: boolean
  mdr: string
  setupTime: string
  compliance: string
}

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'cards',
      icon: '💳',
      title: 'Card Processing',
      description: 'Visa, Mastercard, local schemes with optimized routing and fraud protection',
      selected: false
    },
    {
      id: 'apms',
      icon: '🏦',
      title: 'Alternative Payment Methods',
      description: 'E-wallets, bank transfers, buy-now-pay-later, and regional APMs',
      selected: false
    },
    {
      id: 'crypto',
      icon: '₿',
      title: 'Crypto Ramp',
      description: 'Accept Bitcoin, Ethereum, USDT and 50+ cryptocurrencies with instant settlement',
      selected: false
    },
    {
      id: 'routing',
      icon: '🌍',
      title: 'Geo-specific Routing',
      description: 'Intelligent routing based on geography, BIN, and issuer preferences',
      selected: false
    },
    {
      id: 'fraud',
      icon: '🛡️',
      title: 'Custom Fraud Filter',
      description: 'AI-powered risk scoring with customizable rules and real-time decisions',
      selected: false
    }
  ])

  const [showStackPreview, setShowStackPreview] = useState(false)
  const [showOtherVerticals, setShowOtherVerticals] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null)

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

  const toggleModule = (moduleId: string) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { ...module, selected: !module.selected }
          : module
      )
    )
  }

  const getSelectedModules = () => {
    return modules.filter(module => module.selected)
  }

  const calculateStack = (): StackCalculation => {
    const selectedCount = getSelectedModules().length
    const baseFee = 5000
    const moduleMultiplier = 2000
    
    return {
      setupFee: `$${(baseFee + (selectedCount * moduleMultiplier)).toLocaleString()}`,
      processingRate: selectedCount > 3 ? '2.4% + $0.30' : '2.8% + $0.30',
      integrationTime: selectedCount > 3 ? '3-4 weeks' : '2-3 weeks',
      goLiveTime: selectedCount > 3 ? '6-8 weeks' : '4-6 weeks'
    }
  }

  const handleShowStack = () => {
    if (getSelectedModules().length > 0) {
      setShowStackPreview(prev => !prev)
    }
  }

  const handleEligibilitySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const result = {
      eligible: true,
      mdr: '2.6% + $0.25',
      setupTime: '3-4 weeks',
      compliance: 'Pre-approved for selected vertical'
    }
    
    setEligibilityResult(result)
  }

  const scrollToEligibility = () => {
    document.getElementById('eligibilityWidget')?.scrollIntoView({ 
      behavior: 'smooth'
    })
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black relative overflow-x-hidden">

      {/* Navigation Sidebar */}
      <div className="fixed left-20 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col items-center space-y-8 pl-4">
          {["SERVICES", "MODULES", "CALCULATOR"].map((item) => (
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
              style={{ fontFamily: "'OC Mikola', sans-serif", fontSize: "clamp(2rem, 10vw, 6rem)" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>Build your payment stack </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>for high-risk, high-volume, </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>multi-geo business</span>
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
              Combine cards, APMs, crypto, custom routing—<br/>
              all tuned for regulated verticals.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Modular Offering Selector */}
      <section className="flex items-center justify-center relative px-8">
        <div
          className="border p-8 max-w-7xl w-full mx-4 mt-8 flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <AnimatedChart />

          <motion.div
            className="text-center relative z-10 max-w-6xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.8] tracking-tight mb-8"
              initial={{ scale: 0.8, y: 100 }}
              whileInView={{ scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-200px" }}
            >
              SELECT MODULES TO PREVIEW
            </motion.h2>
            <p className="text-xl text-gray-600">
              Choose the payment components you need
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full max-w-6xl relative z-10">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative bg-gray-50 border-2 p-8 text-center cursor-pointer
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                  ${module.selected 
                    ? 'border-black bg-white shadow-lg' 
                    : 'border-gray-300 hover:border-black'
                  }
                `}
                onClick={() => toggleModule(module.id)}
              >
                <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
                <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
                
                <div className={`
                  absolute top-4 right-4 w-5 h-5 border-2
                  transition-all duration-300
                  ${module.selected 
                    ? 'bg-black border-black' 
                    : 'bg-white border-gray-300'
                  }
                `}>
                  {module.selected && (
                    <div className="text-white text-xs flex items-center justify-center h-full">
                      ✓
                    </div>
                  )}
                </div>
                
                <div className="text-4xl mb-4">{module.icon}</div>
                <h3 className="text-xl font-semibold mb-3">
                  {module.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {module.description}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center relative z-10">
            <button
              className={`
                px-12 py-4 text-xl font-semibold transition-all duration-300
                ${getSelectedModules().length > 0
                  ? 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }
              `}
              onClick={handleShowStack}
              disabled={getSelectedModules().length === 0}
            >
              Show My Stack
            </button>
            <p className="text-gray-600 text-lg mt-4">
              Pick what you need—see eligibility, pricing, integration, onboarding timeline instantly
            </p>
          </div>
          
          {/* Stack Preview */}
          <AnimatePresence>
            {showStackPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 bg-gray-50 border border-gray-300 p-8 w-full max-w-6xl relative z-10"
              >
                <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
                <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
                
                <h4 className="text-2xl font-bold text-center mb-6">
                  Your Custom Payment Stack
                </h4>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {getSelectedModules().map((module) => (
                    <div
                      key={module.id}
                      className="bg-black text-white px-5 py-2 font-semibold"
                    >
                      {module.title}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(calculateStack()).map(([key, value]) => (
                    <div key={key} className="bg-white p-6 border border-gray-300 text-center">
                      <h5 className="font-semibold mb-2">
                        {key === 'setupFee' && 'Estimated Setup Fee'}
                        {key === 'processingRate' && 'Processing Rate'}
                        {key === 'integrationTime' && 'Integration Time'}
                        {key === 'goLiveTime' && 'Go-Live Timeline'}
                      </h5>
                      <p className="text-gray-700 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="relative bg-white overflow-x-hidden justify-center px-8 flex flex-col items-center">
        <div
          className="border p-8 max-w-7xl w-full mt-8 flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <div className="max-w-[1440px] mx-auto px-3 py-20">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold leading-tight text-black text-center mb-12">
                Advanced Features
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
                {[
                  {
                    icon: '🚀',
                    title: 'Global Instant Onboarding',
                    description: 'Get approved and start processing in multiple markets simultaneously',
                    details: {
                      label: 'Available Markets:',
                      items: ['EU', 'UK', 'GCC', 'LATAM', '+9 more']
                    }
                  },
                  {
                    icon: '🏛️',
                    title: '27+ Bank Partners',
                    description: 'Local compliance expertise with custom flows tailored to your business model and risk profile',
                    details: {
                      label: 'Partnership Benefits:',
                      items: ['Direct bank relationships', 'Competitive interchange rates', 'Regulatory compliance support', 'Custom settlement terms']
                    }
                  },
                  {
                    icon: '📊',
                    title: 'Transparent Dashboards',
                    description: 'Real-time reporting, transaction analytics, and comprehensive business intelligence tools',
                    details: {
                      label: 'Dashboard Features:',
                      items: ['Real-time transaction monitoring', 'Advanced analytics & reporting', 'Chargeback management', 'Revenue optimization insights']
                    }
                  }
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-10 border border-gray-300 text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300 relative"
                  >
                    <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
                    <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
                    <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
                    <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
                    
                    <div className="text-5xl mb-6">{feature.icon}</div>
                    <h3 className="text-2xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {feature.description}
                    </p>
                    <div className="bg-white p-4 border border-gray-300 text-left">
                      <strong>{feature.details.label}</strong>
                      {Array.isArray(feature.details.items) && feature.details.items.length > 0 && (
                        feature.details.label === 'Available Markets:' ? (
                          <div className="flex flex-wrap gap-2 mt-3 justify-center">
                            {feature.details.items.map((item) => (
                              <span key={item} className="bg-black text-white px-3 py-1 text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <ul className="mt-3 space-y-1 text-gray-600">
                            {feature.details.items.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vertical Matcher */}
      <section className="flex items-center justify-center relative px-8">
        <div
          className="border p-8 max-w-7xl w-full flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <AnimatedChart />

          <motion.div
            className="text-center relative z-10 max-w-6xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Accept payments for:</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full max-w-6xl relative z-10">
            {[
              { icon: '🎰', title: 'iGaming' },
              { icon: '📈', title: 'Forex' },
              { icon: '🔞', title: 'Adult' }
            ].map((vertical, index) => (
              <motion.div
                key={vertical.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-black to-gray-800 text-white p-8 text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group"
              >
                <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
                <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
                
                <div className="text-4xl mb-4 relative z-10">{vertical.icon}</div>
                <h4 className="text-xl font-semibold relative z-10">{vertical.title}</h4>
              </motion.div>
            ))}
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 border-2 border-dashed border-gray-400 text-gray-600 p-8 text-center cursor-pointer transition-all duration-300 hover:border-black hover:text-black hover:bg-gray-100"
                onClick={() => setShowOtherVerticals(!showOtherVerticals)}
              >
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-semibold">Other Industries</h4>
              </motion.div>
              
              <AnimatePresence>
                {showOtherVerticals && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 shadow-xl z-10"
                  >
                    <div className="p-4">
                      {[
                        'Cryptocurrency', 'Nutraceuticals', 'CBD/Cannabis', 'High-Risk Travel',
                        'Dating & Social', 'Telemarketing', 'E-cigarettes', 'Weight Loss'
                      ].map((industry) => (
                        <div
                          key={industry}
                          className="py-2 px-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                        >
                          {industry}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="text-center relative z-10">
            <button
              className="bg-black text-white px-10 py-4 text-xl font-semibold hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer"
              onClick={scrollToEligibility}
            >
              Check eligibility in my vertical
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Widget */}
      <section id="eligibilityWidget" className="py-24 px-4 md:px-8 bg-[#fafafa] relative overflow-hidden">
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

          <div className="w-full max-w-4xl relative z-10">
            <h2 className="text-4xl font-bold text-center mb-4">
              Eligibility Calculator
            </h2>
            
            <div className="bg-white p-12 border border-gray-300 relative">
              <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
              <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
              
              <p className="text-center text-xl text-gray-600 mb-8">
                Instantly see qualification, integration timeline, and sample MDR
              </p>
              
              <form onSubmit={handleEligibilitySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block font-semibold mb-2">Primary Geography:</label>
                  <select 
                    name="geography"
                    className="w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 cursor-pointer"
                    required
                  >
                    <option value="">Select region...</option>
                    <option value="eu">European Union</option>
                    <option value="uk">United Kingdom</option>
                    <option value="gcc">GCC Countries</option>
                    <option value="latam">Latin America</option>
                    <option value="apac">Asia Pacific</option>
                    <option value="na">North America</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-semibold mb-2">Monthly Volume (USD):</label>
                  <select 
                    name="volume"
                    className="w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 cursor-pointer"
                    required
                  >
                    <option value="">Select volume...</option>
                    <option value="50k-250k">$50K - $250K</option>
                    <option value="250k-1m">$250K - $1M</option>
                    <option value="1m-5m">$1M - $5M</option>
                    <option value="5m-20m">$5M - $20M</option>
                    <option value="20m+">$20M+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-semibold mb-2">Traffic Type:</label>
                  <select 
                    name="traffic"
                    className="w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 cursor-pointer"
                    required
                  >
                    <option value="">Select traffic type...</option>
                    <option value="organic">Organic/Direct</option>
                    <option value="paid">Paid Advertising</option>
                    <option value="affiliate">Affiliate Network</option>
                    <option value="mixed">Mixed Sources</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-semibold mb-2">Business Vertical:</label>
                  <select 
                    name="vertical"
                    className="w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 cursor-pointer"
                    required
                  >
                    <option value="">Select vertical...</option>
                    <option value="igaming">iGaming</option>
                    <option value="forex">Forex/CFD</option>
                    <option value="adult">Adult Entertainment</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 text-xl font-semibold hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Calculate Eligibility
                  </button>
                </div>
              </form>
              
              {/* Results */}
              <AnimatePresence>
                {eligibilityResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 p-8 border border-gray-300"
                  >
                    <h4 className="text-2xl font-bold text-center mb-6">
                      Eligibility Results
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 text-center border border-gray-300">
                        <div className="text-2xl font-bold mb-2">
                          {eligibilityResult.mdr}
                        </div>
                        <div className="font-medium">
                          Merchant Discount Rate
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 text-center border border-gray-300">
                        <div className="text-2xl font-bold mb-2">
                          {eligibilityResult.setupTime}
                        </div>
                        <div className="font-medium">
                          Setup Timeline
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 text-center border border-gray-300">
                        <div className="text-2xl font-bold mb-2">
                          ✅ Eligible
                        </div>
                        <div className="font-medium">
                          Compliance Status
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Layer */}
      <section className="relative py-24 px-8 bg-black text-white overflow-hidden max-w-7xl mx-auto">
        <AnimatedChart />
        
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            Trusted by Industry Leaders
          </h2>
          
          {/* Bank Partners */}
          <div className="flex justify-center gap-8 flex-wrap mb-12">
            {['HSBC', 'Barclays', 'Chase', 'Deutsche Bank', 'ING', 'BBVA'].map((bank) => (
              <div
                key={bank}
                className="w-32 h-16 bg-gray-800 border-2 border-gray-700 flex items-center justify-center font-semibold text-white hover:border-gray-500 hover:text-gray-300 transition-all duration-300"
              >
                {bank}
              </div>
            ))}
          </div>
          
          {/* Trust Badges */}
          <div className="flex justify-center gap-10 flex-wrap mb-12">
            {['PCI DSS Compliant', 'ISO 27001 Certified', '99.9% Uptime SLA'].map((badge) => (
              <div
                key={badge}
                className="bg-white text-black px-8 py-4 font-semibold shadow-lg"
              >
                {badge}
              </div>
            ))}
          </div>
          
          {/* Testimonials */}
          <div className="bg-gray-900 p-10 border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "TrustPay enabled us to expand into 15 new markets within 3 months. Their compliance expertise is unmatched.",
                  author: "Sarah Johnson",
                  context: "VP Growth, iGaming Platform"
                },
                {
                  quote: "The modular approach saved us 6 months of development time. We went live with crypto payments in just 2 weeks.",
                  author: "Michael Chen",
                  context: "CTO, Forex Broker"
                },
                {
                  quote: "Finally, a PSP that understands high-risk business. Our approval rates improved by 23% after switching.",
                  author: "Emma Rodriguez",
                  context: "CEO, Adult Entertainment"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-black p-6 border border-gray-700">
                  <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
                  <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
                  <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
                  <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
                  
                  <p className="italic text-gray-300 mb-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="font-semibold text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.context}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services
