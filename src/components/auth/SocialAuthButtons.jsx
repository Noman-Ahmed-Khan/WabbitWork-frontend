import { motion } from 'framer-motion'
import { socialContainerVariants, socialItemVariants } from '../../animations/authVariants'
import useAuthStore from '../../stores/authStore'

/**
 * Social authentication buttons
 */
export default function SocialAuthButtons() {
  const { googleLogin } = useAuthStore()

  return (
    <motion.div 
      className="mt-3 pt-3 border-t border-black/10 dark:border-white/10"
      variants={socialContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.button 
        variants={socialItemVariants}
        type="button"
        onClick={googleLogin}
        className="h-9 w-full bg-black/[0.03] dark:bg-white/[0.05] backdrop-blur-sm hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all rounded-lg flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300 border border-black/5 dark:border-white/10"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          className="w-3.5 h-3.5 shrink-0"
        >
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.22 3.6l6.9-6.9C35.84 2.67 30.33 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.02 6.23C12.51 13.03 17.62 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.54-.14-3.01-.44-4.5H24v9h12.44c-.56 2.83-2.1 5.23-4.36 6.82l6.73 5.21C43.97 36.69 46.5 31.03 46.5 24.5z" />
          <path fill="#FBBC05" d="M10.58 28.01A14.5 14.5 0 0 1 9.5 24c0-1.43.2-2.82.58-4.01L2.06 13.76A23.94 23.94 0 0 0 0 24c0 3.84.9 7.47 2.56 10.78l8.02-6.77z" />
          <path fill="#34A853" d="M24 48c6.34 0 11.66-2.1 15.55-5.71l-6.73-5.21C30.69 39.5 27.56 40.5 24 40.5c-6.38 0-11.49-3.53-13.42-8.5l-8.02 6.23C6.51 42.62 14.62 48 24 48z" />
          <path fill="#EA4335" d="M12.58 29.99A14.53 14.53 0 0 1 9.5 24c0-2.14.47-4.16 1.31-5.99l-8.02-6.23A23.94 23.94 0 0 0 0 24c0 3.84.9 7.47 2.56 10.78l8.02-6.23z" />
        </svg>
        Google
      </motion.button>
    </motion.div>
  )
}
