import client from './client'

/**
 * Team Invitations API
 * @module api/invitations
 */
export const invitationsApi = {
  /**
   * Get received invitations
   * @param {string} [status] - Filter by status (pending, accepted, declined, cancelled)
   */
  getReceived: async (status) => {
    const params = status ? { status } : {}
    const response = await client.get('/invitations/received', { params })
    return response.data
  },

  /**
   * Get sent invitations
   * @param {Object} filters
   * @param {string} [filters.status] - Filter by status
   * @param {string} [filters.team_id] - Filter by team ID
   */
  getSent: async (filters = {}) => {
    const response = await client.get('/invitations/sent', { params: filters })
    return response.data
  },

  /**
   * Get pending invitation count
   */
  getPendingCount: async () => {
    const response = await client.get('/invitations/pending/count')
    return response.data
  },

  /**
   * Get invitation by ID
   * @param {string} id - Invitation ID
   */
  getById: async (id) => {
    const response = await client.get(`/invitations/${id}`)
    return response.data
  },

  /**
   * Accept invitation
   * @param {string} id - Invitation ID
   */
  accept: async (id) => {
    const response = await client.post(`/invitations/${id}/accept`)
    return response.data
  },

  /**
   * Decline invitation
   * @param {string} id - Invitation ID
   */
  decline: async (id) => {
    const response = await client.post(`/invitations/${id}/decline`)
    return response.data
  },

  /**
   * Cancel invitation (inviter/admin only)
   * @param {string} id - Invitation ID
   */
  cancel: async (id) => {
    const response = await client.post(`/invitations/${id}/cancel`)
    return response.data
  },

  /**
   * Resend invitation
   * @param {string} id - Invitation ID
   */
  resend: async (id) => {
    const response = await client.post(`/invitations/${id}/resend`)
    return response.data
  },

  /**
   * Get team invitations (admin/owner only)
   * @param {string} teamId - Team ID
   * @param {string} [status] - Filter by status
   */
  getTeamInvitations: async (teamId, status) => {
    const params = status ? { status } : {}
    const response = await client.get(`/teams/${teamId}/invitations`, { params })
    return response.data
  },

  /**
   * Create team invitation (admin/owner only)
   * @param {string} teamId - Team ID
   * @param {Object} data
   * @param {string} data.email - Invitee email
   * @param {string} [data.role] - Role (admin/member)
   * @param {string} [data.message] - Personal message
   */
  create: async (teamId, data) => {
    const response = await client.post(`/teams/${teamId}/invitations`, data)
    return response.data
  },

  /**
   * Accept invitation from email link (public - no auth required)
   * @param {string} id - Invitation ID
   */
  acceptPublic: async (id) => {
    const response = await client.get(`/invitations/public/${id}/accept`)
    return response.data
  },

  /**
   * Decline invitation from email link (public - no auth required)
   * @param {string} id - Invitation ID
   */
  declinePublic: async (id) => {
    const response = await client.get(`/invitations/public/${id}/decline`)
    return response.data
  },
}

export default invitationsApi