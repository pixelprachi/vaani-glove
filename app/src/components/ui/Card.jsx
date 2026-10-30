import React from 'react'

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  as: Component = 'div',
  ...props
}) {
  const hoverStyles = hoverEffect
    ? 'hover:border-primary/40 hover:shadow-md transition-all duration-200'
    : ''

  return (
    <Component
      className={`bg-surface-white rounded-2xl border border-border-pale p-6 shadow-xs ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
