# Continuity Handoff Document

## 1. Project Purpose & Architecture
VAANI (VaaniGlove) is an assistive wearable technology system designed to translate hand gestures into natural spoken voice in real time.
- **Embedded**: ESP32-S3 firmware with 22-channel flex/IMU sensors & eSpeak-NG audio output (`vaaniglove_hub`).
- **ML Engine**: 1D CNN trained on 60 gestures (`vaaniglove-training`).
- **Backend**: FastAPI with PostgreSQL storing users, device registrations, and personal signs (`vaaniglove-backend`).
- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 web application (`vaaniglove-app`).

## 2. Workspace & Environment Locations
- **Active Working Directory**: `/Users/prachi/VAANI TOTAL`
- **Frontend Root**: `/Users/prachi/VAANI TOTAL/vaaniglove-app`
- **Backend Root**: `/Users/prachi/VAANI TOTAL/vaaniglove-backend/vaaniglove-backend`
- **Protected Offline Backup**: `/Users/prachi/vaani total2` (Must NOT be touched or modified).

## 3. Team Roster (Integrated in `src/data/team.js` & Landing Page)
1. **Prachi Sahu**: (`/team/prachi.png`, [LinkedIn](https://www.linkedin.com/in/prachi-sahu-68b195411))
2. **Rishi Jha**: (`/team/rishi.png`, [LinkedIn](https://www.linkedin.com/in/rishi-jha-xyz))
3. **Prakhar Sharma**: (`/team/prakhar.jpg`, [LinkedIn](https://www.linkedin.com/in/prakhar-sharma-511b943b0))

## 4. Current Implementation Status
- **Personal Signs (`/signs`)**: Dedicated Vocabulary Library (search, status badges, deletion confirmation, empty states, and `+ Create Personal Sign` CTA). No redundant text entry.
- **Record Sign (`/record`)**: Single 3-Stage Creation Studio:
  - Step 1: Define Phrase (validated with examples).
  - Step 2: Capture Gesture (hardware hub sync, armed pulse, safe cancel/cleanup).
  - Step 3: Review & Save (confirmation and return to library).
- **Production Build**: Clean in 164ms with 0 errors.

## 5. How to Run the Project
1. **Backend**:
   ```bash
   cd "/Users/prachi/VAANI TOTAL/vaaniglove-backend/vaaniglove-backend"
   source venv/bin/activate
   uvicorn app.main:app --reload --port 8000
   ```
2. **Frontend**:
   ```bash
   cd "/Users/prachi/VAANI TOTAL/vaaniglove-app"
   npm run dev
   ```
3. **Open in Browser**:
   - `http://localhost:5173/` (Landing page)
   - `http://localhost:5173/signs` (Personal Signs Library)
   - `http://localhost:5173/record` (3-Step Creation Studio)
