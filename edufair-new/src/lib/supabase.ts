/**
 * Supabase Client Configuration + Gamification Helpers
 * Location: src/lib/supabase.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Allow module to load even without env vars (for local development)
let supabase: any = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

// Server-side client for API routes
export const getSupabaseServerClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials not configured')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ============================================
// Type Definitions
// ============================================

export interface UserGamification {
  id: string
  user_id: string
  total_points: number
  level: number
  badges_earned: string[]
  badges_count: number
  current_streak: number
  max_streak: number
  last_activity_date: string | null
  referral_code: string
  referrals_count: number
  referral_earnings: number
  leaderboard_rank: number | null
  created_at: string
  updated_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
}

export interface UserActivityLog {
  id: string
  user_id: string
  activity_type: string
  points_earned: number
  description: string
  metadata: Record<string, any> | null
  created_at: string
}

// ============================================
// Helper Functions for Gamification
// ============================================

/**
 * Get user gamification data
 */
export async function getUserGamification(userId: string): Promise<UserGamification | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase not configured - will use local mock')
    }
    
    const client = getSupabaseServerClient()
    const { data, error } = await client
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching gamification:', error)
      throw error
    }

    return data as UserGamification
  } catch (err) {
    console.error('Error fetching gamification:', err)
    throw err // Let the route handle it with mock fallback
  }
}

/**
 * Update user points and log activity
 */
export async function updateUserPoints(
  userId: string,
  pointsToAdd: number,
  activityType: string,
  description: string = ''
): Promise<{ success: boolean; newTotal: number | null }> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase not configured - will use local mock')
    }
    
    const client = getSupabaseServerClient()

    // Log the activity
    const { error: logError } = await client
      .from('user_activity_log')
      .insert({
        user_id: userId,
        activity_type: activityType,
        points_earned: pointsToAdd,
        description,
        created_at: new Date().toISOString(),
      })

    if (logError) {
      console.error('Error logging activity:', logError)
      throw logError
    }

    // Update points
    const { data, error: updateError } = await client
      .rpc('add_user_points', {
        p_user_id: userId,
        p_points: pointsToAdd,
      })

    if (updateError) {
      console.error('Error updating points:', updateError)
      throw updateError
    }

    return {
      success: true,
      newTotal: data?.new_total || null,
    }
  } catch (err) {
    console.error('Error updating points:', err)
    throw err // Let the route handle it with mock fallback
  }
}

/**
 * Get leaderboard (top 100 users)
 */
export async function getLeaderboard(offset: number = 0, limit: number = 100) {
  try {
    const client = getSupabaseServerClient()
    const { data, error } = await client
      .from('user_gamification')
      .select(
        `
        id,
        user_id,
        total_points,
        level,
        badges_count,
        current_streak,
        referrals_count,
        leaderboard_rank,
        updated_at
        `
      )
      .order('total_points', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

/**
 * Add badge to user
 */
export async function addBadgeToUser(
  userId: string,
  badgeId: string
): Promise<{ success: boolean; newBadgeCount: number | null }> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase not configured - will use local mock')
    }
    
    const client = getSupabaseServerClient()

    // Check if badge already exists
    const { data: existingBadge } = await client
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', badgeId)
      .single()

    if (existingBadge) {
      return { success: false, newBadgeCount: null }
    }

    // Add badge
    const { error: insertError } = await client
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: badgeId,
        unlocked_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('Error adding badge:', insertError)
      throw insertError
    }

    // Update badge count
    const { data, error: updateError } = await client
      .from('user_gamification')
      .update({
        badges_count: { op: 'increment', value: 1 },
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select('badges_count')
      .single()

    if (updateError) {
      console.error('Error updating badge count:', updateError)
      throw updateError
    }

    return {
      success: true,
      newBadgeCount: data?.badges_count || null,
    }
  } catch (err) {
    console.error('Error adding badge:', err)
    throw err // Let the route handle it with mock fallback
  }
}

/**
 * Get user referrals info
 */
export async function getUserReferrals(userId: string) {
  try {
    const client = getSupabaseServerClient()
    const { data, error } = await client
      .from('user_gamification')
      .select('referral_code, referrals_count, referral_earnings')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching referrals:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

/**
 * Initialize gamification for new user
 */
export async function initializeGameificationForUser(
  userId: string,
  referralCode: string
): Promise<{ success: boolean }> {
  try {
    const client = getSupabaseServerClient()
    const { error } = await client
      .from('user_gamification')
      .insert({
        user_id: userId,
        total_points: 0,
        level: 1,
        badges_earned: [],
        badges_count: 0,
        current_streak: 0,
        max_streak: 0,
        referral_code: referralCode,
        referrals_count: 0,
        referral_earnings: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error initializing gamification:', error)
      return { success: false }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false }
  }
}
