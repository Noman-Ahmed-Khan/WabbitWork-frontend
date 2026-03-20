import { useEffect } from 'react'
import useNotificationStore from '../stores/notificationStore'
import useInvitationStore from '../stores/invitationStore'

/**
 * Central notification and invitation polling hook
 * Prevents duplicate polling and ensures coordinated refresh
 * 
 * - Polls unread notifications every 30s
 * - Polls pending invitations every 60s
 * - Pauses polling when tab is not visible
 * 
 * @returns {void}
 */
export default function useNotificationPoller() {
  const { fetchUnreadCount } = useNotificationStore()
  const { fetchPendingCount } = useInvitationStore()

  useEffect(() => {
    // Immediately fetch on mount
    fetchUnreadCount()
    fetchPendingCount()

    // Set up intervals
    const notificationInterval = setInterval(fetchUnreadCount, 30000) // 30 seconds
    const invitationInterval = setInterval(fetchPendingCount, 60000) // 60 seconds

    // Handle tab visibility changes (pause polling when not visible)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - clear intervals
        clearInterval(notificationInterval)
        clearInterval(invitationInterval)
      } else {
        // Tab is visible - restart polling
        fetchUnreadCount()
        fetchPendingCount()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      clearInterval(notificationInterval)
      clearInterval(invitationInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchUnreadCount, fetchPendingCount])
}
