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
        border: '1px solid var(--color-border)',
        padding: '1.5rem',
        backgroundColor: 'var(--color-card-bg)',
        fontFamily: 'monospace',
        cursor: 'text'
      }}
    >
      <div className="terminal-prompt" style={{ color: 'var(--color-muted)', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
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
            color: 'var(--color-text)',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
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
