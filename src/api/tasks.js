import client from './client'

/**
 * Tasks API methods
 */
export const tasksApi = {
  /**
   * Get all tasks with optional filters
   */
  getAll: async (params = {}) => {
    const response = await client.get('/tasks', { params })
    return response.data
  },

  /**
   * Get task by ID
   */
  getById: async (id) => {
    const response = await client.get(`/tasks/${id}`)
    return response.data
  },

  /**
   * Create a new task
   */
  create: async (data) => {
    const response = await client.post('/tasks', data)
    return response.data
  },

  /**
   * Update task
   */
  update: async (id, data) => {
    const response = await client.put(`/tasks/${id}`, data)
    return response.data
  },

  /**
   * Delete task
   */
  delete: async (id) => {
    const response = await client.delete(`/tasks/${id}`)
    return response.data
  },

  /**
   * Get tasks due soon
   */
  getDueSoon: async (days = 3) => {
    const response = await client.get('/tasks/due-soon', { params: { days } })
    return response.data
  },

  /**
   * Get overdue tasks
   */
  getOverdue: async () => {
    const response = await client.get('/tasks/overdue')
    return response.data
  },
}

export default tasksApi