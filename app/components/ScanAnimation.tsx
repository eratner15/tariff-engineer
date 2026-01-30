'use client'

import { useState, useEffect } from 'react'

export interface ScanMessage {
  text: string
  delay: number
  highlight?: boolean
  final?: boolean
}

interface ScanAnimationProps {
  messages: ScanMessage[]
  onComplete: () => void
}

export default function ScanAnimation({ messages, onComplete }: ScanAnimationProps) {
  const [visibleMessages, setVisibleMessages] = useState<ScanMessage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex >= messages.length) {
      // Animation complete
      const timer = setTimeout(() => {
        onComplete()
      }, 300)
      return () => clearTimeout(timer)
    }

    const message = messages[currentIndex]
    const timer = setTimeout(() => {
      setVisibleMessages(prev => [...prev, message])
      setCurrentIndex(prev => prev + 1)
    }, message.delay)

    return () => clearTimeout(timer)
  }, [currentIndex, messages, onComplete])

  return (
    <div
      className="scan-animation-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 10, 10, 0.98)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div
        className="scan-log"
        style={{
          maxWidth: '800px',
          width: '100%',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          lineHeight: '1.8'
        }}
      >
        {visibleMessages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              color: msg.highlight ? '#00ff00' : msg.final ? 'var(--color-text)' : 'var(--color-muted)',
              fontWeight: msg.highlight || msg.final ? 700 : 400,
              marginBottom: '0.5rem',
              animation: 'fadeIn 0.15s ease-out',
              textShadow: msg.highlight ? '0 0 10px rgba(0, 255, 0, 0.5)' : 'none'
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
