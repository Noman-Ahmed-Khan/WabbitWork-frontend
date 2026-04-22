import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../stores/authStore'
import SideNavBar from '../components/navigation/SideNavBar'
import TopNavBar from '../components/navigation/TopNavBar'
import Dock from '../components/navigation/Dock'
import EmailVerificationBanner from '../components/auth/EmailVerificationBanner'
import { pageVariants, shutterVariants } from '../animations/variants'

/**
 * Main application shell - Brutalist Editorial Layout
 * Fixed sidebar + top nav + scrollable content area
 */
export default function Shell({ children }) {
  const emailVerificationRequired = useAuthStore((state) => state.emailVerificationRequired)
  const location = useLocation()

  return (
    <div className="min-h-screen relative bg-background text-on-background transition-colors duration-300 overflow-hidden">
      {/* Grain texture overlay */}
      <div className="brutalist-grain" />

      {/* Fixed Sidebar */}
      <SideNavBar />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-64 min-h-screen bg-surface relative transition-all duration-500 ease-in-out">
        {/* Email verification banner */}
        <AnimatePresence>
          {emailVerificationRequired && (
            <EmailVerificationBanner key="email-verification-banner" />
          )}
        </AnimatePresence>

        {/* Top Navigation */}
        <TopNavBar />

        {/* Page Content */}
        <main className="relative z-10 p-1 pb-20 md:pb-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative"
            >
              {/* Brutalist Shutter Effect */}
              <motion.div
                variants={shutterVariants}
                className="fixed inset-0 z-[100] bg-on-surface pointer-events-none origin-top"
              />
              
              <motion.div 
                variants={pageVariants}
                className="w-full h-full"
              >
                {children}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Bottom Navigation (Mobile Only) */}
        <Dock />
      </div>
    </div>
  )
}
