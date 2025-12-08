'use client'

import React, { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, Download, Play, Eye, Calendar, FileText, Video, BookOpen, Users, MessageCircle, ChevronDown } from 'lucide-react'

const ResourceCenter = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

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

  const resources = [
    {
      id: 1,
      type: 'Blog',
      title: 'KYC Automation in High-Risk Industries',
      description: 'Explore how automated KYC processes are revolutionizing compliance workflows for cryptocurrency exchanges and online gaming platforms.',
      date: 'Jan 15, 2025',
      category: 'product',
      icon: FileText
    },
    {
      id: 2,
      type: 'Blog',
      title: 'PCI DSS 4.0: What\'s New for Payment Processors',
      description: 'Breaking down the latest PCI DSS requirements and their impact on payment processing for regulated verticals.',
      date: 'Jan 12, 2025',
      category: 'industry',
      icon: FileText
    },
    {
      id: 3,
      type: 'Whitepaper',
      title: 'AML Compliance Checklist for Crypto Exchanges',
      description: 'Complete 50-point checklist covering transaction monitoring, suspicious activity reporting, and regulatory filing requirements.',
      date: 'Dec 2024',
      category: 'content-type',
      icon: Download
    },
    {
      id: 4,
      type: 'Guide',
      title: 'GDPR Implementation for Fintech',
      description: 'Step-by-step guide to achieving GDPR compliance while maintaining operational efficiency in financial services.',
      date: 'Dec 2024',
      category: 'product',
      icon: BookOpen
    },
    {
      id: 5,
      type: 'Webinar',
      title: 'Regulatory Landscape 2025: What\'s Ahead',
      description: 'Join leading compliance experts as they discuss upcoming regulatory changes affecting payment processors and high-risk merchants.',
      date: 'Live Jan 25',
      category: 'content-type',
      icon: Video
    },
    {
      id: 6,
      type: 'Webinar',
      title: 'Risk Assessment Strategies',
      description: 'Learn advanced risk scoring methodologies and fraud prevention techniques from industry veterans.',
      date: 'On-Demand',
      category: 'industry',
      icon: Play
    },
    {
      id: 7,
      type: 'Case Study',
      title: 'iGaming Platform: 40% Faster Onboarding',
      description: 'How a leading European iGaming operator reduced customer onboarding time while improving compliance scores by 95%.',
      date: 'Jan 2025',
      category: 'product',
      icon: Users
    },
    {
      id: 8,
      type: 'Case Study',
      title: 'Crypto Exchange: Zero Compliance Violations',
      description: 'Discover how automated monitoring helped a major exchange maintain perfect regulatory compliance across 15 jurisdictions.',
      date: 'Dec 2024',
      category: 'industry',
      icon: Eye
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesFilter = activeFilter === 'all' || resource.category === activeFilter
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filterContent = (type: React.SetStateAction<string>) => {
    setActiveFilter(type)
  }

  const loadMoreContent = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert('More resources would be loaded here')
    }, 1000)
  }

  const getTypeColor = (type: string) => {
    const colors = {
      'Blog': 'bg-black',
      'Whitepaper': 'bg-gray-800',
      'Guide': 'bg-gray-700',
      'Webinar': 'bg-black',
      'Case Study': 'bg-gray-600'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500'
  }

  const getActionText = (type: string) => {
    const actions = {
      'Blog': 'Read More',
      'Whitepaper': 'Download',
      'Guide': 'Download',
      'Webinar': 'Register Now',
      'Case Study': 'View Story'
    }
    return actions[type as keyof typeof actions] || 'View'
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black relative overflow-x-hidden">

      {/* Navigation Sidebar */}
      <div className="fixed left-20 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col items-center space-y-8 pl-4">
          {["RESOURCES", "FILTER", "CONTACT"].map((item) => (
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
              <span style={{ whiteSpace: 'nowrap' }}>Resource </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>Center</span>
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
              Take your knowledge to the next level —<br/>
              compliance, onboarding, and payments for high-risk verticals.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="flex items-center justify-center relative px-8">
        <div
          className="border p-8 max-w-7xl w-full mx-4 mt-8 flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <AnimatedChart />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <motion.div
              className="flex flex-wrap gap-4 mb-8 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { key: 'all', label: 'All Resources' },
                { key: 'product', label: 'By Product' },
                { key: 'industry', label: 'By Industry' },
                { key: 'content-type', label: 'Content Type' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => filterContent(filter.key)}
                  className={`px-6 py-3 border transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer ${
                    activeFilter === filter.key
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:bg-black hover:text-white hover:border-black'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </motion.div>
            
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Find guides, compliance checklists, onboarding resources…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-12 py-4 border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="relative bg-white overflow-x-hidden justify-center px-8 flex flex-col items-center">
        <div
          className="border p-8 max-w-7xl w-full mt-8 flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <div className="max-w-[1440px] mx-auto px-3 py-20">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                className="bg-black text-white p-12 border border-gray-300 relative group transition-transform duration-500 hover:scale-[1.02] w-full"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400" />
                <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400" />
                <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400" />
                <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400" />
                
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  Future of Regulated iGaming Payments
                </h3>
                <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl">
                  Comprehensive analysis of emerging payment technologies, regulatory frameworks, and compliance strategies for the evolving iGaming landscape.
                </p>
                <button className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer">
                  <Download className="w-5 h-5" />
                  Download Whitepaper
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
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
            viewport={{ once: true, margin: "-200px" }}
          >
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.8] tracking-tight mb-16"
              initial={{ scale: 0.8, y: 100 }}
              whileInView={{ scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-200px" }}
            >
              LATEST RESOURCES
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl relative z-10">
            {filteredResources.map((resource, index) => {
              const IconComponent = resource.icon
              return (
                <motion.div
                  key={resource.id}
                  ref={el => { cardsRef.current[index] = el }}
                  className="bg-gray-50 border border-gray-300 p-6 transition-all duration-500 hover:bg-white hover:shadow-xl hover:-translate-y-2 group relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
                  <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
                  <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
                  <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className={`${getTypeColor(resource.type)} text-white px-3 py-1 text-sm font-medium`}>
                      {resource.type}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {resource.date}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-black group-hover:text-gray-600 transition-colors duration-300">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                  
                  <button className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-105 cursor-pointer">
                    <IconComponent className="w-4 h-4" />
                    {getActionText(resource.type)}
                  </button>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-12 relative z-10">
            <button
              onClick={loadMoreContent}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  Load More Resources
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <button
          onClick={() => alert('Compliance expert chat would open here')}
          className="w-14 h-14 bg-black text-white shadow-xl hover:bg-gray-800 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          title="Ask a Compliance Expert"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>
        
        <button
          onClick={() => alert('Request consultation would open here')}
          className="bg-gray-800 text-white px-6 py-3 font-semibold shadow-xl hover:bg-black transition-all duration-300 hover:scale-105 whitespace-nowrap"
        >
          Request Consultation
        </button>
      </div>
    </div>
  )
}

export default ResourceCenter
