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
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
        animation: 'printReceipt 1s ease-out forwards'
      }}
    >
      <div style={{
        border: '2px solid var(--color-border)',
        padding: '2rem',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        color: 'var(--color-text)',
        backgroundColor: 'var(--color-card-bg)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            🐀 TARIFF AUDIT TERMINAL 🐀
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
            CLASSIFICATION RECEIPT
          </div>
        </div>

        {/* Metadata */}
        <div style={{ marginBottom: '2rem', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          <div>DATE: {timestamp}</div>
          <div>AUDIT ID: {auditId}</div>
        </div>

        {/* Item */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>ITEM ANALYZED:</div>
          <div style={{ paddingLeft: '1rem' }}>&gt; {preset.input}</div>
        </div>

        {/* Original Classification */}
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--color-negative)', backgroundColor: 'rgba(255, 0, 0, 0.05)' }}>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>ORIGINAL CLASSIFICATION:</div>
          <div>HTS: {preset.current.hts}</div>
          <div>DUTY: {preset.current.rate} <span style={{ color: 'var(--color-negative)' }}>❌ REJECTED</span></div>
        </div>

        {/* Opportunity Banner */}
        <div style={{
          backgroundColor: 'var(--color-positive)',
          color: 'var(--color-bg)',
          padding: '0.75rem',
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          ██ TARIFF ENGINEERING OPPORTUNITY ██
        </div>

        {/* Modification */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>MODIFICATION:</div>
          <div style={{ paddingLeft: '1rem' }}>&gt; {preset.hack.modification}</div>
        </div>

        {/* New Classification */}
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--color-positive)', backgroundColor: 'rgba(0, 255, 0, 0.05)' }}>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>NEW CLASSIFICATION:</div>
          <div>HTS: {preset.hack.newHts}</div>
          <div>DUTY: {preset.hack.newRate} <span style={{ color: 'var(--color-positive)' }}>✅ APPROVED</span></div>
        </div>

        {/* Precedent */}
        <div style={{ marginBottom: '2rem', fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--color-muted)', marginBottom: '0.25rem' }}>PRECEDENT: {preset.hack.ruling}</div>
          <div style={{ paddingLeft: '1rem' }}>
            <a href={preset.hack.rulingUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              └─→ {preset.hack.rulingUrl}
            </a>
          </div>
        </div>

        {/* Savings Box */}
        <div style={{
          border: '2px solid var(--color-positive)',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>SAVINGS UNLOCKED</div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--color-muted)' }}>PER UNIT:</span>{' '}
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{preset.perUnit}</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--color-muted)' }}>AT SCALE:</span>{' '}
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-positive)' }}>{preset.atScale}</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-muted)' }}>DUTY REDUCTION:</span>{' '}
            <span style={{ fontWeight: 'bold' }}>{preset.hack.savings}</span>
          </div>
        </div>

        {/* Implementation Roadmap */}
        {preset.implementation && (
          <div style={{
            borderTop: '2px solid var(--color-border)',
            paddingTop: '2rem',
            marginTop: '2rem'
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'var(--color-accent)'
            }}>
              📋 IMPLEMENTATION ROADMAP:
            </div>
            {preset.implementation.steps.map((step, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: 'var(--color-text)'
                }}>
                  [{idx + 1}] {step.title}
                </div>
                <div style={{ paddingLeft: '1.5rem' }}>
                  {step.details.map((detail, detailIdx) => (
                    <div key={detailIdx} style={{
                      fontSize: '0.7rem',
                      color: 'var(--color-muted)',
                      marginBottom: '0.25rem'
                    }}>
                      ↳ {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {preset.implementation.netSavings && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(0, 255, 0, 0.05)',
                border: '1px solid var(--color-positive)',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                NET SAVINGS: {preset.implementation.netSavings}
              </div>
            )}
          </div>
        )}

        {/* Real-World Application */}
        {preset.realWorld && (
          <div style={{
            borderTop: '2px solid var(--color-border)',
            paddingTop: '2rem',
            marginTop: '2rem'
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'var(--color-accent)'
            }}>
              💼 REAL-WORLD APPLICATION:
            </div>
            <div style={{
              fontSize: '0.75rem',
              lineHeight: '1.6',
              color: 'var(--color-text)',
              marginBottom: '1rem'
            }}>
              {preset.realWorld.application}
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              fontSize: '0.7rem',
              marginBottom: '1rem'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-muted)' }}>INDUSTRY IMPACT:</span>{' '}
                <span style={{ color: 'var(--color-text)' }}>{preset.realWorld.industryImpact}</span>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-muted)' }}>SOURCE:</span>{' '}
                <span style={{ color: 'var(--color-text)' }}>{preset.realWorld.source}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)' }}>LEGITIMACY:</span>{' '}
                <span style={{ color: 'var(--color-text)' }}>{preset.realWorld.legitimacy}</span>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1rem',
          marginTop: '2rem',
          fontSize: '0.7rem',
          color: 'var(--color-muted)',
          textAlign: 'center'
        }}>
          ⚠️  DISCLAIMER: Educational purposes only. Consult a licensed customs broker.
        </div>
      </div>

      {preset.note && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          border: '1px solid var(--color-warning)',
          color: 'var(--color-warning)',
          fontSize: '0.75rem',
          textAlign: 'center',
          fontFamily: 'monospace'
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
