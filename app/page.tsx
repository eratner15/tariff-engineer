'use client'

import { useState, useEffect } from 'react'
import Terminal from '@/app/components/Terminal'
import PresetButtons from '@/app/components/PresetButtons'
import ScanAnimation, { ScanMessage } from '@/app/components/ScanAnimation'
import Receipt from '@/app/components/Receipt'
import ThemeToggle from '@/components/ThemeToggle'
import presets from '@/app/data/presets.json'
import { generateScanMessages, generateGenericScanMessages } from '@/app/lib/scanMessages'

type AuditState =
  | { status: 'idle' }
  | { status: 'scanning', messages: ScanMessage[] }
  | { status: 'complete', preset: typeof presets[0] | null, input: string }

export default function Home() {
  const [input, setInput] = useState('')
  const [auditState, setAuditState] = useState<AuditState>({ status: 'idle' })
  const [selectedPreset, setSelectedPreset] = useState<typeof presets[0] | null>(null)
  const [productsAnalyzed, setProductsAnalyzed] = useState(0)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setProductsAnalyzed(data.totalSearches || 0))
      .catch(() => setProductsAnalyzed(0))
  }, [])

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setSelectedPreset(preset)
    setInput(preset.input)
  }

  const handleSubmit = () => {
    if (!input.trim()) return

    // Determine if this is a preset or user input
    const matchedPreset = presets.find(p => p.input.toLowerCase() === input.toLowerCase())
    const messages = matchedPreset
      ? generateScanMessages(matchedPreset)
      : generateGenericScanMessages(input)

    setSelectedPreset(matchedPreset || null)
    setAuditState({ status: 'scanning', messages })
  }

  const handleScanComplete = () => {
    setAuditState({ status: 'complete', preset: selectedPreset, input })
  }

  const handleNewAudit = () => {
    setInput('')
    setSelectedPreset(null)
    setAuditState({ status: 'idle' })
  }

  // Render different views based on state
  if (auditState.status === 'scanning') {
    return <ScanAnimation messages={auditState.messages} onComplete={handleScanComplete} />
  }

  if (auditState.status === 'complete') {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <Receipt
          preset={selectedPreset}
          input={auditState.input}
          onNewAudit={handleNewAudit}
        />
      </main>
    )
  }

  // Idle state - show terminal interface
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* HEADER */}
      <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-4 grid grid-cols-3 gap-4">
          <div className="grid-cell border-0">
            <div className="text-xs" style={{ color: 'var(--color-muted)' }}>SYSTEM</div>
            <div className="font-bold text-sm">TARIFF_AUDIT_TERMINAL</div>
          </div>
          <div className="grid-cell border-0">
            <div className="text-xs" style={{ color: 'var(--color-muted)' }}>DATABASE</div>
            <div className="font-bold text-sm">{productsAnalyzed > 0 ? `${productsAnalyzed.toLocaleString()}_AUDITS` : 'ONLINE'}</div>
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
            PROTOCOL_VERSION: 2.0.0 // TERMINAL_MODE
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            🐀 TARIFF AUDIT<br/>TERMINAL
          </h1>
          <p className="text-base md:text-lg max-w-3xl" style={{ color: 'var(--color-muted)', textTransform: 'none' }}>
            Scan 10,000+ CBP Rulings. Find the loopholes. Print the receipt.<br/>
            The difference between 37.5% and 7.5% is one design change.
          </p>
        </div>

        {/* PRESET BUTTONS */}
        <PresetButtons onSelect={handlePresetSelect} />

        {/* TERMINAL INPUT */}
        <div className="mb-12">
          <Terminal
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            placeholder="Type product description or select a preset above..."
            ghostText={input === '' ? '(e.g., running shoe with rubber sole)' : undefined}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
              [{input.length}/500 CHARS]
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="btn-primary"
              style={{
                padding: '0.75rem 1.5rem',
                opacity: !input.trim() ? 0.3 : 1
              }}
            >
              [ EXECUTE AUDIT ]
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="border-t border-b py-12" style={{ borderColor: 'var(--color-border)' }}>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="stat-label">EXPLOIT_EXAMPLE</div>
              <div className="stat-value" style={{ color: 'var(--color-negative)', fontSize: '1.5rem' }}>37.5%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>→</div>
              <div className="stat-value" style={{ color: 'var(--color-positive)', fontSize: '1.5rem' }}>7.5%</div>
              <div className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                +51% FELT_TO_SOLE
              </div>
            </div>
            <div>
              <div className="stat-label">DATABASE_SIZE</div>
              <div className="stat-value">10,847</div>
              <div className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                CBP_RULINGS_INDEXED
              </div>
            </div>
            <div>
              <div className="stat-label">SCAN_TIME</div>
              <div className="stat-value">1.9s</div>
              <div className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                AVG_AUDIT_DURATION
              </div>
            </div>
          </div>
        </div>

        {/* SYSTEM OPERATIONS */}
        <div className="py-16">
          <div className="text-xs mb-6" style={{ color: 'var(--color-muted)' }}>
            PROCESS_FLOW:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                [01] DATABASE_SCAN
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
                PARSE_PRODUCT_SPECS<br/>
                QUERY_10K_CBP_PRECEDENTS<br/>
                MATCH_ENGINEERING_VECTORS
              </div>
            </div>

            <div>
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                [02] EXPLOIT_IDENTIFICATION
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
                ANALYZE_HTS_CLASSIFICATION<br/>
                FIND_LEGAL_MODIFICATIONS<br/>
                EXTRACT_DUTY_DELTA
              </div>
            </div>

            <div>
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                [03] RECEIPT_GENERATION
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
                CALCULATE_SAVINGS_PROJECTION<br/>
                CITE_SUPPORTING_RULINGS<br/>
                PRINT_AUDIT_REPORT
              </div>
            </div>
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
            DISCLAIMER: NOT_LEGAL_ADVICE // EDUCATIONAL_ONLY
          </div>
        </div>
      </footer>
    </main>
  )
}
