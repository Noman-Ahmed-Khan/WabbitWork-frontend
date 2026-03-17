import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, Check, Trash2, Filter, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useNotificationStore from '../stores/notificationStore'
import NotificationItem from '../components/notifications/NotificationItem'
import Panel from '../layouts/Panel'
import Button from '../components/primitives/Button'
import Select from '../components/primitives/Select'
import Spinner from '../components/primitives/Spinner'

/**
 * Full notifications page
 */
export default function NotificationsView() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState('')
  const [readFilter, setReadFilter] = useState('')

  const {
    notifications,
    loading,
    pagination,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
    deleteAll,
    loadMore,
  } = useNotificationStore()

  useEffect(() => {
    const params = {}
    if (typeFilter) params.type = typeFilter
    if (readFilter === 'unread') params.is_read = false
    if (readFilter === 'read') params.is_read = true
    
    fetchNotifications(params)
  }, [fetchNotifications, typeFilter, readFilter])

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

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'team_invitation', label: 'Team Invitations' },
    { value: 'invitation_accepted', label: 'Invitation Accepted' },
    { value: 'invitation_declined', label: 'Invitation Declined' },
    { value: 'task_assigned', label: 'Task Assigned' },
    { value: 'task_updated', label: 'Task Updated' },
    { value: 'task_completed', label: 'Task Completed' },
    { value: 'member_added', label: 'Member Added' },
    { value: 'role_changed', label: 'Role Changed' },
  ]

  const readOptions = [
    { value: '', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Notifications</h1>
          <p className="text-sm text-base-content/60">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile?tab=notifications')}
            title="Notification Settings"
          >
            <Settings size={16} />
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
            >
              <Check size={16} />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteAll}
              className="hover:text-error"
            >
              <Trash2 size={16} />
              Delete all
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Panel className="!p-3">
        <div className="flex flex-wrap items-center gap-3">
          <Filter size={16} className="text-base-content/50" />
          <Select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            options={readOptions}
            className="select-sm w-28"
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={typeOptions}
            className="select-sm w-44"
          />
        </div>
      </Panel>

      {/* Notification list */}
      <Panel className="!p-0 overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <BellOff size={48} className="mx-auto mb-3 text-base-content/20" />
            <p className="text-base-content/60">No notifications</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-base-300">
              <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Load more */}
            {pagination.hasMore && (
              <div className="p-4 text-center border-t border-base-300">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadMore}
                  loading={loading}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </Panel>
    </div>
  )
}
