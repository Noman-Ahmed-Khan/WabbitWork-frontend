import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Shell from '../layouts/Shell'
import Panel from '../layouts/Panel'
import StatsPanel from '../components/panels/StatsPanel'
import TaskPanel from '../components/panels/TaskPanel'
import Button from '../components/primitives/Button'
import Spinner from '../components/primitives/Spinner'
import dashboardApi from '../api/dashboard'
import { useUI } from '../state/ui.store'

export default function DashboardView() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { openOverlay } = useUI()

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const response = await dashboardApi.getStats()
      setData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditTask = (task) => {
    openOverlay('task', task)
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return
    
    try {
      const tasksApi = (await import('../api/tasks')).default
      await tasksApi.delete(taskId)
      loadDashboard()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
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
        <StatsPanel stats={data?.stats} loading={false} />

        {/* Overdue tasks */}
        {data?.overdue && data.overdue.length > 0 && (
          <Panel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>🚨</span>
                <span>Overdue Tasks</span>
                <span className="badge badge-error">{data.overdue.length}</span>
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.overdue.map((task) => (
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
        {data?.due_soon && data.due_soon.length > 0 && (
          <Panel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>⏰</span>
                <span>Due Soon</span>
                <span className="badge badge-warning">{data.due_soon.length}</span>
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.due_soon.map((task) => (
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
        {(!data?.overdue || data.overdue.length === 0) &&
         (!data?.due_soon || data.due_soon.length === 0) && (
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