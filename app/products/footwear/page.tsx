import Link from 'next/link'
import rulings from '@/data/rulings.json'

export default function FootwearCategoryPage() {
  const footwearRulings = rulings.filter(r => r.category === 'Footwear')

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="border-b py-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-[880px] mx-auto px-6 flex justify-between items-center">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>Product Category</p>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
              Footwear Tariff Engineering
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
            The footwear industry's hidden opportunity
          </h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>
            Footwear faces some of the highest tariff rates in the U.S. — often 37.5% or more. But small changes in materials, construction, or design can drop rates to 7.5% or even free. The difference between profitability and failure often comes down to understanding tariff engineering.
          </p>
        </section>

        {/* Common HTS Codes */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Common Footwear HTS Codes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-mono font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                6402.91.50
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                Rubber/plastic sole and upper, covering ankle
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-negative)' }}>
                37.5%
              </p>
            </div>

            <div className="card">
              <h3 className="font-mono font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                6404.19.90
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                Textile upper with rubber/plastic sole
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-positive)' }}>
                7.5%
              </p>
            </div>

            <div className="card">
              <h3 className="font-mono font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                6403.51.60
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                Leather upper covering ankle
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-accent)' }}>
                8.5%
              </p>
            </div>

            <div className="card">
              <h3 className="font-mono font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                6406.10.65
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                Footwear parts (insoles, uppers)
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--color-positive)' }}>
                6%
              </p>
            </div>
          </div>
        </section>

        {/* Top Strategies */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Top 3 Engineering Strategies
          </h2>

          <div className="space-y-6">
            <div className="card" style={{ borderLeft: '4px solid var(--color-positive)' }}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                1. Add Felt Lining
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>
                By adding a felt lining that constitutes 50% or more of the interior surface, athletic shoes can shift from 6402.91.50 (37.5%) to 6404.19.90 (7.5%). This single modification saves $3.00+ per pair.
              </p>
              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: '#f5f5f7' }}>
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  <strong>Supporting Ruling:</strong> N301245
                </span>
                <Link
                  href="/rulings/N301245"
                  style={{ color: 'var(--color-accent)' }}
                  className="text-sm font-medium"
                >
                  View ruling ↗
                </Link>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-positive)' }}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                2. Use Leather Uppers
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>
                Shifting from synthetic to leather uppers (even partial leather) can reduce duty rates from 37.5% to 8.5%. The key is ensuring leather constitutes the majority by weight of the upper material.
              </p>
              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: '#f5f5f7' }}>
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  <strong>Supporting Ruling:</strong> N309124
                </span>
                <Link
                  href="/rulings/N309124"
                  style={{ color: 'var(--color-accent)' }}
                  className="text-sm font-medium"
                >
                  View ruling ↗
                </Link>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-positive)' }}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                3. Import as Parts
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>
                Importing uppers and soles separately (for final assembly domestically) can qualify for 6406.10.65 at 6% duty instead of 37.5% for completed shoes. This strategy requires domestic assembly capabilities.
              </p>
              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: '#f5f5f7' }}>
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  <strong>Supporting Ruling:</strong> N304987
                </span>
                <Link
                  href="/rulings/N304987"
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
            {footwearRulings.map(ruling => (
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
                  <p className="text-xl font-semibold" style={{ color: 'var(--color-negative)' }}>
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
            Analyze your footwear product
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--color-muted)' }}>
            Get personalized tariff engineering recommendations based on your specific product.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Start analysis
          </Link>
        </div>
      </div>
    </main>
  )
}
