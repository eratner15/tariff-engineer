import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data || !data.product || !data.currentClassification || !data.opportunities) {
      return NextResponse.json(
        { error: 'Invalid analysis data' },
        { status: 400 }
      )
    }

    // Dynamic import to avoid build issues
    const React = await import('react')
    const { renderToStream } = await import('@react-pdf/renderer')
    const { TariffReport } = await import('@/components/TariffReport')

    // Generate PDF stream using createElement (no JSX in API routes)
    const stream = await renderToStream(
      React.createElement(TariffReport, { data })
    )

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Return PDF as downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="tariff-analysis-${Date.now()}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
