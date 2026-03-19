# Fix: Invalid UUID Error - Complete Solution

## The Problem
Error: "Failed to save profile: invalid input syntax for type uuid: "user_1773479840753""

This happens because the app was in **DEMO_MODE** which creates fake user IDs that don't match Supabase's UUID format requirement.

## The Solution

### Step 1: Disable Demo Mode ✅
Already done in `.env.local`:
```env
NEXT_PUBLIC_DEMO_MODE=false
```

### Step 2: Create Test Users in Supabase

Run this command to create test users in your Supabase database:

```bash
node scripts/create-test-users.js
```

This will create:
- **Email**: `student@example.com` | **Password**: `password123`
- **Email**: `demo@edufair.com` | **Password**: `demo123`
- **Email**: `admin@edufair.com` | **Password**: `admin123`

### Step 3: Test the Flow

1. **Restart your dev server** (Ctrl+C, then `npm run dev`)
2. Go to http://localhost:3000
3. Click **Sign In**
4. Enter credentials from Step 2
5. Fill out the profile form
6. Click **Complete Profile**
7. ✅ Should save successfully!

---

## What Changed

### Before (Demo Mode)
- ❌ Created fake users with non-UUID IDs like "user_1773479840753"
- ❌ Tried to save these to Supabase (which expects UUIDs)
- ❌ Got UUID validation error

### After (Real Supabase)
- ✅ Creates real users in Supabase with proper UUID format
- ✅ Gets JWT token with valid UUID
- ✅ Profile saves correctly to database

---

## Technical Details

### Files Changed

**1. `.env.local`**
- Changed `NEXT_PUBLIC_DEMO_MODE=true` → `NEXT_PUBLIC_DEMO_MODE=false`

**2. `src/lib/auth.ts`**
- Added real Supabase authentication for login/register
- When DEMO_MODE is false:
  - Queries Supabase database for users
  - Creates users with proper UUID format
  - Issues JWT tokens with valid UUIDs

**3. `scripts/create-test-users.js` (NEW)**
- Creates test users in Supabase
- Properly hashes passwords with bcrypt
- Returns valid UUIDs that the API can use

---

## Troubleshooting

### Script fails to run
```bash
# Make sure you have dependencies installed
npm install dotenv

# Then try again
node scripts/create-test-users.js
```

### Still getting UUID error after running script
1. Verify the script created users (check Supabase dashboard)
2. Restart your dev server
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try logging in and filling the profile form again

### Can't log in after creating users
1. Make sure demo mode is disabled (`NEXT_PUBLIC_DEMO_MODE=false`)
2. Try credentials from the test user creation output
3. Check that Supabase URL and keys are correct in `.env.local`

---

## For Production

Before deploying:
1. ✅ Ensure `NEXT_PUBLIC_DEMO_MODE=false` in your deployment
2. ✅ Create real user accounts in Supabase
3. ✅ Use proper password hashing
4. ✅ Test the entire flow (register → complete profile → dashboard)

---

## Summary

The app now properly uses Supabase authentication with valid UUIDs, so profile saving works correctly! 🎉
