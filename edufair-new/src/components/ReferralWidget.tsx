// Referral Widget Component
// Location: src/components/ReferralWidget.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Copy, Share2, Users, Gift, CheckCircle } from 'lucide-react';

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

interface ReferralData {
  referral_code: string;
  total_referrals: number;
  active_referrals: number;
  pending_referrals: number;
  total_earned: number;
  referrals: Array<{
    id: string;
    referred_user: string;
    status: 'pending' | 'completed';
    reward_earned: number;
    created_at: string;
  }>;
}

interface ReferralResponse {
  success: boolean;
  data: ReferralData;
}

export function ReferralWidget() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch('/api/gamification/referrals', {
          headers: {
            'X-User-ID': 'user-id-here', // Replace with actual user ID from auth
          },
        });
        const result: ReferralResponse = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        setError('Failed to load referral data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const handleCopyCode = () => {
    if (data?.referral_code) {
      navigator.clipboard.writeText(data.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = `https://edufair.com/register?ref=${data?.referral_code}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join EduFair',
        text: `Join EduFair and use my referral code ${data?.referral_code} to get rewards!`,
        url: shareUrl,
      });
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading referral data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="p-6 text-center">No referral data available</div>;
  }

  return (
    <div className="w-full space-y-6">
      {/* Main Referral Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Invite Friends & Earn Rewards
          </CardTitle>
          <CardDescription>Share your unique referral code and earn ₹250 per successful referral</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Referral Code Display */}
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <div className="text-sm text-gray-600 mb-2">Your Referral Code</div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-2xl font-bold text-blue-600">{data.referral_code}</code>
              <button
                onClick={handleCopyCode}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={() => window.open(shareUrl, '_blank')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
            >
              <Gift className="h-4 w-4" />
              Referral Link
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.total_referrals}</div>
              <div className="text-sm text-gray-600 mt-1">Total Referrals</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.active_referrals}</div>
              <div className="text-sm text-gray-600 mt-1">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{data.pending_referrals}</div>
              <div className="text-sm text-gray-600 mt-1">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">₹{data.total_earned.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Earned</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      {data.referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>Track your recent referrals and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">{referral.referred_user}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={referral.status === 'completed' ? 'default' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {referral.status === 'completed' && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      {referral.status === 'completed' ? 'Completed' : 'Pending'}
                    </Badge>
                    <div className="font-semibold text-green-600 w-20 text-right">
                      +₹{referral.reward_earned}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.referrals.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No referrals yet. Share your code to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ReferralWidget;
