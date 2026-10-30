import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { getPersonalSigns, deletePersonalSign, getHubStatus } from '../api/client'
import AppHeader from '../components/AppHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const HUB_POLL_INTERVAL_MS = 4000

export default function PersonalSigns() {
  const { userId } = useAuth()
  const [signs, setSigns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
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

  async function loadSigns() {
    setLoading(true)
    try {
      const res = await getPersonalSigns(userId)
      setSigns(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setSigns([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) loadSigns()
  }, [userId])

  async function handleDelete(signId) {
    setDeletingId(signId)
    try {
      await deletePersonalSign(signId)
      await loadSigns()
      setConfirmDeleteId(null)
    } catch (err) {
      console.error('Error deleting sign:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredSigns = signs.filter((s) =>
    s.text?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col text-navy">
      <AppHeader hubConnected={hubConnected} checkingHub={checkingHub} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-pale mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="primary" size="sm">
                VOCABULARY STORE
              </Badge>
              <span className="text-xs text-slate font-mono">Personal Gestures Library</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-navy tracking-tight">
              Personal Signs Library
            </h1>
            <p className="text-slate text-sm mt-1">
              Your personal collection of gestures and the words they express.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button to="/record" variant="primary" size="md" className="shrink-0">
              + Create Personal Sign
            </Button>
          </div>
        </div>

        {/* Informational Guidance & Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 items-center">
          {/* Contextual Notice */}
          <div className="md:col-span-7">
            <p className="text-xs text-slate leading-relaxed">
              To add a new gesture, use the guided recording workflow. Your glove uses these captured sensor templates to recognize custom phrases alongside the official 60-sign baseline.
            </p>
          </div>

          {/* Search Filter Bar */}
          <div className="md:col-span-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library by phrase (e.g. water, help)..."
              className="w-full bg-surface-white border border-border-pale rounded-xl px-4 py-2.5 text-sm text-navy placeholder:text-slate-light/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-2xs"
            />
          </div>
        </div>

        {/* Signs List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate uppercase tracking-wider px-1">
            <span>
              {loading
                ? 'Fetching library...'
                : `${filteredSigns.length} Personal Sign${filteredSigns.length === 1 ? '' : 's'}`}
            </span>
            <span>Status</span>
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-slate">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                Loading your personal vocabulary...
              </div>
            </Card>
          ) : filteredSigns.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                🧤
              </div>
              <h3 className="font-heading font-bold text-xl text-navy mb-2">
                {searchQuery ? 'No matching signs found' : 'Your vocabulary starts here.'}
              </h3>
              <p className="text-sm text-slate max-w-md mx-auto mb-6 leading-relaxed">
                {searchQuery
                  ? 'No personal phrases match your search query. Try searching for a different keyword or view all signs.'
                  : 'Create your first personal gesture and give it a phrase of its own.'}
              </p>
              {!searchQuery ? (
                <Button to="/record" variant="primary" size="lg">
                  Record Your First Sign
                </Button>
              ) : (
                <Button onClick={() => setSearchQuery('')} variant="secondary" size="md">
                  Clear Search
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredSigns.map((sign) => {
                const isConfirming = confirmDeleteId === sign.id
                return (
                  <div
                    key={sign.id}
                    className="bg-surface-white border border-border-pale rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-slate-light/40 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-mono font-bold text-xs shrink-0">
                        PS
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-navy">
                          "{sign.text}"
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-mono text-slate">
                            ID: {sign.id?.substring(0, 8)}
                          </span>
                          <span className="text-slate-light text-[11px]">·</span>
                          <span className="text-[11px] text-slate">
                            {sign.template?.length
                              ? `${sign.template.length} gesture template window recorded`
                              : 'Ready for motion matching'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="success" size="sm">
                        Ready
                      </Badge>

                      {isConfirming ? (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleDelete(sign.id)}
                            variant="danger"
                            size="sm"
                            disabled={deletingId === sign.id}
                          >
                            {deletingId === sign.id ? 'Deleting...' : 'Confirm'}
                          </Button>
                          <Button
                            onClick={() => setConfirmDeleteId(null)}
                            variant="ghost"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(sign.id)}
                          className="text-xs font-semibold text-slate hover:text-critical transition-colors px-2.5 py-1.5 rounded-lg hover:bg-critical-light cursor-pointer"
                          aria-label={`Delete sign ${sign.text}`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
