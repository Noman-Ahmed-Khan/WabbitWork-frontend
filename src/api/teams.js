import client from './client'

/**
 * Teams API methods
 */
export const teamsApi = {
  /**
   * Get all teams for current user
   */
  getAll: async () => {
    const response = await client.get('/teams')
    return response.data
  },

  /**
   * Get team by ID
   */
  getById: async (id) => {
    const response = await client.get(`/teams/${id}`)
    return response.data
  },

  /**
   * Create a new team
   */
  create: async (data) => {
    const response = await client.post('/teams', data)
    return response.data
  },

  /**
   * Update team
   */
  update: async (id, data) => {
    const response = await client.put(`/teams/${id}`, data)
    return response.data
  },

  /**
   * Delete team
   */
  delete: async (id) => {
    const response = await client.delete(`/teams/${id}`)
    return response.data
  },

  /**
   * Get team members
   */
  getMembers: async (teamId) => {
    const response = await client.get(`/teams/${teamId}/members`)
    return response.data
  },

  /**
   * Add member to team
   */
  addMember: async (teamId, data) => {
    const response = await client.post(`/teams/${teamId}/members`, data)
    return response.data
  },

  /**
   * Update member role
   */
  updateMemberRole: async (teamId, memberId, data) => {
    const response = await client.put(`/teams/${teamId}/members/${memberId}`, data)
    return response.data
  },

  /**
   * Remove member from team
   */
  removeMember: async (teamId, memberId) => {
    const response = await client.delete(`/teams/${teamId}/members/${memberId}`)
    return response.data
  },

  /**
   * Leave team
   */
  leaveTeam: async (teamId) => {
    const response = await client.post(`/teams/${teamId}/members/leave`)
    return response.data
  },

  /**
   * Get tasks for a team
   */
  getTasks: async (teamId, params = {}) => {
    const response = await client.get(`/teams/${teamId}/tasks`, { params })
    return response.data
  },
}

export default teamsApi