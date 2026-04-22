import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useNotificationStore from '../../stores/notificationStore'
import NotificationDropdown from './NotificationDropdown'

/**
 * Notification bell - Brutalist Editorial style
 */
export default function NotificationBell({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  const { unreadCount } = useNotificationStore()

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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative inline-flex items-center justify-center hover:opacity-70 transition-opacity ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Notifications"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined leading-none text-black dark:text-white transition-colors duration-300">
          notifications
        </span>

        {/* Unread dot */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-tertiary rounded-full"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown 
            ref={dropdownRef}
            onClose={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}
