import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckSquare, Plus, Search, Filter, X } from 'lucide-react'
import Panel from '../layouts/Panel'
import TaskPanel from '../components/panels/TaskPanel'
import Button from '../components/primitives/Button'
import Input from '../components/primitives/Input'
import Select from '../components/primitives/Select'
import Spinner from '../components/primitives/Spinner'
import TaskOverlay from '../components/overlays/TaskOverlay'
import useTaskStore from '../stores/taskStore'
import useTeamStore from '../stores/teamStore'
import useUIStore from '../stores/uiStore'

/**
 * Tasks view
 * Manage and filter tasks
 */
export default function TasksView() {
  const location = useLocation()
  const { activeOverlay, openOverlay } = useUIStore()

  const {
    tasks,
    filters,
    loading,
    setFilters,
    resetFilters,
    loadTasks,
    deleteTask,
  } = useTaskStore()

  const { teams, members, loadTeams, loadMembers } = useTeamStore()

  // Load teams on mount
  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  // Initialize filters from navigation state (if coming from teams page)
  useEffect(() => {
    if (location.state?.teamId) {
      setFilters({ team_id: location.state.teamId })
    }
  }, [location.state, setFilters])

  // Load tasks when filters change
  useEffect(() => {
    loadTasks()
  }, [filters, loadTasks])

  // Load members when team filter changes (only if team_id is valid)
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (filters.team_id && filters.team_id.trim() !== '') {
        try {
          await loadMembers(filters.team_id)
        } catch (error) {
          console.error('Failed to load team members:', error)
          // Optionally clear the team filter if it's invalid
          // setFilters({ team_id: '', assigned_to: '' })
        }
      }
    }

    loadTeamMembers()
  }, [filters.team_id, loadMembers])

  const handleFilterChange = (name, value) => {
    setFilters({
      [name]: value,
      // Reset assignee when team changes
      ...(name === 'team_id' && { assigned_to: '' })
    })
  }

  const handleEditTask = (task) => {
    openOverlay('task', task)
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return

    try {
      await deleteTask(taskId)
    } catch (err) {
      alert(err.message)
    }
  }

  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length

  return (
    <div className="space-y-4 mb-24">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <CheckSquare size={24} />
              Tasks
            </h1>
            <p className="text-sm text-base-content/60">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => openOverlay('task')}
          >
            <Plus size={16} />
            Create Task
          </Button>
        </div>

        {/* Filters */}
        <Panel>
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <Input
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                disabled={!filters.team_id || members.length === 0}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <label className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={filters.assigned_to_me}
                  onChange={(e) => handleFilterChange('assigned_to_me', e.target.checked)}
                />
                <span className="label-text text-sm">Assigned to me</span>
              </label>

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                >
                  <X size={14} />
                  Clear ({activeFilterCount})
                </Button>
              )}
            </div>
          </div>
        </Panel>

        {/* Tasks Grid */}
        {loading ? (
          <Spinner />
        ) : tasks.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
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
              <CheckSquare size={64} className="mx-auto mb-4 text-base-content/40" />
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
                  <Plus size={18} />
                  Create Task
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                >
                  <Filter size={18} />
                  Clear Filters
                </Button>
              )}
            </div>
          </Panel>
        )}

        {/* Task Overlay */}
        {activeOverlay === 'task' && (
          <TaskOverlay onSuccess={loadTasks} />
        )}
      </div>
  )
}