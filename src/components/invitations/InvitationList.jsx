import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useInvitationStore from '../../stores/invitationStore'
import InvitationCard from './InvitationCard'
import Spinner from '../primitives/Spinner'

/**
 * List of received invitations - Brutalist Editorial Design
 * Bento grid layout matching the invitations design reference
 */
export default function InvitationList() {
  const [statusFilter, setStatusFilter] = useState('')
  
  const { 
    receivedInvitations, 
    loading, 
    fetchReceived 
  } = useInvitationStore()

  useEffect(() => {
    fetchReceived(statusFilter || undefined)
  }, [fetchReceived, statusFilter])

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
  ]

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-on-surface-variant text-sm">filter_list</span>
        <div className="flex gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1 text-[10px] font-headline font-bold uppercase tracking-widest transition-all ${
                statusFilter === opt.value
                  ? 'bg-black text-white'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-black hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invitation Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : receivedInvitations.length === 0 ? (
        <div className="text-center py-20">
          <div className="font-headline font-black text-6xl leading-[0.9] text-on-surface-variant/20 italic select-none mb-8">
            NO<br />INVITES<br />YET
          </div>
          <p className="text-on-surface-variant text-sm font-medium">
            {statusFilter 
              ? `No ${statusFilter} invitations found`
              : 'Your inbox is empty. The void awaits.'}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {receivedInvitations.map((invitation, index) => (
              <div
                key={invitation.id}
                className={
                  index === 0 
                    ? 'md:col-span-8' 
                    : index === 1 
                      ? 'md:col-span-4'
                      : index % 3 === 0 
                        ? 'md:col-span-8' 
                        : 'md:col-span-4'
                }
              >
                <InvitationCard
                  invitation={invitation}
                  type="received"
                />
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}