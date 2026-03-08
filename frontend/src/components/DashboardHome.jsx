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

/* ─── Helpers ─── */

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function questionTitle(entry) {
  const parts = [entry.subject, entry.topic];
  if (entry.subtopic) parts.push(entry.subtopic);
  return parts.join(' \u2022 ');
}

/* ─── Main Dashboard ─── */

const card = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700';

export default function DashboardHome({ history, getToken, onUploadClick, onStartPractice }) {
  const stats = getStudyStats(history);
  const streak = getStreak(history);
  const todayCount = getTodayCount(history);
  const [goal, setGoal] = useState(getDailyGoal);
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);
  const goalDone = todayCount >= goal;
  const goalPct = Math.round(Math.min(todayCount / goal, 1) * 100);

  function saveGoal() {
    const val = Math.max(1, Math.min(50, tempGoal));
    setDailyGoal(val);
    setGoal(val);
    setEditingGoal(false);
  }

  return (
    <div className="space-y-5">
      {/* ── Actions ── */}
      <button
        onClick={onUploadClick}
        className={`${card} w-full text-left p-5 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors group`}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Analyze New Question</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Upload a photo of any problem</p>
          </div>
          <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </button>

      <button
        onClick={onStartPractice}
        className={`${card} w-full text-left p-5 cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors group`}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Daily Practice</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">5 questions from your topics</p>
          </div>
          <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </button>

      {/* ── Progress ── */}
      <div className={`${card} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Today's Progress</h3>
          {!editingGoal ? (
            <button onClick={() => { setTempGoal(goal); setEditingGoal(true); }} className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer">Edit goal</button>
          ) : (
            <div className="flex items-center gap-1.5">
              <input type="number" min={1} max={50} value={tempGoal} onChange={e => setTempGoal(parseInt(e.target.value) || 1)} className="w-14 px-2 py-0.5 text-xs text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              <button onClick={saveGoal} className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer">Save</button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${goalDone ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${goalPct}%` }} />
            </div>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 shrink-0">{todayCount}/{goal}</span>
        </div>
        {goalDone && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">Goal reached!</p>}
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`${card} p-4 text-center`}>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.totalAnalyses}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Questions</p>
        </div>
        <div className={`${card} p-4 text-center`}>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.uniqueTopics}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Topics</p>
        </div>
        <div className={`${card} p-4 text-center`}>
          <p className="text-xl font-bold text-orange-500">{streak}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Day streak</p>
        </div>
      </div>

      {/* ── Recent ── */}
      <div className={`${card} divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden`}>
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent</h3>
        </div>
        {history.slice(0, 6).map((entry) => (
          <div key={entry.id} className="px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{questionTitle(entry)}</p>
            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{timeAgo(entry.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
