import React from 'react'

export default function Badge({
  children,
  variant = 'default', // 'default' | 'primary' | 'success' | 'warning' | 'critical'
  size = 'md',        // 'sm' | 'md'
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
  }

  const variantStyles = {
    default: 'bg-slate-light/15 text-slate-dark border border-slate-light/30',
    primary: 'bg-primary-light text-primary border border-primary/20',
    success: 'bg-success-light text-success border border-success/20',
    warning: 'bg-warning-light text-warning border border-warning/20',
    critical: 'bg-critical-light text-critical border border-critical/20',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
