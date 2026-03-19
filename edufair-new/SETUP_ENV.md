# EduFair Environment Setup Guide

## Quick Start - Required Environment Variables

### Step 1: Get Your Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Select your EduFair project
3. Click **Settings** → **API**
4. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Create .env.local File
1. In the `edufair-new` directory, create a file named `.env.local`
2. Copy the content from `.env.example`
3. Fill in your values from Step 1:

```env
# Required - Get from Supabase API settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...

# Required - Generate or use existing JWT secret (min 32 characters)
JWT_SECRET=abcd1234efgh5678ijkl9012mnop3456qrst

# Optional - Set to match your environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Restart it
npm run dev
```

## Troubleshooting

### "Failed to update profile: TypeError: fetch failed"
**Cause**: Missing or invalid Supabase credentials

**Solution**:
1. ✅ Check that `.env.local` file exists in `edufair-new/` directory
2. ✅ Verify `NEXT_PUBLIC_SUPABASE_URL` is not empty
3. ✅ Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is not empty
4. ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is not empty
5. ✅ Restart the development server after creating `.env.local`

### "Server configuration error - Supabase not available"
**Cause**: `SUPABASE_SERVICE_ROLE_KEY` is missing

**Solution**:
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- This is the **Service Role Key**, NOT the Anon Key
- Get it from: Supabase Dashboard → Settings → API → Service Role Key

### Environment Variables Still Not Working
1. Delete `.next` folder: `rm -rf .next`
2. Restart the development server
3. Try the operation again

## Important Security Notes

⚠️ **DO NOT COMMIT** `.env.local` to version control
- It contains secret keys
- Add `.env.local` to `.gitignore` (already done)

⚠️ **Service Role Key is SECRET**
- Never share it with anyone
- Never expose it to the browser
- It's only for server-side code

✅ **Anon Key is PUBLIC**
- Safe to expose in browser code
- Used for client-side API requests

## File Locations

```
edufair-new/
├── .env.local          ← CREATE THIS FILE (private, secret)
├── .env.example        ← Template file (safe to commit)
├── .gitignore          ← Already configured to ignore .env.local
└── src/
    └── app/
        └── api/
            └── users/
                └── profile/
                    └── route.ts  ← Uses SUPABASE_SERVICE_ROLE_KEY
```

## Verification

To verify your setup is correct:

1. Create `.env.local` with your credentials
2. Open http://localhost:3000 in browser
3. Go to any onboarding form
4. Try to submit the form
5. You should see success message instead of error

## Need Help?

Check these files for more details:
- `.env.example` - Template for all environment variables
- `src/lib/supabase.ts` - Supabase client configuration
- `src/app/api/users/profile/route.ts` - Profile API endpoint

Contact support if issues persist.
