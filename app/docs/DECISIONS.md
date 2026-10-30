# Design & Technical Decisions

## Decision 1: Dedicated Public Landing Page & Route Architecture
- **Date**: 2026-10-29
- **Context**: The existing application renders a bare private dashboard at `/` and redirects unauthenticated users to `/login`.
- **Decision**: Introduce a public landing page at `/` for unauthenticated visitors, while authenticated users land on the dedicated `/dashboard` (or dashboard view), with a clear "Log In" / "Launch App" toggle in the header.
- **Alternatives Considered**: Keeping `/` as private-only and creating a separate `/about` or `/landing` page. However, standard product conventions expect the public marketing/product explanation page at `/`.
- **Impact**: Enhances presentation without breaking any authenticated workflows or existing bookmark links.

## Decision 2: Design Token Implementation with Tailwind CSS v4
- **Date**: 2026-10-29
- **Context**: The app uses Tailwind CSS v4 (`@import "tailwindcss";` and `@theme` block in `src/index.css`).
- **Decision**: Express all design tokens (Deep Navy `#102A43`, Primary Blue `#2563EB`, Soft Blue `#EAF3FF`, Slate `#526579`, Pale Border `#DCE6F1`) directly inside `@theme` variables in `src/index.css`.
- **Alternatives Considered**: Using Tailwind v3 `tailwind.config.js`. Not selected because Vite and project dependencies are already upgraded to Tailwind v4.

## Decision 3: Engineering-Credible Assets & Illustrations
- **Date**: 2026-10-29
- **Context**: No physical photographs of the glove prototype currently exist in `vaaniglove-app/public`.
- **Decision**: Create an accurate, clean vector illustration representing the 22-channel flex sensor glove, ESP32 processing hub, and acoustic waveform, clearly labeled as an architectural schematic. Real photos can be plugged into `public/assets/` at any time without code refactoring.
- **Alternatives Considered**: Using generic stock photos of cybernetic gloves. Rejected because it contradicts the real engineering identity of VAANI.

## Decision 4: Handling Offline Hub & Testing State
- **Date**: 2026-10-29
- **Context**: During development, the physical ESP32 hub is not broadcasting live BLE packets.
- **Decision**: In `/record` and `/test-gesture`, provide explicit visual states for "Hub Offline / Not Connected" with instructions on how to connect, while maintaining functional mock/manual trigger capability where appropriate so frontend reviewers can inspect the full capture lifecycle.
