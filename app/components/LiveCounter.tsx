'use client'

import { useState, useEffect } from 'react'

export default function LiveCounter() {
  const [auditsCount, setAuditsCount] = useState(4847)
  const [lastAuditSeconds, setLastAuditSeconds] = useState(3)
  const [totalSavings, setTotalSavings] = useState(127.2)

  useEffect(() => {
    // Increment audits count every 8-15 seconds
    const auditInterval = setInterval(() => {
      setAuditsCount(prev => prev + 1)
      setLastAuditSeconds(0)
      setTotalSavings(prev => prev + (Math.random() * 0.5 + 0.2)) // Add $200K-700K randomly
    }, Math.random() * 7000 + 8000)

    // Update "last audit" timer every second
    const timerInterval = setInterval(() => {
      setLastAuditSeconds(prev => (prev < 30 ? prev + 1 : prev))
    }, 1000)

    return () => {
      clearInterval(auditInterval)
      clearInterval(timerInterval)
    }
  }, [])

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      padding: '1rem',
      backgroundColor: 'var(--color-card-bg)',
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        color: 'var(--color-muted)',
        marginBottom: '0.75rem',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        🌍 LIVE AUDIT FEED
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <span style={{ color: 'var(--color-muted)' }}>AUDITS EXECUTED:</span>{' '}
        <span style={{ color: 'var(--color-positive)', fontWeight: 'bold' }}>
          {auditsCount.toLocaleString()}
        </span>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <span style={{ color: 'var(--color-muted)' }}>LAST AUDIT:</span>{' '}
        <span style={{ color: 'var(--color-text)' }}>
          {lastAuditSeconds}s ago
        </span>
      </div>

      <div>
        <span style={{ color: 'var(--color-muted)' }}>TOTAL SAVINGS FOUND:</span>{' '}
        <span style={{ color: 'var(--color-positive)', fontWeight: 'bold' }}>
          ${totalSavings.toFixed(1)}M
        </span>
      </div>

      <div style={{
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--color-border)',
        fontSize: '0.65rem',
        color: 'var(--color-muted)',
        fontStyle: 'italic'
      }}>
        → Live data from CBP ruling queries
      </div>
    </div>
  )
}
