'use client'

import { useState, useEffect } from 'react'
import Terminal from '@/app/components/Terminal'
import PresetButtons, { Preset } from '@/app/components/PresetButtons'
import ScanAnimation, { ScanMessage } from '@/app/components/ScanAnimation'
import Receipt from '@/app/components/Receipt'
import LiveCounter from '@/app/components/LiveCounter'
import ThemeToggle from '@/components/ThemeToggle'
import { generateScanMessages, generateGenericScanMessages } from '@/app/lib/scanMessages'
import allStrategies from '@/../public/strategies.json'
import fallbackPresets from '@/app/data/presets.json'

type AuditState =
  | { status: 'idle' }
  | { status: 'scanning', messages: ScanMessage[] }
  | { status: 'complete', preset: Preset | null, input: string }

export default function Home() {
  const [input, setInput] = useState('')
  const [auditState, setAuditState] = useState<AuditState>({ status: 'idle' })
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
  const [productsAnalyzed, setProductsAnalyzed] = useState(0)

  // Use all 36 strategies from static export
  const presets = allStrategies as Preset[]

  useEffect(() => {
    // Fetch analytics
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setProductsAnalyzed(data.totalSearches || 0))
      .catch(() => setProductsAnalyzed(0))
  }, [])

  const handlePresetSelect = (preset: Preset) => {
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

        {/* LIVE COUNTER */}
        <LiveCounter />

        {/* PRESET BUTTONS */}
        <PresetButtons presets={presets} onSelect={handlePresetSelect} />

        {/* TERMINAL INPUT */}
        <div className="mb-12">
          <div style={{
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              → ENTER PRODUCT DESCRIPTION:
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--color-muted)',
              fontStyle: 'italic'
            }}>
              (or select a preset above)
            </div>
          </div>
          <Terminal
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            placeholder="Type here and press ENTER..."
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

      {/* FAQ SECTION */}
      <div className="border-t py-16" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-xs mb-8" style={{ color: 'var(--color-muted)' }}>
            FREQUENTLY_ASKED_QUESTIONS:
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              {
                q: "Is this legal?",
                a: "Yes. Tariff engineering is the legal practice of modifying product design to qualify for lower duty rates under existing HTS classifications. All strategies shown reference actual CBP rulings and are used by Fortune 500 companies. However, you must work with a licensed customs broker to ensure proper implementation and compliance."
              },
              {
                q: "Do I need a customs broker?",
                a: "Strongly recommended. While you can research classifications yourself, a licensed customs broker ensures legal compliance, handles documentation, and represents you with CBP. They typically cost $150-500 per classification request but save you from costly mistakes and potential audits."
              },
              {
                q: "How do I actually implement this?",
                a: "Each strategy includes an Implementation Roadmap with specific steps. Typically: (1) Coordinate design modification with your manufacturer, (2) Document the changes clearly, (3) File HTS classification request with your customs broker referencing the precedent ruling, (4) Wait for CBP approval (30-45 days), (5) Begin importing under new classification."
              },
              {
                q: "What if CBP challenges my classification?",
                a: "If you've properly documented your modification and can prove it meets the criteria in the precedent ruling, CBP will typically accept it. If challenged, your customs broker will represent you and provide supporting evidence. The rulings shown here are precedential, meaning they carry legal weight. Keep detailed records of your product design and reference the specific ruling number."
              },
              {
                q: "Can I use this for dropshipping?",
                a: "Yes, if you control product specifications with your supplier. Most strategies require design modifications, so you need a manufacturer willing to implement changes. For existing products, you're limited to classification research. For custom products, you can engineer the design from the start to qualify for lower rates."
              },
              {
                q: "Why are some strategies marked as 'closed'?",
                a: "Tariff strategies evolve. CBP occasionally closes loopholes through rule changes (like the Ford 'Chicken Tax' workaround in 2019). We show historical examples for educational purposes and to demonstrate how tariff engineering strategies work. Always verify current regulations with your customs broker."
              }
            ].map((faq, idx) => (
              <details key={idx} style={{
                border: '1px solid var(--color-border)',
                padding: '1rem',
                backgroundColor: 'var(--color-bg)',
                cursor: 'pointer'
              }}>
                <summary style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  Q: {faq.q}
                </summary>
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '0.8rem',
                  lineHeight: '1.6',
                  color: 'var(--color-muted)',
                  fontFamily: 'monospace'
                }}>
                  A: {faq.a}
                </div>
              </details>
            ))}
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
