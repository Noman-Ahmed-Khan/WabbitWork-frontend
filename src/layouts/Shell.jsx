import { User } from 'lucide-react'
import { useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../stores/authStore'
import Dock from '../components/navigation/Dock'
import config from '../config/env'
import { pageVariants } from '../animations/variants'
import { transitions } from '../animations/transitions'

/**
 * Main application shell
 * Wraps authenticated views with navigation
 */
export default function Shell({ children }) {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  // Get user initials
  const initials = user 
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`
    : 'U'

  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-base-300/50 bg-base-100 shadow-sm">
        <motion.div
          className="container mx-auto flex h-12 items-center justify-between px-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.normal}
        >
          <div className="flex items-center gap-2">
            <motion.div 
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/80 text-primary-content font-bold text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              T
            </motion.div>
            <div>
              <h1 className="text-sm font-bold">{config.app.name}</h1>
              <p className="text-xs text-base-content/50 hidden sm:block">
                {config.isDevelopment && '🔧 Dev'}
                {config.isProduction && 'Team Manager'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-base-content/50 hidden md:block">{user?.email}</p>
            </div>
            <motion.div 
              className="avatar placeholder"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 rounded-full bg-primary/80 text-primary-content">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                ) : (
                  <span className="text-xs font-bold">{initials}</span>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Main content - key changes on route to trigger animation */}
      <main className="container mx-auto px-3 py-4 pb-24 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation dock */}
      <Dock />
    </div>
  )
}