'use client'

import { useState } from 'react'

interface EmailCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
}

export default function EmailCaptureModal({ isOpen, onClose, onSubmit }: EmailCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Store email
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, timestamp: Date.now() })
      })

      onSubmit(email)
    } catch (error) {
      console.error('Email capture error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleSkip}
    >
      <div
        className="card max-w-md w-full"
        style={{ maxWidth: '450px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-3xl font-semibold mb-3 text-center"
          style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}
        >
          Get your full analysis
        </h2>

        <p
          className="text-center mb-8"
          style={{ color: 'var(--color-muted)' }}
        >
          Enter your email to receive a detailed PDF report with all tariff engineering recommendations.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-field mb-4"
            disabled={isSubmitting}
            autoFocus
          />

          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="btn-primary w-full mb-4"
          >
            {isSubmitting ? 'Processing...' : 'Send my report'}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full text-center text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            Skip for now
          </button>
        </form>

        <p
          className="text-xs text-center mt-6"
          style={{ color: 'var(--color-muted)' }}
        >
          We'll only use your email to send the report and occasional tariff engineering insights. No spam.
        </p>
      </div>
    </div>
  )
}
