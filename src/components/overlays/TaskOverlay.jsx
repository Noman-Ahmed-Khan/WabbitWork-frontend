import { useState, useEffect } from 'react'
import { useUI } from '../../state/ui.store'
import Input from '../primitives/Input'
import Select from '../primitives/Select'
import Button from '../primitives/Button'
import tasksApi from '../../api/tasks'
import teamsApi from '../../api/teams'

export default function TaskOverlay({ onSuccess }) {
  const { overlayData, closeOverlay } = useUI()
  const isEdit = !!overlayData
  
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [loadingMembers, setLoadingMembers] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team_id: '',
    assigned_to: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load teams on mount
  useEffect(() => {
    loadTeams()
  }, [])

  // Populate form when editing
  useEffect(() => {
    if (overlayData) {
      setFormData({
        title: overlayData.title || '',
        description: overlayData.description || '',
        team_id: overlayData.team_id || '',
        assigned_to: overlayData.assigned_to || '',
        status: overlayData.status || 'todo',
        priority: overlayData.priority || 'medium',
        due_date: overlayData.due_date || '',
      })
      
      // Load members for the team
      if (overlayData.team_id) {
        loadMembers(overlayData.team_id)
      }
    }
  }, [overlayData])

  // Load members when team changes
  useEffect(() => {
    if (formData.team_id && !isEdit) {
      loadMembers(formData.team_id)
    }
  }, [formData.team_id, isEdit])

  const loadTeams = async () => {
    try {
      setLoadingTeams(true)
      const response = await teamsApi.getAll()
      setTeams(response.data.teams)
    } catch (err) {
      console.error('Failed to load teams:', err)
    } finally {
      setLoadingTeams(false)
    }
  }

  const loadMembers = async (teamId) => {
    try {
      setLoadingMembers(true)
      const response = await teamsApi.getMembers(teamId)
      setMembers(response.data.members)
    } catch (err) {
      console.error('Failed to load members:', err)
      setMembers([])
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset assignee when team changes
      ...(name === 'team_id' && { assigned_to: '' })
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Prepare payload
      const payload = {
        ...formData,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date || null,
      }

      if (isEdit) {
        await tasksApi.update(overlayData.id, payload)
      } else {
        await tasksApi.create(payload)
      }
      
      onSuccess?.()
      closeOverlay()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl overlay-enter">
        <h3 className="font-bold text-lg mb-4">
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <Input
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Implement login feature"
            required
            maxLength={255}
          />

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description (Optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
              placeholder="Add more details about this task..."
              maxLength={2000}
            />
          </div>

          {/* Team & Assignment Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team */}
            <Select
              label="Team"
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
              options={teams.map(team => ({
                value: team.id,
                label: team.name
              }))}
              placeholder="Select team"
              required
              disabled={isEdit} // Can't change team when editing
            />

            {/* Assigned To */}
            <Select
              label="Assign To (Optional)"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              options={members.map(member => ({
                value: member.user_id,
                label: `${member.first_name} ${member.last_name}`
              }))}
              placeholder={loadingMembers ? 'Loading...' : 'Unassigned'}
              disabled={!formData.team_id || loadingMembers}
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'todo', label: 'To Do' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'review', label: 'Review' },
                { value: 'completed', label: 'Completed' },
              ]}
            />

            {/* Priority */}
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
          </div>

          {/* Due Date */}
          <Input
            label="Due Date (Optional)"
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />

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
              disabled={loadingTeams}
            >
              {isEdit ? 'Update Task' : 'Create Task'}
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