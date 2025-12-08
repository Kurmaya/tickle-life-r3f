'use client'

import React, { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

interface EligibilityResult {
  status: string
  description: string
  onboarding: string
  approval: string
  setup: string
}

interface IndustryData {
  icon: string
  title: string
  badges: string[]
  feature: string
  approvalRate: string
}

interface CostResult {
  mdr: number
  monthly: number
  setup: number
  reserve: number
  factors: string[]
}

const IndustriesPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const [selectedVertical, setSelectedVertical] = useState<string>('')
  const [showMoreVerticals, setShowMoreVerticals] = useState<boolean>(false)
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null)
  const [costResult, setCostResult] = useState<CostResult | null>(null)
  const [activeModal, setActiveModal] = useState<string>('')


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

  const industryData: Record<string, IndustryData> = {
    igaming: {
      icon: '🎰',
      title: 'iGaming',
      badges: ['MGA Licensed', 'UKGC Approved', 'EU Compliant'],
      feature: 'Real-time transaction monitoring with automated responsible gaming controls and jurisdiction-specific routing',
      approvalRate: '95% approval rate in regulated EU markets'
    },
    forex: {
      icon: '📈',
      title: 'Forex & CFD Trading',
      badges: ['FCA Regulated', 'CySEC', 'ASIC'],
      feature: 'Instant funding with advanced fraud detection tailored for high-frequency trading patterns',
      approvalRate: '92% approval rate for FCA-regulated brokers'
    },
    adult: {
      icon: '🔞',
      title: 'Adult Entertainment',
      badges: ['Age Verified', 'GDPR', 'PCI L1'],
      feature: 'Privacy-focused processing with enhanced chargeback protection and discrete billing descriptors',
      approvalRate: '88% approval rate with specialized routing'
    }
  }

  const moreIndustries = [
    { id: 'cryptocurrency', icon: '🪙', title: 'Cryptocurrency', subtitle: 'Exchange & wallet services' },
    { id: 'nutraceuticals', icon: '💊', title: 'Nutraceuticals', subtitle: 'Health supplements & vitamins' },
    { id: 'cbd', icon: '🌿', title: 'CBD/Cannabis', subtitle: 'Legal cannabis products' },
    { id: 'travel', icon: '✈️', title: 'High-Risk Travel', subtitle: 'Tours & high-risk destinations' },
    { id: 'dating', icon: '💕', title: 'Dating & Social', subtitle: 'Dating apps & social platforms' },
    { id: 'telemarketing', icon: '📞', title: 'Telemarketing', subtitle: 'Phone & direct sales' },
    { id: 'ecigarettes', icon: '💨', title: 'E-cigarettes', subtitle: 'Vaping products & accessories' },
    { id: 'weightloss', icon: '⚖️', title: 'Weight Loss', subtitle: 'Diet & fitness products' }
  ]

  const checkEligibility = () => {
    const geoSelect = document.getElementById('geoSelect') as HTMLSelectElement
    const verticalSelect = document.getElementById('verticalSelect') as HTMLSelectElement
    
    const geo = geoSelect?.value
    const vertical = verticalSelect?.value
    
    if (!geo || !vertical) {
      alert('Please select both geography and vertical')
      return
    }

    const eligibilityData: Record<string, EligibilityResult> = {
      'eu-igaming': { status: 'Eligible', description: 'Full processing available with MGA licensing', onboarding: '3-5 days', approval: '98%', setup: '$1,500' },
      'uk-forex': { status: 'Eligible', description: 'FCA regulated brokers welcome', onboarding: '5-7 days', approval: '95%', setup: '$2,000' },
      'india-adult': { status: 'Restricted', description: 'Limited availability with enhanced compliance', onboarding: '10-14 days', approval: '70%', setup: '$5,000' },
      'gcc-igaming': { status: 'Not Eligible', description: 'Not permitted in this jurisdiction', onboarding: 'N/A', approval: 'N/A', setup: 'N/A' }
    }
    
    const key = `${geo}-${vertical}`
    const result = eligibilityData[key] || { 
      status: 'Eligible with Conditions', 
      description: 'Processing available with enhanced due diligence',
      onboarding: '7-10 days',
      approval: '85%',
      setup: '$3,000'
    }
    
    setEligibilityResult(result)
  }

  const calculateCosts = () => {
    const industrySelect = document.getElementById('simIndustry') as HTMLSelectElement
    const volumeSelect = document.getElementById('simVolume') as HTMLSelectElement
    const paymentSelect = document.getElementById('simPaymentMethod') as HTMLSelectElement
    
    const industry = industrySelect?.value
    const volume = parseInt(volumeSelect?.value || '0')
    const paymentMethod = paymentSelect?.value
    
    if (!industry || !volume || !paymentMethod) {
      alert('Please fill all fields')
      return
    }

    const industryRates: Record<string, { base: number; risk: number }> = {
      'igaming': { base: 3.2, risk: 1.2 },
      'forex': { base: 2.8, risk: 1.1 },
      'adult': { base: 4.5, risk: 1.5 },
      'cryptocurrency': { base: 5.2, risk: 1.8 },
      'nutraceuticals': { base: 3.8, risk: 1.3 },
      'cbd': { base: 6.2, risk: 2.0 },
      'travel': { base: 3.5, risk: 1.2 },
      'dating': { base: 4.0, risk: 1.4 },
      'telemarketing': { base: 4.8, risk: 1.6 },
      'ecigarettes': { base: 5.8, risk: 1.9 },
      'weightloss': { base: 4.2, risk: 1.4 }
    }

    const paymentRates: Record<string, number> = {
      'cards': 1.0,
      'crypto': 1.3,
    }

    const volumeDiscount = volume > 5000000 ? 0.85 : volume > 1000000 ? 0.9 : volume > 500000 ? 0.95 : 1.0

    const baseRate = industryRates[industry]?.base || 3.5
    const finalRate = baseRate * (paymentRates[paymentMethod] || 1.0) * volumeDiscount
    const monthlyCost = volume * finalRate / 100
    const setupCost = (industryRates[industry]?.risk || 1.0) * 1500
    const reserveRate = Math.min((industryRates[industry]?.risk || 1.0) * 3, 15)

    const industryFactors: Record<string, string[]> = {
      'igaming': ['🎯 Gaming license requirements', '🌍 Multi-jurisdiction processing', '🛡️ Responsible gaming controls'],
      'forex': ['📈 High-frequency trading support', '⚡ Instant funding capabilities', '🛡️ Enhanced fraud detection'],
      'adult': ['🔞 Age verification systems', '💳 Discrete billing descriptors', '🛡️ Chargeback protection']
    }

    const factors = industryFactors[industry] || ['🎯 Industry risk assessment', '🌍 Geographic processing costs', '🛡️ Enhanced fraud protection']

    setCostResult({
      mdr: finalRate,
      monthly: monthlyCost,
      setup: setupCost,
      reserve: reserveRate,
      factors
    })
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black relative overflow-x-hidden">

      {/* Navigation Sidebar */}
      <div className="fixed left-20 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col items-center space-y-8 pl-4">
          {["INDUSTRIES", "ELIGIBILITY", "COSTS"].map((item) => (
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
              <span style={{ whiteSpace: 'nowrap' }}>Tailored payment solutions </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>for your industry&apos;s </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>compliance and growth</span>
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
              See how we optimize approval and reliability<br/>
              for each high-risk vertical.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.8] tracking-tight mb-16"
              initial={{ scale: 0.8, y: 100 }}
              whileInView={{ scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-200px" }}
            >
              CHOOSE YOUR INDUSTRY
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full max-w-6xl relative z-10">
            {/* Main Industry Tiles */}
            {Object.entries(industryData).map(([key, data], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 border border-gray-300 p-8 text-center cursor-pointer relative overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                onClick={() => setActiveModal('qualification')}
              >
                <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
                <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
                
                <div className="text-6xl mb-5">{data.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{data.title}</h3>
                
                <div className="flex flex-wrap justify-center gap-2 mb-5">
                  {data.badges.map((badge) => (
                    <span
                      key={badge}
                      className="bg-black text-white px-3 py-1 text-sm font-semibold"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                
                <div className="bg-white p-4 border border-gray-300 mb-5">
                  <strong>Key Feature:</strong> {data.feature}
                </div>
                
                <div className="bg-gray-800 text-white p-4 mb-6 font-semibold text-lg">
                  ⚡ {data.approvalRate}
                </div>
                
                <button
                  className="bg-black text-white px-8 py-3 font-semibold w-full transition-all duration-300 hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveModal('qualification')
                  }}
                >
                  Get qualified for {data.title}
                </button>
              </motion.div>
            ))}

            {/* More Industries Tile */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gray-100 border-2 border-dashed border-gray-400 p-8 text-center cursor-pointer relative hover:bg-gray-50 transition-all duration-300"
              onClick={() => setShowMoreVerticals(!showMoreVerticals)}
            >
              <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
              <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
              
              <div className="text-6xl mb-5">⚡</div>
              <h3 className="text-2xl font-bold mb-4">More Industries</h3>
              
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                <span className="bg-black text-white px-3 py-1 text-sm font-semibold">Multi-Licensed</span>
                <span className="bg-black text-white px-3 py-1 text-sm font-semibold">Specialized</span>
              </div>
              
              <div className="bg-white p-4 border border-gray-300 mb-5">
                <strong>Explore:</strong> Click to see all supported high-risk verticals with tailored compliance solutions
              </div>
              
              <div className="bg-gray-800 text-white p-4 mb-6 font-semibold text-lg">
                ⚡ Industry-specific optimization available
              </div>
              
              <button className="bg-black text-white px-8 py-3 font-semibold w-full transition-all duration-300 hover:bg-gray-800">
                View All Industries
              </button>
              
              <AnimatePresence>
                {showMoreVerticals && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-300 p-5 shadow-xl mt-3 z-20"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {moreIndustries.map((industry, index) => (
                        <motion.div
                          key={industry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-3 cursor-pointer hover:bg-gray-100 transition-colors text-left"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedVertical(industry.id)
                            setShowMoreVerticals(false)
                          }}
                        >
                          <div className="font-semibold">
                            {industry.icon} {industry.title}
                          </div>
                          <div className="text-sm text-gray-600">{industry.subtitle}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="relative py-24 px-8 bg-[#f9f9f9] overflow-hidden max-w-7xl mx-auto">
        <AnimatedChart />
        
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Industry Success Stories</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {[
            {
              stat: '98%',
              statDesc: 'Approval rate for EU iGaming operators',
              testimonial: '"TrustPay\'s understanding of MGA requirements and their technical integration made our European expansion seamless. Our payment success rates increased by 23% after switching."',
              author: '— Sarah Johnson, CTO at EuroSlots Gaming'
            },
            {
              stat: '$2.3B',
              statDesc: 'Processed for Forex brokers in 2024',
              testimonial: '"The instant funding capability and their specialized fraud protection for trading accounts has been game-changing. We\'ve reduced funding friction by 40%."',
              author: '— Marcus Chen, Head of Payments at TradePro'
            },
            {
              stat: '0.3%',
              statDesc: 'Chargeback rate for adult merchants',
              testimonial: '"Their discrete billing and enhanced chargeback protection tools helped us maintain excellent payment metrics while growing our subscriber base."',
              author: '— Alex Rivera, Director of Operations at ContentHub'
            }
          ].map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-10 border border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
            >
              <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
              <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
              
              <div className="bg-black text-white p-5 text-center mb-6">
                <div className="text-4xl font-bold mb-2">{story.stat}</div>
                <div className="text-lg opacity-90">{story.statDesc}</div>
              </div>
              
              <div className="text-lg italic text-gray-600 mb-5 leading-relaxed">
                {story.testimonial}
              </div>
              
              <div className="font-semibold text-black mb-3">{story.author}</div>
              
              <button className="text-gray-600 hover:text-black font-semibold hover:underline transition-colors cursor-pointer">
                See full case study →
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Compliance & FAQ Section */}
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
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Compliance & FAQ</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
            {[
              {
                question: 'Can I onboard this vertical in my geo?',
                answer: 'Eligibility varies by geography and business model. We maintain licensing and compliance requirements for each region and can provide instant qualification checking.'
              },
              {
                question: 'Which flows are disqualified?',
                answer: 'We maintain strict compliance standards. Certain traffic sources, models, or jurisdictions may be restricted based on regulations and risk assessment.'
              },
              {
                question: 'What documentation do I need?',
                answer: 'Requirements vary by industry and geography. We provide a comprehensive checklist and dedicated compliance support during onboarding.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 border border-gray-300 relative"
              >
                <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
                <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
                <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
                
                <div className="text-xl font-bold mb-3">{item.question}</div>
                <p className="text-gray-700 mb-4">{item.answer}</p>
                <button
                  className="bg-black text-white px-4 py-2 font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => setActiveModal(item.question)}
                >
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Widget */}
      <section className="py-24 px-4 md:px-8 bg-[#fafafa] relative overflow-hidden">
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
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 border border-gray-300 relative"
            >
              <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
              <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
              
              <h3 className="text-3xl font-bold text-center mb-4">Check Your Eligibility</h3>
              <p className="text-center text-gray-600 mb-10 text-lg">
                Pick your geography and vertical to see eligibility, onboarding time, and requirements
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block font-semibold mb-2">Target Geography:</label>
                  <select 
                    id="geoSelect"
                    className="w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Select region...</option>
                    <option value="eu">European Union</option>
                    <option value="uk">United Kingdom</option>
                    <option value="india">India</option>
                    <option value="gcc">GCC Countries</option>
                    <option value="latam">Latin America</option>
                    <option value="apac">Asia Pacific</option>
                    <option value="na">North America</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-semibold mb-2">Business Vertical:</label>
                  <select 
                    id="verticalSelect"
                    className="w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Select industry...</option>
                    <option value="igaming">iGaming</option>
                    <option value="forex">Forex & CFD Trading</option>
                    <option value="adult">Adult Entertainment</option>
                    <option value="cryptocurrency">Cryptocurrency</option>
                    <option value="nutraceuticals">Nutraceuticals</option>
                    <option value="cbd">CBD/Cannabis</option>
                    <option value="travel">High-Risk Travel</option>
                    <option value="dating">Dating & Social</option>
                    <option value="telemarketing">Telemarketing</option>
                    <option value="ecigarettes">E-cigarettes</option>
                    <option value="weightloss">Weight Loss</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={checkEligibility}
                className="w-full bg-black text-white py-5 text-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Check Eligibility & Requirements
              </button>
              
              <AnimatePresence>
                {eligibilityResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 p-8 bg-gray-50 border border-gray-300"
                  >
                    <div className="text-center mb-6">
                      <div className={`text-2xl font-bold mb-2 ${
                        eligibilityResult.status.includes('Eligible') ? 'text-black' : 
                        eligibilityResult.status.includes('Restricted') ? 'text-gray-600' : 'text-gray-800'
                      }`}>
                        {eligibilityResult.status}
                      </div>
                      <p className="text-gray-700">{eligibilityResult.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                      <div className="bg-white p-5 text-center border border-gray-300">
                        <div className="text-2xl font-bold mb-1">{eligibilityResult.onboarding}</div>
                        <div className="font-medium">Onboarding Time</div>
                      </div>
                      <div className="bg-white p-5 text-center border border-gray-300">
                        <div className="text-2xl font-bold mb-1">{eligibilityResult.approval}</div>
                        <div className="font-medium">Approval Rate</div>
                      </div>
                      <div className="bg-white p-5 text-center border border-gray-300">
                        <div className="text-2xl font-bold mb-1">{eligibilityResult.setup}</div>
                        <div className="font-medium">Setup Fee</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 border border-gray-300">
                      <h5 className="font-semibold mb-4">Required Documentation:</h5>
                      <ul className="space-y-2">
                        {['Valid business license', 'Regulatory compliance certificates', 'Financial statements (last 6 months)', 'Risk management documentation'].map((req, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center text-gray-700"
                          >
                            <span className="w-5 h-5 mr-2">✓</span>
                            {req}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Payment Cost Simulator Section */}
      <section className="relative py-24 px-8 bg-black text-white overflow-hidden max-w-7xl mx-auto">
        <AnimatedChart />
        
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Payment Cost Simulator</h2>
        </div>

        <div className="bg-white text-black p-10 border border-gray-300 relative">
          <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
          <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
          <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
          <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
          
          <p className="text-center text-lg text-gray-600 mb-8">
            Get instant estimates for MDR and monthly costs based on your industry, volume, and payment methods
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block font-semibold mb-2">Industry:</label>
              <select
                id="simIndustry"
                className="w-full p-4 border-2 border-gray-300 focus:border-black cursor-pointer"
              >
                <option value="">Select industry...</option>
                {[
                  'igaming',
                  'forex',
                  'adult',
                  'cryptocurrency',
                  'nutraceuticals',
                  'cbd',
                  'travel',
                  'dating',
                  'telemarketing',
                  'ecigarettes',
                  'weightloss',
                ].map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Monthly Volume (USD):</label>
              <select
                id="simVolume"
                className="w-full p-4 border-2 border-gray-300 focus:border-black cursor-pointer"
              >
                <option value="">Select volume...</option>
                <option value="50000">$50K - $100K</option>
                <option value="200000">$100K - $500K</option>
                <option value="750000">$500K - $1M</option>
                <option value="2500000">$1M - $5M</option>
                <option value="7500000">$5M - $10M</option>
                <option value="15000000">$10M+</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Primary Payment Method:</label>
              <select
                id="simPaymentMethod"
                className="w-full p-4 border-2 border-gray-300 focus:border-black cursor-pointer"
              >
                <option value="">Select payment method...</option>
                <option value="cards">Credit/Debit Cards</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateCosts}
            className="w-full bg-black text-white py-5 text-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Calculate My Costs
          </button>

          <AnimatePresence>
            {costResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <h4 className="text-center text-2xl font-bold mb-6">
                  Your Estimated Processing Costs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                  <div className="bg-gray-50 p-5 text-center border border-gray-300">
                    <div className="text-lg font-semibold">MDR</div>
                    <div className="text-2xl font-bold">
                      {costResult.mdr.toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 text-center border border-gray-300">
                    <div className="text-lg font-semibold">Monthly Cost</div>
                    <div className="text-2xl font-bold">
                      ${costResult.monthly.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 text-center border border-gray-300">
                    <div className="text-lg font-semibold">Setup</div>
                    <div className="text-2xl font-bold">
                      ${costResult.setup.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 text-center border border-gray-300">
                    <div className="text-lg font-semibold">Reserve</div>
                    <div className="text-2xl font-bold">
                      {costResult.reserve.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 border border-gray-300">
                  <h5 className="font-semibold mb-4">
                    Cost Factors for Your Industry:
                  </h5>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {costResult.factors.map((factor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span>{factor.split(' ')[0]}</span>
                        <span>{factor.substring(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

export default IndustriesPage
