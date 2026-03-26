import { motion, AnimatePresence } from 'framer-motion'
import { watermarkVariants } from '../../animations/authVariants'

/**
 * Floating brutalist background decorations
 */
export default function BackgroundElements({ mode }) {
  return (
    <>
      {/* Floating Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Ampersand */}
        <motion.span 
          className="absolute -top-20 -right-20 font-black text-[28rem] text-black/[0.06] dark:text-white/[0.06] rotate-12 leading-none"
          animate={{ 
            y: [0, -15, 0], 
            rotate: [12, 8, 12] 
          }}
          transition={{ 
            duration: 14, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          &
        </motion.span>
        
        {/* Circle */}
        <motion.div 
          className="absolute top-1/4 -left-24 w-72 h-72 border-[35px] border-black/[0.04] dark:border-white/[0.04] rounded-full"
          animate={{ 
            x: [0, 20, 0], 
            scale: [1, 1.05, 1] 
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* X Mark */}
        <motion.span 
          className="absolute bottom-1/4 -right-10 font-black text-[14rem] text-black/[0.07] dark:text-white/[0.07] -rotate-45 leading-none"
          animate={{ 
            x: [0, -12, 0], 
            rotate: [-45, -42, -45] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          X
        </motion.span>
      </div>

      {/* Mode Watermark */}
      <AnimatePresence mode="wait">
        <motion.span 
          key={mode}
          className="fixed -bottom-20 -left-10 font-black text-[18rem] text-black/[0.03] dark:text-white/[0.05] tracking-tighter uppercase select-none pointer-events-none z-0 leading-none"
          variants={watermarkVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {mode?.toUpperCase()}
        </motion.span>
      </AnimatePresence>
    </>
  )
}