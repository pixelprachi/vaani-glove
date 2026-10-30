import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Basic client-side validation
    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.')
      return
    }

    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      // Respect existing backend error contract
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Invalid email or password. Please verify your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface-white text-navy">
      {/* ============================================================ */}
      {/* LEFT COLUMN: BRAND & PRODUCT IDENTITY (DESKTOP)             */}
      {/* ============================================================ */}
      <div className="lg:w-1/2 bg-navy text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Ambient Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3B82F6_1px,transparent_1px),linear-gradient(to_bottom,#3B82F6_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Top Brand Link */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="VAANI Logo"
              className="w-12 h-12 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col justify-center">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white leading-none">
                VAANI
              </span>
              <span className="text-[10px] font-semibold text-primary-light tracking-widest uppercase mt-0.5">
                Wearable Speech System
              </span>
            </div>
          </Link>
        </div>

        {/* Center Editorial Visual & Message */}
        <div className="relative z-10 my-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-light/70 border border-navy-light text-xs font-semibold text-primary-light uppercase tracking-wider mb-6">
            <span>Clinical & Daily Assistive Platform</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
            Translating Gesture Dynamics into Clear Spoken Voice.
          </h2>

          <p className="text-slate-light text-sm sm:text-base leading-relaxed mb-8">
            Access your personalized vocabulary library, train custom family signs, and monitor real-time edge speech recognition from your glove hub.
          </p>

          {/* Verification Badge Strip */}
          <div className="p-4 rounded-xl bg-navy-light/40 border border-navy-light flex items-center justify-between text-xs font-mono text-slate-light">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ESP32-S3 Ready</span>
            </div>
            <span>·</span>
            <div>22-Ch Sensor Input</div>
            <span>·</span>
            <div>eSpeak Audio</div>
          </div>
        </div>

        {/* Bottom Link Back to Home */}
        <div className="relative z-10 text-xs text-slate-light">
          <span>Need help or want to learn about the system? </span>
          <Link to="/" className="text-white hover:underline font-medium">
            Explore the public overview →
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM                            */}
      {/* ============================================================ */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-bg-canvas">
        <div className="w-full max-w-md bg-surface-white rounded-3xl border border-border-pale p-8 sm:p-10 shadow-sm">
          <div className="mb-8">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-navy tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate text-sm">
              Sign in with your registered account to manage your glove.
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-critical-light border border-critical/30 flex items-start gap-3"
            >
              <svg className="w-5 h-5 text-critical shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs text-critical font-medium leading-relaxed">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />

            {/* Password Field with Visibility Toggle */}
            <Input
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate hover:text-navy text-xs font-semibold px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-border-pale text-center text-xs text-slate">
            <span>Authorized hardware operator access · </span>
            <Link to="/" className="text-primary hover:underline font-semibold">
              Return to landing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
