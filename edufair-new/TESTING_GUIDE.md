# 🧪 EduFair Complete System Testing Guide

## Overview
This guide walks you through testing all 10 features end-to-end to ensure everything works correctly.

## System Requirements
- Node.js 18+ installed
- npm installed
- Browser (Chrome, Firefox, Safari, or Edge)
- ~5-10 minutes to complete all tests

## Prerequisites - Setup

```bash
# Navigate to project
cd c:\Users\admin\Desktop\EDUFAIR\edufair-new

# Install dependencies (already done)
npm install

# Create environment configuration (already done)
node scripts/setup.js

# Verify all files are in place
node scripts/setup-check.js
```

## Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
> edufair@1.0.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

Keep this terminal running.

---

## 🧪 Phase 1: Frontend Pages & Navigation

### Test 1.1: Home Page
1. **Open** http://localhost:3000
2. **Expected to see:**
   - ✅ Navigation bar with "Login" and "Register" buttons
   - ✅ Hero section with problem statement
   - ✅ 3 feature cards explaining the solution
   - ✅ "How It Works" section with 4 steps
   - ✅ Key Features section
   - ✅ Footer with copyright
3. **Test Navigation:**
   - Click "Register" → Should navigate to /register
   - Click "Login" → Should navigate to /login

### Test 1.2: Login Page
1. **Navigate to** http://localhost:3000/login
2. **Expected to see:**
   - ✅ Email input field
   - ✅ Password input field
   - ✅ "Login" button
   - ✅ Link to "Don't have an account? Register"
3. **Test form validation:**
   - Try submitting empty form → Should show error
   - Enter invalid email → Should show validation error
   - Leave password empty → Should show error

### Test 1.3: Register Page
1. **Navigate to** http://localhost:3000/register
2. **Expected to see:**
   - ✅ Name input field
   - ✅ Email input field
   - ✅ Password input field
   - ✅ Role selector (Student/Institution/Admin)
   - ✅ "Create Account" button
   - ✅ Link to "Already have an account? Login"
3. **Test role selection:**
   - Select "Student" → Note it's selected
   - Select "Institution" → Note change
   - Select "Admin" → Note change

### Test 1.4: Dashboard Page (Requires Login)
1. **Go to** http://localhost:3000/dashboard
2. **Expected behavior:**
   - ✅ If not logged in → Redirect to login page
   - If logged in → Shows dashboard with:
     - Stats cards (Recommended: 0, Applications: 0, Alerts: 0)
     - "Recommended Scholarships" section
     - "Your Applications" section
     - Sidebar with alerts and quick actions

### Test 1.5: Scholarships Page
1. **Navigate to** http://localhost:3000/scholarships
2. **Expected to see:**
   - ✅ Filter section with:
     - Country dropdown
     - Min Award Amount input
     - Risk Level dropdown
   - ✅ Scholarships grid showing scholarships (empty in demo mode)
   - ✅ Filter functionality works

---

## 🧪 Phase 2: Authentication & User Management

### Test 2.1: User Registration
1. **Go to** http://localhost:3000/register
2. **Fill in:**
   - Name: `Test Student`
   - Email: `student@test.com`
   - Password: `Test123!@`
   - Role: `Student`
3. **Click** "Create Account"
4. **Expected:**
   - ✅ Form validation passes
   - ✅ Account created (or error if API not configured)
   - ✅ Redirect to onboarding or login page

**Note:** In demo mode without Supabase, you'll see API errors - this is expected!

### Test 2.2: User Login
1. **Go to** http://localhost:3000/login
2. **Fill in:**
   - Email: `student@test.com`
   - Password: `Test123!@`
3. **Click** "Login"
4. **Expected:**
   - ✅ Form validates email format
   - ✅ Form validates password not empty
   - ✅ Proper error messages for invalid credentials

### Test 2.3: Session Management
1. **After successful login:**
   - Token should be stored in localStorage
   - User should be able to access protected pages
   - Logout button should appear in navigation

---

## 🧪 Phase 3: Profile & Onboarding

### Test 3.1: 4-Step Onboarding
When redirected to onboarding after registration:

1. **Step 1 - Location & Background:**
   - ✅ Country dropdown shows options
   - ✅ Region/State field updates based on country
   - ✅ School type selector visible
   - ✅ "Next" button moves to step 2

2. **Step 2 - Academic Profile:**
   - ✅ Education level dropdown
   - ✅ Academic grade input (0-4.0 scale)
   - ✅ "Previous" and "Next" buttons work

3. **Step 3 - Financial Information:**
   - ✅ Family income input
   - ✅ Currency selector
   - ✅ Navigation buttons work

4. **Step 4 - Goals & Interests:**
   - ✅ Preferred field of study dropdown
   - ✅ Career goals textarea
   - ✅ "Done" button appears instead of "Next"

### Test 3.2: Profile Completion
1. **Complete all 4 steps**
2. **Click** "Done"
3. **Expected:**
   - ✅ Redirect to dashboard
   - ✅ Profile data saved
   - ✅ Dashboard shows user information

---

## 🧪 Phase 4: Algorithm Testing

### Feature #1: Eligibility Checker ✅
**Location:** `src/lib/recommendationEngine.ts > checkEligibility()`

**What it does:**
- Validates student meets scholarship criteria
- Checks: academic grade, income, country, region, education level
- Returns: eligible status + reasons for ineligibility

**Test:**
- Create test student with: 3.5 GPA, $30,000 income, USA, Student
- Run against scholarship with: min 3.2 GPA, income $20k-$50k, USA eligible
- Expected: ✅ Should be eligible

### Feature #2: Eligibility Match Score ✅
**Location:** `src/lib/recommendationEngine.ts > calculateEligibilityMatchScore()`

**What it does:**
- Scores 0-1 based on 5 factors:
  - Academic grade match (30%)
  - Income fit (25%)
  - Field of study match (25%)
  - Country/region match (15%)
  - Education level match (5%)

**Test:**
- Student with 3.8 GPA, $25k income, wants Engineering
- Scholarship for 3.5+ GPA, $20k-$60k, Engineering majors
- Expected: ✅ Score around 0.85-0.95

### Feature #3: Success Probability ✅
**Location:** `src/lib/recommendationEngine.ts > calculateSuccessProbability()`

**What it does:**
- Predicts success likelihood (0-1) using:
  - Eligibility match (40%)
  - Scholarship acceptance rate (30%)
  - Institution credibility (20%)
  - Risk assessment (10%)

**Test:**
- Eligible student: 0.9 match
- Scholarship with 0.8 acceptance rate, 0.95 credibility
- Expected: ✅ Score around 0.85-0.90

### Feature #4: Scholarship Matching ✅
**Location:** `src/lib/recommendationEngine.ts > generateScholarshipRecommendation()`

**What it does:**
- Creates complete recommendation object
- Includes: all scores, matching reasons, risk factors, priority level

**Test:**
- Load student profile
- Run against list of scholarships
- Expected: ✅ Returns ranked list with explanations

### Feature #5: Fee Recommendation ✅
**Location:** `src/lib/feeRecommendationEngine.ts > generateFinancialAnalysis()`

**What it does:**
- Analyzes education costs
- Recommends funding plan
- Calculates financial feasibility

**Test Flow:**
1. Student selects institution
2. Student selects course
3. System calculates:
   - Total cost breakdown
   - Funding sources (scholarships, loans, self-fund)
   - Feasibility score
   - ROI calculation

### Feature #6: Cost Breakdown ✅
**Location:** `src/lib/feeRecommendationEngine.ts > calculateCostBreakdown()`

**Test:**
- Harvard University + Computer Science (4 years)
- Expected:
  - Tuition: $240,000 (60k × 4)
  - Living: $100,000 (25k × 4)
  - Other: $17,000 (5% of tuition)
  - Total: $357,000

### Feature #7: Funding Plan Optimizer ✅
**Location:** `src/lib/feeRecommendationEngine.ts > calculateFundingPlan()`

**Test:**
- Available scholarships: $50k
- Student family income: $35k
- Education cost: $100k
- Expected:
  - Scholarship: $50k (covers partial cost)
  - Loans: $30k (60% of remaining, capped)
  - Self-fund: $20k (remaining 40%)

### Feature #8: Financial Feasibility Scorer ✅
**Location:** `src/lib/feeRecommendationEngine.ts > calculateFinancialFeasibilityScore()`

**Test:**
- Student family income: $40k
- Total education cost: $80k
- Available funding: $60k
- Self-fund needed: $20k
- Expected: ✅ Score around 0.6-0.7 (moderate difficulty)

### Feature #9: ROI Calculator ✅
**Location:** `src/lib/feeRecommendationEngine.ts > calculateROIScore()`

**What it does:**
- Calculates return on investment over 35-year career
- Formula: Future Earnings / Education Cost

**Test:**
- Harvard CS graduate:
  - Starting salary: $95,000
  - Career earnings (35 years): ~$3.5M
  - Education cost: $360,000
  - Expected ROI: ✅ 9.7x (score: 0.9+)

### Feature #10: Risk Assessment ✅
**Location:** `src/lib/recommendationEngine.ts > identifyRiskFactors()`

**What it does:**
- Identifies potential risks:
  - Scam risk (scholarship credibility)
  - Competition risk (high applicants)
  - Deadline risk (urgency)
  - Loan burden risk (debt-to-income)

**Test:**
- Scholarship with: 0.6 credibility, 500 applicants, 1 week deadline
- Expected: ✅ Returns [high_competition, approaching_deadline, credibility_concern]

---

## 🧪 Phase 5: API Endpoints Testing

### Setup: Open Browser DevTools
1. **Press** F12 or right-click → "Inspect"
2. **Go to** "Network" tab
3. **Filter** by "XHR" or "Fetch"

### Test 5.1: Authentication Endpoint
**Endpoint:** `POST /api/auth`

**In Production (with Supabase):**
```javascript
// Register
fetch('/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'register',
    email: 'test@example.com',
    password: 'Test123!@',
    full_name: 'Test User',
    role: 'student'
  })
})

// Expected Response:
{
  user: { id, email, full_name, role },
  token: "jwt_token_here"
}
```

### Test 5.2: User Profile Endpoint
**Endpoint:** `GET/PUT /api/users/profile`

```javascript
// Get profile
fetch('/api/users/profile', {
  headers: { 'Authorization': 'Bearer TOKEN' }
})

// Update profile
fetch('/api/users/profile', {
  method: 'PUT',
  headers: { 
    'Authorization': 'Bearer TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    country: 'USA',
    region_state: 'California',
    academic_grade: 3.8
  })
})
```

### Test 5.3: Scholarships Endpoint
**Endpoint:** `GET /api/scholarships`

```javascript
// Fetch scholarships
fetch('/api/scholarships?limit=50')
  .then(r => r.json())
  .then(data => {
    // Expected: Array of scholarships with:
    // - id, name, provider, amount, deadline
    // - credibility_score, acceptance_rate
    // - eligibility criteria
  })
```

### Test 5.4: Recommendations Endpoint
**Endpoint:** `GET /api/recommendations`

```javascript
// Get personalized recommendations
fetch('/api/recommendations', {
  headers: { 'Authorization': 'Bearer TOKEN' }
})

// Expected: Sorted array of scholarships with:
// - All eligibility scores
// - Success probability
// - Matching reasons
// - Risk factors
// - Priority level (high/medium/low)
```

### Test 5.5: Fee Recommendations Endpoint
**Endpoint:** `POST /api/fee-recommendations`

```javascript
// Generate financial plan
fetch('/api/fee-recommendations', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    institution_id: 'UUID',
    course_id: 'UUID',
    years_of_study: 4
  })
})

// Expected: Financial analysis with:
// - Cost breakdown
// - Funding plan
// - Feasibility score (0-1)
// - ROI calculation
// - Risk assessment
```

---

## 🧪 Phase 6: Database Verification

### Check Database Schema
In Supabase Console → Table Editor, verify:

1. **users table** ✅
   - Columns: id, email, password_hash, full_name, role, country, academic_grade, family_income, etc.
   - Primary key: id (UUID)

2. **scholarships table** ✅
   - Columns: id, name, provider_name, amount, deadline, credibility_score, acceptance_rate, etc.
   - Indexes: status, deadline, provider_id

3. **institutions table** ✅
   - Columns: id, name, country, tuition, credibility_score, employment_rate, etc.

4. **courses table** ✅
   - Columns: id, institution_id, name, tuition_annual, salary data, etc.

5. **Other tables** ✅
   - scholarship_applications
   - scholarship_recommendations
   - fee_recommendation_plans
   - alerts
   - student_testimonials
   - audit_logs

---

## 🧪 Phase 7: End-to-End User Flow

### Complete Student Journey

1. **Visit Home Page**
   - http://localhost:3000
   - ✅ See home page

2. **Register**
   - Click "Register"
   - Fill in details
   - Create account
   - ✅ Account created

3. **Complete Onboarding**
   - Fill 4-step profile
   - ✅ Profile complete

4. **View Dashboard**
   - See statistics
   - See recommended scholarships
   - ✅ Dashboard loads

5. **Browse Scholarships**
   - http://localhost:3000/scholarships
   - Filter by country, amount, risk
   - ✅ Filtering works

6. **View Recommendations**
   - See personalized matches
   - Each shows match percentage
   - ✅ Recommendations display

7. **Create Application**
   - Select scholarship
   - Start application
   - ✅ Application created

8. **View Fee Plan**
   - Select institution and course
   - Get cost analysis
   - ✅ Financial plan generated

---

## ✅ Verification Checklist

Print this and mark as you test:

### Phase 1: Frontend
- [ ] Home page loads and displays correctly
- [ ] Login page has email/password fields
- [ ] Register page has all required fields
- [ ] Dashboard page shows layout correctly
- [ ] Scholarships page shows filter controls
- [ ] Navigation works between pages

### Phase 2: Authentication
- [ ] Can fill registration form
- [ ] Email validation works
- [ ] Password field is masked
- [ ] Error messages display
- [ ] Form resets after submission

### Phase 3: Algorithms
- [ ] Eligibility checker validates criteria
- [ ] Match scoring gives 0-1 scores
- [ ] Success probability calculated
- [ ] Priority ranking works
- [ ] Fee calculations are accurate
- [ ] ROI scores make sense

### Phase 4: API
- [ ] Auth endpoint can be called
- [ ] User profile endpoint works
- [ ] Scholarships endpoint returns data
- [ ] Recommendations generated
- [ ] Fee plans calculated

### Phase 5: Database
- [ ] All 10 tables exist
- [ ] Schema matches specifications
- [ ] Relationships are correct
- [ ] Indexes created for performance

### Phase 6: Real Data
- [ ] 5 universities loaded
- [ ] 5 scholarships loaded
- [ ] 5 courses loaded
- [ ] Student testimonials visible
- [ ] Credibility scores present

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL is missing` | Check `.env.local` file has all values |
| `Cannot find module` | Run `npm install` again |
| `Port 3000 already in use` | Run `npm run dev -- --port 3001` |
| `API returns 401` | Check JWT token is valid |
| `Database connection failed` | Verify Supabase credentials in `.env.local` |
| `Pages show 404` | Make sure file structure matches (check setup-check.js output) |

---

## 📊 Success Criteria

**The project is complete when:**

1. ✅ All 6 frontend pages load without errors
2. ✅ Registration and login flows work (UI-wise)
3. ✅ All 10 algorithms are implemented
4. ✅ All 8 API endpoints are defined
5. ✅ Database schema has 10 tables
6. ✅ Real data for 5 universities loaded
7. ✅ Scholarship matching runs end-to-end
8. ✅ Fee calculations work correctly
9. ✅ User can see personalized recommendations
10. ✅ All TypeScript files compile without errors

---

**Everything is ready to test! Follow the phases above and verify each component.** 🚀
