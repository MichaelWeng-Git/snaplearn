import { useState, useRef, useEffect } from 'react';
import { sendChat } from '../api/client';
import MathText from './MathText';

export default function AiChat({ context, getToken, placeholder = 'Ask a question...', title = 'Ask AI', subtitle = 'Ask follow-up questions' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const token = await getToken();
      const { reply } = await sendChat(updated, context, token);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden">
      {/* Header — gradient card matching Daily Practice / Video Lessons style */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.01] transition-all duration-200 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#x1F4AC;</span>
            <div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-white/60 group-hover:text-white transition-all duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="bg-white dark:bg-gray-800 border border-t-0 border-gray-100 dark:border-gray-700 rounded-b-2xl -mt-4 pt-4">
          {/* Messages */}
          <div ref={scrollRef} className="max-h-80 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && !loading && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                Ask a question to get started
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm whitespace-pre-wrap bg-amber-500 text-white">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 chat-ai-msg">
                    <MathText>{msg.content}</MathText>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 pb-2">
              <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 dark:border-gray-700 p-3 flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="flex-1 resize-none rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
