// Leaderboard API
// Location: src/app/api/gamification/leaderboard/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard as getLeaderboardDB } from '@/lib/dbGamification';

/**
 * GET /api/gamification/leaderboard
 * Get top users by points
 */
export async function GET(request: NextRequest) {
  try {
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get('limit') || '100'),
      100
    );
    const timeframe = request.nextUrl.searchParams.get('timeframe') || 'all_time';

    const leaderboard = await getLeaderboardDB(limit);

    return NextResponse.json({
      success: true,
      timeframe,
      total_entries: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
