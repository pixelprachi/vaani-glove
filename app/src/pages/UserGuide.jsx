import React, { useState, useEffect, useRef } from 'react'
import { getHubStatus } from '../api/client'
import AppHeader from '../components/AppHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { guideTopics } from '../data/guideContent'

const HUB_POLL_INTERVAL_MS = 4000

export default function UserGuide() {
  const [activeTopicId, setActiveTopicId] = useState('getting-started')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [hubConnected, setHubConnected] = useState(null)
  const [checkingHub, setCheckingHub] = useState(true)
  const hubPollRef = useRef(null)

  useEffect(() => {
    async function checkHub() {
      try {
        const res = await getHubStatus()
        setHubConnected(Boolean(res.data.connected))
      } catch (err) {
        setHubConnected(false)
      } finally {
        setCheckingHub(false)
      }
    }
    checkHub()
    hubPollRef.current = setInterval(checkHub, HUB_POLL_INTERVAL_MS)
    return () => clearInterval(hubPollRef.current)
  }, [])

  // Find active topic
  const activeTopic = guideTopics.find((t) => t.id === activeTopicId) || guideTopics[0]
  const currentIndex = guideTopics.findIndex((t) => t.id === activeTopic.id)
  const prevTopic = currentIndex > 0 ? guideTopics[currentIndex - 1] : null
  const nextTopic = currentIndex < guideTopics.length - 1 ? guideTopics[currentIndex + 1] : null

  // Filter topics based on search
  const filteredTopics = guideTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.group.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group topics by category
  const groups = ['Getting Started', 'Features', 'Hardware & Prototype', 'Support']

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col text-navy">
      <AppHeader hubConnected={hubConnected} checkingHub={checkingHub} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Help Center Header */}
        <div className="mb-10 pb-8 border-b border-border-pale">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm">
              HELP & USER GUIDE
            </Badge>
            <span className="text-xs text-slate font-mono">Documentation & Troubleshooting</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-navy tracking-tight mb-2">
            Everything you need to get started with VAANI.
          </h1>
          <p className="text-slate text-sm sm:text-base max-w-2xl">
            Explore step-by-step guides for gesture recording, live speech testing, hardware setup, and diagnostic troubleshooting.
          </p>

          {/* Quick Search */}
          <div className="mt-6 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g. recording, audio, hub)..."
              className="w-full bg-surface-white border border-border-pale rounded-xl px-4 py-2.5 text-sm text-navy placeholder:text-slate-light/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-2xs"
            />
          </div>
        </div>

        {/* Mobile Navigation Dropdown Toggle */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full bg-surface-white border border-border-pale rounded-xl px-4 py-3 flex items-center justify-between text-sm font-semibold text-navy shadow-xs"
          >
            <span className="flex items-center gap-2">
              <span className="text-primary">📖</span>
              <span>Topic: {activeTopic.title}</span>
            </span>
            <span className="text-xs text-slate">{mobileMenuOpen ? '▲ Close' : '▼ Topics'}</span>
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 bg-surface-white border border-border-pale rounded-xl p-3 space-y-1 shadow-md">
              {guideTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveTopicId(topic.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    activeTopicId === topic.id
                      ? 'bg-primary-light text-primary'
                      : 'text-slate hover:text-navy hover:bg-slate-light/10'
                  }`}
                >
                  {topic.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Sidebar + Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT SIDEBAR: TOPIC NAVIGATION (DESKTOP)                 */}
          {/* ======================================================== */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
            <Card className="p-5">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate mb-4 px-1">
                Guide Navigation
              </h3>

              <div className="space-y-6">
                {groups.map((groupName) => {
                  const groupTopics = filteredTopics.filter((t) => t.group === groupName)
                  if (groupTopics.length === 0) return null

                  return (
                    <div key={groupName}>
                      <span className="text-[11px] font-mono font-bold text-slate-dark uppercase tracking-wider px-2 block mb-1.5">
                        {groupName}
                      </span>
                      <nav className="space-y-0.5">
                        {groupTopics.map((topic) => {
                          const isActive = activeTopicId === topic.id
                          return (
                            <button
                              key={topic.id}
                              onClick={() => setActiveTopicId(topic.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                isActive
                                  ? 'bg-primary text-white shadow-xs'
                                  : 'text-slate hover:text-navy hover:bg-primary-light/40'
                              }`}
                            >
                              <span className="truncate">{topic.title}</span>
                              {isActive && <span className="text-white text-xs">→</span>}
                            </button>
                          )
                        })}
                      </nav>
                    </div>
                  )
                })}

                {filteredTopics.length === 0 && (
                  <p className="text-xs text-slate px-2 py-4 text-center">
                    No matching topics found for "{searchQuery}".
                  </p>
                )}
              </div>
            </Card>

            {/* Quick Link Card */}
            <Card className="bg-primary-light/40 border-primary/20 p-5">
              <h4 className="font-heading font-bold text-xs uppercase text-primary tracking-wider mb-2">
                Need Live Verification?
              </h4>
              <p className="text-xs text-slate mb-4 leading-relaxed">
                Open the Gesture Testing Studio to test model inference and audible voice playback in real time.
              </p>
              <Button to="/test-gesture" variant="primary" size="sm" className="w-full text-xs">
                Launch Testing Studio →
              </Button>
            </Card>
          </div>

          {/* ======================================================== */}
          {/* MAIN CONTENT AREA                                        */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-8 sm:p-10">
              {/* Topic Header */}
              <div className="mb-6 pb-6 border-b border-border-pale">
                <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                  {activeTopic.group}
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-navy tracking-tight mt-1 mb-2">
                  {activeTopic.title}
                </h2>
                <p className="text-slate text-sm sm:text-base leading-relaxed">
                  {activeTopic.subtitle}
                </p>
              </div>

              {/* Introductory Paragraph */}
              <p className="text-slate text-sm leading-relaxed mb-8">
                {activeTopic.content.intro}
              </p>

              {/* Standard Sections */}
              {activeTopic.content.sections && (
                <div className="space-y-8">
                  {activeTopic.content.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="font-heading font-bold text-lg text-navy">
                        {section.heading}
                      </h3>
                      {section.text && (
                        <p className="text-slate text-sm leading-relaxed">
                          {section.text}
                        </p>
                      )}
                      {section.steps && (
                        <ol className="space-y-2.5">
                          {section.steps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-3 text-sm text-slate leading-relaxed">
                              <span className="w-6 h-6 rounded-full bg-primary-light text-primary font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Troubleshooting Specific List */}
              {activeTopic.content.troubleshootingItems && (
                <div className="space-y-4">
                  {activeTopic.content.troubleshootingItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-border-pale bg-bg-canvas hover:border-slate-light/40 transition-colors"
                    >
                      <h4 className="font-heading font-bold text-sm text-navy mb-1.5 flex items-center gap-2">
                        <span className="text-critical text-base">⚠️</span>
                        <span>{item.problem}</span>
                      </h4>
                      <p className="text-xs text-slate mb-3">
                        <strong className="text-slate-dark">Cause:</strong> {item.cause}
                      </p>
                      <div className="p-3 rounded-lg bg-surface-white border border-border-pale text-xs text-slate-dark leading-relaxed">
                        <strong className="text-primary font-semibold">Solution:</strong> {item.solution}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* FAQ Specific Accordion / List */}
              {activeTopic.content.faqs && (
                <div className="space-y-4">
                  {activeTopic.content.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-border-pale bg-surface-white shadow-2xs"
                    >
                      <h4 className="font-heading font-bold text-base text-navy mb-2 flex items-start gap-2">
                        <span className="text-primary font-mono text-sm shrink-0 mt-0.5">Q:</span>
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-slate text-sm leading-relaxed pl-6">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Topic Pagination (Previous / Next) */}
              <div className="mt-12 pt-8 border-t border-border-pale flex flex-col sm:flex-row items-center justify-between gap-4">
                {prevTopic ? (
                  <button
                    onClick={() => setActiveTopicId(prevTopic.id)}
                    className="w-full sm:w-auto text-left p-3 rounded-xl border border-border-pale hover:border-primary/40 transition-colors text-xs cursor-pointer group"
                  >
                    <span className="text-slate block text-[10px] uppercase font-mono">Previous Topic</span>
                    <span className="font-heading font-bold text-navy group-hover:text-primary transition-colors">
                      ← {prevTopic.title}
                    </span>
                  </button>
                ) : <div />}

                {nextTopic && (
                  <button
                    onClick={() => setActiveTopicId(nextTopic.id)}
                    className="w-full sm:w-auto text-right p-3 rounded-xl border border-border-pale hover:border-primary/40 transition-colors text-xs cursor-pointer group ml-auto"
                  >
                    <span className="text-slate block text-[10px] uppercase font-mono">Next Topic</span>
                    <span className="font-heading font-bold text-navy group-hover:text-primary transition-colors">
                      {nextTopic.title} →
                    </span>
                  </button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
