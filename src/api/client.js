import axios from 'axios'
import config from '../config/env'

/**
 * Axios instance configured for session-based authentication
 * Uses environment variables for configuration
 * 
 * @module api/client
 */
const client = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  withCredentials: true, // Required for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
})


 // Response interceptor for consistent error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      })
    }

    // Handle API errors
    const errorMessage = error.response?.data?.message || 'An error occurred'
    
    // Redirect to login on 401 (optional - can be handled in components)
    if (error.response.status === 401) {
      console.warn('Unauthorized request:', errorMessage)
    }

    return Promise.reject({
      status: error.response.status,
      message: errorMessage,
      data: error.response.data,
    })
  }
)

export default client