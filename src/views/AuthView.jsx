import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth.store'
import Panel from '../layouts/Panel'
import Input from '../components/primitives/Input'
import Button from '../components/primitives/Button'

export default function AuthView() {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, register } = useAuth()

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
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
        })
      } else {
        // Validation
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
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-content font-bold text-3xl mb-4">
            T
          </div>
          <h1 className="text-3xl font-bold mb-2">Team Task Manager</h1>
          <p className="text-base-content/60">
            {mode === 'login' 
              ? 'Sign in to manage your team tasks' 
              : 'Create an account to get started'}
          </p>
        </div>

        <Panel className="overlay-enter">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register-only fields */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
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
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Toggle mode */}
            <div className="text-center text-sm">
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
        <p className="text-center text-xs text-base-content/40 mt-8">
          Full Stack Development Internship Assessment
        </p>
      </div>
    </div>
  )
}