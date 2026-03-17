import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Filter } from 'lucide-react'
import useInvitationStore from '../../stores/invitationStore'
import useTeamStore from '../../stores/teamStore'
import InvitationCard from './InvitationCard'
import Spinner from '../primitives/Spinner'
import Select from '../primitives/Select'

/**
 * List of sent invitations
 */
export default function SentInvitationList() {
  const [statusFilter, setStatusFilter] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  
  const { 
    sentInvitations, 
    loading, 
    fetchSent 
  } = useInvitationStore()

  const { teams, fetchTeams } = useTeamStore()

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  useEffect(() => {
    const filters = {}
    if (statusFilter) filters.status = statusFilter
    if (teamFilter) filters.team_id = teamFilter
    
    fetchSent(filters)
  }, [fetchSent, statusFilter, teamFilter])

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const teamOptions = [
    { value: '', label: 'All Teams' },
    ...teams.map(t => ({ value: t.id, label: t.name })),
  ]

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter size={16} className="text-base-content/50" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          className="select-sm w-36"
        />
        <Select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          options={teamOptions}
          className="select-sm w-44"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : sentInvitations.length === 0 ? (
        <div className="text-center py-12">
          <Send size={48} className="mx-auto mb-3 text-base-content/20" />
          <p className="text-base-content/60">
            No invitations sent
          </p>
        </div>
      ) : (
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {sentInvitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                type="sent"
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}