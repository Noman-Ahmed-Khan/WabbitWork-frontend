/**
 * Button - Brutalist Editorial Design
 * Replaces DaisyUI btn classes with design system tokens
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const variantClasses = {
    primary: 'bg-on-tertiary-fixed text-white hover:scale-105 active:scale-95',
    secondary: 'bg-primary-container text-on-primary-container hover:bg-surface-container-highest',
    accent: 'bg-tertiary text-white hover:scale-105 active:scale-95',
    ghost: 'bg-transparent text-on-surface hover:bg-surface-container-highest',
    error: 'bg-error text-on-error hover:opacity-80',
    success: 'bg-green-700 text-white hover:opacity-80',
    outline: 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-white',
  }

  const sizeClasses = {
    sm: 'px-4 py-1.5 text-[10px]',
    md: 'px-6 py-2.5 text-xs',
    lg: 'px-8 py-3.5 text-sm',
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-headline font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}