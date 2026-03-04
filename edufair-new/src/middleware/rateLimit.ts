import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export interface RateLimitOptions {
  limit: number
  windowMs: number
  message?: string
  headers?: boolean
}

const defaultOptions: RateLimitOptions = {
  limit: 100,
  windowMs: 60 * 1000, // 1 minute
  message: 'Too many requests, please try again later.',
  headers: true,
}

export function rateLimit(options: Partial<RateLimitOptions> = {}) {
  const config = { ...defaultOptions, ...options }

  return (handler: Function) => {
    return async (request: NextRequest, context: any) => {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      const key = `${ip}-${request.nextUrl.pathname}`
      const now = Date.now()

      // Initialize or cleanup expired entries
      if (!store[key] || store[key].resetTime < now) {
        store[key] = {
          count: 0,
          resetTime: now + config.windowMs,
        }
      }

      store[key].count++

      // Check if limit exceeded
      if (store[key].count > config.limit) {
        const retryAfter = Math.ceil((store[key].resetTime - now) / 1000)

        return NextResponse.json(
          {
            error: config.message,
            retryAfter,
          },
          {
            status: 429,
            headers: config.headers
              ? {
                  'Retry-After': retryAfter.toString(),
                  'X-RateLimit-Limit': config.limit.toString(),
                  'X-RateLimit-Remaining': '0',
                  'X-RateLimit-Reset': store[key].resetTime.toString(),
                }
              : {},
          }
        )
      }

      const remaining = config.limit - store[key].count

      // Add rate limit headers to response
      const response = await handler(request, context)

      if (config.headers && response instanceof NextResponse) {
        response.headers.set('X-RateLimit-Limit', config.limit.toString())
        response.headers.set('X-RateLimit-Remaining', remaining.toString())
        response.headers.set('X-RateLimit-Reset', store[key].resetTime.toString())
      }

      return response
    }
  }
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key] && store[key].resetTime < now) {
      delete store[key]
    }
  }
}, 5 * 60 * 1000)

// Per-endpoint rate limits
export const rateLimits = {
  auth: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 mins
  api: { limit: 100, windowMs: 60 * 1000 }, // 100 per minute
  heavy: { limit: 20, windowMs: 60 * 1000 }, // 20 per minute for heavy operations
}
