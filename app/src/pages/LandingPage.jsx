import React from 'react'
import { Link } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import GloveVisual from '../components/GloveVisual'
import NeedSection from '../components/NeedSection'
import SignatureQuoteSection from '../components/SignatureQuoteSection'
import { teamMembers } from '../data/team'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-canvas text-navy flex flex-col selection:bg-primary-light selection:text-primary">
      <PublicNavbar />

      <main className="flex-1">
        {/* ============================================================ */}
        {/* SECTION B: HERO                                              */}
        {/* ============================================================ */}
        <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-light)_0%,_transparent_70%)] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <Badge variant="primary" size="md" className="mb-6">
                  ACCESSIBILITY, REIMAGINED
                </Badge>

                <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-navy leading-[1.1] mb-6">
                  Your Hands <br />
                  <span className="text-primary">Have a Voice.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate max-w-xl leading-relaxed mb-8">
                  Communication should never be a barrier. VAANI transforms supported hand gestures into spoken words through intelligent wearable technology, helping make everyday communication more accessible.
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                  <Button to="/#how-it-works" variant="secondary" size="lg">
                    Explore VAANI
                  </Button>
                  <Button to="/login" variant="primary" size="lg">
                    Get Started
                  </Button>
                </div>

                {/* Supporting Spec Labels */}
                <div className="pt-6 border-t border-border-pale w-full flex flex-wrap items-center gap-6 text-xs font-semibold tracking-wider uppercase text-slate">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Wearable Technology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Gesture Recognition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Speech Output</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hardware Product Visual */}
              <div className="lg:col-span-5 w-full">
                <GloveVisual />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION C: HOW IT WORKS                                      */}
        {/* ============================================================ */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-surface-white border-y border-border-pale">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" size="sm" className="mb-3">
                INTELLIGENT PIPELINE
              </Badge>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy tracking-tight mb-4">
                From Finger Motion to Audible Speech in Milliseconds
              </h2>
              <p className="text-slate text-base leading-relaxed">
                VAANI bridges physical gesture dynamics with embedded machine learning to synthesize clear speech directly on-device.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <Card className="flex flex-col relative" hoverEffect>
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary font-heading font-bold text-lg mb-6">
                  01
                </div>
                <h3 className="font-heading font-bold text-xl text-navy mb-3">
                  Capture
                </h3>
                <p className="text-slate text-sm leading-relaxed mb-4">
                  Wearable 22-channel flex sensors and spatial IMUs collect multi-axis finger flexion, joint angle velocity, and hand orientation at high sample rates.
                </p>
                <div className="mt-auto pt-4 border-t border-border-pale/60 text-xs font-mono text-slate-dark">
                  Window: 50 steps × 22 channels
                </div>
              </Card>

              {/* Step 2 */}
              <Card className="flex flex-col relative" hoverEffect>
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary font-heading font-bold text-lg mb-6">
                  02
                </div>
                <h3 className="font-heading font-bold text-xl text-navy mb-3">
                  Recognize
                </h3>
                <p className="text-slate text-sm leading-relaxed mb-4">
                  The trained 1D Convolutional Neural Network processes spatial-temporal sensor features, classifying the gesture against 60 supported sign classes.
                </p>
                <div className="mt-auto pt-4 border-t border-border-pale/60 text-xs font-mono text-slate-dark">
                  TFLite Micro on ESP32-S3
                </div>
              </Card>

              {/* Step 3 */}
              <Card className="flex flex-col relative" hoverEffect>
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary font-heading font-bold text-lg mb-6">
                  03
                </div>
                <h3 className="font-heading font-bold text-xl text-navy mb-3">
                  Speak
                </h3>
                <p className="text-slate text-sm leading-relaxed mb-4">
                  Recognized gestures are instantly transformed into speech via the on-board eSpeak-NG acoustic engine or broadcasted to the web interface.
                </p>
                <div className="mt-auto pt-4 border-t border-border-pale/60 text-xs font-mono text-slate-dark">
                  Embedded Audio & WebSockets
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* THE NEED BEHIND VAANI: CREDIBLE STATISTICS SECTION           */}
        {/* ============================================================ */}
        <NeedSection />

        {/* ============================================================ */}
        {/* SECTION D: FEATURES                                          */}
        {/* ============================================================ */}
        <section id="features" className="py-20 sm:py-28 bg-bg-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <Badge variant="primary" size="sm" className="mb-3">
                SYSTEM CAPABILITIES
              </Badge>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy tracking-tight mb-4">
                Designed for Practical, Real-World Assistive Communication
              </h2>
              <p className="text-slate text-base leading-relaxed">
                Every feature is built around the authentic needs of sign language users, caregivers, and accessibility practitioners.
              </p>
            </div>

            {/* Asymmetrical Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Feature 1: Large Card */}
              <Card className="md:col-span-8 flex flex-col justify-between" hoverEffect>
                <div>
                  <Badge variant="success" size="sm" className="mb-4">
                    Edge Intelligence
                  </Badge>
                  <h3 className="font-heading font-bold text-2xl text-navy mb-3">
                    Wearable Gesture Recognition On-the-Go
                  </h3>
                  <p className="text-slate text-base leading-relaxed max-w-2xl mb-6">
                    Inference occurs locally on the glove's embedded ESP32-S3 processor. No internet connection is required for basic day-to-day conversational speech translation.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-bg-canvas border border-border-pale flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-dark">
                  <span>Latency: &lt; 100ms</span>
                  <span>Sensor Mesh: 22 Flex/IMU points</span>
                  <span>TFLite Micro Engine</span>
                </div>
              </Card>

              {/* Feature 2 */}
              <Card className="md:col-span-4 flex flex-col justify-between" hoverEffect>
                <div>
                  <Badge variant="primary" size="sm" className="mb-4">
                    Acoustic Voice
                  </Badge>
                  <h3 className="font-heading font-bold text-xl text-navy mb-2">
                    Direct Speech Output
                  </h3>
                  <p className="text-slate text-sm leading-relaxed mb-6">
                    Integrated hardware speaker powered by eSpeak-NG voices phrases aloud immediately upon sign completion.
                  </p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border-pale overflow-hidden">
                  <div className="w-4/5 h-full bg-primary rounded-full" />
                </div>
              </Card>

              {/* Feature 3 */}
              <Card className="md:col-span-4 flex flex-col justify-between" hoverEffect>
                <div>
                  <Badge variant="warning" size="sm" className="mb-4">
                    Customization
                  </Badge>
                  <h3 className="font-heading font-bold text-xl text-navy mb-2">
                    Personal Sign Vocabulary
                  </h3>
                  <p className="text-slate text-sm leading-relaxed mb-4">
                    Users can train personalized gestures for family names, unique home terms, or emergency phrases beyond the official dictionary.
                  </p>
                </div>
                <Link to="/signs" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  Manage Personal Signs →
                </Link>
              </Card>

              {/* Feature 4 */}
              <Card className="md:col-span-4 flex flex-col justify-between" hoverEffect>
                <div>
                  <Badge variant="primary" size="sm" className="mb-4">
                    Guided Calibration
                  </Badge>
                  <h3 className="font-heading font-bold text-xl text-navy mb-2">
                    Guided Sign Recording
                  </h3>
                  <p className="text-slate text-sm leading-relaxed mb-4">
                    Step-by-step motion capture wizard with automatic hub synchronization to arm, record, and store custom motions.
                  </p>
                </div>
                <Link to="/record" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  Launch Recording Wizard →
                </Link>
              </Card>

              {/* Feature 5 */}
              <Card className="md:col-span-4 flex flex-col justify-between" hoverEffect>
                <div>
                  <Badge variant="primary" size="sm" className="mb-4">
                    Live Diagnostics
                  </Badge>
                  <h3 className="font-heading font-bold text-xl text-navy mb-2">
                    Gesture Testing Suite
                  </h3>
                  <p className="text-slate text-sm leading-relaxed mb-4">
                    Real-time WebSocket audio verification tool displaying confidence scores and speech synthesis in the browser.
                  </p>
                </div>
                <Link to="/test-gesture" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  Open Testing Studio →
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION E: DEMONSTRATION                                     */}
        {/* ============================================================ */}
        <section className="py-20 bg-surface-white border-y border-border-pale">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" size="sm" className="mb-3">
                SYSTEM INTERACTION DEMO
              </Badge>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy tracking-tight mb-4">
                Hand Gesture ➔ Recognized Word ➔ Spoken Audio
              </h2>
              <p className="text-slate text-base">
                An illustrative breakdown of how sensor patterns translate through the prediction loop.
              </p>
            </div>

            <div className="bg-bg-canvas rounded-3xl border border-border-pale p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                {/* Stage 1 */}
                <div className="p-6 bg-surface-white rounded-2xl border border-border-pale">
                  <div className="w-10 h-10 rounded-full bg-primary-light text-primary mx-auto flex items-center justify-center font-bold text-sm mb-3">
                    1
                  </div>
                  <h4 className="font-heading font-bold text-navy text-base mb-1">Physical Motion</h4>
                  <p className="text-xs text-slate">Flex sensor array measures finger bend at 50Hz</p>
                  <div className="mt-4 px-3 py-1.5 rounded-lg bg-bg-canvas text-[11px] font-mono text-slate-dark">
                    Thumb: 68° · Index: 12°
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center text-primary font-bold text-2xl">
                  ➔
                </div>

                {/* Stage 2 */}
                <div className="p-6 bg-surface-white rounded-2xl border border-border-pale">
                  <div className="w-10 h-10 rounded-full bg-primary-light text-primary mx-auto flex items-center justify-center font-bold text-sm mb-3">
                    2
                  </div>
                  <h4 className="font-heading font-bold text-navy text-base mb-1">CNN Classification</h4>
                  <p className="text-xs text-slate">Temporal 1D convolution predicts gesture class</p>
                  <div className="mt-4 px-3 py-1.5 rounded-lg bg-success-light text-success font-semibold text-[11px]">
                    "Water" · 97% Confidence
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center text-primary font-bold text-2xl">
                  ➔
                </div>

                {/* Stage 3 */}
                <div className="p-6 bg-surface-white rounded-2xl border border-border-pale">
                  <div className="w-10 h-10 rounded-full bg-primary-light text-primary mx-auto flex items-center justify-center font-bold text-sm mb-3">
                    3
                  </div>
                  <h4 className="font-heading font-bold text-navy text-base mb-1">Voice Synthesis</h4>
                  <p className="text-xs text-slate">Synthesizer speaks phrase aloud in room</p>
                  <div className="mt-4 px-3 py-1.5 rounded-lg bg-primary-light text-primary font-mono text-[11px]">
                    🔊 Audio: /w-ah-t-er/
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION F: VERIFIED ARCHITECTURE                             */}
        {/* ============================================================ */}
        <section id="technology" className="py-20 sm:py-28 bg-bg-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" size="sm" className="mb-3">
                ENGINEERING SPECIFICATION
              </Badge>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy tracking-tight mb-4">
                Verified System Architecture
              </h2>
              <p className="text-slate text-base">
                Four decoupled subsystems working together to deliver reliable assistive communication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Architecture 1 */}
              <Card className="flex flex-col">
                <span className="text-xs font-mono font-bold text-primary mb-2">01. HARDWARE</span>
                <h4 className="font-heading font-bold text-lg text-navy mb-2">ESP32-S3 Hub</h4>
                <p className="text-xs text-slate leading-relaxed mb-4">
                  Runs on-chip TensorFlow Lite Micro models, reads 22-channel sensor arrays, and drives embedded eSpeak audio hardware.
                </p>
                <div className="mt-auto text-[11px] font-mono text-slate-dark bg-bg-canvas p-2.5 rounded-lg border border-border-pale">
                  Module: `vaaniglove_hub`
                </div>
              </Card>

              {/* Architecture 2 */}
              <Card className="flex flex-col">
                <span className="text-xs font-mono font-bold text-primary mb-2">02. ML PIPELINE</span>
                <h4 className="font-heading font-bold text-lg text-navy mb-2">1D CNN Classifier</h4>
                <p className="text-xs text-slate leading-relaxed mb-4">
                  Temporal convolution network trained on 60 sign gestures using sliding temporal windows of 50 samples across 22 sensor channels.
                </p>
                <div className="mt-auto text-[11px] font-mono text-slate-dark bg-bg-canvas p-2.5 rounded-lg border border-border-pale">
                  Module: `vaaniglove-training`
                </div>
              </Card>

              {/* Architecture 3 */}
              <Card className="flex flex-col">
                <span className="text-xs font-mono font-bold text-primary mb-2">03. BACKEND API</span>
                <h4 className="font-heading font-bold text-lg text-navy mb-2">FastAPI & PostgreSQL</h4>
                <p className="text-xs text-slate leading-relaxed mb-4">
                  REST services for user management, JWT auth, custom gesture templates, and WebSockets for real-time live browser push.
                </p>
                <div className="mt-auto text-[11px] font-mono text-slate-dark bg-bg-canvas p-2.5 rounded-lg border border-border-pale">
                  Module: `vaaniglove-backend`
                </div>
              </Card>

              {/* Architecture 4 */}
              <Card className="flex flex-col">
                <span className="text-xs font-mono font-bold text-primary mb-2">04. CLIENT WEB APP</span>
                <h4 className="font-heading font-bold text-lg text-navy mb-2">React 19 & Tailwind</h4>
                <p className="text-xs text-slate leading-relaxed mb-4">
                  Accessible, high-contrast dashboard for personal sign management, motion capture workflows, and telemetry monitoring.
                </p>
                <div className="mt-auto text-[11px] font-mono text-slate-dark bg-bg-canvas p-2.5 rounded-lg border border-border-pale">
                  Module: `vaaniglove-app`
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION G: OUR TEAM                                          */}
        {/* ============================================================ */}
        <section id="team" className="py-20 sm:py-28 bg-surface-white border-t border-border-pale">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" size="sm" className="mb-3">
                PEOPLE BEHIND VAANI
              </Badge>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy tracking-tight mb-4">
                Engineering Team
              </h2>
              <p className="text-slate text-base">
                Passionate about leveraging embedded systems and machine learning to make everyday communication universally accessible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.name} className="flex flex-col items-center text-center p-8 overflow-hidden" hoverEffect>
                  {/* Real Photo or Initials Monogram Fallback */}
                  <div className="w-36 h-36 rounded-2xl overflow-hidden mb-6 shadow-sm border border-border-pale bg-primary-light flex items-center justify-center shrink-0">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={`Photograph of ${member.name}`}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-primary font-heading font-bold text-3xl">
                        {member.initials}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-xl text-navy mb-4">
                    {member.name}
                  </h3>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-xs font-semibold text-primary hover:text-primary-hover hover:underline transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-light/60 border border-primary/20"
                    aria-label={`LinkedIn profile for ${member.name}`}
                  >
                    <span>View LinkedIn Profile</span>
                    <span>↗</span>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SIGNATURE PHILOSOPHY QUOTE                                   */}
        {/* ============================================================ */}
        <SignatureQuoteSection />

        {/* ============================================================ */}
        {/* SECTION H: CALL TO ACTION                                    */}
        {/* ============================================================ */}
        <section className="py-20 sm:py-24 bg-navy-dark text-white relative overflow-hidden border-t border-navy-light/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white mb-6">
              "A world where every voice matters."
            </h2>
            <p className="text-slate-light text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Step into the VAANI workspace to explore supported vocabulary, configure custom gestures, or test real-time gesture recognition.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button to="/login" variant="primary" size="lg">
                Access Platform Workspace
              </Button>
              <Button to="/login" variant="secondary" size="lg">
                Sign In
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
