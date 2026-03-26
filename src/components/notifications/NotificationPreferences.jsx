import { useEffect, useState } from 'react'
import useNotificationStore from '../../stores/notificationStore'
import Spinner from '../primitives/Spinner'
import Panel from '../../layouts/Panel'

const NOTIFICATION_TYPES = {
  team_invitation: 'Team Invitations',
  invitation_accepted: 'Invitation Accepted',
  invitation_declined: 'Invitation Declined',
  task_assigned: 'Task Assigned',
  task_updated: 'Task Updates',
  task_completed: 'Task Completed',
  due_date_reminder: 'Reminders',
  task_overdue: 'Overdue Alerts',
}

/**
 * Notification Preferences - Brutalist Editorial Design
 * Uses custom toggles and high-contrast editorial layout
 */
export default function NotificationPreferences() {
  const [saving, setSaving] = useState(false)
  const [localPreferences, setLocalPreferences] = useState(null)
  
  const { preferences, loading, fetchPreferences, updatePreferences } = useNotificationStore()

  useEffect(() => { fetchPreferences() }, [fetchPreferences])

  useEffect(() => {
    if (preferences) { setLocalPreferences(preferences) }
  }, [preferences])

  const handleToggle = (key) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await updatePreferences(localPreferences)
    } catch (error) {
      alert('Failed to save preferences.')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(localPreferences)

  if (loading && !preferences) {
    return (
      <Panel className="flex justify-center py-20">
        <Spinner />
      </Panel>
    )
  }

  const Toggle = ({ checked, onChange, label }) => (
    <label className="inline-flex items-center cursor-pointer group">
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only custom-toggle" 
          checked={checked} 
          onChange={onChange} 
        />
        <div className="toggle-bg block w-10 h-6 bg-surface-container-highest rounded-full transition-colors border-2 border-stone-100 group-hover:border-stone-400" />
        <div className="toggle-dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform duration-300 shadow-sm" />
      </div>
      {label && <span className="ml-3 text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant">{label}</span>}
    </label>
  )

  return (
    <Panel className="overflow-hidden">
      <div className="mb-10">
        <h2 className="font-headline font-black text-3xl uppercase tracking-tighter mb-2 italic">Notification Hub</h2>
        <p className="font-label text-xs font-medium text-stone-400 uppercase tracking-[0.2em]">Refine your communication protocols</p>
      </div>

      <div className="space-y-12">
        {Object.entries(NOTIFICATION_TYPES).map(([key, label]) => (
          <div key={key} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-stone-200/50 group">
            <div className="flex-1">
               <h3 className="font-headline font-black text-lg uppercase tracking-tight group-hover:text-tertiary transition-colors">{label}</h3>
               <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest mt-1">Status changes & team alerts for {label}</p>
            </div>
            
            <div className="flex items-center gap-8">
               <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-sm opacity-40">notifications</span>
                  <Toggle 
                    checked={localPreferences?.[`inapp_${key}`] ?? true}
                    onChange={() => handleToggle(`inapp_${key}`)}
                    label="In-App"
                  />
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-sm opacity-40">mail</span>
                  <Toggle 
                    checked={localPreferences?.[`email_${key}`] ?? true}
                    onChange={() => handleToggle(`email_${key}`)}
                    label="Email"
                  />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Save Bar */}
      {hasChanges && (
        <motion.div 
          className="mt-12 sticky bottom-0 bg-white/90 backdrop-blur-md p-6 -mx-8 -mb-8 border-t-4 border-black flex justify-between items-center"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
           <p className="font-headline font-black text-xs uppercase tracking-widest italic">Unsaved Modifications Detected</p>
           <button
             onClick={handleSave}
             disabled={saving}
             className="h-14 px-10 bg-black text-white rounded-none font-headline font-black text-sm uppercase tracking-[0.2em] hover:bg-tertiary hover:scale-[1.05] transition-all flex items-center gap-3"
           >
             {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Apply Protocols'}
           </button>
        </motion.div>
      )}
    </Panel>
  )
}