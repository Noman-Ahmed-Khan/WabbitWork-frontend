import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, CheckSquare, Moon, Sun, LogOut } from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import useUIStore from '../../stores/uiStore'
import config from '../../config/env'
import cx from '../../utils/cx'

/**
 * Bottom navigation dock
 * Mobile-friendly navigation with theme toggle
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
    <div className="btm-nav btm-nav-md z-50 border-t border-base-300 bg-base-100/80 backdrop-blur-md">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.path}
            className={cx(
              location.pathname === item.path && 'active'
            )}
            onClick={() => navigate(item.path)}
          >
            <Icon size={18} />
            <span className="btm-nav-label text-xs">{item.label}</span>
          </button>
        )
      })}
      
      {config.features.darkMode && (
        <button onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span className="btm-nav-label text-xs">Theme</span>
        </button>
      )}

      <button onClick={handleLogout}>
        <LogOut size={18} />
        <span className="btm-nav-label text-xs">Logout</span>
      </button>
    </div>
  )
}