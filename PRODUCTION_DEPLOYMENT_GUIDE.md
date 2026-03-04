# 🚀 EduFair Production Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Migration](#database-migration)
4. [Security Configuration](#security-configuration)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)
8. [Deployment Steps](#deployment-steps)
9. [Post-Deployment Verification](#post-deployment-verification)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (npm run test)
- [ ] No TypeScript errors (npm run type-check)
- [ ] No ESLint warnings (npm run lint)
- [ ] Build succeeds (npm run build)
- [ ] All critical features tested

### Security
- [ ] Environment variables configured
- [ ] API keys secured in .env.production
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

### Performance
- [ ] Database indexes optimized
- [ ] Images optimized and compressed
- [ ] Code splitting configured
- [ ] Caching strategy implemented
- [ ] CDN configured for static assets

### Documentation
- [ ] README updated
- [ ] API documentation complete
- [ ] Deployment guide written
- [ ] Runbook for incidents created
- [ ] Backup procedures documented

---

## Environment Setup

### Production Environment Variables

Create `.env.production.local`:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/edufair_prod
DATABASE_SSL=true

# Authentication
NEXTAUTH_URL=https://edufair.com
NEXTAUTH_SECRET=your-secure-random-secret-here
JWT_SECRET=your-secure-jwt-secret-here

# Email Service
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@edufair.com

# SMS Service
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=edufair-prod
AWS_REGION=us-east-1

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# API Keys
EXTERNAL_API_KEY=your-external-api-key

# Feature Flags
ENABLE_REAL_TIME_DATA=true
ENABLE_NOTIFICATIONS=true
ENABLE_ANALYTICS=true

# Cache
REDIS_URL=redis://user:password@host:6379

# Monitoring
LOG_LEVEL=info
DEBUG=false
```

### Secrets Management

Use AWS Secrets Manager or similar:

```bash
aws secretsmanager create-secret \
  --name edufair/prod/database-url \
  --secret-string "postgresql://..."

aws secretsmanager create-secret \
  --name edufair/prod/jwt-secret \
  --secret-string "your-secure-secret"
```

---

## Database Migration

### Initial Setup

```bash
# Connect to production database
psql postgresql://user:password@host:5432/edufair_prod

# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed

# Verify schema
npx prisma studio
```

### Backup Before Migration

```bash
# PostgreSQL backup
pg_dump -U user -h host edufair_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Compress
gzip backup_*.sql

# Store on S3
aws s3 cp backup_*.sql.gz s3://edufair-backups/
```

---

## Security Configuration

### SSL/TLS Certificates

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --standalone -d edufair.com -d www.edufair.com

# Configure nginx
server {
    listen 443 ssl http2;
    server_name edufair.com www.edufair.com;

    ssl_certificate /etc/letsencrypt/live/edufair.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/edufair.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### API Rate Limiting

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 login attempts per hour
  skipSuccessfulRequests: true,
})
```

### CORS Configuration

```typescript
// next.config.js
const cors = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://edufair.com', 'https://www.edufair.com']
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
```

---

## Performance Optimization

### Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    loader: 'cloudinary',
    loaderFile: './utils/loaders.ts',
    minimumCacheTTL: 60,
  },
}
```

### Database Query Optimization

```typescript
// Example: Add indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_scholarships_category ON scholarships(category);
```

### Caching Strategy

```typescript
// API response caching
export const revalidate = 3600 // 1 hour

export async function GET(request: NextRequest) {
  const scholarships = await fetchScholarships()
  
  return NextResponse.json(scholarships, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
```

---

## Monitoring & Logging

### Application Monitoring

```typescript
// lib/monitoring.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
})
```

### Structured Logging

```typescript
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}

export default logger
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabase(),
      cache: await checkCache(),
      email: await checkEmailService(),
    },
  }

  return NextResponse.json(health)
}
```

---

## Backup & Recovery

### Automated Backups

```bash
# Daily backup script
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="edufair_prod_$DATE.sql.gz"

# Create backup
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME | gzip > $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE s3://edufair-backups/

# Keep last 30 days locally
find . -name "edufair_prod_*.sql.gz" -mtime +30 -delete

# Send notification
aws sns publish --topic-arn arn:aws:sns:region:account:backups \
  --message "Backup completed: $BACKUP_FILE"
```

### Recovery Procedure

```bash
# List available backups
aws s3 ls s3://edufair-backups/

# Download backup
aws s3 cp s3://edufair-backups/edufair_prod_20240115_120000.sql.gz .

# Restore
gunzip -c edufair_prod_20240115_120000.sql.gz | \
  psql -U user -h host edufair_prod
```

---

## Deployment Steps

### Using AWS Elastic Beanstalk

```bash
# 1. Install EB CLI
pip install awsebcli --upgrade --user

# 2. Initialize application
eb init -p "Node.js 18" edufair

# 3. Create environment
eb create prod-environment --instance-type t3.medium

# 4. Deploy
eb deploy

# 5. Monitor
eb logs
eb status

# 6. SSH access
eb ssh
```

### Using Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and deploy
docker build -t edufair:latest .
docker tag edufair:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/edufair:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/edufair:latest

# Deploy to ECS
aws ecs update-service --cluster prod --service edufair --force-new-deployment
```

---

## Post-Deployment Verification

### Health Checks

```bash
# Check application health
curl -X GET https://edufair.com/api/health

# Verify database connection
curl -X GET https://edufair.com/api/database-health

# Check API endpoints
curl -X GET https://edufair.com/api/scholarships-realtime

# Verify authentication
curl -X POST https://edufair.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 100 https://edufair.com/

# Using Artillery
artillery run load-test.yml

# Monitor with CloudWatch
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name TargetResponseTime \
  --start-time 2024-01-15T00:00:00Z \
  --end-time 2024-01-15T01:00:00Z \
  --period 60 \
  --statistics Average
```

### Smoke Tests

```bash
#!/bin/bash

ENDPOINT="https://edufair.com"

echo "Testing homepage..."
curl -s -o /dev/null -w "%{http_code}" $ENDPOINT | grep -q "200" && echo "✓ Homepage OK"

echo "Testing scholarships API..."
curl -s $ENDPOINT/api/scholarships-realtime | jq . > /dev/null && echo "✓ Scholarships API OK"

echo "Testing health endpoint..."
curl -s $ENDPOINT/api/health | jq .status | grep -q "ok" && echo "✓ Health OK"

echo "All smoke tests passed!"
```

---

## Rollback Procedure

```bash
# If deployment fails, rollback to previous version
eb abort  # For Elastic Beanstalk

# Or use Docker/ECS
aws ecs update-service \
  --cluster prod \
  --service edufair \
  --task-definition edufair:previous-version

# Or using Git
git revert HEAD
git push origin main
```

---

## Ongoing Maintenance

### Weekly Tasks
- [ ] Review error logs
- [ ] Check system performance
- [ ] Verify backup completion
- [ ] Review security alerts

### Monthly Tasks
- [ ] Dependency updates
- [ ] Database optimization
- [ ] Security audit
- [ ] Capacity planning

### Quarterly Tasks
- [ ] Full disaster recovery test
- [ ] Security penetration testing
- [ ] Performance optimization review
- [ ] Compliance audit

---

**Deployment Status**: Ready for Production ✅
**Last Updated**: 2024-01-15
**Next Review**: 2024-04-15
