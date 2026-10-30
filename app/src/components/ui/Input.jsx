import React, { useId } from 'react'

export default function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  className = '',
  rightElement,
  ...props
}) {
  const generatedId = useId()
  const inputId = id || props.name || generatedId

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-dark uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={type}
          className={`w-full bg-surface-white border rounded-lg px-3.5 py-2.5 text-sm text-navy placeholder:text-slate-light/60 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error
              ? 'border-critical focus:ring-critical'
              : 'border-border-pale hover:border-slate-light/50'
          } ${rightElement ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-auto">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-critical font-medium">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-slate">{helperText}</p>
      )}
    </div>
  )
}
