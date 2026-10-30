# VAANI Frontend Design System

## 1. Design Philosophy
VAANI is an assistive medical and wearable technology interface. It communicates:
- **Clinical & Engineering Credibility**: Clean geometric layouts, restrained styling, accessible data display.
- **Human Connection**: Warm, empathetic tone, high readability, generous breathing room.
- **Purposeful Motion**: Functional feedback, subtle state transitions, zero disorienting animations.

## 2. Color Palette

| Token Name | Hex Code | Role |
| :--- | :--- | :--- |
| **Deep Navy** | `#102A43` | Primary text headings, dark sections, high-contrast accents |
| **Primary Blue** | `#2563EB` | Primary brand action color, active states, key focus borders |
| **Soft Blue** | `#EAF3FF` | Tinted background fills, badge backgrounds, card highlights |
| **Pure White** | `#FFFFFF` | Primary surface background, card containers |
| **Background Tint** | `#F8FAFC` | App canvas background, neutral surface alternate |
| **Slate Text** | `#526579` | Secondary body text, descriptions, labels |
| **Pale Borders** | `#DCE6F1` | Clean structural dividing lines, card borders, form outlines |
| **Success Emerald** | `#059669` | Positive recognition feedback, hub connected state |
| **Warning Amber** | `#D97706` | Pending state, low confidence warning |
| **Critical Rose** | `#E11D48` | Disconnected state, errors, delete confirmations |

## 3. Typography
- **Headings**: Manrope (geometric, confident, high legibility). Fallback: `system-ui, -apple-system, sans-serif`.
- **Body & Data**: Inter (clarity, neutral metrics, high contrast). Fallback: `system-ui, sans-serif`.
- **Monospace / Sensor / Hardware Readings**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`.

### Hierarchy
- `Display / Hero`: 40px – 56px, SemiBold / Bold, tight letter-spacing (-0.02em).
- `Heading 1`: 32px – 36px, SemiBold.
- `Heading 2`: 24px – 28px, SemiBold.
- `Heading 3`: 18px – 20px, Medium / SemiBold.
- `Body Large`: 16px – 18px, Regular / Medium.
- `Body Default`: 14px – 15px, Regular.
- `Caption / Eyebrow`: 12px – 13px, Medium / SemiBold, uppercase tracking (+0.05em).

## 4. Spacing & Layout
- Grid: 8pt baseline spacing system (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px).
- Container Width: Maximum content width of 1200px for public pages, 1140px for application dashboard.
- Radius Tokens:
  - Small elements (buttons, inputs, badges): `8px` (`rounded-lg`).
  - Cards & panels: `16px` (`rounded-2xl`).
  - Hero visual containers: `24px` (`rounded-3xl`).

## 5. Components & Interactive States
- **Buttons**:
  - Primary: Primary Blue background (`#2563EB`), White text, subtle hover lift and brightness shift.
  - Secondary: White background, Pale border (`#DCE6F1`), Deep Navy text (`#102A43`).
  - Ghost: Slate text, soft blue hover background.
- **Cards**:
  - Crisp pale borders (`#DCE6F1`), subtle elevation shadow (`0 1px 3px rgba(16, 42, 67, 0.05)`).
- **Forms**:
  - Clear label above input, visible focus ring (`ring-2 ring-primary-blue`), inline validation error states.
- **Indicators**:
  - Live hardware pulse indicator (Green pulse when connected, neutral/amber when checking, rose when offline).

## 6. Accessibility & Motion Guidelines
- WCAG AA compliant contrast ratio (minimum 4.5:1 for normal text against backgrounds).
- Explicit `focus-visible` styling on all interactive controls.
- Full respect for `@media (prefers-reduced-motion: reduce)`.
