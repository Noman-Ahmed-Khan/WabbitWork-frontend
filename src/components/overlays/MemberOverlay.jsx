import { useState } from 'react'
import useUIStore from '../../stores/uiStore'
import useTeamStore from '../../stores/teamStore'
import Input from '../primitives/Input'
import Select from '../primitives/Select'
import Button from '../primitives/Button'

/**
 * Member invitation overlay
 */
export default function MemberOverlay({ teamId, onSuccess }) {
  const { closeOverlay } = useUIStore()
  const { addMember, loading } = useTeamStore()
  
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await addMember(teamId, formData)
      onSuccess?.()
      closeOverlay()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box overlay-enter">
        <h3 className="font-bold text-lg mb-4">Add Team Member</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="member@example.com"
            required
          />

          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: 'member', label: 'Member' },
              { value: 'admin', label: 'Admin' },
            ]}
          />

          <div className="text-sm text-base-content/60">
            <p className="mb-2 font-medium">Role permissions:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Member:</strong> Can view and create tasks</li>
              <li><strong>Admin:</strong> Can manage members and tasks</li>
            </ul>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="modal-action">
            <Button
              type="button"
              variant="ghost"
              onClick={closeOverlay}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Add Member
            </Button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={closeOverlay}>
        <button>close</button>
      </form>
    </dialog>
  )
}