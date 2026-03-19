# Database Schema Migration Guide

## Problem
The profile saving feature requires some columns that might not exist in your current Supabase database schema:
- `profile_completed`
- `email_verified`
- `avatar_url`
- `last_login`

## Solution
Add these columns to your Supabase `users` table.

### Option 1: Direct SQL (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your EduFair project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Paste the SQL below
6. Click **Run**

```sql
-- Add missing columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
```

### Option 2: UI-Based (Supabase Dashboard)

1. Go to **Database** → **Tables** → **users**
2. Click **+ Add Column** button
3. Add each column with these settings:

#### Column 1: profile_completed
- **Name**: `profile_completed`
- **Type**: `Boolean`
- **Default value**: `false`
- **Is nullable**: `false`

#### Column 2: email_verified
- **Name**: `email_verified`
- **Type**: `Boolean`
- **Default value**: `false`
- **Is nullable**: `false`

#### Column 3: avatar_url
- **Name**: `avatar_url`
- **Type**: `Text`
- **Is nullable**: `true`

#### Column 4: last_login
- **Name**: `last_login`
- **Type**: `Timestamp with timezone`
- **Is nullable**: `true`

### Option 3: Verify with SQL (Check if columns exist)

Run this query to verify the columns exist:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

Should see these columns:
- ✅ profile_completed (boolean)
- ✅ email_verified (boolean)
- ✅ avatar_url (text)
- ✅ last_login (timestamp with time zone)

## After Migration

Once you've added the columns:

1. Go back to your application
2. Try the profile form again
3. It should now save successfully! ✅

## Troubleshooting

### Still getting column errors?
- Refresh the Supabase dashboard
- Clear browser cache (Ctrl + Shift + Delete)
- Restart your dev server (Ctrl+C, then `npm run dev`)

### Can't find SQL Editor?
- Make sure you're logged into Supabase
- Make sure you've selected the correct project
- It should be in the left sidebar under **SQL Editor**

## What Changed?

The API now automatically retries without `profile_completed` if the column doesn't exist, so you shouldn't see the error even before adding the columns. However, adding them will enable full profile completion tracking.

