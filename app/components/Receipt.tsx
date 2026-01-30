'use client'

import { useState } from 'react'
import presets from '@/app/data/presets.json'

interface ReceiptProps {
  preset: typeof presets[0] | null
  input: string
  onNewAudit: () => void
}

export default function Receipt({ preset, input, onNewAudit }: ReceiptProps) {
  const [showCopied, setShowCopied] = useState(false)

  if (!preset) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
          No preset match found. This would show generic analysis results.
        </p>
        <button onClick={onNewAudit} className="btn-primary">
          [ RUN NEW AUDIT ]
        </button>
      </div>
    )
  }

  const handleCopy = () => {
    const receiptText = `🐀 TARIFF AUDIT TERMINAL — RECEIPT

ITEM: ${preset.input}
DATE: ${new Date().toISOString().split('T')[0]}

ORIGINAL: HTS ${preset.current.hts} @ ${preset.current.rate} ❌
MODIFIED: HTS ${preset.hack.newHts} @ ${preset.hack.newRate} ✅

HACK: ${preset.hack.modification}
PRECEDENT: ${preset.hack.ruling}

SAVINGS: ${preset.perUnit}/unit | ${preset.atScale}

Try it → tariffengineer.vercel.app`

    navigator.clipboard.writeText(receiptText)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const handleShare = () => {
    const tweetText = `Just ran an audit on the CBP database 🐀

${preset.name}:
❌ ${preset.current.description}: ${preset.current.rate} tariff
✅ ${preset.hack.modification.substring(0, 80)}: ${preset.hack.newRate} tariff

Savings: ${preset.atScale}

This is real. Try it yourself:
tariffengineer.vercel.app`

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(url, '_blank')
  }

  const auditId = `#TE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'

  return (
    <div
      className="receipt-container"
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '2rem 1rem',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        lineHeight: '1.5',
        animation: 'printReceipt 1s ease-out forwards'
      }}
    >
      <pre style={{ margin: 0, color: 'var(--color-text)', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
{`╔══════════════════════════════════════════╗
║      🐀 TARIFF AUDIT TERMINAL 🐀          ║
║         CLASSIFICATION RECEIPT            ║
╠══════════════════════════════════════════╣
║ DATE: ${timestamp.padEnd(37)}║
║ AUDIT ID: ${auditId.padEnd(31)}║
╠══════════════════════════════════════════╣
║ ITEM ANALYZED:                           ║
║ > ${preset.input.substring(0, 38).padEnd(38)} ║${preset.input.length > 38 ? `
║   ${preset.input.substring(38, 76).padEnd(38)} ║` : ''}
╠══════════════════════════════════════════╣
║ ORIGINAL CLASSIFICATION:                 ║
║ HTS: ${preset.current.hts.padEnd(33)}║
║ DUTY: ${preset.current.rate.padEnd(26)} ❌ REJECTED     ║
╠══════════════════════════════════════════╣
║ ████████████████████████████████████████ ║
║ ██  TARIFF ENGINEERING OPPORTUNITY  ██   ║
║ ████████████████████████████████████████ ║
╠══════════════════════════════════════════╣
║ MODIFICATION:                            ║
║ > ${preset.hack.modification.substring(0, 38).padEnd(38)} ║${preset.hack.modification.length > 38 ? `
║   ${preset.hack.modification.substring(38, 76).padEnd(38)} ║` : ''}${preset.hack.modification.length > 76 ? `
║   ${preset.hack.modification.substring(76, 114).padEnd(38)} ║` : ''}
║                                          ║
║ NEW CLASSIFICATION:                      ║
║ HTS: ${preset.hack.newHts.substring(0, 33).padEnd(33)}║
║ DUTY: ${preset.hack.newRate.padEnd(25)} ✅ APPROVED     ║
╠══════════════════════════════════════════╣
║ PRECEDENT: ${preset.hack.ruling.padEnd(27)}║
║ └─→ ${preset.hack.rulingUrl.substring(0, 35).padEnd(35)} ║
╠══════════════════════════════════════════╣
║                                          ║
║  ┌────────────────────────────────────┐  ║
║  │  SAVINGS UNLOCKED                  │  ║
║  │                                    │  ║
║  │  PER UNIT:      ${preset.perUnit.padEnd(18)}│  ║
║  │  AT SCALE:      ${preset.atScale.padEnd(18)}│  ║
║  │                                    │  ║
║  │  DUTY REDUCTION: ${preset.hack.savings.padEnd(15)}│  ║
║  └────────────────────────────────────┘  ║
║                                          ║
╠══════════════════════════════════════════╣
║ ⚠️  DISCLAIMER: Educational purposes     ║
║ only. Consult a licensed customs broker. ║
╠══════════════════════════════════════════╣
╚══════════════════════════════════════════╝`}
      </pre>

      {preset.note && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          border: '1px solid var(--color-warning)',
          color: 'var(--color-warning)',
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          {preset.note}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleCopy}
          className="btn-secondary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem' }}
        >
          {showCopied ? '✓ COPIED' : '[ COPY RECEIPT ]'}
        </button>
        <button
          onClick={onNewAudit}
          className="btn-secondary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem' }}
        >
          [ RUN NEW AUDIT ]
        </button>
        <button
          onClick={handleShare}
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem' }}
        >
          [ SHARE ON X ]
        </button>
      </div>

      <style jsx>{`
        @keyframes printReceipt {
          from {
            clip-path: inset(0 0 100% 0);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }
      `}</style>
    </div>
  )
}
