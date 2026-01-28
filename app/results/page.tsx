'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
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

function MoneyLossCounter({ dailyLoss }: { dailyLoss: number }) {
  const [seconds, setSeconds] = useState(0)
  const lossPerSecond = dailyLoss / (24 * 60 * 60)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const currentLoss = seconds * lossPerSecond

  return (
    <span className="font-mono">
      ${currentLoss.toFixed(2)}
    </span>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const description = sessionStorage.getItem('productDescription')
    if (!description) {
      router.push('/')
      return
    }

    const fetchAnalysis = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description }),
        })

        if (!response.ok) throw new Error('Analysis failed')

        const data = await response.json()
        setResult({ product: description, ...data })
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
      <main className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white"
        >
          <div className="text-8xl mb-8">💸</div>
          <h1 className="text-6xl font-bold mb-6">Calculating your losses...</h1>
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </main>
    )
  }

  const dailyLoss = result.totalPotentialSavings / 365
  const monthlyLoss = result.totalPotentialSavings / 12
  const perUnitAverage = result.opportunities[0]?.savings.perUnit || 0

  // Real-world comparisons
  const getComparison = (amount: number) => {
    if (amount >= 300000) return { item: 'Tesla Model S', emoji: '🚗', count: Math.floor(amount / 100000) }
    if (amount >= 150000) return { item: 'senior engineer salaries', emoji: '👨‍💻', count: Math.floor(amount / 150000) }
    if (amount >= 50000) return { item: 'junior engineer salaries', emoji: '💼', count: Math.floor(amount / 50000) }
    return { item: 'MacBook Pros', emoji: '💻', count: Math.floor(amount / 3000) }
  }

  const comparison = getComparison(result.totalPotentialSavings)

  return (
    <main className="min-h-screen bg-black">
      {/* STOP LOSING MONEY Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white py-20"
      >
        <div className="max-w-6xl mx-auto px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-9xl mb-8"
          >
            🚨
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-7xl md:text-8xl font-black mb-6 uppercase tracking-tight"
          >
            STOP LOSING MONEY
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-3xl mb-12 opacity-90"
          >
            You've been overpaying on every single unit
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-black/30 backdrop-blur-sm rounded-3xl p-12 border-4 border-white/20"
          >
            <p className="text-2xl mb-4 opacity-90">Money lost since you opened this page:</p>
            <div className="text-8xl font-black mb-4 text-yellow-300">
              <MoneyLossCounter dailyLoss={dailyLoss} />
            </div>
            <p className="text-xl opacity-75">
              That's <span className="font-bold">${dailyLoss.toFixed(2)}/day</span> • <span className="font-bold">${(monthlyLoss).toFixed(0)}/month</span> • <span className="font-bold">${result.totalPotentialSavings.toLocaleString()}/year</span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* THE FLIP - Savings Opportunity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white py-24"
      >
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 1.2 }}
              className="text-9xl mb-8"
            >
              💰
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-7xl font-black mb-8 uppercase"
            >
              HERE'S HOW TO FIX IT
            </motion.h2>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 border-4 border-white/30"
            >
              <p className="text-3xl mb-6">Total annual savings:</p>
              <div className="text-9xl font-black mb-8">
                <AnimatedCounter
                  value={result.totalPotentialSavings}
                  prefix="$"
                  decimals={0}
                  duration={2}
                />
              </div>
              <p className="text-4xl font-bold mb-8">
                That's {comparison.count} {comparison.item} {comparison.emoji}
              </p>
              <p className="text-2xl opacity-90">
                Nike does this. Apple does this. <span className="font-black">Now you can too.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Simple Opportunities */}
      <div className="bg-gradient-to-b from-gray-900 to-black text-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl font-black text-center mb-16 uppercase"
          >
            {result.opportunities.length} Simple Changes
          </motion.h2>

          <div className="space-y-8">
            {result.opportunities.map((opp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-gray-700 hover:border-green-500 transition-all"
              >
                <div className="flex items-start gap-6">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg">
                    {idx + 1}
                  </div>

                  <div className="flex-1">
                    {/* The Change */}
                    <h3 className="text-3xl font-bold mb-6 text-green-400">{opp.modification}</h3>

                    {/* Before/After Visual */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* BEFORE - Pain */}
                      <div className="bg-red-900/30 border-2 border-red-500/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl">😰</span>
                          <div>
                            <p className="text-sm uppercase tracking-wide text-red-400 font-bold">Currently Paying</p>
                            <p className="text-5xl font-black text-red-400">{opp.currentRate}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">HTS {opp.currentHTS}</p>
                      </div>

                      {/* AFTER - Relief */}
                      <div className="bg-green-900/30 border-2 border-green-500/50 rounded-2xl p-6 relative">
                        <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-sm">
                          SAVE {opp.reduction}!
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl">🎉</span>
                          <div>
                            <p className="text-sm uppercase tracking-wide text-green-400 font-bold">With This Change</p>
                            <p className="text-5xl font-black text-green-400">{opp.newRate}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">HTS {opp.newHTS}</p>
                      </div>
                    </div>

                    {/* The Money */}
                    <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/50 rounded-2xl p-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-400 uppercase tracking-wide font-bold mb-2">Your Savings</p>
                          <p className="text-5xl font-black text-yellow-300">
                            <AnimatedCounter
                              value={opp.savings.annual}
                              prefix="$"
                              decimals={0}
                              duration={1.5}
                            />
                            <span className="text-2xl">/year</span>
                          </p>
                          <p className="text-xl text-yellow-200 mt-2">
                            ${opp.savings.perUnit.toFixed(2)} saved per unit
                          </p>
                        </div>
                        <div className="text-7xl">
                          💸
                        </div>
                      </div>
                    </div>

                    {/* Why This Works */}
                    <div className="bg-blue-900/30 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
                      <p className="text-lg leading-relaxed text-gray-300">{opp.explanation}</p>
                    </div>

                    {/* Proof */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Legal precedent from CBP:</p>
                        <div className="flex gap-2">
                          {opp.rulings.map(ruling => (
                            <a
                              key={ruling.id}
                              href={ruling.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-700 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                              {ruling.id} →
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgency Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20"
      >
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="text-7xl mb-6">⏰</div>
          <h2 className="text-5xl font-black mb-8 uppercase">Every Day You Wait Costs You</h2>
          <div className="text-8xl font-black mb-8 text-yellow-300">
            ${dailyLoss.toFixed(0)}
          </div>
          <p className="text-3xl mb-12">
            In 30 days, that's <span className="font-black">${(dailyLoss * 30).toFixed(0)}</span> down the drain
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-white text-red-600 px-12 py-6 rounded-full text-2xl font-black shadow-2xl hover:scale-110 transition-transform"
          >
            Analyze Another Product →
          </button>
        </div>
      </motion.div>

      {/* Share Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-2xl text-gray-400 mb-4">Know someone overpaying on imports?</p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Tariff Engineer - I found $' + result.totalPotentialSavings.toLocaleString() + ' in savings',
                  text: 'Just discovered I can save $' + result.totalPotentialSavings.toLocaleString() + '/year on import duties with simple product changes',
                  url: window.location.origin
                })
              } else {
                navigator.clipboard.writeText(window.location.origin)
                alert('Link copied!')
              }
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
          >
            📤 Share This Tool
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-500 py-8 text-center text-sm border-t border-gray-800">
        <p className="mb-2">⚖️ Based on public CBP rulings. This is not legal advice.</p>
        <p>Consult a licensed customs broker before making classification decisions.</p>
      </footer>
    </main>
  )
}
