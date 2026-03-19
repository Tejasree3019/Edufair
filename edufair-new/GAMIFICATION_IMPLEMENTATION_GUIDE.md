# Gamification System - Implementation Guide

## Overview
This guide covers the implementation of EduFair's Tier 1 Gamification System, including API endpoints, React components, and database integration.

## 📋 Architecture

```
Gamification System (Tier 1)
├── API Layer (/src/app/api/gamification/)
│   ├── route.ts (Core endpoints - GET/POST)
│   ├── leaderboard/route.ts (Top users)
│   ├── referrals/route.ts (Referral data & rewards)
│   └── achievements/route.ts (Achievements & progress)
├── Business Logic (/src/lib/)
│   ├── gamificationEngine.ts (Core logic - 600+ lines)
│   ├── whatsappChatbot.ts (Chatbot integration - 400+ lines)
│   └── dbGamification.ts (Database utilities - 170+ lines)
├── Frontend (/src/components/)
│   ├── GamificationDashboard.tsx (Main stats)
│   ├── Leaderboard.tsx (Top 100 users)
│   ├── BadgeCollection.tsx (Achievements grid)
│   └── ReferralWidget.tsx (Referral system)
├── Pages (/src/app/gamification/)
│   └── page.tsx (Hub with tabbed interface)
└── Database (/supabase/)
    └── schema_enhancements_tier1.sql (7 new tables)
```

## 🎯 API Endpoints

### Core Endpoints

#### 1. **GET /api/gamification**
Fetch user's gamification stats
```javascript
// Response
{
  success: true,
  data: {
    user_id: "user-123",
    total_points: 4250,
    current_level: 4,
    next_level_points: 5000,
    points_to_next_level: 750,
    badges_count: 8,
    referral_code: "EDU123456"
  }
}
```

#### 2. **POST /api/gamification/action**
Log user activity and award points
```javascript
// Request
{
  action_type: "complete_profile", // or "login", "apply", "scholarship_match", etc.
  action_data: {
    scholarship_id?: "sch-123",
    application_id?: "app-456"
  }
}

// Response
{
  success: true,
  points_awarded: 100,
  new_points: 4250,
  new_level: 4
}
```

#### 3. **GET /api/gamification/leaderboard**
Get top users by points
```javascript
// Query params: ?limit=100
// Response
{
  success: true,
  timeframe: "all_time",
  total_entries: 100,
  data: [
    {
      rank: 1,
      user_id: "user-1",
      user_name: "Rajesh Kumar",
      total_points: 12500,
      current_level: 12,
      badges_count: 18
    }
    // ... more users
  ]
}
```

#### 4. **GET /api/gamification/referrals**
Get user's referral information
```javascript
// Response
{
  success: true,
  data: {
    referral_code: "EDU123456",
    total_referrals: 15,
    active_referrals: 12,
    pending_referrals: 3,
    total_earned: 3000,
    referrals: [
      {
        id: "ref-1",
        referred_user: "Priya Singh",
        status: "completed",
        reward_earned: 250,
        created_at: "2025-01-15T10:30:00Z"
      }
      // ... more referrals
    ]
  }
}
```

#### 5. **POST /api/gamification/referrals/claim-reward**
Claim a referral reward
```javascript
// Request
{
  referral_id: "ref-1"
}

// Response
{
  success: true,
  message: "Reward claimed!",
  amount: 250
}
```

#### 6. **GET /api/gamification/achievements**
Get all achievements and user's progress
```javascript
// Response
{
  success: true,
  total_achievements: 18,
  unlocked_count: 8,
  total_points_earned: 2400,
  data: [
    {
      id: "ach-1",
      name: "First Steps",
      description: "Complete your profile",
      icon: "👤",
      points: 50,
      unlocked: true,
      unlocked_at: "2025-01-10T12:00:00Z"
    },
    {
      id: "ach-2",
      name: "Scholarship Explorer",
      description: "View 10 scholarships",
      icon: "🔍",
      points: 100,
      unlocked: false,
      progress: 7,
      target: 10
    }
    // ... more achievements
  ]
}
```

## 💾 Database Schema

### New Tables Created

1. **user_gamification**
   - Stores user's points, level, badges count
   - Associates with user profile

2. **user_achievements**
   - Tracks which achievements user has unlocked
   - Stores unlock timestamp and points

3. **user_referrals**
   - Stores referral code, relationship, status
   - Tracks reward amount

4. **user_activity_log**
   - Audit log of all user actions
   - Tracks point awards and reasons

5. **whatsapp_sessions**
   - Stores WhatsApp message history
   - Session management (24-hour TTL)

6. **notification_preferences**
   - User notification settings per channel

7. **user_success_stories**
   - User testimonials and success stories

### Key SQL Features
- Row-Level Security (RLS) for data isolation
- Stored procedures for point calculations
- Automatic leaderboard view generation
- Indexes on frequently queried columns
- Automatic TTL on WhatsApp sessions

## 🔧 Library Functions

### gamificationEngine.ts

```typescript
// Core functions available
calculateUserLevel(totalPoints: number): number
checkAchievements(userId: string, actionType: string, scholarships?: IScholarship[]): Promise<Achievement[]>
generateReferralCode(): string
rankScholarshipsForStudent(student: IUser, scholarships: IScholarship[], topN: number): RankedScholarship[]
getBadgeByName(name: string): Badge | undefined
getAchievementById(id: string): Achievement | undefined
```

### whatsappChatbot.ts

```typescript
// WhatsApp integration functions
recognizeIntent(userMessage: string): { intent: string; confidence: number; params: any }
sendWhatsAppMessage(phoneNumber: string, intent: string, params?: any): Promise<string>
createQuickStartMenu(): string
checkRateLimit(userId: string): boolean
handleUserResponse(message: string, sessionData: SessionData): Promise<Response>
```

### dbGamification.ts

```typescript
// Database abstraction functions
async getUserGamification(userId: string): Promise<GameStats>
async addUserPoints(userId: string, points: number, reason: string): Promise<{ new_points: number; new_level: number }>
async calculateLevel(totalPoints: number): Promise<number>
async getLeaderboard(limit?: number): Promise<LeaderboardUser[]>
async logActivity(userId: string, actionType: string, actionData?: any): Promise<void>
async getUserReferrals(userId: string): Promise<ReferralData>
async getAchievements(userId: string): Promise<Achievement[]>
```

## 🎨 React Components

### 1. GamificationDashboard
- Displays user's level, points, badges, referral code
- Progress bar to next level
- Quick action buttons
- **Props:** None (auto-fetches user data)
- **Location:** `/gamification` page, dashboard tab

### 2. Leaderboard
- Top 100 users by points
- Medal icons for top 3
- Rank, name, points, level, badges
- Sortable and filterable
- **Props:** None (auto-fetches)
- **Location:** `/gamification` page, leaderboard tab

### 3. BadgeCollection
- Achievement grid view
- Filter: All / Unlocked / Locked
- Progress bars for locked achievements
- Unlock dates for completed achievements
- **Props:** None
- **Location:** `/gamification` page, achievements tab

### 4. ReferralWidget
- Referral code display with copy button
- Share buttons (native share + link)
- Stats cards (referrals, active, pending, earned)
- Referral list with status
- **Props:** None
- **Location:** `/gamification` page, referrals tab

## 🚀 Implementation Steps

### Step 1: Deploy Database Schema
```bash
# 1. Open Supabase Dashboard
# 2. Go to SQL Editor
# 3. Create new query
# 4. Copy content from: /supabase/schema_enhancements_tier1.sql
# 5. Run query
# 6. Verify tables created:
#    - user_gamification
#    - user_achievements
#    - user_referrals
#    - user_activity_log
#    - whatsapp_sessions
#    - notification_preferences
#    - user_success_stories
```

### Step 2: Update Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# WhatsApp Integration (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=your_twilio_number
# OR
META_WHATSAPP_TOKEN=your_meta_token
META_VERIFY_TOKEN=your_verify_token
```

### Step 3: Update dbGamification.ts with Real Database
Replace mock implementations with Supabase queries:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Example: Replace mock getUserGamification
export async function getUserGamification(userId: string): Promise<GameStats> {
  const { data, error } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}
```

### Step 4: Integrate Components in Dashboard
```typescript
// In your dashboard or profile page
import { GamificationDashboard } from '@/components/GamificationDashboard';
import { ReferralWidget } from '@/components/ReferralWidget';

export default function ProfilePage() {
  return (
    <div>
      {/* Your profile content */}
      <GamificationDashboard />
      <ReferralWidget />
    </div>
  );
}
```

### Step 5: Add Navigation
```typescript
// In your nav component
<Link href="/gamification">
  <Zap className="h-5 w-5" />
  Gamification
</Link>
```

## 📊 Point System

| Action | Points |
|--------|--------|
| Login | 10 |
| Complete Profile | 50 |
| View Scholarship | 5 |
| Save Scholarship | 20 |
| Apply for Scholarship | 100 |
| Get Scholarship Match | 50 |
| Refer User (each) | 250 |
| View Timeline | 10 |
| Post Success Story | 200 |
| Help Other User | 75 |

## 🏆 Achievement System

| ID | Name | Description | Points |
|----|------|-------------|--------|
| ach_1 | First Steps | Complete your profile | 50 |
| ach_2 | Explorer | View 10 scholarships | 100 |
| ach_3 | Saver | Save 10 scholarships | 100 |
| ach_4 | Applicant | Apply for 5 scholarships | 150 |
| ach_5 | Connector | Refer 1 friend | 200 |
| ach_6 | Influencer | Refer 10 friends | 500 |
| ach_7 | Storyteller | Post success story | 200 |
| ach_8 | Helper | Help 5 community members | 250 |
| ach_9 | Speedster | Complete 3 applications in 1 day | 150 |
| ach_10 | Diligent | Log in 30 days in a row | 300 |

## 🔐 Security Considerations

1. **API Authentication**
   - All endpoints should verify user via JWT/session
   - Use `X-User-ID` header with proper validation
   - Implement rate limiting (see middleware/rateLimit.ts)

2. **Database Security**
   - Enable Row-Level Security (RLS) in Supabase
   - Users can only see their own data
   - Admins can see all data via service role

3. **WhatsApp Integration**
   - Verify webhook signature from Twilio/Meta
   - Encrypt stored message content
   - Implement rate limiting per phone number

4. **Referral System**
   - Validate referral codes before reward
   - Prevent duplicate referral claims
   - Audit trail for all reward transfers

## 📱 WhatsApp Integration

### Setup Instructions

1. **Get Twilio Credentials**
   ```
   - Sign up at twilio.com
   - Get Account SID, Auth Token
   - Set up WhatsApp Sandbox number
   - Configure webhook URL: https://yourdomain.com/api/whatsapp/webhook
   ```

2. **Configure Environment**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxx
   TWILIO_WHATSAPP_NUMBER=+1234567890
   ```

3. **Update Webhook Handler**
   - Uncomment Twilio integration in `/src/app/api/whatsapp/webhook/route.ts`
   - Deploy to production
   - Test with sample message

### Available Intents
- `start` - Display quick start menu
- `explore` - Browse scholarships
- `apply` - Start application
- `my_apps` - View applications
- `profile` - Update profile
- `referral` - Share referral code
- `help` - Get support
- `story` - Share success story

## 🧪 Testing

### API Testing
```bash
# Test GET endpoint
curl -X GET http://localhost:3000/api/gamification \
  -H "X-User-ID: test-user-123"

# Test POST endpoint
curl -X POST http://localhost:3000/api/gamification/action \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user-123" \
  -d '{
    "action_type": "login",
    "action_data": {}
  }'

# Test Leaderboard
curl http://localhost:3000/api/gamification/leaderboard?limit=50

# Test Achievements
curl -X GET http://localhost:3000/api/gamification/achievements \
  -H "X-User-ID: test-user-123"
```

### Component Testing
1. Navigate to `/gamification`
2. Verify each tab loads correctly
3. Test responsive design (mobile, tablet, desktop)
4. Verify data fetching and error handling

## 📈 Metrics & Monitoring

Track these KPIs:

1. **Engagement**
   - Daily active users
   - Points earned per user
   - Average level progression

2. **Referrals**
   - Total referrals created
   - Referral success rate
   - Revenue from referrals

3. **Achievements**
   - Most common unlocked achievement
   - Average achievement count per user
   - Time to unlock first achievement

4. **Leaderboard**
   - Top performer points
   - New entrants this week
   - User retention via gamification

## 🎯 Next Steps

1. ✅ API endpoints created
2. ✅ Components created
3. ⏳ Deploy schema to Supabase
4. ⏳ Replace mock data with real database
5. ⏳ Integrate WhatsApp webhooks
6. ⏳ Set up monitoring & analytics
7. ⏳ Beta test with 50 users
8. ⏳ Mobile app MVP (React Native)
9. ⏳ Extend to Tier 2 features

## 📞 Support

For issues or questions:
- Check database schema syntax
- Verify environment variables
- Test API endpoints with curl
- Check browser console for frontend errors
- Review Supabase logs for database errors

---
**Implementation Timeline:** 100-140 hours for full Tier 1  
**Current Status:** API and Components Complete, Database Integration Pending  
**Target Launch:** End of April 2026
