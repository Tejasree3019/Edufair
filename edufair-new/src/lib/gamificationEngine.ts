/**
 * GAMIFICATION ENGINE FOR EDUFAIR
 * 
 * Implements achievement system, points, badges, and referral tracking
 * to increase user engagement and drive organic growth
 */

import type { User } from '@/types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  requirement: string;
  category: 'milestone' | 'social' | 'research' | 'success';
}

export interface UserGamification {
  user_id: string;
  total_points: number;
  badges_earned: string[];
  current_streak: number; // Days of consecutive activity
  referral_code: string;
  referrals_count: number;
  referral_earnings: number; // ₹ or $ earned from referrals
  level: number; // 1-100 (based on points)
  leaderboard_rank: number;
}

/**
 * ACHIEVEMENT DEFINITIONS
 * These unlock as users progress through the platform
 */
export const ACHIEVEMENTS: Record<string, Achievement> = {
  'first-login': {
    id: 'first-login',
    title: '🎯 First Step',
    description: 'Create your account and complete profile',
    points: 50,
    icon: '🎯',
    requirement: 'Sign up and fill profile',
    category: 'milestone',
  },

  'first-application': {
    id: 'first-application',
    title: '📝 First Application',
    description: 'Submit your first scholarship application',
    points: 100,
    icon: '📝',
    requirement: 'Submit 1 application',
    category: 'research',
  },

  'five-applications': {
    id: 'five-applications',
    title: '🚀 Action Taker',
    description: 'Apply to 5 scholarships',
    points: 250,
    icon: '🚀',
    requirement: 'Submit 5+ applications',
    category: 'research',
  },

  'ten-applications': {
    id: 'ten-applications',
    title: '💪 Persistent Applicant',
    description: 'Apply to 10 scholarships (seriously committed!)',
    points: 500,
    icon: '💪',
    requirement: 'Submit 10+ applications',
    category: 'success',
  },

  'profile-complete': {
    id: 'profile-complete',
    title: '✨ Profile Master',
    description: 'Complete all profile sections',
    points: 150,
    icon: '✨',
    requirement: 'Fill all profile details',
    category: 'milestone',
  },

  'first-referral': {
    id: 'first-referral',
    title: '🤝 Referral Ambassador',
    description: 'Refer a friend to EduFair',
    points: 200,
    icon: '🤝',
    requirement: 'Successfully refer 1 friend',
    category: 'social',
  },

  'five-referrals': {
    id: 'five-referrals',
    title: '🌟 Social Butterfly',
    description: 'Refer 5 friends to EduFair',
    points: 500,
    icon: '🌟',
    requirement: 'Successfully refer 5 friends',
    category: 'social',
  },

  'ten-referrals': {
    id: 'ten-referrals',
    title: '👑 Influencer',
    description: 'Refer 10+ friends and help them win scholarships',
    points: 1000,
    icon: '👑',
    requirement: 'Successfully refer 10+ friends',
    category: 'social',
  },

  'scholarship-won': {
    id: 'scholarship-won',
    title: '🏆 Winner!',
    description: 'Your first scholarship application was accepted',
    points: 2000,
    icon: '🏆',
    requirement: 'Get accepted to a scholarship',
    category: 'success',
  },

  'viral-referral': {
    id: 'viral-referral',
    title: '🔥 Viral Growth',
    description: '20+ friends join through your referral link',
    points: 2000,
    icon: '🔥',
    requirement: 'Get 20+ referral signups',
    category: 'social',
  },

  'daily-streak-7': {
    id: 'daily-streak-7',
    title: '🔥 Weekly Warrior',
    description: 'Log in 7 days in a row',
    points: 300,
    icon: '🔥',
    requirement: '7-day login streak',
    category: 'milestone',
  },

  'daily-streak-30': {
    id: 'daily-streak-30',
    title: '⚡ Monthly Champion',
    description: 'Log in 30 days in a row (full month!)',
    points: 1000,
    icon: '⚡',
    requirement: '30-day login streak',
    category: 'milestone',
  },

  'scholarship-researcher': {
    id: 'scholarship-researcher',
    title: '🔍 Researcher',
    description: 'View details for 20 different scholarships',
    points: 400,
    icon: '🔍',
    requirement: 'Research 20 scholarships deeply',
    category: 'research',
  },

  'financial-planner': {
    id: 'financial-planner',
    title: '💰 Financial Strategist',
    description: 'Use the fee recommendation tool',
    points: 300,
    icon: '💰',
    requirement: 'Generate fee recommendation',
    category: 'research',
  },

  'community-member': {
    id: 'community-member',
    title: '👥 Community Hero',
    description: 'Share your scholarship success story',
    points: 500,
    icon: '👥',
    requirement: 'Post success story/testimonial',
    category: 'social',
  },

  'first-saved-scholarship': {
    id: 'first-saved-scholarship',
    title: '📌 Bookmark Expert',
    description: 'Save your first scholarship to favorites',
    points: 50,
    icon: '📌',
    requirement: 'Save 1 scholarship',
    category: 'milestone',
  },
};

/**
 * Calculate points based on user activity
 */
export function calculateUserPoints(
  applicationsCount: number,
  referralsCount: number,
  profileCompletion: number, // 0-100%
  successfulApplications: number,
  daysActive: number
): number {
  let totalPoints = 0;

  // Base points for applications
  totalPoints += applicationsCount * 20;

  // Bonus for multiple applications (exponential growth)
  if (applicationsCount >= 5) totalPoints += 100;
  if (applicationsCount >= 10) totalPoints += 200;

  // Referral points
  totalPoints += referralsCount * 50;

  // Profile completion bonus
  totalPoints += Math.floor(profileCompletion * 2);

  // Successful applications (big bonus)
  totalPoints += successfulApplications * 500;

  // Daily active streak
  totalPoints += Math.floor(daysActive * 5);

  return totalPoints;
}

/**
 * Determine user level based on points
 * Level goes from 1 to 100
 */
export function calculateUserLevel(points: number): number {
  // Level 1: 0-500 points
  // Level 10: 5000 points
  // Level 50: 125,000 points
  // Level 100: 500,000 points

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
 * Check which achievements user has unlocked
 */
export function checkAchievements(
  applicationsCount: number,
  referralsCount: number,
  profileCompletion: number,
  successfulApplications: number,
  currentStreak: number,
  hasPostedStory: boolean,
  scholarshipsViewed: number,
  hasUsedFeeCalculator: boolean
): string[] {
  const unlockedAchievements: string[] = [];

  // Milestone achievements
  if (profileCompletion === 100) {
    unlockedAchievements.push('profile-complete');
  }
  if (applicationsCount >= 1) {
    unlockedAchievements.push('first-application');
  }
  if (applicationsCount >= 5) {
    unlockedAchievements.push('five-applications');
  }
  if (applicationsCount >= 10) {
    unlockedAchievements.push('ten-applications');
  }

  // Referral achievements
  if (referralsCount >= 1) {
    unlockedAchievements.push('first-referral');
  }
  if (referralsCount >= 5) {
    unlockedAchievements.push('five-referrals');
  }
  if (referralsCount >= 10) {
    unlockedAchievements.push('ten-referrals');
  }
  if (referralsCount >= 20) {
    unlockedAchievements.push('viral-referral');
  }

  // Success achievements
  if (successfulApplications >= 1) {
    unlockedAchievements.push('scholarship-won');
  }

  // Streak achievements
  if (currentStreak >= 7) {
    unlockedAchievements.push('daily-streak-7');
  }
  if (currentStreak >= 30) {
    unlockedAchievements.push('daily-streak-30');
  }

  // Research achievements
  if (scholarshipsViewed >= 20) {
    unlockedAchievements.push('scholarship-researcher');
  }
  if (hasUsedFeeCalculator) {
    unlockedAchievements.push('financial-planner');
  }

  // Social achievements
  if (hasPostedStory) {
    unlockedAchievements.push('community-member');
  }

  return unlockedAchievements;
}

/**
 * Generate unique referral code for user
 */
export function generateReferralCode(userId: string): string {
  // Format: EDUFAIR-ABC123DEF
  const shortId = userId.substring(0, 6).toUpperCase();
  const randomStr = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
  return `EDUFAIR-${shortId}${randomStr}`;
}

/**
 * Validate referral code
 */
export function validateReferralCode(code: string): boolean {
  return code.startsWith('EDUFAIR-') && code.length === 16;
}

/**
 * Calculate referral reward
 */
export function calculateReferralReward(referralTier: number): number {
  // Tier 1: Friend signs up = ₹50
  // Tier 2: Friend applies to scholarship = ₹100  
  // Tier 3: Friend wins scholarship = ₹500
  const rewards: Record<number, number> = {
    1: 50,
    2: 100,
    3: 500,
  };
  return rewards[referralTier] || 0;
}

/**
 * Get leaderboard for gamification
 */
export interface LeaderboardEntry {
  rank: number;
  user_name: string;
  points: number;
  level: number;
  achievements_count: number;
  referrals_count: number;
}

/**
 * Suggest next badge based on current progress
 */
export function suggestNextBadge(
  currentAchievements: string[],
  applicationsCount: number,
  referralsCount: number,
  profileCompletion: number
): Achievement | null {
  // Check which achievements are close to being unlocked

  if (!currentAchievements.includes('first-application') && applicationsCount === 0) {
    return ACHIEVEMENTS['first-application'] ?? null;
  }

  if (!currentAchievements.includes('five-applications') && applicationsCount >= 2) {
    return ACHIEVEMENTS['five-applications'] ?? null;
  }

  if (!currentAchievements.includes('profile-complete') && profileCompletion >= 60) {
    return ACHIEVEMENTS['profile-complete'] ?? null;
  }

  if (!currentAchievements.includes('first-referral') && referralsCount === 0) {
    return ACHIEVEMENTS['first-referral'] ?? null;
  }

  // If all close badges are done, suggest bigger ones
  if (applicationsCount >= 5) {
    return ACHIEVEMENTS['scholarship-won'] ?? null;
  }

  return null;
}

/**
 * Export types for database schema
 */
export interface GamificationDBSchema {
  user_gamification: {
    user_id: string;
    total_points: number;
    badges_earned: string[];
    current_streak: number;
    referral_code: string;
    referrals_count: number;
    referral_earnings: number;
    level: number;
    leaderboard_rank: number;
    created_at: string;
    updated_at: string;
  };
  referrals: {
    id: string;
    referrer_id: string;
    referred_user_id: string;
    referral_code: string;
    status: 'pending' | 'signed_up' | 'applied' | 'won_scholarship';
    reward_tier: number;
    created_at: string;
    updated_at: string;
  };
  achievement_unlocks: {
    id: string;
    user_id: string;
    achievement_id: string;
    unlocked_at: string;
  };
  user_activity_log: {
    id: string;
    user_id: string;
    activity_type: string;
    activity_data: Record<string, unknown>;
    points_earned: number;
    created_at: string;
  };
}
