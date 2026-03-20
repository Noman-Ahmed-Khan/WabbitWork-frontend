import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Settings, Trash2, BellOff } from 'lucide-react'
import useNotificationStore from '../../stores/notificationStore'
import NotificationItem from './NotificationItem'
import Spinner from '../primitives/Spinner'
import Button from '../primitives/Button'

/**
 * Notification dropdown panel
 */
export default function NotificationDropdown({ onClose }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all') // all, unread
  
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
    deleteAll,
  } = useNotificationStore()

  // Fetch notifications on mount and when filter changes
  useEffect(() => {
    const params = {}
    
    if (filter === 'unread') {
      params.is_read = false
      params.limit = 100 // Higher limit for unread filter
    } else {
      // For all notifications, use smaller limit for performance
      params.limit = 20
    }
    
    fetchNotifications(params)
  }, [fetchNotifications, filter])

  useEffect(() => {
    if (
      filter === 'unread' &&
      !loading &&
      notifications.length === 0 &&
      unreadCount > 0
    ) {
      // Retry with backend's max limit to catch all unread
      const retryParams = { is_read: false, limit: 100 }
      fetchNotifications(retryParams).catch((error) => {
        console.warn('Failed to fetch unread notifications:', error)
        // Silently fail - will still show "Fetching unread notifications..." message
      })
    }
  }, [filter, loading, notifications.length, unreadCount, fetchNotifications])

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDeleteAll = async () => {
    if (confirm('Delete all notifications? This cannot be undone.')) {
      try {
        await deleteAll()
      } catch (error) {
        console.error('Failed to delete all:', error)
      }
    }
  }

  const handleViewAll = () => {
    navigate('/notifications')
    onClose()
  }

  const handleSettings = () => {
    navigate('/profile?tab=notifications')
    onClose()
  }

  // No client-side filtering - API already filters
  const filteredNotifications = notifications

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-1.5rem)] bg-base-100 rounded-lg shadow-xl border border-base-300 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-3 border-b border-base-300 bg-base-200/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSettings}
              className="p-1.5 rounded hover:bg-base-300 transition-colors"
              title="Notification settings"
            >
              <Settings size={16} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="p-1.5 rounded hover:bg-base-300 transition-colors"
                title="Mark all as read"
              >
                <Check size={16} />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="p-1.5 rounded hover:bg-error/20 hover:text-error transition-colors"
                title="Delete all"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-content'
                : 'bg-base-300 hover:bg-base-300/70'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filter === 'unread'
                ? 'bg-primary text-primary-content'
                : 'bg-base-300 hover:bg-base-300/70'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="sm" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 px-4">
            <BellOff size={32} className="mx-auto mb-2 text-base-content/30" />
            <p className="text-sm text-base-content/60">
              {filter === 'unread' 
                ? unreadCount > 0
                  ? 'Fetching unread notifications...'
                  : 'No unread notifications'
                : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.slice(0, 10).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2 border-t border-base-300 bg-base-200/30">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={handleViewAll}
          >
            View All Notifications
          </Button>
        </div>
      )}
    </motion.div>
  )
}