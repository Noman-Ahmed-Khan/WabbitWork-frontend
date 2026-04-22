import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'
import useSessionStore from '../stores/sessionStore'
import useRouteSearch from '../hooks/useRouteSearch'
import Spinner from '../components/primitives/Spinner'
import AvatarUploader from '../components/profile/AvatarUploader'
import { filterBySearch, matchesSearchQuery } from '../utils/search'
import { containerVariants, itemVariants, cardVariants, buttonVariants } from '../animations/variants'

const profileTabSearchTerms = {
  profile: ['profile', 'identity', 'avatar', 'bio', 'name', 'settings'],
  security: ['security', 'password', 'email', 'access'],
  sessions: ['session', 'sessions', 'browser', 'device', 'login', 'ip'],
  notifications: ['notification', 'notifications', 'alerts', 'preferences'],
}

/**
 * Settings / Profile View - Brutalist Editorial Design
 * Bento panel layout with profile, system toggles, privacy, security
 */
export default function ProfileView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, loading, updateProfile, logout, changePassword, changeEmail } = useAuthStore()
  const { kineticFx, toggleKineticFx, theme, toggleTheme } = useUIStore()
  const { sessions, loadSessions, terminateSession, terminateAllSessions } = useSessionStore()
  const { searchQuery, clearSearchQuery, hasSearchQuery } = useRouteSearch()
  const initialTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(
    ['profile', 'security', 'sessions', 'notifications'].includes(initialTab) ? initialTab : 'profile'
  )
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
    emailPassword: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
      })
    }
  }, [user])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'security', 'sessions', 'notifications'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    if (activeTab === 'sessions') {
      loadSessions()
    }
  }, [activeTab, loadSessions])

  useEffect(() => {
    if (!hasSearchQuery) return

    const matchingTab = ['profile', 'security', 'sessions', 'notifications'].find((tab) =>
      matchesSearchQuery(profileTabSearchTerms[tab], searchQuery)
    )

    if (matchingTab && matchingTab !== activeTab) {
      setActiveTab(matchingTab)
    }
  }, [activeTab, hasSearchQuery, searchQuery])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSecurityChange = (e) => {
    setSecurityData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(formData)
    } catch (err) {
      console.error('Failed to save:', err)
    }
    setSaving(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await changePassword(securityData.currentPassword, securityData.newPassword)
      alert('Password changed successfully')
      setSecurityData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      alert(err.message || 'Failed to change password')
    }
    setSaving(false)
  }

  const handleChangeEmail = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await changeEmail(securityData.newEmail, securityData.emailPassword)
      alert('Verification email sent to new address')
      setSecurityData(prev => ({ ...prev, newEmail: '', emailPassword: '' }))
    } catch (err) {
      alert(err.message || 'Failed to initiate email change')
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout()
      navigate('/auth')
    }
  }

  const handleTerminateSession = async (sid) => {
    if (confirm('Terminate this session?')) {
      try {
        await terminateSession(sid)
      } catch (err) {
        alert(err.message || 'Failed to terminate session')
      }
    }
  }

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    )
  }

  const tabs = ['Profile', 'Security', 'Sessions', 'Notifications']
  const sessionSearchQuery = hasSearchQuery && !matchesSearchQuery(['profile', 'security', 'sessions', 'notifications'], searchQuery)
    ? searchQuery
    : ''
  const visibleSessions = activeTab === 'sessions'
    ? filterBySearch(sessions, sessionSearchQuery, (session) => [
        session.browser,
        session.os,
        session.deviceType,
        session.ipAddress,
        session.country,
        session.city,
        session.lastActivityAt,
      ])
    : sessions

  const Toggle = ({ checked, onChange, label, sublabel }) => (
    <label className="flex items-center justify-between group cursor-pointer focus-within:ring-2 focus-within:ring-tertiary focus-within:ring-offset-2">
      <div>
        <p className="font-headline font-bold text-lg uppercase tracking-tight group-hover:text-tertiary transition-colors text-on-surface">{label}</p>
        <p className="text-xs font-bold uppercase tracking-widest text-outline mt-1">{sublabel}</p>
      </div>
      <div className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only custom-toggle"
        />
        <div className={`toggle-bg block w-14 h-8 ${checked ? 'bg-tertiary' : 'bg-surface-container-highest'} rounded-none transition-colors border-2 border-on-surface`} />
        <motion.div 
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="toggle-dot absolute left-1 top-1 bg-on-surface w-6 h-6 rounded-none transition-transform shadow-sm" 
        />
      </div>
    </label>
  )

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto relative z-10 transition-colors duration-300"
    >
      {/* Background Kinetic Text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 0.03, scale: 1, x: 0 }}
          transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
          className="font-headline font-black text-[10rem] md:text-[15rem] lg:text-[20rem] text-on-surface rotate-90 uppercase"
          aria-hidden="true"
        >
          PARAM
        </motion.span>
      </div>

      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-16 relative z-10">
        <h2 className="font-headline text-3xl md:text-5xl font-black text-on-surface tracking-tighter leading-none mb-4 uppercase italic">
          Settings
        </h2>
        <p className="font-label text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] text-on-surface-variant font-black">
          Architect your digital presence
        </p>
        {hasSearchQuery && (
          <div className="mt-4 flex items-center gap-3">
            <span className="font-headline text-[10px] uppercase tracking-[0.3em] text-outline font-black">
              Searching "{searchQuery.trim()}"
            </span>
            <button
              type="button"
              onClick={clearSearchQuery}
              className="font-headline text-[10px] uppercase tracking-widest text-on-surface border-b border-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
            >
              Clear Search
            </button>
          </div>
        )}
      </motion.div>

      {/* Settings Panel */}
      <motion.div 
        variants={itemVariants}
        className="bg-surface p-1 rounded-none shadow-editorial border-t-8 border-on-surface overflow-hidden relative z-10"
      >
        {/* Tab Navigation */}
        <div
          className="flex gap-6 md:gap-12 px-6 md:px-12 pt-8 md:pt-10 pb-4 md:pb-6 border-b border-outline-variant/20 overflow-x-auto bg-surface-container-lowest scrollbar-hide"
          role="tablist"
          aria-label="Profile settings sections"
        >
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              id={`${tab.toLowerCase()}-tab`}
              onClick={() => setActiveTab(tab.toLowerCase())}
              role="tab"
              aria-selected={activeTab === tab.toLowerCase()}
              aria-controls={`${tab.toLowerCase()}-panel`}
              className="relative pb-4 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
            >
              <span className={`font-headline text-lg md:text-xl uppercase tracking-tighter ${
                activeTab === tab.toLowerCase()
                  ? 'font-black text-on-surface scale-110 block'
                  : 'font-bold text-outline group-hover:text-on-surface transition-all block'
              }`}>
                {tab}
              </span>
              {activeTab === tab.toLowerCase() && (
                <motion.div 
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 w-full h-1 md:h-1.5 bg-tertiary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Bento Panels Grid */}
        <div className="grid grid-cols-12 gap-1 p-1 bg-outline-variant/10">
          {/* Content Area Based on Active Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="col-span-12 grid grid-cols-12"
                role="tabpanel"
                id="profile-panel"
                aria-labelledby="profile-tab"
                tabIndex={0}
              >
                {/* Profile Identity Card */}
                <div className="col-span-12 lg:col-span-7 bg-surface p-6 md:p-12">
                  <div className="flex items-start justify-between mb-12">
                    <div>
                      <h3 className="font-headline font-black text-3xl uppercase tracking-tighter mb-2 italic text-on-surface">
                        Identity
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-outline">
                        Global Identification parameters
                      </p>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <AvatarUploader className="mb-2" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">
                          First sequence
                        </label>
                        <input
                          className="w-full h-12 md:h-14 bg-surface-container-highest border-none rounded-none px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-on-surface transition-all shadow-sm"
                          name="first_name"
                          type="text"
                          value={formData.first_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">
                          Last sequence
                        </label>
                        <input
                          className="w-full h-12 md:h-14 bg-surface-container-highest border-none rounded-none px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-on-surface transition-all shadow-sm"
                          name="last_name"
                          type="text"
                          value={formData.last_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 text-on-surface">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">
                        Biographical Archive
                      </label>
                      <textarea
                        className="w-full bg-surface-container-highest border-none rounded-none p-5 font-body text-sm text-on-surface focus:ring-2 focus:ring-on-surface resize-none h-32 shadow-sm"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Defining the brutalist architecture of the future system..."
                      />
                    </div>

                    {/* Save Button */}
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      aria-label="Save profile changes"
                      className="w-full sm:w-auto h-14 px-12 bg-black dark:bg-white text-white dark:text-black rounded-none font-headline font-black text-sm uppercase tracking-[0.3em] shadow-brutalist disabled:opacity-50"
                    >
                      {saving ? 'Archiving...' : 'Commit Changes'}
                    </motion.button>
                  </div>
                </div>

                {/* Right Column: System + Privacy */}
                <div className="col-span-12 lg:col-span-5 space-y-1 bg-outline-variant/10 flex flex-col">
                  {/* System Toggles */}
                  <div className="bg-surface p-6 md:p-12 flex-1">
                    <h3 className="font-headline font-black text-3xl md:text-5xl uppercase tracking-tighter mb-8 md:mb-10 italic text-on-surface">
                      System
                    </h3>
                    <div className="space-y-10">
                      <Toggle 
                         checked={theme === 'dark'} 
                         onChange={toggleTheme} 
                         label="Obsidian Mode" 
                         sublabel="Switch to the void" 
                      />
                      <Toggle 
                        checked={kineticFx} 
                        onChange={toggleKineticFx} 
                        label="Kinetic FX" 
                        sublabel="Structural transitions" 
                      />
                    </div>
                  </div>

                  {/* Security/Privacy */}
                  <motion.div 
                    whileHover={{ scale: 0.99 }}
                    className="bg-on-surface text-surface p-6 md:p-12 min-h-[220px] md:min-h-[250px] flex flex-col justify-between shadow-brutalist"
                  >
                    <div>
                      <h3 className="font-headline font-black text-3xl md:text-5xl uppercase tracking-tighter mb-4 italic">
                        Security
                      </h3>
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-surface/50 leading-relaxed max-w-xs">
                        Your data is fragmented across secure editorial nodes. We maintain total protocol integrity.
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      disabled
                      aria-disabled="true"
                      title="Coming soon"
                      className="mt-8 md:mt-10 h-12 md:h-14 bg-surface text-on-surface px-6 md:px-8 py-3 md:py-4 font-headline font-black uppercase text-xs tracking-[0.3em] flex items-center justify-between group opacity-60 cursor-not-allowed"
                    >
                      Archive Records
                      <span className="material-symbols-outlined text-sm">
                        download
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="col-span-12 bg-surface p-6 md:p-12"
                role="tabpanel"
                id="security-panel"
                aria-labelledby="security-tab"
                tabIndex={0}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {/* Change Password */}
                  <div className="space-y-10">
                    <div>
                      <h3 className="font-headline font-black text-3xl uppercase tracking-tighter mb-2 italic text-on-surface">
                        Security Sequence
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-outline">
                        Update your primary access key
                      </p>
                    </div>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">Current Key</label>
                        <input
                          className="w-full h-14 bg-surface-container-highest border-none rounded-none px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all shadow-sm"
                          name="currentPassword" type="password" value={securityData.currentPassword} onChange={handleSecurityChange} required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">New Key</label>
                        <input
                          className="w-full h-14 bg-surface-container-highest border-none rounded-none px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all shadow-sm"
                          name="newPassword" type="password" value={securityData.newPassword} onChange={handleSecurityChange} required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">Confirm New Key</label>
                        <input
                          className="w-full h-14 bg-surface-container-highest border-none rounded-none px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all shadow-sm"
                          name="confirmPassword" type="password" value={securityData.confirmPassword} onChange={handleSecurityChange} required
                        />
                      </div>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        type="submit"
                        disabled={saving}
                        className="h-14 px-12 bg-black dark:bg-white text-white dark:text-black rounded-none font-headline font-black text-sm uppercase tracking-[0.3em] shadow-brutalist disabled:opacity-50"
                      >
                        Update Sequence
                      </motion.button>
                    </form>
                  </div>

                  {/* Change Email */}
                  <div className="space-y-10">
                    <div>
                      <h3 className="font-headline font-black text-3xl uppercase tracking-tighter mb-2 italic text-on-surface">
                        Digital ID
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-outline">
                        Modify your network coordinates
                      </p>
                    </div>
                    <form onSubmit={handleChangeEmail} className="space-y-6">
                      <div className="space-y-4 p-6 bg-surface-container-highest rounded-none border-l-4 border-tertiary">
                        <p className="text-[10px] font-black uppercase text-outline">Active ID</p>
                        <p className="font-headline font-black text-xl text-on-surface">{user?.email}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">New Identity Email</label>
                        <input
                          className="w-full h-14 bg-surface-container-highest border-none rounded-none px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all shadow-sm"
                          name="newEmail" type="email" value={securityData.newEmail} onChange={handleSecurityChange} required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">Authorization Password</label>
                        <input
                          className="w-full h-14 bg-surface-container-highest border-none rounded-none px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all shadow-sm"
                          name="emailPassword" type="password" value={securityData.emailPassword} onChange={handleSecurityChange} required
                        />
                      </div>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        type="submit"
                        disabled={saving}
                        className="h-14 px-12 border-4 border-black dark:border-white text-on-surface rounded-none font-headline font-black text-sm uppercase tracking-[0.3em] shadow-brutalist disabled:opacity-50"
                      >
                        Initiate Change
                      </motion.button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'sessions' && (
              <motion.div
                key="sessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="col-span-12 bg-surface p-6 md:p-12"
                role="tabpanel"
                id="sessions-panel"
                aria-labelledby="sessions-tab"
                tabIndex={0}
              >
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h3 className="font-headline font-black text-3xl uppercase tracking-tighter mb-2 italic text-on-surface">
                      Active Sessions
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-outline">
                      Connected nodes across the network
                    </p>
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => terminateAllSessions(true)}
                    aria-label="Terminate all other sessions"
                    className="px-6 py-3 border-2 border-tertiary text-tertiary font-headline font-black text-[10px] uppercase tracking-widest hover:bg-tertiary hover:text-white transition-all shadow-brutalist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                  >
                    Terminate Others
                  </motion.button>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {visibleSessions.length > 0 ? (
                    visibleSessions.map((session, i) => (
                      <motion.div 
                        key={session.sid} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all gap-4 border-l-4 ${session.isCurrent ? 'bg-on-surface text-surface border-tertiary' : 'bg-surface-container-low hover:bg-surface-container-high border-outline-variant shadow-sm'}`}
                      >
                        <div className="flex items-center gap-4 md:gap-8">
                          <motion.span 
                            animate={session.isCurrent ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="material-symbols-outlined text-3xl md:text-4xl"
                          >
                            {session.deviceType === 'mobile' ? 'smartphone' : 'desktop_windows'}
                          </motion.span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                              <h4 className="font-headline font-black text-lg md:text-xl uppercase tracking-tight">{session.browser} on {session.os}</h4>
                              {session.isCurrent && (
                                <span className="bg-tertiary text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">Active Node</span>
                              )}
                            </div>
                            <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] ${session.isCurrent ? 'text-surface/60' : 'text-outline'}`}>
                              IP: {session.ipAddress} - Last sync: {new Date(session.lastActivityAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {!session.isCurrent && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.2, color: "rgb(var(--tertiary))" }}
                          onClick={() => handleTerminateSession(session.sid)}
                          aria-label={`Terminate session on ${session.browser} ${session.os}`}
                          className="h-12 w-12 flex items-center justify-center text-outline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                        >
                            <span className="material-symbols-outlined">logout</span>
                          </motion.button>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-16 text-center border border-dashed border-outline-variant/20 bg-surface-container-low">
                      <p className="text-sm font-medium text-on-surface-variant">
                        {hasSearchQuery
                          ? `No sessions match "${searchQuery.trim()}".`
                          : 'No active sessions found.'}
                      </p>
                      {hasSearchQuery && (
                        <button
                          type="button"
                          onClick={clearSearchQuery}
                          className="mt-6 font-headline text-xs uppercase tracking-widest border-b-2 border-on-surface text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
               <motion.div
                 key="notifications"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.3 }}
                 className="col-span-12 bg-surface p-12 text-center"
                 role="tabpanel"
                 id="notifications-panel"
                 aria-labelledby="notifications-tab"
                 tabIndex={0}
               >
                  <h3 className="font-headline font-black text-5xl uppercase tracking-tighter mb-10 italic text-on-surface">
                    Alert Protocols
                  </h3>
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="font-headline text-8xl text-on-surface-variant/10 font-black mb-8 select-none"
                  >
                    OFFLINE
                  </motion.div>
                  <p className="text-sm font-medium text-outline uppercase tracking-[0.3em] font-headline">
                    System integration in progress.
                  </p>
               </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Bento: Security Score + Support */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 lg:col-span-4 bg-surface-container p-12 border-t border-outline-variant/10"
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.span 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="material-symbols-outlined text-tertiary text-3xl" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield
              </motion.span>
              <h4 className="font-headline font-black text-2xl uppercase tracking-tighter italic text-on-surface">
                Protocol Integrity
              </h4>
            </div>
            <div className="w-full bg-on-surface/5 h-4 rounded-none mb-6 overflow-hidden border border-outline-variant/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="bg-tertiary h-full" 
              />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/40">
              THREAT LEVEL: NEGLIGIBLE / 75% SECURE
            </p>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="col-span-12 lg:col-span-8 bg-surface p-6 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-8 border-t border-l border-outline-variant/10"
          >
            <div className="max-w-md">
              <h4 className="font-headline font-black text-2xl uppercase tracking-tighter mb-2 italic text-on-surface">
                Support Node
              </h4>
              <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-outline">
                Our editorial response team is available for total system restoration 24/7. Connect to the grid.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full md:w-auto">
              <motion.button 
                type="button"
                disabled
                aria-disabled="true"
                title="Coming soon"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border-4 border-on-surface text-on-surface font-headline font-black text-xs tracking-widest transition-all shadow-brutalist opacity-60 cursor-not-allowed uppercase"
              >
                Restoration
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="button"
                onClick={handleLogout}
                aria-label="Sign out"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-tertiary text-white font-headline font-black text-xs uppercase tracking-widest shadow-brutalist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                Terminate
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
