import client from './client'

// Authentication API methods
export const authApi = {
  // Register a new user
  register: async (data) => {
    const response = await client.post('/auth/register', data)
    return response.data
  },

  // Login user
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
}

export default authApi