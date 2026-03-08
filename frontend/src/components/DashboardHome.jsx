import { useState } from 'react';
import { ExerciseCard } from './ResultsDisplay';
import { getRecommendations } from '../api/client';

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

export default function DashboardHome({ history, getToken, onUploadClick }) {
  const stats = getStudyStats(history);

  return (
    <div className="space-y-6">
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
