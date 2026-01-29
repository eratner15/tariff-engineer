'use client'

import { useState } from 'react'
import Link from 'next/link'
import rulings from '@/data/rulings.json'

export default function RulingsIndexPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(rulings.map(r => r.category)))]

  const filteredRulings = categoryFilter === 'All'
    ? rulings
    : rulings.filter(r => r.category === categoryFilter)

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="border-b py-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>Database</p>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
              CBP Ruling Library
            </h1>
          </div>
          <Link href="/" style={{ color: 'var(--color-accent)' }} className="font-medium text-sm">
            ← Home
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Intro */}
        <div className="mb-12">
          <p className="text-xl mb-8" style={{ color: 'var(--color-muted)' }}>
            Browse {rulings.length} CBP customs rulings covering tariff classifications and duty rates.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={categoryFilter === category ? 'btn-primary' : 'btn-secondary'}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Rulings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRulings.map(ruling => (
            <Link
              key={ruling.id}
              href={`/rulings/${ruling.id}`}
              className="card"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-mono font-semibold text-lg" style={{ color: 'var(--color-accent)' }}>
                  {ruling.id}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full" style={{
                  backgroundColor: '#f5f5f7',
                  color: 'var(--color-text)'
                }}>
                  {ruling.category}
                </span>
              </div>

              <p className="text-sm mb-4" style={{ color: 'var(--color-text)', lineHeight: '1.5' }}>
                {ruling.productDescription.substring(0, 140)}
                {ruling.productDescription.length > 140 ? '...' : ''}
              </p>

              <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  {ruling.issueDate}
                </span>
                <span className="text-sm font-semibold" style={{
                  color: ruling.dutyRate === 'Free' ? 'var(--color-positive)' : 'var(--color-negative)'
                }}>
                  {ruling.dutyRate}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {ruling.htsCodes.slice(0, 2).map((code, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2 py-1 rounded"
                    style={{ backgroundColor: '#f5f5f7', color: 'var(--color-muted)' }}
                  >
                    {code}
                  </span>
                ))}
                {ruling.htsCodes.length > 2 && (
                  <span
                    className="text-xs px-2 py-1"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    +{ruling.htsCodes.length - 2} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredRulings.length === 0 && (
          <div className="card text-center py-12">
            <p style={{ color: 'var(--color-muted)' }}>
              No rulings found in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
