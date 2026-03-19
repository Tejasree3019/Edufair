# 🚀 EduFair - Developer Guide

**Version:** 3.0.0 (Production Ready)  
**Last Updated:** March 13, 2026

---

## 📚 Table of Contents
1. Project Overview
2. Tech Stack
3. Getting Started
4. Project Structure
5. Development Workflow
6. Key Features
7. API Documentation
8. Deployment
9. Troubleshooting
10. Contributing

---

## 🎯 Project Overview

EduFair is an AI-powered scholarship recommendation and financial aid platform designed to help Indian students find and apply for scholarships intelligently.

### Key Features
- **Smart Matching:** AI-powered scholarship matching algorithm
- **Application Tracking:** Track scholarship applications in real-time
- **Gamification:** Earn points and badges for platform engagement
- **Fee Calculator:** Plan education financing
- **WhatsApp Integration:** AI chatbot for instant support
- **Responsive Design:** Works on all devices

### Target Users
- High school and undergraduate students in India
- Educational institutions
- Scholarship providers

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14+ (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **HTTP Client:** Fetch API

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT + Supabase Auth
- **Email:** SendGrid

### DevOps
- **Hosting:** Vercel (recommended)
- **Database:** Supabase Cloud
- **Version Control:** GitHub
- **CI/CD:** GitHub Actions (optional)
- **Monitoring:** Sentry, Google Analytics

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
npm 9+
Git
GitHub account
Supabase account
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/edufair.git
   cd edufair/edufair-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   nano .env.local
   
   # Fill in your credentials:
   # - Supabase URL and keys
   # - JWT secret
   # - SendGrid API key (if using email)
   ```

4. **Setup database**
   ```bash
   # Create tables and schema in Supabase console
   # Or run migration script (when available)
   npm run db:setup
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open http://localhost:3000 in your browser

---

## 📁 Project Structure

```
edufair-new/
├── src/
│   ├── app/                      # Next.js 13+ app directory
│   │   ├── (auth)/               # Auth-related pages
│   │   ├── api/                  # API routes
│   │   ├── dashboard/            # Dashboard pages
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   │   ├── Toast.tsx             # Toast notifications
│   │   ├── ConfirmDialog.tsx     # Confirmation dialog
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── ...
│   ├── lib/                      # Utilities and helpers
│   │   ├── validation.ts         # Form validation
│   │   ├── errorHandler.ts       # Error handling
│   │   ├── rateLimit.ts          # Rate limiting
│   │   ├── logger.ts             # Logging utility
│   │   ├── supabase.ts           # Supabase client
│   │   └── ...
│   └── types/                    # TypeScript types
├── public/                       # Static assets
│   └── data/                     # JSON data files
├── scripts/                      # Utility scripts
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🔄 Development Workflow

### Creating a Feature

1. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes**
   - Follow the existing code style
   - Use TypeScript for type safety
   - Add comments for complex logic
   - Test your changes

3. **Validate your work**
   ```bash
   npm run build        # Check for build errors
   npm run type-check   # Check TypeScript
   npm run lint         # Check code style (if configured)
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add my feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/my-feature
   # Create PR on GitHub
   ```

### Code Style Guidelines

- **Naming:** camelCase for variables/functions, PascalCase for components
- **Files:** kebab-case for filenames
- **Comments:** Use for "why" not "what"
- **Functions:** Keep under 50 lines of code
- **Components:** Keep under 200 lines of code

### TypeScript Best Practices
```typescript
// ✅ Good: Explicit types
const getUserById = (id: string): Promise<User> => {
  return fetch(`/api/users/${id}`).then(r => r.json())
}

// ❌ Avoid: Implicit any
const getData = (id) => {
  return fetch(`/api/${id}`)
}

// ✅ Good: Type interfaces
interface User {
  id: string
  email: string
  name: string
}

// ❌ Avoid: Loose typing
const user: any = { ... }
```

---

## ✨ Key Features Guide

### 1. Authentication
- Located in: `src/app/api/auth/`
- Uses: JWT tokens + localStorage
- Features: Login, register, password reset

### 2. Scholarship Matching
- Located in: `src/app/api/recommendations/`
- Algorithm: Rule-based matching
- Data source: JSON files + database

### 3. Application Tracking
- Located in: `src/app/tracking/`
- Database table: `applications`
- Features: Status updates, timeline view

### 4. Gamification
- Located in: `src/app/gamification/`
- Features: Points, badges, leaderboard
- Database table: `user_gamification`

### 5. WhatsApp Integration
- Located in: `src/app/api/whatsapp/`
- Provider: Twilio (optional)
- Features: Message sending, webhook handling

---

## 📡 API Documentation

### Health Check
```
GET /api/health
Response: { status: "ok" }
```

### Authentication
```
POST /api/auth/register
Body: {
  email: string
  password: string
  fullName: string
}
Response: { success: boolean, user?: User, error?: string }

POST /api/auth/login
Body: { email: string, password: string }
Response: { success: boolean, user?: User, token?: string, error?: string }

POST /api/auth/logout
Response: { success: boolean }
```

### Scholarships
```
GET /api/scholarships?country=India&limit=20
Response: { scholarships: Scholarship[], total: number }

GET /api/recommendations?profile=student_id
Response: { recommendations: Scholarship[], score: number }[]
```

### Applications
```
GET /api/applications
Headers: { Authorization: "Bearer token" }
Response: { applications: Application[] }

POST /api/applications
Body: {
  scholarshipId: string
  answers: Record<string, string>
}
Response: { success: boolean, application?: Application }
```

### User Profile
```
GET /api/users/profile
Headers: { Authorization: "Bearer token" }
Response: { user: User }

PUT /api/users/profile
Headers: { Authorization: "Bearer token" }
Body: { ...profileUpdates }
Response: { success: boolean, user?: User }
```

### Gamification
```
GET /api/gamification
Headers: { Authorization: "Bearer token" }
Response: { points: number, level: number, badges: Badge[] }

POST /api/gamification/action
Headers: { Authorization: "Bearer token" }
Body: { action: string, metadata?: any }
Response: { pointsEarned: number, newTotal: number }
```

[See full API documentation in API_DOCUMENTATION.md]

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Staging
```bash
npm run build
npm start
```

### Production (Vercel)
```bash
# Connected to GitHub, auto-deploys on push to main
vercel deploy --prod
```

### Production (Self-hosted)
```bash
npm run build
npm start  # Runs on port 3000
```

---

## 🐛 Troubleshooting

### Issue: Build errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Issue: Port 3000 already in use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Issue: Supabase connection errors
- Check `.env.local` has correct credentials
- Verify Supabase project is running
- Check database tables exist
- Test connection: `npm run db:test`

### Issue: TypeScript errors
```bash
npm run type-check
```

---

## 👥 Contributing

### Before Contributing
- Read this guide
- Read SECURITY_GUIDELINES.md
- Follow code style guidelines
- Write tests for new features

### Contribution Process
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request
6. Address review comments

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] No hardcoded secrets
- [ ] Tests pass
- [ ] No console.logs in production code
- [ ] Types are properly defined
- [ ] Comments explain complex logic
- [ ] Security best practices followed

---

## 📞 Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Community
- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Email: dev@edufair.com

### Getting Help
1. Check documentation
2. Search existing issues
3. Ask in GitHub discussions
4. Contact dev team

---

## 📝 License

This project is proprietary. Unauthorized copying or modification is prohibited.

---

**Happy coding!** 🎉  
For questions, contact dev@edufair.com
