/**
 * Utility Functions for EduFair
 */

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`
}

export const getDaysUntilDeadline = (deadline: string): number => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const getDeadlineStatus = (deadline: string): 'urgent' | 'soon' | 'plenty' => {
  const days = getDaysUntilDeadline(deadline)
  if (days <= 7) return 'urgent'
  if (days <= 30) return 'soon'
  return 'plenty'
}

export const getDeadlineStatusBadge = (deadline: string): { color: string; emoji: string; text: string } => {
  const status = getDeadlineStatus(deadline)
  const days = getDaysUntilDeadline(deadline)

  switch (status) {
    case 'urgent':
      return { color: 'red', emoji: '🔴', text: `${days} days left` }
    case 'soon':
      return { color: 'yellow', emoji: '🟡', text: `${days} days left` }
    default:
      return { color: 'green', emoji: '🟢', text: `${days} days left` }
  }
}

export const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50'
    case 'low':
      return 'text-green-600 bg-green-50'
  }
}

export const getRiskLevelColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'low':
      return 'text-green-600 bg-green-50'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50'
    case 'high':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export const getScoreBadge = (score: number): { color: string; text: string } => {
  if (score >= 0.8) return { color: 'text-green-600', text: 'Excellent' }
  if (score >= 0.6) return { color: 'text-yellow-600', text: 'Good' }
  if (score >= 0.4) return { color: 'text-orange-600', text: 'Fair' }
  return { color: 'text-red-600', text: 'Low' }
}

export const truncateText = (text: string, length: number = 100): string => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const parseAuthToken = (token: string): { userId: string; email: string; role: string } | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const encodedPayload = parts[1]
    if (!encodedPayload) return null
    
    const payload = JSON.parse(atob(encodedPayload))
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    }
  } catch {
    return null
  }
}

export const getApplicationStatusColor = (status: string): string => {
  switch (status) {
    case 'accepted':
      return 'text-green-600 bg-green-50'
    case 'rejected':
      return 'text-red-600 bg-red-50'
    case 'submitted':
      return 'text-blue-600 bg-blue-50'
    case 'under_review':
      return 'text-yellow-600 bg-yellow-50'
    case 'draft':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export const getApplicationStatusIcon = (status: string): string => {
  switch (status) {
    case 'accepted':
      return '✅'
    case 'rejected':
      return '❌'
    case 'submitted':
      return '📤'
    case 'under_review':
      return '⏳'
    case 'draft':
      return '📝'
    default:
      return '📌'
  }
}
