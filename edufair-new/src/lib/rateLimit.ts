/**
 * Rate Limiting Utility
 * Prevents abuse and DOS attacks
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

/**
 * Check if a request should be rate limited
 * @param key - Unique identifier (e.g., IP address, user email)
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request should be allowed, false if limited
 */
export function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000 // 1 minute default
): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    // New window or first request
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return false
  }

  // Increment counter
  entry.count++
  return true
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key)
}

/**
 * Get current rate limit status
 */
export function getRateLimitStatus(key: string, limit: number = 100): {
  remaining: number
  resetTime: number
  isLimited: boolean
} {
  const entry = rateLimitMap.get(key)
  const now = Date.now()

  if (!entry || now > entry.resetTime) {
    return {
      remaining: limit,
      resetTime: now + 60000,
      isLimited: false,
    }
  }

  return {
    remaining: Math.max(0, limit - entry.count),
    resetTime: entry.resetTime,
    isLimited: entry.count >= limit,
  }
}

/**
 * Cleanup old entries from rate limit map
 * Call this periodically (e.g., every 5 minutes)
 */
export function cleanupRateLimimits(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

// Auto-cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimimits, 5 * 60 * 1000)
}

/**
 * Rate limit presets
 */
export const rateLimitPresets = {
  // API endpoints
  general: { limit: 100, windowMs: 60000 }, // 100 requests per minute
  
  // Auth endpoints - strict
  auth: { limit: 5, windowMs: 60000 }, // 5 requests per minute
  login: { limit: 5, windowMs: 60000 }, // 5 login attempts per minute
  register: { limit: 3, windowMs: 60000 }, // 3 registration attempts per minute
  forgotPassword: { limit: 3, windowMs: 3600000 }, // 3 reset requests per hour
  
  // File uploads
  upload: { limit: 10, windowMs: 60000 }, // 10 uploads per minute
  
  // Webhook endpoints
  webhook: { limit: 1000, windowMs: 60000 }, // 1000 webhook events per minute
}
