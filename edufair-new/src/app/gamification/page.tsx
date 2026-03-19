'use client';

// Gamification Hub Page
// Location: src/app/gamification/page.tsx

import { GamificationDashboard } from '@/components/GamificationDashboard';
import { Leaderboard } from '@/components/Leaderboard';
import { BadgeCollection } from '@/components/BadgeCollection';
import { ReferralWidget } from '@/components/ReferralWidget';
import { Trophy, Target, Users, Zap } from 'lucide-react';
import { ReactNode, useState } from 'react';

// Simple Tabs Components
function Tabs({ children, defaultValue }: { children: ReactNode; defaultValue: string; className?: string }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div className="w-full">
      {/* Render all children and handle tab switching at page level */}
      {Array.isArray(children) && children.map((child: any) => {
        if (child?.type?.name === 'TabsList') {
          return <div key="list" onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.hasAttribute('data-tab-value')) {
              setActiveTab(target.getAttribute('data-tab-value') || defaultValue);
            }
          }}>{child}</div>;
        }
        if (child?.type?.name === 'TabsContent' && child?.props?.value === activeTab) {
          return <div key={child.props.value}>{child}</div>;
        }
        return child;
      })}
    </div>
  );
}

function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className} role="tablist">
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  return (
    <button
      role="tab"
      data-tab-value={value}
      className={`px-4 py-2 font-medium transition hover:bg-blue-700 ${className || ''}`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  return <div role="tabpanel" data-value={value} className={className}>{children}</div>;
}

export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Gamification Hub</h1>
          <p className="text-blue-100">Earn points, unlock badges, climb the leaderboard, and get rewarded</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Referrals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="w-full">
            <GamificationDashboard />
          </TabsContent>

          <TabsContent value="leaderboard" className="w-full">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="achievements" className="w-full">
            <BadgeCollection />
          </TabsContent>

          <TabsContent value="referrals" className="w-full">
            <ReferralWidget />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
