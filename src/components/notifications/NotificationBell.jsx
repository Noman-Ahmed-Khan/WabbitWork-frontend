import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useNotificationStore from '../../stores/notificationStore'
import NotificationDropdown from './NotificationDropdown'
import cx from '../../utils/cx'

/**
 * Notification bell with unread badge and dropdown
 */
export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  
  const { unreadCount, fetchUnreadCount } = useNotificationStore()

  // Fetch unread count on mount and every 30 seconds
  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cx(
          'relative p-2 rounded-lg transition-colors duration-200',
          isOpen 
            ? 'bg-base-200 text-base-content' 
            : 'text-base-content/70 hover:bg-base-200/50 hover:text-base-content'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Notifications"
      >
        <Bell size={20} />
        
        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-error-content text-xs font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <div ref={dropdownRef}>
            <NotificationDropdown onClose={() => setIsOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}