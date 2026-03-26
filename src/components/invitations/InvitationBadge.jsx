import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useInvitationStore from '../../stores/invitationStore'

/**
 * Invitation badge with pending count - Brutalist Editorial Design
 */
export default function InvitationBadge({ className = '' }) {
  const navigate = useNavigate()
  const { pendingCount } = useInvitationStore()

  return (
    <motion.button
      onClick={() => navigate('/invitations')}
      className={`relative p-2 rounded-lg transition-colors duration-200 text-on-surface-variant hover:bg-surface-container-highest hover:text-black ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Invitations"
    >
      <span className="material-symbols-outlined">mail</span>
      
      {/* Pending badge */}
      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-tertiary text-white text-[10px] font-black"
          >
            {pendingCount > 9 ? '9+' : pendingCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}