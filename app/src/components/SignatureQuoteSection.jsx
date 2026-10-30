import React from 'react'

export default function SignatureQuoteSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-navy text-white overflow-hidden border-y border-navy-light/60">
      {/* Decorative Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.12)_0%,_transparent_70%)] pointer-events-none" />
      
      {/* Subtle Precision Geometric Grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#3B82F6_1px,transparent_1px),linear-gradient(to_bottom,#3B82F6_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Oversized Decorative Quotation Symbol */}
        <div 
          className="text-primary/30 font-serif text-7xl sm:text-9xl leading-none select-none mb-2 sm:mb-4 h-14 sm:h-20"
          aria-hidden="true"
        >
          “
        </div>

        {/* Main Signature Quote */}
        <blockquote className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight sm:leading-snug max-w-4xl mx-auto mb-8">
          "We built these gloves for the voices that were always there, waiting for the world to hear them."
        </blockquote>

        {/* Attribution & Supporting Note */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-px bg-primary" />
            <span className="font-heading font-bold text-sm sm:text-base tracking-widest text-primary uppercase">
              VAANI
            </span>
            <span className="w-8 h-px bg-primary" />
          </div>

          <p className="text-slate-light text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Technology should help people express themselves on their own terms.
          </p>
        </div>
      </div>
    </section>
  )
}
