# VAANI Project Overview

## 1. System Purpose & Vision
VAANI (VaaniGlove) is an assistive wearable technology system designed to empower non-verbal and speech-impaired individuals by translating hand gestures into natural spoken voice in real time.

## 2. Architecture & Subsystems
The overall repository consists of four core components located under `/Users/prachi/VAANI TOTAL`:

1. **`vaaniglove_hub` (Embedded Firmware & Edge ML)**:
   - Platform: ESP32-S3 microcontroller.
   - Sensor Array: 22-channel flex & IMU sensor input.
   - On-Device Inference: TensorFlow Lite for Microcontrollers (`esp-tflite-micro`) and optimized kernels (`esp-nn`).
   - Voice Synthesis: Embedded eSpeak-NG for local speech generation.

2. **`vaaniglove-training` (ML Pipeline)**:
   - Framework: TensorFlow 2 / Keras (Python).
   - Architecture: 1D Convolutional Neural Network (Conv1D + MaxPooling + Dense) consuming shape `(WINDOW_LEN=50, CHANNELS=22)`.
   - Classification: 60 gesture classes covering conversational and sign language vocabulary.
   - Export: Quantized `.tflite` model and C array header `official_model_data.h` for ESP32 compilation.

3. **`vaaniglove-backend` (REST API & WebSockets)**:
   - Framework: FastAPI (Python 3.12+), SQLAlchemy 2.0 ORM, PostgreSQL database (`vaaniglove`).
   - Authentication: JWT (`python-jose`), bcrypt password hashing (`passlib`).
   - Real-Time Communication: WebSocket endpoint `/ws/transcript/{user_id}` for streaming live gesture recognition and confidence scores to the browser.
   - Endpoints:
     - `/auth/login`, `/auth/register`
     - `/vocabulary/personal` (CRUD for user-defined gestures), `/vocabulary/personal/record`, `/vocabulary/personal/{id}/status`, `/vocabulary/personal/{id}/complete`
     - `/vocabulary/official` (Official baseline vocabulary)
     - `/devices/pair`, `/calibration`, `/hub/status`, `/admin/stats`

4. **`vaaniglove-app` (Frontend Client)**:
   - Tech Stack: React 19, Vite 8, Tailwind CSS v4, React Router DOM 7, Axios.
   - Location: `/Users/prachi/VAANI TOTAL/vaaniglove-app`.
   - Routing:
     - `/` (Authenticated Dashboard)
     - `/login` (Authentication)
     - `/signs` (Personal Vocabulary Management)
     - `/record` (Step-by-step gesture capture and recording)
     - `/test-gesture` (Live testing and real-time speech synthesis)
   - Proposed Landing Page: Public presentation explaining hardware, machine learning pipeline, team, and mission.

## 3. Active Workspace and Backup Separation
- **Active Workspace**: `/Users/prachi/VAANI TOTAL` (strictly only modify files inside this tree).
- **Protected Offline Backup**: `/Users/prachi/vaani total2` (retained untouched).

## 4. Dependencies & Key Constraints
- React 19 (`react` 19.2.8, `react-dom` 19.2.8).
- Tailwind CSS v4 (`@tailwindcss/postcss` 4.3.3, `@theme` configuration in `src/index.css`).
- Build tool: Vite 8.
- Sensitive environment variables are defined in `.env` (`VITE_API_BASE_URL=http://localhost:8000`) and must not be exposed.
