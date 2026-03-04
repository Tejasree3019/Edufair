import { NextResponse } from 'next/server'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
  meta?: {
    timestamp: string
    version: string
    path?: string
  }
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
  meta: {
    timestamp: string
    version: string
  }
}

export class ApiResponseBuilder {
  private data: any
  private error: any
  private statusCode: number = 200
  private meta: any = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }

  static success<T>(data: T, statusCode: number = 200) {
    return new ApiResponseBuilder().setData(data).setStatusCode(statusCode)
  }

  static error(message: string, code?: string, statusCode: number = 400) {
    return new ApiResponseBuilder().setError(message, code).setStatusCode(statusCode)
  }

  static paginated<T>(data: T[], total: number, page: number = 1, limit: number = 10) {
    const pages = Math.ceil(total / limit)
    const response: PaginatedResponse<T> = {
      success: true,
      data,
      pagination: { total, page, limit, pages },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    }
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  setData(data: any) {
    this.data = data
    return this
  }

  setError(message: string, code?: string) {
    this.error = { message, code }
    return this
  }

  setStatusCode(code: number) {
    this.statusCode = code
    return this
  }

  setMeta(meta: any) {
    this.meta = { ...this.meta, ...meta }
    return this
  }

  build(): NextResponse {
    const response: ApiResponse<any> = {
      success: !this.error,
      ...(this.data !== undefined && { data: this.data }),
      ...(this.error && { error: this.error }),
      meta: this.meta,
    }

    return new NextResponse(JSON.stringify(response), {
      status: this.statusCode,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Convenience functions
export function successResponse<T>(data: T, statusCode: number = 200) {
  return ApiResponseBuilder.success(data, statusCode).build()
}

export function errorResponse(message: string, code?: string, statusCode: number = 400) {
  return ApiResponseBuilder.error(message, code, statusCode).build()
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number = 1,
  limit: number = 10
) {
  return ApiResponseBuilder.paginated(data, total, page, limit)
}

// Validate pagination params
export function getPaginationParams(params: any) {
  const page = Math.max(1, parseInt(params.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 10))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}
