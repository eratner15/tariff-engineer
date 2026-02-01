import { NextResponse } from 'next/server';
import { getAllStrategies } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  // First test if route works at all
  console.log('Strategies API called');

  try {
    // Get all active strategies
    const strategies = await getAllStrategies();

    console.log(`Fetched ${strategies.length} strategies from database`);

    return NextResponse.json({
      success: true,
      strategies,
      count: strategies.length,
    });

  } catch (error: any) {
    console.error('Strategies API error:', error);
    console.error('Error stack:', error.stack);

    // Return error with fallback
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch strategies',
        details: error.message,
        strategies: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
