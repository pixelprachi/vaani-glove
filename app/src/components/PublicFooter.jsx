import React from 'react'
import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="bg-navy text-white border-t border-navy-light pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo.png"
                alt="VAANI Logo"
                className="w-11 h-11 object-contain shrink-0"
              />
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                VAANI
              </span>
            </div>
            <p className="text-slate-light text-sm max-w-sm mb-6 leading-relaxed">
              An intelligent wearable assistive technology translating natural sign gestures into audible speech through on-device machine learning and high-precision sensor capture.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-light/60 border border-navy-light text-xs text-slate-light">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Engineered for Accessibility & Speech Independence</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-slate-light mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-light">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  System Capabilities
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-white transition-colors">
                  Architecture & Hardware
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-white transition-colors">
                  Engineering Team
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Access */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-slate-light mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-light">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In to Workspace
                </Link>
              </li>
              <li>
                <Link to="/guide" className="hover:text-white transition-colors">
                  User Guide & Documentation
                </Link>
              </li>
              <li>
                <Link to="/signs" className="hover:text-white transition-colors">
                  Personal Vocabulary
                </Link>
              </li>
              <li>
                <Link to="/record" className="hover:text-white transition-colors">
                  Record Gesture
                </Link>
              </li>
              <li>
                <Link to="/test-gesture" className="hover:text-white transition-colors">
                  Test Glove Inference
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-light/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-light">
          <p>© {new Date().getFullYear()} VAANI Glove Project. Built for real-world assistive communication.</p>
          <div className="flex items-center gap-6">
            <span>ESP32-S3 Microcontroller</span>
            <span>·</span>
            <span>22-Channel Sensor Mesh</span>
            <span>·</span>
            <span>1D CNN Edge Inference</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
