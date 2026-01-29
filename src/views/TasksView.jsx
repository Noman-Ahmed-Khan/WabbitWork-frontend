import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Shell from '../layouts/Shell'
import Panel from '../layouts/Panel'
import TaskPanel from '../components/panels/TaskPanel'
import Button from '../components/primitives/Button'
import Input from '../components/primitives/Input'
import Select from '../components/primitives/Select'
import Spinner from '../components/primitives/Spinner'
import TaskOverlay from '../components/overlays/TaskOverlay'
import tasksApi from '../api/tasks'
import teamsApi from '../api/teams'
import { useUI } from '../state/ui.store'
import { useAuth } from '../state/auth.store'

export default function TasksView() {
  const location = useLocation()
  const { user } = useAuth()
  const { activeOverlay, openOverlay } = useUI()

  const [tasks, setTasks] = useState([])
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    team_id: location.state?.teamId || '',
    status: '',
    priority: '',
    assigned_to: '',
    assigned_to_me: false,
  })

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    loadTasks()
  }, [filters])

  useEffect(() => {
    if (filters.team_id) {
      loadMembers(filters.team_id)
    } else {
      setMembers([])
    }
  }, [filters.team_id])

  const loadTeams = async () => {
    try {
      const response = await teamsApi.getAll()
      setTeams(response.data.teams)
    } catch (err) {
      console.error('Failed to load teams:', err)
    }
  }

  const loadMembers = async (teamId) => {
    try {
      const response = await teamsApi.getMembers(teamId)
      setMembers(response.data.members)
    } catch (err) {
      console.error('Failed to load members:', err)
    }
  }

  const loadTasks = async () => {
    try {
      setLoading(true)
      
      // Build query params
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.team_id) params.team_id = filters.team_id
      if (filters.status) params.status = filters.status
      if (filters.priority) params.priority = filters.priority
      if (filters.assigned_to) params.assigned_to = filters.assigned_to
      if (filters.assigned_to_me) params.assigned_to_me = true

      const response = await tasksApi.getAll(params)
      setTasks(response.data.tasks)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset assignee filter when team changes
      ...(name === 'team_id' && { assigned_to: '' })
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      team_id: '',
      status: '',
      priority: '',
      assigned_to: '',
      assigned_to_me: false,
    })
  }

  const handleEditTask = (task) => {
    openOverlay('task', task)
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return

    try {
      await tasksApi.delete(taskId)
      loadTasks()
    } catch (err) {
      alert(err.message)
    }
  }

  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length

  return (
    <Shell>
      <div className="space-y-6 mb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Tasks</h1>
            <p className="text-base-content/60">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => openOverlay('task')}
          >
            + Create Task
          </Button>
        </div>

        {/* Filters */}
        <Panel>
          <div className="space-y-4">
            {/* Search */}
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Team Filter */}
              <Select
                placeholder="All Teams"
                value={filters.team_id}
                onChange={(e) => handleFilterChange('team_id', e.target.value)}
                options={teams.map(team => ({
                  value: team.id,
                  label: team.name
                }))}
              />

              {/* Status Filter */}
              <Select
                placeholder="All Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={[
                  { value: 'todo', label: 'To Do' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'review', label: 'Review' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />

              {/* Priority Filter */}
              <Select
                placeholder="All Priorities"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
              />

              {/* Assignee Filter */}
              <Select
                placeholder="All Assignees"
                value={filters.assigned_to}
                onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
                options={members.map(member => ({
                  value: member.user_id,
                  label: `${member.first_name} ${member.last_name}`
                }))}
                disabled={!filters.team_id}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <label className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={filters.assigned_to_me}
                  onChange={(e) => handleFilterChange('assigned_to_me', e.target.checked)}
                />
                <span className="label-text">Assigned to me</span>
              </label>

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear Filters ({activeFilterCount})
                </Button>
              )}
            </div>
          </div>
        </Panel>

        {/* Tasks Grid */}
        {loading ? (
          <Spinner />
        ) : tasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskPanel
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                showTeam={!filters.team_id}
              />
            ))}
          </div>
        ) : (
          <Panel>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">
                {activeFilterCount > 0 ? 'No tasks found' : 'No tasks yet'}
              </h3>
              <p className="text-base-content/60 mb-6">
                {activeFilterCount > 0
                  ? 'Try adjusting your filters'
                  : 'Create your first task to get started'}
              </p>
              {activeFilterCount === 0 ? (
                <Button
                  variant="primary"
                  onClick={() => openOverlay('task')}
                >
                  Create Task
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Panel>
        )}
      </div>

      {/* Task Overlay */}
      {activeOverlay === 'task' && (
        <TaskOverlay onSuccess={loadTasks} />
      )}
    </Shell>
  )
}