import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, AlertCircle } from 'lucide-react'
import useAuthStore from '../stores/authStore'
import Panel from '../layouts/Panel'
import Button from '../components/primitives/Button'
import Spinner from '../components/primitives/Spinner'
import config from '../config/env'

/**
 * Email verification page (from email link)
 */
export default function VerifyEmailView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const type = searchParams.get('type')

  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Use store methods to update state globally
  const { verifyEmailWithToken, setEmailVerified, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('No verification token provided')
        setVerifying(false)
        return
      }

      try {
        // Use the store method - this updates global state
        await verifyEmailWithToken(token, type)
        setSuccess(true)
      } catch (err) {
        setError(err.message || 'Verification failed')
        
        // Even if there's an error, if the message indicates already verified
        if (err.message?.toLowerCase().includes('already verified')) {
          setEmailVerified()
          setSuccess(true)
          setError('')
        }
      } finally {
        setVerifying(false)
      }
    }

    verify()
  }, [token, type, verifyEmailWithToken, setEmailVerified])

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-3">
        <div className="text-center">
          <Spinner />
          <p className="text-sm text-base-content/60 mt-3">Verifying your email...</p>
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

        <Panel className="text-center">
          {success ? (
            <>
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-success" />
              </div>
              <h2 className="text-lg font-bold mb-2">
                {type === 'email-change' ? 'Email Updated!' : 'Email Verified!'}
              </h2>
              <p className="text-sm text-base-content/60 mb-4">
                {type === 'email-change' 
                  ? 'Your email address has been successfully changed.'
                  : 'Your email has been verified. You now have full access to all features.'
                }
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-error" />
              </div>
              <h2 className="text-lg font-bold mb-2">Verification Failed</h2>
              <p className="text-sm text-base-content/60 mb-4">
                {error || 'The verification link is invalid or has expired.'}
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="primary" 
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
                </Button>
              </div>
            </>
          )}
        </Panel>
      </div>
    </div>
  )
}