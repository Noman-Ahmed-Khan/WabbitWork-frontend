import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import authApi from '../api/auth'
import Spinner from '../components/primitives/Spinner'
import config from '../config/env'

/**
 * Password reset page - Brutalist Editorial Design
 * Accessed from email reset link
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

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'Uppercase letter' },
    { met: /[a-z]/.test(password), text: 'Lowercase letter' },
    { met: /[0-9]/.test(password), text: 'At least one number' },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.met)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

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

  const StateCard = ({
    icon,
    iconColor,
    bgColor,
    title,
    message,
    buttonText,
    onButtonClick,
  }) => (
    <div className="brutalist-grain-bg min-h-screen flex items-center justify-center p-6 font-body text-on-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-headline font-black text-2xl tracking-tighter uppercase text-on-tertiary-fixed">
            {config.app.name}
          </span>
        </div>
        <div className="glass-panel rounded-xl p-8 md:p-12 shadow-[40px_0_40px_-20px_rgba(0,0,0,0.06)] text-center">
          <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center mx-auto mb-6`}>
            <span className={`material-symbols-outlined text-3xl ${iconColor}`}>{icon}</span>
          </div>
          <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3">
            {title}
          </h2>
          <p className="text-sm text-on-surface-variant mb-8 font-body leading-relaxed">
            {message}
          </p>
          <button
            onClick={onButtonClick}
            className="w-full bg-on-tertiary-fixed text-white py-4 font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )

  if (validating) {
    return (
      <div className="brutalist-grain-bg min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <Spinner />
          <p className="text-sm text-on-surface-variant mt-4 font-label uppercase tracking-widest">
            Validating reset link...
          </p>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <StateCard
        icon="warning"
        iconColor="text-tertiary"
        bgColor="bg-tertiary/10"
        title="Invalid Reset Link"
        message="No reset token provided. Please request a new password reset."
        buttonText="Back to Sign In"
        onButtonClick={() => navigate('/auth')}
      />
    )
  }

  if (!tokenValid && !validating) {
    return (
      <StateCard
        icon="timer_off"
        iconColor="text-tertiary"
        bgColor="bg-tertiary/10"
        title="Link Expired"
        message="This password reset link has expired or is invalid. Please request a new one."
        buttonText="Back to Sign In"
        onButtonClick={() => navigate('/auth')}
      />
    )
  }

  if (success) {
    return (
      <StateCard
        icon="check_circle"
        iconColor="text-green-700"
        bgColor="bg-green-100"
        title="Password Reset!"
        message="Your password has been successfully reset. You can now sign in with your new password."
        buttonText="Sign In"
        onButtonClick={() => navigate('/auth')}
      />
    )
  }

  return (
    <div className="brutalist-grain-bg min-h-screen flex items-center justify-center p-6 font-body text-on-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-headline font-black text-2xl tracking-tighter uppercase text-on-tertiary-fixed">
            {config.app.name}
          </span>
          <span className="block font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant opacity-60">
            Brutalist Edition
          </span>
        </div>

        <div className="glass-panel rounded-xl p-8 md:p-12 shadow-[40px_0_40px_-20px_rgba(0,0,0,0.06)]">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
            </div>
            <h2 className="font-headline font-black text-2xl uppercase tracking-tighter">
              Reset Password
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="relative">
              <label className="block font-headline font-bold text-xs uppercase tracking-widest text-on-surface ml-1 mb-2">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl font-body text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-on-tertiary-fixed transition-all input-inset"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Password requirements */}
            <div className="space-y-1.5 pl-1">
              {passwordRequirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                    req.met ? 'text-green-700 font-medium' : 'text-on-surface-variant/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {req.met ? 'check_circle' : 'circle'}
                  </span>
                  <span>{req.text}</span>
                </div>
              ))}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-headline font-bold text-xs uppercase tracking-widest text-on-surface ml-1 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl font-body text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-on-tertiary-fixed transition-all input-inset"
                required
              />
              {confirmPassword && (
                <p className={`text-xs mt-2 font-bold ${passwordsMatch ? 'text-green-700' : 'text-tertiary'}`}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-tertiary/10 text-tertiary p-4 rounded-xl font-body text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isPasswordValid || !passwordsMatch}
              className="w-full h-16 bg-on-tertiary-fixed text-surface rounded-xl font-headline font-bold text-lg tracking-tight flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 primary-btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    lock
                  </span>
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
