import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, CheckSquare, Moon, Sun, LogOut, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import useAuthStore from '../../stores/authStore'
import useUIStore from '../../stores/uiStore'
import NotificationBell from '../notifications/NotificationBell'
import InvitationBadge from '../invitations/InvitationBadge'
import config from '../../config/env'
import cx from '../../utils/cx'
import { dockIconVariants, dockIndicatorVariants } from '../../animations/variants'
import { transitions } from '../../animations/transitions'

/**
 * Bottom navigation dock
 * Mobile-friendly navigation with notifications, invitations, theme toggle
 */
export default function Dock() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const { theme, toggleTheme } = useUIStore()

  const navItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard' 
    },
    { 
      path: '/teams', 
      icon: Users, 
      label: 'Teams' 
    },
    { 
      path: '/tasks', 
      icon: CheckSquare, 
      label: 'Tasks' 
    },
  ]

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout()
      navigate('/auth')
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-base-300/50 bg-base-100/70 backdrop-blur-lg">
      <motion.div
        className="container mx-auto px-3 h-16 flex items-center justify-center gap-1 md:gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.normal}
      >
        {/* Main navigation */}
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cx(
                'relative flex flex-col items-center justify-center gap-1 px-3 md:px-4 py-2 rounded-lg transition-colors duration-200',
                isActive 
                  ? 'text-primary-content' 
                  : 'text-base-content/70 hover:bg-base-200/50 hover:text-base-content'
              )}
              title={item.label}
              variants={dockIconVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {isActive && (
                <motion.div
                  layoutId="dock-active"
                  className="absolute inset-0 bg-primary/80 shadow-lg rounded-lg z-0"
                  variants={dockIndicatorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transitions.spring}
                />
              )}
              <motion.div 
                className="relative z-10 flex flex-col items-center"
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={transitions.fast}
              >
                <Icon size={20} />
                <span className="text-xs hidden sm:block">{item.label}</span>
              </motion.div>
            </motion.button>
          )
        })}
        
        <div className="w-px h-8 bg-base-300/50 mx-1 md:mx-2" />

        {/* Invitations */}
        <div className="md:hidden">
          <InvitationBadge />
        </div>

        {/* Notifications */}
        <div className="md:hidden">
          <NotificationBell />
        </div>

        <div className="w-px h-8 bg-base-300/50 mx-1 md:mx-2" />
        
        {/* Theme toggle */}
        {config.features.darkMode && (
          <motion.button 
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg text-base-content/70 hover:bg-base-200/50 hover:text-base-content transition-all duration-200"
            title="Toggle theme"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: theme === 'light' ? 0 : 180 }}
              transition={transitions.normal}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.div>
          </motion.button>
        )}

        {/* Settings */}
        <motion.button 
          onClick={() => navigate('/profile')}
          className={cx(
            'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-200',
            location.pathname === '/profile'
              ? 'text-primary bg-primary/10'
              : 'text-base-content/70 hover:bg-base-200/50 hover:text-base-content'
          )}
          title="Settings"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={18} />
        </motion.button>

        {/* Logout */}
        <motion.button 
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg text-base-content/70 hover:bg-error/20 hover:text-error transition-all duration-200"
          title="Logout"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={18} />
        </motion.button>
      </motion.div>
    </nav>
  )
}