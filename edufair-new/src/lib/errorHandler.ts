import { NextResponse, NextRequest } from 'next/server'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export interface ErrorResponse {
  success: false
  error: {
    message: string
    code?: string
    statusCode: number
    timestamp: string
    path?: string
    details?: any
  }
}

export function handleError(error: unknown, request?: NextRequest): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString()
  const path = request?.nextUrl.pathname

  console.error('API Error:', {
    timestamp,
    path,
    error: error instanceof Error ? error.message : error,
  })

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          statusCode: 400,
          timestamp,
          path,
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        },
      },
      { status: 400 }
    )
  }

  // Custom app errors
  if (error instanceof AppError) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          timestamp,
          path,
          details: error.details,
        },
      },
      { status: error.statusCode }
    )
  }

  // Database errors
  if (error instanceof Error && error.message.includes('database')) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: {
          message: 'Database operation failed',
          code: 'DATABASE_ERROR',
          statusCode: 500,
          timestamp,
          path,
        },
      },
      { status: 500 }
    )
  }

  // JWT errors
  if (error instanceof Error && (error.message.includes('jwt') || error.message.includes('token'))) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: {
          message: 'Authentication failed',
          code: 'AUTH_ERROR',
          statusCode: 401,
          timestamp,
          path,
        },
      },
      { status: 401 }
    )
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: {
          message: error.message || 'Internal server error',
          code: 'INTERNAL_ERROR',
          statusCode: 500,
          timestamp,
          path,
        },
      },
      { status: 500 }
    )
  }

  // Unknown errors
  return NextResponse.json<ErrorResponse>(
    {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        statusCode: 500,
        timestamp,
        path,
      },
    },
    { status: 500 }
  )
}

export function createErrorResponse(
  statusCode: number,
  message: string,
  code?: string,
  details?: any
): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(
    {
      success: false,
      error: {
        message,
        code,
        statusCode,
        timestamp: new Date().toISOString(),
        details,
      },
    },
    { status: statusCode }
  )
}
