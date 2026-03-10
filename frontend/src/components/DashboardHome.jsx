import { useState } from 'react';
import AiChat from './AiChat';

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

export default function DashboardHome({ history, getToken, onUploadClick, onStartPractice, onStartLessons }) {
  const stats = getStudyStats(history);
  const streak = getStreak(history);
  const todayCount = getTodayCount(history);
  const [goal, setGoal] = useState(getDailyGoal);

  function handleChangeGoal(val) {
    setDailyGoal(val);
    setGoal(val);
  }

  return (
    <div className="space-y-4">
      {/* Analyze New Question */}
      <button
        onClick={onUploadClick}
        className="w-full bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer border-2 border-dashed border-gray-300 dark:border-white/30 hover:border-blue-400 dark:hover:border-white/60 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 group"
      >
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Analyze New Question</h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Snap a photo of any problem</p>
          </div>
        </div>
      </button>

      {/* Daily Practice */}
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

      {/* Lessons */}
      <button
        onClick={onStartLessons}
        className="w-full text-left bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:shadow-teal-500/25 hover:scale-[1.01] transition-all duration-200 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#x1F3AC;</span>
            <div>
              <h3 className="text-base font-semibold text-white">Video Lessons</h3>
              <p className="text-white/70 text-xs mt-0.5">Browse lessons by subject & grade</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </button>

      {/* AI Chat */}
      <AiChat
        getToken={getToken}
        title="Ask AI a study question"
        placeholder="e.g. Explain the Pythagorean theorem..."
        context={
          history.length > 0
            ? 'Topics the student has been studying recently:\n' +
              history.slice(0, 10).map(e => `- ${e.subject} > ${e.topic} > ${e.subtopic}`).join('\n')
            : ''
        }
      />

      {/* Study Stats + Daily Goal */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalAnalyses}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.uniqueTopics}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Topics</p>
        </div>
      </div>

      <DailyGoalCard todayCount={todayCount} goal={goal} onChangeGoal={handleChangeGoal} />

      {/* Subject Badges */}
      {stats.subjectCounts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stats.subjectCounts.map(([subject, count]) => (
            <span key={subject} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
              {subject} ({count})
            </span>
          ))}
        </div>
      )}

      {/* Recent Questions */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent</h3>
          </div>
          {history.slice(0, 8).map((entry) => (
            <div key={entry.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{questionTitle(entry)}</p>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{timeAgo(entry.timestamp)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Study Streak */}
      <StreakCard streak={streak} />
    </div>
  );
}
