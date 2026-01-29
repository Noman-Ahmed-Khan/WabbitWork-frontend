import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/auth.store'
import { useUI } from '../../state/ui.store'
import cx from '../../utils/cx'

export default function Dock() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { theme, toggleTheme } = useUI()

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/teams', icon: '👥', label: 'Teams' },
    { path: '/tasks', icon: '✓', label: 'Tasks' },
  ]

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout()
      navigate('/auth')
    }
  }

  return (
    <div className="btm-nav btm-nav-lg z-50 border-t border-base-300 bg-base-100/80 backdrop-blur-md">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={cx(
            location.pathname === item.path && 'active'
          )}
          onClick={() => navigate(item.path)}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="btm-nav-label text-xs">{item.label}</span>
        </button>
      ))}
      
      <button onClick={toggleTheme}>
        <span className="text-2xl">{theme === 'light' ? '🌙' : '☀️'}</span>
        <span className="btm-nav-label text-xs">Theme</span>
      </button>

      <button onClick={handleLogout}>
        <span className="text-2xl">🚪</span>
        <span className="btm-nav-label text-xs">Logout</span>
      </button>
    </div>
  )
}