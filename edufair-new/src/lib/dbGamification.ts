/**
 * Database Utilities for Gamification
 * Location: src/lib/dbGamification.ts
 */

import type { User } from '@/types';

/**
 * Mock database calls - Replace with actual Supabase when schema is deployed
 */

export interface UserGamificationData {
  user_id: string;
  total_points: number;
  level: number;
  badges_earned: string[];
  current_streak: number;
  referral_code: string;
  referrals_count: number;
  referral_earnings: number;
  leaderboard_rank: number;
}

/**
 * Get user's gamification data
 */
export async function getUserGamification(userId: string): Promise<UserGamificationData> {
  // TODO: Replace with actual Supabase query
  // const { data } = await supabase
  //   .from('user_gamification')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .single();

  // For now, return mock data
  return {
    user_id: userId,
    total_points: Math.floor(Math.random() * 5000) + 500,
    level: Math.floor(Math.random() * 20) + 1,
    badges_earned: ['first-login', 'first-application'],
    current_streak: Math.floor(Math.random() * 30),
    referral_code: `EDUFAIR-${userId.substring(0, 6).toUpperCase()}`,
    referrals_count: Math.floor(Math.random() * 10),
    referral_earnings: Math.floor(Math.random() * 50000),
    leaderboard_rank: Math.floor(Math.random() * 500) + 1,
  };
}

/**
 * Add points to user
 */
export async function addUserPoints(
  userId: string,
  points: number,
  activityType: string
): Promise<{ new_points: number; new_level: number; new_badges: string[] }> {
  // TODO: Replace with Supabase RPC call
  // const { data } = await supabase.rpc('add_user_points', {
  //   p_user_id: userId,
  //   p_points: points
  // });

  // Mock implementation
  const randomNewPoints = Math.floor(Math.random() * 30) + 1250;
  const newLevel = calculateLevel(randomNewPoints);

  return {
    new_points: randomNewPoints,
    new_level: newLevel,
    new_badges: [],
  };
}

/**
 * Calculate level from points
 */
export function calculateLevel(points: number): number {
  if (points < 500) return 1;
  if (points < 1000) return 2;
  if (points < 2000) return 3;
  if (points < 4000) return 5;
  if (points < 8000) return 7;
  if (points < 16000) return 10;
  if (points < 32000) return 15;
  if (points < 64000) return 20;
  if (points < 128000) return 30;
  if (points < 256000) return 40;
  if (points < 512000) return 50;
  return Math.min(100, 50 + Math.floor(points / 512000));
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(limit: number = 100) {
  // TODO: Query from leaderboard_top_100 view
  const leaderboard = [
    {
      rank: 1,
      name: 'Rajesh Kumar',
      points: 8500,
      level: 25,
      badges_count: 12,
      referrals_count: 18,
    },
    {
      rank: 2,
      name: 'Priya Sharma',
      points: 7200,
      level: 22,
      badges_count: 10,
      referrals_count: 15,
    },
    {
      rank: 3,
      name: 'Amit Singh',
      points: 6800,
      level: 20,
      badges_count: 9,
      referrals_count: 12,
    },
  ];

  return leaderboard.slice(0, limit);
}

/**
 * Log user activity
 */
export async function logActivity(
  userId: string,
  activityType: string,
  activityData?: Record<string, unknown>
): Promise<void> {
  // TODO: Insert into user_activity_log
  console.log(`Activity logged: ${activityType} for user ${userId}`);
}

/**
 * Get user referrals
 */
export async function getUserReferrals(userId: string) {
  // TODO: Query from user_referrals
  return {
    referral_code: `EDUFAIR-${userId.substring(0, 6).toUpperCase()}`,
    referral_link: `https://edufair.in/ref/EDUFAIR-${userId.substring(0, 6).toUpperCase()}`,
    total_referrals: 5,
    referrals_active: 4,
    referral_earnings: 25000,
    recent_referrals: [
      {
        name: 'Amit Singh',
        status: 'signed_up',
        reward_earned: 50,
        date: '2026-03-08',
      },
      {
        name: 'Neha Gupta',
        status: 'applied',
        reward_earned: 150,
        date: '2026-03-05',
      },
    ],
  };
}

/**
 * Get achievements
 */
export async function getAchievements(userId: string) {
  return [
    {
      id: 'first-login',
      title: '🎯 First Step',
      description: 'Create your account and complete profile',
      points: 50,
      unlocked: true,
      unlocked_at: '2026-02-10',
      category: 'milestone',
    },
    {
      id: 'first-application',
      title: '📝 First Application',
      description: 'Submit your first scholarship application',
      points: 100,
      unlocked: true,
      unlocked_at: '2026-02-15',
      category: 'research',
    },
    {
      id: 'five-applications',
      title: '🚀 Action Taker',
      description: 'Apply to 5 scholarships',
      points: 250,
      unlocked: false,
      progress: 3,
      total: 5,
      category: 'research',
    },
  ];
}
