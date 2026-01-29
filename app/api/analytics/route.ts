import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const searchesFile = path.join(dataDir, 'searches.json')
    const emailsFile = path.join(dataDir, 'emails.json')

    // Read searches
    let searches: any[] = []
    if (fs.existsSync(searchesFile)) {
      const data = fs.readFileSync(searchesFile, 'utf-8')
      searches = JSON.parse(data)
    }

    // Read emails
    let emails: any[] = []
    if (fs.existsSync(emailsFile)) {
      const data = fs.readFileSync(emailsFile, 'utf-8')
      emails = JSON.parse(data)
    }

    // Calculate stats
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000
    const oneWeekMs = 7 * oneDayMs

    const searchesToday = searches.filter(s => now - s.timestamp < oneDayMs).length
    const searchesThisWeek = searches.filter(s => now - s.timestamp < oneWeekMs).length

    // Count categories
    const categoryCounts: Record<string, number> = {}
    searches.forEach(search => {
      const category = search.category || 'Other'
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Merge recent searches with email data
    const emailMap = new Map(emails.map(e => [e.timestamp, e.email]))
    const recentSearches = searches
      .slice(-50)
      .reverse()
      .map(s => ({
        product: s.product,
        timestamp: s.timestamp,
        email: emailMap.get(s.timestamp)
      }))

    const conversionRate = searches.length > 0 ? (emails.length / searches.length) * 100 : 0

    return NextResponse.json({
      totalSearches: searches.length,
      totalEmails: emails.length,
      searchesToday,
      searchesThisWeek,
      conversionRate,
      recentSearches,
      topCategories
    })
  } catch (error) {
    console.error('Analytics error:', error)

    // Return empty data if files don't exist yet
    return NextResponse.json({
      totalSearches: 0,
      totalEmails: 0,
      searchesToday: 0,
      searchesThisWeek: 0,
      conversionRate: 0,
      recentSearches: [],
      topCategories: []
    })
  }
}
