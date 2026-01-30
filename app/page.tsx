'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import EmailCaptureModal from '@/components/EmailCaptureModal'
import ThemeToggle from '@/components/ThemeToggle'

const CASE_FILES = [
  {
    id: 'CASE_6404.11',
    category: 'FOOTWEAR',
    status: 'OPTIMIZED',
    strategy: 'TEXTILE_SOLE_APPLICATION',
    dutyDelta: '-31.5%',
    description: 'Running shoe with rubber outer sole and synthetic upper, contains embedded fitness tracker, manufactured in Vietnam'
  },
  {
    id: 'CASE_8517.62',
    category: 'ELECTRONICS',
    status: 'WARNING',
    strategy: 'MODULE_DECOUPLING',
    rulingRef: 'NY_N31244',
    description: 'Wireless earbuds with charging case, Bluetooth 5.0, silicone ear tips, USB-C charging port'
  },
  {
    id: 'CASE_4202.92',
    category: 'BAGS',
    status: 'REVIEWED',
    strategy: 'MATERIAL_SUBSTITUTION',
    dutyDelta: '-9.6%',
    description: 'Laptop backpack with padded compartment, water-resistant polyester exterior, leather trim accents'
  },
  {
    id: 'CASE_9102.11',
    category: 'WEARABLES',
    status: 'OPTIMIZED',
    strategy: 'FUNCTION_RECLASSIFICATION',
    dutyDelta: 'FREE',
    description: 'Smartwatch with heart rate monitor, GPS, OLED display, silicone band, waterproof to 50m'
  }
]

const RULING_IDS = ['NY_N29384', 'HQ_H29384', 'NY_N38472', 'NY_N305891', 'HQ_H301245', 'NY_N308472', 'NY_N307856', 'HQ_H304521', 'NY_N302789', 'NY_N306234']

export default function Home() {
  const [description, setDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [productsAnalyzed, setProductsAnalyzed] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setProductsAnalyzed(data.totalSearches || 0))
      .catch(() => setProductsAnalyzed(0))
  }, [])

  const handleAnalyze = async () => {
    if (!description.trim()) return
    sessionStorage.setItem('productDescription', description)
    setShowEmailModal(true)
  }

  const handleEmailSubmit = (email: string) => {
    console.log('Email captured:', email)
    setShowEmailModal(false)
    setIsAnalyzing(true)
    setTimeout(() => {
      router.push('/results')
    }, 300)
  }

  const handleEmailSkip = () => {
    setShowEmailModal(false)
    setIsAnalyzing(true)
    setTimeout(() => {
      router.push('/results')
    }, 300)
  }

  const handleExampleClick = (caseFile: typeof CASE_FILES[0]) => {
    setDescription(caseFile.description)
  }

  return (
    <>
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={handleEmailSkip}
        onSubmit={handleEmailSubmit}
      />

      <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* DATA TICKER */}
        <div className="ticker">
          <div className="ticker-content">
            {[...RULING_IDS, ...RULING_IDS].map((id, idx) => (
              <span key={idx} className="mx-8">
                RULING_ID: {id} // STATUS: INDEXED
              </span>
            ))}
          </div>
        </div>

        {/* HEADER / SYSTEM INFO */}
        <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-[1200px] mx-auto px-6 py-4 grid grid-cols-3 gap-4">
            <div className="grid-cell border-0">
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>SYSTEM</div>
              <div className="font-bold text-sm">RAT_LINKS // BUILD</div>
            </div>
            <div className="grid-cell border-0">
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>DATABASE</div>
              <div className="font-bold text-sm">{productsAnalyzed > 0 ? `${productsAnalyzed.toLocaleString()}_QUERIES` : 'ONLINE'}</div>
            </div>
            <div className="grid-cell border-0">
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>STATUS</div>
              <div className="font-bold text-sm" style={{ color: 'var(--color-positive)' }}>OPERATIONAL</div>
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          {/* MAIN HEADLINE */}
          <div className="mb-12 border-l-4 pl-6" style={{ borderColor: 'var(--color-accent)' }}>
            <div className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>
              PROTOCOL_VERSION: 1.0.0
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              DUTY_OPTIMIZATION<br/>PROTOCOL // V1
            </h1>
            <p className="text-base md:text-lg max-w-3xl" style={{ color: 'var(--color-muted)', textTransform: 'none' }}>
              Index 10,000+ Customs Rulings. Exploit the 'De Minimis' collapse.<br/>
              Automate HTS Classification.
            </p>
          </div>

          {/* TERMINAL INPUT */}
          <div className="mb-12 border-2 p-6" style={{ borderColor: 'var(--color-accent)', backgroundColor: 'var(--color-card-bg)' }}>
            <div className="mb-4">
              <div className="text-xs mb-2" style={{ color: 'var(--color-accent)' }}>SYSTEM_PROMPT:</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="> Enter product specs (e.g., 'Men's Knit Cotton Shirt, >10 stitches/cm')..."
                className="w-full bg-transparent border-0 outline-none resize-none font-mono text-sm"
                style={{ color: 'var(--color-text)', minHeight: '100px' }}
                rows={4}
              />
            </div>
            <div className="flex justify-between items-center border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                [{description.length}/1000 CHARS]
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!description.trim() || isAnalyzing}
                className="btn-primary"
              >
                {isAnalyzing ? '[PROCESSING...]' : '[RUN_AUDIT]'}
              </button>
            </div>
          </div>

          {/* CASE FILE EXAMPLES */}
          <div>
            <div className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
              REFERENCE_CASES // SELECT_TO_LOAD:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CASE_FILES.map((caseFile) => (
                <button
                  key={caseFile.id}
                  onClick={() => handleExampleClick(caseFile)}
                  className="log-entry text-left snap-transition"
                >
                  <div className="flex justify-between mb-2">
                    <span style={{ color: 'var(--color-accent)' }}>{caseFile.id}</span>
                    <span style={{ color: caseFile.status === 'OPTIMIZED' ? 'var(--color-positive)' : caseFile.status === 'WARNING' ? 'var(--color-warning)' : 'var(--color-text)' }}>
                      [{caseFile.status}]
                    </span>
                  </div>
                  <div className="mb-1">
                    STRATEGY: <span style={{ color: 'var(--color-text)' }}>{caseFile.strategy}</span>
                  </div>
                  {caseFile.dutyDelta && (
                    <div className="mb-1">
                      DUTY_DELTA: <span style={{ color: 'var(--color-positive)' }}>{caseFile.dutyDelta}</span>
                    </div>
                  )}
                  {caseFile.rulingRef && (
                    <div>
                      RULING_REF: <span style={{ color: 'var(--color-accent)' }}>{caseFile.rulingRef}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="border-t border-b grid-layout" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-[1200px] mx-auto grid grid-cols-3">
            <div className="grid-cell">
              <div className="stat-label">DUTY_REDUCTION</div>
              <div className="stat-value" style={{ color: 'var(--color-negative)' }}>37.5%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>→</div>
              <div className="stat-value" style={{ color: 'var(--color-positive)' }}>7.5%</div>
              <div className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                FELT_SOLE_MOD
              </div>
            </div>
            <div className="grid-cell">
              <div className="stat-label">INDEX_SIZE</div>
              <div className="stat-value">10,000+</div>
              <div className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                PUBLIC_CBP_RULINGS
              </div>
            </div>
            <div className="grid-cell border-r-0">
              <div className="stat-label">PROCESSING_TIME</div>
              <div className="stat-value">120s</div>
              <div className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                AVG_QUERY_DURATION
              </div>
            </div>
          </div>
        </div>

        {/* SYSTEM OPERATIONS */}
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="text-xs mb-6" style={{ color: 'var(--color-muted)' }}>
            PROCESS_FLOW:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
                [01] INPUT_PARSING
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
                MATERIALS // COMPONENTS // INTENDED_USE<br/>
                AUTOMATED_COMPLEXITY_HANDLING
              </div>
            </div>

            <div>
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
                [02] PRECEDENT_ANALYSIS
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
                SCAN_10K_CBP_RULINGS<br/>
                IDENTIFY_LEGAL_ENGINEERING_OPS
              </div>
            </div>

            <div>
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
                [03] OUTPUT_GENERATION
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
                SPECIFIC_MODS // NEW_DUTY_RATES<br/>
                ROI_PROJECTIONS // SUPPORTING_RULINGS
              </div>
            </div>
          </div>
        </div>

        {/* SYSTEM ACCESS CTA */}
        <div className="border-t border-b py-12" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <div className="text-xs mb-3" style={{ color: 'var(--color-muted)' }}>
              SYSTEM_ACCESS // FULL_DATABASE
            </div>
            <div className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              REQUEST_ACCESS_KEY<br/>
              VIA NEWSLETTER_RESPONSE
            </div>
            <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
              🐀 RAT_LINKS // THE_BUILD
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t py-6" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center text-xs" style={{ color: 'var(--color-muted)' }}>
            <div>
              DATA_SOURCE: <a href="https://rulings.cbp.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>CBP_CROSS_RULINGS</a>
            </div>
            <div>
              DISCLAIMER: NOT_LEGAL_ADVICE
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
