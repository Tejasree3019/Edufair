import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(5),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain uppercase letter').regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number').optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Profile schemas
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number').optional(),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required').optional(),
  city: z.string().min(2, 'City is required').optional(),
  dateOfBirth: z.string().refine(date => {
    const birthDate = new Date(date)
    const age = new Date().getFullYear() - birthDate.getFullYear()
    return age >= 16 && age <= 70
  }, 'You must be between 16 and 70 years old'),
  qualifications: z.string().min(2, 'Qualification is required'),
  percentageObtained: z.number().min(0).max(100, 'Percentage must be between 0-100'),
  targetCourse: z.string().min(2, 'Target course is required'),
  targetCountry: z.string().min(2, 'Target country is required'),
  englishTestScore: z.number().min(0).optional(),
})

// Application schemas
export const applicationSchema = z.object({
  scholarshipId: z.string().uuid('Invalid scholarship ID'),
  collegeName: z.string().min(2, 'College name is required'),
  courseApplied: z.string().min(2, 'Course name is required'),
  statement: z.string().min(100, 'Statement must be at least 100 characters').max(1000, 'Statement cannot exceed 1000 characters'),
  documents: z.array(z.instanceof(File)).min(1, 'At least one document is required'),
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
})

// Scholarship filters
export const scholarshipFilterSchema = z.object({
  country: z.string().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  level: z.enum(['Undergraduate', 'Postgraduate', 'Diploma']).optional(),
  deadline: z.string().optional(),
  searchQuery: z.string().min(2, 'Search query must be at least 2 characters').optional(),
})

// Fee recommendation
export const feeRecommendationSchema = z.object({
  courseType: z.enum(['Undergraduate', 'Postgraduate', 'Diploma']),
  country: z.string().min(2, 'Country is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  duration: z.number().min(1).max(6, 'Duration must be 1-6 years'),
})

// Admin schemas
export const createCollegeSchema = z.object({
  name: z.string().min(2, 'College name is required'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  website: z.string().url('Invalid website URL').optional(),
  description: z.string().min(10, 'Description is required'),
  tuitionFee: z.number().min(0, 'Tuition fee must be positive'),
  ranking: z.number().min(0).optional(),
})

export const createScholarshipSchema = z.object({
  name: z.string().min(3, 'Scholarship name is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().length(3, 'Invalid currency code'),
  collegeId: z.string().uuid('Invalid college ID'),
  deadline: z.string().refine(date => new Date(date) > new Date(), 'Deadline must be in the future'),
  eligibility: z.string().min(20, 'Eligibility criteria is required'),
  applicationUrl: z.string().url('Invalid URL').optional(),
})

// Email notification schema
export const notificationPreferenceSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  deadlineReminders: z.boolean(),
  newScholarships: z.boolean(),
  applicationStatus: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
})

// Contact form
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
export type ScholarshipFilterInput = z.infer<typeof scholarshipFilterSchema>
export type FeeRecommendationInput = z.infer<typeof feeRecommendationSchema>
export type CreateCollegeInput = z.infer<typeof createCollegeSchema>
export type CreateScholarshipInput = z.infer<typeof createScholarshipSchema>
export type NotificationPreferenceInput = z.infer<typeof notificationPreferenceSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
