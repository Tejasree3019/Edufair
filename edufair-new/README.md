# EduFair - Bias-Free Education Scholarship & Fee Recommendation System

A comprehensive Next.js application that intelligently matches students with scholarships and provides smart financial planning for education.

## 🎯 Project Overview

EduFair solves a critical problem: students waste time applying to irrelevant scholarships and lack intelligent guidance for education funding. Instead of just listing scholarships, EduFair:

- 🎯 **Matches** students with scholarships they're likely to receive
- 📊 **Scores** scholarships based on suitability, credibility, and competition
- 💡 **Estimates** success probability before students apply
- 💰 **Analyzes** complete education costs and funding strategies
- 📅 **Tracks** applications and deadlines in one place
- 🔐 **Verifies** scholarship credibility and legitimacy
- 📢 **Alerts** students about deadlines and new opportunities

## ✨ Key Features

### 1. **Personalized Scholarship Discovery**
- Smart filtering based on academic profile, financial situation, and goals
- Only shows scholarships students actually qualify for
- Saves time by eliminating irrelevant opportunities

### 2. **Scholarship Suitability Ranking**
- Suitability Score: How well student matches the scholarship (0-100%)
- Success Probability: Estimated chance of approval
- Risk Assessment: Competition level and credibility metrics
- Reward vs Competition Score: Value for the effort required

### 3. **Fee Recommendation & Cost Analysis**
- Complete cost breakdown:
  - Tuition fees
  - Living expenses
  - Academic materials and supplies
- Funding plan optimization:
  - Scholarship allocation
  - Grant identification
  - Loan recommendations
  - Self-funded amount
- Financial feasibility score (0-100%)
- ROI calculation based on career outcomes

### 4. **Application Tracking Dashboard**
- Centralized management of all scholarship applications
- Document tracking and upload
- Deadline monitoring with alerts
- Application status updates
- Success probability tracking

### 5. **Credibility & Risk Verification**
- Institution verification status
- Employment outcome rates
- Graduate salary data
- Student testimonials
- Scam risk assessment (Low/Medium/High)
- Accreditation status

### 6. **Smart Alerts & Notifications**
- Deadline alerts (configurable days before)
- New matching scholarship notifications
- Document reminder alerts
- Eligibility change notifications
- Status update alerts

### 7. **Institution Dashboard (B2B)**
- Tools for universities and scholarship providers to:
  - Manage scholarship listings
  - Track applicant quality
  - Analyze application demographics
  - Reach qualified students

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with React 18
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcryptjs
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components

### Database Schema
- **Users**: Student and institution profiles
- **Scholarships**: Detailed scholarship information with eligibility criteria
- **Institutions**: College/university data with credibility metrics
- **Courses**: Program information with career outcomes
- **Applications**: Student scholarship applications with status tracking
- **Fee Plans**: Financial analysis and funding recommendations
- **Alerts**: Notifications and reminders
- **Testimonials**: Student feedback for credibility
- **Audit Logs**: System activity tracking

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (https://supabase.com)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd edufair-new
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to https://supabase.com and sign up/login
2. Create a new project
3. Wait for the project to be created
4. Copy your project URL and anon key

#### Run Database Schema
1. In Supabase Dashboard, go to SQL Editor
2. Create a new query
3. Copy the entire content from `supabase/schema.sql`
4. Run the query to create all tables and indexes

### 4. Configure Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Seed Database with Real Data
```bash
npm run db:seed
```

This populates the database with:
- 5 real universities (Harvard, Stanford, MIT, IIT Delhi, University of Toronto)
- 15+ scholarship programs
- 5+ courses with real salary data

### 6. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📱 User Flows

### Student User Flow
1. **Registration**: Create account as a student
2. **Profile Completion**: Enter academic profile, financial info, goals
3. **Get Recommendations**: System analyzes profile and generates matches
4. **Review Matches**: See suitability scores and success probabilities
5. **Apply**: Start applications through dashboard
6. **Track Progress**: Monitor deadlines and documents
7. **Get Funded**: Receive alerts about decisions

### Institution User Flow
1. **Registration**: Register as institution or scholarship provider
2. **Create Scholarships**: List new scholarship programs
3. **Manage Applications**: Review and decide on applications
4. **Analytics**: See applicant demographics and success metrics
5. **Reach Students**: Market scholarships to qualified students

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Row-Level Security**: Database-level access control (via Supabase RLS)
- **Input Validation**: Server-side validation on all APIs
- **CORS Protection**: Restricted API access
- **Audit Logging**: Track all system activities

## 📊 Algorithm Details

### Scholarship Matching Algorithm
```
Eligibility Match Score = 
  (Academic Grade Match × 0.30) +
  (Family Income Match × 0.20) +
  (Field of Study Match × 0.25) +
  (Country Match × 0.15) +
  (Education Level Match × 0.10)

Success Probability =
  (Eligibility Score × 0.40) +
  (Historical Acceptance Rate × 0.30) +
  (Credibility Score × 0.20) +
  (Risk Adjustment × 0.10)

Overall Suitability Score =
  (Eligibility Score × 0.45) +
  (Credibility Score × 0.30) +
  (Reward vs Competition × 0.25)
```

### Fee Recommendation Algorithm
```
Financial Feasibility Score =
  (Income Affordability × 0.25) +
  (Funding Coverage × 0.35) +
  (Self-Fund Burden × 0.20) +
  (Loan Burden × 0.20)

ROI Score =
  ((Career Earnings - Education Cost) / Education Cost) / Time Period / 15%
```

## 📈 Real Data Sources

The system uses real data for:
- **Institutions**: Harvard, Stanford, MIT, IIT Delhi, University of Toronto
- **Tuition Costs**: Based on 2024-2025 published rates
- **Living Expenses**: Real cost of living data by city
- **Salary Data**: Employment outcomes from university reports
- **Acceptance Rates**: Historical data from institution records

## 🔄 API Endpoints

### Authentication
- `POST /api/auth` - Register or login

### Scholarships
- `GET /api/scholarships` - List all scholarships
- `POST /api/scholarships` - Create scholarship (institution only)

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations

### Applications
- `GET /api/applications` - List student's applications
- `POST /api/applications` - Create new application

### Fee Recommendations
- `POST /api/fee-recommendations` - Generate financial plan
- `GET /api/fee-recommendations` - List student's plans

### Institutions
- `GET /api/institutions` - List institutions
- `POST /api/institutions` - Create institution (admin only)

### Alerts
- `GET /api/alerts` - Get unread alerts
- `POST /api/alerts` - Mark alert as read

## 📝 Database Models

See `supabase/schema.sql` for detailed schema documentation.

Key tables:
- `users` - Student and institution profiles
- `scholarships` - Scholarship programs
- `institutions` - Colleges and universities
- `courses` - Academic programs
- `scholarship_applications` - Application tracking
- `fee_recommendation_plans` - Financial plans
- `alerts` - Notifications
- `student_testimonials` - Reviews and ratings
- `audit_logs` - Activity tracking

## 🎓 Sample Credentials (After Seeding)

Test accounts are not pre-created. Register new accounts to test:
- Email: your-email@example.com
- Password: Your secure password

## 🚢 Deployment

### Deploy to Vercel
```bash
npm run build
vercel deploy
```

### Environment Variables for Production
Update all environment variables in your deployment platform:
- Supabase URL and Keys
- JWT Secret
- App URL

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys in `.env.local`
- Check Supabase project is active
- Ensure schema has been created

### Authentication Errors
- Clear browser localStorage
- Regenerate JWT_SECRET
- Check token expiration settings

### Scholarship Matching Issues
- Ensure student profile is complete
- Verify scholarship criteria in database
- Check eligibility algorithm logs

## 📄 License

This project is provided as-is for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Future Enhancements

- [ ] Machine learning for improved recommendations
- [ ] Integration with government scholarship databases
- [ ] Mobile app (React Native)
- [ ] Scholarship provider API integration
- [ ] Student collaboration features
- [ ] Counselor dashboard
- [ ] Multi-language support
- [ ] Advanced analytics and reporting

## 📞 Support

For issues and questions, please open a GitHub issue or contact support.

---

**Made with ❤️ to make education funding fair and accessible for all.**
