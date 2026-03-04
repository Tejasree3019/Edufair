// Supabase SQL Schema for EduFair
// Run these queries in Supabase SQL Editor

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'institution', 'admin')) DEFAULT 'student',
  
  -- Student Profile Fields
  country TEXT,
  region_state TEXT,
  school_type TEXT CHECK (school_type IN ('government', 'private', 'international')),
  academic_grade DECIMAL(5,2), -- GPA or percentage
  test_scores JSONB, -- Flexible storage for various test scores
  family_income BIGINT,
  preferred_field_of_study TEXT,
  career_goals TEXT,
  education_level TEXT CHECK (education_level IN ('10th', '12th', 'diploma', 'ug', 'pg')),
  
  -- Institution Profile Fields
  institution_name TEXT,
  institution_type TEXT,
  institution_verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarships Table
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  provider_name TEXT NOT NULL,
  description TEXT,
  
  -- Eligibility Criteria
  min_academic_grade DECIMAL(5,2),
  max_academic_grade DECIMAL(5,2),
  required_test_scores JSONB,
  eligible_countries TEXT[] DEFAULT ARRAY[]::TEXT[],
  eligible_regions TEXT[] DEFAULT ARRAY[]::TEXT[],
  eligible_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  min_family_income BIGINT,
  max_family_income BIGINT,
  eligible_education_levels TEXT[] DEFAULT ARRAY[]::TEXT[],
  eligible_fields_of_study TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Financial Details
  scholarship_amount BIGINT NOT NULL,
  amount_type TEXT CHECK (amount_type IN ('full_tuition', 'partial', 'fixed')) DEFAULT 'fixed',
  currency TEXT DEFAULT 'USD',
  covers_living_expenses BOOLEAN DEFAULT FALSE,
  
  -- Process & Credibility
  application_deadline TIMESTAMP WITH TIME ZONE,
  award_date TIMESTAMP WITH TIME ZONE,
  credibility_score DECIMAL(3,2) DEFAULT 0.50, -- 0-1 scale
  historical_acceptance_rate DECIMAL(3,2), -- 0-1 scale
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
  total_awards_available INT,
  previous_year_awardees INT,
  
  -- Status
  status TEXT CHECK (status IN ('active', 'inactive', 'expired')) DEFAULT 'active',
  institution_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT deadline_in_future CHECK (application_deadline > NOW())
);

-- Colleges/Institutions Table
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region_state TEXT,
  location_city TEXT,
  institution_type TEXT CHECK (institution_type IN ('government', 'private', 'international')) NOT NULL,
  
  -- Financial Information
  average_tuition_annual BIGINT,
  average_living_costs_annual BIGINT,
  currency TEXT DEFAULT 'USD',
  
  -- Programs Offered
  available_programs TEXT[] DEFAULT ARRAY[]::TEXT[],
  available_fields_of_study TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Credibility Metrics
  credibility_score DECIMAL(3,2) DEFAULT 0.50,
  verified BOOLEAN DEFAULT FALSE,
  employment_outcome_rate DECIMAL(3,2),
  avg_graduate_salary BIGINT,
  
  -- Accreditation & Risk
  accreditation_status TEXT CHECK (accreditation_status IN ('verified', 'pending', 'rejected')) DEFAULT 'pending',
  scam_risk_level TEXT CHECK (scam_risk_level IN ('low', 'medium', 'high')) DEFAULT 'low',
  student_testimonials_count INT DEFAULT 0,
  
  contact_email TEXT,
  website_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  field_of_study TEXT NOT NULL,
  duration_years DECIMAL(3,1),
  education_level TEXT CHECK (education_level IN ('10th', '12th', 'diploma', 'ug', 'pg')) NOT NULL,
  
  -- Cost Information
  tuition_annual BIGINT,
  currency TEXT DEFAULT 'USD',
  
  -- Career Outcomes
  avg_starting_salary BIGINT,
  employment_rate DECIMAL(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications Table (Student Applications)
CREATE TABLE scholarship_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  
  status TEXT CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'draft',
  success_probability DECIMAL(3,2) DEFAULT 0.50, -- 0-1 scale (calculated)
  
  -- Application Details
  applied_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  decision_date TIMESTAMP WITH TIME ZONE,
  decision TEXT,
  
  -- Document Tracking
  required_documents JSONB,
  submitted_documents JSONB,
  documents_complete BOOLEAN DEFAULT FALSE,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(student_id, scholarship_id)
);

-- Alerts & Notifications Table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  alert_type TEXT CHECK (alert_type IN ('deadline', 'new_scholarship', 'document_reminder', 'eligibility_change', 'status_update')) NOT NULL,
  
  title TEXT NOT NULL,
  message TEXT,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL,
  application_id UUID REFERENCES scholarship_applications(id) ON DELETE SET NULL,
  
  related_data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fee Recommendation Plan Table
CREATE TABLE fee_recommendation_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Cost Breakdown
  total_tuition_cost BIGINT NOT NULL,
  estimated_living_expenses BIGINT NOT NULL,
  other_expenses BIGINT DEFAULT 0,
  total_cost BIGINT NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Funding Plan
  scholarship_funding BIGINT DEFAULT 0,
  grant_funding BIGINT DEFAULT 0,
  loan_recommended BIGINT DEFAULT 0,
  self_funded_amount BIGINT,
  
  -- Analysis
  financial_feasibility_score DECIMAL(3,2), -- 0-1 scale
  affordability_analysis TEXT,
  future_earning_potential BIGINT,
  roi_score DECIMAL(5,2), -- Return on investment percentage
  risk_assessment TEXT,
  
  -- Status
  status TEXT CHECK (status IN ('active', 'archived')) DEFAULT 'active',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarship Recommendations Engine Table
CREATE TABLE scholarship_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  
  -- Scoring Algorithm Results
  eligibility_match_score DECIMAL(3,2), -- 0-1 scale
  credibility_score DECIMAL(3,2), -- 0-1 scale
  reward_vs_competition_score DECIMAL(3,2), -- 0-1 scale
  overall_suitability_score DECIMAL(3,2), -- 0-1 scale (weighted average)
  
  -- Explanation
  matching_reasons TEXT[],
  risk_factors TEXT[],
  
  -- Ranking
  recommended_rank INT,
  priority_level TEXT CHECK (priority_level IN ('high', 'medium', 'low')) DEFAULT 'medium',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(student_id, scholarship_id)
);

-- Student Testimonials (for credibility & trust)
CREATE TABLE student_testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL,
  
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback TEXT,
  experience_type TEXT CHECK (experience_type IN ('scholarship', 'institution', 'program')),
  verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_scholarships_status ON scholarships(status);
CREATE INDEX idx_scholarships_deadline ON scholarships(application_deadline);
CREATE INDEX idx_scholarships_provider ON scholarships(provider_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_applications_student ON scholarship_applications(student_id);
CREATE INDEX idx_applications_scholarship ON scholarship_applications(scholarship_id);
CREATE INDEX idx_applications_status ON scholarship_applications(status);
CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_read ON alerts(is_read);
CREATE INDEX idx_recommendations_student ON scholarship_recommendations(student_id);
CREATE INDEX idx_institutions_country ON institutions(country);
CREATE INDEX idx_testimonials_institution ON student_testimonials(institution_id);

-- Create View for Student Dashboard
CREATE OR REPLACE VIEW student_dashboard_view AS
SELECT 
  u.id as student_id,
  u.full_name,
  COUNT(DISTINCT sa.id) as total_applications,
  COUNT(DISTINCT CASE WHEN sa.status = 'accepted' THEN sa.id END) as accepted_count,
  COUNT(DISTINCT CASE WHEN sa.status = 'submitted' THEN sa.id END) as submitted_count,
  COUNT(DISTINCT al.id) as unread_alerts
FROM users u
LEFT JOIN scholarship_applications sa ON u.id = sa.student_id
LEFT JOIN alerts al ON u.id = al.user_id AND al.is_read = FALSE
WHERE u.role = 'student'
GROUP BY u.id, u.full_name;
