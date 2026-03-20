/**
 * Validation utilities for API responses
 * Ensures type-safe data handling and prevents crashes from malformed responses
 * 
 * @module utils/validation
 */

/**
 * Validate notification object
 * @param {*} notification - Object to validate
 * @returns {boolean} True if valid
 */
export function validateNotification(notification) {
  if (!notification || typeof notification !== 'object') return false

  // Only require essential fields - created_at can be added by sanitizer
  const required = ['id', 'title', 'message', 'type', 'is_read']
  const hasAllRequired = required.every(key => key in notification)

  if (!hasAllRequired) {
    console.warn('[Validation] Invalid notification - missing required fields', notification)
    return false
  }

  // Validate types
  if (typeof notification.id !== 'string') return false
  if (typeof notification.title !== 'string') return false
  if (typeof notification.message !== 'string') return false
  if (typeof notification.type !== 'string') return false
  if (typeof notification.is_read !== 'boolean') return false

  return true
}

export function validateInvitation(invitation) {
  if (!invitation || typeof invitation !== 'object') return false

  // Require ID
  if (!('id' in invitation) || typeof invitation.id !== 'string') {
    console.warn('[Validation] Invalid invitation - missing or invalid id', invitation)
    return false
  }

  // Attempt to parse status or default it
  const status = (invitation.status || 'pending').toLowerCase()
  const validStatuses = ['pending', 'accepted', 'declined', 'cancelled']
  
  if (!validStatuses.includes(status)) {
    console.warn(`[Validation] Invalid invitation status: ${status}`)
    // We don't return false here, we just warn, let sanitize handle it later
  }

  return true
}

/**
 * Sanitize notification - ensure all fields exist with safe defaults
 * @param {Object} notification - Raw notification from API
 * @returns {Object} Sanitized notification
 */
export function sanitizeNotification(notification) {
  return {
    id: notification?.id || `unknown-${Date.now()}`,
    title: notification?.title || 'Untitled Notification',
    message: notification?.message || 'No message provided',
    type: notification?.type || 'unknown',
    is_read: notification?.is_read ?? false,
    read_at: notification?.read_at || null,
    created_at: notification?.created_at || new Date().toISOString(),
    action_url: notification?.action_url || null,
    ...notification, // Preserve any additional fields
  }
}

/**
 * Sanitize invitation - ensure all fields exist with safe defaults
 * @param {Object} invitation - Raw invitation from API
 * @returns {Object} Sanitized invitation
 */
export function sanitizeInvitation(invitation) {
  const status = (invitation?.status || 'pending').toLowerCase()
  return {
    id: invitation?.id || `unknown-${Date.now()}`,
    email: invitation?.email || 'unknown@example.com',
    status: ['pending', 'accepted', 'declined', 'cancelled'].includes(status) ? status : 'pending',
    created_at: invitation?.created_at || new Date().toISOString(),
    team_id: invitation?.team_id || null,
    message: invitation?.message || null,
    ...invitation, // Preserve any additional fields
    status: ['pending', 'accepted', 'declined', 'cancelled'].includes(status) ? status : 'pending', // override just in case it was in ...invitation
  }
}

/**
 * Validate array of notifications
 * @param {Array} notifications - Array to validate
 * @returns {Array} Filtered and sanitized notifications
 */
export function validateNotifications(notifications) {
  if (!Array.isArray(notifications)) {
    console.warn('[Validation] Notifications is not an array')
    return []
  }

  return notifications
    .filter(notif => {
      try {
        return validateNotification(notif)
      } catch (error) {
        console.warn('[Validation] Error validating notification:', notif, error)
        return false
      }
    })
    .map(sanitizeNotification)
}

/**
 * Validate array of invitations
 * @param {Array} invitations - Array to validate
 * @returns {Array} Filtered and sanitized invitations
 */
export function validateInvitations(invitations) {
  if (!Array.isArray(invitations)) {
    console.warn('[Validation] Invitations is not an array')
    return []
  }

  return invitations
    .filter(invite => {
      try {
        return validateInvitation(invite)
      } catch (error) {
        console.warn('[Validation] Error validating invitation:', invite, error)
        return false
      }
    })
    .map(sanitizeInvitation)
}
