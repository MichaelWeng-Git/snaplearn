# SnapLearn

> AI-powered study assistant — upload any homework or exam photo, get a personalized study plan instantly.

**Live:** [snaplearn-app.vercel.app](https://snaplearn-app.vercel.app)

---

## Features

| Feature | Description |
|---------|-------------|
| Image Analysis | GPT-4o Vision extracts text and classifies subject, topic, and grade level |
| Grade Detection | Specific levels from Pre-K to Postgraduate |
| Study Plan | Key concepts, explanations, and step-by-step learning path |
| Practice Quiz | Multiple-choice questions with instant feedback |
| Resource Links | Clickable links to Khan Academy, Coursera, YouTube, etc. |
| History | Browse past analyses saved locally |
| Profile | Account settings and profile management via Clerk |
| Dark Mode | Light / dark theme toggle |

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** FastAPI (Python) on Vercel Serverless Functions
- **AI:** OpenAI GPT-4o (vision + structured output)
- **Auth:** [Clerk](https://clerk.com) (JWT / JWKS verification)
- **Hosting:** [Vercel](https://vercel.com)

## Project Structure

```
snaplearn/
├── api/
│   └── index.py              # FastAPI — auth, image analysis, recommendations
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Landing page + dashboard + Clerk auth
│   │   ├── api/client.js     # API client (fetch wrapper)
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── ResultsDisplay.jsx
│   │   │   ├── HistorySidebar.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── Settings.jsx
│   │   └── hooks/
│   │       ├── useTheme.js
│   │       └── useHistory.js
│   ├── index.html
│   └── package.json
├── requirements.txt          # Python deps (fastapi, openai, pyjwt, etc.)
├── vercel.json               # Vercel routing & build config
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12+
- [OpenAI API key](https://platform.openai.com/api-keys)
- [Clerk](https://clerk.com) account

### 1. Clone & Install

```bash
git clone https://github.com/MW-Stranger/snaplearn.git
cd snaplearn/frontend
npm install
```

### 2. Environment Variables

**Frontend** — create `frontend/.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

**Backend** — set in Vercel dashboard (or local `.env`):

```
OPENAI_API_KEY=sk-...
CLERK_ISSUER=https://your-instance.clerk.accounts.dev
```

### 3. Run Locally

```bash
cd frontend
npm run dev
```

### 4. Deploy

```bash
vercel --prod
```

## How It Works

```
Photo  →  GPT-4o Vision  →  Text + Classification  →  GPT-4o Tutor  →  Study Plan
                                (subject, topic,         (concepts, quiz,
                                 grade level)              resources, path)
```

1. User uploads a homework/exam photo
2. GPT-4o Vision extracts text, identifies subject, topic, and grade level
3. A second GPT-4o call generates study recommendations with practice questions
4. Results are displayed with interactive multiple-choice exercises and resource links

## License

MIT

---

Built with OpenAI GPT-4o and Clerk.
