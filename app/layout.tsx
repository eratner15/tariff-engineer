import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tariff Engineer',
  description: 'The difference between 60% duty and 6% often comes down to product design. Find the loopholes in 10,000 pages of tariff code.',
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
