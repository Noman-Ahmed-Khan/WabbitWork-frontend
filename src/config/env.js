/**
 * Centralized environment configuration
 * Validates and exports all environment variables
 * 
 * @module config/env
 */

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not set
 * @returns {string} Environment variable value
 */
const getEnvVar = (key, defaultValue = '') => {
  const value = import.meta.env[key]
  
  if (value === undefined && !defaultValue) {
    console.warn(`⚠️  Environment variable ${key} is not set`)
  }
  
  return value || defaultValue
}

/**
 * Parse boolean from environment variable
 * @param {string} value - String value to parse
 * @returns {boolean} Parsed boolean
 */
const parseBoolean = (value) => {
  return value === 'true' || value === '1'
}

/**
 * Application configuration object
 */
const config = {
  // API Configuration
  api: {
    baseURL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api'),
    timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000'), 10),
  },

  // App Configuration
  app: {
    name: getEnvVar('VITE_APP_NAME', 'Team Task Manager'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  },

  // Session Configuration
  session: {
    cookieName: getEnvVar('VITE_SESSION_COOKIE_NAME', 'sessionId'),
  },

  // Feature Flags
  features: {
    darkMode: parseBoolean(getEnvVar('VITE_ENABLE_DARK_MODE', 'true')),
    dueDateReminders: parseBoolean(getEnvVar('VITE_ENABLE_DUE_DATE_REMINDERS', 'true')),
  },

  // Debug Mode
  debugMode: parseBoolean(getEnvVar('VITE_DEBUG_MODE', 'false')),
}

// Log configuration in debug mode
if (config.debugMode) {
  console.log('App Configuration:', config)
}

// Validate required configurations
if (!config.api.baseURL) {
  throw new Error('VITE_API_BASE_URL is required but not set')
}

export default config