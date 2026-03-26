import { motion, AnimatePresence } from 'framer-motion'
import { Lock, UserPlus, KeyRound } from 'lucide-react'
import { titleVariants, iconVariants } from '../../animations/authVariants'

/**
 * Auth card header with animated title and icon
 */
export default function AuthHeader({ mode }) {
  const config = {
    login: { title: 'Login', Icon: Lock },
    register: { title: 'Register', Icon: UserPlus },
    forgot: { title: 'Reset', Icon: KeyRound }
  }

  const { title, Icon } = config[mode] || config.login

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Animated Title */}
      <div className="relative overflow-hidden h-8">
        <AnimatePresence mode="wait">
          <motion.h1 
            key={mode}
            className="font-black text-2xl text-neutral-900 dark:text-white tracking-tight uppercase"
            variants={titleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {title}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Animated Icon */}
      <motion.div 
        className="w-9 h-9 bg-neutral-200/70 dark:bg-neutral-700/40 backdrop-blur-sm rounded-lg flex items-center justify-center border border-black/5 dark:border-white/10 overflow-hidden"
        whileHover={{ scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Icon className="w-4 h-4 text-neutral-700 dark:text-neutral-200" strokeWidth={2.5} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}