import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../stores/authStore'
import useInvitationStore from '../stores/invitationStore'
import Spinner from '../components/primitives/Spinner'
import config from '../config/env'

/**
 * Handle declining an invitation from an email link - Brutalist Editorial Design
 */
export default function DeclineInvitationView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { id: paramId } = useParams()
  
  const invitationId = paramId || searchParams.get('token') || searchParams.get('id')

  const [processing, setProcessing] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { isAuthenticated } = useAuthStore()
  const { declineInvitation } = useInvitationStore()

  useEffect(() => {
    const processDecline = async () => {
      if (!invitationId) {
        setError('No invitation ID provided in the link.')
        setProcessing(false)
        return
      }

      try {
        if (isAuthenticated) {
          await declineInvitation(invitationId)
        } else {
          const { declineInvitationPublic } = useInvitationStore.getState()
          await declineInvitationPublic(invitationId)
        }
        setSuccess(true)
        setTimeout(() => {
          navigate(isAuthenticated ? '/invitations/confirmation?status=declined' : '/auth?mode=login&declined=true')
        }, 1500)
      } catch (err) {
        setError(err.message || 'Failed to decline invitation. It may be invalid or expired.')
      } finally {
        setProcessing(false)
      }
    }

    processDecline()
  }, [invitationId, isAuthenticated, declineInvitation, navigate])

  if (processing) {
    return (
      <div className="brutalist-grain-bg min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <Spinner />
          <p className="text-sm text-on-surface-variant mt-4 font-label uppercase tracking-widest">
            Processing invitation...
          </p>
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
        </div>

        <div className="glass-panel rounded-xl p-8 md:p-12 shadow-[40px_0_40px_-20px_rgba(0,0,0,0.06)] text-center overflow-hidden">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
            >
              <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6 relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="absolute inset-0 bg-stone-100 rounded-full animate-ping opacity-20"
                />
                <span className="material-symbols-outlined text-4xl text-stone-600 relative z-10">cancel</span>
              </div>
              <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3">
                Invitation Declined
              </h2>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                You have declined the team invitation. The team organizer has been notified. Redirecting you...
              </p>
              <button 
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full bg-on-tertiary-fixed text-white py-4 font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                Go to Dashboard Now
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 rounded-full bg-tertiary/10 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-tertiary">warning</span>
              </div>
              <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3">
                Could Not Decline
              </h2>
              <div className="bg-surface-container-highest rounded-xl p-4 mb-8">
                <p className="text-sm text-on-surface-variant font-medium">
                  {error}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : `/auth?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
                className="w-full bg-on-tertiary-fixed text-white py-4 font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Sign In to Proceed'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
