import React from 'react'

export default function HardwareStatusBadge({ connected, checking = false, className = '' }) {
  if (checking) {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-light/10 border border-slate-light/20 text-xs font-medium text-slate ${className}`}>
        <span className="w-2 h-2 rounded-full bg-slate-light animate-pulse" />
        <span>Checking Hub...</span>
      </div>
    )
  }

  if (connected) {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-success-light border border-success/30 text-xs font-semibold text-success ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span>Glove Hub Connected</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-critical-light border border-critical/30 text-xs font-medium text-critical ${className}`}>
      <span className="w-2 h-2 rounded-full bg-critical" />
      <span>Glove Disconnected</span>
    </div>
  )
}
