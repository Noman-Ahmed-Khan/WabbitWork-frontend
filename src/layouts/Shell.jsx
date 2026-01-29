import { useAuth } from '../state/auth.store'
import Dock from '../components/navigation/Dock'
import cx from '../utils/cx'

/**
 * Main application shell
 * Wraps authenticated views with navigation
 */
export default function Shell({ children }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="text-lg font-bold">Team Task Manager</h1>
              <p className="text-xs text-base-content/60">Manage your team efficiently</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-base-content/60">{user?.email}</p>
            </div>
            <div className="avatar placeholder">
              <div className="w-10 rounded-full bg-primary text-primary-content">
                <span className="text-sm font-bold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Bottom navigation dock */}
      <Dock />
    </div>
  )
}