import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tariff Audit Terminal — Find Duty Loopholes',
  description: 'Scan 10,000+ CBP rulings to find legal tariff engineering opportunities. The difference between 37.5% and 7.5% duty is one design change. Run your audit now.',
  openGraph: {
    title: 'Tariff Audit Terminal',
    description: 'Find duty reduction loopholes by scanning 10,000+ CBP rulings. Legal tariff engineering strategies.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tariff Audit Terminal',
    description: 'Scan CBP database for tariff engineering opportunities',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
