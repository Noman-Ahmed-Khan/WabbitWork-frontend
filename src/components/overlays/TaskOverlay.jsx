import { useState, useEffect } from 'react'
import useUIStore from '../../stores/uiStore'
import useTaskStore from '../../stores/taskStore'
import useTeamStore from '../../stores/teamStore'
import Input from '../primitives/Input'
import Select from '../primitives/Select'
import Button from '../primitives/Button'

/**
 * Task create/edit overlay
 */
export default function TaskOverlay({ onSuccess }) {
  const { overlayData, closeOverlay } = useUIStore()
  const { createTask, updateTask, loading: taskLoading } = useTaskStore()
  const { teams, members, loadTeams, loadMembers } = useTeamStore()
  
  const isEdit = !!overlayData
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team_id: '',
    assigned_to: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
  })
  
  const [error, setError] = useState('')
  const [loadingTeams, setLoadingTeams] = useState(true)

  // Load teams on mount
  useEffect(() => {
    const initTeams = async () => {
      try {
        await loadTeams()
      } finally {
        setLoadingTeams(false)
      }
    }
    initTeams()
  }, [loadTeams])

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
  }, [overlayData, loadMembers])

  // Load members when team changes
  useEffect(() => {
    if (formData.team_id && !isEdit) {
      loadMembers(formData.team_id)
    }
  }, [formData.team_id, isEdit, loadMembers])

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
    setError('')

    try {
      // Prepare payload
      const payload = {
        ...formData,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date || null,
      }

      if (isEdit) {
        await updateTask(overlayData.id, payload)
      } else {
        await createTask(payload)
      }
      
      onSuccess?.()
      closeOverlay()
    } catch (err) {
      setError(err.message)
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
              disabled={isEdit || loadingTeams}
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
              placeholder="Unassigned"
              disabled={!formData.team_id}
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
              loading={taskLoading}
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