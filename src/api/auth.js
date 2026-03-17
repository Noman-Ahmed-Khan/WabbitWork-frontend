import client from './client'

/**
 * Authentication API methods
 * @module api/auth
 */
export const authApi = {
  // Registration & Login
  
  /**
   * Register a new user
   * @param {Object} data
   * @param {string} data.email
   * @param {string} data.password
   * @param {string} data.first_name
   * @param {string} data.last_name
   */
  register: async (data) => {
    const response = await client.post('/auth/register', data)
    return response.data
  },

  /**
   * Login user
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  login: async (credentials) => {
    const response = await client.post('/auth/login', credentials)
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await client.post('/auth/logout')
    return response.data
  },

  // Get current user profile
  getProfile: async () => {
    const response = await client.get('/auth/me')
    return response.data
  },

  // Check authentication status
  checkStatus: async () => {
    const response = await client.get('/auth/status')
    return response.data
  },

  // Email Verification

  /**
   * Verify email with token (from email link)
   * @param {string} token - Verification token
   * @param {string} [type] - Verification type ('email-change' for email change verification)
   */
  verifyEmailWithToken: async (token, type) => {
    const params = type ? { token, type } : { token }
    const response = await client.get('/auth/verify-email', { params })
    return response.data
  },

  /**
   * Verify email with code (manual entry)
   * @param {string} code - 6-digit verification code
   */
  verifyEmailWithCode: async (code) => {
    const response = await client.post('/auth/verify-email', { code })
    return response.data
  },

  /**
   * Resend verification email
   */
  resendVerification: async () => {
    const response = await client.post('/auth/resend-verification')
    return response.data
  },

  // Password Reset

  /**
   * Request password reset email
   * @param {string} email
   */
  forgotPassword: async (email) => {
    const response = await client.post('/auth/forgot-password', { email })
    return response.data
  },

  /**
   * Validate password reset token
   * @param {string} token
   */
  validateResetToken: async (token) => {
    const response = await client.get('/auth/reset-password', { params: { token } })
    return response.data
  },

  /**
   * Reset password with token
   * @param {string} token
   * @param {string} password - New password
   */
  resetPassword: async (token, password) => {
    const response = await client.post('/auth/reset-password', { token, password })
    return response.data
  },

  // Password Management

  /**
   * Change password (authenticated user)
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await client.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  },

  // Email Management

  /**
   * Initiate email change
   * @param {string} newEmail
   * @param {string} password - Current password for confirmation
   */
  changeEmail: async (newEmail, password) => {
    const response = await client.post('/auth/change-email', {
      newEmail,
      password,
    })
    return response.data
  },
}

export default authApi