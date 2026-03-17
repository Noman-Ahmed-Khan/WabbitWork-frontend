import client from './client'

/**
 * Notifications API
 * @module api/notifications
 */
export const notificationsApi = {
  /**
   * Get all notifications with pagination
   * @param {Object} params
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {boolean} [params.is_read] - Filter by read status
   * @param {string} [params.type] - Filter by notification type
   */
  getAll: async (params = {}) => {
    const response = await client.get('/notifications', { params })
    return response.data
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async () => {
    const response = await client.get('/notifications/unread/count')
    return response.data
  },

  /**
   * Get notification by ID
   * @param {string} id - Notification ID
   */
  getById: async (id) => {
    const response = await client.get(`/notifications/${id}`)
    return response.data
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   */
  markAsRead: async (id) => {
    const response = await client.put(`/notifications/${id}/read`)
    return response.data
  },

  /**
   * Mark notification as unread
   * @param {string} id - Notification ID
   */
  markAsUnread: async (id) => {
    const response = await client.put(`/notifications/${id}/unread`)
    return response.data
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await client.put('/notifications/read-all')
    return response.data
  },

  /**
   * Delete notification
   * @param {string} id - Notification ID
   */
  delete: async (id) => {
    const response = await client.delete(`/notifications/${id}`)
    return response.data
  },

  /**
   * Delete all notifications
   */
  deleteAll: async () => {
    const response = await client.delete('/notifications')
    return response.data
  },

  /**
   * Get notification preferences
   */
  getPreferences: async () => {
    const response = await client.get('/notifications/preferences')
    return response.data
  },

  /**
   * Update notification preferences
   * @param {Object} preferences - Preference object with keys like email_team_invitation, inapp_task_assigned
   */
  updatePreferences: async (preferences) => {
    const response = await client.put('/notifications/preferences', preferences)
    return response.data
  },
}

export default notificationsApi