'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingDown, CheckCircle, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentMethod {
  base: number;
  name: string;
  rate?: number; // Optional rate property
  cost?: number; // Optional cost property
}


interface Breakdown {
  [key: string]: number; 
}

interface CalculationResult {
  currentMethod: PaymentMethod;
  volume: number;
  breakdown: Breakdown;
  alternativeMethod: PaymentMethod;
  savings: number;
  baseRate: number;
  adjustedRate: number;
  totalCost: number;
  paymentMethodName: string;
  geographyName: string;
  industryName: string;
}


export default function PaymentCalculatorPage() {
  const [formData, setFormData] = useState({
    volume: '',
    paymentMethod: '',
    geography: '',
    industry: ''
  });
  
  const [results, setResults] = useState<CalculationResult | null >(null);
  const [showCTA, setShowCTA] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Pricing data structure (simplified but realistic)
  const pricingData = {
    paymentMethod: {
      'card': { base: 2.9, name: 'Credit/Debit Cards' },
      'crypto': { base: 1.5, name: 'Cryptocurrency' },
      'bank-transfer': { base: 0.8, name: 'Bank Transfer' },
      'digital-wallet': { base: 2.2, name: 'Digital Wallets' },
      'bnpl': { base: 3.5, name: 'Buy Now Pay Later' }
    },
    geography: {
      'north-america': { multiplier: 1.0, name: 'North America' },
      'europe': { multiplier: 1.1, name: 'Europe' },
      'apac': { multiplier: 0.9, name: 'Asia Pacific' },
      'latam': { multiplier: 1.3, name: 'Latin America' },
      'africa': { multiplier: 1.4, name: 'Africa' },
      'middle-east': { multiplier: 1.2, name: 'Middle East' }
    },
    industry: {
      'ecommerce': { modifier: 0.0, name: 'E-commerce' },
      'saas': { modifier: -0.2, name: 'SaaS/Software' },
      'marketplace': { modifier: 0.1, name: 'Marketplace' },
      'gaming': { modifier: 0.3, name: 'Gaming' },
      'travel': { modifier: 0.4, name: 'Travel & Hospitality' },
      'healthcare': { modifier: -0.1, name: 'Healthcare' },
      'education': { modifier: -0.3, name: 'Education' },
      'nonprofit': { modifier: -0.5, name: 'Non-profit' },
      'other': { modifier: 0.0, name: 'Other' }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateCosts = () => {
    if (!formData.volume || !formData.paymentMethod || !formData.geography || !formData.industry) {
      alert('Please fill in all fields to calculate your costs.');
      return;
    }

    const volume = parseFloat(formData.volume);
    const paymentData = pricingData.paymentMethod[formData.paymentMethod as keyof typeof pricingData.paymentMethod];
    const geoData = pricingData.geography[formData.geography as keyof typeof pricingData.geography];
    const industryData = pricingData.industry[formData.industry as keyof typeof pricingData.industry];

    // Calculate base rate
    let baseRate = paymentData.base;
    
    // Apply geography multiplier
    baseRate *= geoData.multiplier;
    
    // Apply industry modifier
    baseRate += industryData.modifier;
    
    // Volume discount (simplified)
    let volumeDiscount = 0;
    if (volume > 1000000) volumeDiscount = 0.3;
    else if (volume > 500000) volumeDiscount = 0.2;
    else if (volume > 100000) volumeDiscount = 0.1;
    
    const finalRate = Math.max(baseRate - volumeDiscount, 0.5); // Minimum 0.5%
    const totalCost = (volume * finalRate) / 100;

    // Calculate breakdown
    const breakdown = {
      basePaymentCost: (volume * paymentData.base) / 100,
      geographyAdjustment: (volume * paymentData.base * (geoData.multiplier - 1)) / 100,
      industryAdjustment: (volume * industryData.modifier) / 100,
      volumeDiscount: -(volume * volumeDiscount) / 100,
      totalCost: totalCost
    };

    // Generate comparison with alternative method
    const alternativeMethod = formData.paymentMethod === 'card' ? 'crypto' : 'card';
    const altPaymentData = pricingData.paymentMethod[alternativeMethod as keyof typeof pricingData.paymentMethod];
    let altRate = altPaymentData.base * geoData.multiplier + industryData.modifier - volumeDiscount;
    altRate = Math.max(altRate, 0.5);
    const alternativeCost = (volume * altRate) / 100;

    setResults({
          currentMethod: {
            name: paymentData.name,
            rate: finalRate,
            cost: totalCost,
            base: 0
          },
          alternativeMethod: {
            name: altPaymentData.name,
            rate: altRate,
            cost: alternativeCost,
            base: 0
          },
          breakdown,
          volume: volume,
          savings: alternativeCost - totalCost,
          baseRate: paymentData.base,
          adjustedRate: finalRate,
          totalCost: totalCost,
          paymentMethodName: paymentData.name,
          geographyName: geoData.name,
          industryName: industryData.name
        });

    // Trigger CTA after a short delay
    setTimeout(() => setShowCTA(true), 1000);
    setTimeout(() => setShowComparison(true), 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  const getTips = () => {
    const tips = [];
    
    if (formData.paymentMethod === 'card') {
      tips.push("Consider crypto payments for lower base rates");
    }
    
    if (parseFloat(formData.volume) < 100000) {
      tips.push("Higher volumes unlock better rates - consider bundling payments");
    }
    
    if (formData.industry === 'gaming' || formData.industry === 'travel') {
      tips.push("Your industry has higher risk premiums - optimizing fraud prevention can reduce costs");
    }
    
    return tips;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-80 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Payment Processing Cost Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant estimates for your payment processing costs and discover opportunities to save money
          </p>
        </motion.div>

        {/* Calculator Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transaction Volume */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Transaction Volume (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  placeholder="e.g., 250000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                  value={formData.volume}
                  onChange={(e) => handleInputChange('volume', e.target.value)}
                />
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Primary Payment Method
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              >
                <option value="">Select payment method</option>
                {Object.entries(pricingData.paymentMethod).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
            </motion.div>

            {/* Geography */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Primary Market
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                value={formData.geography}
                onChange={(e) => handleInputChange('geography', e.target.value)}
              >
                <option value="">Select your market</option>
                {Object.entries(pricingData.geography).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
            </motion.div>

            {/* Industry */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              >
                <option value="">Select your industry</option>
                {Object.entries(pricingData.industry).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateCosts}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-5 h-5" />
            Calculate My Processing Costs
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <div className="space-y-6">
              {/* Main Results */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Cost Estimate</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center p-6 bg-blue-50 rounded-xl"
                  >
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {formatCurrency(results.currentMethod.cost ?? 0)}
                    </div>
                    <div className="text-gray-600">Monthly Processing Cost</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatPercentage(results.currentMethod.rate ?? 0)} effective rate
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center p-6 bg-gray-50 rounded-xl"
                  >
                    <div className="text-2xl font-bold text-gray-700 mb-2">
                      {formatCurrency(results.volume)}
                    </div>
                    <div className="text-gray-600">Transaction Volume</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {results.currentMethod.name}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Cost Breakdown */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Cost Breakdown</h3>
                
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex justify-between items-center py-3 border-b border-gray-200"
                  >
                    <span className="text-gray-700">Base Payment Processing</span>
                    <span className="font-semibold">{formatCurrency(results.breakdown.basePaymentCost)}</span>
                  </motion.div>
                  
                  {results.breakdown.geographyAdjustment !== 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="flex justify-between items-center py-3 border-b border-gray-200"
                    >
                      <span className="text-gray-700">Regional Adjustment</span>
                      <span className={`font-semibold ${results.breakdown.geographyAdjustment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {results.breakdown.geographyAdjustment > 0 ? '+' : ''}{formatCurrency(results.breakdown.geographyAdjustment)}
                      </span>
                    </motion.div>
                  )}
                  
                  {results.breakdown.industryAdjustment !== 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="flex justify-between items-center py-3 border-b border-gray-200"
                    >
                      <span className="text-gray-700">Industry Risk Adjustment</span>
                      <span className={`font-semibold ${results.breakdown.industryAdjustment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {results.breakdown.industryAdjustment > 0 ? '+' : ''}{formatCurrency(results.breakdown.industryAdjustment)}
                      </span>
                    </motion.div>
                  )}
                  
                  {results.breakdown.volumeDiscount !== 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="flex justify-between items-center py-3 border-b border-gray-200"
                    >
                      <span className="text-gray-700">Volume Discount</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(results.breakdown.volumeDiscount)}
                      </span>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4"
                  >
                    <span className="font-bold text-gray-900">Total Monthly Cost</span>
                    <span className="font-bold text-blue-600 text-lg">{formatCurrency(results.breakdown.totalCost)}</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Comparison */}
              <AnimatePresence>
                {showComparison && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Cost Comparison</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="p-6 border-2 border-blue-200 rounded-xl"
                      >
                        <div className="font-semibold text-blue-600 mb-2">Current Selection</div>
                        <div className="text-lg font-bold">{results.currentMethod.name}</div>
                        <div className="text-2xl font-bold text-blue-600 mt-2">
                          {formatCurrency(results.currentMethod.cost ?? 0)}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="p-6 border-2 border-gray-200 rounded-xl"
                      >
                        <div className="font-semibold text-gray-600 mb-2">Alternative Option</div>
                        <div className="text-lg font-bold">{results.alternativeMethod.name}</div>
                        <div className="text-2xl font-bold text-gray-700 mt-2">
                          {formatCurrency(results.alternativeMethod.cost ?? 0)}
                        </div>
                      </motion.div>
                    </div>
                    
                    {Math.abs(results.savings) > 100 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className={`mt-6 p-4 rounded-lg ${results.savings > 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}
                      >
                        <div className="flex items-center gap-2">
                          <Info className={`w-5 h-5 ${results.savings > 0 ? 'text-green-600' : 'text-yellow-600'}`} />
                          <span className="font-semibold">
                            {results.savings > 0 ? 'Potential Monthly Savings: ' : 'Current Method Saves: '}
                            {formatCurrency(Math.abs(results.savings))}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tips */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                  Ways to Reduce Your Costs
                </h3>
                
                <div className="space-y-3">
                  {getTips().map((tip, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </motion.div>
                  ))}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Negotiate custom rates for high-volume processing</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* CTA */}
              <AnimatePresence>
                {showCTA && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4">Want to Save Even More?</h3>
                      <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Our payment experts can analyze your specific situation and identify additional cost-saving opportunities. 
                        Get a free, personalized audit of your payment processing setup.
                      </p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                      >
                        Get Your Free Cost-Saving Audit
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                      <div className="text-sm text-blue-200 mt-3">
                        No commitment required • 15-minute consultation • Instant recommendations
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}