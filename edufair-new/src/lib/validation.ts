/**
 * Form Validation Utilities
 * Production-grade validation for all forms
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Email validation (RFC 5322 simplified)
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Password validation
export const isValidPassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Name validation
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100 && /^[a-zA-Z\s'-]+$/.test(name)
}

// Phone validation (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s|-/g, ''))
}

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Login form validation
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: ValidationError[] = []

  if (!email || !email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  if (!password || !password.trim()) {
    errors.push({ field: 'password', message: 'Password is required' })
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password is incorrect' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Registration form validation
export const validateRegistrationForm = (data: {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phone?: string
}): ValidationResult => {
  const errors: ValidationError[] = []

  if (!data.email || !data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  if (!data.fullName || !data.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' })
  } else if (!isValidName(data.fullName)) {
    errors.push({ field: 'fullName', message: 'Please enter a valid name' })
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' })
  } else {
    const passwordValidation = isValidPassword(data.password)
    if (!passwordValidation.isValid && passwordValidation.errors.length > 0) {
      errors.push({
        field: 'password',
        message: passwordValidation.errors[0] || 'Password does not meet requirements',
      })
    } else if (!passwordValidation.isValid) {
      errors.push({
        field: 'password',
        message: 'Password does not meet requirements',
      })
    }
  }

  if (!data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Please confirm your password' })
  } else if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' })
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Profile form validation
export const validateProfileForm = (data: {
  fullName: string
  email: string
  phone?: string
  bio?: string
  university?: string
  field?: string
}): ValidationResult => {
  const errors: ValidationError[] = []

  if (!data.fullName || !data.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' })
  } else if (!isValidName(data.fullName)) {
    errors.push({ field: 'fullName', message: 'Please enter a valid name' })
  }

  if (!data.email || !data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' })
  }

  if (data.bio && data.bio.length > 500) {
    errors.push({ field: 'bio', message: 'Bio must be less than 500 characters' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Get error message for a field
export const getErrorMessage = (field: string, errors: ValidationError[]): string | null => {
  const error = errors.find(e => e.field === field)
  return error?.message || null
}
