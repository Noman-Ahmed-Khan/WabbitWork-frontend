import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Key, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'
import PasswordRequirements from './PasswordRequirements'
import SocialAuthButtons from './SocialAuthButtons'
import {
  formContainerVariants,
  formItemVariants,
  glitchRevealVariants,
} from '../../animations/authVariants'

/**
 * Animated form content for login/register
 */
export default function AuthFormContent({
  mode,
  formData,
  onChange,
  onSubmit,
  onModeChange,
  onForgotPassword,
  loading,
  error,
  isPasswordValid,
}) {
  const [showPassword, setShowPassword] = useState(false)

  const inputClasses = 'w-full h-10 bg-black/[0.04] dark:bg-white/[0.06] backdrop-blur-sm border border-black/8 dark:border-white/10 rounded-lg font-black text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-white/80 focus:border-transparent transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-white'

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key={mode}
        className="space-y-3"
        onSubmit={onSubmit}
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Name Fields - Register Only */}
        <AnimatePresence>
          {mode === 'register' && (
            <motion.div
              className="grid grid-cols-2 gap-3"
              variants={glitchRevealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={formItemVariants}>
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-1 ml-1">
                  First
                </label>
                <input
                  className={`${inputClasses} px-3`}
                  name="first_name"
                  value={formData.first_name}
                  onChange={onChange}
                  placeholder="JOHN"
                  required
                />
              </motion.div>
              <motion.div variants={formItemVariants}>
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-1 ml-1">
                  Last
                </label>
                <input
                  className={`${inputClasses} px-3`}
                  name="last_name"
                  value={formData.last_name}
                  onChange={onChange}
                  placeholder="DOE"
                  required
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <motion.div variants={formItemVariants}>
          <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-1 ml-1">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500"
              strokeWidth={2}
            />
            <input
              className={`${inputClasses} pl-10 pr-3`}
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              placeholder="USER@MAIL.COM"
              required
            />
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={formItemVariants}>
          <div className="flex justify-between items-center mb-1 ml-1">
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Password
            </label>
            {mode === 'login' && (
              <motion.button
                type="button"
                onClick={onForgotPassword}
                className="text-[8px] font-black text-neutral-400 uppercase tracking-wider hover:text-neutral-900 dark:hover:text-white transition-colors"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                Forgot?
              </motion.button>
            )}
          </div>
          <div className="relative">
            <Key
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500"
              strokeWidth={2}
            />

            <input
              className={`${inputClasses} pl-10 pr-10`}
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={onChange}
              placeholder="********"
              required
            />

            <div className="absolute right-3 inset-y-0 flex items-center">
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full leading-none text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
                whileTap={{ scale: 0.92 }}
                style={{ transformOrigin: 'center' }}
              >
                <motion.div
                  initial={false}
                  className="flex h-full w-full items-center justify-center"
                  animate={{ rotateY: showPassword ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  // style={{ backfaceVisibility: 'hidden' }}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={2} />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Password Requirements */}
        <AnimatePresence>
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <PasswordRequirements password={formData.password} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg text-[10px] font-medium border border-red-500/20"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div variants={formItemVariants}>
          <motion.button
            type="submit"
            disabled={loading || (mode === 'register' && !isPasswordValid)}
            className="w-full h-11 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-0 rounded-lg font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
          >
            {/* Subtle grain on button */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
              }}
            />

            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <span className="relative z-10">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Social Auth */}
        <AnimatePresence>
          {mode === 'login' && <SocialAuthButtons />}
        </AnimatePresence>

        {/* Mode Toggle */}
        <motion.footer className="pt-1 text-center" variants={formItemVariants}>
          <motion.button
            type="button"
            onClick={onModeChange}
            className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em] hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>{mode === 'login' ? 'Create Account' : 'Back to Login'}</span>
            <motion.span
              animate={{ x: mode === 'login' ? [0, 3, 0] : [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {mode === 'login' ? (
                <ArrowRight className="w-3 h-3" />
              ) : (
                <ArrowLeft className="w-3 h-3" />
              )}
            </motion.span>
          </motion.button>
        </motion.footer>
      </motion.form>
    </AnimatePresence>
  )
}
