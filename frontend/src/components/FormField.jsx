import { useId } from 'react'

export default function FormField({ label, error, as = 'input', children, ...props }) {
  const id = useId()
  const Tag = as
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {props.required && <span className="text-accent"> *</span>}
      </label>
      {as === 'select' ? (
        <select id={id} className="input" aria-invalid={!!error} {...props}>
          {children}
        </select>
      ) : (
        <Tag id={id} className="input" aria-invalid={!!error} {...props} />
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
