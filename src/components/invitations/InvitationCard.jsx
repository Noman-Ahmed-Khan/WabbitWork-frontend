import { useState } from 'react'
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
      // Success message can be shown via toast
    } catch (error) {
      alert(error.message || 'Failed to accept invitation')
    } finally {
      setLoading(false)
    }
  }

  const handleDecline = async () => {
    if (confirm('Are you sure you want to decline this invitation?')) {
      try {
        setLoading(true)
        await declineInvitation(invitation.id)
      } catch (error) {
        alert(error.message || 'Failed to decline invitation')
      } finally {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1">
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
          <div className="bg-base-200 rounded p-3 mb-3">
            <p className="text-sm italic text-base-content/70">
              "{invitation.message}"
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-base-300">
          <div className="flex items-center gap-1 text-xs text-base-content/50">
            <Clock size={12} />
            <span>
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
