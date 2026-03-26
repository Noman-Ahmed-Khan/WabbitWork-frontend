import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useUIStore from '../../stores/uiStore'
import useTeamStore from '../../stores/teamStore'
import { modalVariants, backdropVariants } from '../../animations/variants'

/**
 * Team Create/Edit Overlay - Brutalist Editorial Design
 * High-end glass panel with oversized accents and Space Grotesk typography
 */
export default function TeamOverlay({ onSuccess }) {
  const { activeOverlay, overlayData, closeOverlay } = useUIStore()
  const { createTeam, updateTeam, loading } = useTeamStore()
  
  const isEdit = !!overlayData?.id 
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (overlayData) {
      setFormData({
        name: overlayData.name || '',
        description: overlayData.description || '',
      })
    }
  }, [overlayData])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (isEdit) {
        await updateTeam(overlayData.id, formData)
      } else {
        await createTeam(formData)
      }
      onSuccess?.()
      closeOverlay()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AnimatePresence>
      {activeOverlay === 'team' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={closeOverlay}
          />

          <motion.div 
            className="w-full max-w-xl glass-panel rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Editorial Sidebar Accent */}
            <div className="md:w-32 bg-black text-white p-6 flex flex-col justify-end hidden md:flex">
               <span className="font-headline font-black text-4xl opacity-20 rotate-[-90deg] translate-x-3 translate-y-12 select-none pointer-events-none whitespace-nowrap uppercase tracking-tighter">
                 {isEdit ? 'UPDATE' : 'CREATE'}
               </span>
            </div>

            <div className="flex-1 p-8 md:p-12">
              {/* Header */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-sm">{isEdit ? 'edit' : 'add'}</span>
                   </div>
                   <h2 className="font-headline font-black text-2xl uppercase tracking-tighter">
                     {isEdit ? 'Edit Team' : 'New Team Hub'}
                   </h2>
                </div>
                <p className="text-xs font-headline font-bold text-stone-400 uppercase tracking-widest italic">Define your collective architecture</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Team Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-[0.3em] text-on-surface ml-1">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., DEPT OF ENGINEERING"
                    className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl font-headline font-bold uppercase tracking-widest text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-black transition-all"
                    required
                    maxLength={100}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-[0.3em] text-on-surface ml-1">
                    Mission Briefing
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full h-32 p-5 bg-surface-container-highest border-none rounded-xl font-body text-on-surface text-sm placeholder:text-outline-variant focus:ring-2 focus:ring-black transition-all resize-none"
                    placeholder="Define the scope and objectives..."
                    maxLength={500}
                  />
                  <div className="text-[10px] font-headline font-bold text-stone-400 text-right tracking-widest uppercase">
                    {formData.description.length}/500
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 bg-tertiary/10 text-tertiary rounded-xl font-body text-sm flex gap-3">
                     <span className="material-symbols-outlined text-xl">error_outline</span>
                     {error}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-6">
                   <button
                     type="button"
                     onClick={closeOverlay}
                     className="text-[10px] font-headline font-black uppercase tracking-[0.2em] text-stone-400 hover:text-black transition-colors"
                   >
                     Abort
                   </button>
                   <button
                     type="submit"
                     disabled={loading}
                     className="h-14 px-10 bg-on-tertiary-fixed text-surface rounded-xl font-headline font-bold text-sm tracking-tight flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.05] active:scale-95 primary-btn-glow"
                   >
                     {loading ? (
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <>
                         <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {isEdit ? 'save' : 'rocket_launch'}
                         </span>
                         <span className="uppercase tracking-[0.2em]">{isEdit ? 'Update Hub' : 'Launch Squad'}</span>
                       </>
                     )}
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