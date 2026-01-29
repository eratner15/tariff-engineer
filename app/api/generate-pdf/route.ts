import { NextRequest, NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { TariffReport } from '@/components/TariffReport'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data || !data.product || !data.currentClassification || !data.opportunities) {
      return NextResponse.json(
        { error: 'Invalid analysis data' },
        { status: 400 }
      )
    }

    // Generate PDF stream
    const stream = await renderToStream(<TariffReport data={data} />)

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
