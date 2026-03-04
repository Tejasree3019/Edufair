/**
 * Environment Configuration & Validation
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL',
]

const optionalEnvVars = {
  NEXT_PUBLIC_ENABLE_ANALYTICS: 'true',
  NEXT_PUBLIC_ENABLE_MONITORING: 'true',
  NODE_ENV: 'development',
  LOG_LEVEL: 'info',
  API_TIMEOUT: '30000',
  MAX_REQUEST_SIZE: '10mb',
}

/**
 * Validate environment variables on startup
 */
export function validateEnvironment() {
  const missing: string[] = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n\nPlease add them to your .env.local file`
    )
  }

  console.log('✓ All required environment variables are set')
}

/**
 * Get environment configuration with defaults
 */
export function getEnvConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'
  const isTest = process.env.NODE_ENV === 'test'

  return {
    // Environment
    env: process.env.NODE_ENV || 'development',
    isDevelopment,
    isProduction,
    isTest,

    // API
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    apiTimeout: parseInt(process.env.API_TIMEOUT || '30000'),
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',

    // Authentication
    authSecret: process.env.NEXTAUTH_SECRET,
    authProviders: {
      google: !!process.env.GOOGLE_CLIENT_ID,
      github: !!process.env.GITHUB_CLIENT_ID,
    },

    // Database
    databaseUrl: process.env.DATABASE_URL,
    databaseSSL: process.env.DATABASE_SSL === 'true',

    // Features
    analytics: {
      enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    },
    monitoring: {
      enabled: process.env.NEXT_PUBLIC_ENABLE_MONITORING === 'true',
      sentryDsn: process.env.SENTRY_DSN,
    },
    errorReporting: {
      enabled: process.env.ERROR_REPORTING_ENABLED === 'true',
      slackWebhook: process.env.SLACK_WEBHOOK_URL,
    },

    // Security
    corsOrigins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
    allowedApiKeys: (process.env.VALID_API_KEYS || '').split(',').filter(Boolean),
    rateLimit: {
      enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },

    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
    logFormat: process.env.LOG_FORMAT || 'json',

    // External Services
    emailService: {
      provider: process.env.EMAIL_PROVIDER || 'sendgrid',
      apiKey: process.env.EMAIL_API_KEY,
      from: process.env.EMAIL_FROM || 'noreply@edufair.com',
    },
    smsService: {
      provider: process.env.SMS_PROVIDER || 'twilio',
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_PHONE_NUMBER,
    },

    // Feature Flags
    features: {
      darkMode: process.env.FEATURE_DARK_MODE === 'true',
      pwaPush: process.env.FEATURE_PWA_PUSH === 'true',
      realTimeNotifications: process.env.FEATURE_REALTIME_NOTIFICATIONS === 'true',
      advancedFilters: process.env.FEATURE_ADVANCED_FILTERS === 'true',
      mentorMatching: process.env.FEATURE_MENTOR_MATCHING === 'true',
    },

    // Pagination
    pagination: {
      defaultLimit: 10,
      maxLimit: 100,
    },

    // Session
    session: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400'), // 1 day
      updateAge: parseInt(process.env.SESSION_UPDATE_AGE || '3600'), // 1 hour
    },

    // Deployment
    deployment: {
      url: process.env.DEPLOYMENT_URL || 'http://localhost:3000',
      region: process.env.DEPLOYMENT_REGION || 'us-east-1',
      version: process.env.npm_package_version || '0.0.1',
    },
  }
}

/**
 * Validate configuration at runtime
 */
export function validateConfig() {
  const config = getEnvConfig()

  // Validate API URL
  try {
    new URL(config.apiUrl)
  } catch {
    throw new Error(`Invalid API URL: ${config.apiUrl}`)
  }

  // Validate database URL in production
  if (config.isProduction && !config.databaseUrl) {
    throw new Error('DATABASE_URL is required in production')
  }

  // Validate rate limits
  if (config.rateLimit.windowMs < 1000) {
    throw new Error('Rate limit window must be at least 1 second')
  }

  if (config.rateLimit.maxRequests < 1) {
    throw new Error('Rate limit max requests must be at least 1')
  }

  console.log('✓ Configuration validated successfully')

  return config
}

export type Config = ReturnType<typeof getEnvConfig>
