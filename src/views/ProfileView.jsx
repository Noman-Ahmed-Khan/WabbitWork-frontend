import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'
import useSessionStore from '../stores/sessionStore'
import Spinner from '../components/primitives/Spinner'
import Input from '../components/primitives/Input'

/**
 * Settings / Profile View - Brutalist Editorial Design
 * Bento panel layout with profile, system toggles, privacy, security
 */
export default function ProfileView() {
  const navigate = useNavigate()
  const { user, loading, updateProfile, logout, changePassword, changeEmail } = useAuthStore()
  const { kineticFx, toggleKineticFx, theme, toggleTheme } = useUIStore()
  const { sessions, loadSessions, terminateSession, terminateAllSessions } = useSessionStore()
  const [activeTab, setActiveTab] = useState('profile')
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
    if (activeTab === 'sessions') {
      loadSessions()
    }
  }, [activeTab, loadSessions])

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

  const Toggle = ({ checked, onChange, label, sublabel }) => (
    <div className="flex items-center justify-between group">
      <div>
        <p className="font-headline font-bold text-lg uppercase tracking-tight group-hover:text-tertiary transition-colors text-on-surface">{label}</p>
        <p className="text-xs font-bold uppercase tracking-widest text-outline mt-1">{sublabel}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only custom-toggle"
        />
        <div className="toggle-bg block w-14 h-8 bg-surface-container-highest rounded-full transition-colors border-2 border-transparent group-hover:border-outline" />
        <div className="toggle-dot absolute left-1 top-1 bg-on-surface w-6 h-6 rounded-full transition-transform duration-300 shadow-sm" />
      </label>
    </div>
  )

  return (
    <div className="p-12 max-w-6xl mx-auto relative z-10 transition-colors duration-300">
      {/* Header */}
      <div className="mb-16">
        <h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter leading-none mb-4 uppercase italic">
          Settings
        </h2>
        <p className="font-label text-xs uppercase tracking-[0.4em] text-on-surface-variant font-black">
          Architect your digital presence
        </p>
      </div>

      {/* Settings Panel */}
      <div className="bg-surface p-1 rounded-none shadow-editorial border-t-8 border-on-surface overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex gap-12 px-12 pt-10 pb-6 border-b border-outline-variant/20 overflow-x-auto bg-surface-container-lowest">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className="relative pb-4 group"
            >
              <span className={`font-headline text-xl uppercase tracking-tighter ${
                activeTab === tab.toLowerCase()
                  ? 'font-black text-on-surface scale-110 block'
                  : 'font-bold text-outline group-hover:text-on-surface transition-all block'
              }`}>
                {tab}
              </span>
              {activeTab === tab.toLowerCase() && (
                <motion.div 
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 w-full h-1.5 bg-tertiary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Bento Panels Grid */}
        <div className="grid grid-cols-12 gap-1 p-1 bg-outline-variant/10">
          {/* Content Area Based on Active Tab */}
          {activeTab === 'profile' && (
            <>
              {/* Profile Identity Card */}
              <div className="col-span-12 lg:col-span-7 bg-surface p-12">
                <div className="flex items-start justify-between mb-12">
                  <div>
                    <h3 className="font-headline font-black text-3xl uppercase tracking-tighter mb-2 italic text-on-surface">
                      Identity
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-outline">
                      Global Identification parameters
                    </p>
                  </div>
                  {/* Avatar */}
                  <div className="relative group cursor-pointer">
                    <div className="w-28 h-28 rounded-none bg-surface-container-highest flex items-center justify-center border-4 border-on-surface rotate-3 hover:rotate-0 transition-transform overflow-hidden shadow-brutalist">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-on-surface">person</span>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-on-surface/60 rounded-none opacity-0 group-hover:opacity-100 transition-opacity rotate-3 group-hover:rotate-0">
                      <span className="material-symbols-outlined text-surface text-3xl">add_a_photo</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">
                        First sequence
                      </label>
                      <input
                        className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-on-surface transition-all"
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
                        className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-on-surface transition-all"
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
                      className="w-full bg-surface-container-highest border-none rounded-xl p-5 font-body text-sm text-on-surface focus:ring-2 focus:ring-on-surface resize-none h-32"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Defining the brutalist architecture of the future system..."
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 px-12 bg-black dark:bg-white text-white dark:text-black rounded-none font-headline font-black text-sm uppercase tracking-[0.3em] hover:bg-tertiary dark:hover:bg-tertiary dark:hover:text-white hover:scale-[1.05] active:scale-95 transition-all shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] primary-btn-glow disabled:opacity-50"
                  >
                    {saving ? 'Archiving...' : 'Commit Changes'}
                  </button>
                </div>
              </div>

              {/* Right Column: System + Privacy */}
              <div className="col-span-12 lg:col-span-5 space-y-1 bg-outline-variant/10 flex flex-col">
                {/* System Toggles */}
                <div className="bg-surface p-12 flex-1">
                  <h3 className="font-headline font-black text-5xl uppercase tracking-tighter mb-10 italic text-on-surface">
                    System
                  </h3>
                  <div className="space-y-10">
                    {/* Dark Mode */}
                    <Toggle 
                       checked={theme === 'dark'} 
                       onChange={toggleTheme} 
                       label="Obsidian Mode" 
                       sublabel="Switch to the void" 
                    />

                    {/* Kinetic FX Toggle */}
                    <Toggle 
                      checked={kineticFx} 
                      onChange={toggleKineticFx} 
                      label="Kinetic FX" 
                      sublabel="Smooth structural transitions" 
                    />
                  </div>
                </div>

                {/* Security/Privacy */}
                <div className="bg-on-surface text-surface p-12 min-h-[250px] flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline font-black text-5xl uppercase tracking-tighter mb-4 italic">
                      Security
                    </h3>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-surface/50 leading-relaxed max-w-xs">
                      Your data is fragmented across secure editorial nodes. We maintain total protocol integrity.
                    </p>
                  </div>
                  <button
                    className="mt-10 h-14 bg-surface text-on-surface px-8 py-4 font-headline font-black uppercase text-xs tracking-[0.3em] hover:scale-[1.05] transition-transform flex items-center justify-between group"
                  >
                    Archive Records
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                      download
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <div className="col-span-12 bg-surface p-12">
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
                        className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all"
                        name="currentPassword" type="password" value={securityData.currentPassword} onChange={handleSecurityChange} required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">New Key</label>
                      <input
                        className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all"
                        name="newPassword" type="password" value={securityData.newPassword} onChange={handleSecurityChange} required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">Confirm New Key</label>
                      <input
                        className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all"
                        name="confirmPassword" type="password" value={securityData.confirmPassword} onChange={handleSecurityChange} required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-14 px-12 bg-black dark:bg-white text-white dark:text-black rounded-none font-headline font-black text-sm uppercase tracking-[0.3em] hover:bg-tertiary transition-all disabled:opacity-50"
                    >
                      Update Sequence
                    </button>
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
                    <div className="space-y-4 p-6 bg-surface-container-highest rounded-xl">
                      <p className="text-[10px] font-black uppercase text-outline">Current Active ID</p>
                      <p className="font-headline font-black text-xl text-on-surface">{user?.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">New Identity Email</label>
                      <input
                        className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all"
                        name="newEmail" type="email" value={securityData.newEmail} onChange={handleSecurityChange} required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] text-outline ml-1">Authorization Password</label>
                      <input
                        className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-5 font-headline font-black text-sm uppercase tracking-widest text-on-surface focus:ring-2 focus:ring-on-surface transition-all"
                        name="emailPassword" type="password" value={securityData.emailPassword} onChange={handleSecurityChange} required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-14 px-12 border-4 border-black dark:border-white text-on-surface rounded-none font-headline font-black text-sm uppercase tracking-[0.3em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-50"
                    >
                      Initiate Change
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="col-span-12 bg-surface p-12">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h3 className="font-headline font-black text-3xl uppercase tracking-tighter mb-2 italic text-on-surface">
                    Active Sessions
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-outline">
                    Connected nodes across the network
                  </p>
                </div>
                <button
                  onClick={() => terminateAllSessions(true)}
                  className="px-6 py-3 border-2 border-tertiary text-tertiary font-headline font-black text-[10px] uppercase tracking-widest hover:bg-tertiary hover:text-white transition-all"
                >
                  Terminate All Others
                </button>
              </div>

              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.sid} className={`p-8 flex items-center justify-between transition-all ${session.isCurrent ? 'bg-on-surface text-surface' : 'bg-surface-container-low hover:bg-surface-container-high'}`}>
                    <div className="flex items-center gap-8">
                      <span className="material-symbols-outlined text-4xl">
                        {session.deviceType === 'mobile' ? 'smartphone' : 'desktop_windows'}
                      </span>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-headline font-black text-xl uppercase tracking-tight">{session.browser} on {session.os}</h4>
                          {session.isCurrent && (
                            <span className="bg-tertiary text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">Active Node</span>
                          )}
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${session.isCurrent ? 'text-surface/60' : 'text-outline'}`}>
                          IP: {session.ipAddress} • Last sync: {new Date(session.lastActivityAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        onClick={() => handleTerminateSession(session.sid)}
                        className="h-12 w-12 flex items-center justify-center text-outline hover:text-tertiary transition-colors"
                      >
                        <span className="material-symbols-outlined">logout</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
             <div className="col-span-12 bg-surface p-12">
                <h3 className="font-headline font-black text-5xl uppercase tracking-tighter mb-10 italic text-on-surface">
                  Alert Protocols
                </h3>
                <p className="text-sm font-medium text-outline uppercase tracking-widest italic">
                  Notification system integration in progress.
                </p>
             </div>
          )}

          {/* Footer Bento: Security Score + Support */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container p-12">
            <div className="flex items-center gap-4 mb-8">
              <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
              <h4 className="font-headline font-black text-2xl uppercase tracking-tighter italic text-on-surface">
                Protocol Integrity
              </h4>
            </div>
            <div className="w-full bg-on-surface/5 h-3 rounded-none mb-4 overflow-hidden">
              <div className="bg-tertiary w-3/4 h-full" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/40">
              THREAT LEVEL: NEGLIGIBLE
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8 bg-surface p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h4 className="font-headline font-black text-2xl uppercase tracking-tighter mb-2 italic text-on-surface">
                Support Node
              </h4>
              <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-outline">
                Our editorial response team is available for total system restoration 24/7.
              </p>
            </div>
            <div className="flex gap-6">
              <button className="px-8 py-4 border-4 border-on-surface text-on-surface font-headline font-black text-xs uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-all">
                Restoration
              </button>
              <button
                onClick={handleLogout}
                className="px-8 py-4 bg-tertiary text-white font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.05] transition-all"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background oversized vertical text */}
      <span className="fixed top-1/2 right-12 font-headline font-black text-[8rem] text-on-surface/[0.02] rotate-90 uppercase pointer-events-none select-none z-0">
        PARAM
      </span>
    </div>
  )
}
