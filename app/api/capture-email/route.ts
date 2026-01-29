import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const { email, timestamp } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Store in data/emails.json (simple file storage for demo)
    const dataDir = path.join(process.cwd(), 'data')
    const emailsFile = path.join(dataDir, 'emails.json')

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Read existing emails or create empty array
    let emails: any[] = []
    if (fs.existsSync(emailsFile)) {
      const data = fs.readFileSync(emailsFile, 'utf-8')
      emails = JSON.parse(data)
    }

    // Add new email
    emails.push({
      email,
      timestamp,
      source: 'analysis_request',
      date: new Date().toISOString()
    })

    // Write back to file
    fs.writeFileSync(emailsFile, JSON.stringify(emails, null, 2))

    console.log(`✓ Email captured: ${email}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture email' },
      { status: 500 }
    )
  }
}
