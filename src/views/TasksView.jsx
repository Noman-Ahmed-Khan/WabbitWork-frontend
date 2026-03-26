import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import TaskOverlay from '../components/overlays/TaskOverlay'
import Spinner from '../components/primitives/Spinner'
import useTaskStore from '../stores/taskStore'
import useTeamStore from '../stores/teamStore'
import useUIStore from '../stores/uiStore'

const priorityConfig = {
  urgent: { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', border: 'border-tertiary', label: 'URGENT' },
  high: { bg: 'bg-tertiary-fixed', text: 'text-white', border: 'border-tertiary-fixed', label: 'HIGH' },
  medium: { bg: 'bg-secondary-container', text: 'text-on-secondary-container', border: 'border-secondary', label: 'MEDIUM' },
  low: { bg: 'bg-surface-container-highest', text: 'text-on-surface-variant', border: 'border-outline-variant', label: 'LOW' },
}

/**
 * Tasks View - Brutalist Editorial Design
 */
export default function TasksView() {
  const location = useLocation()
  const { activeOverlay, openOverlay } = useUIStore()

  const {
    tasks,
    filters,
    loading,
    setFilters,
    loadTasks,
    deleteTask,
    dashboardStats,
  } = useTaskStore()

  const { teams, loadTeams } = useTeamStore()

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  useEffect(() => {
    if (location.state?.teamId) {
      setFilters({ team_id: location.state.teamId })
    }
  }, [location.state, setFilters])

  useEffect(() => {
    loadTasks()
  }, [filters, loadTasks])

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

  const stats = dashboardStats?.stats || {}
  const completedCount = stats.by_status?.completed || 0
  const totalTasks = stats.total || tasks.length || 1
  const completedPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <div className="p-12 relative">
      <div className="max-w-6xl mx-auto">
        {/* Hero Heading */}
        <div className="mb-16">
          <h1 className="font-headline font-black text-[8rem] leading-[0.8] tracking-tighter text-on-surface opacity-90 uppercase">
            Tasks
          </h1>
          <div className="flex items-center justify-between mt-4">
            <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant font-bold">
              Editorial Pipeline / {tasks.length} Active
            </p>
            <div className="flex gap-2">
              <span className="h-1 w-12 bg-on-surface" />
              <span className="h-1 w-4 bg-on-surface opacity-30" />
            </div>
          </div>
        </div>

        {/* Task List Container */}
        <div className="bg-surface-container-high p-8 space-y-4 rounded-xl shadow-inner min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : tasks.length > 0 ? (
            tasks.map((task) => {
              const priority = priorityConfig[task.priority] || priorityConfig.medium
              return (
                <motion.div
                  key={task.id}
                  className="group flex items-center bg-surface-container-lowest p-6 hover:scale-[1.01] hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden"
                  onClick={() => handleEditTask(task)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Priority bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${priority.border.replace('border-', 'bg-')}`} />
                  
                  <div className="flex-1 pl-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`${priority.bg} ${priority.text} px-2 py-0.5 text-[10px] font-black uppercase tracking-widest`}>
                        {priority.label}
                      </span>
                      <span className="text-xs font-label text-on-surface-variant opacity-60">
                        ID-{task.id?.slice(-4) || '0000'}
                      </span>
                    </div>
                    <h3 className="font-headline text-xl font-bold text-on-surface">
                      {task.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">
                        {task.due_date ? 'Deadline' : 'Status'}
                      </span>
                      <span className="font-headline font-bold text-on-surface">
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : task.status?.replace('_', ' ') || 'Active'}
                      </span>
                    </div>
                    <div className="h-10 w-10 flex items-center justify-center rounded-full border border-outline-variant group-hover:bg-on-surface group-hover:text-surface transition-colors">
                      <span className="material-symbols-outlined text-on-surface group-hover:text-surface">chevron_right</span>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-20">
              <div className="font-headline font-black text-6xl leading-[0.9] text-on-surface-variant/20 italic select-none mb-8">
                EMPTY<br />PIPELINE
              </div>
              <p className="text-on-surface-variant text-sm mb-8">
                No tasks in the current filter. Create one to begin.
              </p>
              <button
                onClick={() => openOverlay('task')}
                className="bg-on-surface text-surface px-8 py-3 font-headline font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Create Task
              </button>
            </div>
          )}
        </div>

        {/* Bottom Stats + Tip */}
        <div className="mt-12 flex flex-col md:flex-row gap-12">
          <div className="flex-1 border-t-4 border-on-surface pt-6">
            <h4 className="font-headline font-black text-2xl uppercase tracking-tighter mb-4">
              Productivity Stats
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-highest p-6">
                <span className="block text-[10px] font-black uppercase opacity-40 text-on-surface">Completed</span>
                <span className="text-4xl font-headline font-black text-on-surface">{completedPct}%</span>
              </div>
              <div className="bg-surface-container-highest p-6">
                <span className="block text-[10px] font-black uppercase opacity-40 text-on-surface">Active</span>
                <span className="text-4xl font-headline font-black text-on-surface">{tasks.length}</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 bg-on-surface text-surface p-8 shadow-brutalist">
            <span className="material-symbols-outlined text-4xl mb-4">auto_awesome</span>
            <h4 className="font-headline font-bold text-lg mb-2 leading-tight">
              Optimization Tip:
            </h4>
            <p className="font-label text-xs opacity-80 leading-relaxed">
              {tasks.length > 5
                ? "You have multiple active tasks. Try prioritizing your urgent items first to maintain editorial flow."
                : "Your pipeline is light. Great time to pick up new items from the backlog."}
            </p>
          </div>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          className="bg-on-surface text-surface h-16 w-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group border-4 border-surface"
          onClick={() => openOverlay('task')}
          whileTap={{ scale: 0.9 }}
        >
          <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">
            add
          </span>
        </motion.button>
      </div>

      {/* Task Overlay */}
      {activeOverlay === 'task' && (
        <TaskOverlay onSuccess={loadTasks} />
      )}
    </div>
  )
}