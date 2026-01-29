import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Shell from '../layouts/Shell'
import Panel from '../layouts/Panel'
import StatsPanel from '../components/panels/StatsPanel'
import TaskPanel from '../components/panels/TaskPanel'
import Button from '../components/primitives/Button'
import Spinner from '../components/primitives/Spinner'
import useTaskStore from '../stores/taskStore'
import useUIStore from '../stores/uiStore'
import config from '../config/env'

/**
 * Dashboard view
 * Shows task statistics and important tasks
 */
export default function DashboardView() {
  const navigate = useNavigate()
  const { openOverlay } = useUIStore()
  
  const {
    dashboardStats,
    loading,
    error,
    loadDashboardStats,
    deleteTask,
  } = useTaskStore()

  useEffect(() => {
    loadDashboardStats()
  }, [loadDashboardStats])

  const handleEditTask = (task) => {
    openOverlay('task', task)
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return
    
    try {
      await deleteTask(taskId)
      await loadDashboardStats()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading && !dashboardStats) {
    return (
      <Shell>
        <Spinner />
      </Shell>
    )
  }

  if (error) {
    return (
      <Shell>
        <Panel>
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </Panel>
      </Shell>
    )
  }

  const dueSoonTasks = dashboardStats?.due_soon || []
  const overdueTasks = dashboardStats?.overdue || []

  return (
    <Shell>
      <div className="space-y-6 mb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-base-content/60">Overview of your tasks</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/tasks')}
          >
            View All Tasks
          </Button>
        </div>

        {/* Stats */}
        <StatsPanel stats={dashboardStats?.stats} loading={loading} />

        {/* Overdue tasks */}
        {config.features.dueDateReminders && overdueTasks.length > 0 && (
          <Panel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>🚨</span>
                <span>Overdue Tasks</span>
                <span className="badge badge-error">{overdueTasks.length}</span>
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {overdueTasks.map((task) => (
                <TaskPanel
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </Panel>
        )}

        {/* Due soon tasks */}
        {config.features.dueDateReminders && dueSoonTasks.length > 0 && (
          <Panel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>⏰</span>
                <span>Due Soon</span>
                <span className="badge badge-warning">{dueSoonTasks.length}</span>
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dueSoonTasks.map((task) => (
                <TaskPanel
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </Panel>
        )}

        {/* Empty state */}
        {overdueTasks.length === 0 && dueSoonTasks.length === 0 && (
          <Panel>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
              <p className="text-base-content/60 mb-6">
                No overdue or urgent tasks at the moment.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/tasks')}
              >
                View All Tasks
              </Button>
            </div>
          </Panel>
        )}
      </div>
    </Shell>
  )
}