'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
        // Fallback to basic message on error
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
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mb-4"></div>
          <p className="text-xl text-gray-600">Analyzing tariff opportunities...</p>
        </div>
      </main>
    )
  }

  const getConfidenceColor = (confidence: Opportunity['confidence']) => {
    switch (confidence) {
      case 'High': return 'bg-apple-green text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      case 'Low': return 'bg-gray-400 text-white'
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-apple-blue hover:underline text-sm font-medium"
          >
            ← New analysis
          </button>
          <h1 className="text-2xl font-semibold">Tariff Engineer</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Product Summary */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Your product</h2>
          <p className="text-xl text-gray-900 mb-6">{result.product}</p>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-900 mb-1">Current classification</h3>
                <p className="text-2xl font-semibold text-red-600 mb-2">
                  HTS {result.currentClassification.hts} — {result.currentClassification.rate} duty
                </p>
                <p className="text-sm text-red-800">{result.currentClassification.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-8">
            {result.opportunities.length} engineering opportunities found
          </h2>

          <div className="space-y-6">
            {result.opportunities.map((opp, idx) => (
              <div key={idx} className="card border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(opp.confidence)}`}>
                        {opp.confidence} confidence
                      </span>
                      <span className="text-2xl font-semibold text-apple-green">
                        {opp.reduction} duty reduction
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{opp.modification}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current</p>
                    <p className="text-lg font-semibold text-apple-red">
                      HTS {opp.currentHTS} @ {opp.currentRate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">New</p>
                    <p className="text-lg font-semibold text-apple-green">
                      HTS {opp.newHTS} @ {opp.newRate}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">{opp.explanation}</p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated savings</p>
                    <p className="text-2xl font-semibold text-apple-green">
                      ${opp.savings.perUnit.toFixed(2)}/unit
                    </p>
                    <p className="text-sm text-gray-500">
                      ${opp.savings.annual.toLocaleString()}/year @ 10,000 units
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {opp.rulings.map(ruling => (
                      <a
                        key={ruling.id}
                        href={ruling.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary py-2 px-4 text-sm"
                      >
                        {ruling.id} →
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Savings Summary */}
        <div className="bg-apple-blue text-white rounded-3xl p-12 text-center">
          <p className="text-lg mb-2 opacity-90">Total potential annual savings</p>
          <p className="text-6xl font-semibold mb-4">
            ${result.totalPotentialSavings.toLocaleString()}
          </p>
          <p className="text-lg opacity-90">based on 10,000 units per year</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Important:</strong> These opportunities are based on public CBP rulings and AI analysis.
            This is not legal advice.
          </p>
          <p className="text-sm text-gray-600">
            Always consult a licensed customs broker before making product classification decisions.
            Rulings are binding only on the specific products they address. Your product may differ in
            ways that affect classification.
          </p>
        </div>
      </div>
    </main>
  )
}
