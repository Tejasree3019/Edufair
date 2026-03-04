# EduFair Setup Instructions

## Step 1: Create Supabase Account & Project

### Option A: Using Free Supabase Tier (Recommended for Development)

1. **Go to** https://supabase.com
2. **Sign up** with your email
3. **Create a new project**:
   - Project Name: `edufair-dev`
   - Database Password: (create a strong password)
   - Region: Choose closest to you
4. **Wait for project to initialize** (1-2 minutes)

### Step 2: Get Your Credentials

Once your project is ready:

1. **Go to Project Settings** → **API**
2. **Copy these values**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

3. **Generate JWT Secret** (use any of these):
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Or use this example: `your_secret_key_at_least_32_characters_long_1234567890`

## Step 3: Configure Environment Variables

1. **Open** `.env.local` in the project root
2. **Replace** with your actual values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=your_jwt_secret_key_here_at_least_32_characters
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

## Step 4: Create Database Tables

### Option A: Using Supabase SQL Editor (Recommended)

1. **Go to** SQL Editor in Supabase Console
2. **Click** "New Query"
3. **Copy & paste** entire contents from `supabase/schema.sql`
4. **Click** "Run"

### Option B: Using Command Line
```bash
npm run db:seed
```

## Step 5: Verify Database Setup

1. **Go to Supabase Console**
2. **Click** "Table Editor"
3. **Verify these tables exist**:
   - [ ] users
   - [ ] scholarships
   - [ ] institutions
   - [ ] courses
   - [ ] scholarship_applications
   - [ ] scholarship_recommendations
   - [ ] fee_recommendation_plans
   - [ ] alerts
   - [ ] student_testimonials
   - [ ] audit_logs

## Step 6: Seed Real Data

Run the seed script:
```bash
node scripts/seed.js
```

**Expected output:**
```
🌱 Starting database seeding...
✅ Institutions seeded
✅ Scholarships seeded
✅ Courses seeded
✅ Users created
✅ Database seeding completed successfully!
```

## Step 7: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
> next dev
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

## Step 8: Test the Application

### Access the Application
- **Open** http://localhost:3000 in your browser
- **You should see** the EduFair home page

### Test Registration
1. **Click** "Register"
2. **Fill in**:
   - Name: `Test Student`
   - Email: `student@test.com`
   - Password: `Test123!`
   - Role: `Student`
3. **Click** "Create Account"

### Test Login
1. **Should redirect** to onboarding page
2. **Fill in profile information**
3. **Complete all 4 steps**
4. **Click** "Done"

### Test Dashboard
1. **Should show** dashboard with statistics
2. **Should show** recommended scholarships
3. **Check** API is working:
   - Open DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Should see API calls succeeding (status 200)

## Troubleshooting

### Issue: "NEXT_PUBLIC_SUPABASE_URL is missing"
**Solution**: Check `.env.local` file has correct values and restart dev server

### Issue: "Cannot seed database"
**Solution**: Make sure database schema exists in Supabase

### Issue: "Login fails"
**Solution**: 
1. Check Supabase service role key is correct
2. Verify users table exists
3. Check browser console for error messages

### Issue: "API calls returning 500"
**Solution**:
1. Check server console for error messages
2. Verify database connection
3. Check Supabase service role key has correct permissions

## Quick Verification Checklist

Run this to verify everything is set up:

```bash
# 1. Check dependencies installed
npm list next react

# 2. Check environment variables are set
cat .env.local

# 3. Check database schema exists (requires DB connection)
npm run db:studio  # Opens Supabase Data Studio

# 4. Start dev server
npm run dev
```

## What You Should See

### Home Page (http://localhost:3000)
- Navigation bar
- Hero section with problem/solution
- 3 feature cards
- How It Works section
- Call to Action button

### After Registration & Login
- Dashboard with 4 stat cards
- Recommended scholarships grid
- Your applications section
- Alerts sidebar

### Database Tables
- 10 tables with sample data
- 5 universities (Harvard, Stanford, MIT, IIT Delhi, U of Toronto)
- 5 scholarships with real criteria
- 5 courses with career outcomes

## Next Steps

After setup is complete:

1. **Explore Dashboard** - See recommended scholarships
2. **Browse Scholarships** - Filter and view details
3. **Create Applications** - Test application workflow
4. **Check Algorithms** - Verify matching and fee calculations
5. **Test API** - Use DevTools Network tab to inspect API calls

## Database Schema Overview

### Key Tables
- **users** - Student, institution, and admin accounts
- **scholarships** - Scholarship programs with eligibility criteria
- **institutions** - Universities with programs and credibility scores
- **courses** - Academic programs with employment outcomes
- **scholarship_recommendations** - AI-generated matches for students
- **fee_recommendation_plans** - Financial planning and analysis

### Real Data Included
- **5 Universities**: Harvard, Stanford, MIT, IIT Delhi, University of Toronto
- **5 Scholarships**: Full tuition, partial awards, merit-based
- **5 Courses**: CS, Engineering, MBA, Medicine, Law
- **Real Salary Data**: Career earnings predictions
- **Real Employment Rates**: 90-99% based on actual institutions

## Support

If you encounter issues:
1. Check [QUICKSTART.md](./QUICKSTART.md)
2. Review [README.md](./README.md) - Troubleshooting section
3. Check [API_REFERENCE.md](./API_REFERENCE.md) - API details
4. Review server console logs

**Everything should work end-to-end after these steps!** 🚀
