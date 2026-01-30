'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'

interface TerminalProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  ghostText?: string
}

export default function Terminal({ value, onChange, onSubmit, placeholder, ghostText }: TerminalProps) {
  const [showCursor, setShowCursor] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // Blinking cursor animation (530ms interval)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className="terminal-container"
      onClick={handleClick}
      style={{
        border: '3px solid var(--color-accent)',
        padding: '1.5rem',
        backgroundColor: '#000000',
        fontFamily: 'monospace',
        cursor: 'text',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="terminal-prompt" style={{
        color: 'var(--color-accent)',
        marginBottom: '0.75rem',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        letterSpacing: '0.05em'
      }}>
        ROOT@CROSS-DATABASE:~$
      </div>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || ''}
          className="terminal-input"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontFamily: 'monospace',
            fontSize: '1rem',
            fontWeight: '500',
            padding: 0,
          }}
          autoComplete="off"
          spellCheck="false"
        />
        {ghostText && !value && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: 'var(--color-muted)',
              opacity: 0.4,
              pointerEvents: 'none',
              fontFamily: 'monospace',
              fontSize: '0.95rem'
            }}
          >
            {ghostText}
          </div>
        )}
        {value && (
          <span
            className="cursor"
            style={{
              display: 'inline-block',
              width: '8px',
              height: '18px',
              backgroundColor: 'var(--color-text)',
              marginLeft: '2px',
              opacity: showCursor ? 1 : 0,
              transition: 'none'
            }}
          />
        )}
      </div>
    </div>
  )
}
