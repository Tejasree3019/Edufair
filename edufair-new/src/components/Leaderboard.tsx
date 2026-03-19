// Leaderboard Component
// Location: src/components/Leaderboard.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Medal, Flame } from 'lucide-react';

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

interface LeaderboardUser {
  rank: number;
  user_id: string;
  user_name: string;
  total_points: number;
  current_level: number;
  badges_count: number;
}

interface LeaderboardData {
  success: boolean;
  total_entries: number;
  data: LeaderboardUser[];
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/gamification/leaderboard?limit=100');
        const data: LeaderboardData = await response.json();
        if (data.success) {
          setLeaderboard(data.data);
        }
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Medal className="h-5 w-5 text-yellow-500" />
          Top Users by Points
        </CardTitle>
        <CardDescription>Global leaderboard - Top {leaderboard.length} users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Rank</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">User</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Points</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Level</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr
                  key={user.user_id}
                  className={`border-b hover:bg-gray-50 transition ${
                    index < 3 ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg w-6">
                        {getMedalIcon(user.rank) || `#${user.rank}`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{user.user_name}</div>
                      <div className="text-xs text-gray-500">{user.user_id}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="secondary">{user.total_points.toLocaleString()}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-semibold">L{user.current_level}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="outline">{user.badges_count}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default Leaderboard;
