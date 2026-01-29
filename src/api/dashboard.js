import client from './client'

/**
 * Dashboard API methods
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const response = await client.get('/tasks/dashboard')
    return response.data
  },
}

export default dashboardApi