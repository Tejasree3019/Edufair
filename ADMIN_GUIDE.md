# 👨‍💼 EduFair Admin Guide

## Table of Contents
1. [Admin Dashboard Overview](#admin-dashboard-overview)
2. [Managing Applications](#managing-applications)
3. [Managing Scholarships](#managing-scholarships)
4. [Managing Users](#managing-users)
5. [Analytics & Reporting](#analytics--reporting)
6. [System Monitoring](#system-monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Admin Dashboard Overview

### Accessing the Dashboard
1. Log in with admin credentials
2. Navigate to `/admin` or click "Admin Dashboard" in navigation
3. Dashboard displays 4 main sections:

### Dashboard Tabs

#### 1. Overview Tab
Shows key platform metrics:
- **Total Users**: Count of all registered students
- **Total Applications**: All applications across platform
- **Total Scholarships**: Available scholarship listings
- **Success Rate**: % of accepted applications
- **Avg Processing Time**: Average decision time in days

**Charts & Visualizations:**
- Application status distribution (pie chart)
- Top 5 scholarships by applications
- Trends over time (line graph)

#### 2. Applications Tab
Manage all student applications:
- View detailed application list
- Filter by status (submitted, reviewing, accepted, rejected)
- View applicant information
- Make acceptance/rejection decisions
- Add feedback messages

**Quick Actions:**
- View full application details
- Download applicant documents
- Send decision notification
- Add internal notes

#### 3. Scholarships Tab
Manage scholarship database:
- Add new scholarships
- Edit scholarship details (amount, deadline, requirements)
- Update eligibility criteria
- Upload scholarship documents
- Manage source URLs
- Set credibility rating

**Data Fields to Manage:**
- Scholarship name & description
- Award amount (min/max)
- Deadline date
- Eligibility requirements
- Application URL
- Category & field of study
- Provider/source information

#### 4. Users Tab
User management and moderation:
- View all registered users
- Search by name, email, or ID
- View user profile details
- User statistics (applications, success rate)
- Ban/suspend users
- Reset user passwords
- Export user data

**User Actions:**
- View profile
- View all applications
- Send messages
- Suspend account
- Delete account
- Reset password

---

## Managing Applications

### Application Lifecycle
```
Draft → Submitted → Reviewing → Decision → Accepted/Rejected
                      ↓
                   Withdrawn
```

### Reviewing Applications

**Step 1: View Application**
1. Go to Applications tab
2. Click application from list
3. View all submitted information:
   - Personal details
   - Academic records
   - Documents (transcripts, essays)
   - Application timeline

**Step 2: Evaluate**
1. Review eligibility against scholarship criteria
2. Check document authenticity
3. Verify academic requirements met
4. Review any red flags

**Step 3: Make Decision**
1. Click "Make Decision" button
2. Select status:
   - ✅ **Accepted**: Student receives award
   - ❌ **Rejected**: Application denied
   - ⏳ **Under Review**: Needs more time
3. Write feedback message (required)
4. Include decision details if needed

**Step 4: Send Notification**
1. Notification automatically sent via:
   - Email (with decision letter)
   - SMS (alert message)
   - In-app notification
2. Can resend notification if needed

### Application Filtering

**Status Filters:**
- **Submitted**: Just received, not yet reviewed
- **Reviewing**: Currently under evaluation
- **Accepted**: Approved for award
- **Rejected**: Denied application
- **Withdrawn**: Student withdrew

**Sort Options:**
- Date submitted (newest/oldest)
- Decision date
- Match percentage
- Application ID

### Bulk Actions

**Import Applications:**
1. Go to Applications tab
2. Click "Import" button
3. Upload CSV with columns:
   - scholarship_id
   - user_email
   - status
   - notes

**Export Applications:**
1. Click "Export" button
2. Choose format: CSV or Excel
3. Select date range
4. Download file

---

## Managing Scholarships

### Adding a New Scholarship

**Basic Information:**
```
Name: "Government Merit Scholarship 2024"
Description: Full description of scholarship...
Provider: "Ministry of Education"
Category: "Merit-based"
Country: "India"
```

**Award Details:**
```
Minimum Amount: ₹10,000
Maximum Amount: ₹100,000
Currency: INR
Frequency: Annual
Number of Awards: 100
```

**Important Dates:**
```
Application Opening: 2024-02-01
Application Deadline: 2024-03-31
Decision Date: 2024-05-15
Award Start Date: 2024-07-01
```

**Eligibility Requirements:**
```
- Minimum GPA: 3.5/4.0
- Age: Max 25 years
- Citizenship: India
- Field of Study: Engineering, Science
- Course Level: Bachelor's, Master's
```

**Additional Fields:**
```
Source: Government/University/Private/NGO
Credibility Rating: High (0-100)
Application URL: https://apply.example.com
Contact Email: admin@example.com
```

### Editing Scholarships

1. Go to Scholarships tab
2. Find scholarship in list
3. Click "Edit" button
4. Modify fields as needed
5. Update "Last Modified" date automatically
6. Save changes
7. Changes reflected immediately

### Setting Credibility Scores

Credibility score (0-100) affects:
- Ranking in search results
- User recommendation engine
- Trust score display

**Scoring Guidelines:**
- **90-100**: Government official scholarships
- **80-89**: Major university scholarships
- **70-79**: Verified private foundations
- **50-69**: Emerging/smaller scholarships
- **<50**: Unverified sources

### Managing Scholarship Data Sources

**Available Data Sources:**
1. **Government Portals** (scholarships.gov.in)
   - Status: Auto-fetched daily
   - Count: 45 scholarships
   - Last Updated: 2024-01-15

2. **University Websites** (IIT, NIT, State Universities)
   - Status: Auto-fetched daily
   - Count: 32 scholarships
   - Last Updated: 2024-01-15

3. **Private Foundations**
   - Status: Manually curated
   - Count: 18 scholarships
   - Last Updated: 2024-01-14

4. **NGO & CSR Initiatives**
   - Status: Partially automated
   - Count: 12 scholarships
   - Last Updated: 2024-01-13

**Refresh Data Source:**
1. Click "Refresh Cache" button
2. Select sources to refresh
3. Wait for completion (2-5 minutes)
4. View refresh status and timestamp

---

## Managing Users

### User Search

**Search Options:**
- By email address
- By full name
- By user ID
- By registration date
- By status (active/inactive/suspended)

**Quick Filters:**
- Students (default role)
- Admins
- Moderators
- Verified email
- Active users only

### Viewing User Profile

**User Information:**
- Full name & email
- Phone number
- Current location
- Date of birth
- Academic details (GPA, board, school)
- Profile completion status

**User Statistics:**
- Total applications: 5
- Accepted: 1 (20% success rate)
- Pending review: 2
- Rejected: 2
- Average processing time: 15 days

**Application History:**
- All applications listed
- Status of each
- Dates submitted
- Decision feedback (if any)

### User Actions

**Edit User Profile:**
1. Click user from list
2. Click "Edit Profile"
3. Update fields (name, email, phone, etc.)
4. Save changes
5. User notified of profile changes

**Send Message:**
1. Click user
2. Click "Send Message" button
3. Write message
4. Choose channels: Email, SMS, In-app
5. Send notification

**Suspend Account:**
1. Click user
2. Click "Suspend" button
3. Provide reason for suspension
4. User receives notification
5. User cannot log in
6. Can be re-activated later

**Delete Account:**
1. Click user
2. Click "Delete" button
3. Confirm deletion (cannot be undone)
4. All user data deleted (except legal/compliance records)
5. Admin action logged

**Reset Password:**
1. Click user
2. Click "Reset Password"
3. Generate temporary password
4. Send to user via email
5. User must change on next login

---

## Analytics & Reporting

### Dashboard Metrics

**Metric Calculations:**

**Success Rate:**
```
Success Rate = (Accepted Applications / Total Submitted) × 100
Example: 34% = (1,307 accepted / 3,847 submitted)
```

**Average Processing Time:**
```
Avg Time = Sum of (Decision Date - Submit Date) / Total Decisions
Example: 15 days average time to decision
```

**Application Status Distribution:**
- Submitted: 1,250 (32%)
- Reviewing: 1,547 (40%)
- Accepted: 1,307 (34%)
- Rejected: 743 (19%)
- Withdrawn: 42 (1%)

### Top Scholarships

Ranked by application volume:
1. **Government Merit Scholarship 2024** - 250 applicants, 8% acceptance
2. **IIT Scholarship Program** - 180 applicants, 5% acceptance
3. **State Government Scholarship** - 165 applicants, 12% acceptance
4. **University Fellowship** - 142 applicants, 15% acceptance
5. **Corporate CSR Scholarship** - 125 applicants, 20% acceptance

### Generating Reports

**Monthly Report:**
1. Click "Generate Report" button
2. Select "Monthly" period
3. Choose month/year
4. Download as PDF or Excel
5. Includes:
   - Summary statistics
   - Application trends
   - User growth
   - Revenue (if applicable)

**Custom Date Range:**
1. Click "Custom Report"
2. Select start & end dates
3. Choose metrics to include
4. Select visualization type
5. Download report

**Export Data:**
1. Click "Export" button
2. Choose format (CSV/Excel/JSON)
3. Select data to export:
   - Users
   - Applications
   - Scholarships
   - Notifications
4. Download file for external analysis

---

## System Monitoring

### Health Check Dashboard

**System Status:**
- ✅ API Health: Operational
- ✅ Database: Connected
- ✅ Cache: Active (Redis)
- ✅ Email Service: Operational
- ✅ SMS Service: Operational

**Performance Metrics:**
- API Response Time: 145ms (target: <200ms)
- Database Query Time: 85ms (target: <100ms)
- Cache Hit Rate: 87% (target: >80%)
- Uptime: 99.97%

### Error Monitoring

**Recent Errors:**
- Application form submission (1 error)
- Email notification failed (3 errors)
- Cache miss on scholarships (2 warnings)

**Error Details:**
- Error type & code
- Timestamp
- Affected user/resource
- Stack trace (for debugging)

**Action:**
1. Click error to see details
2. View affected applications
3. Retry operation if applicable
4. Add to bug tracking system

### System Logs

**Log Types:**
- **Info**: Normal operations
- **Warning**: Potential issues
- **Error**: System errors
- **Debug**: Detailed debugging info

**View Logs:**
1. Go to System Monitoring
2. Click "View Logs"
3. Filter by log level (Info/Warning/Error)
4. Search by keyword
5. Date range filter
6. Download full log file

**Log Search Examples:**
```
Search: "user_login" - See all login attempts
Search: "database_error" - See DB-related issues
Search: "email_failed" - See email sending failures
```

---

## Troubleshooting

### Common Issues

**Applications Not Showing:**
1. Check user role is not suspended
2. Verify application date range
3. Clear cache and refresh
4. Check database connection

**Email Notifications Not Sent:**
1. Verify SendGrid API key configured
2. Check email address valid
3. Look in email spam folder
4. View error logs for details

**Scholarship Data Not Updating:**
1. Click "Refresh Cache" button
2. Check data source URLs
3. Verify API keys for government portals
4. Check internet connection

**User Cannot Log In:**
1. Verify account is not suspended
2. Check email address is correct
3. Offer password reset
4. Check for account locks

### Performance Issues

**If system is slow:**
1. Check API response times in monitoring
2. Check database query times
3. Restart Redis cache
4. Check server CPU/memory usage
5. Contact hosting provider

**If database is slow:**
1. Run database optimization queries
2. Update statistics: `ANALYZE;`
3. Rebuild indexes: `REINDEX;`
4. Check table sizes and archive old data

### Backup & Recovery

**Manual Backup:**
1. Go to System → Backup
2. Click "Create Backup"
3. Wait for completion
4. Backup stored to AWS S3
5. Can download locally if needed

**Restore from Backup:**
1. Go to System → Restore
2. Select backup date
3. Preview data to restore
4. Confirm restoration
5. System restored to that point in time

---

## Admin Best Practices

✅ **DO:**
- Review applications within 24-48 hours
- Keep scholarship data current
- Monitor system health daily
- Respond to user issues promptly
- Maintain data backup schedule
- Document policy changes
- Regular security audits

❌ **DON'T:**
- Approve suspicious applications
- Delete user data unnecessarily
- Ignore system error alerts
- Make decisions without evidence
- Share sensitive data
- Modify applications after decision
- Bypass security protocols

---

## Support & Contact

- **Email**: admin@edufair.com
- **Phone**: +91-9876-543-210
- **Emergency**: +91-9000-000-000
- **System Status**: https://status.edufair.com

---

**Admin Guide Version**: 1.0
**Last Updated**: 2024-01-15
**Next Review**: 2024-04-15
