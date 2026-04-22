import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import { requirementsContainerVariants, requirementItemVariants } from '../../animations/authVariants'

/**
 * Animated password requirements checklist
 */
export default function PasswordRequirements({ password }) {
  const requirements = [
    { met: password.length >= 8, text: "8+" },
    { met: /[A-Z]/.test(password), text: "A-Z" },
    { met: /[a-z]/.test(password), text: "a-z" },
    { met: /[0-9]/.test(password), text: "0-9" },
  ]

  return (
    <motion.div 
      className="flex gap-3 px-1"
      variants={requirementsContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {requirements.map((req, index) => (
        <motion.span 
          key={index} 
          className={`text-[9px] font-black normal-case tracking-wider flex items-center gap-1 transition-colors duration-200 ${
            req.met ? 'text-green-600 dark:text-green-400' : 'text-neutral-400 dark:text-neutral-500'
          }`}
          variants={requirementItemVariants}
        >
          <motion.span
            initial={false}
            animate={req.met ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {req.met ? (
              <Check className="w-3 h-3" strokeWidth={3} />
            ) : (
              <Circle className="w-2.5 h-2.5" strokeWidth={2} />
            )}
          </motion.span>
          {req.text}
        </motion.span>
      ))}
    </motion.div>
  )
}
