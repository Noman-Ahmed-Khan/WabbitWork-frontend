import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useNotificationStore from '../../stores/notificationStore'
import NotificationItem from './NotificationItem'
import Spinner from '../primitives/Spinner'

/**
 * Notification dropdown panel - Brutalist Editorial Design
 * Glass panel dropdown with editorial styling
 */
export default function NotificationDropdown({ onClose }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
    deleteAll,
  } = useNotificationStore()

  useEffect(() => {
    const params = {}
    if (filter === 'unread') {
      params.is_read = false
      params.limit = 100
    } else {
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
      const retryParams = { is_read: false, limit: 100 }
      fetchNotifications(retryParams).catch((error) => {
        console.warn('Failed to fetch unread notifications:', error)
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

  const filteredNotifications = notifications

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-1.5rem)] bg-surface-container-lowest rounded-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 bg-surface-container-low/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-headline font-black text-sm uppercase tracking-widest">Notifications</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSettings}
              className="p-1.5 rounded-lg hover:bg-surface-container-highest transition-colors"
              title="Notification settings"
            >
              <span className="material-symbols-outlined text-sm">settings</span>
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="p-1.5 rounded-lg hover:bg-surface-container-highest transition-colors"
                title="Mark all as read"
              >
                <span className="material-symbols-outlined text-sm">done_all</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="p-1.5 rounded-lg hover:bg-tertiary/10 hover:text-tertiary transition-colors"
                title="Delete all"
              >
                <span className="material-symbols-outlined text-sm">delete_outline</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`text-[10px] px-3 py-1 font-headline font-bold uppercase tracking-widest transition-all ${
              filter === 'all'
                ? 'bg-black text-white'
                : 'bg-surface-container-highest text-on-surface-variant hover:bg-black hover:text-white'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`text-[10px] px-3 py-1 font-headline font-bold uppercase tracking-widest transition-all ${
              filter === 'unread'
                ? 'bg-black text-white'
                : 'bg-surface-container-highest text-on-surface-variant hover:bg-black hover:text-white'
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
          <div className="text-center py-10 px-4">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2 block">
              notifications_off
            </span>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">
              {filter === 'unread' 
                ? unreadCount > 0
                  ? 'Fetching unread...'
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
        <div className="p-3 border-t border-stone-100">
          <button
            onClick={handleViewAll}
            className="w-full py-2 text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant hover:text-black hover:bg-surface-container-highest transition-all rounded-lg"
          >
            View All Notifications
          </button>
        </div>
      )}
    </motion.div>
  )
}