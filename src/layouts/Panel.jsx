import cx from '../utils/cx'

/**
 * Panel / Card wrapper - Brutalist Editorial Design
 * Uses tonal carving (surface background shifts) instead of borders
 */
export default function Panel({ 
  children, 
  className = '',
  glass = false,
  noPadding = false,
  ...props 
}) {
  return (
    <div
      className={cx(
        'rounded-xl',
        'relative',
        'z-10',
        glass ? 'bg-surface/95 backdrop-blur-md' : 'bg-surface',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}