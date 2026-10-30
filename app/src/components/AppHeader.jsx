import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HardwareStatusBadge from './ui/HardwareStatusBadge'
import Button from './ui/Button'

export default function AppHeader({ hubConnected, checkingHub = false }) {
  const { logout, userId } = useAuth()
  const location = useLocation()

  const navItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Personal Signs', path: '/signs' },
    { label: 'Record Sign', path: '/record' },
    { label: 'Test Gesture', path: '/test-gesture' },
    { label: 'Help & Guide', path: '/guide' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-surface-white/95 backdrop-blur-md border-b border-border-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand + Workspace Identifier */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="VAANI Logo"
                className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col justify-center">
                <span className="font-heading font-extrabold text-xl tracking-tight text-navy leading-none">
                  VAANI
                </span>
                <span className="text-[10px] font-semibold text-primary tracking-widest uppercase mt-0.5">
                  Platform Workspace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-border-pale" aria-label="Workspace Navigation">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-slate hover:text-navy hover:bg-slate-light/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Header Controls: Telemetry + Logout */}
          <div className="flex items-center gap-4">
            <HardwareStatusBadge connected={hubConnected} checking={checkingHub} />

            <div className="h-6 w-px bg-border-pale hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-dark hidden lg:inline-block">
                ID: {userId ? `${userId.substring(0, 8)}...` : 'User'}
              </span>
              <Button
                onClick={logout}
                variant="secondary"
                size="sm"
                className="text-xs"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sub-Bar */}
      <div className="md:hidden border-t border-border-pale bg-surface-white px-4 py-2 flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`shrink-0 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary-light text-primary font-semibold'
                  : 'text-slate hover:text-navy'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
