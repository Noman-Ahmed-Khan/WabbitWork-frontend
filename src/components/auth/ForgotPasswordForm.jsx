import { useState } from 'react'
import authApi from '../../api/auth'
import Panel from '../../layouts/Panel'

/**
 * Forgot Password Form - Brutalist Editorial Design
 * Tactical form with high-impact editorial typography and Material Symbols
 */
export default function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await authApi.forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Panel className="text-center py-12 px-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8 relative">
           <div className="absolute inset-0 bg-green-200 rounded-full animate-pulse opacity-50" />
           <span className="material-symbols-outlined text-4xl text-green-600 relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>mail_lock</span>
        </div>
        <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-4 italic">Check Inbox</h2>
        <p className="font-body text-xs text-stone-500 mb-10 leading-relaxed max-w-xs mx-auto">
          If an account exists for <strong className="text-on-surface">{email}</strong>, we have dispatched password reset instructions.
        </p>
        <button 
          onClick={onBack}
          className="h-14 w-full bg-black text-white rounded-none font-headline font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.05] transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Return to Sign-In
        </button>
      </Panel>
    )
  }

  return (
    <Panel className="p-6 md:p-8">
      <div className="mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 group transition-all"
        >
          <span className="material-symbols-outlined text-stone-400 group-hover:text-black transition-colors">arrow_back</span>
          <span className="text-[10px] font-headline font-bold text-stone-400 uppercase tracking-widest group-hover:text-black transition-colors pt-0.5">Back</span>
        </button>
      </div>

      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-2xl text-black">lock_open</span>
        </div>
        <h2 className="font-headline font-black text-2xl uppercase tracking-tighter mb-2 italic">Password Recovery</h2>
        <p className="font-label text-xs font-medium text-stone-400 uppercase tracking-[0.2em]">Enter credentials to reset protocols</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
           <label className="block text-xs font-black uppercase tracking-[0.3em] text-on-surface ml-1">Email Address</label>
           <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@system.com"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                className="w-full h-14 pl-12 pr-5 bg-surface-container-highest border-none rounded-xl font-headline font-bold tracking-widest text-sm text-on-surface focus:ring-2 focus:ring-black transition-all"
              />
           </div>
        </div>

        {error && (
          <div className="p-4 bg-tertiary/10 text-tertiary rounded-xl font-body text-sm flex gap-3">
             <span className="material-symbols-outlined">error</span>
             {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-14 w-full bg-on-tertiary-fixed text-surface rounded-none font-headline font-black text-sm uppercase tracking-[0.3em] hover:bg-tertiary hover:scale-[1.05] active:scale-95 transition-all shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] primary-btn-glow"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            <>
              <span className="material-symbols-outlined text-sm inline-block mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
               Dispatch Reset Link
            </>
          )}
        </button>
      </form>
    </Panel>
  )
}
