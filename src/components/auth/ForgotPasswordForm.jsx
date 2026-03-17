import { useState } from 'react'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import authApi from '../../api/auth'
import Panel from '../../layouts/Panel'
import Input from '../primitives/Input'
import Button from '../primitives/Button'

/**
 * Forgot password form
 */
export default function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')
      await authApi.forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      // Always show success for security (don't reveal if email exists)
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Panel>
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h2 className="text-lg font-bold mb-2">Check Your Email</h2>
          <p className="text-sm text-base-content/60 mb-4">
            If an account exists for <strong>{email}</strong>, we've sent password reset instructions.
          </p>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} />
            Back to Sign In
          </Button>
        </div>
      </Panel>
    )
  }

  return (
    <Panel>
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-base-content/60 hover:text-base-content transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
          <Mail size={24} className="text-primary" />
        </div>
        <h2 className="text-lg font-bold">Forgot Password?</h2>
        <p className="text-sm text-base-content/60">
          Enter your email and we'll send you reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
        />

        {error && (
          <div className="alert alert-error text-sm py-2">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          <Send size={16} />
          Send Reset Link
        </Button>
      </form>
    </Panel>
  )
}
