import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import useAuthStore from '../stores/authStore'
import Panel from '../layouts/Panel'
import Input from '../components/primitives/Input'
import Button from '../components/primitives/Button'
import config from '../config/env'

/**
 * Authentication view
 * Handles login and registration
 */
export default function AuthView() {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()
  
  const { login, register, loading, error, clearError } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
        })
      } else {
        // Client-side validation
        if (formData.password.length < 8) {
          throw new Error('Password must be at least 8 characters')
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          throw new Error('Password must contain uppercase, lowercase, and number')
        }

        await register({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
      }
      navigate('/dashboard')
    } catch (err) {
      // Error is already set in store
      console.error('Auth error:', err)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    clearError()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-3">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-content font-bold text-2xl mb-3">
            T
          </div>
          <h1 className="text-2xl font-bold mb-1">{config.app.name}</h1>
          <p className="text-sm text-base-content/60">
            {mode === 'login' 
              ? 'Sign in to manage your team tasks' 
              : 'Create an account to get started'}
          </p>
        </div>

        <Panel className="overlay-enter">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Register-only fields */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            )}

            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={mode === 'register' ? 'Min. 8 characters' : '••••••••'}
              required
            />

            {mode === 'register' && (
              <div className="text-xs text-base-content/60 space-y-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 8 characters</li>
                  <li>Uppercase and lowercase letters</li>
                  <li>At least one number</li>
                </ul>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="alert alert-error">
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              {mode === 'login' ? (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </Button>

            {/* Toggle mode */}
            <div className="text-center text-xs">
              <span className="text-base-content/60">
                {mode === 'login' 
                  ? "Don't have an account? " 
                  : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className="link link-primary font-medium"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>
        </Panel>

        {/* Footer */}
        <p className="text-center text-xs text-base-content/40 mt-4">
          {config.app.name} v{config.app.version}
        </p>
      </div>
    </div>
  )
}