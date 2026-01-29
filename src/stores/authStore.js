import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import authApi from '../api/auth'

/**
 * Authentication store using Zustand
 * Manages user authentication state with persistence
 * 
 * @module stores/authStore
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Setters
      /**
       * Set user data
       * @param {Object} user - User object
       */
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user, 
        error: null 
      }),
      
      /**
       * Set loading state
       * @param {boolean} loading - Loading state
       */
      setLoading: (loading) => set({ loading }),
      
      /**
       * Set error message
       * @param {string} error - Error message
       */
      setError: (error) => set({ error }),

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),

      // Actions
      /**
       * Check authentication status
       * Called on app initialization
       */
      checkAuth: async () => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.checkStatus()
          
          if (response.data.isAuthenticated) {
            set({ 
              user: response.data.user, 
              isAuthenticated: true,
              loading: false 
            })
          } else {
            set({ 
              user: null, 
              isAuthenticated: false,
              loading: false 
            })
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          set({ 
            user: null, 
            isAuthenticated: false, 
            loading: false,
            error: error.message 
          })
        }
      },

      /**
       * Login user
       * @param {Object} credentials - Login credentials
       * @param {string} credentials.email - User email
       * @param {string} credentials.password - User password
       * @returns {Promise<Object>} API response
       */
      login: async (credentials) => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.login(credentials)
          
          set({ 
            user: response.data.user, 
            isAuthenticated: true,
            loading: false 
          })
          
          return response
        } catch (error) {
          set({ loading: false, error: error.message })
          throw error
        }
      },

      /**
       * Register new user
       * @param {Object} data - Registration data
       * @returns {Promise<Object>} API response
       */
      register: async (data) => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.register(data)
          
          set({ 
            user: response.data.user, 
            isAuthenticated: true,
            loading: false 
          })
          
          return response
        } catch (error) {
          set({ loading: false, error: error.message })
          throw error
        }
      },

      /**
       * Logout user
       */
      logout: async () => {
        try {
          await authApi.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          })
        }
      },

      /**
       * Reset store to initial state
       */
      reset: () => set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false, 
        error: null 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

export default useAuthStore