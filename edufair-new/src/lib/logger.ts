export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  error?: string
  userAgent?: string
  ip?: string
  userId?: string
  path?: string
}

class Logger {
  private logs: LogEntry[] = []
  private isDevelopment = process.env.NODE_ENV === 'development'
  private maxLogs = 1000

  private formatLevel(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m', // green
      warn: '\x1b[33m', // yellow
      error: '\x1b[31m', // red
    }
    const reset = '\x1b[0m'
    return `${colors[level]}[${level.toUpperCase()}]${reset}`
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error) {
    const timestamp = new Date().toISOString()
    const entry: LogEntry = {
      timestamp,
      level,
      message,
      data,
      error: error?.message,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    }

    // Store in memory
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output
    if (this.isDevelopment) {
      const prefix = this.formatLevel(level)
      console.log(`${prefix} ${timestamp} - ${message}`)
      if (data) console.log('  Data:', data)
      if (error) console.log('  Error:', error)
    } else {
      // Production: send to external service
      this.sendToExternalService(entry)
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // This would be integrated with services like:
    // - Sentry for errors
    // - LogRocket for user sessions
    // - CloudWatch, Stackdriver, etc.
    
    if (entry.level === 'error') {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {
        // Silently fail if logging fails
      })
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data)
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  error(message: string, error?: Error, data?: any) {
    this.log('error', message, data, error)
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }

  getStats() {
    return {
      total: this.logs.length,
      debug: this.logs.filter(l => l.level === 'debug').length,
      info: this.logs.filter(l => l.level === 'info').length,
      warn: this.logs.filter(l => l.level === 'warn').length,
      error: this.logs.filter(l => l.level === 'error').length,
    }
  }
}

// Singleton instance
export const logger = new Logger()

// API endpoint logging
export function logApiRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  userId?: string
) {
  logger.info(`${method} ${path}`, {
    statusCode,
    duration: `${duration}ms`,
    userId,
  })
}

export function logApiError(
  method: string,
  path: string,
  error: Error,
  userId?: string
) {
  logger.error(`${method} ${path}`, error, { userId })
}

// Database logging
export function logDatabaseOperation(
  operation: string,
  table: string,
  duration: number,
  success: boolean
) {
  if (success) {
    logger.info(`DB ${operation} on ${table}`, { duration: `${duration}ms` })
  } else {
    logger.warn(`DB ${operation} on ${table}`, { duration: `${duration}ms` })
  }
}

// Authentication logging
export function logAuthEvent(
  event: 'login' | 'register' | 'logout' | 'failed_login',
  userId?: string,
  details?: any
) {
  logger.info(`Auth: ${event}`, { userId, ...details })
}

// Performance metrics
export function logPerformanceMetric(metric: string, value: number, unit: string) {
  logger.info(`Performance: ${metric}`, { value, unit })
}
