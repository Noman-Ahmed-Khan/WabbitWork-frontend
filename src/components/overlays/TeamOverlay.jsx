import { useState, useEffect } from 'react'
import useUIStore from '../../stores/uiStore'
import useTeamStore from '../../stores/teamStore'
import Input from '../primitives/Input'
import Button from '../primitives/Button'

/**
 * Team create/edit overlay
 */
export default function TeamOverlay({ onSuccess }) {
  const { overlayData, closeOverlay } = useUIStore()
  const { createTeam, updateTeam, loading } = useTeamStore()
  
  const isEdit = !!overlayData
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (overlayData) {
      setFormData({
        name: overlayData.name || '',
        description: overlayData.description || '',
      })
    }
  }, [overlayData])

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
      if (isEdit) {
        await updateTeam(overlayData.id, formData)
      } else {
        await createTeam(formData)
      }
      onSuccess?.()
      closeOverlay()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box overlay-enter">
        <h3 className="font-bold text-lg mb-4">
          {isEdit ? 'Edit Team' : 'Create New Team'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Team Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Development Team"
            required
            maxLength={100}
          />

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description (Optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
              placeholder="What is this team about?"
              maxLength={500}
            />
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
              {isEdit ? 'Update Team' : 'Create Team'}
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