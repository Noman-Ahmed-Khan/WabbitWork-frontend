import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../../stores/authStore'
import useUIStore from '../../stores/uiStore'
import useRouteSearch from '../../hooks/useRouteSearch'
import NotificationBell from '../notifications/NotificationBell'
import ProfileAvatar from '../profile/ProfileAvatar'
import { buttonVariants } from '../../animations/variants'

// Commit 4: Minor update

/**
 * Top Navigation Bar - Brutalist Editorial Design
 * Search bar + notification bell + user avatar
 */
export default function TopNavBar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIStore()
  const { scope, searchQuery, setSearchQuery, clearSearchQuery } = useRouteSearch()

  return (
    <header className="w-full h-14 sticky top-0 z-40 bg-transparent flex justify-between items-center px-4 md:px-8 py-4">
      {/* Menu Toggle (Mobile Only) */}
      <motion.button
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg bg-surface-container/30 text-on-surface hover:bg-surface-container/50 transition-colors mr-2 flex items-center justify-center font-headline"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <span className="material-symbols-outlined transition-transform duration-300">
          {sidebarOpen ? 'close' : 'menu'}
        </span>
      </motion.button>

      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-sm md:max-w-lg group"
        >
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm transition-colors group-focus-within:text-tertiary">
            search
          </span>
          <input
            aria-label={`Search within ${scope.label}`}
            autoComplete="off"
            className="w-full appearance-none bg-surface-container-highest/50 backdrop-blur-md border border-outline-variant/30 focus:border-tertiary/50 focus:ring-4 focus:ring-tertiary/10 text-[10px] md:text-xs font-headline tracking-[0.2em] py-2 pl-10 pr-10 rounded-lg uppercase placeholder:text-on-surface-variant/40 text-on-surface transition-all duration-300"
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && searchQuery) {
                event.preventDefault()
                clearSearchQuery()
              }
            }}
            placeholder={scope.placeholder}
            spellCheck="false"
            type="search"
            value={searchQuery}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearchQuery}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
            >
              <span className="material-symbols-outlined text-[16px]">
                close
              </span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Right side: toggles + notification + avatar */}
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="flex items-center gap-6"
      >
        <motion.button
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={toggleTheme}
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container/30 hover:bg-surface-container/50 transition-colors"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          <motion.span 
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="material-symbols-outlined text-on-surface"
          >
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </motion.span>
        </motion.button>

        <NotificationBell className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container/30 hover:bg-surface-container/50 transition-colors" />

        <motion.button
          type="button"
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/profile')}
          aria-label="Open profile"
          title="Profile"
          className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-2 border-surface shadow-sm cursor-pointer transition-all duration-300"
        >
          <ProfileAvatar
            user={user}
            size="sm"
            className="h-full w-full rounded-full border-0 shadow-none bg-transparent"
            fallbackClassName="text-[10px]"
          />
        </motion.button>
      </motion.div>
    </header>
  )
}
