import axios from 'axios'

/**
 * Axios instance configured for session-based authentication
 * Uses withCredentials to send HTTP-only cookies
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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