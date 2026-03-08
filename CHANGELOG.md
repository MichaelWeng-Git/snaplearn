# Changelog

All notable changes to SnapLearn are documented in this file.

---

## [1.6.0] - 2025-03-08

### Changed
- Clean up project structure: removed unused `backend/` folder (migrated to `api/index.py`)
- Removed default Vite template README
- Rewrote root README with features, tech stack, project structure, and setup guide
- Updated `.gitignore`

---

## [1.5.0] - 2025-03-08

### Added
- Pushed entire project to GitHub: [github.com/MW-Stranger/snaplearn](https://github.com/MW-Stranger/snaplearn)

---

## [1.4.0] - 2025-03-08

### Added
- **Account Settings / Profile page** — new profile button (person icon) in dashboard header
- Profile modal displays user avatar, full name, email, and member-since date
- Embedded Clerk `UserProfile` component for full account management (update name, email, password, connected accounts)

---

## [1.3.0] - 2025-03-08

### Changed
- **Renamed app** from "Smart Study AI" to **SnapLearn** across all pages (landing, dashboard, sign-in, footer, browser tab)
- **Renamed Vercel project** to `snaplearn`
- **New URL:** [snaplearn-app.vercel.app](https://snaplearn-app.vercel.app) (old URL still redirects)

---

## [1.2.0] - 2025-03-08

### Added
- **Multiple-choice practice exercises** — each question now has 4 selectable options (A/B/C/D) with instant correct/incorrect feedback and explanations (replaced open-ended questions with hints)

### Changed
- Updated `PracticeExercise` model: `question`, `options`, `correct_answer`, `explanation` (previously `question`, `hint`)
- Updated backend prompt to generate multiple-choice format

---

## [1.1.0] - 2025-03-08

### Added
- **Clickable resource links** — each recommended resource now includes a real URL linking to educational platforms (Khan Academy, Coursera, MIT OCW, YouTube, etc.)
- New `Resource` Pydantic model with `name` and `url` fields (previously plain strings)

### Changed
- **More accurate grade levels** — replaced broad categories (elementary, middle_school, high_school, undergraduate, graduate) with specific levels: Pre-K, Kindergarten, Grade 1–12, Undergraduate Year 1–4, Graduate, Postgraduate
- Updated frontend `ResultsDisplay` to render resources as clickable blue links opening in new tabs

---

## [1.0.0] - 2025-03-08

### Added
- **Landing page** — full marketing page with hero section, "How it works" steps, features grid, CTA, and footer; completely independent of Clerk (no auth dependency on first load)
- **Clerk authentication** — replaced custom email/password auth with Clerk; `ClerkProvider` only mounts when user clicks "Sign in"
- **Backend JWT verification** — Clerk tokens verified via JWKS endpoint (`PyJWKClient` + RS256)
- **Dashboard** — authenticated app with image upload, AI analysis results, history sidebar, settings panel, and `UserButton`
- **Image analysis** — upload homework/exam photos; GPT-4o Vision extracts text and classifies subject, topic, subtopic, and difficulty level
- **Study recommendations** — second GPT-4o call generates key concepts, explanation, recommended resources, practice exercises, study path, and common mistakes
- **History** — past analyses saved to `localStorage` with browse/delete/clear functionality
- **Dark mode** — theme toggle with system preference detection, persisted to `localStorage`
- **Settings panel** — theme toggle and app info
- **Error handling** — detailed error messages from backend, graceful frontend error states
- **Vercel deployment** — FastAPI as serverless function, Vite frontend as static build, custom routing via `vercel.json`

### Infrastructure
- **Frontend:** React 19, Vite, Tailwind CSS, `@clerk/react` v6
- **Backend:** FastAPI, OpenAI SDK (GPT-4o structured output), PyJWT with cryptography
- **Auth:** Clerk (publishable key + JWKS JWT verification)
- **Hosting:** Vercel (serverless functions + static frontend)

---

## [0.1.0] - 2025-03-03

### Added
- Initial project scaffolding
- Basic FastAPI backend with OpenAI integration
- React + Vite frontend with Tailwind CSS
- Image upload component
- Basic CORS configuration
