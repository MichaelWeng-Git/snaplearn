import { useState } from 'react';
import { ClerkProvider, SignIn, UserButton, UserProfile, useAuth, useUser } from '@clerk/react';
import ImageUpload from './components/ImageUpload';
import LoadingState from './components/LoadingState';
import ResultsDisplay from './components/ResultsDisplay';
import Settings from './components/Settings';
import HistorySidebar from './components/HistorySidebar';
import DashboardHome from './components/DashboardHome';
import DailyPracticePage from './components/DailyPracticePage';
import LessonsPage from './components/LessonsPage';
import { analyzeImage } from './api/client';
import useTheme from './hooks/useTheme';
import useHistory from './hooks/useHistory';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_c2hhcmluZy1pbXBhbGEtMTMuY2xlcmsuYWNjb3VudHMuZGV2JA';

/* ─── Landing Page (no Clerk dependency) ─── */

function LandingPage({ onSignIn }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">SnapLearn</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onSignIn} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
              Sign in
            </button>
            <button onClick={onSignIn} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm cursor-pointer">
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 rounded-full ring-1 ring-blue-200 dark:ring-blue-800">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Powered by GPT-4o Vision
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-gray-100 leading-[1.1] tracking-tight max-w-3xl">
              Turn any question into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">study plan</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
              Snap a photo of any homework, exam, or textbook problem. Get instant explanations, practice exercises, and a personalized learning path.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <button onClick={onSignIn} className="px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-600/25 cursor-pointer">
                Start studying smarter
              </button>
              <a href="#how-it-works" className="px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors ring-1 ring-gray-200 dark:ring-gray-700">
                See how it works
              </a>
            </div>
          </div>

          {/* Mock UI */}
          <div className="mt-20 max-w-2xl mx-auto">
            <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-2xl shadow-gray-900/10 dark:shadow-black/30 ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">SnapLearn</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">calculus_problem.jpg</div>
                    <div className="text-xs text-gray-400">Uploaded just now</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">Mathematics</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">Calculus</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">Undergraduate</span>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-700" />
                  <div className="h-2.5 w-4/5 rounded-full bg-gray-100 dark:bg-gray-700" />
                  <div className="h-2.5 w-3/5 rounded-full bg-gray-100 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">How it works</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto">Three simple steps to transform any question into a complete study guide.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          <div className="relative text-center">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full text-6xl font-black text-gray-100 dark:text-gray-800 select-none">1</div>
            <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-200 dark:ring-blue-800">
              <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload your question</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Take a photo or upload an image of any homework, exam, or textbook problem.</p>
          </div>
          <div className="relative text-center">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full text-6xl font-black text-gray-100 dark:text-gray-800 select-none">2</div>
            <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-200 dark:ring-purple-800">
              <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI analyzes it</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">GPT-4o Vision reads the content, identifies the subject, topic, and difficulty level.</p>
          </div>
          <div className="relative text-center">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full text-6xl font-black text-gray-100 dark:text-gray-800 select-none">3</div>
            <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30 ring-1 ring-green-200 dark:ring-green-800">
              <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Get your study plan</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Receive explanations, practice problems, resources, and a step-by-step learning path.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">Everything you need to ace your studies</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Text extraction', desc: 'Accurately reads handwritten and printed text from your images' },
              { icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', title: 'Clear explanations', desc: 'Get detailed breakdowns tailored to your difficulty level' },
              { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', title: 'Practice problems', desc: 'AI-generated exercises similar to your question with hints' },
              { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', title: 'Study paths', desc: 'Step-by-step learning roadmaps to master each topic' },
              { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', title: 'Curated resources', desc: 'Real textbooks, videos, and websites matched to your topic' },
              { icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', title: 'Common mistakes', desc: 'Learn what pitfalls to avoid before you make them' },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-12 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to study smarter?</h2>
          <p className="mt-4 text-blue-100 text-lg max-w-md mx-auto">Join students who are already using AI to learn faster and get better grades.</p>
          <button onClick={onSignIn} className="mt-8 px-8 py-3.5 text-base font-semibold text-blue-600 bg-white hover:bg-blue-50 rounded-xl transition-colors shadow-lg cursor-pointer">
            Get started for free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            SnapLearn
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Built with GPT-4o Vision. Your images are processed securely and never stored.</p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Authenticated Dashboard (inside ClerkProvider) ─── */

function Dashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [state, setState] = useState('idle');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [viewingHistoryItem, setViewingHistoryItem] = useState(null);
  const [showDailyPractice, setShowDailyPractice] = useState(false);
  const [showLessons, setShowLessons] = useState(false);
  const [lessonsSubject, setLessonsSubject] = useState(null);

  const { theme, toggleTheme } = useTheme();
  const { history, addEntry, deleteEntry, clearHistory } = useHistory();

  async function handleSubmit(file) {
    setState('loading');
    setError(null);
    setViewingHistoryItem(null);
    try {
      const token = await getToken();
      if (!token) { throw new Error('Not authenticated. Please sign in again.'); }
      const data = await analyzeImage(file, token);
      setResults(data);
      addEntry(data);
      setState('results');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }

  function handleViewLessons(subject) { setState('idle'); setResults(null); setShowUpload(false); setShowDailyPractice(false); setShowLessons(true); setLessonsSubject(subject); }
  function handleReset() { setState('idle'); setResults(null); setError(null); setViewingHistoryItem(null); setShowUpload(false); setShowDailyPractice(false); setShowLessons(false); setLessonsSubject(null); }
  function handleSelectHistory(entry) { setViewingHistoryItem(entry); setResults(null); setState('idle'); setHistoryOpen(false); }

  const displayData = viewingHistoryItem || results;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(state !== 'idle' || showUpload || viewingHistoryItem || showDailyPractice || showLessons) && (
              <button onClick={handleReset} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" title="Back to dashboard">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">SnapLearn</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload a homework or exam question to get personalized study recommendations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setHistoryOpen(true)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="History">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <button onClick={() => setProfileOpen(true)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Account Settings">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <button onClick={() => setSettingsOpen(true)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Settings">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        {viewingHistoryItem ? (
          <div className="space-y-6">
            <div className="text-center">
              <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to dashboard
              </button>
              <div><span className="text-xs text-gray-500 dark:text-gray-400">Viewing saved analysis from {new Date(viewingHistoryItem.timestamp).toLocaleString()}</span></div>
            </div>
            <ResultsDisplay data={viewingHistoryItem} onViewLessons={handleViewLessons} getToken={getToken} />
            <div className="text-center pt-4 pb-8"><button onClick={handleReset} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">Back to dashboard</button></div>
          </div>
        ) : (
          <>
            {state === 'idle' && showLessons && (
              <LessonsPage history={history} onClose={() => { setShowLessons(false); setLessonsSubject(null); }} initialSubject={lessonsSubject} />
            )}
            {state === 'idle' && showDailyPractice && !showLessons && (
              <DailyPracticePage history={history} getToken={getToken} onClose={() => setShowDailyPractice(false)} />
            )}
            {state === 'idle' && !showDailyPractice && !showLessons && !showUpload && (
              <DashboardHome history={history} getToken={getToken} onUploadClick={() => setShowUpload(true)} onStartPractice={() => setShowDailyPractice(true)} onStartLessons={() => setShowLessons(true)} />
            )}
            {state === 'idle' && !showDailyPractice && !showLessons && showUpload && (
              <div>
                <div className="text-center mb-4">
                  <button onClick={() => setShowUpload(false)} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to dashboard
                  </button>
                </div>
                <ImageUpload onSubmit={handleSubmit} />
              </div>
            )}
            {state === 'loading' && (
              <div>
                {history.length > 0 && (
                  <div className="text-center mb-4">
                    <button onClick={handleReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">&larr; Back to dashboard</button>
                  </div>
                )}
                <LoadingState />
              </div>
            )}
            {state === 'error' && (
              <div className="text-center py-12 space-y-4">
                <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                <div className="flex justify-center gap-3">
                  {history.length > 0 && (
                    <button onClick={handleReset} className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Back to dashboard</button>
                  )}
                  <button onClick={() => { setState('idle'); setShowUpload(true); setError(null); }} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">Try again</button>
                </div>
              </div>
            )}
            {state === 'results' && displayData && (
              <div className="space-y-6">
                <ResultsDisplay data={displayData} onViewLessons={handleViewLessons} getToken={getToken} />
                <div className="text-center pt-4 pb-8 flex justify-center gap-3">
                  {history.length > 0 && (
                    <button onClick={handleReset} className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">Back to dashboard</button>
                  )}
                  <button onClick={() => { setState('idle'); setResults(null); setShowUpload(true); }} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">Analyze another question</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      {settingsOpen && <Settings theme={theme} onToggleTheme={toggleTheme} onClose={() => setSettingsOpen(false)} />}
      {historyOpen && <HistorySidebar history={history} onSelect={handleSelectHistory} onDelete={deleteEntry} onClearAll={clearHistory} onClose={() => setHistoryOpen(false)} />}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setProfileOpen(false)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 z-10 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                {user?.imageUrl && <img src={user.imageUrl} alt="" className="w-16 h-16 rounded-full ring-2 ring-blue-100 dark:ring-blue-900" />}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.fullName || 'Your Profile'}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '...'}</p>
                </div>
              </div>
              <UserProfile
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    cardBox: 'shadow-none w-full',
                    navbar: 'hidden',
                    pageScrollBox: 'p-0',
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sign-In Page ─── */

function SignInPage({ onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">SnapLearn</span>
          </button>
          <button onClick={onBack} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
            &larr; Back to home
          </button>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome to SnapLearn</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Sign in to start your learning journey</p>
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
}

/* ─── App content router (inside ClerkProvider) ─── */

function AppContent() {
  const { isLoaded, isSignedIn } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  // Already signed in → Dashboard (show spinner only while checking)
  if (isLoaded && isSignedIn) return <Dashboard />;

  // User clicked sign in → show sign-in page (spinner while Clerk loads)
  if (showSignIn) {
    if (!isLoaded) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    return <SignInPage onBack={() => setShowSignIn(false)} />;
  }

  // Landing page renders instantly — no waiting for Clerk
  return <LandingPage onSignIn={() => setShowSignIn(true)} />;
}

/* ─── Root App ─── */

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <AppContent />
    </ClerkProvider>
  );
}
