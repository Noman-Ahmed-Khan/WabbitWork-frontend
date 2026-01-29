import cx from '../../utils/cx'

export default function Input({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={cx('form-control w-full', containerClassName)}>
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <input
        className={cx(
          'input input-bordered w-full',
          error && 'input-error',
          className
        )}
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
}