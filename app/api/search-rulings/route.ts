import { NextResponse } from 'next/server'
import rulings from '@/data/rulings.json'

interface Ruling {
  id: string
  issueDate: string
  htsCodes: string[]
  productDescription: string
  decision: string
  category: string
  dutyRate: string
  url: string
}

// Simple keyword extraction and matching
function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'its', 'it', 'this', 'that', 'these',
    'those', 'which', 'who', 'when', 'where', 'why', 'how', 'designed'
  ])

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word))
}

// Calculate similarity score between query and ruling
function calculateSimilarity(query: string, ruling: Ruling): number {
  const queryKeywords = new Set(extractKeywords(query))
  const rulingKeywords = new Set([
    ...extractKeywords(ruling.productDescription),
    ...extractKeywords(ruling.decision),
    ...ruling.htsCodes,
    ruling.category.toLowerCase()
  ])

  // Count matching keywords
  let matches = 0
  queryKeywords.forEach(keyword => {
    if (rulingKeywords.has(keyword)) {
      matches += 2 // Exact match
    } else {
      // Check for partial matches
      for (const rulingKeyword of rulingKeywords) {
        if (rulingKeyword.includes(keyword) || keyword.includes(rulingKeyword)) {
          matches += 1
          break
        }
      }
    }
  })

  // Normalize by query length
  return queryKeywords.size > 0 ? matches / queryKeywords.size : 0
}

// Detect product category from description
function detectCategory(description: string): string {
  const lower = description.toLowerCase()

  if (lower.includes('shoe') || lower.includes('footwear') || lower.includes('sneaker') ||
      lower.includes('boot') || lower.includes('sandal') || lower.includes('sole')) {
    return 'Footwear'
  }
  if (lower.includes('watch') || lower.includes('wearable') || lower.includes('fitness tracker') ||
      lower.includes('smartwatch')) {
    return 'Wearables'
  }
  if (lower.includes('earbud') || lower.includes('headphone') || lower.includes('laptop') ||
      lower.includes('computer') || lower.includes('electronic')) {
    return 'Electronics'
  }
  if (lower.includes('bag') || lower.includes('backpack') || lower.includes('luggage') ||
      lower.includes('duffel') || lower.includes('case')) {
    return 'Bags'
  }
  if (lower.includes('shirt') || lower.includes('short') || lower.includes('apparel') ||
      lower.includes('clothing') || lower.includes('bra') || lower.includes('sock')) {
    return 'Apparel'
  }
  if (lower.includes('dumbbell') || lower.includes('equipment') || lower.includes('resistance') ||
      lower.includes('skate') || lower.includes('sports')) {
    return 'Sports Equipment'
  }

  return 'General'
}

export async function POST(request: Request) {
  try {
    const { description } = await request.json()

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Product description is required' },
        { status: 400 }
      )
    }

    // Detect category
    const category = detectCategory(description)

    // Calculate similarity scores for all rulings
    const scoredRulings = rulings.map(ruling => ({
      ...ruling,
      score: calculateSimilarity(description, ruling as Ruling)
    }))

    // Boost rulings in same category
    scoredRulings.forEach(ruling => {
      if (ruling.category === category) {
        ruling.score *= 1.5
      }
    })

    // Sort by score and take top 10
    const topRulings = scoredRulings
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .filter(r => r.score > 0)
      .map(({ score, ...ruling }) => ruling)

    return NextResponse.json({
      category,
      rulings: topRulings,
      total: rulings.length,
      matches: topRulings.length
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
