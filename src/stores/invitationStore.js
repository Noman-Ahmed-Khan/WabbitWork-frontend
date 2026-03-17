import { create } from 'zustand'
import invitationsApi from '../api/invitations'

/**
 * Invitation store using Zustand
 * Manages team invitations (received and sent)
 * 
 * @module stores/invitationStore
 */
const useInvitationStore = create((set, get) => ({
  // State
  receivedInvitations: [],
  sentInvitations: [],
  pendingCount: 0,
  loading: false,
  error: null,

  // Setters
  setReceivedInvitations: (invitations) => set({ receivedInvitations: invitations }),
  setSentInvitations: (invitations) => set({ sentInvitations: invitations }),
  setPendingCount: (count) => set({ pendingCount: count }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Actions

  /**
   * Fetch pending invitation count
   */
  fetchPendingCount: async () => {
    try {
      const response = await invitationsApi.getPendingCount()
      set({ pendingCount: response.data.count })
    } catch (error) {
      console.error('Failed to fetch pending count:', error)
    }
  },

  /**
   * Fetch received invitations
   * @param {string} [status] - Filter by status
   */
  fetchReceived: async (status) => {
    try {
      set({ loading: true, error: null })
      const response = await invitationsApi.getReceived(status)
      
      set({ 
        receivedInvitations: response.data.invitations,
        loading: false 
      })
      
      return response
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  /**
   * Fetch sent invitations
   * @param {Object} filters - Filters (status, team_id)
   */
  fetchSent: async (filters = {}) => {
    try {
      set({ loading: true, error: null })
      const response = await invitationsApi.getSent(filters)
      
      set({ 
        sentInvitations: response.data.invitations,
        loading: false 
      })
      
      return response
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  /**
   * Accept invitation
   * @param {string} id - Invitation ID
   */
  acceptInvitation: async (id) => {
    try {
      set({ loading: true, error: null })
      const response = await invitationsApi.accept(id)
      
      // Remove from received invitations and update pending count
      set(state => ({
        receivedInvitations: state.receivedInvitations.filter(inv => inv.id !== id),
        pendingCount: Math.max(0, state.pendingCount - 1),
        loading: false,
      }))
      
      return response
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  /**
   * Decline invitation
   * @param {string} id - Invitation ID
   */
  declineInvitation: async (id) => {
    try {
      set({ loading: true, error: null })
      const response = await invitationsApi.decline(id)
      
      // Remove from received invitations and update pending count
      set(state => ({
        receivedInvitations: state.receivedInvitations.filter(inv => inv.id !== id),
        pendingCount: Math.max(0, state.pendingCount - 1),
        loading: false,
      }))
      
      return response
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  /**
   * Cancel invitation (inviter/admin only)
   * @param {string} id - Invitation ID
   */
  cancelInvitation: async (id) => {
    try {
      set({ loading: true, error: null })
      const response = await invitationsApi.cancel(id)
      
      // Remove from sent invitations
      set(state => ({
        sentInvitations: state.sentInvitations.filter(inv => inv.id !== id),
        loading: false,
      }))
      
      return response
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  /**
   * Resend invitation
   * @param {string} id - Invitation ID
   */
  resendInvitation: async (id) => {
    try {
      const response = await invitationsApi.resend(id)
      return response
    } catch (error) {
      throw error
    }
  },

  /**
   * Create team invitation
   * @param {string} teamId - Team ID
   * @param {Object} data - Invitation data
   */
  createInvitation: async (teamId, data) => {
    try {
      set({ loading: true, error: null })
      const response = await invitationsApi.create(teamId, data)
      
      // Refresh sent invitations
      await get().fetchSent()
      
      set({ loading: false })
      return response
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  /**
   * Reset store to initial state
   */
  reset: () => set({
    receivedInvitations: [],
    sentInvitations: [],
    pendingCount: 0,
    loading: false,
    error: null,
  }),
}))

export default useInvitationStore
