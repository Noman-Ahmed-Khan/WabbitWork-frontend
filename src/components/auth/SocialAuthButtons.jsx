import { motion } from 'framer-motion'
import { Globe, Building2 } from 'lucide-react'
import { socialContainerVariants, socialItemVariants } from '../../animations/authVariants'

/**
 * Social authentication buttons
 */
export default function SocialAuthButtons() {
  return (
    <motion.div 
      className="mt-3 pt-3 border-t border-black/10 dark:border-white/10"
      variants={socialContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="grid grid-cols-2 gap-2">
        <motion.button 
          variants={socialItemVariants}
          className="h-9 bg-black/[0.03] dark:bg-white/[0.05] backdrop-blur-sm hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all rounded-lg flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300 border border-black/5 dark:border-white/10"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Globe className="w-3.5 h-3.5" />
          Google
        </motion.button>
        
        <motion.button 
          variants={socialItemVariants}
          className="h-9 bg-black/[0.03] dark:bg-white/[0.05] backdrop-blur-sm hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all rounded-lg flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300 border border-black/5 dark:border-white/10"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Building2 className="w-3.5 h-3.5" />
          SSO
        </motion.button>
      </div>
    </motion.div>
  )
}