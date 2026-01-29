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
        'rounded-2xl',
        'shadow-lg',
        'border border-base-300',
        glass && 'bg-base-100/80 backdrop-blur-md',
        !glass && 'bg-base-100',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}