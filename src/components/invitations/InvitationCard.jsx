import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Mail, Clock, User, Shield } from 'lucide-react'
import useInvitationStore from '../../stores/invitationStore'
import Button from '../primitives/Button'
import Badge from '../primitives/Badge'
import { formatDate } from '../../utils/formatDate'

/**
 * Single invitation card
 */
export default function InvitationCard({ invitation, type = 'received' }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const { 
    acceptInvitation, 
    declineInvitation, 
    cancelInvitation,
    resendInvitation,
  } = useInvitationStore()

  const handleAccept = async () => {
    try {
      setLoading(true)
      await acceptInvitation(invitation.id)
      // Navigate to confirmation page
      navigate('/invitations/confirmation?status=accepted')
    } catch (error) {
      alert(error.message || 'Failed to accept invitation')
      setLoading(false)
    }
  }

  const handleDecline = async () => {
    if (confirm('Are you sure you want to decline this invitation?')) {
      try {
        setLoading(true)
        await declineInvitation(invitation.id)
        // Navigate to confirmation page
        navigate('/invitations/confirmation?status=declined')
      } catch (error) {
        alert(error.message || 'Failed to decline invitation')
        setLoading(false)
      }
    }
  }

  const handleCancel = async () => {
    if (confirm('Cancel this invitation?')) {
      try {
        setLoading(true)
        await cancelInvitation(invitation.id)
      } catch (error) {
        alert(error.message || 'Failed to cancel invitation')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleResend = async () => {
    try {
      setLoading(true)
      await resendInvitation(invitation.id)
      alert('Invitation resent successfully!')
    } catch (error) {
      alert(error.message || 'Failed to resend invitation')
    } finally {
      setLoading(false)
    }
  }

  const isPending = invitation.status === 'pending'
  const isExpired = new Date(invitation.expires_at) < new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="card bg-base-100 border border-base-200 shadow hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden group"
    >
      <div className="card-body p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
              {invitation.team_name}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/60">
              {type === 'received' ? (
                <>
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span>
                      Invited by {invitation.inviter_first_name} {invitation.inviter_last_name}
                    </span>
                  </div>
                  <span>•</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <Mail size={12} />
                    <span>{invitation.invited_email}</span>
                  </div>
                  <span>•</span>
                </>
              )}
              
              <div className="flex items-center gap-1">
                <Shield size={12} />
                <span className="capitalize">{invitation.role}</span>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <Badge
            variant={
              invitation.status === 'accepted' ? 'success' :
              invitation.status === 'declined' ? 'error' :
              invitation.status === 'cancelled' ? 'ghost' :
              isExpired ? 'error' : 'warning'
            }
          >
            {isExpired && isPending ? 'Expired' : invitation.status}
          </Badge>
        </div>

        {/* Personal message */}
        {invitation.message && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-5 relative group/message hover:bg-primary/10 transition-colors duration-300">
            <div className="absolute -top-2.5 left-4 bg-base-100 px-2 text-xs text-primary/70 font-bold tracking-widest uppercase rounded-full border border-primary/10">Message</div>
            <p className="text-sm italic text-base-content/80 leading-relaxed relative z-10 before:content-['“'] before:text-2xl before:text-primary/30 before:mr-1 after:content-['”'] after:text-2xl after:text-primary/30 after:ml-1">
              {invitation.message}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-base-200/60 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-base-content/60 bg-base-200/40 py-1.5 px-3 rounded-lg border border-base-200">
            <Clock size={12} className="text-primary/60" />
            <span className="font-medium">
              {isPending 
                ? `Expires ${formatDate(invitation.expires_at)}`
                : formatDate(invitation.responded_at || invitation.created_at)
              }
            </span>
          </div>

          {/* Actions */}
          {type === 'received' && isPending && !isExpired && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDecline}
                loading={loading}
              >
                <X size={14} />
                Decline
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                loading={loading}
              >
                <Check size={14} />
                Accept
              </Button>
            </div>
          )}

          {type === 'sent' && isPending && !isExpired && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                loading={loading}
              >
                Resend
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                loading={loading}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
