import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getHubStatus } from '../api/client'
import AppHeader from '../components/AppHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const HUB_POLL_INTERVAL_MS = 4000

export default function TestGesture() {
  const { userId } = useAuth()
  const [hubConnected, setHubConnected] = useState(null)
  const [checkingHub, setCheckingHub] = useState(true)
  const [result, setResult] = useState(null)
  const [listening, setListening] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const hubPollRef = useRef(null)
  const wsRef = useRef(null)

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

  useEffect(() => {
    if (!userId) return

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    const wsBase = apiBase.replace(/^http/, 'ws')
    const wsUrl = `${wsBase}/ws/transcript/${userId}`

    try {
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setWsConnected(true)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setResult(data)
          setListening(false)

          // Play Speech Synthesis
          if (window.speechSynthesis && data.text) {
            const utterance = new SpeechSynthesisUtterance(data.text)
            utterance.rate = 0.95
            window.speechSynthesis.speak(utterance)
          }
        } catch (parseErr) {
          console.error('Failed to parse WebSocket message:', parseErr)
        }
      }

      ws.onclose = () => {
        setWsConnected(false)
      }

      ws.onerror = () => {
        setWsConnected(false)
      }

      return () => {
        ws.close()
      }
    } catch (e) {
      setWsConnected(false)
    }
  }, [userId])

  function handleStart() {
    setResult(null)
    setListening(true)
  }

  function handleReplayVoice() {
    if (result && result.text && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(result.text)
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col text-navy">
      <AppHeader hubConnected={hubConnected} checkingHub={checkingHub} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-border-pale">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary" size="sm">
              LIVE INFERENCE STUDIO
            </Badge>
            <span className="text-xs text-slate font-mono">WebSocket Push Telemetry</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-navy tracking-tight">
            Gesture Testing & Speech Verification
          </h1>
          <p className="text-slate text-sm mt-1">
            Wear the glove and perform supported signs to verify model prediction and vocalization in real time.
          </p>
        </div>

        {/* Offline Warning Card if Hub is not connected */}
        {hubConnected === false && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Glove Hub Currently Offline
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                The hardware hub is not transmitting sensor packets. Turn on the ESP32-S3 glove to enable live gesture recognition. The browser WebSocket listener remains active.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Action Stage */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>

              <h2 className="font-heading font-bold text-2xl text-navy mb-2">
                Ready for Gesture Input
              </h2>
              <p className="text-sm text-slate max-w-sm mb-8 leading-relaxed">
                Click below to prime the listener, then perform a sign with the glove. The hub will classify the motion and speak it aloud.
              </p>

              <Button
                onClick={handleStart}
                variant="primary"
                size="lg"
                disabled={listening}
                className="w-full max-w-xs"
              >
                {listening ? 'Listening for Motion...' : 'Ready — Perform Sign'}
              </Button>

              {/* Listening State Visualization */}
              {listening && (
                <div className="w-full mt-8 p-6 rounded-2xl bg-primary-light/50 border border-primary/30 animate-pulse">
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    <span className="w-1.5 h-4 bg-primary rounded-full animate-bounce" />
                    <span className="w-1.5 h-7 bg-primary rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-9 bg-primary rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-6 bg-primary rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
                  </div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Listening for gesture motion from glove...
                  </p>
                </div>
              )}
            </Card>

            {/* Recognition Output Result */}
            {result && (
              <Card className="p-8 border-success/40 bg-success-light/30">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="success" size="md">
                    RECOGNITION RESULT
                  </Badge>
                  <span className="text-xs font-mono text-slate">
                    {result.source === 'personal' ? 'Custom Personal Sign' : 'Official Vocabulary'}
                  </span>
                </div>

                <div className="my-6 text-center">
                  <span className="text-xs font-mono uppercase text-slate tracking-wider">
                    Spoken Output
                  </span>
                  <div className="text-4xl font-heading font-extrabold text-navy mt-1 mb-2">
                    "{result.text}"
                  </div>

                  {/* Confidence Score Bar */}
                  {result.confidence !== undefined && (
                    <div className="max-w-xs mx-auto mt-4">
                      <div className="flex items-center justify-between text-xs font-mono text-slate mb-1">
                        <span>Model Confidence</span>
                        <span className="font-bold text-success">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-border-pale overflow-hidden">
                        <div
                          className="h-full bg-success rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.round(result.confidence * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-success/20 flex items-center justify-between">
                  <Button
                    onClick={handleReplayVoice}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                  >
                    🔊 Replay Speech Audio
                  </Button>
                  <span className="text-[11px] text-slate">
                    Synthesized via Web Audio API
                  </span>
                </div>
              </Card>
            )}
          </div>

          {/* Diagnostic Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <h3 className="font-heading font-bold text-base text-navy mb-4">
                Telemetry Diagnostics
              </h3>

              <div className="space-y-4 text-xs">
                {/* WebSocket Channel */}
                <div className="flex items-center justify-between py-2 border-b border-border-pale">
                  <span className="text-slate">Browser WebSocket Stream</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-success' : 'bg-slate-light'}`} />
                    <span className="font-mono font-semibold text-navy">
                      {wsConnected ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Hardware Connection */}
                <div className="flex items-center justify-between py-2 border-b border-border-pale">
                  <span className="text-slate">ESP32 Hardware Hub</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${hubConnected ? 'bg-success' : 'bg-critical'}`} />
                    <span className="font-mono font-semibold text-navy">
                      {hubConnected ? 'Broadcasting' : 'Not Connected'}
                    </span>
                  </div>
                </div>

                {/* Speech Synthesis Engine */}
                <div className="flex items-center justify-between py-2 border-b border-border-pale">
                  <span className="text-slate">Acoustic Synthesizer</span>
                  <span className="font-mono font-semibold text-navy">
                    {window.speechSynthesis ? 'Ready (Browser TTS)' : 'Unavailable'}
                  </span>
                </div>

                {/* Model Architecture */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate">Inference Classification</span>
                  <span className="font-mono font-semibold text-navy">
                    1D CNN (60 Classes)
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-primary-light/40 border-primary/20">
              <h4 className="font-heading font-bold text-sm text-navy mb-2">
                Testing Tips
              </h4>
              <ul className="text-xs text-slate space-y-2 list-disc pl-4 leading-relaxed">
                <li>Keep the glove level during the beginning of the motion.</li>
                <li>Make deliberate, distinct hand gestures rather than rapid transitions.</li>
                <li>Ensure computer speaker audio is turned on to hear synthesized speech.</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
