# EduFair - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Create Supabase Project
1. Visit https://supabase.com
2. Click "New Project"
3. Fill in project details:
   - Name: `edufair`
   - Database password: Save this securely
   - Region: Choose closest to you
4. Wait 2-3 minutes for project creation

### Step 2: Get Your Credentials
1. Go to Project Settings > API
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to Project Settings > Administrators
4. Copy service role key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Initialize Project
```bash
cd edufair-new
npm install
cp .env.local.example .env.local
```

### Step 4: Update .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key-12345
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Create Database Schema
1. In Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy entire content from `supabase/schema.sql`
4. Click "Run"

### Step 6: Seed Data
```bash
npm run db:seed
```

This creates:
- 5 real universities
- 5 scholarship programs
- Sample courses with career data

### Step 7: Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

---

## 📝 Creating Test Account

### Student Account
1. Click "Register"
2. Fill form:
   - **Email**: student@example.com
   - **Name**: John Doe
   - **Role**: Student
   - **Password**: Password123
3. Complete onboarding form
4. You'll be redirected to dashboard

### Institution Account
1. Click "Register"
2. Fill form:
   - **Email**: institution@example.com
   - **Name**: University Name
   - **Role**: Institution/Organization
   - **Password**: Password123
3. You can now create scholarships

---

## 🔑 Key Features Demo

### 1. Personalized Matching
1. Log in as student
2. Go to Scholarships page
3. View top matches with suitability scores
4. Each shows:
   - Match percentage
   - Priority level (High/Medium/Low)
   - Success probability

### 2. Fee Calculator
1. From Dashboard, click "Fee Calculator"
2. Select institution and course
3. Get:
   - Cost breakdown
   - Funding plan
   - Financial feasibility score
   - ROI analysis

### 3. Application Tracking
1. From Dashboard, view "Your Applications"
2. Track status of each application
3. Monitor deadlines
4. Manage document uploads

### 4. Smart Alerts
1. View alerts in dashboard sidebar
2. Types include:
   - Deadline alerts
   - New matching scholarships
   - Document reminders
   - Status updates

---

## 📊 Algorithm Examples

### How Matching Works
When you log in as a student with:
- GPA: 3.8/4.0
- Family Income: $30,000
- Field: Computer Science

System calculates for each scholarship:
1. **Eligibility Score**: 0.85 (meets criteria well)
2. **Credibility Score**: 0.98 (Harvard)
3. **Reward vs Competition**: 0.75 (good value)
4. **Final Suitability**: 0.87 (87% match)

### How Fee Planning Works
For Harvard CS degree:
- **Total Cost**: $340,000 (4 years)
- **Scholarship**: $240,000
- **Grants**: $20,000
- **Loan Recommended**: $60,000
- **Self-Funded**: $20,000
- **Feasibility Score**: 0.72 (Moderate)

---

## 🛠 Common Issues & Solutions

### Issue: "Supabase connection error"
**Solution**:
```bash
# Check .env.local has correct URL and keys
echo $NEXT_PUBLIC_SUPABASE_URL
# Should output your Supabase URL
```

### Issue: "Schema not found"
**Solution**:
1. Go to Supabase SQL Editor
2. Run: `SELECT * FROM users;`
3. If error, re-run the schema.sql file

### Issue: "Seed script fails"
**Solution**:
```bash
# Ensure service role key is set
echo $SUPABASE_SERVICE_ROLE_KEY
# Should not be empty

# Try again
npm run db:seed
```

### Issue: "Login fails"
**Solution**:
1. Clear localStorage: F12 → Application → Clear All
2. Ensure JWT_SECRET is set in .env.local
3. Try registering a new account

---

## 📁 Project Structure

```
edufair-new/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Student dashboard
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── scholarships/     # Scholarship browse
│   │   ├── onboarding/       # Profile setup
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   ├── auth.ts           # Authentication
│   │   ├── recommendationEngine.ts  # Matching algorithm
│   │   ├── feeRecommendationEngine.ts # Fee calculator
│   │   └── utils.ts          # Helper functions
│   └── types/
│       └── index.ts          # TypeScript types
├── supabase/
│   └── schema.sql           # Database schema
├── scripts/
│   └── seed.js              # Data seeding
├── public/                   # Static files
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Remove demo accounts
- [ ] Enable email verification
- [ ] Set up password reset flow
- [ ] Add rate limiting
- [ ] Enable database backups
- [ ] Monitor audit logs

---

## 📚 Next Steps

### Advanced Features to Build
1. **Email Notifications**: Send alerts to students
2. **Video Tutorials**: Help students use platform
3. **Testimonial Reviews**: Student feedback system
4. **Admin Dashboard**: Monitor system health
5. **Export Reports**: Generate PDF reports
6. **Mobile App**: React Native version

### Data Enhancements
1. **More Scholarships**: Import from government databases
2. **Real Salary Data**: Integration with LinkedIn/Glassdoor
3. **Employment Outcomes**: Partner with universities
4. **Student Testimonials**: Crowdsource feedback

### Market Expansion
1. **Global Scholarships**: Add more countries
2. **B2B Portal**: Enterprise version for institutions
3. **Mobile App**: iOS/Android applications
4. **API Integration**: Let other platforms use EduFair

---

## 🆘 Need Help?

### Documentation Files
- `README.md` - Full project documentation
- `supabase/schema.sql` - Database structure
- `src/types/index.ts` - All data types

### Code Examples
- Check `src/lib/recommendationEngine.ts` for algorithm examples
- See `src/lib/feeRecommendationEngine.ts` for cost calculations
- Review API routes in `src/app/api/` for integration patterns

### Useful Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📞 Support

For issues:
1. Check this guide first
2. Review error logs: `npm run dev` shows detailed errors
3. Check Supabase logs: Dashboard > Logs
4. Review browser console: F12 > Console tab

---

**You're all set! 🎉 Start by visiting http://localhost:3000**
