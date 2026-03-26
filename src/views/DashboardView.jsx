import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useTaskStore from '../stores/taskStore'
import useTeamStore from '../stores/teamStore'
import Spinner from '../components/primitives/Spinner'

/**
 * Dashboard View - Brutalist Editorial Design
 * Stats grid, overdue tasks, due soon, team feed, active projects
 */
export default function DashboardView() {
  const navigate = useNavigate()
  const {
    dashboardStats,
    loading,
    error,
    loadDashboardStats,
  } = useTaskStore()

  useEffect(() => {
    loadDashboardStats()
  }, [loadDashboardStats])

  if (loading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    )
  }

  const stats = dashboardStats?.stats || {}
  const dueSoonTasks = dashboardStats?.due_soon || []
  const overdueTasks = dashboardStats?.overdue || []

  const pendingCount = stats.todo || 0
  const inProgressCount = stats.in_progress || 0
  const completedCount = stats.completed || 0
  const totalTasks = stats.total || 1
  const velocity = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <div className="p-12 relative">
      {/* Large Background Heading */}
      <h1 className="font-headline font-bold text-[8rem] leading-[0.8] tracking-tighter text-on-surface opacity-[0.3] dark:opacity-[0.3] absolute -top-8 -left-4 pointer-events-none select-none uppercase">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20 relative z-10">
        <motion.div
          className="bg-surface-container-high p-8 rounded-none group hover:-translate-y-2 transition-transform duration-300 shadow-brutalist"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-headline text-xs font-bold tracking-widest text-on-surface-variant mb-4 uppercase">
            Pending
          </p>
          <p className="font-headline text-7xl font-black text-on-surface">{pendingCount}</p>
          <div className="mt-4 h-1 bg-on-surface w-12 group-hover:w-full transition-all duration-500" />
        </motion.div>

        <motion.div
          className="bg-surface-container-high p-8 rounded-none group hover:-translate-y-2 transition-transform duration-300 shadow-brutalist"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-headline text-xs font-bold tracking-widest text-on-surface-variant mb-4 uppercase">
            In Motion
          </p>
          <p className="font-headline text-7xl font-black text-on-surface">{inProgressCount}</p>
          <div className="mt-4 h-1 bg-tertiary w-12 group-hover:w-full transition-all duration-500" />
        </motion.div>

        <motion.div
          className="bg-surface-container-high p-8 rounded-none group hover:-translate-y-2 transition-transform duration-300 shadow-brutalist"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-headline text-xs font-bold tracking-widest text-on-surface-variant mb-4 uppercase">
            Finalized
          </p>
          <p className="font-headline text-7xl font-black text-on-surface">{completedCount}</p>
          <div className="mt-4 h-1 bg-on-surface w-12 group-hover:w-full transition-all duration-500" />
        </motion.div>

        <motion.div
          className="bg-on-surface p-8 rounded-none group hover:-translate-y-2 transition-transform duration-300 shadow-brutalist"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-headline text-xs font-bold tracking-widest text-outline variant opacity-60 mb-4 uppercase">
            Velocity
          </p>
          <p className="font-headline text-5xl font-black text-surface">{velocity}%</p>
          <div className="mt-4 h-1 bg-tertiary w-12 group-hover:w-full transition-all duration-500" />
        </motion.div>
      </div>

      {/* Dashboard Body: Asymmetric Layout */}
      <div className="mt-24 grid grid-cols-12 gap-12 items-start">
        {/* Left Column: Overdue + Due Soon */}
        <div className="col-span-12 lg:col-span-7 space-y-16">
          {/* Overdue */}
          <section>
            <div className="flex items-baseline justify-between mb-8 border-b-4 border-on-surface pb-4">
              <h2 className="font-headline text-4xl font-black tracking-tighter uppercase italic text-on-surface">
                Overdue
              </h2>
              <span className="font-label text-xs font-black bg-tertiary text-on-tertiary px-2 py-1">
                CRITICAL ({overdueTasks.length})
              </span>
            </div>
            {overdueTasks.length > 0 ? (
              <div className="space-y-4">
                {overdueTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="bg-surface-container-low p-6 flex items-center justify-between group hover:bg-tertiary-container/10 transition-colors cursor-pointer"
                    onClick={() => navigate('/tasks')}
                  >
                    <div className="flex items-center gap-6">
                      <span className="font-headline text-2xl font-black text-tertiary opacity-50 group-hover:opacity-100">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-headline font-bold text-lg leading-tight">{task.title}</h3>
                        <p className="text-xs text-on-surface-variant font-medium tracking-tight mt-1 uppercase">
                          {task.project_name ? `Project: ${task.project_name}` : 'Personal Task'}
                        </p>
                      </div>
                    </div>
                    <span className="font-headline text-xs font-bold text-tertiary">
                      OVERDUE
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm font-medium py-4">
                No overdue tasks. Editorial flow is clean.
              </p>
            )}
          </section>

          {/* Due Soon */}
          <section>
            <div className="flex items-baseline justify-between mb-8 border-b-2 border-outline-variant pb-4">
              <h2 className="font-headline text-3xl font-black tracking-tighter uppercase text-on-surface">
                Due Soon
              </h2>
              <button
                onClick={() => navigate('/tasks')}
                className="font-label text-xs font-medium text-outline uppercase tracking-widest underline decoration-tertiary underline-offset-4 hover:text-on-surface transition-colors"
              >
                View All
              </button>
            </div>
            {dueSoonTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dueSoonTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-8 border-l-4 border-on-surface bg-surface-container-lowest shadow-sm hover:translate-x-2 transition-transform cursor-pointer"
                    onClick={() => navigate('/tasks')}
                  >
                    <span className="text-xs font-black tracking-[0.2em] text-outline uppercase">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No deadline'}
                    </span>
                    <h3 className="font-headline text-xl font-bold mt-2 text-on-surface">{task.title}</h3>
                    <div className="mt-6 flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${
                        task.priority === 'high' ? 'bg-tertiary' : 'bg-surface-container-high border border-outline-variant'
                      }`} />
                      <span className="text-xs font-bold uppercase tracking-tighter">
                        {task.priority || 'Normal'} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm font-medium py-4">
                No upcoming deadlines. The void is productive.
              </p>
            )}
          </section>
        </div>

        {/* Right Column: Team Feed (Empty State) */}
        <div className="col-span-12 lg:col-span-5">
          <section className="h-full bg-surface-container-highest p-10 flex flex-col justify-between min-h-[500px] border-t-[12px] border-on-surface">
            <div>
              <h2 className="font-headline text-2xl font-black uppercase tracking-widest mb-2 text-on-surface">
                Team Feed
              </h2>
              <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest">
                REAL-TIME SYNC
              </p>
            </div>
            <div className="text-center py-20 px-6">
              <div className="font-headline font-black text-4xl leading-[0.9] text-on-surface-variant/20 italic select-none">
                NOTHING<br />IS<br />HAPPENING
              </div>
              <p className="font-body text-sm font-medium mt-12 text-on-surface-variant max-w-[200px] mx-auto leading-relaxed uppercase">
                Your collaborators are currently silent. The void is productive.
              </p>
              <button className="mt-8 font-headline text-xs font-black uppercase tracking-widest border-b-2 border-on-surface hover:pb-2 transition-all text-on-surface">
                Poke Team
              </button>
            </div>
            <div className="flex justify-between items-end">
              <span className="material-symbols-outlined text-stone-400 text-4xl">hourglass_empty</span>
              <span className="font-headline text-xs font-bold tracking-tighter">LAST SYNC: 2m AGO</span>
            </div>
          </section>
        </div>
      </div>

      {/* Active Projects Bento */}
      <div className="mt-32 pb-24">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[2px] bg-on-surface flex-1 opacity-20" />
          <h2 className="font-headline text-5xl font-black uppercase tracking-tighter text-on-surface">
            Active Projects
          </h2>
          <div className="h-[2px] bg-on-surface w-24 opacity-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* featured project */}
          <div className="md:col-span-2 md:row-span-2 bg-on-surface text-surface p-10 flex flex-col justify-between hover:scale-[0.98] transition-all cursor-pointer shadow-brutalist">
            <div>
              <h3 className="font-headline text-4xl font-black leading-none">
                EDITORIAL<br />WORKSPACE
              </h3>
              <p className="text-xs text-outline opacity-60 mt-4 font-body tracking-[0.2em] uppercase">
                Phase 02: Active
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex -space-x-1">
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-on-surface" />
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-outline" />
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-tertiary flex items-center justify-center text-[10px] font-bold">
                  +
                </div>
              </div>
              <span className="font-headline font-bold text-sm tracking-tighter text-surface">{velocity}% DONE</span>
            </div>
          </div>

          {/* System Audit */}
          <div className="md:col-span-2 bg-surface-container-high p-6 hover:bg-on-surface hover:text-surface transition-all group cursor-pointer shadow-brutalist">
            <div className="flex justify-between items-start">
              <h3 className="font-headline text-xl font-bold uppercase">System Audit</h3>
              <span className="material-symbols-outlined text-lg">north_east</span>
            </div>
            <p className="text-xs mt-4 font-bold tracking-widest opacity-60 group-hover:opacity-100 uppercase">
              Quarterly Security Review
            </p>
          </div>

          {/* Metrics Hub */}
          <div className="bg-surface-container-highest p-6 flex flex-col justify-between border-b-4 border-on-surface cursor-pointer hover:scale-[0.98] transition-all">
            <span className="material-symbols-outlined text-on-surface text-2xl">analytics</span>
            <h3 className="font-headline text-lg font-bold text-on-surface">Metrics Hub</h3>
          </div>

          {/* Urgents */}
          <div className="bg-tertiary text-white p-6 flex flex-col justify-between group cursor-pointer overflow-hidden relative hover:scale-[0.98] transition-transform">
            <div className="absolute -right-4 -bottom-4 font-headline text-7xl font-black opacity-10 group-hover:scale-110 transition-transform">
              !
            </div>
            <h3 className="font-headline text-lg font-bold relative z-10">Urgents</h3>
            <p className="text-xs font-black relative z-10 uppercase tracking-widest">
              {overdueTasks.length} Tasks
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}