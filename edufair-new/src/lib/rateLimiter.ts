/**
 * Rate Limiting Middleware
 * Prevents abuse and DDoS attacks
 * Uses in-memory store for simplicity (consider Redis for production at scale)
 */

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const rateLimitStore: RateLimitStore = {}

/**
 * Rate limit configuration for different endpoints
 */
const rateLimitConfig = {
  // Auth endpoints - strict limits
  '/api/auth/login': { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  '/api/auth/register': { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  '/api/auth/forgot-password': { windowMs: 60 * 60 * 1000, maxRequests: 3 },

  // General APIsendpoint - moderate limits
  '/api/scholarships': { windowMs: 60 * 1000, maxRequests: 30 },
  '/api/applications': { windowMs: 60 * 1000, maxRequests: 10 },
  '/api/recommendations': { windowMs: 60 * 1000, maxRequests: 10 },

  // Admin endpoints - strict limits
  '/api/admin': { windowMs: 60 * 1000, maxRequests: 20 },

  // Default limit for unknown endpoints
  DEFAULT: { windowMs: 60 * 1000, maxRequests: 60 },
}

/**
 * Check if request exceeds rate limit
 * @param ipAddress - User's IP address
 * @param endpoint - API endpoint path
 * @returns true if request is within limit, false if exceeded
 */
export function checkRateLimit(ipAddress: string, endpoint: string): boolean {
  // Get appropriate config for endpoint
  let config = rateLimitConfig.DEFAULT
  for (const [pattern, cfg] of Object.entries(rateLimitConfig)) {
    if (pattern !== 'DEFAULT' && endpoint.startsWith(pattern)) {
      config = cfg
      break
    }
  }

  const key = `${ipAddress}::${endpoint}`
  const now = Date.now()

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { count: 1, resetTime: now + config.windowMs }
    return true
  }

  const record = rateLimitStore[key]

  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + config.windowMs
    return true
  }

  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    return false
  }

  // Increment counter
  record.count++
  return true
}

/**
 * Get rate limit info for response headers
 */
export function getRateLimitInfo(ipAddress: string, endpoint: string) {
  const key = `${ipAddress}::${endpoint}`
  const record = rateLimitStore[key]

  if (!record) {
    return {
      limit: rateLimitConfig.DEFAULT.maxRequests,
      remaining: rateLimitConfig.DEFAULT.maxRequests - 1,
      reset: new Date(Date.now() + rateLimitConfig.DEFAULT.windowMs).toISOString(),
    }
  }

  let config = rateLimitConfig.DEFAULT
  for (const [pattern, cfg] of Object.entries(rateLimitConfig)) {
    if (pattern !== 'DEFAULT' && endpoint.startsWith(pattern)) {
      config = cfg
      break
    }
  }

  return {
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - record.count),
    reset: new Date(record.resetTime).toISOString(),
  }
}

/**
 * Clean up old records from store (run periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  for (const [key, record] of Object.entries(rateLimitStore)) {
    if (now > record.resetTime) {
      delete rateLimitStore[key]
    }
  }
}

// Run cleanup every 10 minutes
if (typeof global !== 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000)
}
