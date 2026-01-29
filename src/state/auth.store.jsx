import { createContext, useContext, useState, useEffect } from 'react'
import authApi from '../api/auth'

const AuthContext = createContext(null)

/**
 * Authentication store using React Context
 * Manages user session state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const response = await authApi.checkStatus()
      
      if (response.data.isAuthenticated) {
        setUser(response.data.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    setUser(response.data.user)
    setIsAuthenticated(true)
    return response
  }

  const register = async (data) => {
    const response = await authApi.register(data)
    setUser(response.data.user)
    setIsAuthenticated(true)
    return response
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}