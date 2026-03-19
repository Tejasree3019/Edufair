# ✅ TIER 1 DEPLOYMENT CHECKLIST

**Start Date:** March 9, 2026  
**Target Launch:** March 9, 2026 (same day if possible)  
**Status:** Getting Started 🚀

---

## 📍 PHASE 1: SUPABASE DEPLOYMENT

### Pre-Deployment
- [ ] Access Supabase console: https://app.supabase.com
- [ ] Have Supabase credentials ready
- [ ] Open VS Code with project
- [ ] View: `supabase/schema_enhancements_tier1.sql`

### Schema Deployment
- [ ] Step 1: Copy schema file content
- [ ] Step 2: Open Supabase SQL Editor
- [ ] Step 3: Create new query
- [ ] Step 4: Paste schema SQL
- [ ] Step 5: Run query (click ▶️)
- [ ] Step 6: Wait for success message

### Post-Deployment Verification

**Verification Query 1: Tables Created**
- [ ] Run query to check tables
- [ ] Expected: 6 rows returned
- [ ] Tables created:
  - [ ] user_gamification
  - [ ] user_achievements
  - [ ] user_activity_log
  - [ ] user_success_stories
  - [ ] whatsapp_sessions
  - [ ] notification_preferences

**Verification Query 2: Indexes Created**
- [ ] Run query to check indexes
- [ ] Expected: 15+ rows returned
- [ ] Indexes working for:
  - [ ] Points leaderboard
  - [ ] Level distribution
  - [ ] Activity logs
  - [ ] Achievements

**Verification Query 3: RLS Policies**
- [ ] Run query to check policies
- [ ] Expected: 5+ rows returned
- [ ] Policies enforced:
  - [ ] user_gamification - SELECT
  - [ ] user_achievements - SELECT
  - [ ] user_activity_log - SELECT/INSERT

### Phase 1 Status
- [ ] All 3 verification queries passed
- [ ] No SQL errors
- [ ] Database ready for use

**⏱️ Time to Complete:** 15 minutes  
**Status:** ⏳ Pending → ✅ Complete

---

## 📍 PHASE 2: ENVIRONMENT VARIABLES

### Gather Credentials

**From Supabase Console:**
- [ ] Project URL: `https://xxxxx.supabase.co`
- [ ] Anon Key: `eyJ...` (public)
- [ ] Service Role Key: `eyJ...` (private)

**From Twilio (if using sandbox):**
- [ ] Account SID: `ACxxxx...`
- [ ] Auth Token: `xxxx...`
- [ ] WhatsApp Number: `+1415...`

### Create .env.local

- [ ] Open: `edufair-new/.env.local`
- [ ] Add Supabase vars:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] Add WhatsApp vars (placeholders if not ready):
  - [ ] WHATSAPP_MODE=twilio
  - [ ] TWILIO_ACCOUNT_SID
  - [ ] TWILIO_AUTH_TOKEN
  - [ ] TWILIO_WHATSAPP_NUMBER
  - [ ] WHATSAPP_VERIFY_TOKEN
- [ ] Save file

### Verification

- [ ] .env.local file exists
- [ ] All 7 required variables set
- [ ] No file in git (.gitignore included)
- [ ] Values are non-empty strings

**⏱️ Time to Complete:** 10 minutes  
**Status:** ⏳ Pending → ✅ Complete

---

## 📍 PHASE 3: TWILIO SETUP

### Account Creation
- [ ] Visit: https://www.twilio.com/try-twilio
- [ ] Create account
- [ ] Verify email
- [ ] Get to Twilio console

### WhatsApp Sandbox
- [ ] Go to: Messaging → WhatsApp Sandbox
- [ ] Find sandbox number (e.g., "+1 415 523 8886")
- [ ] Copy code (e.g., "join XXXXX-XXXXX")
- [ ] Send test message from personal WhatsApp:
  - [ ] To sandbox number
  - [ ] Message: `join XXXXX-XXXXX`
  - [ ] Receive confirmation: "You have joined the sandbox!"

### Get Credentials

**From Twilio Console:**
- [ ] Account SID (3 characters + 30 chars)
- [ ] Auth Token (64 character string)
- [ ] WhatsApp Number (sandbox number)

### Update .env.local

```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+14155238886
```

- [ ] Update file
- [ ] Save
- [ ] Verify no secrets in git

### Test Connection

- [ ] Send test WhatsApp message from code
- [ ] Verify message received
- [ ] Check Twilio console logs

**Note:** If using Meta API instead, follow similar process with Meta Business Platform

**⏱️ Time to Complete:** 60-90 minutes (includes waiting for account approval)  
**Status:** ⏳ Pending → ✅ Complete

---

## 📍 PHASE 4: LOCAL TESTING

### Install Dependencies
- [ ] Run: `npm install`
- [ ] Wait for completion
- [ ] No errors

### Start Server
- [ ] Run: `npm run dev`
- [ ] Expected: "Local: http://localhost:3000/"
- [ ] No startup errors
- [ ] Server running ✅

### Test Gamification API

**Test 1: Get User Data**
- [ ] Run: `curl "http://localhost:3000/api/gamification?userId=test-user-1"`
- [ ] Response status: 200
- [ ] Returns user gamification object
- [ ] total_points: 0
- [ ] level: 1

**Test 2: Award Points (Login)**
- [ ] Send POST to `/api/gamification`
- [ ] Body: `{"userId": "test-user-1", "action_type": "login"}`
- [ ] Response: success: true
- [ ] points_awarded: 5
- [ ] new_points: 5
- [ ] new_level: 1

**Test 3: Award Points (Application)**
- [ ] Send POST to `/api/gamification`
- [ ] Body: `{"userId": "test-user-1", "action_type": "application_submit"}`
- [ ] Response: success: true
- [ ] points_awarded: 20
- [ ] new_points: 25

**Test 4: Check Leaderboard**
- [ ] Run: `curl "http://localhost:3000/api/gamification/leaderboard?limit=10"`
- [ ] Returns array of users
- [ ] Sorted by points DESC

### Test Components

- [ ] Visit: http://localhost:3000/gamification
- [ ] Page loads (no 404)
- [ ] See 4 tabs: Dashboard | Leaderboard | Achievements | Referrals
- [ ] Dashboard shows stats
- [ ] Leaderboard shows users
- [ ] Achievements shows badges
- [ ] Referrals shows code/stats

### Check Console

- [ ] Open browser dev tools (F12)
- [ ] Console tab: no errors
- [ ] Network tab: all requests 200/201
- [ ] Performance: load time < 2s

**⏱️ Time to Complete:** 30 minutes  
**Status:** ⏳ Pending → ✅ Complete

---

## 📍 PHASE 5: INTEGRATION

### Add Activity Logging

**Integration Point 1: Login Route**
- [ ] Open: `src/app/api/auth/login/route.ts`
- [ ] Add: `import { logUserActivity } from '@/middleware/activityLogger'`
- [ ] After login success, add: `await logUserActivity(userId, 'login', {...})`
- [ ] Test: User gets 5 points

**Integration Point 2: Application Submit**
- [ ] Open: `src/app/api/applications/submit/route.ts`
- [ ] Add: `await logUserActivity(userId, 'application_submit', {...})`
- [ ] Test: User gets 20 points

**Integration Point 3: Profile Update**
- [ ] Open: `src/app/api/profile/update/route.ts`
- [ ] Add: `await logUserActivity(userId, 'profile_update', {...})`
- [ ] Test: User gets 10 points

**Integration Point 4: Scholarship Save**
- [ ] Open: `src/app/api/scholarships/save/route.ts`
- [ ] Add: `await logUserActivity(userId, 'scholarship_saved', {...})`
- [ ] Test: User gets 2 points

### Verify Integration

- [ ] User logs in → points awarded (+5)
- [ ] User saves scholarship → points awarded (+2)
- [ ] User applies → points awarded (+20)
- [ ] User updates profile → points awarded (+10)
- [ ] Leaderboard updates
- [ ] No errors in logs

### Build for Production

- [ ] Run: `npm run build`
- [ ] Build completes: "Compiled successfully"
- [ ] Build size reasonable (~150KB)
- [ ] No TypeScript errors

**⏱️ Time to Complete:** 60-90 minutes  
**Status:** ⏳ Pending → ✅ Complete

---

## 🎉 FINAL VERIFICATION

### System Ready for Launch

- [ ] All 5 phases complete
- [ ] All tests passing
- [ ] No errors in logs
- [ ] Database responsive
- [ ] APIs working
- [ ] WhatsApp connected

### Key Features Working

- [ ] Users earn points ✅
- [ ] Points persist in database ✅
- [ ] Leaderboard updates ✅
- [ ] Badges unlock ✅
- [ ] WhatsApp messages send ✅
- [ ] Activity logged ✅
- [ ] RLS policies enforced ✅

### Deployment Decision

- [ ] Ready for production? YES / NO
- [ ] If NO → What needs fixing?
- [ ] If YES → Deploy now!

---

## 📊 DEPLOYMENT SUMMARY

| Phase | Task | Status | Time | Notes |
|-------|------|--------|------|-------|
| 1 | Supabase Deploy | ⏳ | 15 min | Tables, indexes, policies |
| 2 | Env Variables | ⏳ | 10 min | Credentials setup |
| 3 | Twilio Setup | ⏳ | 90 min | WhatsApp sandbox |
| 4 | Local Testing | ⏳ | 30 min | All APIs working |
| 5 | Integration | ⏳ | 90 min | Activity logging |
| **Total** | **All Phases** | **⏳** | **~4 hours** | **Launch Ready** |

---

## 🎯 Success Metrics (Track After Launch)

Track these during first week:

- [ ] Daily Active Users (target: 20-30%)
- [ ] Points Awarded (target: 100-200/day)
- [ ] Badges Unlocked (target: 10-15%)
- [ ] Referrals Generated (target: 5-10)
- [ ] WhatsApp Messages (target: 50-100/day)
- [ ] System Uptime (target: 99.9%)

---

## 📝 Notes

**Date Started:** March 9, 2026  
**Date Completed:** ___________  
**Issues Encountered:** None yet  
**Lessons Learned:** ___________  

---

**Ready to start Phase 1? Go to DEPLOYMENT_EXECUTION_GUIDE.md for step-by-step instructions!**
