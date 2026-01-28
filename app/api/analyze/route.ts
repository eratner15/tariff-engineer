import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { RULINGS } from '@/lib/data/rulings'
import { getMockAnalysis } from '@/lib/mock-analysis'

const USE_MOCK_MODE = !process.env.ANTHROPIC_API_KEY

const anthropic = USE_MOCK_MODE ? null : new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json()

    if (!description) {
      return NextResponse.json({ error: 'Product description is required' }, { status: 400 })
    }

    // Use mock analysis if no API key is set (demo mode)
    if (USE_MOCK_MODE) {
      console.log('Using mock analysis mode (no API key set)')
      // Simulate API delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockResult = getMockAnalysis(description)
      return NextResponse.json(mockResult)
    }

    // Prepare rulings context for Claude
    const rulingsContext = RULINGS.map(r => `
RULING ${r.id}:
Category: ${r.category.join(', ')}
HTS Codes: ${r.htsCodes.map(h => `${h.code} (${h.rate}): ${h.description}`).join(' | ')}
Summary: ${r.summary}
Key Factors: ${r.keyFactors.join('; ')}
Engineering Insight: ${r.engineeringInsight}
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
