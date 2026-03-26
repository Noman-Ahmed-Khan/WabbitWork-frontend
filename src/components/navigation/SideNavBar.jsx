import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../../stores/authStore'

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
 */
export default function SideNavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`
    : 'U'

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface/80 backdrop-blur-xl flex flex-col p-8 z-50 shadow-brutalist overflow-hidden transition-colors duration-300">
      {/* Branding */}
      <div className="mb-16">
        <span className="text-2xl font-black text-on-surface uppercase tracking-tighter block font-headline leading-none">
          TaskMaster
        </span>
        <span className="font-headline font-bold tracking-[0.2em] text-xs text-outline uppercase mt-1 block opacity-60">
          Brutalist Edition
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 w-full text-left transition-all duration-300 group relative ${isActive
                  ? 'text-on-surface scale-105'
                  : 'text-outline hover:text-on-surface hover:scale-105'
                }`}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-all ${isActive ? 'fill-1 scale-110' : 'group-hover:scale-110'
                  }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className={`font-headline uppercase tracking-tight text-sm ${isActive ? 'font-black' : 'font-bold'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -left-8 w-1.5 h-6 bg-tertiary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-8">
        {/* New Task Overlay Trigger */}
        <motion.button
          onClick={() => navigate('/tasks')}
          className="w-full bg-on-tertiary-fixed text-on-tertiary py-4 font-headline font-black uppercase tracking-[0.2em] text-xs hover:bg-tertiary hover:scale-[1.05] transition-all shadow-editorial active:scale-95"
        >
          Initialize Protocol
        </motion.button>

        {/* User Info */}
        <div className="flex items-center gap-4 pt-8 border-t border-outline-variant/30">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-2 border-surface shadow-sm">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-headline font-black text-on-surface">{initials.toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-on-surface uppercase tracking-tight truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-outline font-bold uppercase tracking-widest leading-none mt-1">
              Pro Editor
            </p>
          </div>
        </div>
      </div>

      {/* Background oversized vertical text */}
      <span className="absolute bottom-20 -right-12 font-headline font-black text-7xl text-on-surface opacity-[0.02] dark:opacity-[0.05] rotate-[-90deg] uppercase pointer-events-none select-none">
        NAVIGATION
      </span>
    </aside>
  )
}
