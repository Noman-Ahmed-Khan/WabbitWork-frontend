import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useInvitationStore from '../../stores/invitationStore'
import useRouteSearch from '../../hooks/useRouteSearch'
import InvitationCard from './InvitationCard'
import Spinner from '../primitives/Spinner'
import { filterBySearch } from '../../utils/search'

/**
 * List of received invitations - Brutalist Editorial Design
 * Bento grid layout matching the invitations design reference
 */
export default function InvitationList() {
  const [statusFilter, setStatusFilter] = useState('')
  const { searchQuery, clearSearchQuery, hasSearchQuery } = useRouteSearch()
  
  const { 
    receivedInvitations, 
    loading, 
    fetchReceived 
  } = useInvitationStore()

  useEffect(() => {
    fetchReceived(statusFilter || undefined)
  }, [fetchReceived, statusFilter])

  const filteredInvitations = filterBySearch(receivedInvitations, searchQuery, (invitation) => [
    invitation.team_name,
    invitation.inviter_first_name,
    invitation.inviter_last_name,
    invitation.invited_email,
    invitation.role,
    invitation.status,
    invitation.message,
  ])

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
    { value: 'cancelled', label: 'Cancelled' },
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
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              aria-pressed={statusFilter === opt.value}
              className={`px-3 py-1 text-[10px] font-headline font-bold uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 ${
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
          <div className="font-headline font-black text-6xl leading-[0.9] text-on-surface-variant/20 italic select-none mb-8" aria-hidden="true">
            NO<br />INVITES<br />YET
          </div>
          <p className="text-on-surface-variant text-sm font-medium">
            {hasSearchQuery
              ? `No invitations match "${searchQuery.trim()}".`
              : statusFilter 
                ? `No ${statusFilter} invitations found`
                : 'Your inbox is empty. The void awaits.'}
          </p>
          {hasSearchQuery && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearSearchQuery}
              className="mt-6 font-headline text-xs uppercase tracking-widest border-b-2 border-on-surface text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
            >
              Clear Search
            </motion.button>
          )}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredInvitations.length === 0 && hasSearchQuery ? (
              <div className="md:col-span-12 text-center py-20 border border-dashed border-outline-variant/30 bg-surface-container-highest">
                <p className="text-on-surface-variant text-sm font-medium">
                  No invitations match "{searchQuery.trim()}".
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearSearchQuery}
                  className="mt-6 font-headline text-xs uppercase tracking-widest border-b-2 border-on-surface text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                >
                  Clear Search
                </motion.button>
              </div>
            ) : filteredInvitations.map((invitation, index) => (
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
