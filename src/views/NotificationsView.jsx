import { useEffect } from 'react'
import { motion } from 'framer-motion'
import useNotificationStore from '../stores/notificationStore'
import Spinner from '../components/primitives/Spinner'

const iconMap = {
  system: 'bolt',
  mention: 'alternate_email',
  task: 'assignment_turned_in',
  team: 'groups',
  project: 'folder_zip',
  security: 'security',
  member: 'person_add',
  default: 'notifications',
}

/**
 * Notifications View - Brutalist Editorial Design
 * Grouped timeline with today/yesterday sections
 */
export default function NotificationsView() {
  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Group notifications by date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayNotifications = notifications.filter(n => {
    const date = new Date(n.created_at)
    return date >= today
  })

  const yesterdayNotifications = notifications.filter(n => {
    const date = new Date(n.created_at)
    return date >= yesterday && date < today
  })

  const olderNotifications = notifications.filter(n => {
    const date = new Date(n.created_at)
    return date < yesterday
  })

  const getIcon = (notification) => {
    const type = notification.type || notification.category || 'default'
    return iconMap[type] || iconMap.default
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const renderNotification = (notification, index, isNew = false) => (
    <motion.div
      key={notification.id}
      className={`group relative flex items-center p-6 bg-surface-container-lowest rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/5 ${
        !notification.is_read ? 'border-l-4 border-tertiary' : 'border-l-4 border-transparent'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Icon */}
      <div className="mr-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          !notification.is_read ? 'bg-surface-container-highest' : 'bg-surface-container-highest grayscale'
        }`}>
          <span className="material-symbols-outlined text-on-surface">
            {getIcon(notification)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1" onClick={() => !notification.is_read && markAsRead(notification.id)}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-headline text-lg font-bold ${notification.is_read ? 'text-on-surface-variant' : ''}`}>
            {notification.title || notification.message?.slice(0, 40) || 'Notification'}
          </span>
          {!notification.is_read && (
            <div className="w-2 h-2 rounded-full bg-tertiary" />
          )}
        </div>
        <p className={`text-sm leading-relaxed max-w-lg ${notification.is_read ? 'text-on-surface-variant/60' : 'text-on-surface-variant'}`}>
          {notification.message || notification.body || ''}
        </p>
        <span className={`text-xs font-label uppercase tracking-widest mt-3 block ${notification.is_read ? 'text-outline/50' : 'text-outline'}`}>
          {formatTime(notification.created_at)}
        </span>
      </div>

      {/* Hover Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.is_read && (
          <button
            onClick={() => markAsRead(notification.id)}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-lg">done_all</span>
          </button>
        )}
      </div>
    </motion.div>
  )

  if (loading && notifications.length === 0) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="p-12 min-h-screen bg-surface editorial-shadow relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-headline text-5xl font-black tracking-tighter text-on-tertiary-fixed mb-2">
            NOTIFICATIONS
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
              Update Stream
            </span>
            <div className="h-px flex-1 bg-outline-variant/20" />
            {notifications.some(n => !n.is_read) && (
              <button
                onClick={markAllAsRead}
                className="font-label text-xs font-bold uppercase tracking-widest text-tertiary hover:underline"
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Today */}
        {todayNotifications.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="font-headline text-2xl font-black tracking-tight">TODAY</h2>
              <span className="font-label text-xs text-tertiary uppercase font-bold tracking-widest">
                {todayNotifications.filter(n => !n.is_read).length} New
              </span>
            </div>
            <div className="space-y-4">
              {todayNotifications.map((n, i) => renderNotification(n, i, true))}
            </div>
          </section>
        )}

        {/* Yesterday */}
        {yesterdayNotifications.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface-variant/40">
                YESTERDAY
              </h2>
            </div>
            <div className="space-y-4 opacity-70">
              {yesterdayNotifications.map((n, i) => renderNotification(n, i))}
            </div>
          </section>
        )}

        {/* Older */}
        {olderNotifications.length > 0 && (
          <section>
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface-variant/30">
                EARLIER
              </h2>
            </div>
            <div className="space-y-4 opacity-50">
              {olderNotifications.map((n, i) => renderNotification(n, i))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {notifications.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="font-headline font-black text-4xl leading-[0.9] text-on-surface-variant/20 italic select-none mb-8">
              SILENCE<br />IS<br />GOLDEN
            </div>
            <p className="text-on-surface-variant text-sm">
              No notifications yet. The system is quiet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
