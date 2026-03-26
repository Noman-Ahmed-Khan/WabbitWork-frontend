import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'

import GrainyCard from '../components/auth/GrainyCard'
import AuthHeader from '../components/auth/AuthHeader'
import AuthFormContent from '../components/auth/AuthFormContent'
import BackgroundElements from '../components/auth/BackgroundElements'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'
import { cardVariants } from '../animations/authVariants'

/**
 * Authentication View - Brutalist Editorial Design
 * Clean glass panel with subtle grain
 */
export default function AuthView() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const returnUrl = searchParams.get('returnUrl')
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login'
  
  const [mode, setMode] = useState(initialMode) 
  const { login, register, loading, error, clearError } = useAuthStore()
  const { theme, toggleTheme } = useUIStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })

  const isPasswordValid = 
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[a-z]/.test(formData.password) &&
    /[0-9]/.test(formData.password)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'login') {
        await login({ email: formData.email, password: formData.password })
      } else {
        if (!isPasswordValid) return
        await register({ ...formData })
      }
      navigate(returnUrl || '/dashboard')
    } catch (err) {
      console.error('Auth error:', err)
    }
  }

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login'
    setMode(newMode)
    clearError()
    setFormData({ email: '', password: '', first_name: '', last_name: '' })
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-neutral-100 dark:bg-neutral-900"
      style={{ perspective: '1200px' }}
    >
      {/* Background Elements */}
      <BackgroundElements mode={mode} />

      {/* Corner Branding */}
      <motion.div 
        className="fixed top-6 left-6 z-50 flex flex-col"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <span className="font-black text-xl tracking-tighter uppercase text-neutral-900 dark:text-white leading-none">
          TaskMaster
        </span>
        <span className="font-semibold text-[7px] tracking-[0.25em] uppercase text-neutral-400 dark:text-neutral-500">
          Brutalist Edition
        </span>
      </motion.div>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-2.5 rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80 backdrop-blur-xl hover:bg-neutral-900 dark:hover:bg-white transition-all duration-200 border border-black/5 dark:border-white/10 group"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle theme"
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 180 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-neutral-600 group-hover:text-white" strokeWidth={2} />
          ) : (
            <Sun className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900" strokeWidth={2} />
          )}
        </motion.div>
      </motion.button>

      {/* Main Card */}
      <main className="w-full max-w-sm relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <GrainyCard className="backdrop-blur-xl bg-white/60 dark:bg-neutral-800/50 p-5 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)] border border-white/60 dark:border-white/[0.06]">
              
              <AuthHeader mode={mode} />

              {mode === 'forgot' ? (
                <ForgotPasswordForm onBack={() => setMode('login')} />
              ) : (
                <AuthFormContent
                  mode={mode}
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onModeChange={toggleMode}
                  onForgotPassword={() => setMode('forgot')}
                  loading={loading}
                  error={error}
                  isPasswordValid={isPasswordValid}
                />
              )}
            </GrainyCard>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.div 
          className="mt-4 flex justify-center items-center gap-2 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400">
            Online
          </span>
          <motion.span 
            className="w-1 h-1 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400">
            v4.0
          </span>
        </motion.div>
      </main>
    </div>
  )
}