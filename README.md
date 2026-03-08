# SnapLearn

AI-powered study assistant that turns any homework or exam photo into a personalized study plan.

**Live app:** [snaplearn-app.vercel.app](https://snaplearn-app.vercel.app)

## Features

- **Image Analysis** — Upload a photo of any homework, exam, or textbook problem. GPT-4o Vision extracts the text and classifies the subject, topic, and grade level.
- **Accurate Grade Detection** — Identifies specific grade levels from Pre-K through Postgraduate.
- **Study Recommendations** — Get key concepts, clear explanations, and a step-by-step study path.
- **Multiple-Choice Practice** — AI-generated quiz questions with instant feedback and explanations.
- **Resource Links** — Clickable links to real educational platforms (Khan Academy, Coursera, YouTube, etc.).
- **Common Mistakes** — Learn what pitfalls to avoid before you make them.
- **History** — View past analyses saved in your browser.
- **Profile & Account Settings** — Manage your profile via Clerk authentication.
- **Dark Mode** — Toggle between light and dark themes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | FastAPI (Python), deployed as Vercel serverless function |
| AI | OpenAI GPT-4o (vision + structured output) |
| Auth | [Clerk](https://clerk.com) (JWT verification via JWKS) |
| Hosting | [Vercel](https://vercel.com) |

## Project Structure

```
snaplearn/
├── api/
│   └── index.py          # FastAPI backend (analyze endpoint, Clerk auth)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Landing page, dashboard, auth wrapper
│   │   ├── api/client.js  # API client
│   │   ├── components/    # ImageUpload, ResultsDisplay, Settings, etc.
│   │   └── hooks/         # useTheme, useHistory
│   ├── index.html
│   └── package.json
├── requirements.txt       # Python dependencies
├── vercel.json            # Vercel deployment config
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12+
- OpenAI API key
- Clerk account (for authentication)

### Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/MichaelWeng-Git/snaplearn.git
   cd snaplearn
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**

   Create `frontend/.env.local`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

   Set backend env vars (or add to Vercel dashboard):
   ```
   OPENAI_API_KEY=your_openai_api_key
   CLERK_ISSUER=https://your-clerk-instance.clerk.accounts.dev
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Make sure to add `OPENAI_API_KEY`, `CLERK_ISSUER`, and `VITE_CLERK_PUBLISHABLE_KEY` as environment variables in the Vercel dashboard.

## How It Works

1. User uploads a photo of a homework/exam question
2. Backend sends the image to GPT-4o Vision, which extracts text and classifies the content
3. A second GPT-4o call generates study recommendations, practice questions, and resource links
4. Results are displayed with interactive multiple-choice exercises

## License

MIT
