import { NextResponse } from 'next/server';
import { getAllStrategies } from '@/lib/db';

export async function GET() {
  try {
    // Get all active strategies
    const strategies = await getAllStrategies();

    return NextResponse.json({
      strategies,
      count: strategies.length,
    });

  } catch (error: any) {
    console.error('Strategies API error:', error);
    console.error('Error stack:', error.stack);

    // Return error with fallback
    return NextResponse.json(
      { error: 'Failed to fetch strategies', details: error.message, strategies: [], count: 0 },
      { status: 500 }
    );
  }
}
