import React from 'react'
import Card from './ui/Card'
import Badge from './ui/Badge'

export default function NeedSection() {
  return (
    <section id="the-need" className="py-20 sm:py-28 bg-bg-canvas border-b border-border-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="sm" className="mb-3">
            THE NEED BEHIND VAANI
          </Badge>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-navy tracking-tight mb-4">
            Millions of people. One fundamental need: to be heard.
          </h2>
          <p className="text-slate text-base sm:text-lg leading-relaxed">
            Communication shapes how we learn, connect, work, and participate in everyday life. Yet communication barriers remain a significant challenge for many people.
          </p>
        </div>

        {/* 3-Column Content / Statistics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Card 1: 2 Million - Primary Visual Anchor */}
          <Card className="lg:col-span-5 flex flex-col justify-between border-primary/30 bg-surface-white relative overflow-hidden" hoverEffect>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/40 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-light text-primary text-xs font-mono font-bold tracking-wider uppercase mb-6">
                Official Benchmark
              </div>
              <div className="font-heading font-extrabold text-5xl sm:text-6xl text-primary tracking-tight mb-3">
                2.0M
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-navy mb-3 leading-snug">
                People recorded with speech disabilities in India's 2011 Census.
              </h3>
              <p className="text-slate text-sm leading-relaxed mb-6">
                Historical figure from India's official Census 2011 disability data (Table C-20: 1,998,535 individuals across states and union territories).
              </p>
            </div>
            <div className="pt-4 border-t border-border-pale/80 text-xs font-mono text-slate-dark flex items-center justify-between">
              <span>Census of India (2011)</span>
              <span className="font-bold text-primary">Table C-20</span>
            </div>
          </Card>

          {/* Card 2: A Wider Data Gap */}
          <Card className="lg:col-span-4 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-light/15 text-slate-dark text-xs font-mono font-semibold tracking-wider uppercase mb-6">
                Measurement Context
              </div>
              <div className="font-heading font-bold text-2xl sm:text-3xl text-navy tracking-tight mb-3">
                A Wider Data Gap
              </div>
              <h4 className="font-heading font-medium text-base text-navy mb-3 leading-snug">
                Disability prevalence estimates vary across datasets and measurement approaches.
              </h4>
              <p className="text-slate text-sm leading-relaxed mb-6">
                Differences in definitions, survey methods, and reporting criteria between national enumerations and broader functional impairment frameworks (such as WHO models) affect how disability is recorded and understood.
              </p>
            </div>
            <div className="pt-4 border-t border-border-pale/80 text-xs font-mono text-slate-dark">
              Methodological & Reporting Variations
            </div>
          </Card>

          {/* Card 3: Technology with a Purpose */}
          <Card className="lg:col-span-3 flex flex-col justify-between bg-primary-light/30 border-primary/20" hoverEffect>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold tracking-wider uppercase mb-6">
                VAANI Mission
              </div>
              <div className="font-heading font-bold text-2xl text-navy tracking-tight mb-3">
                Technology with Purpose
              </div>
              <h4 className="font-heading font-medium text-base text-navy mb-3 leading-snug">
                Making communication more accessible through wearable technology.
              </h4>
              <p className="text-slate text-sm leading-relaxed mb-6">
                VAANI explores how wearable sensors and machine learning can help translate supported hand gestures into text and spoken output.
              </p>
            </div>
            <div className="pt-4 border-t border-primary/20 text-xs font-mono text-primary font-semibold">
              Gesture ➔ Edge ML ➔ Voice
            </div>
          </Card>
        </div>

        {/* Closing Statement & Sources Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-border-pale">
          <blockquote className="text-sm sm:text-base font-heading font-semibold text-navy italic text-center sm:text-left">
            "Because accessibility should be part of how we build technology, not an afterthought."
          </blockquote>

          <div className="flex items-center gap-4 text-xs font-mono text-slate shrink-0">
            <span className="text-slate-light">Sources:</span>
            <a
              href="https://censusindia.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
              aria-label="Census of India 2011 Disability Data (opens in new tab)"
            >
              <span>Census 2011 (Table C-20)</span>
              <span>↗</span>
            </a>
            <span className="text-slate-light">·</span>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/disability-and-health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
              aria-label="WHO Disability and Health Fact Sheet (opens in new tab)"
            >
              <span>WHO Disability Data</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
