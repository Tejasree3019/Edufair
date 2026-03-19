/**
 * Activity Logging Middleware
 * Location: src/middleware/activityLogger.ts
 *
 * Intercepts user actions (login, application submit, etc.)
 * and automatically awards points via the gamification system
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateUserPoints } from '@/lib/supabase'

/**
 * Activity types and their point rewards
 */
export const ACTIVITY_POINTS: Record<string, number> = {
  // Core actions
  login: 5,
  logout: 0,
  profile_view: 0,
  profile_update: 10,

  // Scholarship actions
  scholarship_view: 0,
  scholarship_save: 2,
  scholarship_unsave: -1,
  scholarship_share: 5,

  // Application actions
  application_start: 5,
  application_save_draft: 2,
  application_submit: 20,
  application_withdraw: -10,
  application_accepted: 500, // Major reward
  application_rejected: 0,
  application_under_review: 0,

  // Profile actions
  upload_document: 5,
  update_education: 5,
  update_test_score: 5,

  // Social/Community actions
  write_review: 50,
  share_success_story: 100,
  refer_friend: 50,
  refer_friend_applied: 100,
  refer_friend_accepted: 500,

  // Content interactions
  read_blog: 0,
  share_blog: 2,

  // Engagement
  join_community: 25,
  reply_to_forum: 5,
  help_other_user: 10,

  // Streaks
  daily_login_streak_7: 50,
  daily_login_streak_30: 250,
}

/**
 * Log activity and award points
 * Call this whenever user performs an action
 */
export async function logUserActivity(
  userId: string,
  activityType: string,
  metadata?: Record<string, any>
): Promise<{
  success: boolean
  pointsAwarded: number
  newTotal?: number
}> {
  try {
    // Get points for this activity (0 if not found)
    const pointsToAdd = ACTIVITY_POINTS[activityType] || 0

    // Only update if points > 0
    if (pointsToAdd > 0) {
      const result = await updateUserPoints(
        userId,
        pointsToAdd,
        activityType,
        typeof metadata === 'object' ? JSON.stringify(metadata) : ''
      )

      return {
        success: result.success,
        pointsAwarded: pointsToAdd,
        newTotal: result.newTotal ?? undefined,
      }
    }

    // Still log the activity even if points = 0
    return {
      success: true,
      pointsAwarded: 0,
    }
  } catch (err) {
    console.error('[ActivityLogger] Error:', err)
    return {
      success: false,
      pointsAwarded: 0,
    }
  }
}

/**
 * Middleware wrapper for API routes
 * Usage:
 *   export async function POST(request: NextRequest) {
 *     return withActivityLogging(request, async (req, userId) => {
 *       // Your logic here
 *       return NextResponse.json({ ... })
 *     }, 'application_submit')
 *   }
 */
export async function withActivityLogging(
  request: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>,
  activityType: string,
  getMetadata?: (body: any) => Record<string, any>
): Promise<NextResponse> {
  try {
    // Get user ID from header
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clone request body to extract metadata
    let metadata: Record<string, any> | undefined
    if (getMetadata) {
      try {
        // Clone the request to read body
        const clonedRequest = request.clone()
        const body = await clonedRequest.json()
        metadata = getMetadata(body)
      } catch (err) {
        console.warn('[ActivityLogger] Could not extract metadata:', err)
      }
    }

    // Log activity (this will award points if applicable)
    await logUserActivity(userId, activityType, metadata)

    // Call the actual handler
    return handler(request, userId)
  } catch (err) {
    console.error('[ActivityLogger] Middleware error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Batch log multiple activities (for import/batch operations)
 */
export async function logMultipleActivities(
  userId: string,
  activities: Array<{
    type: string
    metadata?: Record<string, any>
  }>
): Promise<{
  success: boolean
  totalPoints: number
  count: number
}> {
  try {
    let totalPoints = 0

    for (const activity of activities) {
      const result = await logUserActivity(userId, activity.type, activity.metadata)
      if (result.success) {
        totalPoints += result.pointsAwarded
      }
    }

    return {
      success: true,
      totalPoints,
      count: activities.length,
    }
  } catch (err) {
    console.error('[ActivityLogger] Batch error:', err)
    return {
      success: false,
      totalPoints: 0,
      count: 0,
    }
  }
}

/**
 * Check and award streak bonuses
 * Call this daily or during login
 */
export async function checkAndAwardStreakBonus(userId: string): Promise<{
  streakDays: number
  bonusPoints: number
}> {
  // TODO: Implement when user streak data is available
  // This would:
  // 1. Get user's last login date
  // 2. Check if consecutive days
  // 3. Award bonus points at milestones (7, 14, 30, etc.)
  return {
    streakDays: 0,
    bonusPoints: 0,
  }
}

/**
 * Activity logging examples for different routes
 *
 * Example 1: In /api/applications/submit route
 * ----
 * await logUserActivity(userId, 'application_submit', {
 *   scholarshipId: body.scholarshipId,
 *   applicationStatus: 'submitted'
 * })
 *
 * Example 2: In /api/profile/update route
 * ----
 * await logUserActivity(userId, 'profile_update', {
 *   fieldsUpdated: ['education', 'extracurriculars'],
 *   completionPercentage: 85
 * })
 *
 * Example 3: Using middleware wrapper
 * ----
 * export async function POST(request: NextRequest) {
 *   return withActivityLogging(
 *     request,
 *     async (req, userId) => {
 *       const { scholarship_id } = await req.json()
 *       // ... handle save logic ...
 *       return NextResponse.json({ success: true })
 *     },
 *     'scholarship_save',
 *     (body) => ({ scholarshipId: body.scholarship_id })
 *   )
 * }
 */
