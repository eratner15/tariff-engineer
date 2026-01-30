import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Tariff Audit Terminal - Find Duty Loopholes'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          fontFamily: 'monospace',
        }}
      >
        {/* Border frame */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: '4px solid #00ff00',
            borderRadius: '8px',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          {/* System label */}
          <div
            style={{
              fontSize: 24,
              color: '#666',
              marginBottom: 20,
              letterSpacing: '0.1em',
            }}
          >
            PROTOCOL_VERSION: 2.0.0
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: 30,
              lineHeight: 1.2,
            }}
          >
            🐀 TARIFF AUDIT
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: 40,
              lineHeight: 1.2,
            }}
          >
            TERMINAL
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: 28,
              color: '#00ff00',
              textAlign: 'center',
              marginBottom: 40,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Scan 10,000+ CBP Rulings. Find the loopholes.
          </div>

          {/* Example stat */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              fontSize: 36,
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#ff0000', fontSize: 48, fontWeight: 'bold' }}>37.5%</div>
              <div style={{ color: '#666', fontSize: 20 }}>BEFORE</div>
            </div>
            <div style={{ color: '#00ff00', fontSize: 60 }}>→</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#00ff00', fontSize: 48, fontWeight: 'bold' }}>7.5%</div>
              <div style={{ color: '#666', fontSize: 20 }}>AFTER</div>
            </div>
          </div>

          {/* Domain */}
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              fontSize: 20,
              color: '#666',
              letterSpacing: '0.05em',
            }}
          >
            tariffengineer.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
