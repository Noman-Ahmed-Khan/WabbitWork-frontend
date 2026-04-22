import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useNotificationStore from '../stores/notificationStore'
import useRouteSearch from '../hooks/useRouteSearch'
import Spinner from '../components/primitives/Spinner'
import { filterBySearch } from '../utils/search'
import { containerVariants, itemVariants, cardVariants, buttonVariants } from '../animations/variants'

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
  const { searchQuery, clearSearchQuery, hasSearchQuery } = useRouteSearch()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const filteredNotifications = filterBySearch(notifications, searchQuery, (notification) => [
    notification.title,
    notification.message,
    notification.body,
    notification.type,
    notification.category,
  ])

  // Group notifications by date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayNotifications = filteredNotifications.filter(n => {
    const date = new Date(n.created_at)
    return date >= today
  })

  const yesterdayNotifications = filteredNotifications.filter(n => {
    const date = new Date(n.created_at)
    return date >= yesterday && date < today
  })

  const olderNotifications = filteredNotifications.filter(n => {
    const date = new Date(n.created_at)
    return date < yesterday
  })
  const isSearchEmpty = hasSearchQuery && filteredNotifications.length === 0

  const getIcon = (notification) => {
    const type = notification.type || notification.category || 'default'
    return iconMap[type] || iconMap.default
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const renderNotification = (notification, index) => (
    <motion.div
      key={notification.id}
      variants={cardVariants}
      whileHover={{ scale: 1.01, x: 4 }}
      role={!notification.is_read ? 'button' : undefined}
      tabIndex={!notification.is_read ? 0 : -1}
      aria-label={`Notification: ${notification.title || notification.message || 'Item'}`}
      onKeyDown={(e) => {
        if (notification.is_read) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          markAsRead(notification.id)
        }
      }}
      className={`group relative flex items-start sm:items-center p-4 md:p-6 bg-surface-container-high transition-all duration-300 ${
        !notification.is_read ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-inset' : ''
      } ${
        !notification.is_read ? 'border-l-4 border-tertiary shadow-md' : 'border-l-4 border-transparent opacity-80'
      }`}
      onClick={() => !notification.is_read && markAsRead(notification.id)}
    >
      {/* Icon */}
      <div className="mr-4 md:mr-6 flex-shrink-0">
        <motion.div 
          animate={!notification.is_read ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-12 h-12 rounded-none flex items-center justify-center border-2 border-on-surface/10 ${
          !notification.is_read ? 'bg-surface-container-highest' : 'bg-surface-container-highest grayscale'
        }`}>
          <span className="material-symbols-outlined text-on-surface">
            {getIcon(notification)}
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-headline text-lg font-black uppercase tracking-tight ${notification.is_read ? 'text-on-surface-variant' : ''}`}>
            {notification.title || notification.message?.slice(0, 40) || 'Notification'}
          </span>
          {!notification.is_read && (
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-tertiary" 
            />
          )}
        </div>
        <p className={`text-sm leading-relaxed max-w-lg font-medium italic ${notification.is_read ? 'text-on-surface-variant/60' : 'text-on-surface-variant'}`}>
          {notification.message || notification.body || ''}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <span className={`text-[10px] font-black uppercase tracking-widest ${notification.is_read ? 'text-outline/50' : 'text-outline'}`}>
            {formatTime(notification.created_at)}
          </span>
          <span className="h-px w-8 bg-outline-variant/30" />
          <span className="text-[8px] font-black uppercase tracking-widest text-outline/40">
            Node: {notification.id?.slice(-4)}
          </span>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        {!notification.is_read && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.2, color: "rgb(var(--tertiary))" }}
            onClick={(e) => {
              e.stopPropagation()
              markAsRead(notification.id)
            }}
            aria-label="Mark notification as read"
            className="p-2 rounded-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
          >
            <span className="material-symbols-outlined text-xl">done_all</span>
          </motion.button>
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
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-8 lg:p-12 min-h-screen bg-surface relative overflow-hidden"
    >
      {/* Background Kinetic Text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <motion.h1 
          initial={{ opacity: 0, y: -200, rotate: 10 }}
          animate={{ opacity: 0.04, y: 0, rotate: 0 }}
          transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-[8rem] sm:text-[12rem] md:text-[20rem] font-black font-headline text-on-surface leading-none tracking-tighter uppercase"
          aria-hidden="true"
        >
          Notifs
        </motion.h1>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10 md:mb-16">
          <h1 className="font-headline text-3xl md:text-5xl font-black tracking-tighter text-on-tertiary-fixed mb-4 uppercase italic">
            Update Stream
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-label text-xs uppercase tracking-[0.34em] text-on-surface-variant font-black">
              Editorial Status / Intercept Protocols
            </span>
            <div className="h-1 flex-1 bg-on-surface opacity-10" />
            {notifications.some(n => !n.is_read) && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="button"
                onClick={markAllAsRead}
                aria-label="Clear all unread notifications"
                className="bg-on-surface text-surface px-4 py-2 font-headline font-black text-[10px] uppercase tracking-widest shadow-brutalist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                Clear Buffer
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Content Body */}
        {isSearchEmpty ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-24 bg-surface-container-low/50 border-4 border-dashed border-outline-variant/20"
          >
            <div className="font-headline font-black text-6xl leading-[0.9] text-on-surface-variant/10 italic select-none mb-10">
              NO<br />MATCHES
            </div>
            <p className="text-on-surface-variant text-xs uppercase tracking-[0.4em] font-black opacity-60">
              Nothing in the notification stream matches "{searchQuery.trim()}".
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearSearchQuery}
              className="mt-8 bg-on-surface text-surface px-6 py-3 font-headline font-black text-[10px] uppercase tracking-widest shadow-brutalist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
            >
              Clear Search
            </motion.button>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} className="space-y-12">
            {/* Today */}
            {todayNotifications.length > 0 && (
              <motion.section variants={itemVariants}>
                <div className="flex items-baseline justify-between mb-8 border-b-4 border-on-surface pb-4">
                  <h2 className="font-headline text-3xl font-black tracking-tight uppercase italic">Intercepted Today</h2>
                  <span className="font-headline text-xs text-tertiary uppercase font-black tracking-[0.2em] bg-on-tertiary-container px-3 py-1">
                    {todayNotifications.filter(n => !n.is_read).length} Active
                  </span>
                </div>
                <div className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {todayNotifications.map((n, i) => renderNotification(n, i))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}

            {/* Yesterday */}
            {yesterdayNotifications.length > 0 && (
              <motion.section variants={itemVariants}>
                <div className="flex items-baseline justify-between mb-8 border-b-2 border-outline-variant/30 pb-4">
                  <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface-variant/40 uppercase">Archived Yesterday</h2>
                </div>
                <div className="space-y-1 opacity-80">
                  <AnimatePresence mode="popLayout">
                    {yesterdayNotifications.map((n, i) => renderNotification(n, i))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}

            {/* Older */}
            {olderNotifications.length > 0 && (
              <motion.section variants={itemVariants}>
                <div className="flex items-baseline justify-between mb-8 border-b border-outline-variant/20 pb-2">
                  <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface-variant/20 uppercase">Legacy Archive</h2>
                </div>
                <div className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {olderNotifications.map((n, i) => renderNotification(n, i))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}

            {/* Empty State */}
            {notifications.length === 0 && !loading && (
              <motion.div 
                variants={itemVariants}
                className="text-center py-24 bg-surface-container-low/50 border-4 border-dashed border-outline-variant/20"
              >
                <div className="font-headline font-black text-6xl leading-[0.9] text-on-surface-variant/10 italic select-none mb-10">
                  SILENCE<br />IS<br />GOLDEN
                </div>
                <p className="text-on-surface-variant text-xs uppercase tracking-[0.4em] font-black opacity-60">
                  No active intercepts detected.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
