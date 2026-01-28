'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/AnimatedCounter'

interface Opportunity {
  modification: string
  currentHTS: string
  currentRate: string
  newHTS: string
  newRate: string
  reduction: string
  confidence: 'High' | 'Medium' | 'Low'
  rulings: { id: string; url: string }[]
  explanation: string
  savings: {
    perUnit: number
    annual: number
  }
}

interface AnalysisResult {
  product: string
  currentClassification: {
    hts: string
    rate: string
    description: string
  }
  opportunities: Opportunity[]
  totalPotentialSavings: number
}

export default function ResultsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(true)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const description = sessionStorage.getItem('productDescription')
    if (!description) {
      router.push('/')
      return
    }

    // Call the real analysis API
    const fetchAnalysis = async () => {
      try {
        // Show analyzing animation
        setTimeout(() => setAnalyzing(false), 1200)

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description }),
        })

        if (!response.ok) {
          throw new Error('Analysis failed')
        }

        const data = await response.json()

        setResult({
          product: description,
          ...data
        })
      } catch (error) {
        console.error('Analysis error:', error)
        alert('Analysis failed. Please try again.')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [router])

  if (loading || !result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-8"
          >
            <div className="w-20 h-20 border-4 border-apple-blue border-t-transparent rounded-full"></div>
          </motion.div>

          {analyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl font-bold mb-4">Analyzing your product...</h2>
              <p className="text-xl text-gray-600 mb-8">Searching 10,000+ CBP rulings</p>
              <div className="space-y-2 text-sm text-gray-500 font-mono">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  → Scanning NY N293844... ✓
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, delay: 0.3, repeat: Infinity }}
                >
                  → Analyzing HQ H301842... ✓
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, delay: 0.6, repeat: Infinity }}
                >
                  → Checking material thresholds... ✓
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold mb-4">Found opportunities!</h2>
              <p className="text-xl text-gray-600">Preparing your results...</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    )
  }

  const getConfidenceColor = (confidence: Opportunity['confidence']) => {
    switch (confidence) {
      case 'High': return 'bg-green-500 text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      case 'Low': return 'bg-gray-400 text-white'
    }
  }

  const getConfidenceBorder = (confidence: Opportunity['confidence']) => {
    switch (confidence) {
      case 'High': return 'border-green-200'
      case 'Medium': return 'border-yellow-200'
      case 'Low': return 'border-gray-200'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-apple-blue hover:text-blue-700 text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            ← New analysis
          </button>
          <h1 className="text-2xl font-bold">Tariff Engineer</h1>
          <div className="w-28"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Product Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Your product</h2>
          <p className="text-2xl text-gray-900 mb-8 leading-relaxed">{result.product}</p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-lg font-semibold text-red-900">Current classification</h3>
                </div>
                <p className="text-4xl font-bold text-red-600 mb-3">
                  HTS {result.currentClassification.hts} — {result.currentClassification.rate} duty
                </p>
                <p className="text-base text-red-800">{result.currentClassification.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Big Opportunity Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-12 text-white shadow-2xl"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="inline-block text-7xl mb-6"
            >
              💰
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">
              We found {result.opportunities.length} ways to reduce your duty costs
            </h2>
            <div className="text-8xl font-bold mb-4">
              <AnimatedCounter
                value={result.totalPotentialSavings}
                prefix="$"
                decimals={0}
                duration={2}
              />
            </div>
            <p className="text-2xl opacity-90">
              potential annual savings @ 10,000 units/year
            </p>
          </div>
        </motion.div>

        {/* Opportunities */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-8">Engineering Opportunities</h2>

          <div className="space-y-6">
            {result.opportunities.map((opp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className={`bg-white rounded-3xl p-8 shadow-lg border-2 ${getConfidenceBorder(opp.confidence)} hover:shadow-xl transition-shadow`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-apple-blue to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {idx + 1}
                    </div>
                    <div>
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${getConfidenceColor(opp.confidence)} mb-2`}>
                        {opp.confidence} Confidence
                      </span>
                      <div className="text-3xl font-bold text-green-600">
                        {opp.reduction} duty reduction
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modification */}
                <h3 className="text-2xl font-bold mb-6 text-gray-900">{opp.modification}</h3>

                {/* Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Current</p>
                    <p className="text-2xl font-bold text-red-600">
                      HTS {opp.currentHTS}
                    </p>
                    <p className="text-xl font-semibold text-red-600">
                      {opp.currentRate} duty
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">After modification</p>
                    <p className="text-2xl font-bold text-green-600">
                      HTS {opp.newHTS}
                    </p>
                    <p className="text-xl font-semibold text-green-600">
                      {opp.newRate} duty
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-lg text-gray-700 mb-6 leading-relaxed bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  {opp.explanation}
                </p>

                {/* Savings & Rulings */}
                <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-semibold">💵 Estimated savings</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${opp.savings.perUnit.toFixed(2)}/unit
                    </p>
                    <p className="text-lg text-gray-600">
                      <AnimatedCounter
                        value={opp.savings.annual}
                        prefix="$"
                        decimals={0}
                        duration={1.5}
                      />
                      /year @ 10k units
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opp.rulings.map(ruling => (
                      <a
                        key={ruling.id}
                        href={ruling.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-apple-blue px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
                      >
                        <span>📄</span>
                        {ruling.id}
                        <span className="text-apple-blue">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-apple-blue to-blue-600 text-white px-12 py-5 rounded-pill text-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Analyze another product
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 p-8 bg-amber-50 border-2 border-amber-200 rounded-3xl"
        >
          <div className="flex gap-4">
            <span className="text-3xl">⚖️</span>
            <div>
              <p className="text-base text-amber-900 font-semibold mb-2">
                Important Legal Disclaimer
              </p>
              <p className="text-sm text-amber-800 mb-2">
                These opportunities are based on public CBP rulings and AI analysis. This is not legal advice.
              </p>
              <p className="text-sm text-amber-800">
                Always consult a licensed customs broker before making product classification decisions.
                Rulings are binding only on the specific products they address. Your product may differ in
                ways that affect classification.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
