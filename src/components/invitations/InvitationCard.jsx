import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useInvitationStore from '../../stores/invitationStore'
import { formatDate } from '../../utils/formatDate'

/**
 * Invitation Card - Brutalist Editorial Bento Design
 * Matches the invitations design reference with tonal carving,
 * oversized typography, and editorial layout
 */

const statusConfig = {
  pending: { bg: 'bg-tertiary-container/20', text: 'text-tertiary', label: 'PENDING', dotColor: 'bg-tertiary' },
  accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'ACCEPTED', dotColor: 'bg-green-500' },
  declined: { bg: 'bg-red-100', text: 'text-red-700', label: 'DECLINED', dotColor: 'bg-red-500' },
  cancelled: { bg: 'bg-stone-100', text: 'text-stone-500', label: 'CANCELLED', dotColor: 'bg-stone-400' },
  expired: { bg: 'bg-stone-100', text: 'text-stone-500', label: 'EXPIRED', dotColor: 'bg-stone-400' },
}

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
  const statusKey = isExpired && isPending ? 'expired' : invitation.status
  const status = statusConfig[statusKey] || statusConfig.pending

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-[#E7E6E6] p-6 md:p-8 rounded-xl shadow-sm group hover:scale-[1.01] transition-all duration-300 ${
        invitation.status === 'declined' ? 'opacity-60' : ''
      } ${isPending && !isExpired ? 'border-l-4 border-tertiary' : ''}`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Inviter Avatar Placeholder */}
          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
            <span className="material-symbols-outlined text-on-surface-variant">
              {type === 'received' ? 'person' : 'send'}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-headline font-black text-xl uppercase tracking-tighter truncate">
              {invitation.team_name}
            </h3>
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-0.5">
              {type === 'received' ? (
                <>
                  Invited by{' '}
                  <span className="text-black">
                    {invitation.inviter_first_name} {invitation.inviter_last_name}
                  </span>
                </>
              ) : (
                <>
                  Sent to{' '}
                  <span className="text-black">{invitation.invited_email}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`${status.bg} ${status.text} px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded`}>
          {status.label}
        </span>
      </div>

      {/* Role & Message */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">shield</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant capitalize">
            Role: {invitation.role}
          </span>
        </div>
        {invitation.message && (
          <p className="text-sm font-body text-on-surface-variant leading-relaxed mt-3">
            "{invitation.message}"
          </p>
        )}
      </div>

      {/* Footer: Time + Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-300/50">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
          {isPending 
            ? `Expires ${formatDate(invitation.expires_at)}`
            : formatDate(invitation.responded_at || invitation.created_at)
          }
        </span>

        {/* Received Pending Actions */}
        {type === 'received' && isPending && !isExpired && (
          <div className="flex gap-2">
            <button
              onClick={handleDecline}
              disabled={loading}
              className="px-4 py-2 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-error/10 active:scale-95 transition-all disabled:opacity-50"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={loading}
              className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              Accept
            </button>
          </div>
        )}

        {/* Sent Pending Actions */}
        {type === 'sent' && isPending && !isExpired && (
          <div className="flex gap-2">
            <button
              onClick={handleResend}
              disabled={loading}
              className="px-4 py-2 bg-transparent text-[10px] font-black uppercase tracking-widest underline hover:text-tertiary transition-colors disabled:opacity-50"
            >
              Resend
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 border border-stone-400 text-[10px] font-black uppercase tracking-widest hover:border-black transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
