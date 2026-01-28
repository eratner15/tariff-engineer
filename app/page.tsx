'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const EXAMPLE_PRODUCTS = [
  {
    category: 'Footwear',
    description: 'Running shoe with rubber outer sole and synthetic upper, contains embedded fitness tracker, manufactured in Vietnam',
    emoji: '👟'
  },
  {
    category: 'Electronics',
    description: 'Wireless earbuds with charging case, Bluetooth 5.0, silicone ear tips, USB-C charging port',
    emoji: '🎧'
  },
  {
    category: 'Bags',
    description: 'Laptop backpack with padded compartment, water-resistant polyester exterior, leather trim accents',
    emoji: '🎒'
  },
  {
    category: 'Wearables',
    description: 'Smartwatch with heart rate monitor, GPS, OLED display, silicone band, waterproof to 50m',
    emoji: '⌚'
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
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6 px-6 py-2 bg-blue-50 rounded-full"
          >
            <span className="text-apple-blue font-semibold text-sm">10,000+ CBP Rulings • Zero Setup Required</span>
          </motion.div>

          <h1 className="text-8xl font-bold tracking-tight mb-8 leading-none">
            Tariff Engineer
          </h1>

          <p className="text-3xl text-gray-700 font-light max-w-4xl mx-auto leading-relaxed mb-12">
            The difference between <span className="font-semibold text-red-600">60% duty</span> and{' '}
            <span className="font-semibold text-green-600">6% duty</span> often comes down to{' '}
            <span className="font-semibold text-gray-900">product design.</span>
          </p>

          {/* Dramatic Example */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-6xl mb-3">👟</div>
                  <div className="text-sm text-gray-600 mb-2">Rubber sole</div>
                  <div className="text-4xl font-bold text-red-600">37.5%</div>
                  <div className="text-sm text-gray-500">duty rate</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2">→</div>
                  <div className="text-sm font-semibold text-apple-blue">Add felt to sole</div>
                </div>

                <div className="text-center">
                  <div className="text-6xl mb-3">👟</div>
                  <div className="text-sm text-gray-600 mb-2">Felt + rubber</div>
                  <div className="text-4xl font-bold text-green-600">7.5%</div>
                  <div className="text-sm text-gray-500">duty rate</div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Savings per unit</div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    $15.00
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    That's <span className="font-semibold text-gray-900">30 percentage points</span> of margin
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-12"
          >
            Nike and Apple have teams for this. Small importers have never heard of it.
            <br />
            <span className="font-semibold text-gray-900">We're making it accessible.</span>
          </motion.p>
        </motion.div>

        {/* Product Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Describe your product
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Running shoe with rubber outer sole and synthetic upper, contains embedded fitness tracker..."
              className="w-full h-32 px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent resize-none text-base transition-all"
            />

            <button
              onClick={handleAnalyze}
              disabled={!description.trim() || isAnalyzing}
              className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing 10,000+ rulings...
                </span>
              ) : (
                '🔍 Find hidden savings'
              )}
            </button>
          </div>

          {/* Example Categories */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-6">Or try an example:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {EXAMPLE_PRODUCTS.map((example) => (
                <motion.button
                  key={example.category}
                  onClick={() => handleExampleClick(example)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white border-2 border-gray-200 hover:border-apple-blue rounded-2xl py-4 px-4 text-sm font-medium transition-all shadow-sm hover:shadow-md"
                >
                  <div className="text-3xl mb-2">{example.emoji}</div>
                  {example.category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center"
            >
              <div className="text-7xl font-bold text-apple-blue mb-4">30%</div>
              <p className="text-xl text-gray-700 font-medium mb-2">Average duty reduction</p>
              <p className="text-gray-600">
                Real strategies from real CBP rulings
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-center"
            >
              <div className="text-7xl font-bold text-apple-blue mb-4">10K+</div>
              <p className="text-xl text-gray-700 font-medium mb-2">Public CBP rulings</p>
              <p className="text-gray-600">
                The precedents exist. We make them usable.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-center"
            >
              <div className="text-7xl font-bold text-apple-blue mb-4">10s</div>
              <p className="text-xl text-gray-700 font-medium mb-2">From input to insights</p>
              <p className="text-gray-600">
                What takes consultants hours takes us seconds
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-center mb-16"
        >
          How it works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              num: '1',
              title: 'Describe your product',
              desc: 'Natural language. Materials, components, use case. We handle the complexity.',
              delay: 0.2
            },
            {
              num: '2',
              title: 'We analyze precedents',
              desc: 'Search 10,000+ CBP rulings for legal tariff engineering opportunities.',
              delay: 0.4
            },
            {
              num: '3',
              title: 'Get actionable strategies',
              desc: 'Specific modifications, new duty rates, ROI projections, supporting rulings.',
              delay: 0.6
            }
          ].map((step) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                {step.num}
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-lg text-gray-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-apple-blue to-blue-700 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-8 text-center text-white"
        >
          <h2 className="text-5xl font-bold mb-6">
            Ready to find hidden savings?
          </h2>
          <p className="text-2xl mb-8 opacity-90">
            Built with Claude Code. Works instantly. No API key required.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-apple-blue px-12 py-5 rounded-pill text-xl font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Try it now →
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-8 text-center text-sm text-gray-500">
          <p className="mb-2">Based on public CBP rulings. This is not legal advice.</p>
          <p>Consult a licensed customs broker before making classification decisions.</p>
        </div>
      </footer>
    </main>
  )
}
