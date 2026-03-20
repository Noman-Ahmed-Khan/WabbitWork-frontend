import cx from '../utils/cx'

/**
 * Panel / Card wrapper component
 * Provides consistent styling for all content containers
 * 
 * Use for:
 * - Primary content sections (Dashboard stats, task lists)
 * - Grouped form fields and settings
 * - List containers (notifications, invitations)
 * - Overdue tasks, important alerts
 * - Any grouped content that needs visual separation
 * 
 * Do NOT use for:
 * - Single buttons or inline actions
 * - Navigation elements or headers
 * - Simple text labels
 * 
 * Props:
 * - glass: Apply glass morphism effect (0.95 opacity + backdrop blur)
 * - noPadding: Remove default padding (useful for custom layouts)
 * - className: Additional Tailwind classes
 * 
 * @example
 * <Panel>
 *   <h2>Dashboard Stats</h2>
 *   <StatsContent />
 * </Panel>
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