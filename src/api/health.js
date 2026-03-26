import client from './client'

/**
 * Health Check API
 * @module api/health
 */
export const healthApi = {
  /**
   * Check API health status
   */
  checkHealth: async () => {
    const response = await client.get('/health')
    return response.data
  },
}

export default healthApi
