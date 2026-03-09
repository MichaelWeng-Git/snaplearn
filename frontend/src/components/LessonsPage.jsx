import { useState } from 'react';

/* ─── Data: subject → grade → videos ─── */

const SUBJECTS = {
  Math: {
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    color: 'from-blue-500 to-indigo-600',
    grades: {
      'Elementary': [
        { id: 'GnTtIBm1x0E', title: 'Addition and Subtraction for Kids', channel: 'Khan Academy Kids' },
        { id: 'JnFBgBYhXMM', title: 'Multiplication Tables (1-12)', channel: 'Jack Hartmann' },
        { id: 'DnFrp2x0OyQ', title: 'Introduction to Fractions', channel: 'Khan Academy' },
        { id: 'SWbIa3bMZGY', title: 'Shapes and Geometry for Kids', channel: 'Homeschool Pop' },
      ],
      'Middle School': [
        { id: 'NybHckSEQBI', title: 'Pre-Algebra Full Course', channel: 'The Organic Chemistry Tutor' },
        { id: 'kpCJyQ2usJ4', title: 'Solving Equations with Variables', channel: 'Khan Academy' },
        { id: 'k7MVueHMY84', title: 'Ratios, Proportions, and Percentages', channel: 'The Organic Chemistry Tutor' },
        { id: 'EGr0d0JEFTM', title: 'Introduction to the Coordinate Plane', channel: 'Khan Academy' },
        { id: 'eP1rQ0GN1as', title: 'Exponents and Order of Operations', channel: 'The Organic Chemistry Tutor' },
      ],
      'High School': [
        { id: 'ppWPuXzMHR0', title: 'Algebra – Full Course for Beginners', channel: 'Khan Academy' },
        { id: 'LwCRRUa8yTU', title: 'Solving Quadratic Equations', channel: 'The Organic Chemistry Tutor' },
        { id: 'mhd9FXYdf4s', title: 'Geometry Course – Full Tutorial', channel: 'freeCodeCamp' },
        { id: 'PUB0TaZ7bhA', title: 'Trigonometry Course', channel: 'The Organic Chemistry Tutor' },
        { id: 'eI4an8aSsgw', title: 'Precalculus Full Course', channel: 'freeCodeCamp' },
        { id: 'fYQ3GRSu8xg', title: 'Logarithms Explained', channel: 'The Organic Chemistry Tutor' },
      ],
      'College / AP': [
        { id: 'WUvTyaaNkzM', title: 'Essence of Calculus – Full Series', channel: '3Blue1Brown' },
        { id: 'rfG8ce4nNh0', title: 'Calculus 1 – Full Course', channel: 'The Organic Chemistry Tutor' },
        { id: 'fNk_zzaMoSs', title: 'Vectors – Essence of Linear Algebra', channel: '3Blue1Brown' },
        { id: 'k7RM-ot2NWY', title: 'Eigenvalues and Eigenvectors', channel: '3Blue1Brown' },
        { id: 'p_di4Zn4wz4', title: 'Differential Equations Overview', channel: '3Blue1Brown' },
        { id: 'xxpc-HPKN28', title: 'Statistics Full Course', channel: 'freeCodeCamp' },
      ],
    },
  },
  Physics: {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'from-amber-500 to-orange-600',
    grades: {
      'Middle School': [
        { id: 'ZM8ECpBuQYE', title: "Newton's Laws of Motion", channel: 'Khan Academy' },
        { id: 'Xzn2ecB4Hzs', title: 'Waves and Electromagnetic Spectrum', channel: 'Khan Academy' },
        { id: 'wXJBMwKGwuY', title: 'States of Matter', channel: 'Peekaboo Kidz' },
      ],
      'High School': [
        { id: 'kKKM8Y-u7ds', title: 'Kinematics – One Dimensional Motion', channel: 'The Organic Chemistry Tutor' },
        { id: 'ZM8ECpBuQYE', title: "Newton's Laws of Motion", channel: 'Khan Academy' },
        { id: 'AEIn3T6nDAo', title: 'Electricity & Circuits', channel: 'The Organic Chemistry Tutor' },
        { id: 'Xzn2ecB4Hzs', title: 'Waves and Electromagnetic Spectrum', channel: 'Khan Academy' },
        { id: 'XQIbn27dOjE', title: 'A Brief History of Quantum Mechanics', channel: 'TED-Ed' },
      ],
      'College / AP': [
        { id: 'kKKM8Y-u7ds', title: 'Kinematics – One Dimensional Motion', channel: 'The Organic Chemistry Tutor' },
        { id: 'AEIn3T6nDAo', title: 'Work, Energy and Power', channel: 'The Organic Chemistry Tutor' },
        { id: 'KnuG1Oa_mZE', title: 'Rotational Dynamics', channel: 'Michel van Biezen' },
        { id: 'r-GCzjiuBpc', title: 'Electric Charge and Coulombs Law', channel: 'The Organic Chemistry Tutor' },
        { id: 's7JLXs5es7I', title: 'Magnetic Fields and Forces', channel: 'Khan Academy' },
        { id: 'p7bzE1E5PMY', title: 'Quantum Physics Made Simple', channel: 'Domain of Science' },
      ],
    },
  },
  Chemistry: {
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    color: 'from-green-500 to-emerald-600',
    grades: {
      'Middle School': [
        { id: 'bka20Q9TN6M', title: 'Introduction to Chemistry', channel: 'The Organic Chemistry Tutor' },
        { id: 'QiiyvzZBKT8', title: 'The Periodic Table Explained', channel: 'TED-Ed' },
        { id: 'wXJBMwKGwuY', title: 'States of Matter', channel: 'Peekaboo Kidz' },
      ],
      'High School': [
        { id: 'bka20Q9TN6M', title: 'Introduction to Chemistry', channel: 'The Organic Chemistry Tutor' },
        { id: 'QiiyvzZBKT8', title: 'The Periodic Table Explained', channel: 'TED-Ed' },
        { id: 'FSyAehMdpyI', title: 'Chemical Bonding', channel: 'Khan Academy' },
        { id: 'lQ6FBA1HM3s', title: 'Balancing Chemical Equations', channel: 'The Organic Chemistry Tutor' },
        { id: 'GqtUWyDR1fg', title: 'Organic Chemistry Basics', channel: 'The Organic Chemistry Tutor' },
      ],
      'College / AP': [
        { id: 'GqtUWyDR1fg', title: 'Organic Chemistry Basics', channel: 'The Organic Chemistry Tutor' },
        { id: 'kv-o-JGddCI', title: 'Functional Groups in Organic Chemistry', channel: 'The Organic Chemistry Tutor' },
        { id: 'VWlJYBjBSak', title: 'SN1 vs SN2 Reactions', channel: 'The Organic Chemistry Tutor' },
        { id: 'HWIzTGyx6dM', title: 'Nomenclature of Organic Compounds', channel: 'The Organic Chemistry Tutor' },
        { id: 'xbJ0nbzt5Kw', title: 'Krebs Cycle Made Simple', channel: 'Ninja Nerd' },
      ],
    },
  },
  Biology: {
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    color: 'from-pink-500 to-rose-600',
    grades: {
      'Elementary': [
        { id: 'Rl4ZR0mz_RU', title: 'The Solar System for Kids', channel: 'Homeschool Pop' },
        { id: 'IQCfmVNMQNc', title: 'Photosynthesis for Kids', channel: 'Homeschool Pop' },
        { id: 'mMkKh4HGbwA', title: 'The Water Cycle', channel: 'National Geographic Kids' },
      ],
      'Middle School': [
        { id: 'QnQe0xW_JY4', title: 'Cell Structure and Function', channel: 'Nucleus Biology' },
        { id: 'GcjgWov7mTM', title: 'DNA, Chromosomes, Genes, and Traits', channel: 'Amoeba Sisters' },
        { id: 'mMkKh4HGbwA', title: 'The Water Cycle Explained', channel: 'National Geographic' },
      ],
      'High School': [
        { id: 'QnQe0xW_JY4', title: 'Biology: Cell Structure', channel: 'Nucleus Biology' },
        { id: 'GcjgWov7mTM', title: 'DNA, Chromosomes, Genes, and Traits', channel: 'Amoeba Sisters' },
        { id: '_zm_DyD6FJ0', title: 'Photosynthesis', channel: 'Khan Academy' },
        { id: 'itsb2SqR-8M', title: 'Human Body Systems', channel: 'Amoeba Sisters' },
        { id: '8kK2zwjRV0M', title: 'Evolution – Natural Selection', channel: 'Khan Academy' },
      ],
      'College / AP': [
        { id: 'H8WJ2KENlK0', title: 'Amino Acids and Proteins', channel: 'Amoeba Sisters' },
        { id: 'itsb2SqR-8M', title: 'Enzyme Function and Structure', channel: 'Amoeba Sisters' },
        { id: 'xbJ0nbzt5Kw', title: 'Krebs Cycle Made Simple', channel: 'Ninja Nerd' },
        { id: '8kK2zwjRV0M', title: 'Evolution – Natural Selection', channel: 'Khan Academy' },
      ],
    },
  },
  'Computer Science': {
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    color: 'from-violet-500 to-purple-600',
    grades: {
      'Middle School': [
        { id: 'O5nskjZ_GoI', title: 'How Computers Work', channel: 'Khan Academy' },
        { id: 'zOjov-2OZ0E', title: 'Introduction to Programming', channel: 'freeCodeCamp' },
        { id: 'lkIFF4maKMU', title: 'Scratch Programming for Beginners', channel: 'CS First' },
      ],
      'High School': [
        { id: 'zOjov-2OZ0E', title: 'Introduction to Programming', channel: 'freeCodeCamp' },
        { id: 'HXV3zeQKqGY', title: 'Big-O Notation in 100 Seconds', channel: 'Fireship' },
        { id: 'pTB0EiLXUC8', title: 'Python Full Course for Beginners', channel: 'Programming with Mosh' },
        { id: 'PkZNo7MFNFg', title: 'Learn JavaScript – Full Course', channel: 'freeCodeCamp' },
      ],
      'College / AP': [
        { id: 'oBt53YbR9Kk', title: 'CS50 – Full Computer Science Course', channel: 'Harvard CS50' },
        { id: '8hly31xKli0', title: 'Algorithms and Data Structures', channel: 'freeCodeCamp' },
        { id: 'RBSGKlAvoiM', title: 'Data Structures – Easy to Advanced', channel: 'freeCodeCamp' },
        { id: 'i_LwzRVP7bg', title: 'Machine Learning for Everybody', channel: 'freeCodeCamp' },
        { id: 'aircAruvnKk', title: 'Neural Networks – 3Blue1Brown', channel: '3Blue1Brown' },
      ],
    },
  },
  English: {
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    color: 'from-rose-400 to-pink-500',
    grades: {
      'Elementary': [
        { id: 'eIHo2ByWCRo', title: 'Parts of Speech for Kids', channel: 'Homeschool Pop' },
        { id: 'R087lYrRpgY', title: 'Reading Comprehension Strategies', channel: 'English with Greg' },
        { id: 'CsN05eZaG-A', title: 'Nouns, Verbs, and Adjectives', channel: 'GrammarSongs by Melissa' },
      ],
      'Middle School': [
        { id: 'Y3imoKVMQCU', title: 'How to Write an Essay', channel: 'Shaun' },
        { id: 'oZhVIRYzLBg', title: 'Grammar: Sentence Structure', channel: 'English Lessons with Adam' },
        { id: 'dT_Oqq8dCOY', title: 'How to Write a Paragraph', channel: 'English with Greg' },
      ],
      'High School': [
        { id: 'MSYw502dJNY', title: 'How to Analyze Literature', channel: 'CrashCourse' },
        { id: 'xBjSV0-oIdU', title: 'Shakespeare – CrashCourse Literature', channel: 'CrashCourse' },
        { id: 'Hhk4N9A0oCA', title: 'How to Write a Great Essay', channel: 'Jordan Peterson' },
      ],
    },
  },
  History: {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'from-yellow-500 to-amber-600',
    grades: {
      'Elementary': [
        { id: 'v9e3reGYJoE', title: 'The Continents for Kids', channel: 'Homeschool Pop' },
        { id: '4_5VxGbakig', title: 'Map Skills for Kids', channel: 'Homeschool Pop' },
        { id: 'FrU_d70T4Pw', title: 'US Government for Kids', channel: 'Homeschool Pop' },
      ],
      'Middle School': [
        { id: 'Yocja_N5s1I', title: 'World History in 18 Minutes', channel: 'Jabzy' },
        { id: 'xuCn8ux2gbs', title: 'The French Revolution', channel: 'OverSimplified' },
        { id: '0auL9JBnOyQ', title: 'Ancient Egypt in 13 Minutes', channel: 'Captivating History' },
        { id: 'rjhIzemLdos', title: 'Ancient Greece – CrashCourse', channel: 'CrashCourse' },
      ],
      'High School': [
        { id: 'DwKPFT-RioU', title: 'WW2 – OverSimplified', channel: 'OverSimplified' },
        { id: 'HdNn5TZu6R8', title: 'The Civil War – OverSimplified', channel: 'OverSimplified' },
        { id: '2yJmKEjBjHg', title: 'American Revolution – OverSimplified', channel: 'OverSimplified' },
        { id: 'rjhIzemLdos', title: 'US Government – CrashCourse', channel: 'CrashCourse' },
      ],
    },
  },
  Economics: {
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    color: 'from-cyan-500 to-teal-600',
    grades: {
      'High School': [
        { id: '3ez10ADR_gM', title: 'Supply and Demand', channel: 'Khan Academy' },
        { id: 'PHe0bXAIuk0', title: 'How The Economic Machine Works', channel: 'Ray Dalio' },
        { id: 'SMmQOGhHNbI', title: 'Microeconomics – Everything You Need', channel: 'Jacob Clifford' },
      ],
      'College / AP': [
        { id: 'PHe0bXAIuk0', title: 'How The Economic Machine Works', channel: 'Ray Dalio' },
        { id: 'SMmQOGhHNbI', title: 'Microeconomics – Everything You Need', channel: 'Jacob Clifford' },
        { id: '3ez10ADR_gM', title: 'Supply and Demand', channel: 'Khan Academy' },
        { id: '7Qtr_vA3Aco', title: 'Macroeconomics Full Course', channel: 'Jacob Clifford' },
      ],
    },
  },
  Psychology: {
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    color: 'from-fuchsia-500 to-pink-600',
    grades: {
      'High School': [
        { id: 'vo4pMVb0R6M', title: 'Intro to Psychology – CrashCourse', channel: 'CrashCourse' },
        { id: 'wuhJ-GkRRQc', title: 'How to Study Psychology', channel: 'Thomas Frank' },
        { id: 'hFV71QPvX2I', title: 'The Growth Mindset', channel: 'Sprouts' },
      ],
      'College / AP': [
        { id: 'vo4pMVb0R6M', title: 'Intro to Psychology – CrashCourse', channel: 'CrashCourse' },
        { id: 'hFV71QPvX2I', title: 'The Growth Mindset', channel: 'Sprouts' },
        { id: 'JiTz2i4VHFw', title: 'Cognitive Behavioral Therapy Explained', channel: 'Psych Hub' },
      ],
    },
  },
  Geography: {
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'from-emerald-400 to-green-500',
    grades: {
      'Middle School': [
        { id: 'hrsxRJdwfM0', title: 'Geography of the World', channel: 'Geography Now' },
        { id: 'x4Af0mfDhzo', title: 'Plate Tectonics Explained', channel: 'TED-Ed' },
        { id: 'M9oGNJQFZ64', title: 'Climate Zones of the Earth', channel: 'Kurzgesagt' },
      ],
    },
  },
  Spanish: {
    icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
    color: 'from-red-400 to-orange-500',
    grades: {
      'High School': [
        { id: 'DAp_v7EH9AA', title: 'Spanish for Beginners', channel: 'Butterfly Spanish' },
        { id: 'TYC1LCkbP74', title: 'Spanish Listening Practice', channel: 'SpanishPod101' },
        { id: 'MIaJiVBNcQ4', title: 'Most Common Spanish Verbs', channel: 'SpanishPod101' },
      ],
    },
  },
  'Art & Music': {
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    color: 'from-fuchsia-400 to-purple-500',
    grades: {
      'High School': [
        { id: 'SO1u6gBJSvg', title: 'Art History in 15 Minutes', channel: 'Perspective' },
        { id: 'rgaTLrZGlk0', title: 'Music Theory in 16 Minutes', channel: 'Andrew Huang' },
        { id: 'QGuVHet7XQ0', title: 'Drawing Fundamentals', channel: 'Proko' },
      ],
    },
  },
  Philosophy: {
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    color: 'from-gray-500 to-slate-600',
    grades: {
      'College / AP': [
        { id: 'BNYJQaZUDrI', title: 'What Is Philosophy? – CrashCourse', channel: 'CrashCourse' },
        { id: '1A_CAkYt3GY', title: 'Existentialism – CrashCourse', channel: 'CrashCourse' },
      ],
    },
  },
  'Health & PE': {
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    color: 'from-red-400 to-pink-500',
    grades: {
      'High School': [
        { id: 'Y6U728AZnV0', title: 'Nutrition Basics – How Food Fuels You', channel: 'TED-Ed' },
        { id: 'wWGulLAa0O0', title: 'Exercise and the Brain', channel: 'TED-Ed' },
      ],
    },
  },
};

function thumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export default function LessonsPage({ history, onClose }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [watching, setWatching] = useState(null);

  const historySubjects = [...new Set(history.map(e => e.subject))];

  // Pick which grade tab to default to when opening a subject
  function openSubject(name) {
    const subj = SUBJECTS[name];
    const gradeKeys = Object.keys(subj.grades);
    setSelectedSubject(name);
    setSelectedGrade(gradeKeys.includes('High School') ? 'High School' : gradeKeys[0]);
  }

  // ── Watch view ──
  if (watching) {
    return (
      <div className="max-w-3xl mx-auto animate-slide-up">
        <button
          onClick={() => setWatching(null)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to {selectedSubject}
        </button>

        <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-xl" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${watching.id}?autoplay=1&rel=0`}
            title={watching.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-4 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{watching.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{watching.channel}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {selectedSubject}
            </span>
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
              {selectedGrade}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Subject detail view (grade tabs + videos) ──
  if (selectedSubject) {
    const subj = SUBJECTS[selectedSubject];
    const gradeKeys = Object.keys(subj.grades);
    const lessons = subj.grades[selectedGrade] || [];

    return (
      <div className="space-y-5 animate-slide-up">
        {/* Back + subject header */}
        <div>
          <button
            onClick={() => { setSelectedSubject(null); setSelectedGrade(null); }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-3 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            All subjects
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subj.color} flex items-center justify-center`}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={subj.icon} />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedSubject}</h2>
          </div>
        </div>

        {/* Grade tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {gradeKeys.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                selectedGrade === g
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Video list */}
        <div className="space-y-2">
          {lessons.map(lesson => (
            <button
              key={lesson.id + lesson.title}
              onClick={() => setWatching(lesson)}
              className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all cursor-pointer group"
            >
              <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                <img src={thumbnailUrl(lesson.id)} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{lesson.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{lesson.channel}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Browse: subject grid ──
  const subjectNames = Object.keys(SUBJECTS);
  // Sort: history subjects first
  const sorted = [...subjectNames].sort((a, b) => {
    const aMatch = historySubjects.some(s => a.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(a.toLowerCase()));
    const bMatch = historySubjects.some(s => b.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(b.toLowerCase()));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Video Lessons</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose a subject to browse lessons by grade level</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sorted.map(name => {
          const subj = SUBJECTS[name];
          const gradeCount = Object.keys(subj.grades).length;
          const videoCount = Object.values(subj.grades).reduce((sum, arr) => sum + arr.length, 0);
          const isFromHistory = historySubjects.some(s =>
            name.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(name.toLowerCase())
          );

          return (
            <button
              key={name}
              onClick={() => openSubject(name)}
              className="relative text-left p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all cursor-pointer group"
            >
              {isFromHistory && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-semibold rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
                  Studied
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subj.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={subj.icon} />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {gradeCount} {gradeCount === 1 ? 'level' : 'levels'} &middot; {videoCount} videos
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
