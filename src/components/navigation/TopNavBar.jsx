import { motion } from 'framer-motion'
import useAuthStore from '../../stores/authStore'
import useUIStore from '../../stores/uiStore'
import NotificationBell from '../notifications/NotificationBell'

/**
 * Top Navigation Bar - Brutalist Editorial Design
 * Search bar + notification bell + user avatar
 */
export default function TopNavBar({ searchPlaceholder = 'SEARCH PROJECTS...' }) {
  const user = useAuthStore((state) => state.user)
  const { theme, toggleTheme } = useUIStore()

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`
    : 'U'

  return (
    <header className="w-full h-14 sticky top-0 z-40 bg-transparent flex justify-between items-center px-8 py-4">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
            search
          </span>
          <input
            className="w-full bg-surface-container-highest/50 backdrop-blur-md border-none focus:ring-0 text-xs font-headline tracking-[0.2em] py-2 pl-10 rounded-lg uppercase placeholder:text-on-surface-variant/40 text-on-surface transition-all duration-300"
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
      </div>

      {/* Right side: toggles + notification + avatar */}
      <div className="flex items-center gap-6">
        <motion.button
          onClick={toggleTheme}
          className="relative hover:opacity-70 transition-opacity flex items-center justify-center p-2 rounded-lg bg-surface-container/30 hover:bg-surface-container/50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          <span className="material-symbols-outlined text-on-surface">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </motion.button>

        <NotificationBell />

        <motion.div
           onClick={() => window.location.href = '/profile'}
          className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-2 border-surface shadow-sm cursor-pointer transition-all duration-300 hover:scale-105"
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-black text-on-surface font-headline">{initials.toUpperCase()}</span>
          )}
        </motion.div>
      </div>
    </header>
  )
}
