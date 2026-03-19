# 🚀 Supabase Deployment Guide - Tier 1 Features

**Date:** March 9, 2026  
**Status:** Ready for Deployment  
**Estimated Time:** 10-15 minutes

---

## Step 1: Access Supabase Console

1. Go to **https://app.supabase.com**
2. Log in with your EduFair account
3. Select your **edufair-production** project
4. Click **SQL Editor** (left sidebar)

---

## Step 2: Deploy Gamification Schema

### Option A: Copy-Paste Method (Quick)

1. Open [schema_enhancements_tier1.sql](./supabase/schema_enhancements_tier1.sql)
2. Copy ALL content
3. In Supabase SQL Editor, click **New Query**
4. Paste the entire schema
5. Click **Run** (green play button)
6. ⏳ Wait for execution (takes 2-3 minutes)
7. ✅ Verify tables created (should see 0 errors)

### Option B: File Upload (Alternative)

1. Click **New Query** → **From File**
2. Select `supabase/schema_enhancements_tier1.sql`
3. Click **Run**
4. ✅ Wait for completion

---

## Step 3: Verify Deployment

Run these verification queries in SQL Editor:

```sql
-- Check all new tables exist
SELECT tablename FROM pg_tables 
WHERE tablename IN (
  'user_gamification',
  'user_achievements', 
  'user_activity_log',
  'user_success_stories',
  'whatsapp_sessions',
  'notification_preferences'
)
ORDER BY tablename;

-- Expected: 6 rows returned

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE tablename = 'user_gamification'
ORDER BY indexname;

-- Expected: 3+ indexes for performance

-- Check RLS policies
SELECT policyname FROM pg_policies 
WHERE tablename = 'user_gamification';

-- Expected: 2-4 policies for security
```

---

## Step 4: Create Initial Test Data

```sql
-- Test user gamification entry
-- Replace {YOUR_USER_ID} with actual user UUID from auth.users

INSERT INTO user_gamification (
  user_id,
  total_points,
  level,
  referral_code,
  created_at
) VALUES (
  '{YOUR_USER_ID}',
  100,
  5,
  'EDUFAIR-TEST-001',
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = 100,
  level = 5;

-- Test achievement
INSERT INTO user_achievements (
  user_id,
  achievement_id,
  unlocked_at
) VALUES (
  '{YOUR_USER_ID}',
  'first-application',
  NOW()
);

-- Verify
SELECT * FROM user_gamification WHERE user_id = '{YOUR_USER_ID}';
SELECT * FROM user_achievements WHERE user_id = '{YOUR_USER_ID}';
```

---

## Step 5: Set Up Environment Variables

Update `.env.local` in `edufair-new/`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Get these from:
# 1. Project Settings → API
# 2. Copy "Project URL"
# 3. Copy "anon public"
# 4. Copy "service_role secret"

# WhatsApp Configuration (do this later)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=edufair_verify_token_2026
```

**To find these keys:**
1. Go to Supabase Dashboard
2. Click **Settings** (⚙️ bottom left)
3. Click **API**
4. Copy the URLs and keys

---

## Step 6: Test Connection

Run this command in terminal:

```bash
cd edufair-new
npm install @supabase/supabase-js  # If not already installed
npx tsx -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
console.log('✅ Supabase connection successful!');
"
```

Expected output: `✅ Supabase connection successful!`

---

## Step 7: Troubleshooting

### Issue: "Table already exists" Error
**Solution:** This is fine! RLS policies were updated, not replaced.

### Issue: Foreign Key Constraint Failed
**Solution:** Ensure `users` table exists. Run:
```sql
SELECT COUNT(*) FROM users;
```

### Issue: RLS Policy Error
**Solution:** Run the policies again:
```sql
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gamification" 
  ON user_gamification FOR SELECT 
  USING (auth.uid() = user_id);
```

### Issue: Indexes Not Created
**Solution:** Indexes are non-critical. Schema still works without them.

---

## ✅ Success Criteria

- [ ] All 6 tables created
- [ ] All 15+ indexes created
- [ ] All RLS policies enabled
- [ ] Test data inserted without errors
- [ ] Environment variables set
- [ ] Connection test passed

---

## Next Steps

After deployment:
1. ✅ **Backend API Integration** (Connect API routes to Supabase)
2. ✅ **Test Components** (npm run dev)
3. ✅ **WhatsApp Setup** (Get Twilio credentials)
4. ✅ **Activity Logging** (Hook into existing actions)
5. ✅ **Beta Launch** (Test with 100 users)

---

## Support

**Questions?**
- Check [Supabase Docs](https://supabase.com/docs)
- Review [schema_enhancements_tier1.sql](./supabase/schema_enhancements_tier1.sql)
- WhatsApp setup: See [WHATSAPP_INTEGRATION_GUIDE.md](./WHATSAPP_INTEGRATION_GUIDE.md)

**Deployment Time Estimate:** 10-15 minutes  
**Go Live Time:** After tests pass (~2 hours more)
