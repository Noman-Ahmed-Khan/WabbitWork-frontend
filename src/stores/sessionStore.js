import { create } from 'zustand'
import sessionsApi from '../api/sessions'

/**
 * Session Management Store
 * Manages active user sessions
 * 
 * @module stores/sessionStore
 */
const useSessionStore = create((set, get) => ({
  // State
  sessions: [],
  loading: false,
  error: null,

  // Setters
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Actions
  /**
   * Load all active sessions
   */
  loadSessions: async () => {
    try {
      set({ loading: true, error: null })
      const response = await sessionsApi.getAll()
      set({ sessions: response.data.sessions || [], loading: false })
      return response
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Terminate a specific session
   * @param {string} sessionId - Session ID to terminate
   */
  terminateSession: async (sessionId) => {
    try {
      set({ loading: true, error: null })
      await sessionsApi.deleteSession(sessionId)
      
      // Update local state by removing the terminated session
      set(state => ({
        sessions: state.sessions.filter(s => s.sid !== sessionId),
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Terminate all other sessions
   * @param {boolean} [keepCurrent=true] - Whether to keep the current session
   */
  terminateAllSessions: async (keepCurrent = true) => {
    try {
      set({ loading: true, error: null })
      await sessionsApi.logoutAll(keepCurrent)
      
      // If we keep current, re-fetch. If not, the user will be logged out anyway
      if (keepCurrent) {
        await get().loadSessions()
      } else {
        set({ sessions: [], loading: false })
      }
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Refresh current session
   */
  refreshSession: async () => {
    try {
      await sessionsApi.refresh()
    } catch (error) {
      console.error('Session refresh failed:', error)
    }
  },

  /**
   * Reset store
   */
  reset: () => set({
    sessions: [],
    loading: false,
    error: null,
  }),
}))

export default useSessionStore
