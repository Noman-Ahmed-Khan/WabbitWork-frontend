import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../stores/authStore'
import useUIStore from '../../stores/uiStore'
import ProfileAvatar from '../profile/ProfileAvatar'
import { containerVariants, itemVariants, buttonVariants } from '../../animations/variants'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'grid_view' },
  { path: '/teams', label: 'Teams', icon: 'groups' },
  { path: '/tasks', label: 'Tasks', icon: 'assignment_turned_in' },
  { path: '/invitations', label: 'Invitations', icon: 'mail' },
  { path: '/notifications', label: 'Notifications', icon: 'notifications' },
  { path: '/profile', label: 'Settings', icon: 'settings' },
]

/**
 * Side Navigation Bar - Brutalist Editorial Design
 * Fixed left sidebar with oversized branding and tactical navigation
 * Responsive: Collapsible on mobile, fixed on desktop
 */
export default function SideNavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const handleNavigate = (path) => {
    navigate(path)
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={`h-screen w-64 fixed left-0 top-0 bg-surface/95 backdrop-blur-xl flex flex-col p-8 z-50 shadow-brutalist overflow-hidden transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12 md:mb-16"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl md:text-2xl font-black text-on-surface uppercase tracking-tighter block font-headline leading-none">
              WabbitWorks
            </span>
          </div>
          <span className="font-headline font-bold tracking-[0.2em] text-[10px] md:text-xs text-outline uppercase mt-1 block opacity-60">
            Brutalist Edition
          </span>
        </motion.div>

        {/* Navigation */}
        <motion.nav 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="flex-1 space-y-4 md:space-y-6"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <motion.button
                key={item.path}
                variants={itemVariants}
                onClick={() => handleNavigate(item.path)}
                whileHover="hover"
                whileTap="tap"
                className={`flex items-center gap-4 w-full text-left group relative ${
                  isActive
                    ? 'text-on-surface'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] md:text-[22px] transition-all duration-300 ${
                    isActive ? 'fill-1 scale-110 text-tertiary' : 'group-hover:scale-110'
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className={`font-headline uppercase tracking-tight text-xs md:text-sm transition-all duration-300 ${isActive ? 'font-black scale-105 origin-left' : 'font-bold'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -left-8 w-1.5 h-6 bg-tertiary shadow-[0_0_8px_rgba(var(--tertiary),0.3)]"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.nav>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mt-auto space-y-8"
        >
          {/* New Task Overlay Trigger */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleNavigate('/tasks')}
            className="w-full bg-on-tertiary-fixed text-on-tertiary py-4 font-headline font-black uppercase tracking-[0.2em] text-[10px] md:text-xs transition-colors shadow-editorial active:scale-95"
          >
            Initialize Protocol
          </motion.button>

          {/* User Info */}
          <div className="flex items-center gap-4 pt-8 border-t border-outline-variant/30">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="transition-transform"
            >
              <ProfileAvatar
                user={user}
                size="md"
                className="border-2 border-surface shadow-sm"
                fallbackClassName="text-xs"
              />
            </motion.div>
            <div className="min-w-0">
              <p className="text-xs font-black text-on-surface uppercase tracking-tight truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] md:text-xs text-outline font-bold uppercase tracking-widest leading-none mt-1">
                Pro Editor
              </p>
            </div>
          </div>
        </motion.div>

        {/* Background oversized vertical text */}
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-20 -right-12 font-headline font-black text-7xl text-on-surface rotate-[-90deg] uppercase pointer-events-none select-none"
        >
          NAVIGATION
        </motion.span>
      </aside>
    </>
  )
}
