import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import Spinner from '../components/primitives/Spinner'
import config from '../config/env'

/**
 * Email verification page - Brutalist Editorial Design
 * Accessed from email verification link
 */
export default function VerifyEmailView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const type = searchParams.get('type')

  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { verifyEmailWithToken, setEmailVerified, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('No verification token provided')
        setVerifying(false)
        return
      }

      try {
        await verifyEmailWithToken(token, type)
        setSuccess(true)
      } catch (err) {
        setError(err.message || 'Verification failed')
        
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

  if (verifying) {
    return (
      <div className="brutalist-grain-bg min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <Spinner />
          <p className="text-sm text-on-surface-variant mt-4 font-label uppercase tracking-widest">Verifying your email...</p>
        </div>
      </div>
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

        <div className="brutalist-card p-8 md:p-12 text-center">
          {success ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl text-green-700" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3">
                {type === 'email-change' ? 'Email Updated!' : 'Email Verified!'}
              </h2>
              <p className="text-sm text-on-surface-variant mb-8 font-body leading-relaxed">
                {type === 'email-change' 
                  ? 'Your email address has been successfully changed.'
                  : 'Your email has been verified. You now have full access to all features.'
                }
              </p>
              <button 
                type="button"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
                className="w-full bg-on-tertiary-fixed text-white py-4 font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl text-tertiary">warning</span>
              </div>
              <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3">
                Verification Failed
              </h2>
              <p className="text-sm text-on-surface-variant mb-8 font-body leading-relaxed">
                {error || 'The verification link is invalid or has expired.'}
              </p>
              <button 
                type="button"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
                className="w-full bg-on-tertiary-fixed text-white py-4 font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
