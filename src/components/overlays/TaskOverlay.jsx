import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useUIStore from '../../stores/uiStore'
import useTaskStore from '../../stores/taskStore'
import useTeamStore from '../../stores/teamStore'
import { modalVariants, backdropVariants } from '../../animations/variants'

/**
 * Task Create/Edit Overlay - Brutalist Editorial Design
 * Complex grid-based form with glass panel, editorial typography, and select blocks
 */
export default function TaskOverlay({ onSuccess }) {
  const { activeOverlay, overlayData, closeOverlay } = useUIStore()
  const { createTask, updateTask, loading: taskLoading } = useTaskStore()
  const { teams, members, loadTeams, loadMembers } = useTeamStore()
  
  const isEdit = !!overlayData?.id
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team_id: '',
    assigned_to: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
  })
  
  const [error, setError] = useState('')
  const [loadingTeams, setLoadingTeams] = useState(true)

  useEffect(() => {
    const initTeams = async () => {
      try { await loadTeams() } finally { setLoadingTeams(false) }
    }
    initTeams()
  }, [loadTeams])

  useEffect(() => {
    if (overlayData) {
      setFormData({
        title: overlayData.title || '',
        description: overlayData.description || '',
        team_id: overlayData.team_id || '',
        assigned_to: overlayData.assigned_to || '',
        status: overlayData.status || 'todo',
        priority: overlayData.priority || 'medium',
        due_date: overlayData.due_date || '',
      })
      if (overlayData.team_id) { loadMembers(overlayData.team_id) }
    }
  }, [overlayData, loadMembers])

  useEffect(() => {
    if (formData.team_id && !isEdit) { loadMembers(formData.team_id) }
  }, [formData.team_id, isEdit, loadMembers])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'team_id' && { assigned_to: '' })
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...formData,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date || null,
      }
      if (isEdit) { await updateTask(overlayData.id, payload) } else { await createTask(payload) }
      onSuccess?.()
      closeOverlay()
    } catch (err) { setError(err.message) }
  }

  const handleClose = () => {
    closeOverlay()
    setError('')
  }

  return (
    <AnimatePresence>
      {activeOverlay === 'task' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
            variants={backdropVariants}
            initial="initial" animate="animate" exit="exit"
            onClick={handleClose}
          />

          <motion.div 
            className="w-full max-w-2xl glass-panel rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
            variants={modalVariants}
            initial="initial" animate="animate" exit="exit"
          >
            {/* Sidebar Accent */}
            <div className="md:w-32 bg-on-tertiary-fixed text-white p-6 flex flex-col justify-end hidden md:flex">
               <span className="font-headline font-black text-4xl opacity-20 rotate-[-90deg] translate-x-3 translate-y-12 select-none pointer-events-none uppercase tracking-tighter">
                 {isEdit ? 'ARCHIVE' : 'PROTOCOL'}
               </span>
            </div>

            <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-sm">assignment</span>
                     </div>
                     <h2 className="font-headline font-black text-2xl uppercase tracking-tighter">
                       {isEdit ? 'Edit Protocol' : 'Develop Task'}
                     </h2>
                  </div>
                  <p className="text-xs font-headline font-bold text-stone-400 uppercase tracking-widest italic">Operational roadmap for team progress</p>
                </div>
                <button onClick={handleClose} className="text-stone-400 hover:text-black transition-colors">
                   <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-[0.3em] ml-1">Protocol Title</label>
                  <input
                    type="text" name="title" value={formData.title} onChange={handleChange}
                    placeholder="e.g., SYNC API ENDPOINTS"
                    className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl font-headline font-black text-lg uppercase tracking-widest focus:ring-2 focus:ring-on-tertiary-fixed transition-all"
                    required maxLength={255}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                   <label className="block text-xs font-black uppercase tracking-[0.3em] ml-1">Mission Briefing</label>
                   <textarea
                     name="description" value={formData.description} onChange={handleChange}
                     className="w-full h-32 p-5 bg-surface-container-highest border-none rounded-xl font-body text-sm focus:ring-2 focus:ring-on-tertiary-fixed transition-all resize-none"
                     placeholder="Detailed operational steps..." maxLength={2000}
                   />
                </div>

                {/* Team & Assignment Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] ml-1">Squad Deployment</label>
                      <select
                        name="team_id" value={formData.team_id} onChange={handleChange}
                        className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl font-headline font-bold uppercase tracking-widest text-[10px] focus:ring-2 focus:ring-on-tertiary-fixed transition-all cursor-pointer"
                        required disabled={isEdit || loadingTeams}
                      >
                         <option value="">SELECT UNIFIED SQUAD</option>
                         {teams.map(team => <option key={team.id} value={team.id}>{team.name.toUpperCase()}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] ml-1">Assigned Unit</label>
                      <select
                        name="assigned_to" value={formData.assigned_to} onChange={handleChange}
                        className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl font-headline font-bold uppercase tracking-widest text-[10px] focus:ring-2 focus:ring-on-tertiary-fixed transition-all cursor-pointer"
                        disabled={!formData.team_id}
                      >
                         <option value="">FREE AGENT</option>
                         {members.map(member => <option key={member.user_id} value={member.user_id}>{`${member.first_name} ${member.last_name}`.toUpperCase()}</option>)}
                      </select>
                   </div>
                </div>

                {/* Status & Priority Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] ml-1">Operational Status</label>
                      <div className="flex flex-wrap gap-2">
                         {['todo', 'in_progress', 'review', 'completed'].map(st => (
                           <button
                             key={st} type="button" onClick={() => setFormData(p => ({ ...p, status: st }))}
                             className={`px-3 py-2 rounded-lg font-headline font-black text-[9px] uppercase tracking-widest border-2 transition-all ${
                               formData.status === st ? 'bg-black text-white border-black' : 'bg-surface-container-low text-on-surface-variant border-transparent'
                             }`}
                           >
                              {st === 'in_progress' ? 'ACTIVE' : st.toUpperCase()}
                           </button>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] ml-1">Threat Level</label>
                      <div className="flex flex-wrap gap-2">
                         {['low', 'medium', 'high', 'urgent'].map(pr => (
                           <button
                             key={pr} type="button" onClick={() => setFormData(p => ({ ...p, priority: pr }))}
                             className={`px-3 py-2 rounded-lg font-headline font-black text-[9px] uppercase tracking-widest border-2 transition-all ${
                               formData.priority === pr 
                                 ? pr === 'urgent' ? 'bg-tertiary text-white border-tertiary' : 'bg-black text-white border-black'
                                 : 'bg-surface-container-low text-on-surface-variant border-transparent'
                             }`}
                           >
                              {pr.toUpperCase()}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                   <label className="block text-xs font-black uppercase tracking-[0.3em] ml-1">Deadline Sequence</label>
                   <input
                     type="date" name="due_date" value={formData.due_date} onChange={handleChange}
                     min={new Date().toISOString().split('T')[0]}
                     className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl font-headline font-bold text-sm tracking-[0.2em] focus:ring-2 focus:ring-on-tertiary-fixed transition-all"
                   />
                </div>

                {error && <div className="p-4 bg-tertiary/10 text-tertiary rounded-xl font-body text-sm flex gap-3"><span className="material-symbols-outlined">error</span>{error}</div>}

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-6">
                   <button
                     type="button" onClick={handleClose}
                     className="text-[10px] font-headline font-black uppercase tracking-[0.2em] text-stone-400 hover:text-black transition-colors"
                   >
                     Abort Sequence
                   </button>
                   <button
                     type="submit" disabled={taskLoading}
                     className="h-14 px-12 bg-on-tertiary-fixed text-surface rounded-none font-headline font-black text-sm uppercase tracking-[0.3em] hover:bg-tertiary hover:scale-[1.05] active:scale-95 transition-all shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]"
                   >
                     {taskLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isEdit ? 'Commit Changes' : 'Initialize Protocol')}
                   </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}