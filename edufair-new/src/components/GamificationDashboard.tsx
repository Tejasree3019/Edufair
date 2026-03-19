// Gamification Dashboard Component
// Location: src/components/GamificationDashboard.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Zap, Target, Share2 } from 'lucide-react';

// Simple Card component - replacement for shadcn
const Card = ({ children, className }: any) => (
  <div className={`border rounded-lg bg-white shadow-sm ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children }: any) => <div className="px-6 py-4 border-b">{children}</div>;
const CardTitle = ({ children }: any) => <h3 className="text-lg font-semibold">{children}</h3>;
const CardDescription = ({ children }: any) => <p className="text-sm text-gray-600">{children}</p>;
const CardContent = ({ children }: any) => <div className="px-6 py-4">{children}</div>;

// Simple Badge component - replacement for shadcn
const Badge = ({ children, className }: any) => (
  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ${className}`}>
    {children}
  </span>
);

interface GameStats {
  user_id: string;
  total_points: number;
  current_level: number;
  next_level_points: number;
  points_to_next_level: number;
  badges_count: number;
  referral_code: string;
}

interface DashboardData {
  success: boolean;
  data: GameStats;
}

export function GamificationDashboard() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/gamification', {
          headers: {
            'X-User-ID': 'user-id-here', // Replace with actual user ID from auth
          },
        });
        const data: DashboardData = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        setError('Failed to load gamification stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading gamification stats...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!stats) {
    return <div className="p-6 text-center">No data available</div>;
  }

  const progressPercentage = Math.min(
    ((stats.total_points - (stats.current_level - 1) * 1000) / 1000) * 100,
    100
  );

  return (
    <div className="w-full space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Your Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats.current_level}</div>
                <p className="text-xs text-gray-500 mt-1">Level {stats.current_level}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        {/* Points Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{stats.total_points.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Earned all-time</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Badges Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">{stats.badges_count}</div>
                <p className="text-xs text-gray-500 mt-1">Achievements unlocked</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Referral Code Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Referral Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="text-lg px-2 py-1">
                  {stats.referral_code}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">Share to earn</p>
              </div>
              <Share2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Level */}
      <Card>
        <CardHeader>
          <CardTitle>Progress to Next Level</CardTitle>
          <CardDescription>
            Level {stats.current_level + 1} - {stats.points_to_next_level} points remaining
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{stats.total_points - (stats.current_level - 1) * 1000}/{1000}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium">View Achievements</div>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-sm font-medium">Leaderboard</div>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium">My Referrals</div>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition text-center">
            <div className="text-2xl mb-2">🎁</div>
            <div className="text-sm font-medium">Rewards</div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export default GamificationDashboard;
