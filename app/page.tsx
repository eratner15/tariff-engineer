'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLE_PRODUCTS = [
  {
    category: 'Footwear',
    description: 'Running shoe with rubber outer sole and synthetic upper, contains embedded fitness tracker, manufactured in Vietnam'
  },
  {
    category: 'Electronics',
    description: 'Wireless earbuds with charging case, Bluetooth 5.0, silicone ear tips, USB-C charging port'
  },
  {
    category: 'Bags',
    description: 'Laptop backpack with padded compartment, water-resistant polyester exterior, leather trim accents'
  },
  {
    category: 'Wearables',
    description: 'Smartwatch with heart rate monitor, GPS, OLED display, silicone band, waterproof to 50m'
  }
]

export default function Home() {
  const [description, setDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  const handleAnalyze = async () => {
    if (!description.trim()) return

    setIsAnalyzing(true)
    sessionStorage.setItem('productDescription', description)

    // Navigate to results
    setTimeout(() => {
      router.push('/results')
    }, 300)
  }

  const handleExampleClick = (example: typeof EXAMPLE_PRODUCTS[0]) => {
    setDescription(example.description)
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <div className="max-w-[680px] mx-auto px-6 pt-20 pb-24">
        {/* Eyebrow */}
        <p className="text-sm text-muted mb-4 text-center">Rat Links · The Build</p>

        {/* Headline */}
        <h1
          className="text-6xl md:text-7xl font-semibold text-center mb-6"
          style={{
            letterSpacing: '-0.03em',
            color: 'var(--color-text)'
          }}
        >
          Tariff Engineer
        </h1>

        {/* Subhead */}
        <p
          className="text-xl md:text-2xl text-center mb-16 leading-relaxed"
          style={{ color: 'var(--color-muted)' }}
        >
          The difference between 60% duty and 6% often comes down to product design.
          Find the loopholes in 10,000 pages of tariff code.
        </p>

        {/* Product Input Card */}
        <div className="card mb-8">
          <label
            className="block text-sm font-medium mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Describe your product
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Running shoe with rubber outer sole and synthetic upper..."
            className="input-field resize-none"
            rows={4}
          />

          <button
            onClick={handleAnalyze}
            disabled={!description.trim() || isAnalyzing}
            className="btn-primary w-full mt-6"
          >
            {isAnalyzing ? 'Analyzing...' : 'Find opportunities'}
          </button>
        </div>

        {/* Example Pills */}
        <div className="text-center">
          <p className="section-label text-center mb-4">Or try an example:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {EXAMPLE_PRODUCTS.map((example) => (
              <button
                key={example.category}
                onClick={() => handleExampleClick(example)}
                className="btn-secondary py-3 px-4 text-sm"
              >
                {example.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Value Prop Section */}
      <div className="py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-[680px] mx-auto px-6 text-center">
          <div className="mb-16">
            <div
              className="text-5xl md:text-6xl font-semibold mb-4"
              style={{ color: 'var(--color-negative)' }}
            >
              37.5%
            </div>
            <div className="text-2xl mb-2" style={{ color: 'var(--color-muted)' }}>
              →
            </div>
            <div
              className="text-5xl md:text-6xl font-semibold mb-4"
              style={{ color: 'var(--color-positive)' }}
            >
              7.5%
            </div>
            <p className="text-lg" style={{ color: 'var(--color-muted)' }}>
              Add felt to your sneaker sole. Same shoe. Thirty points of margin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div>
              <div className="text-4xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                10,000+
              </div>
              <p style={{ color: 'var(--color-muted)' }}>
                Public CBP rulings. The precedents exist. We make them usable.
              </p>
            </div>
            <div>
              <div className="text-4xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                2 minutes
              </div>
              <p style={{ color: 'var(--color-muted)' }}>
                From product description to engineering opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 max-w-[680px] mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-16" style={{ color: 'var(--color-text)' }}>
          How it works
        </h2>

        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              Describe your product
            </h3>
            <p style={{ color: 'var(--color-muted)' }}>
              Materials, components, intended use. We handle the complexity.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              We analyze precedents
            </h3>
            <p style={{ color: 'var(--color-muted)' }}>
              Search 10,000+ CBP rulings for legal tariff engineering opportunities.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              Get actionable strategies
            </h3>
            <p style={{ color: 'var(--color-muted)' }}>
              Specific modifications, new duty rates, ROI projections, supporting rulings.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-[680px] mx-auto px-6 text-center">
          <p className="text-lg mb-3" style={{ color: 'var(--color-muted)' }}>
            Want the full tool with live CROSS database?
          </p>
          <p className="text-xl font-medium mb-4" style={{ color: 'var(--color-text)' }}>
            Reply to this newsletter for early access.
          </p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            🐀 Rat Links
          </p>
        </div>
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
