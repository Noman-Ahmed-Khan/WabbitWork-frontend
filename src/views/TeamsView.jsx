import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import teamsApi from '../api/teams'
import useTeamStore from '../stores/teamStore'
import useUIStore from '../stores/uiStore'
import useRouteSearch from '../hooks/useRouteSearch'
import ProfileAvatar from '../components/profile/ProfileAvatar'
import Spinner from '../components/primitives/Spinner'
import TeamOverlay from '../components/overlays/TeamOverlay'
import { filterBySearch } from '../utils/search'
import { containerVariants, itemVariants, cardVariants, buttonVariants } from '../animations/variants'

/**
 * Teams View - Brutalist Editorial Bento Grid
 */
export default function TeamsView() {
  const navigate = useNavigate()
  const { activeOverlay, openOverlay } = useUIStore()
  const { teams, loading, loadTeams, archiveTeam, restoreTeam, deleteTeam, leaveTeam } = useTeamStore()
  const { searchQuery, clearSearchQuery, hasSearchQuery } = useRouteSearch()
  const [filter, setFilter] = useState('all')
  const [teamMemberPreviews, setTeamMemberPreviews] = useState({})
  const [isLoadingTeamMemberPreviews, setIsLoadingTeamMemberPreviews] = useState(false)
  const [openTeamMenuId, setOpenTeamMenuId] = useState(null)
  const menuTriggerRef = useRef(null)
  const menuPanelRef = useRef(null)

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  // Load lightweight member previews only for this view so the shared teams store stays lean.
  useEffect(() => {
    let isActive = true

    const loadTeamMemberPreviews = async () => {
      if (loading) return

      if (teams.length === 0) {
        setTeamMemberPreviews({})
        setIsLoadingTeamMemberPreviews(false)
        return
      }

      setIsLoadingTeamMemberPreviews(true)
      setTeamMemberPreviews({})

      const previewResults = await Promise.allSettled(
        teams.map(async (team) => {
          const response = await teamsApi.getMembers(team.id)
          const members = response?.data?.members || []
          return [team.id, members.slice(0, 3)]
        })
      )

      if (!isActive) return

      const nextPreviews = {}
      previewResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          const [teamId, members] = result.value
          nextPreviews[teamId] = members
        }
      })

      setTeamMemberPreviews(nextPreviews)
      setIsLoadingTeamMemberPreviews(false)
    }

    loadTeamMemberPreviews()

    return () => {
      isActive = false
    }
  }, [teams, loading])

  useEffect(() => {
    if (!openTeamMenuId) return

    const handlePointerDown = (event) => {
      if (
        menuPanelRef.current?.contains(event.target) ||
        menuTriggerRef.current?.contains(event.target)
      ) {
        return
      }

      setOpenTeamMenuId(null)
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenTeamMenuId(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [openTeamMenuId])

  const activeTeams = teams.filter(t => t.is_active !== false)
  const visibleTeams = filter === 'all' ? teams : teams.filter(t => t.is_active === false)
  const filteredTeams = filterBySearch(visibleTeams, searchQuery, (team) => [
    team.name,
    team.role,
    team.description,
    team.member_count,
    team.task_count,
    team.is_active === false ? 'archived' : 'active',
  ])
  const utilization = teams.length > 0 ? Math.round((activeTeams.length / teams.length) * 100) : 0
  const hasTeamManagementAccess = (team) => team.role === 'owner' || team.role === 'admin'
  const canDeleteTeam = (team) => team.role === 'owner'

  const handleOpenTeam = (team) => {
    setOpenTeamMenuId(null)
    navigate('/tasks', { state: { teamId: team.id } })
  }

  const handleEditTeam = (team) => {
    setOpenTeamMenuId(null)
    openOverlay('team', team)
  }

  const handleToggleTeamStatus = async (team) => {
    const isArchived = team.is_active === false
    const confirmationMessage = isArchived
      ? `Restore ${team.name} back to the active teams list?`
      : `Archive ${team.name}? You can restore it later from the Archived tab.`

    if (!confirm(confirmationMessage)) return

    setOpenTeamMenuId(null)

    try {
      if (isArchived) {
        await restoreTeam(team.id)
      } else {
        await archiveTeam(team.id)
      }
    } catch (error) {
      alert(error.message || 'Failed to update team status')
    }
  }

  const handleLeaveTeam = async (team) => {
    if (!confirm(`Leave ${team.name}?`)) return

    setOpenTeamMenuId(null)

    try {
      await leaveTeam(team.id)
    } catch (error) {
      alert(error.message || 'Failed to leave team')
    }
  }

  const handleDeleteTeam = async (team) => {
    if (!confirm(`Delete ${team.name}? This cannot be undone.`)) return

    setOpenTeamMenuId(null)

    try {
      await deleteTeam(team.id)
    } catch (error) {
      alert(error.message || 'Failed to delete team')
    }
  }

  const handleTeamCardKeyDown = (event, team) => {
    if (event.target !== event.currentTarget) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenTeam(team)
    }
  }

  // Alternate card colors: 3rd card gets inverted background
  const getCardStyle = (index) => {
    if (index % 3 === 2) {
      return 'bg-on-surface text-surface shadow-brutalist'
    }
    return 'bg-surface-container-high text-on-surface border border-outline-variant/10 shadow-sm'
  }

  const getBorderColor = (index) => {
    if (index % 3 === 2) return 'border-on-surface'
    return 'border-surface-container-high'
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-8 lg:p-12 relative min-h-screen overflow-hidden"
    >
      <h1 className="sr-only">Teams</h1>
      {/* Oversized Background Text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 pointer-events-none select-none z-0">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className="text-[6rem] sm:text-[10rem] md:text-[13rem] lg:text-[16rem] font-black font-headline text-on-surface leading-none tracking-tighter uppercase transition-all duration-700"
          aria-hidden="true"
        >
          Teams
        </motion.h2>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0"
        >
          <div>
            <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.3em] text-on-surface-variant mb-1 md:mb-2 block">
              Organization
            </span>
            <h2 className="font-headline text-3xl md:text-5xl font-black text-on-surface tracking-tighter uppercase">
              Core Units
            </h2>
          </div>
          <div className="flex gap-4">
            {['all', 'archived'].map((f) => (
              <motion.button
                key={f}
                type="button"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`font-headline font-bold text-xs uppercase tracking-widest pb-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 ${
                  filter === f ? 'border-b-2 border-on-surface text-on-surface' : 'text-outline hover:text-on-surface'
                }`}
              >
                {f === 'all' ? 'All Teams' : 'Archived'}
              </motion.button>
            ))}
            {hasSearchQuery && (
              <motion.button
                type="button"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={clearSearchQuery}
                className="font-headline font-bold text-xs uppercase tracking-widest pb-1 text-tertiary border-b-2 border-transparent hover:border-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              >
                Clear Search
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className="mb-6 flex flex-col gap-2">
          <p className="font-headline text-[10px] md:text-xs uppercase tracking-[0.28em] text-on-surface-variant">
            {hasSearchQuery
              ? `${filteredTeams.length} match${filteredTeams.length === 1 ? '' : 'es'} for "${searchQuery.trim()}"`
              : `${visibleTeams.length} teams in view`}
          </p>
        </div>

        {/* Team Grid */}
        {loading && teams.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredTeams.map((team, index) => {
                const isBlack = index % 3 === 2
                const isArchived = team.is_active === false
                const previewMembers = teamMemberPreviews[team.id] || []
                const menuIsOpen = openTeamMenuId === team.id
                const canManageTeam = hasTeamManagementAccess(team)
                const canLeaveTeam = team.role !== 'owner'
                const canDelete = canDeleteTeam(team)

                return (
                  <motion.div
                    key={team.id}
                    layout
                    variants={cardVariants}
                    whileHover={{ y: -2, transition: { type: 'spring', stiffness: 360, damping: 30 } }}
                    className={`group transform-gpu will-change-transform ${getCardStyle(index)} p-6 md:p-8 rounded-none flex flex-col justify-between aspect-square transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 relative ${
                      !isBlack ? 'border-t border-l border-white/20' : ''
                    } ${
                      isArchived ? 'opacity-80 saturate-75 ring-1 ring-dashed ring-outline-variant/40' : ''
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpenTeam(team)}
                    onKeyDown={(event) => handleTeamCardKeyDown(event, team)}
                    aria-label={`${isArchived ? 'Open archived team' : 'Open'} ${team.name} team`}
                  >
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/0 via-white/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="pointer-events-none absolute inset-0 z-20 translate-y-1 scale-[0.99] opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
                      <div className={`${isBlack ? 'bg-black/70 backdrop-blur-lg' : 'bg-surface-container-high/80 backdrop-blur-lg'} absolute inset-0`} />
                      <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
                        <div className="space-y-3 pr-12">
                          <span className={`block text-[10px] font-black uppercase tracking-[0.28em] ${isBlack ? 'text-surface/85' : 'text-on-surface/80'}`}>
                            Quick Preview
                          </span>
                          <h4 className={`font-headline text-xl md:text-3xl font-black uppercase tracking-tighter leading-tight break-words line-clamp-3 ${isBlack ? 'text-surface/95' : 'text-on-surface/95'}`}>
                            {team.name}
                          </h4>
                          {team.description ? (
                            <p className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto pr-2 ${isBlack ? 'text-surface/95' : 'text-on-surface/95'}`}>
                              {team.description}
                            </p>
                          ) : (
                            <p className={`text-sm leading-relaxed ${isBlack ? 'text-surface/80' : 'text-on-surface/80'}`}>
                              No description provided for this team.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6 gap-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`${isBlack ? 'bg-surface/10 text-surface' : 'bg-surface-container-highest text-on-surface'} px-3 py-1 font-headline font-bold text-[10px] uppercase tracking-widest rounded-full`}>
                              {team.role || 'Team'}
                            </span>
                            {isArchived && (
                              <span className="px-3 py-1 font-headline font-bold text-[10px] uppercase tracking-widest rounded-full bg-tertiary/10 text-tertiary">
                                Archived
                              </span>
                            )}
                          </div>

                          {(canManageTeam || canLeaveTeam || canDelete) && (
                            <div className="relative z-30 shrink-0">
                              <motion.button
                                ref={(node) => {
                                  if (menuIsOpen) {
                                    menuTriggerRef.current = node
                                  }
                                }}
                                type="button"
                                whileHover={{ rotate: 90 }}
                                whileTap={{ scale: 0.92 }}
                                aria-haspopup="menu"
                                aria-expanded={menuIsOpen}
                                aria-label={`Team actions for ${team.name}`}
                                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 ${
                                  isBlack
                                    ? 'text-surface hover:bg-surface/40'
                                    : 'text-on-surface hover:bg-black/40'
                                }`}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  setOpenTeamMenuId((current) => (current === team.id ? null : team.id))
                                }}
                              >
                                <span className="material-symbols-outlined text-xl">more_vert</span>
                              </motion.button>

                              <AnimatePresence>
                                {menuIsOpen && (
                                  <motion.div
                                    ref={(node) => {
                                      if (menuIsOpen) {
                                        menuPanelRef.current = node
                                      }
                                    }}
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    transition={{ duration: 0.16 }}
                                    role="menu"
                                    onClick={(event) => event.stopPropagation()}
                                    className="absolute right-0 top-full mt-3 w-56 origin-top-right rounded-2xl border border-outline-variant/20 bg-surface-container-high p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)] z-30"
                                  >
                                    {canManageTeam && (
                                      <button
                                        type="button"
                                        role="menuitem"
                                        onClick={(event) => {
                                          event.stopPropagation()
                                          handleEditTeam(team)
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-headline font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                                      >
                                        <span className="material-symbols-outlined text-sm">edit_note</span>
                                        <span>Edit Team</span>
                                      </button>
                                    )}

                                    {canManageTeam && (
                                      <button
                                        type="button"
                                        role="menuitem"
                                        onClick={(event) => {
                                          event.stopPropagation()
                                          handleToggleTeamStatus(team)
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-headline font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                                      >
                                        <span className="material-symbols-outlined text-sm">
                                          {isArchived ? 'unarchive' : 'archive'}
                                        </span>
                                        <span>{isArchived ? 'Restore Team' : 'Archive Team'}</span>
                                      </button>
                                    )}

                                    {canLeaveTeam && (
                                      <button
                                        type="button"
                                        role="menuitem"
                                        onClick={(event) => {
                                          event.stopPropagation()
                                          handleLeaveTeam(team)
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-headline font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                                      >
                                        <span className="material-symbols-outlined text-sm">logout</span>
                                        <span>Leave Team</span>
                                      </button>
                                    )}

                                    {canDelete && (
                                      <>
                                        <div className="my-2 h-px bg-outline-variant/20" />
                                        <button
                                          type="button"
                                          role="menuitem"
                                          onClick={(event) => {
                                            event.stopPropagation()
                                            handleDeleteTeam(team)
                                          }}
                                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-headline font-bold uppercase tracking-widest text-tertiary hover:bg-tertiary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                                        >
                                          <span className="material-symbols-outlined text-sm">delete_outline</span>
                                          <span>Delete Team</span>
                                        </button>
                                      </>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>

                        <div className="transition-opacity duration-150 ease-out group-hover:opacity-0 group-focus-within:opacity-0">
                          <h3 className={`font-headline text-2xl md:text-4xl font-black leading-none mb-4 uppercase tracking-tighter break-words line-clamp-2 ${isBlack ? 'text-surface' : 'text-on-surface'}`}>
                            {team.name}
                          </h3>
                          <p className={`text-sm font-medium leading-relaxed max-w-[240px] line-clamp-3 ${isBlack ? 'text-surface/60' : 'text-on-surface-variant'}`}>
                            {team.description || 'Building the future of editorial workflows.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="flex -space-x-3">
                          {previewMembers.length > 0 ? (
                            previewMembers.map((member, i) => (
                              <motion.div
                                key={member.id || member.user_id || i}
                                whileHover={{ y: -4, zIndex: 10 }}
                                className="relative shrink-0"
                              >
                                <ProfileAvatar
                                  user={member}
                                  size="sm"
                                  alt={`${member.first_name || 'Team'} ${member.last_name || 'Member'}`}
                                  className={`h-10 w-10 border-4 ${getBorderColor(index)} shadow-sm`}
                                  fallbackClassName="text-[10px]"
                                />
                              </motion.div>
                            ))
                          ) : isLoadingTeamMemberPreviews ? (
                            [...Array(Math.min(team.member_count || 0, 3))].map((_, i) => (
                              <motion.div
                                key={i}
                                whileHover={{ y: -4, zIndex: 10 }}
                                className={`h-10 w-10 rounded-full border-4 ${getBorderColor(index)} ${
                                  isBlack ? 'bg-surface/10' : 'bg-on-surface/10'
                                } animate-pulse`}
                                aria-hidden="true"
                              />
                            ))
                          ) : (team.member_count || 0) > 0 ? (
                            <div
                              className={`h-10 w-10 rounded-full border-4 ${getBorderColor(index)} ${
                                isBlack ? 'bg-surface/10 text-surface' : 'bg-on-surface/10 text-on-surface'
                              } flex items-center justify-center`}
                              aria-hidden="true"
                            >
                              <span className="material-symbols-outlined text-sm">group</span>
                            </div>
                          ) : (
                            null
                          )}
                          {(team.member_count || 0) > 3 && (
                            <div className={`h-10 w-10 rounded-full ${isBlack ? 'bg-white text-black' : 'bg-black text-white'} flex items-center justify-center text-[10px] font-bold border-4 ${getBorderColor(index)}`}>
                              +{(team.member_count || 0) - 3}
                            </div>
                          )}
                        </div>

                        <span className="font-headline font-black text-xs uppercase">
                          {team.task_count || 0} TASKS
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* Create New Team Card */}
              <motion.button
                type="button"
                layout
                variants={cardVariants}
                className="group border-2 border-dashed border-outline-variant p-6 md:p-8 rounded-none flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:bg-on-surface/5 hover:border-on-surface w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                onClick={() => openOverlay('team')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Create new team"
              >
                <motion.span 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-on-surface mb-4"
                >
                  add
                </motion.span>
                <h3 className="font-headline text-xl font-black text-on-surface uppercase tracking-tighter text-center">
                  Initialize<br />Unit
                </h3>
              </motion.button>
            </AnimatePresence>

            {/* Global Capacity Card (wide) */}
            {teams.length > 0 && (
              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 0.99 }}
                className="group bg-surface-container-highest p-6 md:p-8 rounded-none flex flex-col justify-between md:col-span-2 md:aspect-[2/1] transition-all duration-300 border-t border-l border-white/20 shadow-brutalist"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline text-2xl md:text-3xl font-black text-on-surface leading-none mb-4 uppercase tracking-tighter">
                        Global Capacity
                      </h3>
                      <p className="text-on-surface-variant text-sm font-medium">
                        Currently operating at {utilization}% team utilization across all units.
                      </p>
                    </div>
                    <div className="w-full bg-on-surface/5 h-12 rounded-lg relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${utilization}%` }}
                        className="absolute top-0 left-0 h-full bg-black dark:bg-white transition-all duration-1000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-headline font-black text-xs mix-blend-difference text-white">
                        {activeTeams.length} ACTIVE
                      </span>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="bg-on-surface dark:bg-black/30 p-6 flex flex-col justify-center shadow-brutalist transition-transform"
                  >
                    <span className="font-headline text-surface/50 text-xs uppercase tracking-widest mb-1">
                      Total Teams
                    </span>
                    <span className="font-headline text-surface text-5xl font-black tracking-tighter">
                      {teams.length} <span className="text-lg text-tertiary">units</span>
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50">
        <motion.button
          type="button"
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="h-10 w-10 md:h-14 md:w-14 bg-on-surface text-surface flex items-center justify-center group shadow-2xl border-4 border-surface font-headline font-black text-xs uppercase rounded-badge"
          onClick={() => openOverlay('team')}
          aria-label="Create new team"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </motion.button>
      </div>

      {/* Team Overlay */}
      <AnimatePresence>
        {activeOverlay === 'team' && (
          <TeamOverlay onSuccess={loadTeams} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
