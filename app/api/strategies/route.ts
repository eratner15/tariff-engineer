import { NextRequest, NextResponse } from 'next/server';
import { getAllStrategies, getStrategiesForChapter } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const chapter = searchParams.get('chapter');

    let strategies;

    if (chapter) {
      // Get strategies for specific HTS chapter
      strategies = await getStrategiesForChapter(chapter);
    } else {
      // Get all active strategies
      strategies = await getAllStrategies();
    }

    return NextResponse.json({
      strategies,
      count: strategies.length,
    });

  } catch (error: any) {
    console.error('Strategies API error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to fetch strategies', details: error.message },
      { status: 500 }
    );
  }
}
