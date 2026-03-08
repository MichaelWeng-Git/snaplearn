function timeAgo(isoString) {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const SUBJECT_COLORS = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-orange-500 to-yellow-400',
  'from-green-500 to-emerald-400',
  'from-rose-500 to-red-400',
  'from-indigo-500 to-violet-400',
];

function colorFor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

export default function HistorySidebar({ history, onSelect, onDelete, onClearAll, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-80 max-w-full h-full bg-white dark:bg-gray-800 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Your Study Journey</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {history.length > 0 && (
            <p className="text-sm text-white/80 mt-1">{history.length} topic{history.length !== 1 ? 's' : ''} explored</p>
          )}
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-4xl mb-3">📚</div>
              <p className="font-medium text-gray-700 dark:text-gray-300">No analyses yet!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload a photo to start your study journey</p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="group relative rounded-xl p-3 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-transparent hover:shadow-md hover:scale-[1.02] transition-all duration-150 bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex items-start gap-3">
                  {/* Color accent bar */}
                  <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${colorFor(entry.subject)}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">
                      {entry.topic}
                    </p>
                    {entry.subtopic && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{entry.subtopic}</p>
                    )}
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colorFor(entry.subject)}`}>
                        {entry.subject}
                      </span>
                      {entry.difficulty_level && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 capitalize">
                          {entry.difficulty_level.replace('_', ' ')}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                        {timeAgo(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 shrink-0 transition-opacity"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClearAll}
              className="w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              Clear all history
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
