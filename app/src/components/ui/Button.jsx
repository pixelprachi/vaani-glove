import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Primary & Secondary Button component for VAANI Design System
 */
export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md',         // 'sm' | 'md' | 'lg'
  disabled = false,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  }

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:bg-blue-800 shadow-sm focus-visible:ring-primary',
    secondary: 'bg-white text-navy border border-border-pale hover:bg-primary-light/50 hover:border-primary/40 focus-visible:ring-primary shadow-sm',
    outline: 'bg-transparent text-primary border border-primary hover:bg-primary-light/40 focus-visible:ring-primary',
    ghost: 'bg-transparent text-slate-dark hover:bg-slate-light/10 hover:text-navy focus-visible:ring-slate-dark',
    danger: 'bg-critical text-white hover:bg-rose-700 focus-visible:ring-critical shadow-sm',
  }

  const combinedStyles = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={combinedStyles} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={combinedStyles} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedStyles}
      {...props}
    >
      {content}
    </button>
  )
}
