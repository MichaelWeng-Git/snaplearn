import { useState } from 'react';

/* ─── Grade levels ─── */

const GRADES = [
  { key: 'elementary', label: 'Elementary', desc: 'K–5' },
  { key: 'middle', label: 'Middle School', desc: '6–8' },
  { key: 'high', label: 'High School', desc: '9–12' },
  { key: 'college', label: 'College / AP', desc: 'Advanced' },
];

/* ─── Comprehensive lesson data by grade → subject → videos ─── */

const LESSONS = {
  elementary: {
    Math: [
      { id: 'GnTtIBm1x0E', title: 'Addition and Subtraction for Kids', channel: 'Khan Academy Kids' },
      { id: 'JnFBgBYhXMM', title: 'Multiplication Tables (1-12)', channel: 'Jack Hartmann' },
      { id: 'DnFrp2x0OyQ', title: 'Introduction to Fractions', channel: 'Khan Academy' },
      { id: 'SWbIa3bMZGY', title: 'Shapes and Geometry for Kids', channel: 'Homeschool Pop' },
    ],
    Science: [
      { id: 'Rl4ZR0mz_RU', title: 'The Solar System for Kids', channel: 'Homeschool Pop' },
      { id: 'IQCfmVNMQNc', title: 'Photosynthesis for Kids', channel: 'Homeschool Pop' },
      { id: 'wXJBMwKGwuY', title: 'States of Matter – Solid, Liquid, Gas', channel: 'Peekaboo Kidz' },
      { id: 'mMkKh4HGbwA', title: 'The Water Cycle', channel: 'National Geographic Kids' },
    ],
    'English & Reading': [
      { id: 'eIHo2ByWCRo', title: 'Parts of Speech for Kids', channel: 'Homeschool Pop' },
      { id: 'R087lYrRpgY', title: 'Reading Comprehension Strategies', channel: 'English with Greg' },
      { id: 'CsN05eZaG-A', title: 'Nouns, Verbs, and Adjectives', channel: 'GrammarSongs by Melissa' },
    ],
    'Social Studies': [
      { id: 'v9e3reGYJoE', title: 'The Continents for Kids', channel: 'Homeschool Pop' },
      { id: '4_5VxGbakig', title: 'Map Skills for Kids', channel: 'Homeschool Pop' },
      { id: 'FrU_d70T4Pw', title: 'US Government for Kids', channel: 'Homeschool Pop' },
    ],
  },

  middle: {
    Math: [
      { id: 'NybHckSEQBI', title: 'Pre-Algebra Full Course', channel: 'The Organic Chemistry Tutor' },
      { id: 'kpCJyQ2usJ4', title: 'Solving Equations with Variables on Both Sides', channel: 'Khan Academy' },
      { id: 'k7MVueHMY84', title: 'Ratios, Proportions, and Percentages', channel: 'The Organic Chemistry Tutor' },
      { id: 'EGr0d0JEFTM', title: 'Introduction to the Coordinate Plane', channel: 'Khan Academy' },
      { id: 'eP1rQ0GN1as', title: 'Exponents and Order of Operations', channel: 'The Organic Chemistry Tutor' },
    ],
    Science: [
      { id: 'QnQe0xW_JY4', title: 'Cell Structure and Function', channel: 'Nucleus Biology' },
      { id: 'GcjgWov7mTM', title: 'DNA, Chromosomes, Genes, and Traits', channel: 'Amoeba Sisters' },
      { id: 'mMkKh4HGbwA', title: 'The Water Cycle Explained', channel: 'National Geographic' },
      { id: 'wXJBMwKGwuY', title: 'States of Matter', channel: 'Peekaboo Kidz' },
    ],
    'English & Writing': [
      { id: 'Y3imoKVMQCU', title: 'How to Write an Essay', channel: 'Shaun' },
      { id: 'oZhVIRYzLBg', title: 'Grammar: Sentence Structure', channel: 'English Lessons with Adam' },
      { id: 'dT_Oqq8dCOY', title: 'How to Write a Paragraph', channel: 'English with Greg' },
    ],
    'World History': [
      { id: 'Yocja_N5s1I', title: 'World History in 18 Minutes', channel: 'Jabzy' },
      { id: 'xuCn8ux2gbs', title: 'The French Revolution', channel: 'OverSimplified' },
      { id: '0auL9JBnOyQ', title: 'Ancient Egypt in 13 Minutes', channel: 'Captivating History' },
      { id: 'rjhIzemLdos', title: 'Ancient Greece – CrashCourse', channel: 'CrashCourse' },
    ],
    Geography: [
      { id: 'hrsxRJdwfM0', title: 'Geography of the World', channel: 'Geography Now' },
      { id: 'x4Af0mfDhzo', title: 'Plate Tectonics Explained', channel: 'TED-Ed' },
      { id: 'M9oGNJQFZ64', title: 'Climate Zones of the Earth', channel: 'Kurzgesagt' },
    ],
    'Computer Basics': [
      { id: 'O5nskjZ_GoI', title: 'How Computers Work', channel: 'Khan Academy' },
      { id: 'zOjov-2OZ0E', title: 'Introduction to Programming', channel: 'freeCodeCamp' },
      { id: 'lkIFF4maKMU', title: 'Scratch Programming for Beginners', channel: 'CS First' },
    ],
  },

  high: {
    'Algebra': [
      { id: 'ppWPuXzMHR0', title: 'Algebra – Full Course for Beginners', channel: 'Khan Academy' },
      { id: 'LwCRRUa8yTU', title: 'Solving Quadratic Equations', channel: 'The Organic Chemistry Tutor' },
      { id: '9Ek61w1LxSc', title: 'Functions and Graphs', channel: 'Khan Academy' },
      { id: 'fYQ3GRSu8xg', title: 'Logarithms Explained', channel: 'The Organic Chemistry Tutor' },
    ],
    'Geometry & Trigonometry': [
      { id: 'mhd9FXYdf4s', title: 'Geometry Course – Full Tutorial', channel: 'freeCodeCamp' },
      { id: 'PUB0TaZ7bhA', title: 'Trigonometry Course', channel: 'The Organic Chemistry Tutor' },
      { id: 'yBw67Fb31Cs', title: 'Unit Circle – Everything You Need to Know', channel: 'The Organic Chemistry Tutor' },
    ],
    'Pre-Calculus': [
      { id: 'eI4an8aSsgw', title: 'Precalculus Full Course', channel: 'freeCodeCamp' },
      { id: 'HfACrKJ_Y2w', title: 'Calculus at a Fifth Grade Level', channel: 'Lukey B. The Physics G' },
      { id: 'YG15m2VwSjA', title: 'How to Learn Math Fast', channel: 'The Organic Chemistry Tutor' },
    ],
    Physics: [
      { id: 'ZM8ECpBuQYE', title: "Newton's Laws of Motion", channel: 'Khan Academy' },
      { id: 'AEIn3T6nDAo', title: 'Electricity & Circuits', channel: 'The Organic Chemistry Tutor' },
      { id: 'Xzn2ecB4Hzs', title: 'Waves and Electromagnetic Spectrum', channel: 'Khan Academy' },
      { id: 'XQIbn27dOjE', title: 'A Brief History of Quantum Mechanics', channel: 'TED-Ed' },
      { id: 'kKKM8Y-u7ds', title: 'Kinematics – One Dimensional Motion', channel: 'The Organic Chemistry Tutor' },
    ],
    Chemistry: [
      { id: 'bka20Q9TN6M', title: 'Introduction to Chemistry', channel: 'The Organic Chemistry Tutor' },
      { id: 'QiiyvzZBKT8', title: 'The Periodic Table Explained', channel: 'TED-Ed' },
      { id: 'FSyAehMdpyI', title: 'Chemical Bonding', channel: 'Khan Academy' },
      { id: 'lQ6FBA1HM3s', title: 'Balancing Chemical Equations', channel: 'The Organic Chemistry Tutor' },
      { id: 'GqtUWyDR1fg', title: 'Organic Chemistry Basics', channel: 'The Organic Chemistry Tutor' },
    ],
    Biology: [
      { id: 'QnQe0xW_JY4', title: 'Biology: Cell Structure', channel: 'Nucleus Biology' },
      { id: 'GcjgWov7mTM', title: 'DNA, Chromosomes, Genes, and Traits', channel: 'Amoeba Sisters' },
      { id: '_zm_DyD6FJ0', title: 'Photosynthesis', channel: 'Khan Academy' },
      { id: 'itsb2SqR-8M', title: 'Human Body Systems', channel: 'Amoeba Sisters' },
      { id: '8kK2zwjRV0M', title: 'Evolution – Natural Selection', channel: 'Khan Academy' },
    ],
    'Computer Science': [
      { id: 'zOjov-2OZ0E', title: 'Introduction to Programming', channel: 'freeCodeCamp' },
      { id: 'HXV3zeQKqGY', title: 'Big-O Notation in 100 Seconds', channel: 'Fireship' },
      { id: 'pTB0EiLXUC8', title: 'Python Full Course for Beginners', channel: 'Programming with Mosh' },
      { id: 'PkZNo7MFNFg', title: 'Learn JavaScript – Full Course', channel: 'freeCodeCamp' },
    ],
    'US History': [
      { id: 'DwKPFT-RioU', title: 'WW2 – OverSimplified', channel: 'OverSimplified' },
      { id: 'HdNn5TZu6R8', title: 'The Civil War – OverSimplified', channel: 'OverSimplified' },
      { id: '2yJmKEjBjHg', title: 'American Revolution – OverSimplified', channel: 'OverSimplified' },
      { id: 'rjhIzemLdos', title: 'US Government – CrashCourse', channel: 'CrashCourse' },
    ],
    Economics: [
      { id: '3ez10ADR_gM', title: 'Supply and Demand', channel: 'Khan Academy' },
      { id: 'PHe0bXAIuk0', title: 'How The Economic Machine Works', channel: 'Ray Dalio' },
      { id: 'SMmQOGhHNbI', title: 'Microeconomics – Everything You Need to Know', channel: 'Jacob Clifford' },
    ],
    Psychology: [
      { id: 'vo4pMVb0R6M', title: 'Intro to Psychology – CrashCourse', channel: 'CrashCourse' },
      { id: 'wuhJ-GkRRQc', title: 'How to Study Psychology', channel: 'Thomas Frank' },
      { id: 'hFV71QPvX2I', title: 'The Growth Mindset', channel: 'Sprouts' },
    ],
    'English Literature': [
      { id: 'MSYw502dJNY', title: 'How to Analyze Literature', channel: 'CrashCourse' },
      { id: 'xBjSV0-oIdU', title: 'Shakespeare – CrashCourse Literature', channel: 'CrashCourse' },
      { id: 'Hhk4N9A0oCA', title: 'How to Write a Great Essay', channel: 'Jordan Peterson' },
    ],
    'Spanish': [
      { id: 'DAp_v7EH9AA', title: 'Spanish for Beginners', channel: 'Butterfly Spanish' },
      { id: 'TYC1LCkbP74', title: 'Spanish Listening Practice', channel: 'SpanishPod101' },
      { id: 'MIaJiVBNcQ4', title: 'Most Common Spanish Verbs', channel: 'SpanishPod101' },
    ],
    'Art & Music': [
      { id: 'SO1u6gBJSvg', title: 'Art History in 15 Minutes', channel: 'Perspective' },
      { id: 'rgaTLrZGlk0', title: 'Music Theory in 16 Minutes', channel: 'Andrew Huang' },
      { id: 'QGuVHet7XQ0', title: 'Drawing Fundamentals', channel: 'Proko' },
    ],
    'Health & PE': [
      { id: 'Y6U728AZnV0', title: 'Nutrition Basics – How Food Fuels You', channel: 'TED-Ed' },
      { id: 'wWGulLAa0O0', title: 'Exercise and the Brain', channel: 'TED-Ed' },
    ],
  },

  college: {
    Calculus: [
      { id: 'WUvTyaaNkzM', title: 'Essence of Calculus – Full Series', channel: '3Blue1Brown' },
      { id: 'rfG8ce4nNh0', title: 'Calculus 1 – Full Course', channel: 'The Organic Chemistry Tutor' },
      { id: 'HfACrKJ_Y2w', title: 'Calculus Explained Intuitively', channel: 'Lukey B. The Physics G' },
      { id: '7gigNsz4Oe8', title: 'Multivariable Calculus', channel: 'Khan Academy' },
    ],
    'Linear Algebra': [
      { id: 'fNk_zzaMoSs', title: 'Vectors – Essence of Linear Algebra Ch.1', channel: '3Blue1Brown' },
      { id: 'kYB8IZa5AuE', title: 'Linear Combinations and Span', channel: '3Blue1Brown' },
      { id: 'k7RM-ot2NWY', title: 'Eigenvalues and Eigenvectors', channel: '3Blue1Brown' },
      { id: 'PFDu9oVAE1g', title: 'Linear Algebra Full Course', channel: 'Dr. Trefor Bazett' },
    ],
    'Differential Equations': [
      { id: 'p_di4Zn4wz4', title: 'Differential Equations Overview', channel: '3Blue1Brown' },
      { id: 'xf-3ATzFyKA', title: 'Differential Equations Full Course', channel: 'The Organic Chemistry Tutor' },
    ],
    Statistics: [
      { id: 'xxpc-HPKN28', title: 'Statistics Full Course for Beginners', channel: 'freeCodeCamp' },
      { id: 'zouPoc49xbk', title: 'Stats: Probability Fundamentals', channel: 'Khan Academy' },
      { id: 'XZo4xyJXCak', title: 'Central Limit Theorem Explained', channel: 'StatQuest' },
      { id: 'Vfo5le26IhY', title: 'Hypothesis Testing', channel: 'StatQuest' },
    ],
    'Physics (Mechanics)': [
      { id: 'kKKM8Y-u7ds', title: 'Kinematics – One Dimensional Motion', channel: 'The Organic Chemistry Tutor' },
      { id: 'ZM8ECpBuQYE', title: "Newton's Laws of Motion", channel: 'Khan Academy' },
      { id: 'AEIn3T6nDAo', title: 'Work, Energy and Power', channel: 'The Organic Chemistry Tutor' },
      { id: 'KnuG1Oa_mZE', title: 'Rotational Dynamics', channel: 'Michel van Biezen' },
    ],
    'Physics (E&M)': [
      { id: 'r-GCzjiuBpc', title: 'Electric Charge and Coulombs Law', channel: 'The Organic Chemistry Tutor' },
      { id: 's7JLXs5es7I', title: 'Magnetic Fields and Forces', channel: 'Khan Academy' },
      { id: 'p7bzE1E5PMY', title: 'Quantum Physics Made Simple', channel: 'Domain of Science' },
    ],
    'Organic Chemistry': [
      { id: 'GqtUWyDR1fg', title: 'Organic Chemistry Basics', channel: 'The Organic Chemistry Tutor' },
      { id: 'kv-o-JGddCI', title: 'Functional Groups in Organic Chemistry', channel: 'The Organic Chemistry Tutor' },
      { id: 'VWlJYBjBSak', title: 'SN1 vs SN2 Reactions', channel: 'The Organic Chemistry Tutor' },
      { id: 'HWIzTGyx6dM', title: 'Nomenclature of Organic Compounds', channel: 'The Organic Chemistry Tutor' },
    ],
    Biochemistry: [
      { id: 'H8WJ2KENlK0', title: 'Amino Acids and Proteins', channel: 'Amoeba Sisters' },
      { id: 'itsb2SqR-8M', title: 'Enzyme Function and Structure', channel: 'Amoeba Sisters' },
      { id: 'xbJ0nbzt5Kw', title: 'Krebs Cycle Made Simple', channel: 'Ninja Nerd' },
    ],
    'Computer Science': [
      { id: 'oBt53YbR9Kk', title: 'CS50 – Full Computer Science Course', channel: 'Harvard CS50' },
      { id: '8hly31xKli0', title: 'Algorithms and Data Structures', channel: 'freeCodeCamp' },
      { id: 'RBSGKlAvoiM', title: 'Data Structures – Easy to Advanced', channel: 'freeCodeCamp' },
      { id: 'HXV3zeQKqGY', title: 'Big-O Notation in 100 Seconds', channel: 'Fireship' },
      { id: 'pTB0EiLXUC8', title: 'Python Full Course', channel: 'Programming with Mosh' },
    ],
    'Machine Learning': [
      { id: 'i_LwzRVP7bg', title: 'Machine Learning for Everybody', channel: 'freeCodeCamp' },
      { id: 'aircAruvnKk', title: 'Neural Networks – 3Blue1Brown', channel: '3Blue1Brown' },
      { id: 'GwIo3gDZCVQ', title: 'TensorFlow 2.0 Complete Course', channel: 'freeCodeCamp' },
    ],
    Economics: [
      { id: 'PHe0bXAIuk0', title: 'How The Economic Machine Works', channel: 'Ray Dalio' },
      { id: 'SMmQOGhHNbI', title: 'Microeconomics – Everything You Need', channel: 'Jacob Clifford' },
      { id: '3ez10ADR_gM', title: 'Supply and Demand', channel: 'Khan Academy' },
      { id: '7Qtr_vA3Aco', title: 'Macroeconomics Full Course', channel: 'Jacob Clifford' },
    ],
    Psychology: [
      { id: 'vo4pMVb0R6M', title: 'Intro to Psychology – CrashCourse', channel: 'CrashCourse' },
      { id: 'hFV71QPvX2I', title: 'The Growth Mindset', channel: 'Sprouts' },
      { id: 'JiTz2i4VHFw', title: 'Cognitive Behavioral Therapy Explained', channel: 'Psych Hub' },
    ],
    'Philosophy': [
      { id: 'BNYJQaZUDrI', title: 'What Is Philosophy? – CrashCourse', channel: 'CrashCourse' },
      { id: '1A_CAkYt3GY', title: 'Existentialism – CrashCourse', channel: 'CrashCourse' },
    ],
  },
};

/* ─── Styling maps ─── */

const SUBJECT_ICONS = {
  Math: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  Algebra: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  Calculus: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'Linear Algebra': 'M4 6h16M4 12h16M4 18h16',
  'Differential Equations': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  Statistics: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'Geometry & Trigonometry': 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5',
  'Pre-Calculus': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  Physics: 'M13 10V3L4 14h7v7l9-11h-7z',
  'Physics (Mechanics)': 'M13 10V3L4 14h7v7l9-11h-7z',
  'Physics (E&M)': 'M13 10V3L4 14h7v7l9-11h-7z',
  Chemistry: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  'Organic Chemistry': 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  Biochemistry: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  Biology: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  Science: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'Computer Science': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  'Computer Basics': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  'Machine Learning': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  Economics: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  'English & Reading': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'English & Writing': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'English Literature': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'Social Studies': 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'World History': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'US History': 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
  Geography: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  Psychology: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  Philosophy: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  Spanish: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
  'Art & Music': 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  'Health & PE': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
};

const SUBJECT_COLORS = {
  Math: 'from-blue-500 to-indigo-600',
  Algebra: 'from-blue-500 to-indigo-600',
  Calculus: 'from-blue-600 to-violet-600',
  'Linear Algebra': 'from-indigo-500 to-blue-600',
  'Differential Equations': 'from-blue-500 to-cyan-500',
  Statistics: 'from-sky-500 to-blue-600',
  'Geometry & Trigonometry': 'from-indigo-400 to-blue-500',
  'Pre-Calculus': 'from-blue-400 to-indigo-500',
  Physics: 'from-amber-500 to-orange-600',
  'Physics (Mechanics)': 'from-amber-500 to-orange-600',
  'Physics (E&M)': 'from-orange-500 to-red-500',
  Chemistry: 'from-green-500 to-emerald-600',
  'Organic Chemistry': 'from-emerald-500 to-teal-600',
  Biochemistry: 'from-teal-500 to-green-600',
  Biology: 'from-pink-500 to-rose-600',
  Science: 'from-yellow-500 to-orange-500',
  'Computer Science': 'from-violet-500 to-purple-600',
  'Computer Basics': 'from-violet-400 to-purple-500',
  'Machine Learning': 'from-purple-500 to-fuchsia-600',
  Economics: 'from-cyan-500 to-teal-600',
  'English & Reading': 'from-rose-400 to-pink-500',
  'English & Writing': 'from-rose-500 to-pink-600',
  'English Literature': 'from-pink-400 to-rose-500',
  'Social Studies': 'from-lime-500 to-green-600',
  'World History': 'from-yellow-500 to-amber-600',
  'US History': 'from-red-500 to-rose-600',
  Geography: 'from-emerald-400 to-green-500',
  Psychology: 'from-fuchsia-500 to-pink-600',
  Philosophy: 'from-gray-500 to-slate-600',
  Spanish: 'from-red-400 to-orange-500',
  'Art & Music': 'from-fuchsia-400 to-purple-500',
  'Health & PE': 'from-red-400 to-pink-500',
};

function thumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export default function LessonsPage({ history, onClose }) {
  const [grade, setGrade] = useState('high');
  const [watching, setWatching] = useState(null);

  const historySubjects = [...new Set(history.map(e => e.subject))];
  const subjects = LESSONS[grade] || {};
  const subjectNames = Object.keys(subjects);

  // Watch view
  if (watching) {
    return (
      <div className="max-w-3xl mx-auto animate-slide-up">
        <button
          onClick={() => setWatching(null)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to lessons
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
          <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {watching.subject}
          </span>
        </div>
      </div>
    );
  }

  // Browse view
  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Video Lessons</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse curated lessons by grade level and subject</p>
      </div>

      {/* Grade level tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {GRADES.map(g => (
          <button
            key={g.key}
            onClick={() => setGrade(g.key)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              grade === g.key
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600'
            }`}
          >
            {g.label} <span className="opacity-60 text-xs">{g.desc}</span>
          </button>
        ))}
      </div>

      {/* Subjects & lessons */}
      {subjectNames.map(subject => {
        const lessons = subjects[subject];
        const icon = SUBJECT_ICONS[subject] || 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
        const gradient = SUBJECT_COLORS[subject] || 'from-gray-500 to-gray-600';
        const isFromHistory = historySubjects.some(s =>
          subject.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(subject.toLowerCase())
        );

        return (
          <div key={subject}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{subject}</h3>
              {isFromHistory && (
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
                  From your studies
                </span>
              )}
            </div>

            <div className="space-y-2">
              {lessons.map(lesson => (
                <button
                  key={lesson.id}
                  onClick={() => setWatching({ ...lesson, subject })}
                  className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all cursor-pointer group"
                >
                  <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                    <img
                      src={thumbnailUrl(lesson.id)}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
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
      })}
    </div>
  );
}
