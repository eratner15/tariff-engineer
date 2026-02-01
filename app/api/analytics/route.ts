import { NextResponse } from 'next/server'
import { getTotalAudits, getTotalLeads, getStats } from '@/lib/db'

export async function GET() {
  try {
    // Get real database statistics
    const [totalAudits, totalLeads, stats] = await Promise.all([
      getTotalAudits(),
      getTotalLeads(),
      getStats(),
    ]);

    return NextResponse.json({
      totalSearches: totalAudits,
      totalEmails: totalLeads,
      database: {
        htsCodes: stats.htsCodes,
        rulings: stats.rulings,
        strategies: stats.strategies,
        audits: stats.audits,
        leads: stats.leads,
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)

    // Fallback to 0 on database error
    return NextResponse.json({
      totalSearches: 0,
      totalEmails: 0,
      database: {
        htsCodes: 0,
        rulings: 0,
        strategies: 0,
        audits: 0,
        leads: 0,
      }
    })
  }
}
