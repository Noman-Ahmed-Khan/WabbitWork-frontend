/**
 * Badge - Brutalist Editorial Design
 * Status pills following the design system tokens
 */
export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) {
  const variantClasses = {
    default: 'bg-surface-container-highest text-on-surface-variant',
    primary: 'bg-on-tertiary-fixed text-white',
    secondary: 'bg-secondary-container text-on-secondary-container',
    accent: 'bg-tertiary-container text-on-tertiary-container',
    info: 'bg-surface-container-high text-on-surface-variant',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-tertiary-container text-on-tertiary-container',
    error: 'bg-red-100 text-red-700',
    ghost: 'bg-stone-100 text-stone-500',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center font-headline font-bold uppercase tracking-widest rounded-full ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}