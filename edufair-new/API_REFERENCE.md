# EduFair API Reference

## Authentication

### Register User
**POST** `/api/auth`

Request:
```json
{
  "action": "register",
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe",
  "role": "student"
}
```

Response (201):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

### Login User
**POST** `/api/auth`

Request:
```json
{
  "action": "login",
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

---

## User Profile

### Get User Profile
**GET** `/api/users/profile`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "student",
    "country": "USA",
    "region_state": "California",
    "school_type": "private",
    "academic_grade": 3.8,
    "family_income": 50000,
    "preferred_field_of_study": "Computer Science",
    "career_goals": "Become a software engineer",
    "education_level": "ug",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Update User Profile
**PUT** `/api/users/profile`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request:
```json
{
  "country": "USA",
  "region_state": "Massachusetts",
  "academic_grade": 3.9,
  "family_income": 60000,
  "preferred_field_of_study": "Computer Science"
}
```

Response (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "student",
    "country": "USA",
    "region_state": "Massachusetts",
    "academic_grade": 3.9,
    "family_income": 60000,
    "preferred_field_of_study": "Computer Science",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

---

## Scholarships

### List All Scholarships
**GET** `/api/scholarships`

Headers:
```
Authorization: Bearer <token>
```

Query Parameters:
```
?status=active
?limit=50
```

Response (200):
```json
{
  "scholarships": [
    {
      "id": "uuid",
      "name": "Harvard Full Tuition Scholarship",
      "provider_name": "Harvard University",
      "description": "Full tuition for high achievers",
      "scholarship_amount": 60000,
      "amount_type": "full_tuition",
      "currency": "USD",
      "covers_living_expenses": true,
      "credibility_score": 0.99,
      "historical_acceptance_rate": 0.15,
      "risk_level": "low",
      "application_deadline": "2024-03-31T23:59:59Z",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Scholarship (Institution Only)
**POST** `/api/scholarships`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request:
```json
{
  "name": "New Scholarship Name",
  "provider_name": "Your Institution",
  "description": "Scholarship description",
  "scholarship_amount": 50000,
  "amount_type": "partial",
  "currency": "USD",
  "min_academic_grade": 3.5,
  "eligible_countries": ["USA", "Canada"],
  "eligible_education_levels": ["ug", "pg"],
  "application_deadline": "2024-12-31T23:59:59Z",
  "credibility_score": 0.85,
  "risk_level": "low",
  "total_awards_available": 100
}
```

Response (201):
```json
{
  "scholarship": {
    "id": "uuid",
    "name": "New Scholarship Name",
    "provider_name": "Your Institution",
    "scholarship_amount": 50000,
    "status": "active",
    "created_at": "2024-01-02T00:00:00Z"
  }
}
```

---

## Recommendations

### Get Personalized Recommendations
**GET** `/api/recommendations`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "recommendations": [
    {
      "student_id": "uuid",
      "scholarship_id": "uuid",
      "eligibility_match_score": 0.85,
      "credibility_score": 0.99,
      "reward_vs_competition_score": 0.75,
      "overall_suitability_score": 0.87,
      "matching_reasons": [
        "Matches your preferred field: Computer Science",
        "Available in your country: USA",
        "Your academic performance meets the requirements"
      ],
      "risk_factors": [],
      "recommended_rank": 1,
      "priority_level": "high",
      "created_at": "2024-01-02T00:00:00Z"
    }
  ],
  "total": 42
}
```

---

## Applications

### List Student Applications
**GET** `/api/applications`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "applications": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "scholarship_id": "uuid",
      "status": "submitted",
      "success_probability": 0.45,
      "submitted_at": "2024-01-15T00:00:00Z",
      "documents_complete": true,
      "scholarships": {
        "name": "Harvard Full Tuition Scholarship",
        "scholarship_amount": 60000,
        "application_deadline": "2024-03-31T23:59:59Z"
      },
      "created_at": "2024-01-10T00:00:00Z"
    }
  ]
}
```

### Create Application
**POST** `/api/applications`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request:
```json
{
  "scholarship_id": "uuid"
}
```

Response (201):
```json
{
  "application": {
    "id": "uuid",
    "student_id": "uuid",
    "scholarship_id": "uuid",
    "status": "draft",
    "success_probability": 0.45,
    "documents_complete": false,
    "created_at": "2024-01-02T00:00:00Z"
  }
}
```

---

## Fee Recommendations

### Generate Fee Recommendation
**POST** `/api/fee-recommendations`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request:
```json
{
  "institution_id": "uuid",
  "course_id": "uuid"
}
```

Response (201):
```json
{
  "plan": {
    "id": "uuid",
    "student_id": "uuid",
    "institution_id": "uuid",
    "course_id": "uuid",
    "total_tuition_cost": 240000,
    "estimated_living_expenses": 100000,
    "other_expenses": 17000,
    "total_cost": 357000,
    "scholarship_funding": 200000,
    "grant_funding": 50000,
    "loan_recommended": 80000,
    "self_funded_amount": 27000,
    "financial_feasibility_score": 0.72,
    "roi_score": 2.45,
    "created_at": "2024-01-02T00:00:00Z"
  },
  "analysis": {
    "costBreakdown": {
      "tuition": 240000,
      "livingExpenses": 100000,
      "otherExpenses": 17000,
      "total": 357000
    },
    "fundingPlan": {
      "scholarshipFunding": 200000,
      "grantFunding": 50000,
      "loanRecommended": 80000,
      "selfFunded": 27000,
      "total": 357000
    },
    "feasibilityScore": 0.72,
    "affordabilityAnalysis": "Moderately Feasible: This education is manageable with some financial planning...",
    "futureEarningPotential": 95000,
    "roiScore": 2.45,
    "riskAssessment": "No significant financial risks identified."
  }
}
```

### List Fee Recommendations
**GET** `/api/fee-recommendations`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "plans": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "institution_id": "uuid",
      "course_id": "uuid",
      "total_cost": 357000,
      "financial_feasibility_score": 0.72,
      "status": "active",
      "institutions": {
        "name": "Harvard University"
      },
      "courses": {
        "name": "Computer Science (BS)"
      },
      "created_at": "2024-01-02T00:00:00Z"
    }
  ]
}
```

---

## Institutions

### List Institutions
**GET** `/api/institutions`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "institutions": [
    {
      "id": "uuid",
      "name": "Harvard University",
      "country": "USA",
      "region_state": "Massachusetts",
      "location_city": "Cambridge",
      "institution_type": "private",
      "average_tuition_annual": 60000,
      "average_living_costs_annual": 25000,
      "currency": "USD",
      "credibility_score": 0.98,
      "verified": true,
      "employment_outcome_rate": 0.98,
      "avg_graduate_salary": 120000,
      "accreditation_status": "verified",
      "scam_risk_level": "low",
      "student_testimonials_count": 5000,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Institution (Admin Only)
**POST** `/api/institutions`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request:
```json
{
  "name": "New University",
  "country": "USA",
  "region_state": "California",
  "location_city": "San Francisco",
  "institution_type": "private",
  "average_tuition_annual": 55000,
  "average_living_costs_annual": 24000,
  "available_fields_of_study": ["STEM", "Business"],
  "credibility_score": 0.85
}
```

---

## Alerts

### Get Unread Alerts
**GET** `/api/alerts`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "alerts": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "alert_type": "deadline",
      "title": "Deadline Approaching",
      "message": "Harvard Full Tuition Scholarship deadline is in 7 days",
      "scholarship_id": "uuid",
      "is_read": false,
      "scheduled_for": "2024-03-24T00:00:00Z",
      "created_at": "2024-03-17T00:00:00Z"
    }
  ]
}
```

### Mark Alert as Read
**POST** `/api/alerts`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request:
```json
{
  "alert_id": "uuid"
}
```

Response (200):
```json
{
  "alert": {
    "id": "uuid",
    "user_id": "uuid",
    "alert_type": "deadline",
    "title": "Deadline Approaching",
    "message": "Harvard Full Tuition Scholarship deadline is in 7 days",
    "is_read": true,
    "updated_at": "2024-03-17T10:00:00Z"
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Failed to process request"
}
```

---

## Rate Limiting

Current limits:
- Authentication: 5 requests per minute per IP
- API: 100 requests per minute per user
- Recommendations: 10 requests per minute per user

---

## Data Types

See `src/types/index.ts` for full TypeScript interfaces:
- `User`
- `Scholarship`
- `Institution`
- `Course`
- `ScholarshipApplication`
- `ScholarshipRecommendation`
- `FeeRecommendationPlan`
- `Alert`
- `StudentTestimonial`

---

## Pagination

List endpoints support pagination:
```
GET /api/scholarships?limit=20&offset=0
```

Response includes:
```json
{
  "data": [...],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

---

## Filtering

Supported filters by endpoint:
- Scholarships: `status`, `country`, `riskLevel`, `minAmount`
- Applications: `status`, `studentId`
- Alerts: `userId`, `isRead`, `alertType`

---

## Webhook Events (Future)

Planned webhook events:
- `application.submitted`
- `scholarship.created`
- `recommendation.generated`
- `alert.sent`

---

## SDK Support (Future)

Planned SDKs:
- JavaScript/TypeScript
- Python
- Go
- Ruby

---

## Need Help?

- Check error messages - they indicate the exact issue
- Review HTTP status codes:
  - 2xx: Success
  - 4xx: Client error (check your request)
  - 5xx: Server error (try again or contact support)
- All timestamps are in ISO 8601 format (UTC)
- All IDs are UUIDs (36-character strings with hyphens)
