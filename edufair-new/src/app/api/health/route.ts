import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    database: {
      status: 'ok' | 'error'
      latency?: number
      message?: string
    }
    memory: {
      status: 'ok' | 'warning'
      usage: number
      limit: number
    }
    api: {
      status: 'ok' | 'slow'
      latency: number
    }
  }
  version: string
  environment: string
}

let startTime = Date.now()

// Simulated health checks
async function checkDatabase(): Promise<{ status: 'ok' | 'error'; latency?: number; message?: string }> {
  try {
    const start = Date.now()
    // In production, this would actually query the database
    // const result = await db.raw('SELECT 1')
    const latency = Date.now() - start
    return { status: 'ok', latency }
  } catch (error) {
    return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

function checkMemory(): { status: 'ok' | 'warning'; usage: number; limit: number } {
  const usage = process.memoryUsage()
  const heapUsedPercent = (usage.heapUsed / usage.heapTotal) * 100

  return {
    status: heapUsedPercent > 80 ? 'warning' : 'ok',
    usage: Math.round(usage.heapUsed / 1024 / 1024),
    limit: Math.round(usage.heapTotal / 1024 / 1024),
  }
}

async function checkApi(): Promise<{ status: 'ok' | 'slow'; latency: number }> {
  const start = Date.now()
  try {
    // Simulate API check
    await new Promise(resolve => setTimeout(resolve, 10))
    const latency = Date.now() - start
    return { status: latency > 100 ? 'slow' : 'ok', latency }
  } catch {
    return { status: 'slow', latency: 999 }
  }
}

export async function GET() {
  try {
    const startCheck = Date.now()

    const [dbCheck, memoryCheck, apiCheck] = await Promise.all([
      checkDatabase(),
      Promise.resolve(checkMemory()),
      checkApi(),
    ])

    const uptime = Date.now() - startTime
    const checkDuration = Date.now() - startCheck

    // Determine overall health status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (dbCheck.status === 'error' || memoryCheck.status === 'warning') {
      overallStatus = 'degraded'
    }
    if (dbCheck.status === 'error') {
      overallStatus = 'unhealthy'
    }

    const response: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime,
      checks: {
        database: dbCheck,
        memory: memoryCheck,
        api: apiCheck,
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'unknown',
    }

    logger.info('Health check', { status: overallStatus, duration: checkDuration })

    const statusCode = overallStatus === 'unhealthy' ? 503 : 200

    return NextResponse.json(response, { status: statusCode })
  } catch (error) {
    logger.error('Health check failed', error instanceof Error ? error : new Error('Unknown error'))

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - startTime,
        checks: {
          database: { status: 'error' as const },
          memory: { status: 'ok' as const, usage: 0, limit: 0 },
          api: { status: 'slow' as const, latency: 999 },
        },
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'unknown',
      },
      { status: 503 }
    )
  }
}
