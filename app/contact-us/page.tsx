'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Globe, Lock } from 'lucide-react'

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [telegram, setTelegram] = useState('')
  const [errors, setErrors] = useState<{ email?: string; website?: string }>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  
  const validateWebsite = (value: string) =>
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/.test(value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}
    
    if (!email) newErrors.email = 'Email address is required'
    else if (!validateEmail(email))
      newErrors.email = 'Please enter a valid email address'
    
    if (!website) newErrors.website = 'Business website is required'
    else if (!validateWebsite(website))
      newErrors.website = 'Please enter a valid website URL'
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSubmitted(true)
        console.log({ email, website, telegram: telegram || 'Not provided' })
      }, 2000)
    }
  }

  function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.05 }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 cursor-pointer"
        title={text}
        onClick={() => alert(text)}
      >
        <div className="bg-black text-white p-1.5">{icon}</div>
        <span className="text-sm font-medium text-gray-700">{text}</span>
      </motion.div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black relative overflow-x-hidden">

      {/* Navigation Sidebar */}
      <div className="fixed left-20 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col items-center space-y-8 pl-4">
          {["CONTACT", "FORM", "SUPPORT"].map((item) => (
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
              <span style={{ whiteSpace: 'nowrap' }}>Ready to move forward? </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>Let us know how </span><br />
              <span style={{ whiteSpace: 'nowrap' }}>to reach you</span>
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
              If you&apos;ve completed your eligibility check and qualify,<br/>
              our compliance team will get in touch fast.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="flex items-center justify-center relative px-8">
        <div
          className="border p-8 max-w-7xl w-full mx-4 mt-8 flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <AnimatedChart />

          <motion.div
            className="w-full max-w-lg relative z-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white border border-gray-300 overflow-hidden relative">
              <div className="absolute left-1 top-1 w-3 h-3 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 top-1 w-3 h-3 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
              <div className="absolute left-1 bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
              <div className="absolute right-1 bottom-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
              
              {/* Top line */}
              <div className="h-1 bg-black" />
              
              {/* Header */}
              <div className="px-8 pt-12 pb-6 text-center bg-gray-50">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                  Contact Information
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Fill in your details and our compliance team will get in touch within 24 hours.
                </p>
              </div>

              {/* Form */}
              <div className="px-8 py-8">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Email */}
                      <div>
                        <label className="block text-black font-semibold mb-2">
                          Email address:
                        </label>
                        <input
                          type="email"
                          className={`w-full px-4 py-3 border-2 text-base outline-none transition-all ${
                            errors.email
                              ? 'border-red-500 bg-red-50'
                              : email
                              ? 'border-black bg-gray-50'
                              : 'border-gray-300 bg-gray-50'
                          }`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      {/* Website */}
                      <div>
                        <label className="block text-black font-semibold mb-2">
                          Your business website:
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com"
                          className={`w-full px-4 py-3 border-2 text-base outline-none transition-all ${
                            errors.website
                              ? 'border-red-500 bg-red-50'
                              : website
                              ? 'border-black bg-gray-50'
                              : 'border-gray-300 bg-gray-50'
                          }`}
                          value={website}
                          onChange={(e) => {
                            let val = e.target.value
                            if (
                              val &&
                              !/^https?:\/\//.test(val) &&
                              !val.startsWith(' ')
                            ) {
                              val = 'https://' + val
                            }
                            setWebsite(val)
                          }}
                        />
                        {errors.website && (
                          <p className="mt-2 text-sm text-red-600">{errors.website}</p>
                        )}
                      </div>

                      {/* Telegram */}
                      <div>
                        <label className="block text-black font-normal mb-2">
                          Telegram handle (optional):
                        </label>
                        <input
                          type="text"
                          placeholder="@yourusername"
                          className="w-full px-4 py-3 border-2 border-gray-300 bg-gray-50 text-base outline-none transition-all"
                          value={telegram}
                          onChange={(e) => {
                            let val = e.target.value
                            if (val && !val.startsWith('@')) {
                              val = '@' + val
                            }
                            setTelegram(val)
                          }}
                        />
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 font-semibold text-white text-lg transition-all relative overflow-hidden cursor-pointer ${
                          loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-black hover:bg-gray-800 hover:-translate-y-1'
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-3">
                            Submitting...
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          </span>
                        ) : (
                          'Submit My Contact Details'
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="thankyou"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-gray-50 border-2 border-black p-6 text-center"
                    >
                      <h3 className="text-black font-semibold text-lg">
                        ✅ Thank you!
                      </h3>
                      <p className="text-gray-700 mt-1 text-sm">
                        If you pre-qualified, our expert team will reach out directly
                        within 24 hours by your preferred method.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-300">
                <p className="text-center text-sm text-gray-600 mb-4">
                  We verify each inquiry against our compliance and vertical standards
                  before contacting you.
                </p>
                <div className="flex justify-center items-center gap-4 flex-wrap">
                  <Badge icon={<ShieldCheck size={18} />} text="PCI DSS" />
                  <Badge icon={<Globe size={18} />} text="Geo Licensed" />
                  <Badge icon={<Lock size={18} />} text="Data Never Shared" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="relative bg-white overflow-x-hidden justify-center px-8 flex flex-col items-center">
        <div
          className="border p-8 max-w-7xl w-full mt-8 flex flex-col items-center"
          style={{ borderColor: "rgba(100, 100, 100, 0.3)" }}
        >
          <div className="max-w-[1440px] mx-auto px-3 py-20">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold leading-tight text-black text-center mb-12">
                Why Choose Our Platform
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
                <div className="flex items-start border border-gray-200 bg-white p-8">
                  <span className="block w-6 mt-1 text-xl text-gray-800 mr-4">›</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expert Compliance Team</h3>
                    <p className="text-base md:text-lg text-gray-600">
                      Our dedicated compliance experts understand the unique challenges of high-risk industries and will guide you through the entire process.
                    </p>
                  </div>
                </div>
                <div className="flex items-start border border-gray-200 bg-white p-8">
                  <span className="block w-6 mt-1 text-xl text-gray-800 mr-4">›</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Fast Response Time</h3>
                    <p className="text-base md:text-lg text-gray-600">
                      Get connected with our team within 24 hours. We understand that time is critical for your business operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Information */}
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

          <div className="w-full max-w-[1200px] flex flex-col md:flex-row md:items-start md:justify-between relative z-10 mb-12">
            <div className="flex-1 text-left">
              <h2
                className="text-[3rem] md:text-[5rem] leading-[0.95] font-normal font-sans break-words mb-8 md:mb-0"
                style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
              >
                Need Help?<br />
                We&apos;re Here<br />
                For You
              </h2>
            </div>
            <div className="flex-1 md:pl-12 pt-2 md:pt-10">
              <p className="text-lg md:text-2xl leading-relaxed text-black max-w-lg mb-8">
                Our support team is available 24/7 to assist you with any questions about our platform and services.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded" />
                  <span className="text-lg">support@platform.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded" />
                  <span className="text-lg">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded" />
                  <span className="text-lg">Live Chat Available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
