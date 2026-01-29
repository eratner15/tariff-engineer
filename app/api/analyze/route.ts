import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getMockAnalysis } from '@/lib/mock-analysis'
import rulings from '@/data/rulings.json'
import fs from 'fs'
import path from 'path'

const USE_MOCK_MODE = !process.env.ANTHROPIC_API_KEY

const anthropic = USE_MOCK_MODE ? null : new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// Search for relevant rulings
async function searchRulings(description: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/search-rulings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    })

    if (!response.ok) {
      console.error('Search failed, using all rulings as fallback')
      return rulings.slice(0, 10)
    }

    const data = await response.json()
    return data.rulings || rulings.slice(0, 10)
  } catch (error) {
    console.error('Search error, using all rulings as fallback:', error)
    return rulings.slice(0, 10)
  }
}

// Track search for analytics
function trackSearch(description: string, category: string) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const searchesFile = path.join(dataDir, 'searches.json')

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    let searches: any[] = []
    if (fs.existsSync(searchesFile)) {
      const data = fs.readFileSync(searchesFile, 'utf-8')
      searches = JSON.parse(data)
    }

    searches.push({
      product: description,
      category,
      timestamp: Date.now(),
      date: new Date().toISOString()
    })

    fs.writeFileSync(searchesFile, JSON.stringify(searches, null, 2))
  } catch (error) {
    console.error('Search tracking error:', error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json()

    if (!description) {
      return NextResponse.json({ error: 'Product description is required' }, { status: 400 })
    }

    // Detect category for analytics
    const lower = description.toLowerCase()
    let category = 'Other'
    if (lower.includes('shoe') || lower.includes('footwear')) category = 'Footwear'
    else if (lower.includes('watch') || lower.includes('wearable')) category = 'Wearables'
    else if (lower.includes('earbud') || lower.includes('headphone') || lower.includes('electronic')) category = 'Electronics'
    else if (lower.includes('bag') || lower.includes('backpack')) category = 'Bags'
    else if (lower.includes('apparel') || lower.includes('clothing')) category = 'Apparel'

    // Track search
    trackSearch(description, category)

    // Use mock analysis if no API key is set (demo mode)
    if (USE_MOCK_MODE) {
      console.log('Using mock analysis mode (no API key set)')
      // Simulate API delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockResult = getMockAnalysis(description)
      return NextResponse.json(mockResult)
    }

    // Search for relevant rulings
    const relevantRulings = await searchRulings(description)
    console.log(`Found ${relevantRulings.length} relevant rulings`)

    // Prepare rulings context for Claude
    const rulingsContext = relevantRulings.map((r: any) => `
RULING ${r.id}:
Date: ${r.issueDate}
Category: ${r.category}
HTS Codes: ${r.htsCodes.join(', ')}
Duty Rate: ${r.dutyRate}
Product: ${r.productDescription}
Decision: ${r.decision}
URL: ${r.url}
`).join('\n---\n')

    const prompt = `You are a tariff classification expert analyzing products for legal tariff engineering opportunities.

PRODUCT DESCRIPTION:
${description}

AVAILABLE CBP RULINGS DATABASE:
${rulingsContext}

YOUR TASK:
1. Identify the most likely CURRENT HTS classification and duty rate for this product
2. Analyze the rulings database to find 3-5 tariff engineering opportunities
3. For each opportunity, provide:
   - Specific physical/structural modification required
   - Current HTS code and rate
   - New HTS code and rate after modification
   - Percentage duty reduction
   - Confidence level (High/Medium/Low) based on ruling clarity
   - Relevant ruling ID(s) that support this strategy
   - Clear explanation of WHY this works legally
   - Estimated per-unit savings (assume reasonable product values)

REQUIREMENTS:
- ONLY suggest modifications explicitly supported by the provided rulings
- Focus on modifications that are practically implementable
- Prioritize opportunities with >5% duty reduction
- High confidence = multiple clear rulings, direct precedent
- Medium confidence = one clear ruling or indirect precedent
- Low confidence = limited precedent, requires broker review
- Be specific about material thresholds, percentages, design changes
- Calculate realistic savings estimates

OUTPUT FORMAT (JSON):
{
  "currentClassification": {
    "hts": "CODE",
    "rate": "X%",
    "description": "Classification reasoning"
  },
  "opportunities": [
    {
      "modification": "Specific change required",
      "currentHTS": "XXXX.XX.XX",
      "currentRate": "X%",
      "newHTS": "YYYY.YY.YY",
      "newRate": "Y%",
      "reduction": "-Z%",
      "confidence": "High|Medium|Low",
      "rulings": [{"id": "NY NXXXXXX", "url": "https://rulings.cbp.gov/ruling/NXXXXXX"}],
      "explanation": "Detailed legal reasoning",
      "savings": {
        "perUnit": X.XX,
        "annual": XXXXX
      }
    }
  ],
  "totalPotentialSavings": XXXXX
}

Be precise, practical, and legally defensible. These recommendations will go to real importers.`

    // TypeScript guard: anthropic should never be null here because of USE_MOCK_MODE check above
    if (!anthropic) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response (Claude might wrap it in markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response')
    }

    const analysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze product' },
      { status: 500 }
    )
  }
}
