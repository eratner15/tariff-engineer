import { NextRequest, NextResponse } from 'next/server'
import { captureLead } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, source, auditId } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Store in database
    await captureLead(
      email.toLowerCase().trim(),
      source || 'analysis_request',
      auditId
    );

    console.log(`✓ Lead captured: ${email}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture email' },
      { status: 500 }
    )
  }
}
