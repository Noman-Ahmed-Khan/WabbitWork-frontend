import { motion } from 'framer-motion'

export default function RemoveAvatarButton({
  onClick,
  disabled = false,
  className = '',
  children = 'Remove avatar',
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-tertiary text-tertiary font-headline font-black text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-tertiary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 ${className}`}
    >
      <span className="material-symbols-outlined text-sm">delete</span>
      <span>{children}</span>
    </motion.button>
  )
}
