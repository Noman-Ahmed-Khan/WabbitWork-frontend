import { create } from 'zustand'
import teamsApi from '../api/teams'

/**
 * Team management store
 * Handles teams and members state
 * 
 * @module stores/teamStore
 */
const useTeamStore = create((set, get) => ({
  // State
  teams: [],
  selectedTeam: null,
  members: [],
  loading: false,
  error: null,

  // Setters
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  // Actions
  /**
   * Load all teams for current user
   */
  loadTeams: async () => {
    try {
      set({ loading: true, error: null })
      const response = await teamsApi.getAll()
      set({ teams: response.data.teams, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Select a team
   * @param {Object} team - Team object
   */
  selectTeam: (team) => {
    set({ selectedTeam: team })
  },

  /**
   * Load team members
   * @param {string} teamId - Team ID
   */
  loadMembers: async (teamId) => {
    try {
      set({ loading: true, error: null })
      const response = await teamsApi.getMembers(teamId)
      set({ members: response.data.members, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Create new team
   * @param {Object} data - Team data
   */
  createTeam: async (data) => {
    try {
      set({ loading: true, error: null })
      await teamsApi.create(data)
      await get().loadTeams()
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Update team
   * @param {string} id - Team ID
   * @param {Object} data - Updated team data
   */
  updateTeam: async (id, data) => {
    try {
      set({ loading: true, error: null })
      await teamsApi.update(id, data)
      await get().loadTeams()
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Delete team
   * @param {string} id - Team ID
   */
  deleteTeam: async (id) => {
    try {
      set({ loading: true, error: null })
      await teamsApi.delete(id)
      await get().loadTeams()
      if (get().selectedTeam?.id === id) {
        set({ selectedTeam: null })
      }
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Add member to team
   * @param {string} teamId - Team ID
   * @param {Object} data - Member data
   */
  addMember: async (teamId, data) => {
    try {
      set({ loading: true, error: null })
      await teamsApi.addMember(teamId, data)
      await get().loadMembers(teamId)
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Update member role
   * @param {string} teamId - Team ID
   * @param {string} memberId - Member ID
   * @param {string} role - New role
   */
  updateMemberRole: async (teamId, memberId, role) => {
    try {
      set({ loading: true, error: null })
      await teamsApi.updateMemberRole(teamId, memberId, { role })
      await get().loadMembers(teamId)
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Remove member from team
   * @param {string} teamId - Team ID
   * @param {string} memberId - Member ID
   */
  removeMember: async (teamId, memberId) => {
    try {
      set({ loading: true, error: null })
      await teamsApi.removeMember(teamId, memberId)
      await get().loadMembers(teamId)
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Leave team
   * @param {string} teamId - Team ID
   */
  leaveTeam: async (teamId) => {
    try {
      set({ loading: true, error: null })
      await teamsApi.leaveTeam(teamId)
      await get().loadTeams()
      set({ selectedTeam: null, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Reset store to initial state
   */
  reset: () => set({
    teams: [],
    selectedTeam: null,
    members: [],
    loading: false,
    error: null,
  }),
}))

export default useTeamStore