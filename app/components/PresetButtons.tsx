'use client'

import presets from '@/app/data/presets.json'

interface PresetButtonsProps {
  onSelect: (preset: typeof presets[0]) => void
}

export default function PresetButtons({ onSelect }: PresetButtonsProps) {
  return (
    <div className="preset-buttons-container" style={{ marginBottom: '1.5rem' }}>
      <div style={{
        fontSize: '0.7rem',
        color: 'var(--color-muted)',
        marginBottom: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        QUICK_RUN // FAMOUS_HACKS ({presets.length} SCENARIOS):
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem'
      }}>
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className="preset-button"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              padding: '0.75rem 1rem',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-text)'
              e.currentTarget.style.color = 'var(--color-bg)'
              e.currentTarget.style.borderColor = 'var(--color-text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--color-text)'
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  )
}
