// Demo Data Store - In-memory database for demo mode
// This allows the app to work without Supabase

import bcrypt from 'bcryptjs'

export interface DemoUser {
  id: string
  email: string
  passwordHash: string
  fullName: string
  role: 'student' | 'institution' | 'admin'
  createdAt: string
}

// In-memory storage
let demoUsers: DemoUser[] = []

// Initialize with demo accounts
export async function initializeDemoData() {
  if (demoUsers.length > 0) return // Already initialized

  const demoPassword = await bcrypt.hash('demo123', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  demoUsers = [
    {
      id: '1',
      email: 'demo@edufair.com',
      passwordHash: demoPassword,
      fullName: 'Demo Student',
      role: 'student',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'admin@edufair.com',
      passwordHash: adminPassword,
      fullName: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ]
}

// Get all users
export function getAllUsers(): DemoUser[] {
  return demoUsers
}

// Find user by email
export function findUserByEmail(email: string): DemoUser | undefined {
  return demoUsers.find((u) => u.email === email)
}

// Find user by id
export function findUserById(id: string): DemoUser | undefined {
  return demoUsers.find((u) => u.id === id)
}

// Create new user
export function createUser(
  email: string,
  passwordHash: string,
  fullName: string,
  role: 'student' | 'institution' | 'admin'
): DemoUser {
  const newUser: DemoUser = {
    id: `user_${Date.now()}`,
    email,
    passwordHash,
    fullName,
    role,
    createdAt: new Date().toISOString(),
  }

  demoUsers.push(newUser)
  return newUser
}

// Demo scholarships
export const demoScholarships = [
  {
    id: 'sch_1',
    name: 'Harvard Full Tuition Scholarship',
    provider_name: 'Harvard University',
    description: 'Full tuition scholarship for high-achieving students',
    scholarship_amount: 60000,
    amount_type: 'full_tuition',
    currency: 'USD',
    eligible_countries: ['USA', 'Canada', 'India', 'UK'],
    eligible_education_levels: ['12th', 'ug', 'pg'],
    eligible_fields_of_study: ['STEM', 'Business', 'Humanities'],
    min_academic_grade: 3.8,
    credibility_score: 0.99,
    risk_level: 'low',
    historical_acceptance_rate: 0.15,
    status: 'active',
  },
  {
    id: 'sch_2',
    name: 'Stanford Engineering Excellence Award',
    provider_name: 'Stanford University',
    description: 'Merit-based scholarship for engineering students',
    scholarship_amount: 50000,
    amount_type: 'partial',
    currency: 'USD',
    eligible_countries: ['USA', 'Canada', 'India'],
    eligible_education_levels: ['ug', 'pg'],
    eligible_fields_of_study: ['Engineering', 'STEM'],
    min_academic_grade: 3.7,
    credibility_score: 0.98,
    risk_level: 'low',
    historical_acceptance_rate: 0.12,
    status: 'active',
  },
  {
    id: 'sch_3',
    name: 'MIT D-Lab Scholarship',
    provider_name: 'MIT',
    description: 'Full scholarship for development impact students',
    scholarship_amount: 61000,
    amount_type: 'full_tuition',
    currency: 'USD',
    eligible_countries: ['USA', 'India', 'Kenya', 'Bangladesh'],
    eligible_education_levels: ['ug', 'pg'],
    eligible_fields_of_study: ['STEM', 'Engineering'],
    min_academic_grade: 3.8,
    credibility_score: 0.99,
    risk_level: 'low',
    historical_acceptance_rate: 0.1,
    status: 'active',
  },
  {
    id: 'sch_4',
    name: 'IIT Delhi Merit Scholarship',
    provider_name: 'Indian Institute of Technology Delhi',
    description: 'Merit-based scholarship for top JEE performers',
    scholarship_amount: 4000,
    amount_type: 'partial',
    currency: 'USD',
    eligible_countries: ['India'],
    eligible_education_levels: ['12th', 'ug'],
    eligible_fields_of_study: ['Engineering', 'STEM'],
    min_academic_grade: 95,
    credibility_score: 0.96,
    risk_level: 'low',
    historical_acceptance_rate: 0.08,
    status: 'active',
  },
  {
    id: 'sch_5',
    name: 'University of Toronto Global Leaders',
    provider_name: 'University of Toronto',
    description: 'International scholarship for leadership potential',
    scholarship_amount: 20000,
    amount_type: 'partial',
    currency: 'CAD',
    eligible_countries: ['USA', 'India', 'China', 'Brazil'],
    eligible_education_levels: ['ug', 'pg'],
    eligible_fields_of_study: ['Business', 'STEM', 'Humanities'],
    min_academic_grade: 3.6,
    credibility_score: 0.94,
    risk_level: 'low',
    historical_acceptance_rate: 0.18,
    status: 'active',
  },
]

// Demo institutions
export const demoInstitutions = [
  {
    id: 'inst_1',
    name: 'Harvard University',
    country: 'USA',
    region_state: 'Massachusetts',
    location_city: 'Cambridge',
    institution_type: 'private',
    average_tuition_annual: 60000,
    average_living_costs_annual: 25000,
    credibility_score: 0.98,
    employment_outcome_rate: 0.98,
  },
  {
    id: 'inst_2',
    name: 'Stanford University',
    country: 'USA',
    region_state: 'California',
    location_city: 'Palo Alto',
    institution_type: 'private',
    average_tuition_annual: 62000,
    average_living_costs_annual: 26000,
    credibility_score: 0.97,
    employment_outcome_rate: 0.97,
  },
  {
    id: 'inst_3',
    name: 'MIT',
    country: 'USA',
    region_state: 'Massachusetts',
    location_city: 'Cambridge',
    institution_type: 'private',
    average_tuition_annual: 61000,
    average_living_costs_annual: 24000,
    credibility_score: 0.99,
    employment_outcome_rate: 0.99,
  },
  {
    id: 'inst_4',
    name: 'IIT Delhi',
    country: 'India',
    region_state: 'Delhi',
    location_city: 'New Delhi',
    institution_type: 'government',
    average_tuition_annual: 8000,
    average_living_costs_annual: 6000,
    credibility_score: 0.95,
    employment_outcome_rate: 0.92,
  },
  {
    id: 'inst_5',
    name: 'University of Toronto',
    country: 'Canada',
    region_state: 'Ontario',
    location_city: 'Toronto',
    institution_type: 'government',
    average_tuition_annual: 25000,
    average_living_costs_annual: 18000,
    credibility_score: 0.94,
    employment_outcome_rate: 0.91,
  },
]
