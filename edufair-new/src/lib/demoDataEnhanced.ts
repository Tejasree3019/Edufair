// Enhanced Demo Data Loader - Uses Real Data from JSON Files
// Automatically loads universities, scholarships, programs from data/ directory

import bcrypt from 'bcryptjs'

export interface DemoUser {
  id: string
  email: string
  passwordHash: string
  fullName: string
  role: 'student' | 'institution' | 'admin'
  country?: string
  educationLevel?: string
  preferredField?: string
  academicGrade?: number
  createdAt: string
}

export interface Scholarship {
  id: string
  name: string
  provider: string
  description: string
  amount: number
  amountType: string
  currency: string
  coversLivingExpenses: boolean
  deadline: string
  minGPA: number
  eligibleCountries: string[]
  eligibleFields: string[]
  eligibleLevels: string[]
  credibilityScore: number
  acceptanceRate: number
  riskLevel: string
  awardCount: number
  previousAwardees: number
  needBased: boolean
  meritBased: boolean
}

export interface University {
  id: string
  name: string
  country: string
  region: string
  city: string
  type: string
  ranking: number
  tuitionAnnual: number
  livingCostsAnnual: number
  currency: string
  credibilityScore: number
  verified: boolean
  fields: string[]
  acceptanceRate: number
  scholarshipOffered: boolean
  needBased: boolean
  meritBased: boolean
  internationalStudents: boolean
}

export interface Program {
  id: string
  name: string
  field: string
  level: string
  duration: number
  universityId: string
  tuitionAnnual: number
  careerOutcomes: string[]
  avgSalary: number
  employmentRate: number
}

export interface Course {
  id: string
  name: string
  field: string
  level: string
  credits: number
  description: string
  difficulty: string
}

// In-memory storage
let demoUsers: DemoUser[] = []
let universities: University[] = []
let scholarships: Scholarship[] = []
let programs: Program[] = []
let courses: Course[] = []

let isInitialized = false

// Initialize with demo accounts and real data
export async function initializeDemoData() {
  if (isInitialized) return

  try {
    // Create demo accounts
    const demoPassword = await bcrypt.hash('demo123', 10)
    const adminPassword = await bcrypt.hash('admin123', 10)

    demoUsers = [
      {
        id: '1',
        email: 'demo@edufair.com',
        passwordHash: demoPassword,
        fullName: 'Demo Student',
        role: 'student',
        country: 'India',
        educationLevel: 'ug',
        preferredField: 'Computer Science',
        academicGrade: 3.8,
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

    // Load real data from API endpoints
    try {
      const uniResponse = await fetch('/api/universities')
      if (uniResponse.ok) {
        const uniData = await uniResponse.json()
        universities = uniData.universities || []
      }
    } catch (e) {
      // Fallback: Use hardcoded universities if API not accessible
      universities = getDefaultUniversities()
    }

    try {
      const schResponse = await fetch('/api/scholarships')
      if (schResponse.ok) {
        const schData = await schResponse.json()
        scholarships = schData.scholarships || []
      }
    } catch (e) {
      scholarships = getDefaultScholarships()
    }

    try {
      const progResponse = await fetch('/api/programs')
      if (progResponse.ok) {
        const progData = await progResponse.json()
        programs = progData.programs || []
        courses = progData.courses || []
      }
    } catch (e) {
      programs = getDefaultPrograms()
      courses = getDefaultCourses()
    }

    isInitialized = true
    console.log(`[DemoData] Initialized with ${universities.length} universities, ${scholarships.length} scholarships, ${programs.length} programs, ${courses.length} courses`)
  } catch (error) {
    console.error('[DemoData] Initialization error:', error)
    // Use defaults on error
    universities = getDefaultUniversities()
    scholarships = getDefaultScholarships()
    programs = getDefaultPrograms()
    courses = getDefaultCourses()
    isInitialized = true
  }
}

// Get all users
export function getAllUsers(): DemoUser[] {
  return demoUsers
}

// Get all universities
export function getAllUniversities(): University[] {
  return universities
}

// Get all scholarships
export function getAllScholarships(): Scholarship[] {
  return scholarships
}

// Get all programs
export function getAllPrograms(): Program[] {
  return programs
}

// Get all courses
export function getAllCourses(): Course[] {
  return courses
}

// Search scholarships with filters
export function searchScholarships(filters: {
  country?: string
  field?: string
  level?: string
  maxAmount?: number
  minCredibility?: number
}): Scholarship[] {
  return scholarships.filter((sch) => {
    if (filters.country && !sch.eligibleCountries.includes(filters.country) && !sch.eligibleCountries.includes('All')) {
      return false
    }
    if (filters.field && !sch.eligibleFields.includes(filters.field) && !sch.eligibleFields.includes('All')) {
      return false
    }
    if (filters.level && !sch.eligibleLevels.includes(filters.level)) {
      return false
    }
    if (filters.maxAmount && sch.amount > filters.maxAmount) {
      return false
    }
    if (filters.minCredibility && sch.credibilityScore < filters.minCredibility) {
      return false
    }
    return true
  })
}

// Search universities with filters
export function searchUniversities(filters: { country?: string; type?: string; field?: string }): University[] {
  return universities.filter((uni) => {
    if (filters.country && uni.country !== filters.country) {
      return false
    }
    if (filters.type && uni.type !== filters.type) {
      return false
    }
    if (filters.field && !uni.fields.includes(filters.field)) {
      return false
    }
    return true
  })
}

// Find user by email
export function findUserByEmail(email: string): DemoUser | undefined {
  return demoUsers.find((u) => u.email === email)
}

// Find user by ID
export function findUserById(id: string): DemoUser | undefined {
  return demoUsers.find((u) => u.id === id)
}

// Create new user
export async function createUser(userData: Omit<DemoUser, 'id' | 'createdAt' | 'passwordHash'> & { password: string }): Promise<DemoUser> {
  if (findUserByEmail(userData.email)) {
    throw new Error('User with this email already exists')
  }

  const passwordHash = await bcrypt.hash(userData.password, 10)
  const newUser: DemoUser = {
    ...userData,
    id: String(demoUsers.length + 1),
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  demoUsers.push(newUser)
  return newUser
}

// Verify password
export async function verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// Get recommendation matches for a student
export function getRecommendedScholarships(userId: string, limit: number = 10): Scholarship[] {
  const user = findUserById(userId)
  if (!user || user.role !== 'student') {
    return []
  }

  const matches = scholarships
    .filter((sch) => {
      // Match by field
      if (!sch.eligibleFields.includes('All') && !sch.eligibleFields.includes(user.preferredField || '')) {
        return false
      }
      // Match by country
      if (!sch.eligibleCountries.includes('All') && !sch.eligibleCountries.includes('International') && !sch.eligibleCountries.includes(user.country || '')) {
        return false
      }
      // Match by education level
      if (!sch.eligibleLevels.includes(user.educationLevel || 'ug')) {
        return false
      }
      // Match by GPA
      if (user.academicGrade && user.academicGrade < sch.minGPA) {
        return false
      }
      return true
    })
    .sort((a, b) => b.credibilityScore - a.credibilityScore)
    .slice(0, limit)

  return matches
}

// DEFAULT DATA (Fallback if JSON files not accessible)

function getDefaultUniversities(): University[] {
  return [
    {
      id: 'uni_harvard',
      name: 'Harvard University',
      country: 'USA',
      region: 'Massachusetts',
      city: 'Cambridge',
      type: 'private',
      ranking: 1,
      tuitionAnnual: 60000,
      livingCostsAnnual: 20000,
      currency: 'USD',
      credibilityScore: 0.99,
      verified: true,
      fields: ['Business', 'Law', 'Medicine', 'Engineering', 'Arts & Sciences'],
      acceptanceRate: 0.03,
      scholarshipOffered: true,
      needBased: true,
      meritBased: true,
      internationalStudents: true,
    },
    {
      id: 'uni_iit_delhi',
      name: 'Indian Institute of Technology (IIT) Delhi',
      country: 'India',
      region: 'New Delhi',
      city: 'New Delhi',
      type: 'public',
      ranking: 15,
      tuitionAnnual: 1000,
      livingCostsAnnual: 5000,
      currency: 'INR',
      credibilityScore: 0.95,
      verified: true,
      fields: ['Engineering', 'Architecture', 'Design', 'Science'],
      acceptanceRate: 0.02,
      scholarshipOffered: true,
      needBased: true,
      meritBased: true,
      internationalStudents: true,
    },
  ]
}

function getDefaultScholarships(): Scholarship[] {
  return [
    {
      id: 'sch_harvard_full',
      name: 'Harvard College Scholarship',
      provider: 'Harvard University',
      description: 'Full tuition and living expenses for undergraduate students',
      amount: 80000,
      amountType: 'full_tuition',
      currency: 'USD',
      coversLivingExpenses: true,
      deadline: '2024-12-31',
      minGPA: 3.8,
      eligibleCountries: ['USA', 'International'],
      eligibleFields: ['All'],
      eligibleLevels: ['ug'],
      credibilityScore: 0.99,
      acceptanceRate: 0.05,
      riskLevel: 'low',
      awardCount: 2500,
      previousAwardees: 2500,
      needBased: true,
      meritBased: false,
    },
  ]
}

function getDefaultPrograms(): Program[] {
  return [
    {
      id: 'prog_cs_ug',
      name: 'Bachelor of Science in Computer Science',
      field: 'Computer Science',
      level: 'undergraduate',
      duration: 4,
      universityId: 'uni_stanford',
      tuitionAnnual: 62000,
      careerOutcomes: ['Software Engineer', 'Data Scientist', 'Product Manager'],
      avgSalary: 120000,
      employmentRate: 0.95,
    },
  ]
}

function getDefaultCourses(): Course[] {
  return [
    {
      id: 'course_data_structures',
      name: 'Data Structures and Algorithms',
      field: 'Computer Science',
      level: 'undergraduate',
      credits: 3,
      description: 'Fundamental data structures, algorithm design and analysis',
      difficulty: 'intermediate',
    },
  ]
}
