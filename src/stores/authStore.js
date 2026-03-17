import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import authApi from '../api/auth'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      emailVerificationRequired: false,

      // Setters
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user, 
        emailVerificationRequired: user ? !user.email_verified : false,
        error: null 
      }),
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      /**
       * Mark email as verified (updates local state)
       */
      setEmailVerified: () => set(state => ({
        user: state.user ? { ...state.user, is_verified: true } : null,
        emailVerificationRequired: false,
      })),

      /**
       * Check authentication status
       */
      checkAuth: async () => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.checkStatus()
          
          if (response.data.isAuthenticated) {
            const user = response.data.user
            set({ 
              user, 
              isAuthenticated: true,
              emailVerificationRequired: !user.email_verified,
              loading: false 
            })
          } else {
            set({ 
              user: null, 
              isAuthenticated: false,
              emailVerificationRequired: false,
              loading: false 
            })
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          set({ 
            user: null, 
            isAuthenticated: false,
            emailVerificationRequired: false, 
            loading: false,
            error: error.message 
          })
        }
      },

      /**
       * Login user
       */
      login: async (credentials) => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.login(credentials)
          const user = response.data.user
          
          set({ 
            user, 
            isAuthenticated: true,
            emailVerificationRequired: !user.email_verified,
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
       */
      register: async (data) => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.register(data)
          const user = response.data.user
          
          set({ 
            user, 
            isAuthenticated: true,
            emailVerificationRequired: !user.email_verified,
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
            emailVerificationRequired: false, 
            error: null 
          })
        }
      },

      /**
       * Verify email with code (from banner)
       */
      verifyEmailWithCode: async (code) => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.verifyEmailWithCode(code)
          
          // Update user verification status
          set(state => ({
            user: state.user ? { ...state.user, is_verified: true } : null,
            emailVerificationRequired: false,
            loading: false,
          }))
          
          return response
        } catch (error) {
          set({ loading: false, error: error.message })
          throw error
        }
      },

      /**
       * Verify email with token (from email link)
       */
      verifyEmailWithToken: async (token, type) => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.verifyEmailWithToken(token, type)
          
          // Update user verification status
          set(state => ({
            user: state.user ? { ...state.user, is_verified: true } : null,
            emailVerificationRequired: false,
            loading: false,
          }))
          
          return response
        } catch (error) {
          set({ loading: false, error: error.message })
          throw error
        }
      },

      /**
       * Resend verification email
       */
      resendVerification: async () => {
        try {
          const response = await authApi.resendVerification()
          return response
        } catch (error) {
          throw error
        }
      },

      /**
       * Update user profile in store
       */
      updateUser: (updates) => {
        set(state => ({
          user: state.user ? { ...state.user, ...updates } : null,
          emailVerificationRequired: updates.email_verified === true 
            ? false 
            : state.emailVerificationRequired,
        }))
      },

      /**
       * Reset store to initial state
       */
      reset: () => set({ 
        user: null, 
        isAuthenticated: false,
        emailVerificationRequired: false, 
        loading: false, 
        error: null 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        emailVerificationRequired: state.emailVerificationRequired,
      }),
    }
  )
)

export default useAuthStore