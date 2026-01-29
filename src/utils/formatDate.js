/**
 * Date formatting utilities
 */

export function formatDate(dateString) {
  if (!dateString) return null
  
  const date = new Date(dateString)
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatDateTime(dateString) {
  if (!dateString) return null
  
  const date = new Date(dateString)
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatRelativeDate(dateString) {
  if (!dateString) return null
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = date - now
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) {
    return `${Math.abs(diffInDays)} days overdue`
  } else if (diffInDays === 0) {
    return 'Due today'
  } else if (diffInDays === 1) {
    return 'Due tomorrow'
  } else if (diffInDays <= 7) {
    return `Due in ${diffInDays} days`
  } else {
    return formatDate(dateString)
  }
}

export function isOverdue(dateString) {
  if (!dateString) return false
  const date = new Date(dateString)
  const now = new Date()
  return date < now
}

export function isDueSoon(dateString, days = 3) {
  if (!dateString) return false
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = date - now
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  return diffInDays >= 0 && diffInDays <= days
}