import { useEffect, useState } from 'react'
import { Save, Bell, Mail } from 'lucide-react'
import useNotificationStore from '../../stores/notificationStore'
import Button from '../primitives/Button'
import Spinner from '../primitives/Spinner'
import Panel from '../../layouts/Panel'

/**
 * Notification type labels
 */
const NOTIFICATION_TYPES = {
  team_invitation: 'Team Invitations',
  invitation_accepted: 'Invitation Accepted',
  invitation_declined: 'Invitation Declined',
  task_assigned: 'Task Assigned to Me',
  task_updated: 'Task Updates',
  task_completed: 'Task Completed',
  task_comment: 'Task Comments',
  member_added: 'Team Member Added',
  member_removed: 'Team Member Removed',
  role_changed: 'Role Changed',
  due_date_reminder: 'Due Date Reminders',
  task_overdue: 'Overdue Tasks',
}

/**
 * Notification preferences panel
 */
export default function NotificationPreferences() {
  const [saving, setSaving] = useState(false)
  const [localPreferences, setLocalPreferences] = useState(null)
  
  const { 
    preferences, 
    loading, 
    fetchPreferences, 
    updatePreferences 
  } = useNotificationStore()

  // Fetch preferences on mount
  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  // Update local preferences when store preferences change
  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences)
    }
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
      
      // Show success message (you can add a toast here)
      alert('Preferences saved successfully!')
    } catch (error) {
      alert('Failed to save preferences. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(localPreferences)

  if (loading && !preferences) {
    return (
      <Panel>
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </Panel>
    )
  }

  return (
    <Panel>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold mb-1">Notification Preferences</h2>
          <p className="text-sm text-base-content/60">
            Choose how you want to be notified for different events
          </p>
        </div>

        {/* Preferences table */}
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Notification Type</th>
                <th className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Bell size={14} />
                    <span>In-App</span>
                  </div>
                </th>
                <th className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Mail size={14} />
                    <span>Email</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(NOTIFICATION_TYPES).map(([key, label]) => (
                <tr key={key} className="hover">
                  <td className="font-medium">{label}</td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary"
                      checked={localPreferences?.[`inapp_${key}`] ?? true}
                      onChange={() => handleToggle(`inapp_${key}`)}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary"
                      checked={localPreferences?.[`email_${key}`] ?? true}
                      onChange={() => handleToggle(`email_${key}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save button */}
        {hasChanges && (
          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              onClick={handleSave}
              loading={saving}
            >
              <Save size={16} />
              Save Preferences
            </Button>
          </div>
        )}
      </div>
    </Panel>
  )
}