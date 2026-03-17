import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import useUIStore from './stores/uiStore'
import useNotificationStore from './stores/notificationStore'
import useInvitationStore from './stores/invitationStore'

// Views
import AuthView from './views/AuthView'
import DashboardView from './views/DashboardView'
import TeamsView from './views/TeamsView'
import TasksView from './views/TasksView'
import ProfileView from './views/ProfileView'
import InvitationsView from './views/InvitationsView'
import NotificationsView from './views/NotificationsView'
import VerifyEmailView from './views/VerifyEmailView'
import ResetPasswordView from './views/ResetPasswordView'

// Components
import Shell from './layouts/Shell'
import Spinner from './components/primitives/Spinner'

/**
 * Protected route wrapper
 * Redirects to auth if not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}

/**
 * Public route wrapper
 * Redirects to dashboard if already authenticated
 */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <Spinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/**
 * Application routes
 */
function AppRoutes() {
  return (
    <Routes>
      {/* ========== Public Routes ========== */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthView />
          </PublicRoute>
        }
      />
      
      {/* Email verification (accessible without auth - from email link) */}
      <Route path="/verify-email" element={<VerifyEmailView />} />
      
      {/* Password reset (accessible without auth - from email link) */}
      <Route path="/reset-password" element={<ResetPasswordView />} />

      {/* ========== Protected Routes ========== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Shell>
              <DashboardView />
            </Shell>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Shell>
              <TeamsView />
            </Shell>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Shell>
              <TasksView />
            </Shell>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Shell>
              <ProfileView />
            </Shell>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/invitations"
        element={
          <ProtectedRoute>
            <Shell>
              <InvitationsView />
            </Shell>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Shell>
              <NotificationsView />
            </Shell>
          </ProtectedRoute>
        }
      />

      {/* ========== Redirects ========== */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

/**
 * Main App component
 * Initializes auth, theme, and global data
 */
export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const initializeTheme = useUIStore((state) => state.initializeTheme)
  const fetchUnreadCount = useNotificationStore((state) => state.fetchUnreadCount)
  const fetchPendingCount = useInvitationStore((state) => state.fetchPendingCount)

  useEffect(() => {
    // Initialize theme from localStorage
    initializeTheme()
    
    // Check authentication status on mount
    checkAuth()
  }, [checkAuth, initializeTheme])

  // Fetch notification and invitation counts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount()
      fetchPendingCount()

      // Set up polling intervals
      const notificationInterval = setInterval(fetchUnreadCount, 30000) // 30 seconds
      const invitationInterval = setInterval(fetchPendingCount, 60000) // 60 seconds

      return () => {
        clearInterval(notificationInterval)
        clearInterval(invitationInterval)
      }
    }
  }, [isAuthenticated, fetchUnreadCount, fetchPendingCount])

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppRoutes />
    </BrowserRouter>
  )
}