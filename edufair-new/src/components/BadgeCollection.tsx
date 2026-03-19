// Badge Collection Component
// Location: src/components/BadgeCollection.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Star, Lock } from 'lucide-react';

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

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  target?: number;
}

interface AchievementsData {
  success: boolean;
  total_achievements: number;
  unlocked_count: number;
  total_points_earned: number;
  data: Achievement[];
}

export function BadgeCollection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/gamification/achievements', {
          headers: {
            'X-User-ID': 'user-id-here', // Replace with actual user ID from auth
          },
        });
        const data: AchievementsData = await response.json();
        if (data.success) {
          setAchievements(data.data);
        }
      } catch (err) {
        setError('Failed to load achievements');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  if (loading) {
    return <div className="p-6 text-center">Loading achievements...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="w-full space-y-6">
      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
          <CardDescription>
            {unlockedCount} of {achievements.length} achievements unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{unlockedCount}</div>
              <div className="text-sm text-gray-600">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400">
                {achievements.length - unlockedCount}
              </div>
              <div className="text-sm text-gray-600">Locked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({achievements.length})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'unlocked'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Unlocked ({unlockedCount})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'locked'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Locked ({achievements.length - unlockedCount})
        </button>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition transform hover:scale-105 ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300'
                : 'bg-gray-50 border-gray-300 opacity-60'
            }`}
          >
            {/* Badge Icon */}
            <div className="text-4xl mb-2 text-center">{achievement.icon}</div>

            {/* Lock Indicator */}
            {!achievement.unlocked && (
              <div className="absolute top-2 right-2">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            )}

            {/* Badge Name & Description */}
            <div className="text-center mb-3">
              <h3 className="font-semibold text-sm text-gray-900 mb-1">{achievement.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{achievement.description}</p>
            </div>

            {/* Points */}
            <div className="flex items-center justify-center gap-1 text-yellow-600 font-medium text-sm mb-2">
              <Star className="h-4 w-4" />
              {achievement.points}
            </div>

            {/* Progress Bar (for locked achievements) */}
            {!achievement.unlocked && achievement.progress !== undefined && achievement.target && (
              <div className="mt-2">
                <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{
                      width: `${(achievement.progress / achievement.target) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1 text-center">
                  {achievement.progress}/{achievement.target}
                </div>
              </div>
            )}

            {/* Unlocked Date */}
            {achievement.unlocked && achievement.unlocked_at && (
              <div className="text-xs text-gray-600 text-center">
                {new Date(achievement.unlocked_at).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BadgeCollection;
