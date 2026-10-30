import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHubStatus, getPersonalSigns } from '../api/client'
import AppHeader from '../components/AppHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const HUB_POLL_INTERVAL_MS = 4000

export default function Dashboard() {
  const { userId } = useAuth()
  const [hubConnected, setHubConnected] = useState(null)
  const [checkingHub, setCheckingHub] = useState(true)
  const [signCount, setSignCount] = useState(0)
  const [loadingSigns, setLoadingSigns] = useState(true)
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

  useEffect(() => {
    async function loadSignCount() {
      if (!userId) return
      try {
        setLoadingSigns(true)
        const res = await getPersonalSigns(userId)
        if (Array.isArray(res.data)) {
          setSignCount(res.data.length)
        }
      } catch (err) {
        setSignCount(0)
      } finally {
        setLoadingSigns(false)
      }
    }

    loadSignCount()
  }, [userId])

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col text-navy">
      <AppHeader hubConnected={hubConnected} checkingHub={checkingHub} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Banner */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-border-pale">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" size="sm">
                OPERATIONAL DASHBOARD
              </Badge>
              <span className="text-xs text-slate font-mono">v1.0-esp32</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-navy tracking-tight">
              Glove Workspace Overview
            </h1>
            <p className="text-slate text-sm sm:text-base mt-1">
              Monitor hardware status, manage custom vocabulary, and test gesture-to-speech inference.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button to="/record" variant="primary" size="md">
              + Record New Sign
            </Button>
            <Button to="/test-gesture" variant="secondary" size="md">
              Open Testing Suite
            </Button>
          </div>
        </div>

        {/* Status Metrics Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Glove Hardware Status */}
          <Card className="flex flex-col justify-between">
            <span className="text-xs font-mono uppercase text-slate font-semibold tracking-wider mb-2">
              Hardware Hub
            </span>
            <div className="my-2">
              {checkingHub ? (
                <div className="text-lg font-bold text-slate flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate animate-pulse" />
                  Checking...
                </div>
              ) : hubConnected ? (
                <div className="text-lg font-bold text-success flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
                  Connected & Ready
                </div>
              ) : (
                <div className="text-lg font-bold text-critical flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-critical" />
                  Hub Offline
                </div>
              )}
            </div>
            <p className="text-xs text-slate">
              {hubConnected
                ? 'ESP32 BLE telemetry streaming active'
                : 'Turn on glove hub & verify Bluetooth bridge'}
            </p>
          </Card>

          {/* Card 2: Personal Signs */}
          <Card className="flex flex-col justify-between">
            <span className="text-xs font-mono uppercase text-slate font-semibold tracking-wider mb-2">
              Personal Signs
            </span>
            <div className="my-2 text-3xl font-extrabold font-heading text-navy">
              {loadingSigns ? '...' : signCount}
            </div>
            <Link to="/signs" className="text-xs font-semibold text-primary hover:underline">
              View Personal Vocabulary →
            </Link>
          </Card>

          {/* Card 3: Official Baseline Model */}
          <Card className="flex flex-col justify-between">
            <span className="text-xs font-mono uppercase text-slate font-semibold tracking-wider mb-2">
              Official Vocabulary
            </span>
            <div className="my-2 text-3xl font-extrabold font-heading text-navy">
              60 Signs
            </div>
            <p className="text-xs text-slate">
              1D CNN Edge Model (Quantized TFLite)
            </p>
          </Card>
        </div>

        {/* Quick-Action Workflow Panels */}
        <h2 className="font-heading font-bold text-xl text-navy mb-4">
          Core Workflows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Personal Signs */}
          <Card className="flex flex-col justify-between p-6" hoverEffect>
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-heading font-bold text-lg text-navy mb-2">
                Manage Personal Signs
              </h3>
              <p className="text-slate text-xs sm:text-sm leading-relaxed mb-6">
                Inspect, add or remove custom personal signs you have taught your glove. Personal signs are recognized alongside the official 60-sign baseline.
              </p>
            </div>
            <Button to="/signs" variant="secondary" size="md" className="w-full">
              Open Vocabulary Library
            </Button>
          </Card>

          {/* Action 2: Record Sign */}
          <Card className="flex flex-col justify-between p-6" hoverEffect>
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-heading font-bold text-lg text-navy mb-2">
                Record a New Sign
              </h3>
              <p className="text-slate text-xs sm:text-sm leading-relaxed mb-6">
                Guide your glove through recording a new motion template. The hub arms its sensor buffer and stores motion windows into your personal library.
              </p>
            </div>
            <Button to="/record" variant="primary" size="md" className="w-full">
              Start Guided Recording
            </Button>
          </Card>

          {/* Action 3: Test Gesture */}
          <Card className="flex flex-col justify-between p-6" hoverEffect>
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-heading font-bold text-lg text-navy mb-2">
                Test Gesture Inference
              </h3>
              <p className="text-slate text-xs sm:text-sm leading-relaxed mb-6">
                Perform gestures while wearing the glove. Real-time recognition results stream directly to the browser with confidence scores and audio synthesis.
              </p>
            </div>
            <Button to="/test-gesture" variant="secondary" size="md" className="w-full">
              Launch Live Studio
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
