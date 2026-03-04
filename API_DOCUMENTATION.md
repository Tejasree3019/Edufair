# 📚 EduFair Complete API Documentation

## Base URL
```
Production: https://edufair.com/api
Development: http://localhost:3000/api
```

---

## Authentication

### JWT Token Structure
```
Header: Authorization: Bearer <token>
Token Format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "student"
}

Response (201):
{
  "success": true,
  "message": "User created successfully",
  "userId": "user_123"
}
```

### Verify Token
```http
GET /auth/verify
Authorization: Bearer <token>

Response (200):
{
  "valid": true,
  "user": { /* user object */ }
}
```

---

## Scholarships

### Get All Scholarships (Real-Time)
```http
GET /scholarships-realtime?
  filter={"country":"India","minAmount":5000}&
  sort=relevance&
  limit=20&
  offset=0

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "scholarship_1",
      "name": "Scholarship Name",
      "provider": "University Name",
      "amount": 50000,
      "currency": "INR",
      "deadline": "2024-03-31",
      "eligibility": {
        "gpaMin": 3.5,
        "ageMax": 25,
        "countries": ["India"]
      },
      "description": "Full description...",
      "category": "merit-based",
      "matchPercentage": 85,
      "source": "government",
      "credibility": "high",
      "requirements": ["10th pass", "GPA > 3.5"]
    }
  ],
  "pagination": {
    "total": 150,
    "returned": 20,
    "offset": 0,
    "limit": 20
  },
  "metadata": {
    "fetchedAt": "2024-01-15T10:30:00Z",
    "cacheStatus": "active"
  }
}
```

### Search Scholarships
```http
GET /scholarships/search?
  q=engineering&
  category=merit-based&
  minAmount=10000&
  maxAmount=500000&
  country=India

Response (200):
{
  "success": true,
  "count": 25,
  "scholarships": [...]
}
```

### Get Scholarship Details
```http
GET /scholarships/{id}

Response (200):
{
  "success": true,
  "scholarship": {
    "id": "scholarship_1",
    "name": "Full Name",
    "provider": "Provider",
    "amount": 50000,
    "deadline": "2024-03-31",
    "description": "Detailed description...",
    "eligibility": {...},
    "applicationUrl": "https://apply.example.com",
    "contactEmail": "contact@example.com",
    "statistics": {
      "applicants": 1250,
      "awardees": 50,
      "acceptanceRate": 4,
      "avgAwardAmount": 45000
    }
  }
}
```

### Refresh Cache
```http
POST /scholarships-realtime
Content-Type: application/json

{
  "action": "refresh",
  "sources": ["government", "university"]
}

Response (200):
{
  "success": true,
  "message": "Cache refreshed",
  "cacheStats": {
    "government": { "count": 45, "lastUpdate": "2024-01-15T10:30:00Z" },
    "university": { "count": 32, "lastUpdate": "2024-01-15T10:29:00Z" }
  }
}
```

---

## Applications

### Create Application
```http
POST /applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "scholarshipId": "scholarship_1",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2000-01-15",
    "gender": "male"
  },
  "academicInfo": {
    "currentGrade": "12th",
    "gpa": 3.8,
    "board": "CBSE",
    "school": "St. Xavier School"
  },
  "contactInfo": {
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "address": "123 Main St, City, State 123456"
  },
  "documents": {
    "transcripts": "url_to_file",
    "identityProof": "url_to_file",
    "addressProof": "url_to_file"
  },
  "essay": "My essay...",
  "additionalInfo": {...}
}

Response (201):
{
  "success": true,
  "application": {
    "id": "app_123",
    "scholarshipId": "scholarship_1",
    "userId": "user_123",
    "status": "submitted",
    "createdAt": "2024-01-15T10:30:00Z",
    "estimatedDecision": "2024-03-31"
  }
}
```

### Get My Applications
```http
GET /applications?status=submitted&sort=createdAt

Response (200):
{
  "success": true,
  "applications": [
    {
      "id": "app_123",
      "scholarshipId": "scholarship_1",
      "scholarshipName": "Scholarship Name",
      "status": "submitted",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "matchPercentage": 85,
      "timeline": [
        { "status": "submitted", "date": "2024-01-15" },
        { "status": "under_review", "date": "2024-01-20" }
      ]
    }
  ],
  "summary": {
    "total": 5,
    "submitted": 2,
    "reviewing": 2,
    "accepted": 1,
    "rejected": 0
  }
}
```

### Get Application Details
```http
GET /applications/{id}
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "application": {
    "id": "app_123",
    "scholarshipName": "Scholarship Name",
    "status": "reviewing",
    "personalInfo": {...},
    "academicInfo": {...},
    "documents": {...},
    "timeline": [...],
    "feedback": {
      "lastUpdate": "2024-01-20T14:00:00Z",
      "message": "Your application is being reviewed..."
    }
  }
}
```

### Update Application
```http
PUT /applications/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "personalInfo": { /* updated data */ }
}

Response (200):
{
  "success": true,
  "message": "Application updated successfully"
}
```

### Withdraw Application
```http
DELETE /applications/{id}
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Application withdrawn successfully"
}
```

---

## Application Tracking

### Get Tracking Dashboard
```http
GET /tracking/dashboard
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "stats": {
    "total": 5,
    "submitted": 2,
    "reviewing": 2,
    "accepted": 1,
    "rejected": 0,
    "successRate": 20
  },
  "applications": [
    {
      "id": "app_123",
      "scholarshipName": "Name",
      "status": "reviewing",
      "appliedDate": "2024-01-15",
      "estimatedDecision": "2024-03-31",
      "matchPercentage": 85
    }
  ],
  "timeline": [
    {
      "date": "2024-01-15",
      "events": ["Application submitted"]
    }
  ]
}
```

---

## Admin Endpoints

### Get Admin Dashboard
```http
GET /admin/dashboard
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "metrics": {
    "totalUsers": 1250,
    "totalApplications": 3847,
    "totalScholarships": 20,
    "successRate": 34,
    "avgProcessingTime": 15
  },
  "topScholarships": [
    {
      "id": "scholarship_1",
      "name": "Name",
      "applications": 250,
      "acceptanceRate": 8
    }
  ],
  "recentApplications": [...]
}
```

### Get All Users
```http
GET /admin/users?page=1&limit=50&role=student

Response (200):
{
  "success": true,
  "users": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "student",
      "createdAt": "2024-01-10",
      "applicationCount": 5,
      "status": "active"
    }
  ],
  "pagination": { "total": 1250, "page": 1, "limit": 50 }
}
```

### Update User Status
```http
PUT /admin/users/{id}/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "suspended",
  "reason": "Violation of terms"
}

Response (200):
{
  "success": true,
  "message": "User status updated"
}
```

### Get Application Statistics
```http
GET /admin/statistics?type=applications&period=monthly

Response (200):
{
  "success": true,
  "data": {
    "january": {
      "applications": 450,
      "accepted": 155,
      "rejected": 120,
      "pending": 175
    },
    "february": {...}
  }
}
```

---

## Notifications

### Get My Notifications
```http
GET /notifications?read=false&limit=20

Response (200):
{
  "success": true,
  "notifications": [
    {
      "id": "notif_123",
      "type": "status_update",
      "title": "Application Status Updated",
      "message": "Your application is under review",
      "scholarshipId": "scholarship_1",
      "applicationId": "app_123",
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Mark as Read
```http
PUT /notifications/{id}/read
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 5
}
```

---

## Recommendations

### Get Personalized Recommendations
```http
GET /recommendations?limit=10

Response (200):
{
  "success": true,
  "recommendations": [
    {
      "id": "scholarship_1",
      "name": "Scholarship Name",
      "matchScore": 95,
      "reason": "Matches your academic profile and location",
      "deadline": "2024-03-31"
    }
  ]
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Server Error

### Common Error Codes
- `VALIDATION_ERROR` - Invalid input
- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1705324200
```

### Rate Limits by Endpoint
- Authentication: 5 requests/hour
- General API: 100 requests/15 minutes
- File Upload: 10 requests/hour
- Webhook: 1000 requests/hour

---

## Webhooks (Coming Soon)

### Webhook Events
- `application.submitted`
- `application.reviewed`
- `application.accepted`
- `application.rejected`
- `scholarship.updated`
- `scholarship.deadline-reminder`

### Register Webhook
```http
POST /webhooks
Content-Type: application/json

{
  "url": "https://your-domain.com/webhook",
  "events": ["application.submitted", "application.accepted"]
}
```

---

## Code Examples

### JavaScript/Fetch
```javascript
// Get scholarships
const response = await fetch('https://edufair.com/api/scholarships-realtime', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
const data = await response.json()
```

### Python/Requests
```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://edufair.com/api/scholarships-realtime',
    headers=headers,
    params={'limit': 20, 'sort': 'relevance'}
)
data = response.json()
```

### cURL
```bash
curl -X GET "https://edufair.com/api/scholarships-realtime?limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

**API Version**: 1.0
**Last Updated**: 2024-01-15
**Status**: Production Ready ✅
