import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../stores/authStore'
import useUIStore from '../../stores/uiStore'
import NotificationBell from '../notifications/NotificationBell'
import InvitationBadge from '../invitations/InvitationBadge'
import ProfileAvatar from '../profile/ProfileAvatar'

/**
 * Bottom navigation dock - Brutalist Editorial Design
 * Mobile-friendly navigation with high-contrast active states
 */
export default function Dock() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const { theme, toggleTheme } = useUIStore()

  const navItems = [
    { 
      path: '/dashboard', 
      icon: 'grid_view', 
      label: 'Dashboard' 
    },
    { 
      path: '/teams', 
      icon: 'groups', 
      label: 'Teams' 
    },
    { 
      path: '/tasks', 
      icon: 'assignment', 
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-2xl border-t border-outline-variant/30 md:hidden shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      <motion.div
        className="px-6 h-16 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Main navigation */}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center gap-1 min-w-[60px] py-2 transition-all ${
                isActive ? 'text-on-surface' : 'text-outline hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-headline font-black uppercase tracking-widest">
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-indicator-dock"
                  className="absolute -top-[1px] w-8 h-[3px] bg-tertiary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          )
        })}

        {/* Action icons */}
        <div className="flex items-center gap-2">
           <InvitationBadge className="!p-2" />
           <NotificationBell className="!p-2" />
        </div>

        {/* Profile */}
        <button 
          onClick={() => navigate('/profile')}
          className={`relative flex flex-col items-center justify-center gap-1 min-w-[60px] py-2 transition-all ${
            location.pathname === '/profile' ? 'text-on-surface' : 'text-outline'
          }`}
        >
          <ProfileAvatar
            user={user}
            size="xs"
            className="border border-stone-200 shadow-sm"
            fallbackClassName="text-[9px]"
          />
          <span className="text-[9px] font-headline font-black uppercase tracking-widest">Profile</span>
          {location.pathname === '/profile' && (
            <motion.div
              layoutId="active-indicator-dock"
              className="absolute -top-[1px] w-8 h-[3px] bg-tertiary"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center justify-center p-3 text-outline hover:text-tertiary transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
        </button>
      </motion.div>
    </nav>
  )
}
