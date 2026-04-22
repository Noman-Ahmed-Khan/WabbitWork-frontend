import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import useUIStore from './stores/uiStore'

import ErrorBoundary from './components/ErrorBoundary'
import Shell from './layouts/Shell'
import Spinner from './components/primitives/Spinner'

import useNotificationPoller from './hooks/useNotificationPoller'
import useSessionStore from './stores/sessionStore'
import healthApi from './api/health'

import AuthView from './views/AuthView'
import DashboardView from './views/DashboardView'
import TeamsView from './views/TeamsView'
import TasksView from './views/TasksView'
import ProfileView from './views/ProfileView'
import InvitationsView from './views/InvitationsView'
import NotificationsView from './views/NotificationsView'
import VerifyEmailView from './views/VerifyEmailView'
import ResetPasswordView from './views/ResetPasswordView'
import AcceptInvitationView from './views/AcceptInvitationView'
import DeclineInvitationView from './views/DeclineInvitationView'
import InvitationConfirmationView from './views/InvitationConfirmationView'
import LandingView from './views/LandingView'

// Commit 1: Minor update




/**
 * Protected route wrapper
 * Redirects to auth if not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-highest">
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
      <div className="min-h-screen flex items-center justify-center bg-surface-container-highest">
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
      <Route
        path="/login"
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

      {/* Accept Invitation (accessible from email link) */}
      <Route path="/accept-invitation" element={<AcceptInvitationView />} />
      <Route path="/invitations/accept" element={<AcceptInvitationView />} />
      <Route path="/invitations/accept/:id" element={<AcceptInvitationView />} />
      
      {/* Decline Invitation (accessible from email link) */}
      <Route path="/decline-invitation" element={<DeclineInvitationView />} />
      <Route path="/invitations/decline" element={<DeclineInvitationView />} />
      <Route path="/invitations/decline/:id" element={<DeclineInvitationView />} />
      
      {/* Invitation Confirmation (redirect after accepting/declining from email) */}
      <Route path="/invitations/confirmation" element={<InvitationConfirmationView />} />

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

      {/* ========== Landing Page ========== */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingView />
          </PublicRoute>
        }
      />

      {/* ========== Redirects ========== */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
  const refreshSession = useSessionStore((state) => state.refreshSession)

  useEffect(() => {
    // Initialize theme from localStorage
    initializeTheme()
    
    // Check authentication status on mount
    checkAuth()

    // Preliminary health check
    healthApi.checkHealth()
      .then(data => console.log('System Status:', data.status))
      .catch(err => console.error('System Link Failure:', err))
  }, [checkAuth, initializeTheme])

  useEffect(() => {
    if (isAuthenticated) {
      // Refresh session every 15 minutes to keep cookie alive
      const interval = setInterval(refreshSession, 15 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, refreshSession])

  useNotificationPoller()

  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
