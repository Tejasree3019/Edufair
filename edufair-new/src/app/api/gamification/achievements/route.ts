// Achievements API
// Location: src/app/api/gamification/achievements/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAchievements } from '@/lib/dbGamification';

/**
 * GET /api/gamification/achievements
 * Get all available achievements and user's progress
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const achievements = await getAchievements(userId);

    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    const totalPoints = achievements.reduce(
      (sum, a) => sum + (a.unlocked ? a.points : 0),
      0
    );

    return NextResponse.json({
      success: true,
      total_achievements: achievements.length,
      unlocked_count: unlockedCount,
      total_points_earned: totalPoints,
      data: achievements,
    });
  } catch (error) {
    console.error('Achievements fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
