import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useInvitationStore from '../../stores/invitationStore'
import useTeamStore from '../../stores/teamStore'
import useRouteSearch from '../../hooks/useRouteSearch'
import InvitationOverlay from '../overlays/InvitationOverlay'
import InvitationCard from './InvitationCard'
import Spinner from '../primitives/Spinner'
import { filterBySearch } from '../../utils/search'

/**
 * List of sent invitations - Brutalist Editorial Design
 * Matches the brutalist bento card grid pattern
 */
export default function SentInvitationList() {
  const [statusFilter, setStatusFilter] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const { searchQuery, clearSearchQuery, hasSearchQuery } = useRouteSearch()
  
  const { 
    sentInvitations, 
    loading, 
    fetchSent 
  } = useInvitationStore()

  const { teams, loading: teamsLoading, loadTeams } = useTeamStore()

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  useEffect(() => {
    if (!teamsLoading) {
      const filters = {}
      if (statusFilter) filters.status = statusFilter
      if (teamFilter) filters.team_id = teamFilter
      
      fetchSent(filters)
    }
  }, [fetchSent, statusFilter, teamFilter, teamsLoading])

  const filteredInvitations = filterBySearch(sentInvitations, searchQuery, (invitation) => [
    invitation.team_name,
    invitation.invited_email,
    invitation.status,
    invitation.role,
    invitation.message,
  ])

  const handleInviteSuccess = async () => {
    try {
      const filters = {}
      if (statusFilter) filters.status = statusFilter
      if (teamFilter) filters.team_id = teamFilter

      await fetchSent(filters)
    } catch (error) {
      console.error('Failed to refresh sent invitations:', error)
    }
  }

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  if (teamsLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
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

        <div className="flex flex-wrap items-center gap-3">
          {/* Team Filter */}
          {teams.length > 0 && (
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="bg-surface-container-highest border-none rounded-lg px-4 py-1.5 font-headline text-[10px] uppercase tracking-widest focus:ring-2 focus:ring-black"
            >
              <option value="">All Teams</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            disabled={teams.length === 0}
            title={teams.length === 0 ? 'Create a team first' : 'Invite a new member'}
            className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] font-headline font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 ${
              teams.length === 0
                ? 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed'
                : 'bg-black text-white hover:shadow-brutalist active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Invite Member
          </button>
        </div>
      </div>

      {/* Sent Invitation Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : sentInvitations.length === 0 ? (
        <div className="text-center py-20">
          <div className="font-headline font-black text-6xl leading-[0.9] text-on-surface-variant/20 italic select-none mb-8" aria-hidden="true">
            NOTHING<br />SENT<br />YET
          </div>
          <p className="text-on-surface-variant text-sm font-medium">
            {hasSearchQuery
              ? `No invitations match "${searchQuery.trim()}".`
              : 'No invitations dispatched. Send one from a team page.'}
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
                  type="sent"
                />
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {isInviteOpen && (
        <InvitationOverlay
          teams={teams}
          defaultTeamId={teamFilter}
          onClose={() => setIsInviteOpen(false)}
          onSuccess={handleInviteSuccess}
        />
      )}
    </div>
  )
}
