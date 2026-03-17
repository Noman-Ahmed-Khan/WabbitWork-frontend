import client from './client'

/**
 * Session Management API
 * @module api/sessions
 */
export const sessionsApi = {
  /**
   * Get all active sessions
   */
  getAll: async () => {
    const response = await client.get('/auth/sessions')
    return response.data
  },

  /**
   * Delete a specific session
   * @param {string} sessionId - Session ID
   */
  deleteSession: async (sessionId) => {
    const response = await client.delete(`/auth/sessions/${sessionId}`)
    return response.data
  },

  /**
   * Logout from all devices
   * @param {boolean} [keepCurrent=false] - Keep current session active
   */
  logoutAll: async (keepCurrent = false) => {
    const response = await client.post('/auth/logout-all', { keepCurrent })
    return response.data
  },

  /**
   * Refresh current session (extend expiry)
   */
  refresh: async () => {
    const response = await client.post('/auth/refresh')
    return response.data
  },
}

export default sessionsApi
