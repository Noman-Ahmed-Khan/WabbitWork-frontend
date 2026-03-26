import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../stores/authStore'

/**
 * Email Verification Banner - Brutalist Editorial Design
 * High-impact top-level banner with tactical verification flow
 */
export default function EmailVerificationBanner() {
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [code, setCode] = useState('')
  const [resending, setResending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [dismissed, setDismissed] = useState(false)

  const { 
    user, 
    emailVerificationRequired, 
    verifyEmailWithCode, 
    resendVerification 
  } = useAuthStore()

  if (!emailVerificationRequired || !user || dismissed) return null

  const handleResend = async () => {
    try {
      setResending(true)
      setMessage({ type: '', text: '' })
      await resendVerification()
      setMessage({ type: 'success', text: 'PROTOCOL DISPATCHED' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'DISPATCH FAILED' })
    } finally {
      setResending(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (code.length !== 6) return
    try {
      setVerifying(true)
      setMessage({ type: '', text: '' })
      await verifyEmailWithCode(code)
      setMessage({ type: 'success', text: 'VERIFICATION OPTIMIZED' })
      setTimeout(() => setDismissed(true), 1500)
    } catch (error) {
      setMessage({ type: 'error', text: 'INVALID SEQUENCE' })
      setCode('')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-black text-white p-4 md:p-6 shadow-2xl relative z-[60] overflow-hidden"
    >
      {/* Decorative oversized background text */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-headline font-black text-4xl text-white/[0.03] uppercase select-none pointer-events-none whitespace-nowrap">SECURITY PROTOCOLS</span>
      
      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-none bg-tertiary flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform">
             <span className="material-symbols-outlined text-white text-2xl">mail_lock</span>
          </div>
          <div>
            <h3 className="font-headline font-black text-lg uppercase tracking-tight leading-none mb-1">Unverified Identity</h3>
            <p className="text-xs uppercase font-bold tracking-[0.2em] text-white/50">Sequence required at {user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className="px-6 py-3 border-2 border-white/20 hover:border-white font-headline font-black text-xs uppercase tracking-widest transition-all"
          >
            {resending ? 'Dispatched' : 'Re-Dispatch'}
          </button>
          <button
            onClick={() => setShowCodeInput(!showCodeInput)}
            className="px-6 py-3 bg-white text-black font-headline font-black text-xs uppercase tracking-widest hover:scale-[1.05] transition-all active:scale-95"
          >
            {showCodeInput ? 'Abort' : 'Activate Identity'}
          </button>
        </div>
      </div>

      {/* Code Input Expansion */}
      <AnimatePresence>
        {showCodeInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="container mx-auto max-w-7xl relative z-10"
          >
             <form onSubmit={handleVerify} className="mt-8 pt-8 border-t border-white/20 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-3">
                   <label className="text-xs font-black uppercase tracking-[0.4em] text-white/50">Sequence Code Entry</label>
                   <input
                     type="text"
                     value={code}
                     onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                     placeholder="000–000"
                     className="bg-transparent border-b-4 border-white text-4xl md:text-5xl font-headline font-black text-center tracking-[0.5em] w-full max-w-md focus:outline-none focus:border-tertiary transition-colors uppercase placeholder:opacity-20"
                     maxLength={6}
                   />
                </div>
                
                <div className="flex flex-col items-center gap-4">
                   <button
                     type="submit"
                     disabled={verifying || code.length !== 6}
                     className="h-14 px-12 bg-tertiary text-white font-headline font-black text-sm uppercase tracking-[0.3em] hover:scale-[1.05] transition-all active:scale-95 shadow-[8px_8px_0_0_rgba(255,255,255,0.1)] disabled:opacity-30"
                   >
                     {verifying ? 'Validating...' : 'Optimize Identity'}
                   </button>
                   
                   {message.text && (
                     <p className={`text-xs font-headline font-black uppercase tracking-widest ${message.type === 'success' ? 'text-green-400' : 'text-tertiary'}`}>
                        {message.text}
                     </p>
                   )}
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}