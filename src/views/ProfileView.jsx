import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  Lock, 
  Bell, 
  Monitor,
  Camera,
  Save,
  Mail,
  Eye,
  EyeOff,
  Check,
  Circle,
  Trash2,
  LogOut,
  Shield,
  Smartphone,
  Globe,
} from 'lucide-react'
import useAuthStore from '../stores/authStore'
import authApi from '../api/auth'
import sessionsApi from '../api/sessions'
import Panel from '../layouts/Panel'
import Input from '../components/primitives/Input'
import Button from '../components/primitives/Button'
import Spinner from '../components/primitives/Spinner'
import NotificationPreferences from '../components/notifications/NotificationPreferences'
import { formatDate } from '../utils/formatDate'

/**
 * Profile & Settings View
 */
export default function ProfileView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'profile'
  const [activeTab, setActiveTab] = useState(initialTab)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'sessions', label: 'Sessions', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-base-content/60">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`tab gap-2 flex-1 ${activeTab === tab.id ? 'tab-active' : ''}`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'sessions' && <SessionsTab />}
        {activeTab === 'notifications' && <NotificationPreferences />}
      </motion.div>
    </div>
  )
}

/**
 * Profile Tab
 */
function ProfileTab() {
  const { user, updateUser } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setMessage({ type: '', text: '' })
      
      // TODO: Add profile update API endpoint when available
      // For now, just update local state
      updateUser(formData)
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold mb-1">Profile Information</h2>
          <p className="text-sm text-base-content/60">Update your personal details</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-content">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" />
              ) : (
                <span className="text-2xl font-bold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              )}
            </div>
          </div>
          <div>
            <Button variant="ghost" size="sm" disabled>
              <Camera size={16} />
              Change Avatar
            </Button>
            <p className="text-xs text-base-content/50 mt-1">
              Avatar upload coming soon
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email (read-only, change via security tab) */}
          <div>
            <label className="label">
              <span className="label-text">Email Address</span>
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={user?.email || ''}
                className="input input-bordered flex-1"
                disabled
              />
              <Button 
                type="button" 
                variant="ghost"
                onClick={() => document.getElementById('change-email-modal').showModal()}
              >
                Change
              </Button>
            </div>
            {!user?.is_verified && (
              <p className="text-xs text-warning mt-1">
                ⚠️ Email not verified
              </p>
            )}
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} text-sm py-2`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={saving}>
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Change Email Modal */}
      <ChangeEmailModal />
    </Panel>
  )
}

/**
 * Change Email Modal
 */
function ChangeEmailModal() {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({ newEmail: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      
      await authApi.changeEmail(formData.newEmail, formData.password)
      
      setMessage({ 
        type: 'success', 
        text: 'Verification email sent to your new address. Please check your inbox.' 
      })
      setFormData({ newEmail: '', password: '' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change email' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="change-email-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Change Email Address</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Current Email</span>
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="input input-bordered w-full"
              disabled
            />
          </div>

          <Input
            label="New Email Address"
            type="email"
            value={formData.newEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, newEmail: e.target.value }))}
            placeholder="new@example.com"
            required
          />

          <Input
            label="Current Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter your password to confirm"
            required
          />

          {message.text && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} text-sm py-2`}>
              {message.text}
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <Button variant="ghost">Cancel</Button>
            </form>
            <Button type="submit" variant="primary" loading={loading}>
              <Mail size={16} />
              Change Email
            </Button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

/**
 * Security Tab
 */
function SecurityTab() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Password requirements
  const passwordRequirements = [
    { met: formData.newPassword.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(formData.newPassword), text: "Uppercase letter" },
    { met: /[a-z]/.test(formData.newPassword), text: "Lowercase letter" },
    { met: /[0-9]/.test(formData.newPassword), text: "At least one number" },
  ]

  const isPasswordValid = passwordRequirements.every(req => req.met)
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isPasswordValid) {
      setMessage({ type: 'error', text: 'New password does not meet requirements' })
      return
    }

    if (!passwordsMatch) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    try {
      setLoading(true)
      await authApi.changePassword(formData.currentPassword, formData.newPassword)
      
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Panel>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold mb-1">Change Password</h2>
          <p className="text-sm text-base-content/60">
            Update your password to keep your account secure
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="relative">
            <Input
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-9 text-base-content/50 hover:text-base-content"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="divider">New Password</div>

          {/* New Password */}
          <div className="relative">
            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-base-content/50 hover:text-base-content"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password requirements */}
          <div className="space-y-1 pl-1">
            {passwordRequirements.map((req, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                  req.met ? 'text-green-600 font-medium' : 'text-base-content/50'
                }`}
              >
                {req.met ? (
                  <Check size={12} className="stroke-2" />
                ) : (
                  <Circle size={8} fill="currentColor" className="opacity-40" />
                )}
                <span>{req.text}</span>
              </div>
            ))}
          </div>

          {/* Confirm Password */}
          <div>
            <Input
              label="Confirm New Password"
              type={showNewPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
            />
            {formData.confirmPassword && (
              <p className={`text-xs mt-1 ${passwordsMatch ? 'text-success' : 'text-error'}`}>
                {passwordsMatch ? '✓ Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>

          {/* Message */}
          {message.text && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} text-sm py-2`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading}
              disabled={!isPasswordValid || !passwordsMatch || !formData.currentPassword}
            >
              <Lock size={16} />
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </Panel>
  )
}

/**
 * Sessions Tab
 */
function SessionsTab() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await sessionsApi.getAll()
      setSessions(response.data.sessions)
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Terminate this session?')) return

    try {
      setActionLoading(sessionId)
      await sessionsApi.deleteSession(sessionId)
      setSessions(prev => prev.filter(s => s.sid !== sessionId))
    } catch (error) {
      alert(error.message || 'Failed to terminate session')
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogoutAll = async () => {
    if (!confirm('Log out from all other devices?')) return

    try {
      setActionLoading('all')
      await sessionsApi.logoutAll(true) // Keep current session
      await fetchSessions()
    } catch (error) {
      alert(error.message || 'Failed to logout from all devices')
    } finally {
      setActionLoading(null)
    }
  }

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone size={20} />
      case 'tablet':
        return <Smartphone size={20} />
      default:
        return <Monitor size={20} />
    }
  }

  return (
    <Panel>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold mb-1">Active Sessions</h2>
            <p className="text-sm text-base-content/60">
              Manage your active sessions across devices
            </p>
          </div>
          {sessions.length > 1 && (
            <Button 
              variant="error" 
              size="sm"
              onClick={handleLogoutAll}
              loading={actionLoading === 'all'}
            >
              <LogOut size={14} />
              Logout Others
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            No active sessions found
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.sid}
                className={`p-4 rounded-lg border ${
                  session.isCurrent 
                    ? 'border-primary bg-primary/5' 
                    : 'border-base-300 bg-base-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="text-base-content/60 mt-1">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {session.browser || 'Unknown Browser'}
                        </span>
                        {session.isCurrent && (
                          <span className="badge badge-primary badge-sm">Current</span>
                        )}
                      </div>
                      <p className="text-xs text-base-content/60">
                        {session.os || 'Unknown OS'} • {session.deviceType || 'Desktop'}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-base-content/50">
                        <Globe size={12} />
                        <span>{session.ipAddress || 'Unknown IP'}</span>
                      </div>
                      <p className="text-xs text-base-content/50 mt-1">
                        Last active: {formatDate(session.lastActivityAt)}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSession(session.sid)}
                      loading={actionLoading === session.sid}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  )
}
