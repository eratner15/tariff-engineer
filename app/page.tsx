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

    // Store description in sessionStorage
    sessionStorage.setItem('productDescription', description)

    // Simulate analysis time
    setTimeout(() => {
      router.push('/results')
    }, 2500)
  }

  const handleExampleClick = (example: typeof EXAMPLE_PRODUCTS[0]) => {
    setDescription(example.description)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-8 pt-32 pb-24">
        <div className="text-center mb-20">
          <h1 className="text-7xl font-semibold tracking-tight mb-6">
            Tariff Engineer
          </h1>
          <p className="text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            The difference between 60% duty and 6% often comes down to product design.
            Find the loopholes in 10,000 pages of tariff code.
          </p>
        </div>

        {/* Product Input */}
        <div className="max-w-3xl mx-auto">
          <div className="card mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Describe your product
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Running shoe with rubber outer sole and synthetic upper, contains embedded fitness tracker..."
              className="w-full h-32 px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent resize-none text-base"
            />

            <button
              onClick={handleAnalyze}
              disabled={!description.trim() || isAnalyzing}
              className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Find opportunities'}
            </button>
          </div>

          {/* Example Categories */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">Or try an example:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {EXAMPLE_PRODUCTS.map((example) => (
                <button
                  key={example.category}
                  onClick={() => handleExampleClick(example)}
                  className="btn-secondary py-3 px-6 text-sm"
                >
                  {example.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl font-semibold text-apple-blue mb-4">37.5% → 7.5%</div>
              <p className="text-gray-600">
                Add felt to your sneaker sole. Same shoe. 30 points of margin.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-semibold text-apple-blue mb-4">10,000+</div>
              <p className="text-gray-600">
                Public CBP rulings. The precedents exist. We make them usable.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-semibold text-apple-blue mb-4">2 minutes</div>
              <p className="text-gray-600">
                From product description to engineering opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-8 py-24">
        <h2 className="text-4xl font-semibold text-center mb-16">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="w-12 h-12 bg-apple-blue rounded-full flex items-center justify-center text-white text-xl font-semibold mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Describe your product</h3>
            <p className="text-gray-600">
              Natural language. Materials, components, use case. We handle the complexity.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-apple-blue rounded-full flex items-center justify-center text-white text-xl font-semibold mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">We analyze precedents</h3>
            <p className="text-gray-600">
              Search 10,000+ CBP rulings for legal tariff engineering opportunities.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-apple-blue rounded-full flex items-center justify-center text-white text-xl font-semibold mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Get actionable strategies</h3>
            <p className="text-gray-600">
              Specific modifications, new duty rates, ROI projections, supporting rulings.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-8 text-center text-sm text-gray-500">
          <p className="mb-2">Based on public CBP rulings. This is not legal advice.</p>
          <p>Consult a licensed customs broker before making classification decisions.</p>
        </div>
      </footer>
    </main>
  )
}
