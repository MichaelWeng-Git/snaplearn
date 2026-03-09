# Changelog

All notable changes to SnapLearn are documented in this file.

---

## [2.2.0] - 2026-03-09

### Added
- **Video Lessons page** — browse curated YouTube lessons organized by grade level and subject
- Grade level tabs: Elementary (K-5), Middle School (6-8), High School (9-12), College/AP
- 15+ subjects across all grade levels: Math, Science, Physics, Chemistry, Biology, Computer Science, Economics, History, Psychology, English, Spanish, Art & Music, and more
- Embedded YouTube player with autoplay — click any lesson to watch within the app
- Subjects from user's study history are highlighted with "From your studies" badge
- Teal/green gradient "Video Lessons" card on dashboard home
- Responsive thumbnails with hover play button overlay

---

## [2.1.0] - 2026-03-08

### Added
- **Duolingo-style Daily Practice page** — full dedicated page with one question at a time, animated transitions, and gamified experience
- Hearts system: 3 hearts, lose one per wrong answer, game over at 0
- XP system: +20 per correct answer, +50 completion bonus, +100 perfect bonus
- Animated feedback banners (green/red slide-up) with auto-advance after 1.5s
- Progress bar and live XP counter during practice
- Celebration completion screen with trophy/star, score, XP earned, hearts left, accuracy %
- "Continue" and "Practice Again" buttons on completion
- CSS keyframe animations: slideUp, slideInRight, bounceIn, correctPulse, incorrectShake, xpFloat

### Changed
- Daily Practice on dashboard replaced with gradient launch card ("Daily Practice — 5 questions, Earn XP!")
- Practice now opens as a full page instead of inline on the dashboard
- Back arrow in header works during practice to return to dashboard

---

## [2.0.0] - 2025-03-08

### Added
- **Daily Practice** — auto-generated practice section on the dashboard between Study Stats and Your Questions; generates multiple-choice questions based on the user's entire study history using GPT-4o-mini
- Score tracking with progress bar (answered/total) and correct count
- Result messages on completion: Perfect score / Nice work / Keep practicing
- "New Questions" button to regenerate fresh daily practice

### Changed
- `ExerciseCard` now accepts optional `onAnswer(isCorrect)` callback for external score tracking

---

## [1.9.0] - 2025-03-08

### Added
- **Study Streak** — orange gradient card showing consecutive days of study activity, with motivational messages (Good start / Great momentum / Amazing!)
- **Daily Goal** — set a daily target for questions to analyze (default 5), shows progress bar and today's count; goal is editable and saved to localStorage
- Goal completion celebrated with green checkmark and "Goal reached!" message

---

## [1.8.3] - 2025-03-08

### Changed
- **Back arrow in header** — a left-arrow button appears in the header next to the title when not on the dashboard home (upload, loading, results, history view), clicking it returns to the dashboard

---

## [1.8.2] - 2025-03-08

### Added
- **Back to dashboard on analysis view** — when viewing a saved analysis from history, top and bottom "Back to dashboard" buttons return to main dashboard

---

## [1.8.1] - 2025-03-08

### Added
- **Back to dashboard button** — visible on upload page, loading state, error state, and results page so users can always return to the main dashboard
- Styled back button with arrow icon on upload page for better visibility
- "Back to dashboard" + "Try again" buttons on error page
- "Back to dashboard" + "Analyze another question" buttons on results page

---

## [1.8.0] - 2025-03-08

### Changed
- **Question cards on dashboard** — each uploaded question is now displayed as a card showing subject/topic/subtopic badges, extracted text preview, and timestamp
- **Per-question practice generation** — each question card has a "Generate Practice" button that creates 5 multiple-choice exercises specific to that question's topic
- **Show/Hide toggle** — generated exercises can be collapsed and re-expanded; "New Questions" button regenerates fresh exercises

---

## [1.7.0] - 2025-03-08

### Added
- **Dashboard Home** — when user has study history, the dashboard now shows a personalized home view instead of just the upload box
- **Study stats** — displays total questions analyzed and unique topics covered, with subject badges
- **AI-recommended practice questions** — new `POST /api/recommend` endpoint uses GPT-4o-mini to generate 5 multiple-choice questions based on the user's study history
- **Upload CTA** — prominent "Analyze a new question" card with upload button; "Back to dashboard" link when in upload view

### Changed
- Dashboard idle state now conditionally renders `DashboardHome` (when history exists) or `ImageUpload` (when no history or user clicks upload)
- Exported `ExerciseCard` from `ResultsDisplay.jsx` for reuse in `DashboardHome`

### New Files
- `frontend/src/components/DashboardHome.jsx`

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
