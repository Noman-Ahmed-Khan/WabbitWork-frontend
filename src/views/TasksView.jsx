import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import TaskOverlay from '../components/overlays/TaskOverlay'
import Spinner from '../components/primitives/Spinner'
import useTaskStore from '../stores/taskStore'
import useTeamStore from '../stores/teamStore'
import useUIStore from '../stores/uiStore'
import useRouteSearch from '../hooks/useRouteSearch'
import { containerVariants, itemVariants, cardVariants, buttonVariants } from '../animations/variants'

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
  const { searchQuery, clearSearchQuery, hasSearchQuery } = useRouteSearch()

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
    setFilters({ team_id: location.state?.teamId || '' })
  }, [location.state, setFilters])

  useEffect(() => {
    const nextSearch = searchQuery.trim()
    const currentSearch = (filters.search || '').trim()

    if (nextSearch === currentSearch) {
      return
    }

    const timer = window.setTimeout(() => {
      setFilters({ search: nextSearch })
    }, 250)

    return () => window.clearTimeout(timer)
  }, [filters.search, searchQuery, setFilters])

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
  const completedCount = stats.completed ?? stats.by_status?.completed ?? 0
  const totalTasks = stats.total || tasks.length || 1
  const completedPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-8 lg:p-12 relative overflow-hidden"
    >
      {/* Background Kinetic Text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <motion.h1 
          initial={{ opacity: 0, x: -150, rotate: -10 }}
          animate={{ opacity: 0.1, x: 0, rotate: 0 }}
          transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-[8rem] sm:text-[12rem] md:text-[15rem] lg:text-[20rem] font-black font-headline text-on-surface leading-none tracking-tighter uppercase"
          aria-hidden="true"
        >
          Tasks
        </motion.h1>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Heading */}
        <motion.div variants={itemVariants} className="mb-12 md:mb-16">
          <h1 className="font-headline font-black text-[3.5rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[8rem] leading-[0.8] tracking-tighter text-on-surface opacity-90 uppercase">
            Tasks
          </h1>
          <div className="flex items-center justify-between mt-4">
            <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant font-bold">
              {hasSearchQuery
                ? `${tasks.length} result${tasks.length === 1 ? '' : 's'} for "${searchQuery.trim()}"`
                : `Editorial Pipeline / ${tasks.length} Active`}
            </p>
            {hasSearchQuery ? (
              <motion.button
                type="button"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={clearSearchQuery}
                className="font-headline text-[10px] uppercase tracking-widest border-b-2 border-on-surface text-on-surface pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                Clear Search
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-1 bg-on-surface" 
                />
                <span className="h-1 w-4 bg-on-surface opacity-30" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Task List Container */}
        <motion.div 
          variants={itemVariants}
          className="bg-surface-container/30 backdrop-blur-sm p-4 md:p-8 space-y-4 rounded-xl shadow-inner min-h-[400px]"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <motion.div variants={containerVariants} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {tasks.length > 0 ? (
                  tasks.map((task) => {
                    const priority = priorityConfig[task.priority] || priorityConfig.medium
                    return (
                      <motion.button
                        type="button"
                        key={task.id}
                        layout
                        variants={cardVariants}
                        whileHover={{ y: -2, transition: { type: 'spring', stiffness: 360, damping: 30 } }}
                        className="group transform-gpu will-change-transform w-full text-left flex flex-col sm:flex-row items-start sm:items-center bg-surface-container-high p-4 md:p-6 transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out relative overflow-hidden gap-4 sm:gap-0 border border-outline-variant/10 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                        onClick={() => handleEditTask(task)}
                        aria-label={`Edit task ${task.title}`}
                      >
                        {/* Priority bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${priority.border.replace('border-', 'bg-')}`} />

                        <div className="pointer-events-none absolute inset-0 z-20 translate-y-1 scale-[0.99] opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                          <div className="absolute inset-0 bg-surface-container-high/80 backdrop-blur-lg" />
                          <div className="relative flex h-full flex-col justify-between p-4 md:p-6">
                            <div className="space-y-3 pr-12">
                              <span className="block text-[10px] font-black uppercase tracking-[0.28em] text-on-surface/80">
                                Quick Preview
                              </span>
                              <h4 className="font-headline text-lg md:text-2xl font-black uppercase tracking-tight leading-tight text-on-surface/95 break-words line-clamp-3">
                                {task.title}
                              </h4>
                              {task.description ? (
                                <p className="text-sm md:text-base text-on-surface/95 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto pr-2">
                                  {task.description}
                                </p>
                              ) : (
                                <p className="text-sm text-on-surface/80 leading-relaxed">
                                  No description provided for this task.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="relative z-10 flex-1 min-w-0 pl-4">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <span className={`${priority.bg} ${priority.text} px-2 py-0.5 text-[10px] font-black uppercase tracking-widest`}>
                              {priority.label}
                            </span>
                            <span className="text-xs font-label text-on-surface-variant opacity-60">
                              ID-{task.id?.slice(-4) || '0000'}
                            </span>
                          </div>
                          <div className="transition-opacity duration-150 ease-out group-hover:opacity-0 group-focus-visible:opacity-0">
                            <h3 className="font-headline text-lg md:text-xl font-bold text-on-surface break-words line-clamp-2">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="mt-2 text-sm text-on-surface-variant/80 leading-relaxed line-clamp-2 break-words">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between w-full sm:w-auto gap-4 md:gap-8 border-t border-outline-variant/30 sm:border-t-0 pt-4 sm:pt-0">
                          <div className="sm:text-right">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">
                              {task.due_date ? 'Deadline' : 'Status'}
                            </span>
                            <span className="font-headline font-bold text-on-surface text-sm sm:text-base">
                              {task.due_date
                                ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : task.status?.replace('_', ' ') || 'Active'}
                            </span>
                          </div>
                          <motion.div 
                            whileHover={{ rotate: 90, scale: 1.2 }}
                            aria-hidden="true"
                            className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-full border border-outline-variant group-hover:bg-on-surface group-hover:text-surface transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm md:text-base text-on-surface group-hover:text-surface">chevron_right</span>
                          </motion.div>
                        </div>
                      </motion.button>
                    )
                  })
                ) : (
                  <motion.div 
                    variants={itemVariants}
                    className="text-center py-20"
                  >
                    <div className="font-headline font-black text-6xl leading-[0.9] text-on-surface-variant/20 italic select-none mb-8">
                      EMPTY<br />PIPELINE
                    </div>
                    <p className="text-on-surface-variant text-sm mb-8">
                      {hasSearchQuery
                        ? `No tasks match "${searchQuery.trim()}".`
                        : 'No tasks in the current filter. Create one to begin.'}
                    </p>
                    {hasSearchQuery && (
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        type="button"
                        onClick={clearSearchQuery}
                        className="mb-6 bg-surface-container-highest text-on-surface px-6 py-2 font-headline font-black text-[10px] uppercase tracking-widest shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                      >
                        Clear Search
                      </motion.button>
                    )}
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                      onClick={() => openOverlay('task')}
                      className="bg-on-surface text-surface px-8 py-3 font-headline font-black text-xs uppercase tracking-widest shadow-brutalist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                    >
                      Create Task
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Stats + Tip */}
        <div className="mt-12 flex flex-col md:flex-row gap-12">
          <motion.div variants={itemVariants} className="flex-1 border-t-8 border-on-surface pt-6">
            <h4 className="font-headline font-black text-2xl uppercase tracking-tighter mb-6">
              Production Velocity
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -4, rotate: -1 }}
                className="bg-surface-container-highest p-6 shadow-brutalist"
              >
                <span className="block text-[15px] font-black uppercase opacity-40 text-on-surface mb-2">Completion Rate</span>
                <span className="text-5xl font-headline font-black text-on-surface">{completedPct}%</span>
              </motion.div>
              <motion.div 
                whileHover={{ y: -4, rotate: 1 }}
                className="bg-on-tertiary-container p-6 shadow-brutalist text-tertiary"
              >
                <span className="block text-[15px] font-black uppercase opacity-70 text-tertiary mb-2">Active Units</span>
                <span className="text-5xl font-headline font-black">{tasks.length}</span>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 0.98 }}
            className="w-full md:w-1/3 bg-on-surface text-surface p-10 shadow-brutalist relative overflow-hidden group"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-8 -top-8 text-[10rem] opacity-5 select-none pointer-events-none"
            >
              <span className="material-symbols-outlined text-[10rem]">settings_heart</span>
            </motion.div>
            <span className="material-symbols-outlined text-4xl mb-4 text-tertiary">auto_awesome</span>
            <h4 className="font-headline font-bold text-xl mb-3 leading-tight uppercase tracking-tighter">
              Protocol Optimization:
            </h4>
            <p className="font-label text-xs opacity-80 leading-relaxed uppercase tracking-widest">
              {tasks.length > 5
                ? "Multiple active units detected. Prioritize urgent status to maintain editorial velocity."
                : "Editorial pipeline is optimized. Recommended action: Initialize new project backlog."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50">
        <motion.button
          type="button"
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="bg-on-surface text-surface h-14 w-14 md:h-16 md:w-16 flex items-center justify-center shadow-2xl group border-4 border-surface font-headline font-black"
          onClick={() => openOverlay('task')}
          aria-label="Create new task"
        >
          <span className="material-symbols-outlined text-3xl">
            add
          </span>
        </motion.button>
      </div>

      {/* Task Overlay */}
      <AnimatePresence>
        {activeOverlay === 'task' && (
          <TaskOverlay onSuccess={loadTasks} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
