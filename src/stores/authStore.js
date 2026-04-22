import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import authApi from '../api/auth'

// Commit 7: Minor update

const hasOwnProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

const getUserFromResponse = (payload) => {
  if (!payload) return null

  if (payload.user && typeof payload.user === 'object') {
    return payload.user
  }

  if (payload.data?.user && typeof payload.data.user === 'object') {
    return payload.data.user
  }

  if (
    hasOwnProperty(payload, 'id') ||
    hasOwnProperty(payload, 'email') ||
    hasOwnProperty(payload, 'first_name') ||
    hasOwnProperty(payload, 'last_name')
  ) {
    return payload
  }

  return null
}

const getAvatarUpdateFromResponse = (payload) => {
  if (!payload) return null

  if (payload.user && typeof payload.user === 'object') {
    return payload.user
  }

  if (payload.data?.user && typeof payload.data.user === 'object') {
    return payload.data.user
  }

  if (hasOwnProperty(payload, 'avatar_url')) {
    return { avatar_url: payload.avatar_url }
  }

  if (payload.data && hasOwnProperty(payload.data, 'avatar_url')) {
    return { avatar_url: payload.data.avatar_url }
  }

  if (
    hasOwnProperty(payload, 'id') ||
    hasOwnProperty(payload, 'email') ||
    hasOwnProperty(payload, 'first_name') ||
    hasOwnProperty(payload, 'last_name')
  ) {
    return payload
  }

  return null
}

const requiresEmailVerification = (user) => {
  if (!user) return false

  if (hasOwnProperty(user, 'email_verified')) {
    return !Boolean(user.email_verified)
  }

  if (hasOwnProperty(user, 'is_active')) {
    return !Boolean(user.is_active)
  }

  return false
}

const isOAuthFailureRoute = () => {
  if (typeof window === 'undefined') return false

  return new URLSearchParams(window.location.search).get('error') === 'auth_failed'
}

const getErrorMessage = (error, fallback = 'Request failed') => {
  return error?.response?.data?.message || error?.message || fallback
}

const mergeUserUpdates = (set, get, updates) => {
  const user = get().user ? { ...get().user, ...updates } : null

  set({
    user,
    isAuthenticated: !!user,
    emailVerificationRequired: requiresEmailVerification(user),
    error: null,
  })

  return user
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      loading: true,
      error: null,
      emailVerificationRequired: false,

      // Setters
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        emailVerificationRequired: requiresEmailVerification(user),
        error: null,
      }),
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      /**
       * Mark email as verified (updates local state)
       */
      setEmailVerified: () => set(state => ({
        user: state.user ? { ...state.user, email_verified: true, is_active: true } : null,
        emailVerificationRequired: false,
      })),

      /**
       * Check authentication status
       */
      checkAuth: async () => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.getMe()

          const user = getUserFromResponse(response)

          if (!user) {
            set({
              user: null,
              isAuthenticated: false,
              emailVerificationRequired: false,
              loading: false,
              error: null,
            })
            return null
          }

          set({
            user: get().user ? { ...get().user, ...user } : user,
            isAuthenticated: true,
            emailVerificationRequired: requiresEmailVerification(user),
            loading: false,
            error: null,
          })

          return response
        } catch (error) {
          console.error('Auth check failed:', error)
          const status = error?.response?.status ?? error?.status
          const isAuthFailure = status === 401 || status === 403
          const preserveError = isAuthFailure && isOAuthFailureRoute()

          set({ 
            user: null, 
            isAuthenticated: false,
            emailVerificationRequired: false,
            loading: false,
            error: preserveError ? get().error : (isAuthFailure ? null : getErrorMessage(error, 'Authentication failed'))
          })

          return null
        }
      },

      /**
       * Refresh the current user profile without toggling the global loading state
       */
      refreshProfile: async () => {
        try {
          const response = await authApi.getMe()
          const user = getUserFromResponse(response)

          if (!user) {
            set({
              user: null,
              isAuthenticated: false,
              emailVerificationRequired: false,
              error: null,
            })
            return null
          }

          set({
            user: get().user ? { ...get().user, ...user } : user,
            isAuthenticated: true,
            emailVerificationRequired: requiresEmailVerification(user),
            error: null,
          })

          return user
        } catch (error) {
          console.error('Profile refresh failed:', error)
          throw error
        }
      },

      /**
       * Initiate Google OAuth login
       */
      googleLogin: () => {
        authApi.googleLogin()
      },

      /**
       * Login user
       */
      login: async (credentials) => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.login(credentials)

          const user = getUserFromResponse(response)
          if (!user) {
            throw new Error('Invalid authentication response')
          }
          
          set({
            user: get().user ? { ...get().user, ...user } : user,
            isAuthenticated: true,
            emailVerificationRequired: requiresEmailVerification(user),
            loading: false,
            error: null,
          })
          
          return response
        } catch (error) {
          set({ loading: false, error: getErrorMessage(error, 'Login failed') })
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

          const user = getUserFromResponse(response)
          if (!user) {
            throw new Error('Invalid authentication response')
          }
          
          set({
            user: get().user ? { ...get().user, ...user } : user,
            isAuthenticated: true,
            emailVerificationRequired: requiresEmailVerification(user),
            loading: false,
            error: null,
          })
          
          return response
        } catch (error) {
          set({ loading: false, error: getErrorMessage(error, 'Registration failed') })
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
            loading: false,
            error: null,
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
            user: state.user ? { ...state.user, email_verified: true, is_active: true } : null,
            emailVerificationRequired: false,
            loading: false,
            error: null,
          }))
          
          return response
        } catch (error) {
          set({ loading: false, error: getErrorMessage(error, 'Verification failed') })
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
            user: state.user ? { ...state.user, email_verified: true, is_active: true } : null,
            emailVerificationRequired: false,
            loading: false,
            error: null,
          }))
          
          return response
        } catch (error) {
          set({ loading: false, error: getErrorMessage(error, 'Verification failed') })
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
      updateUser: (updates) => mergeUserUpdates(set, get, updates),

      /**
       * Update profile details from the settings screen
       */
      updateProfile: (updates) => mergeUserUpdates(set, get, updates),

      /**
       * Update the authenticated user's avatar
       */
      updateAvatar: async (payload) => {
        try {
          const response = await authApi.updateAvatar(payload)
          const avatarUpdate = getAvatarUpdateFromResponse(response)

          if (avatarUpdate) {
            return mergeUserUpdates(set, get, avatarUpdate)
          }

          const refreshedUser = await get().refreshProfile()
          return refreshedUser
        } catch (error) {
          throw error
        }
      },

      /**
       * Remove the authenticated user's avatar
       */
      removeAvatar: async () => {
        try {
          const response = await authApi.removeAvatar()
          const avatarUpdate = getAvatarUpdateFromResponse(response) || { avatar_url: null }

          return mergeUserUpdates(set, get, avatarUpdate)
        } catch (error) {
          throw error
        }
      },

      /**
       * Change password (authenticated user)
       */
      changePassword: async (currentPassword, newPassword) => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.changePassword(currentPassword, newPassword)
          set({ loading: false })
          return response
        } catch (error) {
          set({ loading: false, error: getErrorMessage(error, 'Password change failed') })
          throw error
        }
      },

      /**
       * Initiate email change
       */
      changeEmail: async (newEmail, password) => {
        try {
          set({ loading: true, error: null })
          const response = await authApi.changeEmail(newEmail, password)
          set({ loading: false })
          return response
        } catch (error) {
          set({ loading: false, error: getErrorMessage(error, 'Email change failed') })
          throw error
        }
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
