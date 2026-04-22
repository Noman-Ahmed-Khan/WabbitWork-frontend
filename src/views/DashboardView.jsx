import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useTaskStore from '../stores/taskStore'
import useTeamStore from '../stores/teamStore'
import teamsApi from '../api/teams'
import useRouteSearch from '../hooks/useRouteSearch'
import { filterBySearch, matchesSearchQuery } from '../utils/search'
import { containerVariants, itemVariants, cardVariants } from '../animations/variants'
import ProfileAvatar from '../components/profile/ProfileAvatar'
import Spinner from '../components/primitives/Spinner'

// Commit 5: Minor update

/**
 * Dashboard View - Brutalist Editorial Design
 * Stats grid, overdue tasks, due soon, team feed, active projects
 */
export default function DashboardView() {
  const navigate = useNavigate()
  const { searchQuery, clearSearchQuery, hasSearchQuery } = useRouteSearch()
  const {
    dashboardStats,
    loading,
    loadDashboardStats,
  } = useTaskStore()
  const { teams, loadTeams, loading: teamsLoading } = useTeamStore()
  const [editorialMembers, setEditorialMembers] = useState([])
  const [isLoadingEditorialMembers, setIsLoadingEditorialMembers] = useState(false)

  useEffect(() => {
    loadDashboardStats()
  }, [loadDashboardStats])

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  // Load a small collaborator preview for the workspace card without changing dashboard stats.
  useEffect(() => {
    let isActive = true

    const loadEditorialMembers = async () => {
      if (teamsLoading) return

      const activeTeamIds = teams
        .filter((team) => team.is_active !== false)
        .map((team) => team.id)

      if (activeTeamIds.length === 0) {
        setEditorialMembers([])
        setIsLoadingEditorialMembers(false)
        return
      }

      setIsLoadingEditorialMembers(true)
      setEditorialMembers([])

      const memberResults = await Promise.allSettled(
        activeTeamIds.map(async (teamId) => {
          const response = await teamsApi.getMembers(teamId)
          return response?.data?.members || []
        })
      )

      if (!isActive) return

      const seenMembers = new Set()
      const uniqueMembers = []

      memberResults.forEach((result) => {
        if (result.status !== 'fulfilled') return

        result.value.forEach((member) => {
          const memberKey = member.user_id || member.id
          if (!memberKey || seenMembers.has(memberKey)) return

          seenMembers.add(memberKey)
          uniqueMembers.push(member)
        })
      })

      setEditorialMembers(uniqueMembers)
      setIsLoadingEditorialMembers(false)
    }

    loadEditorialMembers()

    return () => {
      isActive = false
    }
  }, [teams, teamsLoading])

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
  const filteredDueSoonTasks = filterBySearch(dueSoonTasks, searchQuery, (task) => [
    task.title,
    task.project_name,
    task.priority,
    task.status,
    task.due_date,
  ])
  const filteredOverdueTasks = filterBySearch(overdueTasks, searchQuery, (task) => [
    task.title,
    task.project_name,
    task.priority,
    task.status,
    task.due_date,
  ])

  const pendingCount = stats.todo || 0
  const inProgressCount = stats.in_progress || 0
  const reviewCount = stats.review || 0
  const completedCount = stats.completed || 0
  const totalTasks = stats.total || 1
  const velocity = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
  const openTasksCount = Math.max(totalTasks - completedCount, 0)
  const inMotionCount = inProgressCount + reviewCount

  const getProjectLoad = (team) => team.project_count ?? team.task_count ?? 0
  const activeTeams = teams.filter((team) => team.is_active !== false)
  const sortedActiveTeams = [...activeTeams].sort((a, b) => getProjectLoad(b) - getProjectLoad(a))
  const totalProjectLoad = activeTeams.reduce((sum, team) => sum + getProjectLoad(team), 0)
  const totalActiveMembers = activeTeams.reduce((sum, team) => sum + (team.member_count || 0), 0)
  const largestTeam = sortedActiveTeams[0] || null
  const largestTeamLoad = largestTeam ? getProjectLoad(largestTeam) : 0
  const activeTeamShare = teams.length > 0 ? Math.round((activeTeams.length / teams.length) * 100) : 0
  const averageProjectLoad = activeTeams.length > 0 ? Math.round(totalProjectLoad / activeTeams.length) : 0
  const averageMembersPerTeam = activeTeams.length > 0 ? (totalActiveMembers / activeTeams.length).toFixed(1) : '0.0'
  const riskTasks = overdueTasks.length + dueSoonTasks.length
  const riskPressure = totalTasks > 0 ? Math.round((riskTasks / totalTasks) * 100) : 0

  const urgentTaskBuckets = {}
  overdueTasks.forEach((task) => {
    const bucketName = task.project_name || task.team_name || 'General'
    if (!urgentTaskBuckets[bucketName]) {
      urgentTaskBuckets[bucketName] = { name: bucketName, count: 0, overdue: 0, dueSoon: 0 }
    }
    urgentTaskBuckets[bucketName].count += 1
    urgentTaskBuckets[bucketName].overdue += 1
  })
  dueSoonTasks.forEach((task) => {
    const bucketName = task.project_name || task.team_name || 'General'
    if (!urgentTaskBuckets[bucketName]) {
      urgentTaskBuckets[bucketName] = { name: bucketName, count: 0, overdue: 0, dueSoon: 0 }
    }
    urgentTaskBuckets[bucketName].count += 1
    urgentTaskBuckets[bucketName].dueSoon += 1
  })
  const topRiskLane = Object.values(urgentTaskBuckets).sort((a, b) => b.count - a.count || b.overdue - a.overdue)[0] || null

  const activeProjectCards = [
    {
      id: 'portfolio-pulse',
      searchTerms: [
        'portfolio',
        'pulse',
        'active projects',
        'workspace',
        'projects',
        'teams',
        'collaborators',
        ...sortedActiveTeams.map((team) => team.name),
      ],
      className: 'sm:col-span-2 xl:col-span-2 xl:row-span-2 bg-on-surface text-surface p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-brutalist relative overflow-hidden group min-h-[320px] sm:min-h-[360px] xl:min-h-[420px]',
      render: () => (
        <>
          <motion.div
            style={{ x: '-10%', y: '-10%' }}
            className="absolute inset-0 bg-tertiary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <div className="absolute -right-6 -top-6 hidden sm:block font-headline text-[7rem] md:text-[9rem] font-black text-surface/5 select-none pointer-events-none">
            01
          </div>
          <div className="relative z-10">
            <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-surface/60">
              Live Portfolio Snapshot
            </p>
            <h3 className="mt-3 font-headline text-2xl sm:text-3xl md:text-4xl font-black leading-none uppercase">
              Portfolio Pulse
            </h3>
            <p className="mt-4 max-w-lg text-sm md:text-base text-surface/70 leading-relaxed">
              {activeTeams.length > 0
                ? `${activeTeams.length} active teams, ${totalProjectLoad} total projects, ${editorialMembers.length} collaborators.`
                : 'No active units are online yet. Create the first team to light up this portfolio.'}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-surface/50 mb-1 sm:mb-2">
                Active Units
              </span>
              <span className="font-headline text-3xl sm:text-4xl md:text-5xl font-black leading-none">
                {activeTeams.length}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-surface/50 mb-1 sm:mb-2">
                Project Load
              </span>
              <span className="font-headline text-3xl sm:text-4xl md:text-5xl font-black leading-none">
                {totalProjectLoad}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-surface/50 mb-1 sm:mb-2">
                Avg Load
              </span>
              <span className="font-headline text-2xl sm:text-3xl font-black leading-none">
                {averageProjectLoad}
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex -space-x-2">
              {isLoadingEditorialMembers ? (
                [1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, zIndex: 10 }}
                    className="w-8 h-8 rounded-full border-2 border-surface bg-surface/10 animate-pulse"
                    aria-hidden="true"
                  />
                ))
              ) : editorialMembers.length > 0 ? (
                editorialMembers.slice(0, 4).map((member, index) => (
                  <motion.div
                    key={member.id || member.user_id || index}
                    whileHover={{ y: -4, zIndex: 10 }}
                    className="relative shrink-0"
                  >
                    <ProfileAvatar
                      user={member}
                      size="xs"
                      alt={`${member.first_name || 'Collaborator'} ${member.last_name || 'Avatar'}`}
                      className="w-8 h-8 border-2 border-surface shadow-sm"
                      fallbackClassName="text-[9px]"
                    />
                  </motion.div>
                ))
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface/10 flex items-center justify-center" aria-hidden="true">
                  <span className="material-symbols-outlined text-sm text-surface">group</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/teams')}
              className="font-headline text-[10px] font-black uppercase tracking-widest border-b-2 border-surface text-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 focus-visible:ring-offset-on-surface"
            >
              Open Teams
            </button>
          </div>
        </>
      ),
    },
    {
      id: 'delivery-pace',
      searchTerms: ['delivery', 'pace', 'velocity', 'completion', 'progress', 'status', 'throughput'],
      className: 'bg-surface-container-high p-6 md:p-8 flex flex-col justify-between shadow-brutalist min-h-[220px]',
      render: () => (
        <>
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-outline">
                Delivery Pace
              </p>
              <h3 className="mt-2 font-headline text-2xl sm:text-3xl font-black uppercase tracking-tighter text-on-surface">
                {velocity}% complete
              </h3>
            </div>
            <span className="material-symbols-outlined text-2xl text-on-surface-variant">
              stacked_line_chart
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">
              {completedCount} completed, {openTasksCount} still open.
            </p>
            <div className="h-3 bg-outline-variant/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${velocity}%` }}
                transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                className="h-full bg-on-surface"
              />
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-black uppercase tracking-[0.25em]">
              <div className="bg-surface-container-highest p-3">
                <span className="block text-on-surface-variant opacity-40 mb-1">Pending</span>
                <span className="text-lg text-on-surface">{pendingCount}</span>
              </div>
              <div className="bg-surface-container-highest p-3">
                <span className="block text-on-surface-variant opacity-40 mb-1">In Motion</span>
                <span className="text-lg text-on-surface">{inMotionCount}</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'risk-watch',
      searchTerms: ['risk', 'watch', 'overdue', 'due soon', 'urgent', 'critical', 'alert'],
      className: 'bg-tertiary text-white p-6 md:p-8 flex flex-col justify-between group overflow-hidden relative shadow-brutalist min-h-[220px]',
      render: () => (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -right-4 -bottom-4 font-headline text-7xl font-black text-white/10"
          >
            !
          </motion.div>
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-white/60">
                Risk Watch
              </p>
              <h3 className="mt-2 font-headline text-2xl sm:text-3xl font-black uppercase tracking-tighter">
                {riskPressure}% pressure
              </h3>
            </div>
            <span className="material-symbols-outlined text-2xl text-white/80">
              report
            </span>
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-white/80 leading-relaxed max-w-sm">
              {overdueTasks.length} overdue and {dueSoonTasks.length} due soon.
            </p>
            <div className="bg-white/10 px-4 py-3">
              <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-1">
                Hottest Lane
              </span>
              <div className="font-headline text-lg font-black uppercase leading-tight">
                {topRiskLane
                  ? `${topRiskLane.name} (${topRiskLane.count})`
                  : 'No urgent lane'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="font-headline text-xs font-black uppercase tracking-widest border-b-2 border-white text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary"
            >
              Inspect Tasks
            </button>
          </div>
        </>
      ),
    },
    {
      id: 'capacity-map',
      searchTerms: ['capacity', 'utilization', 'balance', 'team', 'load', 'members', 'map'],
      className: 'sm:col-span-2 xl:col-span-1 bg-surface-container-highest p-6 md:p-8 flex flex-col justify-between border-b-4 border-on-surface shadow-brutalist min-h-[220px]',
      render: () => (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-outline">
                Capacity Map
              </p>
              <h3 className="mt-2 font-headline text-2xl sm:text-3xl font-black uppercase tracking-tighter text-on-surface">
                {activeTeamShare}% active
              </h3>
            </div>
            <span className="material-symbols-outlined text-2xl text-on-surface-variant">
              groups
            </span>
          </div>
          <div className="space-y-5">
            <p className="text-sm font-medium leading-relaxed text-on-surface-variant max-w-sm">
              {activeTeams.length > 0
                ? `${activeTeams.length} of ${teams.length} teams are live.`
                : 'No active teams are online yet. Capacity is waiting for the first unit.'}
            </p>
            <div className="h-3 bg-on-surface/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activeTeamShare}%` }}
                transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                className="h-full bg-on-surface"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-on-surface text-surface p-4">
                <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-surface/50 mb-1">
                  Avg Members
                </span>
                <span className="font-headline text-3xl font-black">{averageMembersPerTeam}</span>
              </div>
              <div className="bg-tertiary text-white p-4">
                <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-1">
                  Largest Unit
                </span>
                <span className="font-headline text-lg font-black uppercase leading-tight">
                  {largestTeam ? `${largestTeam.name} - ${largestTeamLoad}` : 'None yet'}
                </span>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ]
  const visibleProjectCards = activeProjectCards.filter((card) => matchesSearchQuery(card.searchTerms, searchQuery))
  const projectAnalyticsLoading = teamsLoading && activeTeams.length === 0
  const showProjectAnalyticsEmpty = hasSearchQuery && visibleProjectCards.length === 0

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-8 lg:p-12 relative overflow-hidden"
    >
      <h1 className="sr-only">Dashboard</h1>
      {/* Large Background Heading */}
      <motion.h1 
        initial={{ opacity: 0, x: -100, scale: 0.9 }}
        animate={{ opacity: 0.2, x: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="font-headline font-bold text-[3rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem] leading-[0.8] tracking-tighter text-on-surface absolute -top-2 md:-top-8 -left-2 md:-left-4 pointer-events-none select-none uppercase transition-all duration-500"
        aria-hidden="true"
      >
        Dashboard
      </motion.h1>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 md:mt-20 relative z-10"
      >
        {[
          { label: 'Pending', count: pendingCount, color: 'bg-on-surface' },
          { label: 'In Motion', count: inProgressCount, color: 'bg-tertiary' },
          { label: 'Finalized', count: completedCount, color: 'bg-on-surface' },
          { label: 'Velocity', count: `${velocity}%`, color: 'bg-tertiary', dark: true }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }}
            className={`${stat.dark ? 'bg-on-surface' : 'bg-surface-container-high'} p-8 rounded-none group shadow-brutalist transition-colors duration-300`}
          >
            <p className={`font-headline text-xs font-bold tracking-widest ${stat.dark ? 'text-surface/60' : 'text-on-surface-variant'} mb-4 uppercase`}>
              {stat.label}
            </p>
            <p className={`font-headline text-7xl font-black ${stat.dark ? 'text-surface' : 'text-on-surface'}`}>{stat.count}</p>
            <div className={`mt-4 h-1 ${stat.color} w-12 group-hover:w-full transition-all duration-500`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Dashboard Body: Asymmetric Layout */}
      <div className="mt-16 md:mt-24 grid grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Column: Overdue + Due Soon */}
        <div className="col-span-12 lg:col-span-7 space-y-12 md:space-y-16">
          {/* Overdue */}
          <motion.section variants={itemVariants}>
            <div className="flex items-baseline justify-between mb-8 border-b-4 border-on-surface pb-4">
              <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter uppercase italic text-on-surface transition-all duration-300">
                Overdue
              </h2>
              <span className="font-label text-xs font-black bg-tertiary text-on-tertiary px-2 py-1 shadow-brutalist">
                CRITICAL ({filteredOverdueTasks.length})
              </span>
            </div>
            {filteredOverdueTasks.length > 0 ? (
              <motion.div variants={containerVariants} className="space-y-4">
                {filteredOverdueTasks.map((task, index) => (
                  <motion.button
                    key={task.id}
                    type="button"
                    variants={itemVariants}
                    whileHover={{ x: 12, backgroundColor: "rgba(var(--tertiary), 0.05)" }}
                    className="w-full bg-surface-container-low p-6 flex items-center justify-between group transition-colors border-l-4 border-transparent hover:border-tertiary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                    onClick={() => navigate('/tasks')}
                    aria-label={`Open overdue task ${task.title}`}
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
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <p className="text-on-surface-variant text-sm font-medium py-4">
                {hasSearchQuery
                  ? `No overdue tasks match "${searchQuery.trim()}".`
                  : 'No overdue tasks. Editorial flow is clean.'}
              </p>
            )}
            {hasSearchQuery && filteredOverdueTasks.length === 0 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearSearchQuery}
                className="mt-4 font-headline text-xs uppercase tracking-widest border-b-2 border-on-surface text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                Clear Search
              </motion.button>
            )}
          </motion.section>

          {/* Due Soon */}
          <motion.section variants={itemVariants}>
            <div className="flex items-baseline justify-between mb-8 border-b-2 border-outline-variant pb-4">
              <h2 className="font-headline text-2xl md:text-3xl font-black tracking-tighter uppercase text-on-surface transition-all duration-300">
                Due Soon
              </h2>
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="font-label text-xs font-medium text-outline uppercase tracking-widest underline decoration-tertiary underline-offset-4 hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                View All
              </button>
            </div>
            {filteredDueSoonTasks.length > 0 ? (
              <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDueSoonTasks.slice(0, 4).map((task) => (
                  <motion.button
                    key={task.id}
                    type="button"
                    variants={cardVariants}
                    whileHover={{ scale: 1.02, y: -4, rotate: 1 }}
                    className="w-full text-left p-8 border-l-4 border-on-surface bg-surface-container-high shadow-brutalist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                    onClick={() => navigate('/tasks')}
                    aria-label={`Open task ${task.title}`}
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
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <p className="text-on-surface-variant text-sm font-medium py-4">
                {hasSearchQuery
                  ? `No due-soon tasks match "${searchQuery.trim()}".`
                  : 'No upcoming deadlines. The void is productive.'}
              </p>
            )}
            {hasSearchQuery && filteredDueSoonTasks.length === 0 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearSearchQuery}
                className="mt-4 font-headline text-xs uppercase tracking-widest border-b-2 border-on-surface text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                Clear Search
              </motion.button>
            )}
          </motion.section>
        </div>

        {/* Right Column: Team Feed (Empty State) */}
        <motion.div 
          variants={itemVariants}
          className="col-span-12 lg:col-span-5"
        >
          <section className="h-full bg-surface-container-highest p-6 md:p-10 flex flex-col justify-between min-h-[400px] md:min-h-[500px] border-t-[8px] md:border-t-[12px] border-on-surface shadow-brutalist relative overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 0.03, scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 flex items-center justify-center font-headline font-black text-[15rem] pointer-events-none select-none"
            >
              FEED
            </motion.div>
            <div className="relative z-10">
              <h2 className="font-headline text-2xl font-black uppercase tracking-widest mb-2 text-on-surface">
                Team Feed
              </h2>
              <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest">
                REAL-TIME SYNC
              </p>
            </div>
            <div className="text-center py-20 px-6 relative z-10">
              {hasSearchQuery ? (
                <>
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="font-headline font-black text-4xl leading-[0.9] text-on-surface-variant/20 italic select-none"
                  >
                    NO MATCHES
                  </motion.div>
                  <p className="font-body text-sm font-medium mt-12 text-on-surface-variant max-w-[220px] mx-auto leading-relaxed uppercase">
                    Nothing in the dashboard feed matches "{searchQuery.trim()}".
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSearchQuery}
                    className="mt-8 font-headline text-xs font-black uppercase tracking-widest border-b-2 border-on-surface text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                  >
                    Clear Search
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="font-headline font-black text-4xl leading-[0.9] text-on-surface-variant/20 italic select-none"
                  >
                    NOTHING<br />IS<br />HAPPENING
                  </motion.div>
                  <p className="font-body text-sm font-medium mt-12 text-on-surface-variant max-w-[200px] mx-auto leading-relaxed uppercase">
                    Your collaborators are currently silent. The void is productive.
                  </p>
                </>
              )}
              <motion.button 
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => navigate('/teams')}
                className="mt-8 font-headline text-xs font-black uppercase tracking-widest border-b-2 border-on-surface text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                aria-label="Open teams screen"
              >
                Poke Team
              </motion.button>
            </div>
            <div className="flex justify-between items-end relative z-10">
              <motion.span 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="material-symbols-outlined text-stone-400 text-4xl"
              >
                hourglass_empty
              </motion.span>
              <span className="font-headline text-xs font-bold tracking-tighter">LAST SYNC: 2m AGO</span>
            </div>
          </section>
        </motion.div>
      </div>

      {/* Active Projects Analytics */}
      <motion.div 
        variants={itemVariants}
        className="mt-32 pb-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-10 md:mb-12">
          <div className="hidden sm:block h-[2px] bg-on-surface flex-1 opacity-20" />
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-on-surface text-left">
            Active Projects
          </h2>
          <div className="hidden sm:block h-[2px] bg-on-surface w-24 opacity-20" />
        </div>
        {projectAnalyticsLoading ? (
          <motion.div
            variants={cardVariants}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 xl:gap-6 auto-rows-auto xl:auto-rows-[220px]"
          >
            <div className="sm:col-span-2 xl:col-span-4 bg-surface-container-highest p-6 md:p-8 shadow-brutalist border border-dashed border-outline-variant/30 min-h-[260px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 animate-pulse">
              <div className="space-y-4 flex-1">
                <div className="h-3 w-28 bg-on-surface/10" />
                <div className="h-12 w-3/4 bg-on-surface/10" />
                <div className="h-4 w-full max-w-2xl bg-on-surface/10" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-16 bg-on-surface/10" />
                  ))}
                </div>
              </div>
              <div className="h-20 w-20 rounded-full border border-dashed border-outline-variant/30" aria-hidden="true" />
            </div>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 xl:gap-6 auto-rows-auto xl:auto-rows-[220px]">
            {visibleProjectCards.map((card) => (
              <motion.div
                key={card.id}
                variants={cardVariants}
                className={card.className}
              >
                {card.render()}
              </motion.div>
            ))}

            {showProjectAnalyticsEmpty && (
              <motion.div 
                variants={cardVariants}
                className="sm:col-span-2 xl:col-span-4 bg-surface-container-highest p-6 md:p-8 shadow-brutalist border border-dashed border-outline-variant/30 flex flex-col justify-between"
              >
                <div>
                  <span className="font-headline text-[10px] uppercase tracking-[0.3em] text-outline block mb-3">
                    No analytics match
                  </span>
                  <h3 className="font-headline text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter text-on-surface">
                    Nothing on the dashboard matches "{searchQuery.trim()}"
                  </h3>
                  <p className="mt-4 max-w-lg text-sm text-on-surface-variant">
                    Try a team name, a project term, or clear the search to restore the full dashboard.
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearSearchQuery}
                  className="mt-6 w-fit font-headline text-xs uppercase tracking-widest border-b-2 border-on-surface text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                >
                  Clear Search
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
