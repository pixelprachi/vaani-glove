/**
 * User Guide content and topic hierarchy for VAANI Help Center.
 * All instructions reflect genuine features, real endpoints, and verified ESP32 hardware behavior.
 */

export const guideTopics = [
  {
    id: 'getting-started',
    group: 'Getting Started',
    title: 'Getting Started with VAANI',
    subtitle: 'Understanding the gesture-to-speech assistive pipeline and system workflow.',
    content: {
      intro: 'VAANI is a wearable assistive technology system designed to give voice to individuals with speech and verbal communication barriers. By capturing nuanced hand gestures through high-precision sensors, VAANI classifies physical motions and articulates them into synthesized spoken words.',
      sections: [
        {
          heading: 'Who VAANI Supports',
          text: 'VAANI is built for non-verbal individuals, people with neurological speech impairments, stroke survivors regaining expressive capability, and signers communicating with non-signers in everyday situations.'
        },
        {
          heading: 'The 3-Step Assistive Pipeline',
          steps: [
            'Wearable Motion Capture: A 22-channel sensor mesh (finger flex sensors + 6-DoF inertial measurement unit) measures finger bending angles and wrist orientation at 50Hz.',
            'Edge Neural Inference: A 1D Convolutional Neural Network (CNN) runs directly on the ESP32-S3 microcontroller, matching real-time 50-sample sensor windows against trained gesture classes.',
            'Audible Speech Synthesis: Upon classification, the system vocalizes the phrase aloud through the glove’s onboard eSpeak-NG acoustic speaker and simultaneously streams live transcripts to the web interface via WebSockets.'
          ]
        },
        {
          heading: 'Official vs. Personal Vocabulary',
          text: 'The baseline firmware contains an Official Vocabulary of 60 pre-trained general signs. In addition, users can train custom Personal Signs for personal names, domestic phrases, or emergency requests.'
        }
      ]
    }
  },
  {
    id: 'dashboard',
    group: 'Features',
    title: 'Understanding the Workspace Dashboard',
    subtitle: 'Your central control room for hardware monitoring, vocabulary metrics, and quick workflows.',
    content: {
      intro: 'After signing into your VAANI account, you are greeted with the Glove Workspace Overview at `/dashboard`. This operational dashboard keeps you informed about your system’s status and provides one-click access to all features.',
      sections: [
        {
          heading: 'Navigation Header Bar',
          steps: [
            'Overview: Returns to your main dashboard metrics and workflow launcher.',
            'Personal Signs: Navigates to your custom vocabulary library to view, add, or delete gestures.',
            'Record Sign: Launches the guided 6-stage motion capture wizard.',
            'Test Gesture: Opens the live real-time speech verification studio.',
            'Help & Guide: Direct shortcut to this documentation and troubleshooting resource.',
            'Hardware Status Badge: Real-time telemetry indicator showing whether your glove is Connected (Green) or Disconnected (Red).'
          ]
        },
        {
          heading: 'Status Metrics Strip',
          text: 'At the top of the dashboard, three cards provide immediate feedback:',
          steps: [
            'Hardware Hub: Displays live Bluetooth Low Energy (BLE) or HTTP connectivity with your ESP32 glove hub.',
            'Personal Signs: Shows the exact count of custom personal phrases currently ready and loaded in your profile.',
            'Official Vocabulary: Confirms the presence of the 60-sign quantized edge baseline model.'
          ]
        },
        {
          heading: 'Core Workflow Launchers',
          text: 'Three prominent cards allow direct access to Personal Signs Management, Guided Sign Recording, and Live Testing Suite.'
        }
      ]
    }
  },
  {
    id: 'personal-signs',
    group: 'Features',
    title: 'Personal Vocabulary Management',
    subtitle: 'How to view, search, and manage user-taught custom signs in your library.',
    content: {
      intro: 'The Personal Signs library at `/signs` houses all custom phrases you have taught your glove. Personal signs work alongside the 60 official gestures, giving you a tailored assistive dictionary.',
      sections: [
        {
          heading: 'Viewing Your Library',
          text: 'Each registered gesture card displays the spoken phrase, unique database ID, number of recorded sensor windows, and readiness badge (Ready). If you have not recorded any custom signs yet, a helpful empty state guides you to the recording wizard.'
        },
        {
          heading: 'Searching Signs',
          text: 'Use the real-time filter input in the top-right card to instantly search through your signs by keyword or meaning.'
        },
        {
          heading: 'Adding a Sign Definition',
          text: 'Use the "Add Sign Definition" card to quickly register a new phrase. Note: this adds a phrase entry in your profile. To capture the physical hand motion with the glove sensors, proceed to the Record Sign wizard.'
        },
        {
          heading: 'Deleting a Sign Safely',
          text: 'To prevent accidental deletion of trained signs, clicking "Delete" triggers an inline confirmation toggle ("Confirm" / "Cancel"). Clicking Confirm permanently removes the gesture template from your personal profile.'
        }
      ]
    }
  },
  {
    id: 'recording-sign',
    group: 'Features',
    title: 'Recording a Custom Sign',
    subtitle: 'Step-by-step walkthrough of the 6-stage guided motion capture wizard.',
    content: {
      intro: 'Teaching your glove a new sign is handled through a guided 6-stage wizard at `/record`. This wizard coordinates with the backend and ESP32 hub to arm sensors and capture the motion.',
      sections: [
        {
          heading: 'The 6-Stage Capture Lifecycle',
          steps: [
            '1. Idle (Form Input): Type the exact phrase you want your glove to speak aloud (e.g., "Help", "Water", "Good Morning"). Fasten your glove securely and rest your hand in a neutral baseline position.',
            '2. Submitting: The web app initializes a new recording session with the backend database.',
            '3. Pending (Waiting for Hub): The session is queued. The glove hub checks for pending gestures every 30 seconds.',
            '4. Armed (Sensor Buffer Ready): The UI turns red with a pulsating alert. The hub is now actively sampling 22 sensor channels at 50Hz. Perform the sign once, smoothly and deliberately.',
            '5. Ready (Capture Complete): The sensor window is validated and stored. The screen turns green, confirming your sign is ready for live vocalization.',
            '6. Error Recovery: If a timeout occurs or the hub is unreachable, an error screen allows you to retry immediately.'
          ]
        },
        {
          heading: 'Tips for Clean Capture',
          steps: [
            'Start and end the sign from a relaxed, neutral resting hand pose.',
            'Execute the motion at a natural, steady pace without jerky or rushed movements.',
            'Ensure the glove flex sensor straps are snug across your finger joints.'
          ]
        }
      ]
    }
  },
  {
    id: 'testing-gesture',
    group: 'Features',
    title: 'Live Gesture Testing Studio',
    subtitle: 'Verifying real-time recognition, confidence scores, and audible speech synthesis.',
    content: {
      intro: 'The Gesture Testing Studio at `/test-gesture` provides a live diagnostic environment to verify that your hand gestures are accurately recognized and spoken aloud.',
      sections: [
        {
          heading: 'How Live Testing Operates',
          steps: [
            '1. Click "Ready — Perform Sign": The studio activates an animated sound wave listener, waiting for motion data.',
            '2. Perform Gesture: Perform any official sign or registered personal sign using the glove.',
            '3. Real-Time Push: The ESP32 classifies the motion and pushes the result to the backend, which streams it via WebSocket (/ws/transcript/{userId}) directly to your browser.',
            '4. Instant Vocalization: The browser immediately speaks the recognized word aloud using the Web Audio SpeechSynthesis API.',
            '5. Confidence Gauge: A dynamic progress bar reveals the model confidence score (e.g. 96%) and marks whether it was identified from the Official Vocabulary or your Personal Signs.'
          ]
        },
        {
          heading: 'Replay Speech Audio',
          text: 'If you missed the spoken voice or want to hear it again, click the "🔊 Replay Speech Audio" button to trigger the speech synthesizer on demand.'
        },
        {
          heading: 'Telemetry Diagnostics Sidebar',
          text: 'The sidebar displays live connection status for the WebSocket stream, ESP32 Hub status, browser Text-to-Speech engine availability, and active neural network model architecture.'
        }
      ]
    }
  },
  {
    id: 'hardware-setup',
    group: 'Hardware & Prototype',
    title: 'Hardware Setup & Glove Wearing',
    subtitle: 'Physical hardware specifications, sensor positioning, and powering instructions.',
    content: {
      intro: 'The physical VAANI Glove prototype combines flexible conductive bend sensors, an IMU attitude sensor, and an ESP32-S3 microcontroller hub mounted at the wrist.',
      sections: [
        {
          heading: 'Proper Glove Wearing Procedure',
          steps: [
            'Slide your hand into the glove, ensuring fingers reach the fingertips of the sensor channels.',
            'Align the flex sensor strips directly over the knuckles (MCP and PIP joints) on each of your five fingers.',
            'Secure the wrist cuff firmly with the strap to ensure the ESP32-S3 hub and IMU remain stable during hand rotation.',
            'Check that wiring ribbons have sufficient slack to allow full fist closure without strain.'
          ]
        },
        {
          heading: 'Powering On & Telemetry Bridge',
          steps: [
            'Switch on the power switch on the ESP32 wrist enclosure. The blue status LED will blink while initializing.',
            'Once connected via Bluetooth or Wi-Fi, the status LED stays solid, and the web app status badge changes from "Glove Disconnected" to "Glove Hub Connected".',
            'To test the hardware speaker, perform a baseline greeting sign — the onboard eSpeak speaker will produce audio.'
          ]
        }
      ]
    }
  },
  {
    id: 'troubleshooting',
    group: 'Support',
    title: 'Troubleshooting & Diagnostics',
    subtitle: 'Resolutions for common connection, recording, login, and audio questions.',
    content: {
      intro: 'Encountering an issue? Review the quick solutions below for hardware, network, and application states.',
      troubleshootingItems: [
        {
          problem: 'Badge says "Glove Disconnected" / "Hub Offline"',
          cause: 'The ESP32 microcontroller is powered off, out of battery, or not communicating with the backend API.',
          solution: 'Power cycle the glove switch. Ensure the backend server is running on http://localhost:8000 and the hub/bridge is transmitting status packets to POST /hub/status.'
        },
        {
          problem: 'No audio heard when testing a gesture',
          cause: 'Computer sound is muted, or browser audio permission is blocked.',
          solution: 'Check your computer volume. Ensure you have interacted with the webpage (browsers block autoplay audio until the user clicks). Click the "Replay Speech Audio" button.'
        },
        {
          problem: 'Sign recording stays on "Waiting for Hub" (Pending)',
          cause: 'The hub polls for pending signs every 30 seconds, or the glove is not connected to the network.',
          solution: 'Wait up to 30 seconds for the next polling cycle. If it does not transition to "Armed", ensure the glove hub is connected and active.'
        },
        {
          problem: 'Low confidence score or misrecognized sign',
          cause: 'Hand orientation differed significantly from the baseline training template.',
          solution: 'Keep your hand steady at the start of the motion. Perform the gesture with deliberate, clear transitions rather than rapid flicking.'
        },
        {
          problem: 'Login fails with "Invalid credentials"',
          cause: 'Incorrect email or password entered.',
          solution: 'Verify your email address. Default test account credentials are you@example.com with password vaani123.'
        }
      ]
    }
  },
  {
    id: 'faq',
    group: 'Support',
    title: 'Frequently Asked Questions (FAQ)',
    subtitle: 'Common questions regarding capability, vocabulary expansion, privacy, and future releases.',
    content: {
      intro: 'Find answers to frequently asked questions about the VAANI assistive wearable platform.',
      faqs: [
        {
          q: 'Does VAANI translate full, fluent sign language sentences?',
          a: 'Currently, VAANI classifies a curated vocabulary of approximately 60 distinct gestures on-chip, plus user-defined personal signs. Ongoing research focuses on multi-gesture grammar and continuous sentence sequencing.'
        },
        {
          q: 'Can I use VAANI without an internet connection?',
          a: 'Yes! The ESP32-S3 runs the 1D CNN model and eSpeak audio engine entirely on-device. The web platform is used for monitoring, recording new custom signs, and reviewing personal dictionaries.'
        },
        {
          q: 'How many personal signs can I teach the glove?',
          a: 'The backend database supports unlimited personal sign definitions. The glove synchronizes your custom gesture templates into memory for real-time edge comparison.'
        },
        {
          q: 'Is my personal gesture data private and secure?',
          a: 'Yes. All personal signs and transcript logs are tied strictly to your authenticated user account protected by JWT tokens and bcrypt encryption. Your data is never shared publicly.'
        },
        {
          q: 'Can left-handed users wear the glove?',
          a: 'The physical prototype is currently assembled for right-hand ergonomics, but the backend contains calibration endpoints (/calibration) supporting dual-hand sensor mapping for future left-hand builds.'
        }
      ]
    }
  }
]
