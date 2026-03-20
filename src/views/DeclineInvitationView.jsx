import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { XCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import useAuthStore from '../stores/authStore'
import useInvitationStore from '../stores/invitationStore'
import Panel from '../layouts/Panel'
import Button from '../components/primitives/Button'
import Spinner from '../components/primitives/Spinner'
import config from '../config/env'

/**
 * Handle declining an invitation from an email link
 */
export default function DeclineInvitationView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { id: paramId } = useParams()
  
  // Can be in query string as ?token=... or ?id=..., or in path as /:id
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

      // If user is not authenticated, they need to log in first
      if (!isAuthenticated) {
        setError('Please sign in to decline this invitation.')
        setProcessing(false)
        return
      }

      try {
        await declineInvitation(invitationId)
        setSuccess(true)
        // Redirect to confirmation page after 1.5 seconds
        setTimeout(() => {
          navigate('/invitations/confirmation?status=declined')
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
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-3">
        <div className="text-center">
          <Spinner />
          <p className="text-sm text-base-content/60 mt-3">Processing invitation...</p>
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

        <Panel className="text-center overflow-hidden">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
            >
              <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-6 relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="absolute inset-0 bg-warning/20 rounded-full animate-ping opacity-20"
                />
                <XCircle size={40} className="text-warning relative z-10" />
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Invitation Declined</h2>
              <p className="text-base text-base-content/70 mb-8 leading-relaxed">
                You have declined the team invitation. The team organizer has been notified. Redirecting you...
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Go to Dashboard Now
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-error" />
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Could Not Decline</h2>
              <div className="bg-base-200/50 rounded-lg p-4 mb-8">
                <p className="text-sm text-base-content/80 font-medium">
                  {error}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  variant="primary" 
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : `/auth?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
                  className="w-full"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Sign In to Proceed'}
                </Button>
              </div>
            </motion.div>
          )}
        </Panel>
      </div>
    </div>
  )
}
