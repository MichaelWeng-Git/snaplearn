import { useState, useEffect } from 'react';
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

export default function DashboardHome({ history, getToken, onUploadClick }) {
  const [recommendations, setRecommendations] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);

  const stats = getStudyStats(history);

  async function loadRecommendations() {
    setRecLoading(true);
    setRecError(null);
    try {
      const token = await getToken();
      const topics = history.map(e => ({
        subject: e.subject,
        topic: e.topic,
        subtopic: e.subtopic,
        difficulty_level: e.difficulty_level,
      }));
      const data = await getRecommendations(topics, token);
      setRecommendations(data);
    } catch (err) {
      setRecError(err.message);
    } finally {
      setRecLoading(false);
    }
  }

  useEffect(() => {
    loadRecommendations();
  }, []);

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

      {/* Recommended Practice */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommended Practice</h3>
          <button
            onClick={loadRecommendations}
            disabled={recLoading}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium disabled:opacity-50 cursor-pointer"
          >
            {recLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {recommendations?.summary && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{recommendations.summary}</p>
        )}

        {recLoading && !recommendations && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
          </div>
        )}

        {recError && !recommendations && (
          <div className="text-center py-6">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{recError}</p>
            <button onClick={loadRecommendations} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium cursor-pointer">
              Try again
            </button>
          </div>
        )}

        {recommendations?.exercises && (
          <div className="space-y-3">
            {recommendations.exercises.map((exercise, i) => (
              <ExerciseCard key={i} exercise={exercise} index={i} />
            ))}
          </div>
        )}
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
