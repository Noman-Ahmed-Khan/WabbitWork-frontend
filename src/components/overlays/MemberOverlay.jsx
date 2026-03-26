import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useUIStore from '../../stores/uiStore'
import useInvitationStore from '../../stores/invitationStore'
import { modalVariants, backdropVariants } from '../../animations/variants'

/**
 * Member Invitation Overlay - Brutalist Editorial Design
 * High-end glass panel with editorial typography and tactile inputs
 */
export default function MemberOverlay({ teamId, teamName, onSuccess }) {
  const { activeOverlay, closeOverlay } = useUIStore()
  const { createInvitation, loading } = useInvitationStore()
  
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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

    if (!teamId) {
      setError('No team selected. Please try again.')
      return
    }

    try {
      await createInvitation(teamId, formData)
      setSuccess(true)
      
      setTimeout(() => {
        onSuccess?.()
        closeOverlay()
        setFormData({ email: '', role: 'member', message: '' })
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to send invitation')
    }
  }

  const handleClose = () => {
    closeOverlay()
    setFormData({ email: '', role: 'member', message: '' })
    setError('')
    setSuccess(false)
  }

  return (
    <AnimatePresence>
      {activeOverlay === 'member' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          {/* Backdrop with grain effect implicit via index.css grain */}
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleClose}
          />

          <motion.div 
            className="w-full max-w-xl glass-panel rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Editorial Sidebar Accent */}
            <div className="md:w-32 bg-on-tertiary-fixed text-white p-6 flex flex-col justify-end hidden md:flex">
               <span className="font-headline font-black text-4xl opacity-20 rotate-[-90deg] translate-x-3 translate-y-12 select-none pointer-events-none whitespace-nowrap">INVITE</span>
            </div>

            <div className="flex-1 p-8 md:p-12">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-sm">person_add</span>
                   </div>
                   <h2 className="font-headline font-black text-2xl uppercase tracking-tighter">Invite Member</h2>
                </div>
                {teamName && (
                  <p className="text-xs font-headline font-bold text-stone-400 uppercase tracking-widest">{teamName}</p>
                )}
              </div>

              {/* Success State */}
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 relative">
                       <motion.div 
                         initial={{ scale: 0 }}
                         animate={{ scale: 1.5, opacity: 0 }}
                         transition={{ repeat: Infinity, duration: 1.5 }}
                         className="absolute inset-0 bg-green-200 rounded-full"
                       />
                       <span className="material-symbols-outlined text-4xl text-green-600 relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h3 className="font-headline font-black text-xl uppercase tracking-tight mb-2">Invitation Sent!</h3>
                    <p className="text-sm font-body text-on-surface-variant/80">
                      An invitation has been sent to {formData.email}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-[0.3em] text-on-surface ml-1">
                        Email Address
                      </label>
                      <div className="relative">
                         <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">mail</span>
                         <input
                           type="email"
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           placeholder="colleague@example.com"
                           className="w-full h-14 pl-12 pr-5 bg-surface-container-highest border-none rounded-xl font-body text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-on-tertiary-fixed transition-all"
                           required
                         />
                      </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                       <label className="block text-xs font-black uppercase tracking-[0.3em] text-on-surface ml-1">
                          Access Role
                       </label>
                       <div className="flex gap-4">
                          {['member', 'admin'].map(role => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, role }))}
                              className={`flex-1 p-4 rounded-xl border-2 transition-all text-left group ${
                                formData.role === role 
                                  ? 'border-black bg-black text-white' 
                                  : 'border-stone-100 bg-surface-container-low text-on-surface-variant hover:border-black'
                              }`}
                            >
                               <span className="font-headline font-black text-xs uppercase tracking-widest block mb-1">{role}</span>
                               <span className={`text-[9px] leading-tight block opacity-60 ${formData.role === role ? 'text-white' : 'text-stone-400'}`}>
                                  {role === 'admin' ? 'Can manage members' : 'Full access to tasks'}
                               </span>
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Personal Message */}
                    <div className="space-y-2">
                       <label className="block text-xs font-black uppercase tracking-[0.3em] text-on-surface ml-1">
                          Message (Optional)
                       </label>
                       <textarea
                         name="message"
                         value={formData.message}
                         onChange={handleChange}
                         className="w-full h-24 p-5 bg-surface-container-highest border-none rounded-xl font-body text-on-surface text-sm placeholder:text-outline-variant focus:ring-2 focus:ring-on-tertiary-fixed transition-all resize-none"
                         placeholder="Add a personal note..."
                         maxLength={500}
                       />
                       <div className="text-[10px] font-headline font-bold text-stone-400 text-right tracking-widest uppercase">
                         {formData.message.length}/500
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
                    <div className="pt-4 flex items-center justify-end gap-4">
                       <button
                         type="button"
                         onClick={handleClose}
                         className="text-[10px] font-headline font-black uppercase tracking-[0.2em] text-stone-400 hover:text-black transition-colors"
                       >
                         Dismiss
                       </button>
                       <button
                         type="submit"
                         disabled={loading}
                         className="h-14 px-8 bg-on-tertiary-fixed text-surface rounded-xl font-headline font-bold text-sm tracking-tight flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.05] active:scale-95 primary-btn-glow"
                       >
                         {loading ? (
                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                         ) : (
                           <>
                             <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                             <span className="uppercase tracking-[0.2em]">Send Invitation</span>
                           </>
                         )}
                       </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
