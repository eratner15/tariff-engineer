import { ScanMessage } from '@/app/components/ScanAnimation'
import presets from '@/app/data/presets.json'

// Generate realistic ruling IDs for rejection messages
const generateRulingIds = (count: number, chapter: string): string[] => {
  const ids = []
  for (let i = 0; i < count; i++) {
    const randomNum = Math.floor(Math.random() * 100000) + 280000
    ids.push(`NY N${randomNum}`)
  }
  return ids
}

export function generateScanMessages(preset: typeof presets[0]): ScanMessage[] {
  const chapter = preset.chapter
  const rulingId = preset.hack.ruling
  const rejectedRulings = generateRulingIds(2, chapter)

  return [
    { text: "> INITIALIZING CROSS DATABASE CONNECTION...", delay: 0 },
    { text: "> AUTHENTICATING... [████████████████████] OK", delay: 200 },
    { text: "> ACCESSING CBP RULING ARCHIVE...", delay: 400 },
    { text: `> SCANNING HTSUS CHAPTER ${chapter} (${preset.category})...`, delay: 600 },
    { text: "> PARSING 10,847 PRECEDENTS...", delay: 800 },
    { text: `> REJECTING ${rejectedRulings[0]}... (NO MATCH)`, delay: 950 },
    { text: `> REJECTING ${rejectedRulings[1]}... (NO MATCH)`, delay: 1050 },
    { text: `> ANALYZING ${rulingId}...`, delay: 1200 },
    { text: "> ████████████████████████████████████████", delay: 1350 },
    { text: "> MATCH FOUND: 98.7% CONFIDENCE", delay: 1450, highlight: true },
    { text: "> EXTRACTING TARIFF ENGINEERING VECTOR...", delay: 1600 },
    { text: "> CALCULATING SAVINGS PROJECTION...", delay: 1750 },
    { text: "> AUDIT COMPLETE.", delay: 1900, final: true },
  ]
}

// Generic messages for user-entered products
export function generateGenericScanMessages(productDescription: string): ScanMessage[] {
  const category = detectCategory(productDescription)
  const chapter = getCategoryChapter(category)
  const rejectedRulings = generateRulingIds(2, chapter)

  return [
    { text: "> INITIALIZING CROSS DATABASE CONNECTION...", delay: 0 },
    { text: "> AUTHENTICATING... [████████████████████] OK", delay: 200 },
    { text: "> ACCESSING CBP RULING ARCHIVE...", delay: 400 },
    { text: `> SCANNING HTSUS CHAPTER ${chapter} (${category})...`, delay: 600 },
    { text: "> PARSING 10,847 PRECEDENTS...", delay: 800 },
    { text: `> REJECTING ${rejectedRulings[0]}... (NO MATCH)`, delay: 950 },
    { text: `> REJECTING ${rejectedRulings[1]}... (NO MATCH)`, delay: 1050 },
    { text: "> ANALYZING POTENTIAL MATCHES...", delay: 1200 },
    { text: "> ████████████████████████████████████████", delay: 1350 },
    { text: "> MATCH FOUND: 95.3% CONFIDENCE", delay: 1450, highlight: true },
    { text: "> EXTRACTING TARIFF ENGINEERING VECTOR...", delay: 1600 },
    { text: "> CALCULATING SAVINGS PROJECTION...", delay: 1750 },
    { text: "> AUDIT COMPLETE.", delay: 1900, final: true },
  ]
}

function detectCategory(description: string): string {
  const lower = description.toLowerCase()
  if (lower.includes('shoe') || lower.includes('boot') || lower.includes('footwear')) {
    return 'FOOTWEAR'
  }
  if (lower.includes('bag') || lower.includes('luggage') || lower.includes('backpack')) {
    return 'BAGS & LUGGAGE'
  }
  if (lower.includes('watch') || lower.includes('wearable') || lower.includes('fitness')) {
    return 'WEARABLES'
  }
  if (lower.includes('bluetooth') || lower.includes('speaker') || lower.includes('earbud') || lower.includes('electronic')) {
    return 'ELECTRONICS'
  }
  if (lower.includes('vehicle') || lower.includes('car') || lower.includes('van')) {
    return 'VEHICLES'
  }
  return 'GENERAL MERCHANDISE'
}

function getCategoryChapter(category: string): string {
  const mapping: Record<string, string> = {
    'FOOTWEAR': '64',
    'BAGS & LUGGAGE': '42',
    'WEARABLES': '91',
    'ELECTRONICS': '85',
    'VEHICLES': '87',
    'GENERAL MERCHANDISE': '97'
  }
  return mapping[category] || '97'
}
