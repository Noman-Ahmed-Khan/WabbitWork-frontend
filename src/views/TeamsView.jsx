import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useTeamStore from '../stores/teamStore'
import useUIStore from '../stores/uiStore'
import Spinner from '../components/primitives/Spinner'
import TeamOverlay from '../components/overlays/TeamOverlay'

/**
 * Teams View - Brutalist Editorial Bento Grid
 */
export default function TeamsView() {
  const navigate = useNavigate()
  const { activeOverlay, openOverlay } = useUIStore()
  const { teams, loading, loadTeams } = useTeamStore()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  const filteredTeams = filter === 'all' ? teams : teams.filter(t => !t.is_active)

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
    <div className="p-12 relative min-h-screen">
      {/* Oversized Background Text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 pointer-events-none select-none z-0">
        <h2 className="text-[16rem] font-black font-headline text-on-surface opacity-[0.1] dark:opacity-[0.1] leading-none tracking-tighter uppercase">
          Teams
        </h2>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <span className="font-headline text-sm uppercase tracking-[0.3em] text-on-surface-variant mb-2 block">
              Organization
            </span>
            <h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter">
              Core Units
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`font-headline font-bold text-xs uppercase tracking-widest pb-1 transition-all ${
                filter === 'all' ? 'border-b-2 border-on-surface text-on-surface' : 'text-outline hover:text-on-surface'
              }`}
            >
              All Teams
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`font-headline font-bold text-xs uppercase tracking-widest pb-1 transition-all ${
                filter === 'archived' ? 'border-b-2 border-on-surface text-on-surface' : 'text-outline hover:text-on-surface'
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeams.map((team, index) => {
              const isBlack = index % 3 === 2
              return (
                <motion.div
                  key={team.id}
                  className={`group ${getCardStyle(index)} p-8 rounded-none flex flex-col justify-between aspect-square transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_40px_60px_-20px_rgba(0,0,0,0.1)] cursor-pointer ${
                    !isBlack ? 'border-t border-l border-white/20' : ''
                  }`}
                  onClick={() => navigate('/tasks', { state: { teamId: team.id } })}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className={`${isBlack ? 'bg-surface/10 text-surface' : 'bg-surface-container-highest text-on-surface'} px-3 py-1 font-headline font-bold text-[10px] uppercase tracking-widest rounded-full`}>
                        {team.role || 'Team'}
                      </span>
                      <span className={`material-symbols-outlined ${isBlack ? 'text-surface' : 'text-on-surface'}`}>
                        more_vert
                      </span>
                    </div>
                    <h3 className={`font-headline text-4xl font-black leading-none mb-4 uppercase tracking-tighter ${isBlack ? 'text-surface' : 'text-on-surface'}`}>
                      {team.name}
                    </h3>
                    <p className={`text-sm font-medium leading-relaxed max-w-[240px] ${isBlack ? 'text-surface/60' : 'text-on-surface-variant'}`}>
                      {team.description || 'Building the future of editorial workflows.'}
                    </p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex -space-x-3">
                      {[...Array(Math.min(team.member_count || 2, 3))].map((_, i) => (
                        <div
                          key={i}
                          className={`h-10 w-10 rounded-full border-4 ${getBorderColor(index)} bg-stone-${isBlack ? '600' : '300'}`}
                        />
                      ))}
                      {(team.member_count || 0) > 3 && (
                        <div className={`h-10 w-10 rounded-full ${isBlack ? 'bg-white text-black' : 'bg-black text-white'} flex items-center justify-center text-[10px] font-bold border-4 ${getBorderColor(index)}`}>
                          +{(team.member_count || 0) - 3}
                        </div>
                      )}
                    </div>
                    <span className="font-headline font-black text-xs uppercase">
                      {team.project_count || 0} Projects
                    </span>
                  </div>
                </motion.div>
              )
            })}

            {/* Create New Team Card */}
            <motion.div
              className="group border-2 border-dashed border-outline-variant p-8 rounded-none flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:bg-on-surface/5 hover:border-on-surface cursor-pointer"
              onClick={() => openOverlay('team')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-on-surface mb-4">add</span>
              <h3 className="font-headline text-xl font-black text-on-surface uppercase tracking-tighter">
                Create New Team
              </h3>
            </motion.div>

            {/* Global Capacity Card (wide) */}
            {teams.length > 0 && (
              <div className="group bg-surface-container-highest p-8 rounded-none flex flex-col justify-between md:col-span-2 aspect-[2/1] transition-all duration-300 border-t border-l border-white/20">
                <div className="grid grid-cols-2 gap-8 h-full">
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline text-3xl font-black text-on-surface leading-none mb-4 uppercase tracking-tighter">
                        Global Capacity
                      </h3>
                      <p className="text-on-surface-variant text-sm font-medium">
                        Currently operating at {teams.length > 0 ? Math.round((teams.filter(t => t.is_active !== false).length / teams.length) * 100) : 0}% team utilization across all units.
                      </p>
                    </div>
                    <div className="w-full bg-on-surface/5 h-12 rounded-lg relative overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-on-surface transition-all duration-1000"
                        style={{ width: `${teams.length > 0 ? Math.round((teams.filter(t => t.is_active !== false).length / teams.length) * 100) : 0}%` }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-headline font-black text-xs text-on-surface-variant mix-blend-difference">
                        {teams.filter(t => t.is_active !== false).length} ACTIVE
                      </span>
                    </div>
                  </div>
                  <div className="bg-on-surface p-6 flex flex-col justify-center">
                    <span className="font-headline text-surface/50 text-xs uppercase tracking-widest mb-1">
                      Total Teams
                    </span>
                    <span className="font-headline text-surface text-5xl font-black tracking-tighter">
                      {teams.length} <span className="text-lg text-tertiary">units</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-12 right-12 z-50">
        <motion.button
          className="h-16 w-16 bg-on-surface text-surface flex items-center justify-center group transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl border-4 border-surface"
          onClick={() => openOverlay('team')}
          whileTap={{ scale: 0.9 }}
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </motion.button>
      </div>

      {/* Team Overlay */}
      {activeOverlay === 'team' && (
        <TeamOverlay onSuccess={loadTeams} />
      )}
    </div>
  )
}