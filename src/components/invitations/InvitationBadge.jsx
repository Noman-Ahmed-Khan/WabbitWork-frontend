import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useInvitationStore from '../../stores/invitationStore'
import cx from '../../utils/cx'

/**
 * Invitation badge with pending count
 */
export default function InvitationBadge({ className }) {
  const navigate = useNavigate()
  const { pendingCount, fetchPendingCount } = useInvitationStore()

  // Fetch pending count on mount and every 60 seconds
  useEffect(() => {
    fetchPendingCount()
    const interval = setInterval(fetchPendingCount, 60000)
    return () => clearInterval(interval)
  }, [fetchPendingCount])

  return (
    <motion.button
      onClick={() => navigate('/invitations')}
      className={cx(
        'relative p-2 rounded-lg transition-colors duration-200',
        'text-base-content/70 hover:bg-base-200/50 hover:text-base-content',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Invitations"
    >
      <Mail size={20} />
      
      {/* Pending badge */}
      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning text-warning-content text-xs font-bold"
          >
            {pendingCount > 9 ? '9+' : pendingCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}