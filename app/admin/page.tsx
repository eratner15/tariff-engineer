'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AnalyticsData {
  totalSearches: number
  totalEmails: number
  searchesToday: number
  searchesThisWeek: number
  conversionRate: number
  recentSearches: Array<{
    product: string
    timestamp: number
    email?: string
  }>
  topCategories: Array<{
    category: string
    count: number
  }>
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="spinner"></div>
      </main>
    )
  }

  if (!analytics) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-muted)' }}>No analytics data available yet.</p>
          <Link href="/" className="btn-primary mt-4 inline-block">
            Go Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="border-b py-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
            Analytics Dashboard
          </h1>
          <Link href="/" style={{ color: 'var(--color-accent)' }} className="font-medium text-sm">
            ← Back to app
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <p className="section-label">Total Searches</p>
            <p className="text-4xl font-semibold" style={{ color: 'var(--color-text)' }}>
              {analytics.totalSearches.toLocaleString()}
            </p>
          </div>

          <div className="card">
            <p className="section-label">Email Captures</p>
            <p className="text-4xl font-semibold" style={{ color: 'var(--color-positive)' }}>
              {analytics.totalEmails.toLocaleString()}
            </p>
          </div>

          <div className="card">
            <p className="section-label">This Week</p>
            <p className="text-4xl font-semibold" style={{ color: 'var(--color-accent)' }}>
              {analytics.searchesThisWeek.toLocaleString()}
            </p>
          </div>

          <div className="card">
            <p className="section-label">Conversion Rate</p>
            <p className="text-4xl font-semibold" style={{ color: 'var(--color-text)' }}>
              {analytics.conversionRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Top Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
              Top Product Categories
            </h2>
            <div className="space-y-4">
              {analytics.topCategories.map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span style={{ color: 'var(--color-text)' }}>{cat.category}</span>
                  <div className="flex items-center gap-4">
                    <div className="h-2 rounded-full" style={{
                      backgroundColor: 'var(--color-accent)',
                      width: `${(cat.count / analytics.totalSearches) * 200}px`,
                      maxWidth: '120px',
                      minWidth: '20px'
                    }} />
                    <span className="text-sm font-mono" style={{ color: 'var(--color-muted)', width: '40px', textAlign: 'right' }}>
                      {cat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
              Recent Searches
            </h2>
            <div className="space-y-3">
              {analytics.recentSearches.slice(0, 10).map((search, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#f5f5f7' }}
                >
                  <p className="text-sm mb-1" style={{ color: 'var(--color-text)' }}>
                    {search.product.substring(0, 80)}
                    {search.product.length > 80 ? '...' : ''}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      {new Date(search.timestamp).toLocaleString()}
                    </span>
                    {search.email && (
                      <span className="text-xs" style={{ color: 'var(--color-positive)' }}>
                        ✓ Email
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Activity Chart (Simple) */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Activity Overview
          </h2>
          <div className="grid grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={day} className="text-center">
                <div
                  className="h-32 rounded-lg mb-2"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    opacity: 0.2 + (Math.random() * 0.6) // Mock data
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
