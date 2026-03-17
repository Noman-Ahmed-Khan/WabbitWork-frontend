import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inbox, Filter } from 'lucide-react'
import useInvitationStore from '../../stores/invitationStore'
import InvitationCard from './InvitationCard'
import Spinner from '../primitives/Spinner'
import Select from '../primitives/Select'

/**
 * List of received invitations
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
    { value: '', label: 'All Invitations' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
  ]

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter size={16} className="text-base-content/50" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          className="select-sm w-40"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : receivedInvitations.length === 0 ? (
        <div className="text-center py-12">
          <Inbox size={48} className="mx-auto mb-3 text-base-content/20" />
          <p className="text-base-content/60">
            {statusFilter 
              ? `No ${statusFilter} invitations`
              : 'No invitations received'}
          </p>
        </div>
      ) : (
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {receivedInvitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                type="received"
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}