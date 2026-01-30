import { User } from 'lucide-react'
import useAuthStore from '../stores/authStore'
import Dock from '../components/navigation/Dock'
import config from '../config/env'

/**
 * Main application shell
 * Wraps authenticated views with navigation
 */
export default function Shell({ children }) {
  const user = useAuthStore((state) => state.user)

  // Get user initials
  const initials = user 
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`
    : 'U'

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/80 backdrop-blur-md">
        <div className="container mx-auto flex h-12 items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-content font-bold text-sm">
              T
            </div>
            <div>
              <h1 className="text-sm font-bold">{config.app.name}</h1>
              <p className="text-xs text-base-content/60 hidden sm:block">
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
              <p className="text-xs text-base-content/60 hidden md:block">{user?.email}</p>
            </div>
            <div className="avatar placeholder">
              <div className="w-8 rounded-full bg-primary text-primary-content">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                ) : (
                  <span className="text-xs font-bold">{initials}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-3 py-4">
        {children}
      </main>

      {/* Bottom navigation dock */}
      <Dock />
    </div>
  )
}