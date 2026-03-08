import { useState, useEffect } from 'react';
import { ExerciseCard } from './ResultsDisplay';
import { getRecommendations } from '../api/client';

/* ─── Helpers ─── */

function getStudyStats(history) {
  const subjects = {};
  const topics = new Set();
  for (const entry of history) {
    subjects[entry.subject] = (subjects[entry.subject] || 0) + 1;
    topics.add(`${entry.subject}:${entry.topic}`);
  }
  return {
    totalAnalyses: history.length,
    uniqueTopics: topics.size,
    subjectCounts: Object.entries(subjects).sort((a, b) => b[1] - a[1]),
  };
}

function toDateStr(d) {
  return new Date(d).toISOString().split('T')[0];
}

function getStreak(history) {
  if (!history.length) return 0;
  const days = new Set(history.map(e => toDateStr(e.timestamp)));
  const today = toDateStr(new Date());
  if (!days.has(today)) {
    const yesterday = toDateStr(new Date(Date.now() - 86400000));
    if (!days.has(yesterday)) return 0;
  }
  let streak = 0;
  let date = new Date();
  if (!days.has(toDateStr(date))) {
    date = new Date(Date.now() - 86400000);
  }
  while (days.has(toDateStr(date))) {
    streak++;
    date = new Date(date.getTime() - 86400000);
  }
  return streak;
}

function getTodayCount(history) {
  const today = toDateStr(new Date());
  return history.filter(e => toDateStr(e.timestamp) === today).length;
}

function getDailyGoal() {
  return parseInt(localStorage.getItem('dailyGoal') || '5', 10);
}

function setDailyGoal(val) {
  localStorage.setItem('dailyGoal', String(val));
}

/* ─── Components ─── */

function StreakCard({ streak }) {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-4 text-white">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 23c-3.866 0-7-2.686-7-6 0-1.655.924-3.87 2.66-6.38C9.394 8.292 11.052 6.09 12 5c.948 1.09 2.606 3.292 4.34 5.62C18.076 13.13 19 15.345 19 17c0 3.314-3.134 6-7 6zm0-14.5c-1.34 1.732-2.8 3.722-3.87 5.3C7.06 15.56 7 16.6 7 17c0 2.21 2.239 4 5 4s5-1.79 5-4c0-.4-.06-1.44-1.13-3.2-1.07-1.578-2.53-3.568-3.87-5.3z" /></svg>
        <span className="text-sm font-semibold opacity-90">Study Streak</span>
      </div>
      <p className="text-3xl font-extrabold">{streak} <span className="text-base font-medium opacity-80">{streak === 1 ? 'day' : 'days'}</span></p>
      {streak >= 7 && <p className="text-xs opacity-80 mt-1">Amazing! Keep it going!</p>}
      {streak >= 3 && streak < 7 && <p className="text-xs opacity-80 mt-1">Great momentum!</p>}
      {streak > 0 && streak < 3 && <p className="text-xs opacity-80 mt-1">Good start!</p>}
      {streak === 0 && <p className="text-xs opacity-80 mt-1">Analyze a question to start!</p>}
    </div>
  );
}

function DailyGoalCard({ todayCount, goal, onChangeGoal }) {
  const [editing, setEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);
  const progress = Math.min(todayCount / goal, 1);
  const pct = Math.round(progress * 100);
  const done = todayCount >= goal;

  function saveGoal() {
    const val = Math.max(1, Math.min(50, tempGoal));
    onChangeGoal(val);
    setEditing(false);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Today's Goal</span>
        </div>
        {!editing ? (
          <button onClick={() => { setTempGoal(goal); setEditing(true); }} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium cursor-pointer">Edit</button>
        ) : (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              max={50}
              value={tempGoal}
              onChange={e => setTempGoal(parseInt(e.target.value) || 1)}
              className="w-14 px-2 py-0.5 text-xs text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button onClick={saveGoal} className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer">Save</button>
          </div>
        )}
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{todayCount}</span>
            <span className="text-sm text-gray-400">/ {goal}</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {done && (
          <span className="text-green-500 text-lg shrink-0">&#10003;</span>
        )}
      </div>
      {done && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">Goal reached! Great work today!</p>}
      {!done && todayCount > 0 && <p className="text-xs text-gray-400 mt-2">{goal - todayCount} more to reach your goal</p>}
    </div>
  );
}

function DailyPractice({ history, getToken }) {
  const [exercises, setExercises] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  async function loadPractice() {
    setLoading(true);
    setError(null);
    setExercises(null);
    setScore(0);
    setAnswered(0);
    try {
      const token = await getToken();
      const topics = history.map(e => ({
        subject: e.subject,
        topic: e.topic,
        subtopic: e.subtopic,
        difficulty_level: e.difficulty_level,
      }));
      const data = await getRecommendations(topics, token);
      setExercises(data.exercises || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPractice();
  }, []);

  function handleAnswer(isCorrect) {
    setAnswered(a => a + 1);
    if (isCorrect) setScore(s => s + 1);
  }

  const total = exercises?.length || 0;
  const allDone = total > 0 && answered === total;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Daily Practice</h3>
        </div>
        <button
          onClick={loadPractice}
          disabled={loading}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Loading...' : 'New Questions'}
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Practice questions based on everything you've studied</p>

      {/* Score bar */}
      {exercises && answered > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{answered} / {total}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${(answered / total) * 100}%` }} />
            </div>
          </div>
          <div className="text-center px-3 border-l border-gray-200 dark:border-gray-600">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{score}/{answered}</p>
            <p className="text-xs text-gray-400">correct</p>
          </div>
        </div>
      )}

      {allDone && (
        <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${score === total ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : score >= total / 2 ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>
          {score === total ? 'Perfect score! You nailed it!' : score >= total / 2 ? `Nice work! ${score} out of ${total} correct.` : `${score} out of ${total}. Keep practicing!`}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-6">
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
          <button onClick={loadPractice} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium cursor-pointer">Try again</button>
        </div>
      )}

      {exercises && (
        <div className="space-y-3">
          {exercises.map((exercise, i) => (
            <ExerciseCard key={i} exercise={exercise} index={i} onAnswer={handleAnswer} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ entry, getToken }) {
  const [exercises, setExercises] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  async function generatePractice() {
    setLoading(true);
    setError(null);
    setExpanded(true);
    try {
      const token = await getToken();
      const data = await getRecommendations(
        [{ subject: entry.subject, topic: entry.topic, subtopic: entry.subtopic, difficulty_level: entry.difficulty_level }],
        token
      );
      setExercises(data.exercises);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">{entry.subject}</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">{entry.topic}</span>
              {entry.subtopic && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">{entry.subtopic}</span>
              )}
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">{entry.difficulty_level}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">{entry.extracted_text}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{timeAgo(entry.timestamp)}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={generatePractice}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Generating...' : exercises ? 'New Questions' : 'Generate Practice'}
          </button>
          {exercises && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
            >
              {expanded ? 'Hide' : 'Show'} Questions
            </button>
          )}
        </div>
      </div>

      {expanded && loading && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center">
          <div className="h-6 w-6 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
        </div>
      )}

      {expanded && error && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {expanded && exercises && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-3">
          {exercises.map((exercise, i) => (
            <ExerciseCard key={i} exercise={exercise} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Dashboard ─── */

export default function DashboardHome({ history, getToken, onUploadClick }) {
  const stats = getStudyStats(history);
  const streak = getStreak(history);
  const todayCount = getTodayCount(history);
  const [goal, setGoal] = useState(getDailyGoal);

  function handleChangeGoal(val) {
    setDailyGoal(val);
    setGoal(val);
  }

  return (
    <div className="space-y-6">
      {/* Streak + Daily Goal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StreakCard streak={streak} />
        <DailyGoalCard todayCount={todayCount} goal={goal} onChangeGoal={handleChangeGoal} />
      </div>

      {/* Study Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalAnalyses}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Questions analyzed</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.uniqueTopics}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Topics covered</p>
        </div>
      </div>

      {/* Subject Badges */}
      <div className="flex flex-wrap gap-2">
        {stats.subjectCounts.map(([subject, count]) => (
          <span key={subject} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {subject} ({count})
          </span>
        ))}
      </div>

      {/* Daily Practice */}
      <DailyPractice history={history} getToken={getToken} />

      {/* Your Questions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Questions</h3>
        <div className="space-y-3">
          {history.map((entry) => (
            <QuestionCard key={entry.id} entry={entry} getToken={getToken} />
          ))}
        </div>
      </div>

      {/* Upload CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Analyze a new question</h3>
        <p className="text-blue-100 text-sm mb-4">Upload a homework or exam screenshot to get study recommendations</p>
        <button
          onClick={onUploadClick}
          className="px-6 py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Upload image
        </button>
      </div>
    </div>
  );
}
