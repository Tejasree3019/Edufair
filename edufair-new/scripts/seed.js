import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Seed Institutions
    const institutions = [
      {
        name: 'Harvard University',
        country: 'USA',
        region_state: 'Massachusetts',
        location_city: 'Cambridge',
        institution_type: 'private',
        average_tuition_annual: 60000,
        average_living_costs_annual: 25000,
        currency: 'USD',
        available_programs: ['Engineering', 'Business', 'Medicine', 'Law', 'Arts'],
        available_fields_of_study: ['STEM', 'Business', 'Medical', 'Law', 'Humanities'],
        credibility_score: 0.98,
        verified: true,
        employment_outcome_rate: 0.98,
        avg_graduate_salary: 120000,
        accreditation_status: 'verified',
        scam_risk_level: 'low',
        student_testimonials_count: 5000,
        contact_email: 'admissions@harvard.edu',
        website_url: 'https://www.harvard.edu',
      },
      {
        name: 'Stanford University',
        country: 'USA',
        region_state: 'California',
        location_city: 'Palo Alto',
        institution_type: 'private',
        average_tuition_annual: 62000,
        average_living_costs_annual: 26000,
        currency: 'USD',
        available_programs: ['Engineering', 'Business', 'Computer Science', 'Medicine'],
        available_fields_of_study: ['STEM', 'Business', 'Technology'],
        credibility_score: 0.97,
        verified: true,
        employment_outcome_rate: 0.97,
        avg_graduate_salary: 130000,
        accreditation_status: 'verified',
        scam_risk_level: 'low',
        student_testimonials_count: 4800,
        contact_email: 'admissions@stanford.edu',
        website_url: 'https://www.stanford.edu',
      },
      {
        name: 'MIT - Massachusetts Institute of Technology',
        country: 'USA',
        region_state: 'Massachusetts',
        location_city: 'Cambridge',
        institution_type: 'private',
        average_tuition_annual: 61000,
        average_living_costs_annual: 24000,
        currency: 'USD',
        available_programs: ['Engineering', 'Science', 'Technology', 'Management'],
        available_fields_of_study: ['STEM', 'Engineering', 'Technology'],
        credibility_score: 0.99,
        verified: true,
        employment_outcome_rate: 0.99,
        avg_graduate_salary: 125000,
        accreditation_status: 'verified',
        scam_risk_level: 'low',
        student_testimonials_count: 5200,
        contact_email: 'admissions@mit.edu',
        website_url: 'https://www.mit.edu',
      },
      {
        name: 'Indian Institute of Technology Delhi',
        country: 'India',
        region_state: 'Delhi',
        location_city: 'New Delhi',
        institution_type: 'government',
        average_tuition_annual: 8000,
        average_living_costs_annual: 6000,
        currency: 'USD',
        available_programs: ['Engineering', 'Science', 'Management'],
        available_fields_of_study: ['STEM', 'Engineering', 'Business'],
        credibility_score: 0.95,
        verified: true,
        employment_outcome_rate: 0.92,
        avg_graduate_salary: 45000,
        accreditation_status: 'verified',
        scam_risk_level: 'low',
        student_testimonials_count: 3200,
        contact_email: 'admissions@iitd.ac.in',
        website_url: 'https://www.iitd.ac.in',
      },
      {
        name: 'University of Toronto',
        country: 'Canada',
        region_state: 'Ontario',
        location_city: 'Toronto',
        institution_type: 'government',
        average_tuition_annual: 25000,
        average_living_costs_annual: 18000,
        currency: 'CAD',
        available_programs: ['Engineering', 'Business', 'Medicine', 'Arts'],
        available_fields_of_study: ['STEM', 'Business', 'Medical', 'Humanities'],
        credibility_score: 0.94,
        verified: true,
        employment_outcome_rate: 0.91,
        avg_graduate_salary: 65000,
        accreditation_status: 'verified',
        scam_risk_level: 'low',
        student_testimonials_count: 2800,
        contact_email: 'admissions@toronto.ca',
        website_url: 'https://www.utoronto.ca',
      },
    ]

    console.log('📚 Seeding institutions...')
    const { data: seedInstitutions, error: instError } = await supabase
      .from('institutions')
      .insert(institutions)
      .select()

    if (instError) {
      console.error('Error seeding institutions:', instError)
      return
    }

    console.log(`✅ Seeded ${seedInstitutions?.length || 0} institutions`)

    // Seed Courses
    const institutionIds = seedInstitutions?.map((i) => i.id) || []

    const courses = [
      {
        institution_id: institutionIds[0],
        name: 'Computer Science (BS)',
        description: 'Bachelor of Science in Computer Science',
        field_of_study: 'Computer Science',
        duration_years: 4,
        education_level: 'ug',
        tuition_annual: 60000,
        currency: 'USD',
        avg_starting_salary: 95000,
        employment_rate: 0.98,
      },
      {
        institution_id: institutionIds[0],
        name: 'Business Administration (MBA)',
        description: 'Master of Business Administration',
        field_of_study: 'Business',
        duration_years: 2,
        education_level: 'pg',
        tuition_annual: 75000,
        currency: 'USD',
        avg_starting_salary: 125000,
        employment_rate: 0.96,
      },
      {
        institution_id: institutionIds[2],
        name: 'Electrical Engineering (BS)',
        description: 'Bachelor of Science in Electrical Engineering',
        field_of_study: 'Electrical Engineering',
        duration_years: 4,
        education_level: 'ug',
        tuition_annual: 61000,
        currency: 'USD',
        avg_starting_salary: 85000,
        employment_rate: 0.95,
      },
      {
        institution_id: institutionIds[3],
        name: 'Computer Science (B.Tech)',
        description: 'Bachelor of Technology in Computer Science',
        field_of_study: 'Computer Science',
        duration_years: 4,
        education_level: 'ug',
        tuition_annual: 8000,
        currency: 'USD',
        avg_starting_salary: 50000,
        employment_rate: 0.88,
      },
      {
        institution_id: institutionIds[4],
        name: 'Engineering (BASc)',
        description: 'Bachelor of Applied Science in Engineering',
        field_of_study: 'Engineering',
        duration_years: 4,
        education_level: 'ug',
        tuition_annual: 25000,
        currency: 'CAD',
        avg_starting_salary: 60000,
        employment_rate: 0.90,
      },
    ]

    console.log('📖 Seeding courses...')
    const { data: seedCourses, error: courseError } = await supabase
      .from('courses')
      .insert(courses)
      .select()

    if (courseError) {
      console.error('Error seeding courses:', courseError)
      return
    }

    console.log(`✅ Seeded ${seedCourses?.length || 0} courses`)

    // Seed Scholarships
    const scholarships = [
      {
        name: 'Harvard Full Tuition Scholarship',
        provider_name: 'Harvard University',
        description: 'Full tuition scholarship for high-achieving students from low-income backgrounds',
        min_academic_grade: 3.8,
        max_academic_grade: 4.0,
        eligible_countries: ['USA', 'Canada', 'India', 'UK'],
        eligible_regions: ['Massachusetts', 'California', 'Delhi', 'Ontario'],
        eligible_categories: ['General', 'SC', 'ST', 'OBC'],
        min_family_income: 0,
        max_family_income: 40000,
        eligible_education_levels: ['12th', 'ug'],
        eligible_fields_of_study: ['STEM', 'Business', 'Humanities'],
        scholarship_amount: 60000,
        amount_type: 'full_tuition',
        currency: 'USD',
        covers_living_expenses: true,
        application_deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        award_date: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
        credibility_score: 0.99,
        historical_acceptance_rate: 0.15,
        risk_level: 'low',
        total_awards_available: 500,
        previous_year_awardees: 480,
        status: 'active',
        institution_id: institutionIds[0],
      },
      {
        name: 'Stanford Engineering Excellence Award',
        provider_name: 'Stanford University',
        description: 'Merit-based scholarship for outstanding engineering students',
        min_academic_grade: 3.7,
        max_academic_grade: 4.0,
        eligible_countries: ['USA', 'Canada', 'India', 'Australia'],
        eligible_education_levels: ['ug', 'pg'],
        eligible_fields_of_study: ['Engineering', 'STEM'],
        scholarship_amount: 50000,
        amount_type: 'partial',
        currency: 'USD',
        covers_living_expenses: false,
        application_deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        credibility_score: 0.98,
        historical_acceptance_rate: 0.12,
        risk_level: 'low',
        total_awards_available: 300,
        previous_year_awardees: 295,
        status: 'active',
        institution_id: institutionIds[1],
      },
      {
        name: 'IIT Delhi Merit Scholarship',
        provider_name: 'Indian Institute of Technology Delhi',
        description: 'Merit-based scholarship for top JEE performers',
        min_academic_grade: 95,
        max_academic_grade: 100,
        eligible_countries: ['India'],
        eligible_regions: ['Delhi', 'Uttar Pradesh', 'Haryana', 'Punjab'],
        eligible_education_levels: ['12th', 'ug'],
        eligible_fields_of_study: ['Engineering', 'STEM'],
        scholarship_amount: 4000,
        amount_type: 'partial',
        currency: 'USD',
        covers_living_expenses: false,
        application_deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        credibility_score: 0.96,
        historical_acceptance_rate: 0.08,
        risk_level: 'low',
        total_awards_available: 1000,
        previous_year_awardees: 950,
        status: 'active',
        institution_id: institutionIds[3],
      },
      {
        name: 'University of Toronto Global Leaders Scholarship',
        provider_name: 'University of Toronto',
        description: 'Scholarship for international students with strong leadership potential',
        min_academic_grade: 3.6,
        max_academic_grade: 4.0,
        eligible_countries: ['USA', 'India', 'China', 'Brazil', 'Mexico'],
        eligible_education_levels: ['ug', 'pg'],
        eligible_fields_of_study: ['Business', 'STEM', 'Humanities'],
        min_family_income: 30000,
        max_family_income: 100000,
        scholarship_amount: 20000,
        amount_type: 'partial',
        currency: 'CAD',
        covers_living_expenses: false,
        application_deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
        credibility_score: 0.94,
        historical_acceptance_rate: 0.18,
        risk_level: 'low',
        total_awards_available: 200,
        previous_year_awardees: 185,
        status: 'active',
        institution_id: institutionIds[4],
      },
      {
        name: 'MIT D-Lab Scholarship',
        provider_name: 'MIT',
        description: 'Full scholarship for students interested in development and social impact',
        min_academic_grade: 3.8,
        eligible_countries: ['USA', 'India', 'Kenya', 'Bangladesh'],
        eligible_regions: [],
        eligible_education_levels: ['ug', 'pg'],
        eligible_fields_of_study: ['STEM', 'Engineering'],
        min_family_income: 0,
        max_family_income: 50000,
        scholarship_amount: 61000,
        amount_type: 'full_tuition',
        currency: 'USD',
        covers_living_expenses: true,
        application_deadline: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(),
        credibility_score: 0.99,
        historical_acceptance_rate: 0.10,
        risk_level: 'low',
        total_awards_available: 150,
        previous_year_awardees: 148,
        status: 'active',
        institution_id: institutionIds[2],
      },
    ]

    console.log('🎓 Seeding scholarships...')
    const { data: seedScholarships, error: scholarshipError } = await supabase
      .from('scholarships')
      .insert(scholarships)
      .select()

    if (scholarshipError) {
      console.error('Error seeding scholarships:', scholarshipError)
      return
    }

    console.log(`✅ Seeded ${seedScholarships?.length || 0} scholarships`)

    console.log('✨ Database seeding completed successfully!')
  } catch (error) {
    console.error('Fatal error during seeding:', error)
    process.exit(1)
  }
}

seedDatabase()
