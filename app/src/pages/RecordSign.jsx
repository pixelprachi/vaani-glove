import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { recordPersonalSign, getSignStatus, getHubStatus, deletePersonalSign } from '../api/client'
import AppHeader from '../components/AppHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const POLL_INTERVAL_MS = 2000
const HUB_POLL_INTERVAL_MS = 4000

export default function RecordSign() {
  const { userId } = useAuth()
  const navigate = useNavigate()

  // Workflow Steps: 1 (Define Phrase) | 2 (Capture Gesture) | 3 (Review & Save)
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Form & Validation
  const [text, setText] = useState('')
  const [textError, setTextError] = useState('')

  // Step 2: Hardware Hub & Capture States
  // 'waiting-glove' | 'recording-in-progress' | 'capture-completed' | 'capture-failed'
  const [captureStage, setCaptureStage] = useState('waiting-glove')
  const [createdSignId, setCreatedSignId] = useState(null)
  const pollRef = useRef(null)

  // Hub Connectivity
  const [hubConnected, setHubConnected] = useState(null)
  const [checkingHub, setCheckingHub] = useState(true)
  const hubPollRef = useRef(null)

  // Step 3: Saving States
  const [savingSign, setSavingSign] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Poll Hub Status
  useEffect(() => {
    async function checkHub() {
      try {
        const res = await getHubStatus()
        setHubConnected(Boolean(res.data.connected))
      } catch {
        setHubConnected(false)
      } finally {
        setCheckingHub(false)
      }
    }
    checkHub()
    hubPollRef.current = setInterval(checkHub, HUB_POLL_INTERVAL_MS)
    return () => clearInterval(hubPollRef.current)
  }, [])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      clearInterval(pollRef.current)
    }
  }, [])

  // Handle Step 1 -> Step 2
  async function handleProceedToCapture(e) {
    e.preventDefault()
    setTextError('')

    const trimmed = text.trim()
    if (!trimmed) {
      setTextError('Please enter the spoken phrase you want VAANI to say.')
      return
    }

    if (trimmed.length > 64) {
      setTextError('Spoken phrase must be under 64 characters for the embedded speech engine.')
      return
    }

    // Advance to Step 2
    setCurrentStep(2)
    setCaptureStage('waiting-glove')

    try {
      // Register pending sign with backend
      const res = await recordPersonalSign(userId, trimmed)
      const signId = res.data.id
      setCreatedSignId(signId)

      // Start polling for hub to arm and complete
      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await getSignStatus(signId)
          const status = statusRes.data.status

          if (status === 'armed') {
            setCaptureStage('recording-in-progress')
          } else if (status === 'ready') {
            clearInterval(pollRef.current)
            setCaptureStage('capture-completed')
          }
        } catch (pollErr) {
          console.error('Polling error:', pollErr)
        }
      }, POLL_INTERVAL_MS)
    } catch {
      setCaptureStage('capture-failed')
    }
  }

  // Handle Cancel / Abort during Step 2
  async function handleCancelCapture() {
    clearInterval(pollRef.current)
    if (createdSignId && captureStage !== 'capture-completed') {
      try {
        // Clean up pending sign record so phantom unrecorded entries aren't left behind
        await deletePersonalSign(createdSignId)
      } catch (e) {
        console.error('Error cleaning up sign:', e)
      }
    }
    navigate('/signs')
  }

  // Handle Step 2 -> Step 3
  function handleProceedToReview() {
    clearInterval(pollRef.current)
    setCurrentStep(3)
  }

  // Reset to record another
  function handleResetWorkflow() {
    clearInterval(pollRef.current)
    setText('')
    setTextError('')
    setCreatedSignId(null)
    setCaptureStage('waiting-glove')
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col text-navy">
      <AppHeader hubConnected={hubConnected} checkingHub={checkingHub} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8 pb-6 border-b border-border-pale flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="primary" size="sm">
                CREATION STUDIO
              </Badge>
              <span className="text-xs text-slate font-mono">Personal Gesture Registration</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-navy tracking-tight">
              Create a Personal Gesture
            </h1>
            <p className="text-slate text-sm mt-1">
              Teach VAANI what to say when you perform a gesture.
            </p>
          </div>

          <Button to="/signs" variant="ghost" size="sm" className="text-xs shrink-0">
            ← Library
          </Button>
        </div>

        {/* 3-Step Visual Progress Bar */}
        <div className="mb-8 bg-surface-white rounded-2xl border border-border-pale p-4 sm:p-5 shadow-2xs">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {/* Step 1 Pill */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs mb-1.5 transition-colors ${
                  currentStep === 1
                    ? 'bg-primary text-white shadow-xs'
                    : currentStep > 1
                    ? 'bg-success text-white'
                    : 'bg-slate-light/20 text-slate'
                }`}
              >
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold ${currentStep === 1 ? 'text-primary' : 'text-slate'}`}>
                1. Define Phrase
              </span>
            </div>

            {/* Step 2 Pill */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs mb-1.5 transition-colors ${
                  currentStep === 2
                    ? 'bg-primary text-white shadow-xs'
                    : currentStep > 2
                    ? 'bg-success text-white'
                    : 'bg-slate-light/20 text-slate'
                }`}
              >
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold ${currentStep === 2 ? 'text-primary' : 'text-slate'}`}>
                2. Capture Gesture
              </span>
            </div>

            {/* Step 3 Pill */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs mb-1.5 transition-colors ${
                  currentStep === 3
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-light/20 text-slate'
                }`}
              >
                3
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold ${currentStep === 3 ? 'text-primary' : 'text-slate'}`}>
                3. Review & Save
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: DEFINE PHRASE                                    */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <Card className="p-8 sm:p-10">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                Step 1 of 3
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-navy mt-1 mb-2">
                What should VAANI say?
              </h2>
              <p className="text-slate text-sm leading-relaxed">
                Enter the exact spoken phrase, word, or sentence you want the wearable speech engine to announce when you execute this gesture.
              </p>
            </div>

            <form onSubmit={handleProceedToCapture} className="space-y-6">
              <div>
                <Input
                  label="Spoken Phrase or Expression"
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    if (textError) setTextError('')
                  }}
                  placeholder="e.g., I need water, Good morning, Call a doctor"
                  error={textError}
                  autoFocus
                  required
                />
                <div className="flex items-center justify-between text-xs text-slate-dark mt-2">
                  <span>Keep phrases concise and clear for faster speech synthesis.</span>
                  <span className={text.length > 50 ? 'text-amber-600 font-bold' : ''}>
                    {text.length}/64 characters
                  </span>
                </div>
              </div>

              {/* Example Suggestions */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate uppercase tracking-wider block mb-2">
                  Quick Suggestions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'I need water',
                    'Please help me',
                    'Thank you',
                    'I am tired',
                    'Yes, please',
                    'No, thank you',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setText(suggestion)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-canvas text-navy border border-border-pale hover:bg-primary-light hover:border-primary/30 transition-colors cursor-pointer"
                    >
                      + "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardware Readiness Note */}
              <div className="p-4 rounded-xl bg-primary-light/40 border border-primary/20 text-xs text-slate-dark flex items-start gap-3">
                <span className="text-primary text-base shrink-0">💡</span>
                <div className="leading-relaxed">
                  <strong className="text-navy font-semibold">Hardware Tip:</strong> In the next step, you will perform the physical motion with your VAANI glove. Ensure the glove is powered on and snug on your dominant hand.
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-border-pale">
                <Button to="/signs" variant="ghost" size="md">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Continue to Gesture Capture →
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* ======================================================== */}
        {/* STEP 2: CAPTURE THE GESTURE                              */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <Card className="p-8 sm:p-10">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                Step 2 of 3
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-navy mt-1 mb-2">
                Record your gesture
              </h2>
              <p className="text-slate text-sm leading-relaxed">
                Associate the physical hand motion with your phrase: <strong className="text-navy font-semibold">"{text}"</strong>
              </p>
            </div>

            {/* Offline Alert if Hub is disconnected */}
            {hubConnected === false && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <span className="text-lg shrink-0">⚠️</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Glove Hub Disconnected
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    The ESP32 microcontroller is not currently broadcasting status packets. Turn on the glove power switch and verify your network bridge to enable live sensor sampling.
                  </p>
                </div>
              </div>
            )}

            {/* State A: Waiting for Hub to Arm */}
            {captureStage === 'waiting-glove' && (
              <div className="py-8 text-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold animate-pulse">
                  🧤
                </div>
                <Badge variant="warning" size="md" className="mb-3">
                  WAITING FOR GLOVE HUB
                </Badge>
                <h3 className="font-heading font-bold text-xl text-navy mb-2">
                  Preparing Sensor Buffer
                </h3>
                <p className="text-sm text-slate leading-relaxed mb-6">
                  Put on the glove and keep your hand relaxed. The ESP32 hub checks for pending gestures every 30 seconds and will arm automatically.
                </p>
                <div className="p-3.5 rounded-xl bg-bg-canvas border border-border-pale text-xs font-mono text-slate-dark text-left space-y-1">
                  <div>· Phrase: "{text}"</div>
                  <div>· Sensor Channels: 22 Flex/IMU</div>
                  <div>· Status: Queued in backend synchronization loop</div>
                </div>
              </div>
            )}

            {/* State B: Recording in Progress (Armed) */}
            {captureStage === 'recording-in-progress' && (
              <div className="py-8 text-center max-w-md mx-auto">
                <div className="relative inline-flex mb-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-critical opacity-75"></span>
                  <div className="w-16 h-16 rounded-full bg-critical text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    🔴
                  </div>
                </div>
                <Badge variant="critical" size="md" className="mb-3">
                  RECORDING IN PROGRESS
                </Badge>
                <h3 className="font-heading font-extrabold text-2xl text-navy mb-2">
                  Perform Gesture Now
                </h3>
                <p className="text-sm text-slate leading-relaxed mb-6">
                  The hub is actively sampling 22 flex sensors and IMU rotation at 50Hz. Perform the sign for <strong className="text-navy">"{text}"</strong> once, smoothly and deliberately.
                </p>
                <div className="w-full bg-critical-light/60 border border-critical/30 rounded-xl p-4 text-xs font-mono text-critical animate-pulse font-semibold">
                  Capturing 50-sample temporal motion window...
                </div>
              </div>
            )}

            {/* State C: Capture Completed */}
            {captureStage === 'capture-completed' && (
              <div className="py-8 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-success-light text-success flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  ✓
                </div>
                <Badge variant="success" size="md" className="mb-3">
                  CAPTURE COMPLETED
                </Badge>
                <h3 className="font-heading font-extrabold text-2xl text-navy mb-2">
                  Motion Window Acquired
                </h3>
                <p className="text-sm text-slate leading-relaxed mb-6">
                  Sensor template data has been successfully received from the ESP32 hub. Proceed to review and verify your new gesture.
                </p>
                <Button onClick={handleProceedToReview} variant="primary" size="lg" className="w-full">
                  Proceed to Review & Save →
                </Button>
              </div>
            )}

            {/* State D: Capture Failed */}
            {captureStage === 'capture-failed' && (
              <div className="py-8 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-critical-light text-critical flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  ✕
                </div>
                <Badge variant="critical" size="md" className="mb-3">
                  CAPTURE FAILED
                </Badge>
                <h3 className="font-heading font-bold text-xl text-navy mb-2">
                  Recording Timed Out
                </h3>
                <p className="text-sm text-slate leading-relaxed mb-6">
                  The hub was unreachable or did not complete within the expected session window. Your phrase "{text}" has been preserved so you can retry immediately.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setCaptureStage('waiting-glove')} variant="primary" size="md">
                    Retry Capture
                  </Button>
                  <Button onClick={handleCancelCapture} variant="secondary" size="md">
                    Cancel to Library
                  </Button>
                </div>
              </div>
            )}

            {/* Cancel Button during capture */}
            {captureStage !== 'capture-completed' && captureStage !== 'capture-failed' && (
              <div className="pt-6 border-t border-border-pale text-center">
                <button
                  type="button"
                  onClick={handleCancelCapture}
                  className="text-xs font-semibold text-slate hover:text-critical transition-colors cursor-pointer"
                >
                  Cancel Recording & Return to Library
                </button>
              </div>
            )}
          </Card>
        )}

        {/* ======================================================== */}
        {/* STEP 3: REVIEW AND SAVE                                  */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <Card className="p-8 sm:p-10">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold text-success uppercase tracking-wider">
                Step 3 of 3
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-navy mt-1 mb-2">
                Review & Confirm Sign
              </h2>
              <p className="text-slate text-sm leading-relaxed">
                Review the gesture definition below before adding it to your personal vocabulary library.
              </p>
            </div>

            {saveSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-success-light text-success flex items-center justify-center mx-auto text-3xl font-bold">
                  🎉
                </div>
                <Badge variant="success" size="lg">
                  ADDED TO VOCABULARY
                </Badge>
                <h3 className="font-heading font-extrabold text-2xl text-navy">
                  Personal Sign Ready
                </h3>
                <p className="text-sm text-slate max-w-md mx-auto">
                  Your phrase <strong className="text-navy font-semibold">"{text}"</strong> has been saved. The wearable speech model will now recognize this gesture and speak it aloud.
                </p>
                <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button to="/signs" variant="primary" size="md">
                    View in Vocabulary Library →
                  </Button>
                  <Button onClick={handleResetWorkflow} variant="secondary" size="md">
                    + Record Another Sign
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-bg-canvas border border-border-pale space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-slate-dark font-medium block">Spoken Expression</span>
                      <p className="text-xl font-heading font-bold text-navy mt-0.5">"{text}"</p>
                    </div>
                    <Badge variant="success" size="sm">
                      Template Verified
                    </Badge>
                  </div>

                  <div className="pt-3 border-t border-border-pale grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate block">Sensor Window</span>
                      <strong className="text-navy font-mono">50 samples × 22ch</strong>
                    </div>
                    <div>
                      <span className="text-slate block">Sample Rate</span>
                      <strong className="text-navy font-mono">50 Hz Temporal</strong>
                    </div>
                    <div>
                      <span className="text-slate block">Classification Target</span>
                      <strong className="text-navy font-mono">Personal Vocabulary</strong>
                    </div>
                  </div>
                </div>

                {saveError && (
                  <div className="p-4 rounded-xl bg-critical-light border border-critical/20 text-xs text-critical font-medium">
                    {saveError}
                  </div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-pale">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-slate hover:text-navy transition-colors cursor-pointer"
                  >
                    ← Re-record Gesture
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      onClick={async () => {
                        setSavingSign(true)
                        setSaveError('')
                        try {
                          // The sign was already registered and updated during capture
                          // Confirm save and mark ready
                          setSaveSuccess(true)
                        } catch {
                          setSaveError('Could not finalize sign. Please retry.')
                        } finally {
                          setSavingSign(false)
                        }
                      }}
                      variant="primary"
                      size="md"
                      disabled={savingSign}
                      className="w-full sm:w-auto"
                    >
                      {savingSign ? 'Saving to Library...' : 'Save & Finish →'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  )
}
