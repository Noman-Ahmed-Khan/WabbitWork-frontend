import { useState } from 'react'
import { Mail, RefreshCw, CheckCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../stores/authStore'
import Button from '../primitives/Button'

/**
 * Banner prompting user to verify email
 */
export default function EmailVerificationBanner() {
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [code, setCode] = useState('')
  const [resending, setResending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [dismissed, setDismissed] = useState(false)

  const { 
    user, 
    emailVerificationRequired, 
    verifyEmailWithCode, 
    resendVerification 
  } = useAuthStore()

  // Don't show if not required, no user, or dismissed
  if (!emailVerificationRequired || !user || dismissed) return null

  const handleResend = async () => {
    try {
      setResending(true)
      setMessage({ type: '', text: '' })
      await resendVerification()
      setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to send email' })
    } finally {
      setResending(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (code.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a 6-digit code' })
      return
    }

    try {
      setVerifying(true)
      setMessage({ type: '', text: '' })
      
      // This updates the store - banner will automatically hide
      await verifyEmailWithCode(code)
      
      setMessage({ type: 'success', text: 'Email verified successfully!' })
      
      // Banner will hide automatically because emailVerificationRequired becomes false
      // But let's add a small delay for the success message to be visible
      setTimeout(() => {
        setDismissed(true)
      }, 1500)
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Invalid verification code' })
      setCode('')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-warning/10 border-b border-warning/30"
    >
      <div className="container mx-auto px-3 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Mail className="text-warning flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium">
                Please verify your email address
              </p>
              <p className="text-xs text-base-content/60">
                We sent a verification email to <strong>{user.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              loading={resending}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw size={14} />
              Resend
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className="flex-1 sm:flex-none"
            >
              {showCodeInput ? 'Hide' : 'Enter Code'}
            </Button>
          </div>
        </div>

        {/* Code input */}
        <AnimatePresence>
          {showCodeInput && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleVerify}
              className="mt-3 pt-3 border-t border-warning/20"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    setMessage({ type: '', text: '' })
                  }}
                  placeholder="Enter 6-digit code"
                  className="input input-bordered input-sm flex-1 font-mono tracking-widest text-center text-lg"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={verifying}
                  disabled={code.length !== 6}
                >
                  <CheckCircle size={14} />
                  Verify
                </Button>
              </div>
              
              {message.text && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs mt-2 ${
                    message.type === 'success' ? 'text-success' : 'text-error'
                  }`}
                >
                  {message.text}
                </motion.p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}