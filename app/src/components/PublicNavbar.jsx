import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './ui/Button'
import { useAuth } from '../context/AuthContext'

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  const navLinks = [
    { label: 'Home', href: '/#hero' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features', href: '/#features' },
    { label: 'Technology', href: '/#technology' },
    { label: 'Our Team', href: '/#team' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-surface-white/90 backdrop-blur-md border-b border-border-pale transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="VAANI Logo"
              className="w-11 h-11 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col justify-center">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-navy leading-none">
                VAANI
              </span>
              <span className="text-[10px] font-semibold text-primary tracking-widest uppercase mt-0.5">
                Wearable Speech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate hover:text-navy transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button to="/dashboard" variant="primary" size="md">
                Launch Workspace
              </Button>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="md">
                  Log In
                </Button>
                <Button to="/login" variant="primary" size="md">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-dark hover:bg-slate-light/10 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-white border-b border-border-pale px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-slate-dark hover:bg-primary-light/50 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-border-pale flex flex-col gap-2">
            {isAuthenticated ? (
              <Button to="/dashboard" variant="primary" size="md" className="w-full">
                Launch Workspace
              </Button>
            ) : (
              <>
                <Button to="/login" variant="outline" size="md" className="w-full">
                  Log In
                </Button>
                <Button to="/login" variant="primary" size="md" className="w-full">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
