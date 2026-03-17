import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff, Check, Circle } from 'lucide-react'
import authApi from '../api/auth'
import Panel from '../layouts/Panel'
import Input from '../components/primitives/Input'
import Button from '../components/primitives/Button'
import Spinner from '../components/primitives/Spinner'
import config from '../config/env'

/**
 * Password reset page (from email link)
 */
export default function ResetPasswordView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Password requirements
  const passwordRequirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "Uppercase letter" },
    { met: /[a-z]/.test(password), text: "Lowercase letter" },
    { met: /[0-9]/.test(password), text: "At least one number" },
  ]

  const isPasswordValid = passwordRequirements.every(req => req.met)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidating(false)
        return
      }

      try {
        await authApi.validateResetToken(token)
        setTokenValid(true)
      } catch (err) {
        setTokenValid(false)
        setError(err.message || 'Invalid or expired reset link')
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isPasswordValid) {
      setError('Password does not meet requirements')
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError('')
      await authApi.resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-3">
        <div className="text-center">
          <Spinner />
          <p className="text-sm text-base-content/60 mt-3">Validating reset link...</p>
        </div>
      </div>
    )
  }

  // No token provided
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-3">
        <div className="w-full max-w-md">
          <Panel className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-error" />
            <h2 className="text-lg font-bold mb-2">Invalid Reset Link</h2>
            <p className="text-sm text-base-content/60 mb-4">
              No reset token provided. Please request a new password reset.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Back to Sign In
            </Button>
          </Panel>
        </div>
      </div>
    )
  }

  // Invalid/expired token
  if (!tokenValid && !validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-3">
        <div className="w-full max-w-md">
          <Panel className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-error" />
            <h2 className="text-lg font-bold mb-2">Link Expired</h2>
            <p className="text-sm text-base-content/60 mb-4">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Back to Sign In
            </Button>
          </Panel>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-3">
        <div className="w-full max-w-md">
          <Panel className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-success" />
            </div>
            <h2 className="text-lg font-bold mb-2">Password Reset!</h2>
            <p className="text-sm text-base-content/60 mb-4">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Button variant="primary" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </Panel>
        </div>
      </div>
    )
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
        </div>

        <Panel>
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Lock size={24} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold">Reset Your Password</h2>
            <p className="text-sm text-base-content/60">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-base-content/50 hover:text-base-content"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password requirements */}
            <div className="space-y-1 pl-1">
              {passwordRequirements.map((req, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                    req.met ? 'text-green-600 font-medium' : 'text-base-content/50'
                  }`}
                >
                  {req.met ? (
                    <Check size={12} className="stroke-2" />
                  ) : (
                    <Circle size={8} fill="currentColor" className="opacity-40" />
                  )}
                  <span>{req.text}</span>
                </div>
              ))}
            </div>

            {/* Confirm Password */}
            <div>
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              {confirmPassword && (
                <p className={`text-xs mt-1 ${passwordsMatch ? 'text-success' : 'text-error'}`}>
                  {passwordsMatch ? '✓ Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error text-sm py-2">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={!isPasswordValid || !passwordsMatch}
            >
              <Lock size={16} />
              Reset Password
            </Button>
          </form>
        </Panel>
      </div>
    </div>
  )
}