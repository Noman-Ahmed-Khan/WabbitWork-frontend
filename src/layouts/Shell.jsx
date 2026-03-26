import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../stores/authStore'
import SideNavBar from '../components/navigation/SideNavBar'
import TopNavBar from '../components/navigation/TopNavBar'
import EmailVerificationBanner from '../components/auth/EmailVerificationBanner'
import { pageVariants } from '../animations/variants'

// Map routes to their search placeholder text
const searchPlaceholders = {
  '/dashboard': 'SEARCH PROJECTS...',
  '/teams': 'SEARCH TEAMS...',
  '/tasks': 'SEARCH TASKS...',
  '/invitations': 'SEARCH INVITATIONS...',
  '/notifications': 'SEARCH SYSTEM...',
  '/profile': 'SEARCH PREFERENCES...',
}

/**
 * Main application shell - Brutalist Editorial Layout
 * Fixed sidebar + top nav + scrollable content area
 */
export default function Shell({ children }) {
  const emailVerificationRequired = useAuthStore((state) => state.emailVerificationRequired)
  const location = useLocation()

  const searchPlaceholder = searchPlaceholders[location.pathname] || 'SEARCH...'

  return (
    <div className="min-h-screen relative bg-background text-on-background transition-colors duration-300">
      {/* Grain texture overlay */}
      <div className="brutalist-grain" />

      {/* Fixed Sidebar */}
      <SideNavBar />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen bg-surface relative transition-colors duration-300">
        {/* Email verification banner */}
        <AnimatePresence>
          {emailVerificationRequired && (
            <EmailVerificationBanner key="email-verification-banner" />
          )}
        </AnimatePresence>

        {/* Top Navigation */}
        <TopNavBar searchPlaceholder={searchPlaceholder} />

        {/* Page Content */}
        <main className="relative z-10 p-1">
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
      </div>
    </div>
  )
}