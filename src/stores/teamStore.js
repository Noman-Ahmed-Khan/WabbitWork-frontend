import { create } from 'zustand'
import teamsApi from '../api/teams'

/**
 * Team management store
 * Handles teams and members state
 * 
 * @module stores/teamStore
 */

const syncSelectedTeam = (set, get, teamId) => {
  const currentSelectedTeam = get().selectedTeam
  if (currentSelectedTeam?.id !== teamId) return

  const refreshedTeam = get().teams.find((team) => team.id === teamId) || null
  set({ selectedTeam: refreshedTeam })
}

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
      syncSelectedTeam(set, get, get().selectedTeam?.id)
    } catch (error) {
      set({ error: error.message, loading: false, teams: [] })
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
    if (!teamId || teamId.trim() === '') {
      set({ members: [] })
      return
    }

    try {
      set({ loading: true, error: null })
      const response = await teamsApi.getMembers(teamId)
      set({ members: response.data.members, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false, members: [] })
      console.error('Load members error:', error)
      throw error // Re-throw so caller can handle
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
      syncSelectedTeam(set, get, id)
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
      syncSelectedTeam(set, get, id)
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Archive a team
   * @param {string} id - Team ID
   */
  archiveTeam: async (id) => {
    try {
      set({ loading: true, error: null })
      await teamsApi.update(id, { is_active: false })
      await get().loadTeams()
      syncSelectedTeam(set, get, id)
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Restore a team
   * @param {string} id - Team ID
   */
  restoreTeam: async (id) => {
    try {
      set({ loading: true, error: null })
      await teamsApi.update(id, { is_active: true })
      await get().loadTeams()
      syncSelectedTeam(set, get, id)
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
      syncSelectedTeam(set, get, teamId)
      set({ loading: false })
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
