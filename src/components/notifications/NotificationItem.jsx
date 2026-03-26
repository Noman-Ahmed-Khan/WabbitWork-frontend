import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useNotificationStore from '../../stores/notificationStore'
import { formatDate } from '../../utils/formatDate'

/**
 * Get Material Symbols icon name for notification type
 */
function getNotificationIcon(type) {
  const icons = {
    team_invitation: 'mail',
    invitation_accepted: 'check_circle',
    invitation_declined: 'cancel',
    task_assigned: 'assignment_turned_in',
    task_updated: 'edit_note',
    task_completed: 'task_alt',
    task_comment: 'chat_bubble',
    member_added: 'person_add',
    member_removed: 'person_remove',
    role_changed: 'shield',
    due_date_reminder: 'schedule',
    task_overdue: 'warning',
  }
  
  return icons[type] || 'notifications'
}

/**
 * Single notification item - Brutalist Editorial Design
 */
export default function NotificationItem({ notification, onClose }) {
  const navigate = useNavigate()
  const { markAsRead, deleteNotification } = useNotificationStore()

  const handleClick = async () => {
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }
    if (notification.action_url) {
      navigate(notification.action_url)
      onClose?.()
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    try {
      await deleteNotification(notification.id)
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`relative group border-b border-stone-100 transition-colors cursor-pointer ${
        notification.is_read 
          ? 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low/50' 
          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
      }`}
      onClick={handleClick}
    >
      <div className="p-3 pr-10">
        <div className="flex gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              notification.is_read ? 'bg-surface-container-highest/50' : 'bg-surface-container-highest'
            }`}>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">
                {getNotificationIcon(notification.type)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className={`text-sm font-headline leading-tight ${
                !notification.is_read ? 'font-bold text-black' : 'font-medium text-on-surface-variant'
              }`}>
                {notification.title}
              </h4>
              
              {!notification.is_read && (
                <div className="w-2 h-2 rounded-full bg-tertiary flex-shrink-0 mt-1.5" />
              )}
            </div>

            <p className="text-xs text-on-surface-variant/70 mt-1 line-clamp-2 font-body">
              {notification.message}
            </p>

            <p className="text-[10px] text-outline/50 mt-1.5 font-label uppercase tracking-widest">
              {formatDate(notification.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Delete button (visible on hover) */}
      <button
        onClick={handleDelete}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-tertiary/10 hover:text-tertiary transition-all"
        title="Delete notification"
      >
        <span className="material-symbols-outlined text-sm">delete_outline</span>
      </button>
    </motion.div>
  )
}