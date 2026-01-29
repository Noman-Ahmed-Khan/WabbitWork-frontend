import cx from '../../utils/cx'

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) {
  const variantClasses = {
    default: 'badge-neutral',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    info: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    ghost: 'badge-ghost',
  }

  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  }

  return (
    <span
      className={cx(
        'badge',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}