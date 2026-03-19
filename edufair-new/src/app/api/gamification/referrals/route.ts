// Referrals API
// Location: src/app/api/gamification/referrals/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getUserReferrals } from '@/lib/dbGamification';

/**
 * GET /api/gamification/referrals
 * Get user's referral information
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const referralData = await getUserReferrals(userId);

    return NextResponse.json({
      success: true,
      data: referralData,
    });
  } catch (error) {
    console.error('Referral fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gamification/referrals/claim-reward
 * Claim referral reward
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');
    const { referral_id } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Verify reward can be claimed and transfer reward

    return NextResponse.json({
      success: true,
      message: 'Reward claimed!',
      amount: 250,
    });
  } catch (error) {
    console.error('Claim reward error:', error);
    return NextResponse.json(
      { error: 'Failed to claim reward' },
      { status: 500 }
    );
  }
}
