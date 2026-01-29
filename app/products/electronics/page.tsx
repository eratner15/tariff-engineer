import Link from 'next/link'
import rulings from '@/data/rulings.json'

export default function ElectronicsCategoryPage() {
  const electronicsRulings = rulings.filter(r => r.category === 'Electronics')

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="border-b py-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-[880px] mx-auto px-6 flex justify-between items-center">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>Product Category</p>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
              Electronics Tariff Engineering
            </h1>
          </div>
          <Link href="/" style={{ color: 'var(--color-accent)' }} className="font-medium text-sm">
            ← Home
          </Link>
        </div>
      </div>

      <div className="max-w-[880px] mx-auto px-6 py-12">
        {/* Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Many electronics qualify for duty-free treatment
          </h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>
            Unlike footwear and apparel, many electronics categories have preferential duty treatment — often duty-free. The key is understanding how CBP classifies your device: is it a computer, a telecommunications device, a consumer electronic, or something else? Small functional differences can mean the difference between free and 6% duty.
          </p>
        </section>

        {/* Common HTS Codes */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Common Electronics HTS Codes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-mono font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                8517.62.00
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                Telecommunications equipment
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-positive)' }}>
                Free
              </p>
            </div>

            <div className="card">
              <h3 className="font-mono font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                8471.30.01
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                Portable data processing machines
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-positive)' }}>
                Free
              </p>
            </div>

            <div className="card">
              <h3 className="font-mono font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                8518.30.20
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                Headphones and earphones
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-positive)' }}>
                Free
              </p>
            </div>

            <div className="card">
              <h3 className="font-mono font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                9102.11.10
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                Wristwatches (including smartwatches)
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-accent)' }}>
                6.25% + $1.61/unit
              </p>
            </div>
          </div>
        </section>

        {/* Top Strategies */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Key Classification Strategies
          </h2>

          <div className="space-y-6">
            <div className="card" style={{ borderLeft: '4px solid var(--color-positive)' }}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                1. Emphasize Telecommunication Features
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>
                Smartwatches and wearables can qualify for duty-free treatment under 8517.62.00 if their principal function is telecommunication (cellular calling, text messaging). Even if the device also tracks fitness or tells time, emphasizing the cellular capability in product documentation can support this classification.
              </p>
              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: '#f5f5f7' }}>
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  <strong>Supporting Ruling:</strong> N308472
                </span>
                <Link
                  href="/rulings/N308472"
                  style={{ color: 'var(--color-accent)' }}
                  className="text-sm font-medium"
                >
                  View ruling ↗
                </Link>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-positive)' }}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                2. Data Processing vs. Consumer Electronics
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>
                Devices that process data (especially portable machines under 10kg) often qualify for duty-free treatment under 8471.30.01. The key is demonstrating that data processing is the principal function, not entertainment or simple display.
              </p>
              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: '#f5f5f7' }}>
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  <strong>Supporting Ruling:</strong> N308891
                </span>
                <Link
                  href="/rulings/N308891"
                  style={{ color: 'var(--color-accent)' }}
                  className="text-sm font-medium"
                >
                  View ruling ↗
                </Link>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                3. Wristwatch Classification Trap
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>
                If a smartwatch is classified primarily as a watch (9102.11.10) rather than a telecommunications device, it faces 6.25% duty plus $1.61 per unit. This happens when CBP determines timekeeping is the principal function despite other features. Avoid this by emphasizing non-watch functionalities.
              </p>
              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: '#f5f5f7' }}>
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  <strong>Supporting Ruling:</strong> N307856
                </span>
                <Link
                  href="/rulings/N307856"
                  style={{ color: 'var(--color-accent)' }}
                  className="text-sm font-medium"
                >
                  View ruling ↗
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Real Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Real CBP Rulings
          </h2>
          <div className="space-y-4">
            {electronicsRulings.map(ruling => (
              <Link
                key={ruling.id}
                href={`/rulings/${ruling.id}`}
                className="card flex justify-between items-center"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex-1">
                  <h3 className="font-mono font-semibold mb-2" style={{ color: 'var(--color-accent)' }}>
                    {ruling.id}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    {ruling.productDescription.substring(0, 100)}...
                  </p>
                </div>
                <div className="text-right ml-6">
                  <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>Duty Rate</p>
                  <p className="text-xl font-semibold" style={{
                    color: ruling.dutyRate === 'Free' ? 'var(--color-positive)' : 'var(--color-accent)'
                  }}>
                    {ruling.dutyRate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="card text-center py-12" style={{ background: 'linear-gradient(to bottom right, #f5f5f7, var(--color-card-bg))' }}>
          <h2 className="text-3xl font-semibold mb-4" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Analyze your electronics product
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--color-muted)' }}>
            Get personalized classification guidance and tariff engineering strategies.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Start analysis
          </Link>
        </div>
      </div>
    </main>
  )
}
