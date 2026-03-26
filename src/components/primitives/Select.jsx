/**
 * Select - Brutalist Editorial Design
 * Replaces DaisyUI select classes with design system tokens
 */
export default function Select({
  label,
  error,
  options = [],
  placeholder = 'Select...',
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block font-headline font-bold text-[10px] uppercase tracking-widest text-stone-400 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 font-headline text-xs uppercase tracking-widest focus:ring-2 focus:ring-black transition-all ${error ? 'ring-2 ring-tertiary' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-tertiary">
          {error}
        </p>
      )}
    </div>
  )
}