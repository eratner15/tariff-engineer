'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import htsCodes from '@/data/hts-codes.json'

interface HTSCode {
  code: string
  description: string
  dutyRate: string
  category: string
  notes: string
}

export default function HTSLookupTool() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<HTSCode[]>([])
  const [allCodes] = useState<HTSCode[]>(htsCodes as HTSCode[])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults(allCodes.slice(0, 10))
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allCodes.filter(code =>
      code.code.includes(query) ||
      code.description.toLowerCase().includes(query) ||
      code.category.toLowerCase().includes(query) ||
      code.notes.toLowerCase().includes(query)
    )

    setResults(filtered.slice(0, 20))
  }, [searchQuery, allCodes])

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="border-b py-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-[880px] mx-auto px-6 flex justify-between items-center">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>Tools</p>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
              HTS Code Lookup
            </h1>
          </div>
          <Link href="/" style={{ color: 'var(--color-accent)' }} className="font-medium text-sm">
            ← Home
          </Link>
        </div>
      </div>

      <div className="max-w-[880px] mx-auto px-6 py-12">
        {/* Intro */}
        <div className="mb-12">
          <p className="text-xl mb-6" style={{ color: 'var(--color-muted)' }}>
            Search the Harmonized Tariff Schedule to find duty rates for specific products.
          </p>

          {/* Search Box */}
          <div className="card">
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
              Search by product, HTS code, or category
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., footwear, 6402, athletic shoes..."
              className="input-field"
              autoFocus
            />
            <p className="mt-3 text-sm" style={{ color: 'var(--color-muted)' }}>
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.map((code, idx) => (
            <div key={idx} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-2xl font-mono font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                    {code.code}
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full" style={{
                    backgroundColor: '#f5f5f7',
                    color: 'var(--color-text)'
                  }}>
                    {code.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>Duty Rate</p>
                  <p className="text-2xl font-semibold" style={{
                    color: code.dutyRate === 'Free' ? 'var(--color-positive)' : 'var(--color-negative)'
                  }}>
                    {code.dutyRate}
                  </p>
                </div>
              </div>

              <p className="mb-4 leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {code.description}
              </p>

              {code.notes && (
                <p className="text-sm p-3 rounded-lg" style={{
                  backgroundColor: '#f5f5f7',
                  color: 'var(--color-muted)'
                }}>
                  💡 {code.notes}
                </p>
              )}
            </div>
          ))}

          {results.length === 0 && (
            <div className="card text-center py-12">
              <p style={{ color: 'var(--color-muted)' }}>
                No matching HTS codes found. Try a different search term.
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 card text-center" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
            Want to reduce your duty rates?
          </h2>
          <p className="mb-6" style={{ color: 'var(--color-muted)' }}>
            Tariff Engineer analyzes your products and finds legal engineering opportunities to lower your duty rates.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Analyze my product
          </Link>
        </div>

        {/* SEO Content */}
        <div className="mt-16 prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            About HTS Codes
          </h2>
          <p style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>
            The Harmonized Tariff Schedule (HTS) is a standardized system of names and numbers used to classify traded products. Each product imported into the United States is assigned an HTS code that determines the applicable duty rate. Understanding HTS codes is essential for importers, as even small changes in product design or composition can result in significantly different duty rates.
          </p>
          <p style={{ color: 'var(--color-muted)', lineHeight: '1.7', marginTop: '1rem' }}>
            Tariff engineering is the legal practice of modifying product specifications to qualify for lower HTS classifications. Our tool helps identify these opportunities by analyzing thousands of CBP rulings and finding precedents that support lower duty rates.
          </p>
        </div>
      </div>
    </main>
  )
}
