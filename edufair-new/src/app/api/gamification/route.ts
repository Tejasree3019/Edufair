/**
 * Gamification API Route
 * Location: src/app/api/gamification/route.ts
 * 
 * Production-Ready Endpoints:
 * - GET /api/gamification - Get user's gamification data
 * - POST /api/gamification - Log activity and award points
 * 
 * All data persisted in Supabase with real-time sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { calculateUserLevel, checkAchievements, generateReferralCode } from '@/lib/gamificationEngine'

/**
 * GET /api/gamification
 * Get user's gamification data (points, badges, level, streak, referrals)
 * Real-time data from Supabase
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from auth header or query param
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      )
    }

    // Verify token if provided (optional for public leaderboard)
    if (token) {
      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
    }

    const supabase = getSupabaseServerClient()

    // Fetch from database
    const { data: gamificationData, error } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // User not found - initialize new user
        return await initializeUserGamification(userId)
      }
      console.error('Error fetching gamification:', error)
      return NextResponse.json(
        { error: 'Failed to fetch gamification data' },
        { status: 500 }
      )
    }

    // Calculate level based on points
    const level = calculateUserLevel(gamificationData.total_points)

    return NextResponse.json({
      success: true,
      data: {
        id: gamificationData.id,
        user_id: gamificationData.user_id,
        total_points: gamificationData.total_points,
        level,
        badges_earned: gamificationData.badges_earned || [],
        current_streak: gamificationData.current_streak || 0,
        max_streak: gamificationData.max_streak || 0,
        referral_code: gamificationData.referral_code,
        referrals_count: gamificationData.referrals_count || 0,
        referral_earnings: gamificationData.referral_earnings || 0,
        leaderboard_rank: gamificationData.leaderboard_rank,
        created_at: gamificationData.created_at,
        updated_at: gamificationData.updated_at,
      },
    })
  } catch (error) {
    console.error('[Gamification] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gamification data' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/gamification
 * Log user activity and award points
 * Real-time database updates via Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, action_type, description } = await request.json()

    if (!userId || !action_type) {
      return NextResponse.json(
        { error: 'Missing userId or action_type' },
        { status: 400 }
      )
    }

    // Define point rewards for each action
    const pointMap: Record<string, number> = {
      'login': 5,
      'profile_update': 10,
      'scholarship_saved': 2,
      'application_submit': 20,
      'application_accepted': 500,
      'referral_signup': 50,
      'review_written': 50,
      'profile_complete': 25,
      'milestone_100_apps': 100,
    }

    const pointsToAdd = pointMap[action_type] || 0

    if (pointsToAdd === 0) {
      return NextResponse.json(
        { error: 'Invalid action type' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Get current gamification record
    const { data: currentData } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!currentData) {
      // Initialize new user gamification
      const { data: newRecord, error } = await supabase
        .from('gamification')
        .insert([{
          user_id: userId,
          total_points: pointsToAdd,
          level: 1,
          badges_earned: [],
          current_streak: 1,
          max_streak: 1,
          referral_code: generateReferralCode(userId),
          referrals_count: 0,
          referral_earnings: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        success: true,
        points_awarded: pointsToAdd,
        new_points: pointsToAdd,
        new_level: 1,
        new_badges: [],
        message: `🎉 +${pointsToAdd} points earned for ${action_type}! Account initialized.`,
      })
    }

    const newTotalPoints = currentData.total_points + pointsToAdd
    const newLevel = calculateUserLevel(newTotalPoints)

    // Update points in database
    const { data: updated, error } = await supabase
      .from('gamification')
      .update({
        total_points: newTotalPoints,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating points:', error)
      return NextResponse.json(
        { error: 'Failed to update points' },
        { status: 500 }
      )
    }

    // Log activity
    try {
      await supabase
        .from('activity_log')
        .insert([{
          user_id: userId,
          action_type,
          description: description || '',
          points_awarded: pointsToAdd,
          created_at: new Date().toISOString(),
        }])
    } catch (logError) {
      console.warn('Failed to log activity:', logError)
      // Don't fail the request if logging fails
    }

    // Check for achievement unlocks
    const newBadges: string[] = []
    const achievementIds = checkAchievements(
      0, 
      newTotalPoints,
      100,
      0,
      0,
      false,
      0,
      false
    )

    if (achievementIds && achievementIds.length > 0) {
      for (const achievementId of achievementIds) {
        try {
          const badges = currentData.badges_earned || []
          if (!badges.includes(achievementId)) {
            const { error: badgeError } = await supabase
              .from('gamification')
              .update({
                badges_earned: [...badges, achievementId],
              })
              .eq('user_id', userId)

            if (!badgeError) {
              newBadges.push(achievementId)
            }
          }
        } catch (badgeErr) {
          console.warn('Failed to add badge:', badgeErr)
        }
      }
    }

    return NextResponse.json({
      success: true,
      points_awarded: pointsToAdd,
      new_points: newTotalPoints,
      new_level: newLevel,
      new_badges: newBadges,
      message: `🎉 +${pointsToAdd} points earned for ${action_type}!`,
    })
  } catch (error) {
    console.error('Error in gamification POST:', error)
    return NextResponse.json(
      { error: 'Failed to process activity' },
      { status: 500 }
    )
  }
}

/**
 * Helper: Initialize gamification for a new user
 */
async function initializeUserGamification(userId: string) {
  try {
    const supabase = getSupabaseServerClient()
    const referralCode = generateReferralCode(userId)

    const { data, error } = await supabase
      .from('gamification')
      .insert([{
        user_id: userId,
        total_points: 0,
        level: 1,
        badges_earned: [],
        current_streak: 0,
        max_streak: 0,
        referral_code: referralCode,
        referrals_count: 0,
        referral_earnings: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        user_id: data.user_id,
        total_points: 0,
        level: 1,
        badges_earned: [],
        current_streak: 0,
        max_streak: 0,
        referral_code: referralCode,
        referrals_count: 0,
        referral_earnings: 0,
        leaderboard_rank: null,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    }, { status: 200 })
  } catch (error) {
    console.error('Error initializing gamification:', error)
    return NextResponse.json(
      { error: 'Failed to initialize gamification' },
      { status: 500 }
    )
  }
}
