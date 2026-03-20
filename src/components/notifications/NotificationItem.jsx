import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  CheckSquare, 
  MessageSquare,
  UserPlus,
  UserMinus,
  Shield,
  Clock,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import useNotificationStore from '../../stores/notificationStore'
import { formatDate } from '../../utils/formatDate'
import cx from '../../utils/cx'

/**
 * Get icon for notification type
 */
function getNotificationIcon(type) {
  const iconProps = { size: 18 }
  
  const icons = {
    team_invitation: <Mail {...iconProps} className="text-info" />,
    invitation_accepted: <CheckCircle {...iconProps} className="text-success" />,
    invitation_declined: <XCircle {...iconProps} className="text-error" />,
    task_assigned: <CheckSquare {...iconProps} className="text-primary" />,
    task_updated: <CheckSquare {...iconProps} className="text-warning" />,
    task_completed: <CheckCircle {...iconProps} className="text-success" />,
    task_comment: <MessageSquare {...iconProps} className="text-info" />,
    member_added: <UserPlus {...iconProps} className="text-success" />,
    member_removed: <UserMinus {...iconProps} className="text-error" />,
    role_changed: <Shield {...iconProps} className="text-warning" />,
    due_date_reminder: <Clock {...iconProps} className="text-warning" />,
    task_overdue: <AlertCircle {...iconProps} className="text-error" />,
  }
  
  if (!icons[type]) {
    console.warn(`[Notifications] Unknown notification type: "${type}"`)
  }
  
  return icons[type] || <Mail {...iconProps} />
}

/**
 * Single notification item
 */
export default function NotificationItem({ notification, onClose }) {
  const navigate = useNavigate()
  const { markAsRead, deleteNotification } = useNotificationStore()

  const handleClick = async () => {
    // Mark as read if unread
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }

    // Navigate to action URL if provided
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
      className={cx(
        'relative group border-b border-base-300 transition-colors cursor-pointer',
        notification.is_read 
          ? 'bg-base-100 text-base-content/70 hover:bg-base-200/30' 
          : 'bg-base-100 text-base-content hover:bg-base-200/50'
      )}
      onClick={handleClick}
    >
      <div className="p-3 pr-10">
        <div className="flex gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {getNotificationIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className={cx(
                'text-sm font-medium leading-tight',
                !notification.is_read && 'font-semibold'
              )}>
                {notification.title}
              </h4>
              
              {/* Unread indicator */}
              {!notification.is_read && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              )}
            </div>

            <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
              {notification.message}
            </p>

            <p className="text-xs text-base-content/50 mt-1.5">
              {formatDate(notification.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Delete button (visible on hover) */}
      <button
        onClick={handleDelete}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-error/20 hover:text-error transition-all"
        title="Delete notification"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  )
}