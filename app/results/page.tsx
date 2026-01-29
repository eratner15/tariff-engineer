'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SavingsCalculator from '@/components/SavingsCalculator'

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
  const [activeModIndex, setActiveModIndex] = useState(0)
  const [showCopied, setShowCopied] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

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

  const handleCopySummary = () => {
    if (!result) return

    const summary = `TARIFF ENGINEERING ANALYSIS

Product: ${result.product}

Current Classification:
HTS ${result.currentClassification.hts} @ ${result.currentClassification.rate}
${result.currentClassification.description}

Engineering Opportunities:

${result.opportunities.map((opp, idx) => `
${idx + 1}. ${opp.modification}
   Current: HTS ${opp.currentHTS} @ ${opp.currentRate}
   New: HTS ${opp.newHTS} @ ${opp.newRate}
   Reduction: ${opp.reduction}
   Confidence: ${opp.confidence}
   Annual Savings: $${opp.savings.annual.toLocaleString()}/year
   Supporting Rulings: ${opp.rulings.map(r => r.id).join(', ')}
`).join('\n')}

Total Potential Annual Savings: $${result.totalPotentialSavings.toLocaleString()}

Disclaimer: Based on public CBP rulings. Not legal advice. Consult a licensed customs broker.
`

    navigator.clipboard.writeText(summary)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const handleDownloadPDF = async () => {
    if (!result) return

    setDownloadingPDF(true)

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      })

      if (!response.ok) {
        throw new Error('PDF generation failed')
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tariff-analysis-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('PDF download error:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setDownloadingPDF(false)
    }
  }

  // Loading State
  if (loading || !result) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div className="text-center">
          <div className="spinner mx-auto mb-6"></div>
          <p style={{ color: 'var(--color-muted)' }}>Analyzing classifications...</p>
        </div>
      </main>
    )
  }

  const activeMod = result.opportunities[activeModIndex]

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="border-b py-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-[680px] mx-auto px-6 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            style={{ color: 'var(--color-accent)' }}
            className="font-medium text-sm hover:opacity-80 transition-opacity"
          >
            ← New analysis
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleCopySummary}
              className="btn-secondary text-sm py-2 px-4"
            >
              {showCopied ? '✓ Copied' : 'Copy summary'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="btn-primary text-sm py-2 px-4"
            >
              {downloadingPDF ? 'Generating...' : 'Download Report'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[680px] mx-auto px-6 py-12">
        {/* Product */}
        <div className="mb-16">
          <p className="section-label">Your Product</p>
          <p className="text-lg" style={{ color: 'var(--color-text)' }}>{result.product}</p>
        </div>

        {/* Current Classification */}
        <section className="mb-16">
          <p className="section-label">Current Classification</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="stat-label">HTS Code</span>
              <span className="stat-value font-mono">{result.currentClassification.hts}</span>
            </div>
            <div>
              <span className="stat-label">Duty Rate</span>
              <span className="stat-value" style={{ color: 'var(--color-negative)' }}>
                {result.currentClassification.rate}
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--color-muted)' }}>
            {result.currentClassification.description}
          </p>
        </section>

        {/* Engineering Opportunities */}
        <section className="mb-16">
          <p className="section-label">Engineering Opportunities</p>

          {/* Tabs */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {result.opportunities.map((opp, idx) => (
              <button
                key={idx}
                onClick={() => setActiveModIndex(idx)}
                className={`px-6 py-3 rounded-pill font-medium text-sm whitespace-nowrap transition-all ${
                  activeModIndex === idx
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                Option {idx + 1}
              </button>
            ))}
          </div>

          {/* Active Modification */}
          <div className="card">
            <h3 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              {activeMod.modification}
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-muted)' }}>
              {activeMod.explanation}
            </p>

            {/* Before/After Grid */}
            <div className="grid grid-cols-3 gap-6 p-6 rounded-2xl mb-6" style={{ backgroundColor: '#f5f5f7' }}>
              <div>
                <span className="stat-label">New HTS</span>
                <span className="font-mono block font-semibold" style={{ color: 'var(--color-text)' }}>
                  {activeMod.newHTS}
                </span>
              </div>
              <div>
                <span className="stat-label">New Rate</span>
                <span className="font-semibold block" style={{ color: 'var(--color-positive)' }}>
                  {activeMod.newRate}
                </span>
              </div>
              <div>
                <span className="stat-label">Reduction</span>
                <span className="font-semibold block" style={{ color: 'var(--color-positive)' }}>
                  {activeMod.reduction}
                </span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Confidence</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  {activeMod.confidence}
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e5e7' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: activeMod.confidence === 'High' ? '85%' : activeMod.confidence === 'Medium' ? '60%' : '35%',
                    backgroundColor: 'var(--color-positive)'
                  }}
                />
              </div>
            </div>

            {/* Ruling Links */}
            <div className="p-4 rounded-xl flex justify-between items-center" style={{ backgroundColor: '#f5f5f7' }}>
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                <strong>CBP Rulings:</strong> {activeMod.rulings.map(r => r.id).join(', ')}
              </span>
              <div className="flex gap-2">
                {activeMod.rulings.map(ruling => (
                  <a
                    key={ruling.id}
                    href={ruling.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    View ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Savings Summary */}
        <section className="mb-16">
          <p className="section-label">Potential Savings</p>
          <div className="card" style={{ background: 'linear-gradient(to bottom right, #f5f5f7, var(--color-card-bg))' }}>
            <div className="grid grid-cols-3 text-center divide-x" style={{ borderColor: 'var(--color-border)' }}>
              <div className="px-4">
                <p className="stat-label">Per Unit</p>
                <p className="text-3xl font-semibold" style={{ color: 'var(--color-text)' }}>
                  ${activeMod.savings.perUnit.toFixed(2)}
                </p>
              </div>
              <div className="px-4">
                <p className="stat-label">At Scale</p>
                <p className="text-3xl font-semibold" style={{ color: 'var(--color-positive)' }}>
                  ${activeMod.savings.annual.toLocaleString()}
                </p>
              </div>
              <div className="px-4">
                <p className="stat-label">Volume</p>
                <p className="text-3xl font-semibold" style={{ color: 'var(--color-muted)' }}>
                  10K
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Total Savings - All Opportunities */}
        {result.opportunities.length > 1 && (
          <section className="mb-16">
            <div className="card text-center" style={{ borderLeft: `4px solid var(--color-positive)` }}>
              <p className="section-label text-center">Combined Annual Savings</p>
              <p className="text-5xl font-semibold mb-2" style={{ color: 'var(--color-positive)' }}>
                ${result.totalPotentialSavings.toLocaleString()}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Implementing all {result.opportunities.length} opportunities @ 10,000 units/year
              </p>
            </div>
          </section>
        )}

        {/* Interactive Savings Calculator */}
        <section className="mb-16">
          <SavingsCalculator
            currentRate={parseFloat(activeMod.currentRate) || 0}
            newRate={parseFloat(activeMod.newRate) || 0}
            productName={result.product}
          />
        </section>


        {/* CTA */}
        <section className="text-center py-12">
          <p className="mb-3" style={{ color: 'var(--color-muted)' }}>
            Want the full tool with live CROSS database?
          </p>
          <p className="text-xl font-medium mb-6" style={{ color: 'var(--color-text)' }}>
            Reply to this newsletter for early access.
          </p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            🐀 Rat Links
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Data from{' '}
          <a
            href="https://rulings.cbp.gov"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-accent)' }}
          >
            CBP CROSS rulings
          </a>
          {' '}· Not legal advice
        </p>
      </footer>
    </main>
  )
}
