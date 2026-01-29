import Link from 'next/link'
import rulings from '@/data/rulings.json'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return rulings.map((ruling) => ({
    id: ruling.id,
  }))
}

export default async function RulingDetailPage({ params }: PageProps) {
  const { id } = await params
  const ruling = rulings.find(r => r.id === id)

  if (!ruling) {
    notFound()
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="border-b py-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-[880px] mx-auto px-6 flex justify-between items-center">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>CBP Ruling</p>
            <h1 className="text-2xl font-semibold font-mono" style={{ color: 'var(--color-text)' }}>
              {ruling.id}
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/rulings" style={{ color: 'var(--color-accent)' }} className="font-medium text-sm">
              ← All rulings
            </Link>
            <Link href="/" style={{ color: 'var(--color-accent)' }} className="font-medium text-sm">
              Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[880px] mx-auto px-6 py-12">
        {/* Ruling Metadata */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="card">
            <p className="section-label">Issue Date</p>
            <p className="stat-value text-lg">{ruling.issueDate}</p>
          </div>
          <div className="card">
            <p className="section-label">Category</p>
            <p className="stat-value text-lg">{ruling.category}</p>
          </div>
          <div className="card">
            <p className="section-label">Duty Rate</p>
            <p className="stat-value text-lg" style={{
              color: ruling.dutyRate === 'Free' ? 'var(--color-positive)' : 'var(--color-negative)'
            }}>
              {ruling.dutyRate}
            </p>
          </div>
        </div>

        {/* HTS Codes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            HTS Codes Referenced
          </h2>
          <div className="flex flex-wrap gap-3">
            {ruling.htsCodes.map((code, idx) => (
              <Link
                key={idx}
                href={`/tools/hts-lookup?q=${code}`}
                className="px-4 py-2 rounded-pill font-mono font-medium"
                style={{
                  backgroundColor: '#f5f5f7',
                  color: 'var(--color-text)',
                  textDecoration: 'none'
                }}
              >
                {code}
              </Link>
            ))}
          </div>
        </section>

        {/* Product Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Product Description
          </h2>
          <div className="card">
            <p style={{ color: 'var(--color-text)', lineHeight: '1.7' }}>
              {ruling.productDescription}
            </p>
          </div>
        </section>

        {/* Decision */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            CBP Decision
          </h2>
          <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
            <p style={{ color: 'var(--color-text)', lineHeight: '1.7' }}>
              {ruling.decision}
            </p>
          </div>
        </section>

        {/* Official Link */}
        <section className="mb-12">
          <div className="card text-center">
            <p className="mb-4" style={{ color: 'var(--color-muted)' }}>
              View the official ruling on CBP's CROSS database
            </p>
            <a
              href={ruling.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-block"
            >
              View official ruling ↗
            </a>
          </div>
        </section>

        {/* CTA */}
        <div className="card text-center py-12" style={{ background: 'linear-gradient(to bottom right, #f5f5f7, var(--color-card-bg))' }}>
          <h2 className="text-3xl font-semibold mb-4" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Have a similar product?
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--color-muted)' }}>
            Tariff Engineer can analyze your product and find engineering opportunities based on this ruling and thousands of others.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Analyze my product now
          </Link>
        </div>

        {/* Related Rulings */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Related Rulings in {ruling.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rulings
              .filter(r => r.category === ruling.category && r.id !== ruling.id)
              .slice(0, 4)
              .map(related => (
                <Link
                  key={related.id}
                  href={`/rulings/${related.id}`}
                  className="card"
                  style={{ textDecoration: 'none' }}
                >
                  <h3 className="font-mono font-semibold mb-2" style={{ color: 'var(--color-accent)' }}>
                    {related.id}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--color-text)' }}>
                    {related.productDescription.substring(0, 120)}
                    {related.productDescription.length > 120 ? '...' : ''}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      {related.issueDate}
                    </span>
                    <span className="text-xs font-semibold" style={{
                      color: related.dutyRate === 'Free' ? 'var(--color-positive)' : 'var(--color-negative)'
                    }}>
                      {related.dutyRate}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  )
}
