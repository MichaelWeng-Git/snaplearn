import { useState } from 'react';

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

export default function DashboardHome({ history, getToken, onUploadClick, onStartPractice }) {
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

      {/* Daily Practice Launch Card */}
      <button
        onClick={onStartPractice}
        className="w-full text-left bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] transition-all duration-200 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#x26A1;</span>
            <div>
              <h3 className="text-base font-semibold text-white">Daily Practice</h3>
              <p className="text-white/70 text-xs mt-0.5">5 questions</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </button>

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
