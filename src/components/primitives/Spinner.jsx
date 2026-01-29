import cx from '../../utils/cx'

export default function Spinner({ 
  size = 'md',
  className = '' 
}) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  }

  return (
    <div className="flex items-center justify-center p-8">
      <span
        className={cx(
          'loading loading-spinner text-primary',
          sizeClasses[size],
          className
        )}
      />
    </div>
  )
}