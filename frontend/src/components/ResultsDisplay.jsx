import { useState } from 'react';
import { SUBJECT_NAMES } from './LessonsPage';
import AiChat from './AiChat';

const SUBJECT_ALIASES = {
  'mathematics': 'Math', 'algebra': 'Math', 'calculus': 'Math', 'geometry': 'Math',
  'trigonometry': 'Math', 'statistics': 'Math', 'arithmetic': 'Math',
  'computer science': 'Computer Science', 'programming': 'Computer Science', 'coding': 'Computer Science',
  'science': 'Biology',
};

function matchSubject(subject) {
  if (!subject) return null;
  const exact = SUBJECT_NAMES.find(s => s.toLowerCase() === subject.toLowerCase());
  if (exact) return exact;
  return SUBJECT_ALIASES[subject.toLowerCase()] || null;
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function normalize(str) {
  return String(str).trim().toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/½/g, '1/2').replace(/⅓/g, '1/3').replace(/⅔/g, '2/3')
    .replace(/¼/g, '1/4').replace(/¾/g, '3/4').replace(/⅕/g, '1/5')
    .replace(/⅖/g, '2/5').replace(/⅗/g, '3/5').replace(/⅘/g, '4/5')
    .replace(/⅙/g, '1/6').replace(/⅚/g, '5/6').replace(/⅛/g, '1/8')
    .replace(/⅜/g, '3/8').replace(/⅝/g, '5/8').replace(/⅞/g, '7/8');
}

function optionMatches(option, correctAnswer) {
  return normalize(option) === normalize(correctAnswer);
}

export function ExerciseCard({ exercise, index, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const isCorrect = selected !== null && optionMatches(selected, exercise.correct_answer);
  const answered = selected !== null;
  const anyOptionMatchesCorrect = (exercise.options || []).some(o => optionMatches(o, exercise.correct_answer));

  function handleSelect(option) {
    if (answered) return;
    setSelected(option);
    if (onAnswer) onAnswer(optionMatches(option, exercise.correct_answer));
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">
        <span className="text-blue-600 dark:text-blue-400 mr-2">{index + 1}.</span>
        {exercise.question}
      </p>
      <div className="space-y-2">
        {(exercise.options || []).map((option, i) => {
          const letter = String.fromCharCode(65 + i);
          const isThis = selected === option;
          const isRight = optionMatches(option, exercise.correct_answer);
          let bg = 'bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-400 dark:hover:border-blue-400 cursor-pointer';
          if (answered && isRight) {
            bg = 'bg-green-50 dark:bg-green-900/40 border-green-500 dark:border-green-400';
          } else if (answered && isThis && !isCorrect) {
            bg = 'bg-red-50 dark:bg-red-900/40 border-red-500 dark:border-red-400';
          } else if (answered) {
            bg = 'bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 opacity-60';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`w-full text-left px-4 py-2.5 rounded-lg border-2 transition-colors ${bg}`}
            >
              <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">{letter}.</span>
              <span className="text-gray-800 dark:text-gray-200">{option}</span>
              {answered && isRight && <span className="float-right text-green-600 dark:text-green-400">&#10003;</span>}
              {answered && isThis && !isCorrect && <span className="float-right text-red-600 dark:text-red-400">&#10007;</span>}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
          <p className="font-semibold mb-1">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
          {!isCorrect && <p className="mb-1"><span className="font-medium">Correct answer:</span> {exercise.correct_answer}</p>}
          {!isCorrect && !anyOptionMatchesCorrect && <p className="text-xs opacity-75 mb-1">(Answer did not match any option exactly)</p>}
          <p>{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default function ResultsDisplay({ data, onViewLessons, getToken }) {
  const matchedSubject = matchSubject(data.subject);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Subject / Topic Badge */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">{data.subject}</span>
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">{data.topic}</span>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">{data.subtopic}</span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">{data.difficulty_level}</span>
      </div>

      {/* Video Lessons Recommendation */}
      {matchedSubject && onViewLessons && (
        <button
          onClick={() => onViewLessons(matchedSubject)}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg hover:from-teal-600 hover:to-emerald-700 transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <div className="text-left">
            <p className="font-semibold">Watch video lessons on {matchedSubject}</p>
            <p className="text-sm text-teal-100">Browse curated lessons and tutorials</p>
          </div>
          <svg className="w-5 h-5 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      )}

      {/* Solution */}
      {data.solution && (
        <Section title="Answer">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{data.solution}</p>
        </Section>
      )}

      {/* Key Concepts */}
      <Section title="Key Concepts">
        <ul className="space-y-1">
          {data.key_concepts.map((concept, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 dark:text-blue-400 mt-1 shrink-0">&#8226;</span>
              {concept}
            </li>
          ))}
        </ul>
      </Section>

      {/* Explanation */}
      <Section title="Explanation">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{data.explanation}</p>
      </Section>

      {/* Resources */}
      <Section title="Recommended Resources">
        <ul className="space-y-2">
          {data.recommended_resources.map((resource, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-500 dark:text-green-400 mt-1 shrink-0">&#9733;</span>
              {typeof resource === 'object' && resource.url ? (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2"
                >
                  {resource.name || resource.url}
                </a>
              ) : (
                <span className="text-gray-700 dark:text-gray-300">{typeof resource === 'string' ? resource : resource.name}</span>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* Practice Exercises */}
      <Section title="Practice Exercises">
        <div className="space-y-3">
          {data.practice_exercises.map((exercise, i) => (
            <ExerciseCard key={i} exercise={exercise} index={i} />
          ))}
        </div>
      </Section>

      {/* Study Path */}
      <Section title="Study Path">
        <ol className="space-y-2">
          {data.study_path.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Common Mistakes */}
      <Section title="Common Mistakes to Avoid">
        <ul className="space-y-1">
          {data.common_mistakes.map((mistake, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-red-500 dark:text-red-400 mt-1 shrink-0">&#9888;</span>
              {mistake}
            </li>
          ))}
        </ul>
      </Section>

      {/* AI Chat */}
      {getToken && (
        <AiChat
          getToken={getToken}
          title="Ask AI about this problem"
          placeholder="e.g. Explain step 2 in more detail..."
          context={[
            `Subject: ${data.subject}`,
            `Topic: ${data.topic}`,
            `Subtopic: ${data.subtopic}`,
            `Difficulty: ${data.difficulty_level}`,
            data.extracted_text && `Problem text: ${data.extracted_text}`,
            data.solution && `Solution: ${data.solution}`,
            data.explanation && `Explanation: ${data.explanation}`,
            data.key_concepts?.length && `Key concepts: ${data.key_concepts.join(', ')}`,
          ].filter(Boolean).join('\n')}
        />
      )}
    </div>
  );
}
