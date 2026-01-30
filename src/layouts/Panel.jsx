import cx from '../utils/cx'

/**
 * Morphic panel component
 * Provides consistent styling for all content containers
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
        'shadow-md',
        'border border-base-300/60',
        'relative',
        'z-10',
        glass ? 'bg-base-100/95 backdrop-blur-sm' : 'bg-base-100',
        !noPadding && 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}