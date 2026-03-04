// Core Types for EduFair

export type UserRole = 'student' | 'institution' | 'admin';
export type SchoolType = 'government' | 'private' | 'international';
export type EducationLevel = '10th' | '12th' | 'diploma' | 'ug' | 'pg';
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
export type ScholarshipStatus = 'active' | 'inactive' | 'expired';
export type AlertType = 'deadline' | 'new_scholarship' | 'document_reminder' | 'eligibility_change' | 'status_update';
export type RiskLevel = 'low' | 'medium' | 'high';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type InstitutionType = 'government' | 'private' | 'international';
export type AccreditationStatus = 'verified' | 'pending' | 'rejected';
export type AmountType = 'full_tuition' | 'partial' | 'fixed';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  
  // Student fields
  country?: string;
  region_state?: string;
  school_type?: SchoolType;
  academic_grade?: number;
  test_scores?: Record<string, number>;
  family_income?: number;
  preferred_field_of_study?: string;
  career_goals?: string;
  education_level?: EducationLevel;
  
  // Institution fields
  institution_name?: string;
  institution_type?: InstitutionType;
  institution_verified?: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider_id?: string;
  provider_name: string;
  description?: string;
  
  // Eligibility
  min_academic_grade?: number;
  max_academic_grade?: number;
  required_test_scores?: Record<string, number>;
  eligible_countries?: string[];
  eligible_regions?: string[];
  eligible_categories?: string[];
  min_family_income?: number;
  max_family_income?: number;
  eligible_education_levels?: EducationLevel[];
  eligible_fields_of_study?: string[];
  
  // Financial
  scholarship_amount: number;
  amount_type: AmountType;
  currency: string;
  covers_living_expenses: boolean;
  
  // Process
  application_deadline: string;
  award_date?: string;
  credibility_score: number;
  historical_acceptance_rate?: number;
  risk_level: RiskLevel;
  total_awards_available?: number;
  previous_year_awardees?: number;
  
  status: ScholarshipStatus;
  institution_id?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Institution {
  id: string;
  name: string;
  country: string;
  region_state?: string;
  location_city?: string;
  institution_type: InstitutionType;
  
  // Financial
  average_tuition_annual?: number;
  average_living_costs_annual?: number;
  currency: string;
  
  // Programs
  available_programs?: string[];
  available_fields_of_study?: string[];
  
  // Credibility
  credibility_score: number;
  verified: boolean;
  employment_outcome_rate?: number;
  avg_graduate_salary?: number;
  
  // Risk
  accreditation_status: AccreditationStatus;
  scam_risk_level: RiskLevel;
  student_testimonials_count: number;
  
  contact_email?: string;
  website_url?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  institution_id: string;
  name: string;
  description?: string;
  field_of_study: string;
  duration_years: number;
  education_level: EducationLevel;
  
  tuition_annual?: number;
  currency: string;
  
  avg_starting_salary?: number;
  employment_rate?: number;
  
  created_at: string;
  updated_at: string;
}

export interface ScholarshipApplication {
  id: string;
  student_id: string;
  scholarship_id: string;
  
  status: ApplicationStatus;
  success_probability: number;
  
  applied_at?: string;
  submitted_at?: string;
  decision_date?: string;
  decision?: string;
  
  required_documents?: Record<string, boolean>;
  submitted_documents?: Record<string, string>;
  documents_complete: boolean;
  
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ScholarshipRecommendation {
  id: string;
  student_id: string;
  scholarship_id: string;
  
  eligibility_match_score: number;
  credibility_score: number;
  reward_vs_competition_score: number;
  overall_suitability_score: number;
  
  matching_reasons: string[];
  risk_factors: string[];
  
  recommended_rank: number;
  priority_level: PriorityLevel;
  
  created_at: string;
  updated_at: string;
}

export interface FeeRecommendationPlan {
  id: string;
  student_id: string;
  institution_id: string;
  course_id: string;
  
  total_tuition_cost: number;
  estimated_living_expenses: number;
  other_expenses: number;
  total_cost: number;
  currency: string;
  
  scholarship_funding: number;
  grant_funding: number;
  loan_recommended: number;
  self_funded_amount: number;
  
  financial_feasibility_score: number;
  affordability_analysis?: string;
  future_earning_potential?: number;
  roi_score?: number;
  risk_assessment?: string;
  
  status: 'active' | 'archived';
  
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  alert_type: AlertType;
  
  title: string;
  message?: string;
  scholarship_id?: string;
  application_id?: string;
  
  related_data?: Record<string, any>;
  is_read: boolean;
  scheduled_for?: string;
  sent_at?: string;
  
  created_at: string;
}

export interface StudentTestimonial {
  id: string;
  student_id: string;
  institution_id?: string;
  scholarship_id?: string;
  
  rating: number; // 1-5
  feedback?: string;
  experience_type: 'scholarship' | 'institution' | 'program';
  verified: boolean;
  
  created_at: string;
  updated_at: string;
}
