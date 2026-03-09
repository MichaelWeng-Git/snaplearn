import { useState, useEffect, useCallback } from 'react';
import { getRecommendations } from '../api/client';

/* ─── Sound effects (Web Audio API) ─── */

function playCorrectSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    // Pleasant ascending chime (C5 → E5 → G5)
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.4);
    });
  } catch (e) { /* audio not supported */ }
}

function playIncorrectSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    // Low descending buzz
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.3);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) { /* audio not supported */ }
}

/* ─── Confetti burst component ─── */

const CONFETTI_COLORS = ['#22c55e', '#eab308', '#3b82f6', '#ec4899', '#f97316', '#8b5cf6', '#14b8a6', '#f43f5e'];

function ConfettiBurst({ originY }) {
  const particles = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * 360 + (Math.random() - 0.5) * 20;
    const dist = 60 + Math.random() * 160;
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * dist;
    const y = Math.sin(rad) * dist - 40; // bias upward
    const size = 5 + Math.random() * 7;
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const rotation = Math.random() * 720 - 360;
    const delay = Math.random() * 0.15;
    const w = Math.random() > 0.5 ? size : size * 2.5;
    return { x, y, w, h: size, color, rotation, delay };
  });

  return (
    <div className="confetti-container">
      {/* Center glow */}
      <div
        className="confetti-glow"
        style={{
          left: '50%', top: `${originY}px`,
          transform: 'translate(-50%, -50%)',
          width: 120, height: 120,
          background: 'radial-gradient(circle, rgba(34,197,94,0.4) 0%, transparent 70%)',
        }}
      />
      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: '50%', top: `${originY}px`,
            width: p.w, height: p.h,
            backgroundColor: p.color,
            '--cx': `${p.x}px`,
            '--cy': `${p.y}px`,
            '--cr': `${p.rotation}deg`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function DailyPracticePage({ history, getToken, onClose }) {
  const [phase, setPhase] = useState('loading'); // loading | playing | complete | error
  const [exercises, setExercises] = useState([]);
  const [current, setCurrent] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [xp, setXp] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
  const [error, setError] = useState(null);
  const [showXpFloat, setShowXpFloat] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOriginY, setConfettiOriginY] = useState(300);

  async function loadPractice() {
    setPhase('loading');
    setExercises([]);
    setCurrent(0);
    setHearts(3);
    setXp(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setError(null);
    try {
      const token = await getToken();
      const topics = history.map(e => ({
        subject: e.subject,
        topic: e.topic,
        subtopic: e.subtopic,
        difficulty_level: e.difficulty_level,
      }));
      const data = await getRecommendations(topics, token);
      const items = data.exercises || [];
      if (items.length === 0) throw new Error('No practice questions available.');
      setExercises(items);
      setPhase('playing');
    } catch (err) {
      setError(err.message);
      setPhase('error');
    }
  }

  useEffect(() => { loadPractice(); }, []);

  const total = exercises.length;
  const exercise = exercises[current];
  const progress = total > 0 ? ((current + (feedback ? 1 : 0)) / total) * 100 : 0;

  function handleSelect(option) {
    if (feedback || selected) return;
    setSelected(option);
    const correct = option === exercise.correct_answer;

    if (correct) {
      setFeedback('correct');
      setScore(s => s + 1);
      setXp(x => x + 20);
      setShowXpFloat(true);
      setTimeout(() => setShowXpFloat(false), 1000);
      // Sound + confetti
      playCorrectSound();
      setConfettiOriginY(Math.min(window.innerHeight * 0.45, 350));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    } else {
      setFeedback('incorrect');
      playIncorrectSound();
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setTimeout(() => setPhase('complete'), 1500);
        return;
      }
    }

    // Auto-advance after 1.5s
    setTimeout(() => {
      if (current + 1 >= total) {
        // Completion bonuses
        setXp(x => {
          let bonus = x + 50; // completion bonus
          if (correct && score + 1 === total) bonus += 100; // perfect bonus
          else if (!correct && score === total - 1) bonus += 0; // not perfect
          return bonus;
        });
        setPhase('complete');
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
        setFeedback(null);
      }
    }, 1500);
  }

  const accuracy = total > 0 ? Math.round((score / Math.min(current + (feedback ? 1 : 0), total)) * 100) : 0;
  const isPerfect = score === total && total > 0;
  const finalXp = xp + (phase === 'complete' && isPerfect ? 100 : 0);

  // ─── Loading ───
  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-slide-up">
        <div className="h-12 w-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mb-6" />
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Preparing your practice...</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Generating questions from your study history</p>
      </div>
    );
  }

  // ─── Error ───
  if (phase === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">{error}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">Back</button>
          <button onClick={loadPractice} className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer">Try Again</button>
        </div>
      </div>
    );
  }

  // ─── Complete ───
  if (phase === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-bounce-in">
        {/* Trophy */}
        <div className="relative mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isPerfect ? 'bg-yellow-100 dark:bg-yellow-900/30' : hearts > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <span className="text-5xl">{isPerfect ? '\u{1F3C6}' : hearts > 0 ? '\u{2B50}' : '\u{1F4AA}'}</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {isPerfect ? 'Perfect Score!' : hearts > 0 ? 'Practice Complete!' : 'Out of Hearts!'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {isPerfect ? 'You nailed every question!' : hearts > 0 ? 'Great effort, keep it up!' : "Don't worry, practice makes perfect!"}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-6 mb-8 w-full max-w-sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{score}/{total}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-500">{xp + (isPerfect ? 100 : 0) + (hearts > 0 && !isPerfect ? 50 : 0)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">XP Earned</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-500">{'❤️'.repeat(hearts)}{'🤍'.repeat(3 - hearts)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hearts Left</p>
          </div>
        </div>

        {/* Accuracy bar */}
        <div className="w-full max-w-sm mb-8">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>Accuracy</span>
            <span>{total > 0 ? Math.round((score / total) * 100) : 0}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${score === total ? 'bg-green-500' : score >= total / 2 ? 'bg-indigo-600' : 'bg-amber-500'}`}
              style={{ width: `${total > 0 ? (score / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={onClose} className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
            Continue
          </button>
          <button onClick={loadPractice} className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer">
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Playing ───
  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar + hearts */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {[0, 1, 2].map(i => (
            <span key={i} className={`text-lg transition-transform duration-300 ${i >= hearts ? 'grayscale opacity-30' : ''}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Question */}
      {exercise && (
        <div key={current} className="animate-slide-in-right">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Question {current + 1} of {total}</span>
            <div className="relative">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{xp} XP</span>
              {showXpFloat && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-green-500 animate-xp-float">+20</span>
              )}
            </div>
          </div>

          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
            {exercise.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {(exercise.options || []).map((option, i) => {
              const letter = String.fromCharCode(65 + i);
              const isThis = selected === option;
              const isRight = option === exercise.correct_answer;

              let classes = 'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium ';
              if (!feedback) {
                classes += 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer';
              } else if (isRight) {
                classes += 'border-green-500 bg-green-50 dark:bg-green-900/30 animate-correct-pulse';
              } else if (isThis && !isRight) {
                classes += 'border-red-500 bg-red-50 dark:bg-red-900/30 animate-incorrect-shake';
              } else {
                classes += 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 opacity-50';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(option)}
                  disabled={!!feedback}
                  className={classes}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      feedback && isRight ? 'bg-green-500 text-white' :
                      feedback && isThis && !isRight ? 'bg-red-500 text-white' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {feedback && isRight ? '\u2713' : feedback && isThis && !isRight ? '\u2717' : letter}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">{option}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback banner */}
      {feedback && (
        <div className={`mt-6 rounded-xl p-4 animate-slide-up ${
          feedback === 'correct'
            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{feedback === 'correct' ? '\u2705' : '\u274C'}</span>
            <span className={`font-bold ${feedback === 'correct' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {feedback === 'correct' ? 'Correct! +20 XP' : 'Incorrect'}
            </span>
          </div>
          {exercise.explanation && (
            <p className={`text-sm ${feedback === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {exercise.explanation}
            </p>
          )}
        </div>
      )}

      {/* Confetti explosion */}
      {showConfetti && <ConfettiBurst originY={confettiOriginY} />}
    </div>
  );
}
