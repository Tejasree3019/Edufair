# EduFair Platform Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Dashboard  │  │ Scholarships │  │ Applications │           │
│  │   (React)    │  │   Search     │  │    Form      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js API Routes with Rate Limiting & CORS            │   │
│  │  ├─ /api/scholarships                                    │   │
│  │  ├─ /api/applications                                    │   │
│  │  ├─ /api/users                                           │   │
│  │  ├─ /api/recommendations                                 │   │
│  │  └─ /api/scholarships-realtime (Real-time feed)         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                                │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐  │
│  │ Authentication      │  │ Data Processing Services         │  │
│  │ ├─ JWT tokens       │  │ ├─ Scholarship Fetcher           │  │
│  │ ├─ Session mgmt     │  │ ├─ Application Ranker            │  │
│  │ └─ SSO integration  │  │ ├─ Recommendation Engine         │  │
│  └─────────────────────┘  └──────────────────────────────────┘  │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐  │
│  │ Notification Service│  │ Analytics Service                │  │
│  │ ├─ Email (SendGrid) │  │ ├─ Application tracking          │  │
│  │ ├─ SMS (Twilio)     │  │ ├─ Success rate calculation      │  │
│  │ └─ In-app alerts    │  │ └─ Performance metrics           │  │
│  └─────────────────────┘  └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                            │
│  ┌───────────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │ PostgreSQL ORM    │  │ Redis Cache  │  │ File Storage   │   │
│  │ (Prisma)          │  │ (Session)    │  │ (AWS S3)       │   │
│  └───────────────────┘  └──────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                           │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │PostgreSQL  │  │AWS S3  │  │  Redis   │  │  External APIs │  │
│  │ Database   │  │ Storage│  │  Cache   │  │  (Gov. Data)   │  │
│  └─────────┘  └──────────┘  └──────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role ENUM ('student', 'admin', 'moderator'),
  status ENUM ('active', 'inactive', 'suspended'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

#### Scholarships Table
```sql
CREATE TABLE scholarships (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount_min INT,
  amount_max INT,
  currency VARCHAR(3),
  category VARCHAR(100),
  country VARCHAR(100),
  field_of_study VARCHAR(255),
  eligibility_criteria TEXT,
  deadline DATE,
  source_url VARCHAR(500),
  source_type ENUM ('government', 'university', 'private', 'ngo'),
  credibility_score INT (0-100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Applications Table
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  scholarship_id UUID REFERENCES scholarships(id),
  status ENUM ('draft', 'submitted', 'reviewing', 'accepted', 'rejected', 'withdrawn'),
  application_data JSONB,
  match_percentage INT,
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  decision_date DATE,
  decision_feedback TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(100),
  title VARCHAR(255),
  message TEXT,
  template_id VARCHAR(100),
  channels JSONB, -- {email: true, sms: false, in_app: true}
  status ENUM ('pending', 'sent', 'failed'),
  retry_count INT DEFAULT 0,
  sent_at TIMESTAMP,
  created_at TIMESTAMP
);
```

#### Application Timeline Table
```sql
CREATE TABLE application_timeline (
  id UUID PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  event_type VARCHAR(100),
  event_description TEXT,
  event_data JSONB,
  created_at TIMESTAMP
);
```

---

## API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register        - Create new account
POST   /api/auth/login           - User login with email/password
POST   /api/auth/logout          - Logout session
POST   /api/auth/refresh         - Refresh JWT token
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Confirm password reset
GET    /api/auth/me              - Get current user profile
```

### Scholarship Endpoints
```
GET    /api/scholarships              - List all scholarships (paginated)
GET    /api/scholarships/:id          - Get scholarship details
GET    /api/scholarships/search       - Search with filters
GET    /api/scholarships-realtime     - Real-time scholarships with caching

Query Parameters for Real-Time:
  - filter: {minAmount, maxAmount, country, field, source, minCredibility}
  - sort: amount-high, amount-low, credibility, deadline, newest, relevance
  - limit: 1-100 (default 50)
  - offset: pagination offset
```

### Application Endpoints
```
GET    /api/applications         - Get user's applications
GET    /api/applications/:id     - Get application details
POST   /api/applications         - Create new application
PUT    /api/applications/:id     - Update application
DELETE /api/applications/:id     - Withdraw application
GET    /api/applications/:id/timeline - Get application history
```

### User Endpoints
```
GET    /api/users/profile        - Get user profile
PUT    /api/users/profile        - Update profile
GET    /api/users/dashboard      - Get user dashboard data
GET    /api/users/recommendations - Get personalized recommendations
```

### Admin Endpoints
```
GET    /api/admin/analytics      - Platform analytics
GET    /api/admin/users          - List all users
GET    /api/admin/applications   - List all applications
PUT    /api/admin/users/:id      - Update user (admin)
DELETE /api/admin/users/:id      - Delete user (admin)
```

---

## Data Flow Diagrams

### Scholarship Application Flow
```
1. User searches scholarships
   └─> GET /api/scholarships-realtime
   └─> Returns: Filtered & ranked scholarships

2. User clicks "Apply"
   └─> Navigates to /apply/[scholarshipId]
   └─> ApplicationForm component renders

3. User fills 18-field form
   └─> Validates input in real-time
   └─> Shows match percentage

4. User submits
   └─> POST /api/applications
   └─> Creates application record
   └─> Triggers notification service
   └─> Returns application_id

5. Notification sent
   └─> NotificationService.sendNotification()
   └─> Email via SendGrid
   └─> SMS via Twilio
   └─> In-app notification in DB
   └─> User sees confirmation

6. Application tracked
   └─> Application status: "submitted"
   └─> Timeline: created, submitted
   └─> Dashboard shows application
```

### Real-Time Data Fetching Flow
```
1. Page loads or timer triggers (24-hour cache)
   └─> GET /api/scholarships-realtime

2. API Route handles request
   └─> ScholarshipDataFetcher.fetchAllScholarships()
   └─> Check cache first (Redis)
   └─> If cache valid (< 24h):
       └─> Return cached data
   └─> If cache expired:
       └─> Fetch from 6 sources:
           ├─> Government portals (scholarships.gov.in)
           ├─> IIT websites
           ├─> NIT websites
           ├─> State portals
           ├─> Private foundations
           └─> NGO databases
       └─> Apply filters & ranking
       └─> Store in cache
       └─> Return data

3. Frontend receives data
   └─> Display scholarships in grid/list
   └─> Apply client-side filters
   └─> Show match percentage
```

---

## Microservices Architecture

### Service Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Next.js)                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Authentication Service                     │
│  Responsibilities:                                            │
│  - JWT token generation & verification                       │
│  - User login/logout                                         │
│  - Session management                                        │
│  - OAuth integration (Google, GitHub)                        │
│  Port: 3001 (internal)                                       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  Scholarship Service                          │
│  Responsibilities:                                            │
│  - Fetch scholarships from multiple sources                  │
│  - Filter & search scholarships                              │
│  - Cache management (24-hour TTL)                            │
│  - Calculate match percentages                               │
│  Port: 3002 (internal)                                       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  Application Service                          │
│  Responsibilities:                                            │
│  - CRUD operations for applications                          │
│  - Application status tracking                               │
│  - Timeline management                                       │
│  - Application analytics                                     │
│  Port: 3003 (internal)                                       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                 Notification Service                          │
│  Responsibilities:                                            │
│  - Send emails (SendGrid)                                    │
│  - Send SMS (Twilio)                                         │
│  - Create in-app notifications                               │
│  - Queue management & retry logic                            │
│  - Deadline reminders                                        │
│  Port: 3004 (internal)                                       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   Analytics Service                           │
│  Responsibilities:                                            │
│  - Track application metrics                                 │
│  - Calculate success rates                                   │
│  - Generate admin reports                                    │
│  - User behavior analytics                                   │
│  Port: 3005 (internal)                                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Performance Metrics & SLAs

### Target Performance Metrics

| Metric | Target | Monitoring |
|--------|--------|------------|
| API Response Time | < 200ms (p95) | CloudWatch |
| Database Query Time | < 100ms (p95) | New Relic APM |
| Page Load Time | < 2s | Lighthouse |
| Cache Hit Rate | > 80% | Application logs |
| Application Success Rate | > 99.9% | Uptime Robot |

### Scalability Targets

- Concurrent Users: 10,000
- Requests per second: 1,000
- Database connections: 100
- Cache size: 10GB

---

## Security Architecture

### Authentication & Authorization
```
User Login
  ↓
Password hashing (bcryptjs)
  ↓
JWT token generation
  ↓
Token stored in secure HTTP-only cookie
  ↓
Each request validates token via middleware
  ↓
Role-based access control (RBAC)
  ↓
Admin endpoints require admin role
  ↓
User endpoints verify user ownership
```

### Data Protection
- All data encrypted at rest (PostgreSQL encryption)
- All data encrypted in transit (HTTPS/TLS)
- Sensitive fields masked in logs
- Regular security audits

### API Security
- Rate limiting per IP (100 requests/15 min)
- Auth rate limiting (5 attempts/hour)
- CORS restricted to whitelisted origins
- CSRF tokens on all forms
- SQL injection prevention (Prisma ORM)
- XSS protection (Content-Security-Policy headers)

---

## Disaster Recovery Plan

### Backup Strategy
- Database: Automated daily backups to AWS S3
- Retention: 30 days of daily backups
- Cross-region replication: Yes
- Recovery Time Objective (RTO): 1 hour
- Recovery Point Objective (RPO): 1 day

### Failover Procedure
1. Detection: Automated health checks
2. Alert: Team notified within 5 minutes
3. Assessment: Root cause analysis
4. Action: Automatic rollback or manual recovery
5. Validation: Full smoke test suite
6. Communication: Status page updated

---

## Deployment Pipeline

```
Git Push
  ↓
GitHub Actions Triggered
  ↓
├─ Run tests (Jest)
├─ Run linting (ESLint)
├─ Type checking (TypeScript)
└─ Build verification (npm run build)
  ↓
All checks pass?
  ├─ YES → Deploy to staging
  └─ NO → Block and notify
  ↓
Staging deployment
  ├─ Run smoke tests
  ├─ Run load tests
  └─ Manual approval required
  ↓
Manual approval?
  ├─ YES → Deploy to production
  └─ NO → Halt
  ↓
Production deployment
  ├─ Blue-green deployment
  ├─ Health check
  ├─ Monitor for errors (Sentry)
  └─ Auto-rollback on critical error
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.35 (App Router)
- **Language**: TypeScript 5.2.0
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.0
- **State Management**: Context API + useState
- **HTTP Client**: Fetch API + custom hooks

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Password Hashing**: bcryptjs

### Infrastructure
- **Hosting**: AWS Elastic Beanstalk / Vercel
- **Database**: AWS RDS PostgreSQL
- **Cache**: AWS ElastiCache (Redis)
- **Storage**: AWS S3
- **CDN**: CloudFront
- **Monitoring**: CloudWatch + Sentry
- **Email**: SendGrid
- **SMS**: Twilio

---

**Architecture Version**: 2.0
**Last Updated**: 2024-01-15
**Review Date**: 2024-04-15
