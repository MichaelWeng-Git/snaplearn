import { useState, useEffect } from 'react';

/* ─── Data: subject → { icon, color, grades: { grade → units[] } } ─── */

const SUBJECTS = {
  Math: {
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    color: 'from-blue-500 to-indigo-600',
    grades: {
      'Elementary': [
        { unit: 'Arithmetic', desc: 'Addition, subtraction, multiplication & division', videos: [
          { id: 'GnTtIBm1x0E', title: 'Addition and Subtraction for Kids', channel: 'Khan Academy Kids' },
          { id: 'JnFBgBYhXMM', title: 'Multiplication Tables (1-12)', channel: 'Jack Hartmann' },
          { id: 'YBbBbY4T-Lk', title: 'Division for Kids', channel: 'Homeschool Pop' },
          { id: 'ZvHm0KNOJoc', title: 'Long Division Made Easy', channel: 'Math Antics' },
        ]},
        { unit: 'Fractions & Decimals', desc: 'Understanding parts of a whole', videos: [
          { id: 'DnFrp2x0OyQ', title: 'Introduction to Fractions', channel: 'Khan Academy' },
          { id: 'n0FZhQ_GkKw', title: 'Comparing Fractions', channel: 'Khan Academy' },
          { id: '5ZGtIk3rODY', title: 'Decimals for Kids', channel: 'Math Antics' },
        ]},
        { unit: 'Geometry Basics', desc: 'Shapes, area, and perimeter', videos: [
          { id: 'SWbIa3bMZGY', title: 'Shapes and Geometry for Kids', channel: 'Homeschool Pop' },
          { id: 'mLeNaZcy-hE', title: 'Perimeter and Area', channel: 'Math Antics' },
          { id: 'LoaBd-sPkVE', title: 'Angles for Kids', channel: 'Homeschool Pop' },
        ]},
        { unit: 'Word Problems', desc: 'Applying math to real-world situations', videos: [
          { id: 'uf7LWJwg0aU', title: 'Word Problems – Addition and Subtraction', channel: 'Khan Academy' },
          { id: 'KGMf314LUc0', title: 'Multiplication Word Problems', channel: 'Khan Academy' },
        ]},
      ],
      'Middle School': [
        { unit: 'Pre-Algebra', desc: 'Variables, expressions & equations', videos: [
          { id: 'NybHckSEQBI', title: 'Pre-Algebra Full Course', channel: 'The Organic Chemistry Tutor' },
          { id: 'kpCJyQ2usJ4', title: 'Solving Equations with Variables', channel: 'Khan Academy' },
          { id: 'eP1rQ0GN1as', title: 'Exponents and Order of Operations', channel: 'The Organic Chemistry Tutor' },
          { id: 'Tm98lnrlbMA', title: 'Distributive Property Explained', channel: 'Math Antics' },
        ]},
        { unit: 'Ratios & Proportions', desc: 'Comparing quantities and percentages', videos: [
          { id: 'k7MVueHMY84', title: 'Ratios, Proportions, and Percentages', channel: 'The Organic Chemistry Tutor' },
          { id: 'USmit5zUGas', title: 'Proportions – Basic Introduction', channel: 'The Organic Chemistry Tutor' },
          { id: 'JeVSmq1Nrpw', title: 'Percent Word Problems', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Integers & Negative Numbers', desc: 'Working with positive and negative values', videos: [
          { id: 'ufa3-S9x0Cg', title: 'Adding & Subtracting Negative Numbers', channel: 'Khan Academy' },
          { id: 'QGfdhqzBDNY', title: 'Multiplying Negative Numbers', channel: 'Khan Academy' },
        ]},
        { unit: 'Coordinate Geometry', desc: 'Graphing on the coordinate plane', videos: [
          { id: 'EGr0d0JEFTM', title: 'Introduction to the Coordinate Plane', channel: 'Khan Academy' },
          { id: '5C5_wAENLOA', title: 'Slope and Y-Intercept', channel: 'Khan Academy' },
          { id: 'rgvysb9emcQ', title: 'Graphing Linear Equations', channel: 'The Organic Chemistry Tutor' },
        ]},
      ],
      'High School': [
        { unit: 'Algebra', desc: 'Equations, functions, and polynomials', videos: [
          { id: 'ppWPuXzMHR0', title: 'Algebra – Full Course for Beginners', channel: 'Khan Academy' },
          { id: 'LwCRRUa8yTU', title: 'Solving Quadratic Equations', channel: 'The Organic Chemistry Tutor' },
          { id: '9Ek61w1LxSc', title: 'Functions and Graphs', channel: 'Khan Academy' },
          { id: 'fYQ3GRSu8xg', title: 'Logarithms Explained', channel: 'The Organic Chemistry Tutor' },
          { id: 'Z5myJ8dg_rM', title: 'Polynomials – Adding, Subtracting, Multiplying', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Geometry', desc: 'Proofs, theorems, and constructions', videos: [
          { id: 'mhd9FXYdf4s', title: 'Geometry Course – Full Tutorial', channel: 'freeCodeCamp' },
          { id: '302eJ3TzJQU', title: 'Pythagorean Theorem and Distance Formula', channel: 'The Organic Chemistry Tutor' },
          { id: 'lkMIjCNPOVs', title: 'Similar Triangles and Congruence', channel: 'Khan Academy' },
          { id: 'BbcOPSvk_UI', title: 'Circles – Area, Circumference, Arc Length', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Trigonometry', desc: 'Sin, cos, tan and the unit circle', videos: [
          { id: 'PUB0TaZ7bhA', title: 'Trigonometry Course', channel: 'The Organic Chemistry Tutor' },
          { id: 'yBw67Fb31Cs', title: 'Unit Circle – Everything You Need', channel: 'The Organic Chemistry Tutor' },
          { id: 'bIEyA4agWn8', title: 'Trig Identities & Equations', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Pre-Calculus', desc: 'Limits, sequences, and advanced functions', videos: [
          { id: 'eI4an8aSsgw', title: 'Precalculus Full Course', channel: 'freeCodeCamp' },
          { id: 'HfACrKJ_Y2w', title: 'Calculus at a Fifth Grade Level', channel: 'Lukey B. The Physics G' },
          { id: 'YG15m2VwSjA', title: 'How to Learn Math Fast', channel: 'The Organic Chemistry Tutor' },
          { id: 'riXcZT2ICjA', title: 'Limits – Introduction', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Probability & Statistics', desc: 'Data analysis and chance', videos: [
          { id: 'XZo4xyJXCak', title: 'Intro to Statistics', channel: 'StatQuest' },
          { id: 'zouPoc49xbk', title: 'Probability Fundamentals', channel: 'Khan Academy' },
          { id: 'Vfo5le26IhY', title: 'Hypothesis Testing', channel: 'StatQuest' },
        ]},
      ],
      'College / AP': [
        { unit: 'Calculus I & II', desc: 'Derivatives, integrals, and series', videos: [
          { id: 'WUvTyaaNkzM', title: 'Essence of Calculus – Full Series', channel: '3Blue1Brown' },
          { id: 'rfG8ce4nNh0', title: 'Calculus 1 – Full Course', channel: 'The Organic Chemistry Tutor' },
          { id: '7gigNsz4Oe8', title: 'Multivariable Calculus', channel: 'Khan Academy' },
          { id: 'HnXRGnasmgY', title: 'Integration Techniques', channel: 'The Organic Chemistry Tutor' },
          { id: 'TBuflNd3W_o', title: 'Taylor Series and Approximation', channel: '3Blue1Brown' },
        ]},
        { unit: 'Linear Algebra', desc: 'Vectors, matrices, and transformations', videos: [
          { id: 'fNk_zzaMoSs', title: 'Vectors – Essence of Linear Algebra', channel: '3Blue1Brown' },
          { id: 'kYB8IZa5AuE', title: 'Linear Combinations and Span', channel: '3Blue1Brown' },
          { id: 'k7RM-ot2NWY', title: 'Eigenvalues and Eigenvectors', channel: '3Blue1Brown' },
          { id: 'PFDu9oVAE1g', title: 'Linear Algebra Full Course', channel: 'Dr. Trefor Bazett' },
        ]},
        { unit: 'Differential Equations', desc: 'ODEs, PDEs, and modeling', videos: [
          { id: 'p_di4Zn4wz4', title: 'Differential Equations Overview', channel: '3Blue1Brown' },
          { id: 'xf-3ATzFyKA', title: 'Differential Equations Full Course', channel: 'The Organic Chemistry Tutor' },
          { id: 'HKvP2ESjJbA', title: 'Laplace Transform Explained', channel: 'Steve Brunton' },
        ]},
        { unit: 'Statistics & Probability', desc: 'Distributions, regression, and inference', videos: [
          { id: 'xxpc-HPKN28', title: 'Statistics Full Course', channel: 'freeCodeCamp' },
          { id: 'XZo4xyJXCak', title: 'Central Limit Theorem Explained', channel: 'StatQuest' },
          { id: 'Vfo5le26IhY', title: 'Hypothesis Testing', channel: 'StatQuest' },
          { id: 'nk2CQITm_eo', title: 'Linear Regression – Clearly Explained', channel: 'StatQuest' },
        ]},
      ],
    },
  },

  Physics: {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'from-amber-500 to-orange-600',
    grades: {
      'Middle School': [
        { unit: 'Forces & Motion', desc: "Newton's laws and how things move", videos: [
          { id: 'ZM8ECpBuQYE', title: "Newton's Laws of Motion", channel: 'Khan Academy' },
          { id: 'kKKM8Y-u7ds', title: 'Speed, Velocity, and Acceleration', channel: 'The Organic Chemistry Tutor' },
          { id: 'fo_pmp5ojsk', title: 'Friction – What Is It?', channel: 'SciShow Kids' },
        ]},
        { unit: 'Energy', desc: 'Kinetic, potential, and conservation', videos: [
          { id: 'AEIn3T6nDAo', title: 'Energy – Kinetic and Potential', channel: 'The Organic Chemistry Tutor' },
          { id: 'CW0_S5YpYVo', title: 'Conservation of Energy', channel: 'Khan Academy' },
        ]},
        { unit: 'Waves & Sound', desc: 'How sound and light travel', videos: [
          { id: 'Xzn2ecB4Hzs', title: 'Waves and Electromagnetic Spectrum', channel: 'Khan Academy' },
          { id: 'TfYCnOvNnFU', title: 'Sound Waves Explained', channel: 'TED-Ed' },
        ]},
      ],
      'High School': [
        { unit: 'Kinematics', desc: 'Describing motion with equations', videos: [
          { id: 'kKKM8Y-u7ds', title: 'Kinematics – One Dimensional Motion', channel: 'The Organic Chemistry Tutor' },
          { id: 'ZM8ECpBuQYE', title: "Newton's Laws of Motion", channel: 'Khan Academy' },
          { id: 'v5mCMp1j3lM', title: 'Projectile Motion', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: "Newton's Laws & Forces", desc: 'How forces cause acceleration', videos: [
          { id: 'ZM8ECpBuQYE', title: "Newton's Laws Explained", channel: 'Khan Academy' },
          { id: 'fo_pmp5ojsk', title: 'Friction and Normal Force', channel: 'The Organic Chemistry Tutor' },
          { id: 'bKEaK7WNLzM', title: 'Free Body Diagrams', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Energy, Work & Power', desc: 'Conservation and transfer of energy', videos: [
          { id: 'AEIn3T6nDAo', title: 'Work, Energy and Power', channel: 'The Organic Chemistry Tutor' },
          { id: 'CW0_S5YpYVo', title: 'Conservation of Energy', channel: 'Khan Academy' },
          { id: 'w4QFo2MEU5U', title: 'Elastic and Inelastic Collisions', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Electricity & Circuits', desc: 'Charge, current, and circuit analysis', videos: [
          { id: 'r-GCzjiuBpc', title: 'Electric Charge and Coulombs Law', channel: 'The Organic Chemistry Tutor' },
          { id: 's7JLXs5es7I', title: 'Magnetic Fields and Forces', channel: 'Khan Academy' },
          { id: 'g-wjP1otQWI', title: "Ohm's Law and Circuits", channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Waves & Optics', desc: 'Light, sound, and wave behavior', videos: [
          { id: 'Xzn2ecB4Hzs', title: 'Waves and Electromagnetic Spectrum', channel: 'Khan Academy' },
          { id: 'XQIbn27dOjE', title: 'A Brief History of Quantum Mechanics', channel: 'TED-Ed' },
          { id: 'IRBfpBPELmE', title: 'Reflection and Refraction of Light', channel: 'The Organic Chemistry Tutor' },
        ]},
      ],
      'College / AP': [
        { unit: 'Classical Mechanics', desc: 'Newtonian mechanics in depth', videos: [
          { id: 'kKKM8Y-u7ds', title: 'Kinematics – One Dimensional Motion', channel: 'The Organic Chemistry Tutor' },
          { id: 'AEIn3T6nDAo', title: 'Work, Energy and Power', channel: 'The Organic Chemistry Tutor' },
          { id: 'KnuG1Oa_mZE', title: 'Rotational Dynamics', channel: 'Michel van Biezen' },
          { id: 'w4QFo2MEU5U', title: 'Momentum and Collisions', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Electromagnetism', desc: "Maxwell's equations and EM fields", videos: [
          { id: 'r-GCzjiuBpc', title: 'Electric Charge and Coulombs Law', channel: 'The Organic Chemistry Tutor' },
          { id: 's7JLXs5es7I', title: 'Magnetic Fields and Forces', channel: 'Khan Academy' },
          { id: 'g-wjP1otQWI', title: 'Circuits and Kirchhoffs Laws', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Thermodynamics', desc: 'Heat, entropy, and the laws of thermo', videos: [
          { id: 'kLqduWF6GXE', title: 'Thermodynamics – Laws and Concepts', channel: 'The Organic Chemistry Tutor' },
          { id: 'YM-uykVfq_E', title: 'Entropy – A Measure of Disorder', channel: 'TED-Ed' },
        ]},
        { unit: 'Quantum & Modern Physics', desc: 'Wave-particle duality and relativity', videos: [
          { id: 'p7bzE1E5PMY', title: 'Quantum Physics Made Simple', channel: 'Domain of Science' },
          { id: 'XQIbn27dOjE', title: 'A Brief History of Quantum Mechanics', channel: 'TED-Ed' },
          { id: 'NnMIhxWRGNw', title: 'Special Relativity Explained', channel: 'Fermilab' },
        ]},
      ],
    },
  },

  Chemistry: {
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    color: 'from-green-500 to-emerald-600',
    grades: {
      'Middle School': [
        { unit: 'Introduction to Chemistry', desc: 'Atoms, elements, and compounds', videos: [
          { id: 'bka20Q9TN6M', title: 'Introduction to Chemistry', channel: 'The Organic Chemistry Tutor' },
          { id: 'IFKnq9QM6_A', title: 'Atoms and Molecules', channel: 'TED-Ed' },
          { id: 'wXJBMwKGwuY', title: 'States of Matter', channel: 'Peekaboo Kidz' },
        ]},
        { unit: 'The Periodic Table', desc: 'Organizing all known elements', videos: [
          { id: 'QiiyvzZBKT8', title: 'The Periodic Table Explained', channel: 'TED-Ed' },
          { id: 'rz4Dd1I_fX0', title: 'How to Read the Periodic Table', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Mixtures & Solutions', desc: 'Combining substances', videos: [
          { id: 'EbOZO5MFa5U', title: 'Mixtures and Solutions', channel: 'Amoeba Sisters' },
          { id: 'AN4KifV12DA', title: 'Solubility Explained', channel: 'TED-Ed' },
        ]},
      ],
      'High School': [
        { unit: 'Atomic Structure', desc: 'Electron configuration and orbitals', videos: [
          { id: 'bka20Q9TN6M', title: 'Introduction to Chemistry', channel: 'The Organic Chemistry Tutor' },
          { id: 'QiiyvzZBKT8', title: 'The Periodic Table Explained', channel: 'TED-Ed' },
          { id: 'Aoi4j8es4gQ', title: 'Electron Configuration', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Chemical Bonding', desc: 'Ionic, covalent, and metallic bonds', videos: [
          { id: 'FSyAehMdpyI', title: 'Chemical Bonding', channel: 'Khan Academy' },
          { id: 'a8LF7JEb0IA', title: 'Lewis Dot Structures', channel: 'The Organic Chemistry Tutor' },
          { id: 'PgIfRHf_xaA', title: 'VSEPR Theory and Molecular Geometry', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Chemical Reactions', desc: 'Balancing equations and reaction types', videos: [
          { id: 'lQ6FBA1HM3s', title: 'Balancing Chemical Equations', channel: 'The Organic Chemistry Tutor' },
          { id: 'eNsVaUCzvLA', title: 'Types of Chemical Reactions', channel: 'The Organic Chemistry Tutor' },
          { id: 'DFQlUhfo4VQ', title: 'Stoichiometry', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Acids, Bases & pH', desc: 'Proton donors, acceptors, and the pH scale', videos: [
          { id: 'LS67vS10O5Y', title: 'Acids and Bases – pH and pOH', channel: 'The Organic Chemistry Tutor' },
          { id: 'ANi709MHnBY', title: 'Acid-Base Titration', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Organic Chemistry Intro', desc: 'Carbon compounds and hydrocarbons', videos: [
          { id: 'GqtUWyDR1fg', title: 'Organic Chemistry Basics', channel: 'The Organic Chemistry Tutor' },
          { id: 'kv-o-JGddCI', title: 'Functional Groups', channel: 'The Organic Chemistry Tutor' },
        ]},
      ],
      'College / AP': [
        { unit: 'Organic Chemistry', desc: 'Reactions, mechanisms, and synthesis', videos: [
          { id: 'GqtUWyDR1fg', title: 'Organic Chemistry Basics', channel: 'The Organic Chemistry Tutor' },
          { id: 'kv-o-JGddCI', title: 'Functional Groups', channel: 'The Organic Chemistry Tutor' },
          { id: 'VWlJYBjBSak', title: 'SN1 vs SN2 Reactions', channel: 'The Organic Chemistry Tutor' },
          { id: 'HWIzTGyx6dM', title: 'Nomenclature of Organic Compounds', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Thermochemistry', desc: 'Energy changes in chemical reactions', videos: [
          { id: 'SV7U4yAXL5I', title: 'Enthalpy and Hess Law', channel: 'The Organic Chemistry Tutor' },
          { id: 'kLqduWF6GXE', title: 'Thermochemistry – Calorimetry', channel: 'The Organic Chemistry Tutor' },
        ]},
        { unit: 'Biochemistry', desc: 'Chemistry of life – proteins, lipids, carbs', videos: [
          { id: 'H8WJ2KENlK0', title: 'Amino Acids and Proteins', channel: 'Amoeba Sisters' },
          { id: 'xbJ0nbzt5Kw', title: 'Krebs Cycle Made Simple', channel: 'Ninja Nerd' },
          { id: 'YO244P1e9QM', title: 'Lipids and Carbohydrates', channel: 'Amoeba Sisters' },
        ]},
      ],
    },
  },

  Biology: {
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    color: 'from-pink-500 to-rose-600',
    grades: {
      'Elementary': [
        { unit: 'Living Things', desc: 'Plants, animals, and how they grow', videos: [
          { id: 'IQCfmVNMQNc', title: 'Photosynthesis for Kids', channel: 'Homeschool Pop' },
          { id: 'mMkKh4HGbwA', title: 'The Water Cycle', channel: 'National Geographic Kids' },
          { id: 'p3St51F4kE8', title: 'Animal Habitats for Kids', channel: 'Homeschool Pop' },
        ]},
        { unit: 'The Human Body', desc: 'How our bodies work', videos: [
          { id: 'gEUu-A2wfSE', title: 'Human Body for Kids', channel: 'Homeschool Pop' },
          { id: 'X9TgjKNziog', title: 'The Skeletal System', channel: 'Homeschool Pop' },
        ]},
        { unit: 'Earth & Space', desc: 'Our planet and the solar system', videos: [
          { id: 'Rl4ZR0mz_RU', title: 'The Solar System for Kids', channel: 'Homeschool Pop' },
          { id: 'HCDVN7DCzYE', title: 'Layers of the Earth', channel: 'Homeschool Pop' },
        ]},
      ],
      'Middle School': [
        { unit: 'Cell Biology', desc: 'The building blocks of life', videos: [
          { id: 'QnQe0xW_JY4', title: 'Cell Structure and Function', channel: 'Nucleus Biology' },
          { id: 'URUJD5NEXC8', title: 'Plant vs Animal Cells', channel: 'Amoeba Sisters' },
          { id: '3TaLrekKniM', title: 'Cell Division – Mitosis', channel: 'Amoeba Sisters' },
        ]},
        { unit: 'Genetics & Heredity', desc: 'How traits are passed down', videos: [
          { id: 'GcjgWov7mTM', title: 'DNA, Chromosomes, Genes, and Traits', channel: 'Amoeba Sisters' },
          { id: 'pCujwKB_XPY', title: 'Punnett Squares Explained', channel: 'Amoeba Sisters' },
        ]},
        { unit: 'Ecosystems & Ecology', desc: 'How organisms interact', videos: [
          { id: 'mMkKh4HGbwA', title: 'The Water Cycle', channel: 'National Geographic' },
          { id: 'GlFjW_sErEk', title: 'Food Webs and Energy Pyramids', channel: 'Amoeba Sisters' },
          { id: 'GK_vRtHJZu4', title: 'Biomes of the World', channel: 'MooMoo Math and Science' },
        ]},
      ],
      'High School': [
        { unit: 'Cell Biology', desc: 'Organelles, membranes, and transport', videos: [
          { id: 'QnQe0xW_JY4', title: 'Biology: Cell Structure', channel: 'Nucleus Biology' },
          { id: 'URUJD5NEXC8', title: 'Plant vs Animal Cells', channel: 'Amoeba Sisters' },
          { id: '3TaLrekKniM', title: 'Cell Division – Mitosis and Meiosis', channel: 'Amoeba Sisters' },
        ]},
        { unit: 'Genetics & DNA', desc: 'Molecular genetics and inheritance', videos: [
          { id: 'GcjgWov7mTM', title: 'DNA, Chromosomes, Genes, and Traits', channel: 'Amoeba Sisters' },
          { id: 'pCujwKB_XPY', title: 'Punnett Squares – Predicting Traits', channel: 'Amoeba Sisters' },
          { id: 'itsb2SqR-8M', title: 'Gene Expression and Regulation', channel: 'Amoeba Sisters' },
        ]},
        { unit: 'Photosynthesis & Respiration', desc: 'How cells make and use energy', videos: [
          { id: '_zm_DyD6FJ0', title: 'Photosynthesis', channel: 'Khan Academy' },
          { id: 'eJ9Zjc-jdys', title: 'Cellular Respiration', channel: 'Amoeba Sisters' },
        ]},
        { unit: 'Evolution & Natural Selection', desc: 'How species change over time', videos: [
          { id: '8kK2zwjRV0M', title: 'Evolution – Natural Selection', channel: 'Khan Academy' },
          { id: 'GhHOjC4oxh8', title: 'Evidence for Evolution', channel: 'Stated Clearly' },
          { id: 'fQwI90bkJl4', title: 'Speciation and Adaptation', channel: 'Amoeba Sisters' },
        ]},
        { unit: 'Human Body Systems', desc: 'Organ systems and how they work together', videos: [
          { id: 'itsb2SqR-8M', title: 'Human Body Systems Overview', channel: 'Amoeba Sisters' },
          { id: 'PgI80Ue-AMo', title: 'The Nervous System', channel: 'CrashCourse' },
          { id: 'x-IHoHkN4RM', title: 'Immune System Explained', channel: 'Kurzgesagt' },
        ]},
      ],
      'College / AP': [
        { unit: 'Molecular Biology', desc: 'DNA replication, transcription, translation', videos: [
          { id: 'H8WJ2KENlK0', title: 'Amino Acids and Proteins', channel: 'Amoeba Sisters' },
          { id: 'itsb2SqR-8M', title: 'Enzyme Function and Structure', channel: 'Amoeba Sisters' },
          { id: 'gG7uCskUOrA', title: 'DNA Replication', channel: 'Amoeba Sisters' },
        ]},
        { unit: 'Metabolism & Biochemistry', desc: 'Energy pathways in cells', videos: [
          { id: 'xbJ0nbzt5Kw', title: 'Krebs Cycle Made Simple', channel: 'Ninja Nerd' },
          { id: '_zm_DyD6FJ0', title: 'Photosynthesis – Light Reactions', channel: 'Khan Academy' },
          { id: 'eJ9Zjc-jdys', title: 'Cellular Respiration – Full Walkthrough', channel: 'Amoeba Sisters' },
        ]},
        { unit: 'Evolution & Ecology', desc: 'Population genetics and ecosystems', videos: [
          { id: '8kK2zwjRV0M', title: 'Evolution – Natural Selection', channel: 'Khan Academy' },
          { id: 'GhHOjC4oxh8', title: 'Evidence for Evolution', channel: 'Stated Clearly' },
        ]},
        { unit: 'Neuroscience', desc: 'The brain and nervous system', videos: [
          { id: 'PgI80Ue-AMo', title: 'The Nervous System – CrashCourse', channel: 'CrashCourse' },
          { id: 'VitFvNvRIIY', title: 'How Neurons Communicate', channel: 'TED-Ed' },
        ]},
      ],
    },
  },

  'Computer Science': {
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    color: 'from-violet-500 to-purple-600',
    grades: {
      'Middle School': [
        { unit: 'How Computers Work', desc: 'Hardware, software, and binary', videos: [
          { id: 'O5nskjZ_GoI', title: 'How Computers Work', channel: 'Khan Academy' },
          { id: 'USCBCmwMCDA', title: 'Binary Numbers Explained', channel: 'Khan Academy' },
        ]},
        { unit: 'Intro to Coding', desc: 'Your first steps in programming', videos: [
          { id: 'zOjov-2OZ0E', title: 'Introduction to Programming', channel: 'freeCodeCamp' },
          { id: 'lkIFF4maKMU', title: 'Scratch Programming for Beginners', channel: 'CS First' },
          { id: 'kqtD5dpn9C8', title: 'Python for Beginners – Full Course', channel: 'Programming with Mosh' },
        ]},
      ],
      'High School': [
        { unit: 'Python Programming', desc: 'Learn Python from scratch', videos: [
          { id: 'pTB0EiLXUC8', title: 'Python Full Course for Beginners', channel: 'Programming with Mosh' },
          { id: 'kqtD5dpn9C8', title: 'Python Tutorial – Build Projects', channel: 'Programming with Mosh' },
          { id: 'HXV3zeQKqGY', title: 'Big-O Notation in 100 Seconds', channel: 'Fireship' },
        ]},
        { unit: 'Web Development', desc: 'HTML, CSS, and JavaScript', videos: [
          { id: 'PkZNo7MFNFg', title: 'Learn JavaScript – Full Course', channel: 'freeCodeCamp' },
          { id: 'qz0aGYrrlhU', title: 'HTML Tutorial for Beginners', channel: 'Programming with Mosh' },
          { id: '1Rs2ND1ryYc', title: 'CSS Tutorial – Full Course', channel: 'freeCodeCamp' },
        ]},
        { unit: 'Algorithms & Problem Solving', desc: 'Thinking like a programmer', videos: [
          { id: 'zOjov-2OZ0E', title: 'Intro to Algorithms', channel: 'freeCodeCamp' },
          { id: 'HXV3zeQKqGY', title: 'Big-O Notation in 100 Seconds', channel: 'Fireship' },
          { id: '8hly31xKli0', title: 'Sorting Algorithms Visualized', channel: 'freeCodeCamp' },
        ]},
      ],
      'College / AP': [
        { unit: 'CS Fundamentals', desc: 'Harvard CS50 and core concepts', videos: [
          { id: 'oBt53YbR9Kk', title: 'CS50 – Full Computer Science Course', channel: 'Harvard CS50' },
          { id: 'pTB0EiLXUC8', title: 'Python Full Course', channel: 'Programming with Mosh' },
        ]},
        { unit: 'Data Structures & Algorithms', desc: 'Trees, graphs, sorting, and searching', videos: [
          { id: '8hly31xKli0', title: 'Algorithms and Data Structures', channel: 'freeCodeCamp' },
          { id: 'RBSGKlAvoiM', title: 'Data Structures – Easy to Advanced', channel: 'freeCodeCamp' },
          { id: 'HXV3zeQKqGY', title: 'Big-O Notation in 100 Seconds', channel: 'Fireship' },
        ]},
        { unit: 'Machine Learning & AI', desc: 'Neural networks and intelligent systems', videos: [
          { id: 'i_LwzRVP7bg', title: 'Machine Learning for Everybody', channel: 'freeCodeCamp' },
          { id: 'aircAruvnKk', title: 'Neural Networks – 3Blue1Brown', channel: '3Blue1Brown' },
          { id: 'GwIo3gDZCVQ', title: 'TensorFlow 2.0 Complete Course', channel: 'freeCodeCamp' },
        ]},
        { unit: 'Systems & Networking', desc: 'Operating systems, networks, and databases', videos: [
          { id: 'zN8YNNHcaZs', title: 'Networking Fundamentals', channel: 'NetworkChuck' },
          { id: 'HXV3zeQKqGY', title: 'Databases in 100 Seconds', channel: 'Fireship' },
        ]},
      ],
    },
  },

  Programming: {
    icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: 'from-yellow-400 to-amber-500',
    grades: {
      'Beginner': [
        { unit: 'Getting Started', desc: 'Install Python, hello world, and basic concepts', videos: [
          { id: 'x7X9w_GIm1s', title: 'Python in 100 Seconds', channel: 'Fireship' },
          { id: 'YYXdXT2l-Gg', title: 'Install and Setup for Mac and Windows', channel: 'Corey Schafer' },
          { id: 'rfscVS0vtbw', title: 'Learn Python – Full Course for Beginners', channel: 'freeCodeCamp' },
        ]},
        { unit: 'Variables & Data Types', desc: 'Numbers, strings, booleans, and type conversion', videos: [
          { id: 'Z1Yd7upQsXY', title: 'What Are Variables?', channel: 'CS Dojo' },
          { id: 'khKv-8q7YmY', title: 'Integers and Floats – Numeric Data', channel: 'Corey Schafer' },
          { id: 'k9TUPpGqYTo', title: 'Strings – Working with Textual Data', channel: 'Corey Schafer' },
        ]},
        { unit: 'Control Flow', desc: 'If/else statements, for loops, and while loops', videos: [
          { id: 'DZwmZ8Usvnk', title: 'Conditionals and Booleans – If, Else, Elif', channel: 'Corey Schafer' },
          { id: '6iF8Xb7Z3wQ', title: 'Loops and Iterations – For/While Loops', channel: 'Corey Schafer' },
          { id: '_uQrJ0TkZlc', title: 'Python Full Course for Beginners', channel: 'Programming with Mosh' },
        ]},
      ],
      'Intermediate': [
        { unit: 'Functions', desc: 'Defining functions, parameters, return values, and lambda', videos: [
          { id: '9Os0o3wzS_I', title: 'Functions', channel: 'Corey Schafer' },
          { id: 'u-OmVr_fT4s', title: 'Python Functions for Absolute Beginners', channel: 'CS Dojo' },
          { id: '25ovCm9jKfA', title: 'Lambda Expressions & Anonymous Functions', channel: 'Socratica' },
        ]},
        { unit: 'Data Structures', desc: 'Lists, dictionaries, tuples, sets, and comprehensions', videos: [
          { id: 'W8KRzm-HUcc', title: 'Lists, Tuples, and Sets', channel: 'Corey Schafer' },
          { id: 'daefaLgNkw0', title: 'Dictionaries – Key-Value Pairs', channel: 'Corey Schafer' },
          { id: '3dt4OGnU5sM', title: 'Comprehensions – How They Work', channel: 'Corey Schafer' },
        ]},
        { unit: 'String Methods & Regex', desc: 'Formatting, slicing, and regular expressions', videos: [
          { id: 'vTX3IwquFkc', title: 'String Formatting – Advanced Operations', channel: 'Corey Schafer' },
          { id: 'K8L6KVGG-7o', title: 're Module – Regular Expressions', channel: 'Corey Schafer' },
        ]},
        { unit: 'Error Handling', desc: 'Try/except blocks and debugging techniques', videos: [
          { id: 'NIWwJbo-9_8', title: 'Try/Except Blocks for Error Handling', channel: 'Corey Schafer' },
          { id: '6tNS--WetLI', title: 'Unit Testing Your Code with unittest', channel: 'Corey Schafer' },
        ]},
      ],
      'Advanced': [
        { unit: 'Object-Oriented Programming', desc: 'Classes, inheritance, and special methods', videos: [
          { id: 'ZDa-Z5JzLYM', title: 'OOP 1: Classes and Instances', channel: 'Corey Schafer' },
          { id: 'RSl87lqOXDE', title: 'OOP 4: Inheritance – Creating Subclasses', channel: 'Corey Schafer' },
          { id: '3ohzBxoFHAY', title: 'OOP 5: Special (Magic/Dunder) Methods', channel: 'Corey Schafer' },
          { id: 'Ej_02ICOIgs', title: 'OOP with Python – Full Course', channel: 'freeCodeCamp' },
        ]},
        { unit: 'File I/O & Data', desc: 'Reading/writing files, CSV, and JSON', videos: [
          { id: 'Uh2ebFW8OYM', title: 'File Objects – Reading and Writing', channel: 'Corey Schafer' },
          { id: 'q5uM4VKywbA', title: 'CSV Module – Read, Parse, and Write', channel: 'Corey Schafer' },
          { id: '9N6a-VLBa2I', title: 'Working with JSON Data', channel: 'Corey Schafer' },
        ]},
        { unit: 'Modules & Packages', desc: 'Importing, creating modules, and the standard library', videos: [
          { id: 'CqvZ3vGoGs0', title: 'Import Modules and the Standard Library', channel: 'Corey Schafer' },
          { id: 'GxCXiSkm6no', title: 'Importing Your Own Modules Properly', channel: 'Corey Schafer' },
          { id: 'sugvnHA7ElY', title: 'if __name__ == \'__main__\'', channel: 'Corey Schafer' },
        ]},
        { unit: 'Advanced Topics', desc: 'Decorators, generators, threading, and beyond', videos: [
          { id: 'FsAPt_9Bf3U', title: 'Decorators – Alter Function Functionality', channel: 'Corey Schafer' },
          { id: 'bD05uGo_sVI', title: 'Generators – How to Use Them', channel: 'Corey Schafer' },
          { id: 'IEEhzQoKtQU', title: 'Threading – Run Code Concurrently', channel: 'Corey Schafer' },
          { id: 'nLRL_NcnK-4', title: 'CS50P – Full Python University Course', channel: 'Harvard CS50' },
        ]},
      ],
    },
  },

  English: {
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    color: 'from-rose-400 to-pink-500',
    grades: {
      'Elementary': [
        { unit: 'Grammar Basics', desc: 'Nouns, verbs, adjectives, and more', videos: [
          { id: 'eIHo2ByWCRo', title: 'Parts of Speech for Kids', channel: 'Homeschool Pop' },
          { id: 'CsN05eZaG-A', title: 'Nouns, Verbs, and Adjectives', channel: 'GrammarSongs by Melissa' },
          { id: 'KGfvy1TQviA', title: 'Pronouns and Prepositions', channel: 'Homeschool Pop' },
        ]},
        { unit: 'Reading Skills', desc: 'Comprehension and fluency', videos: [
          { id: 'R087lYrRpgY', title: 'Reading Comprehension Strategies', channel: 'English with Greg' },
          { id: 'p2LF-m79kLs', title: 'How to Improve Your Reading', channel: 'TED-Ed' },
        ]},
      ],
      'Middle School': [
        { unit: 'Paragraph & Essay Writing', desc: 'Structure and organization', videos: [
          { id: 'Y3imoKVMQCU', title: 'How to Write an Essay', channel: 'Shaun' },
          { id: 'dT_Oqq8dCOY', title: 'How to Write a Paragraph', channel: 'English with Greg' },
          { id: '6SMSQd4LIpo', title: 'Thesis Statements – How to Write Them', channel: 'Scribbr' },
        ]},
        { unit: 'Grammar & Sentence Structure', desc: 'Complex sentences and punctuation', videos: [
          { id: 'oZhVIRYzLBg', title: 'Grammar: Sentence Structure', channel: 'English Lessons with Adam' },
          { id: 'N46BhQBMjKE', title: 'Comma Rules Made Simple', channel: 'English with Greg' },
        ]},
        { unit: 'Reading Comprehension', desc: 'Analyzing what you read', videos: [
          { id: 'R087lYrRpgY', title: 'Reading Comprehension Strategies', channel: 'English with Greg' },
          { id: 'p2LF-m79kLs', title: 'How to Read More Effectively', channel: 'TED-Ed' },
        ]},
      ],
      'High School': [
        { unit: 'Literature Analysis', desc: 'Themes, symbolism, and critical reading', videos: [
          { id: 'MSYw502dJNY', title: 'How to Analyze Literature', channel: 'CrashCourse' },
          { id: 'xBjSV0-oIdU', title: 'Shakespeare – CrashCourse Literature', channel: 'CrashCourse' },
          { id: '3jLYP_0fmgA', title: 'To Kill a Mockingbird – Summary & Analysis', channel: 'CrashCourse' },
        ]},
        { unit: 'Essay Writing', desc: 'Argumentative, expository, and narrative', videos: [
          { id: 'Hhk4N9A0oCA', title: 'How to Write a Great Essay', channel: 'Jordan Peterson' },
          { id: '6SMSQd4LIpo', title: 'Thesis Statements Made Easy', channel: 'Scribbr' },
          { id: 'Y3imoKVMQCU', title: 'Essay Structure and Outline', channel: 'Shaun' },
        ]},
        { unit: 'Poetry & Rhetoric', desc: 'Poetic devices and persuasive writing', videos: [
          { id: 'JwhouCNq-Fc', title: 'Poetry – CrashCourse Literature', channel: 'CrashCourse' },
          { id: '3klMM9BkW5o', title: 'Rhetorical Analysis – How to Analyze', channel: 'Heimlers History' },
        ]},
      ],
    },
  },

  History: {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'from-yellow-500 to-amber-600',
    grades: {
      'Elementary': [
        { unit: 'Geography & Maps', desc: 'Continents, countries, and map reading', videos: [
          { id: 'v9e3reGYJoE', title: 'The Continents for Kids', channel: 'Homeschool Pop' },
          { id: '4_5VxGbakig', title: 'Map Skills for Kids', channel: 'Homeschool Pop' },
          { id: 'K6DSMZ8b3LE', title: 'Countries of the World', channel: 'Homeschool Pop' },
        ]},
        { unit: 'Civics & Government', desc: 'How government works', videos: [
          { id: 'FrU_d70T4Pw', title: 'US Government for Kids', channel: 'Homeschool Pop' },
          { id: 'lrk4oY7UxpQ', title: 'Three Branches of Government', channel: 'Homeschool Pop' },
        ]},
      ],
      'Middle School': [
        { unit: 'Ancient Civilizations', desc: 'Egypt, Greece, Rome, and more', videos: [
          { id: '0auL9JBnOyQ', title: 'Ancient Egypt in 13 Minutes', channel: 'Captivating History' },
          { id: 'rjhIzemLdos', title: 'Ancient Greece – CrashCourse', channel: 'CrashCourse' },
          { id: 'oPf27gAup9U', title: 'Roman Empire – CrashCourse', channel: 'CrashCourse' },
        ]},
        { unit: 'Medieval & Renaissance', desc: 'The Middle Ages to the rebirth of learning', videos: [
          { id: 'rNCw2MOfnLQ', title: 'Medieval Europe – CrashCourse', channel: 'CrashCourse' },
          { id: 'Vufba_ZDTas', title: 'The Renaissance – What Was It?', channel: 'TED-Ed' },
        ]},
        { unit: 'Age of Exploration & Revolutions', desc: 'Discovery, colonialism, and revolution', videos: [
          { id: 'Yocja_N5s1I', title: 'World History in 18 Minutes', channel: 'Jabzy' },
          { id: 'xuCn8ux2gbs', title: 'The French Revolution', channel: 'OverSimplified' },
          { id: '2yJmKEjBjHg', title: 'American Revolution – OverSimplified', channel: 'OverSimplified' },
        ]},
      ],
      'High School': [
        { unit: 'US History – Founding to Civil War', desc: 'Building a nation and the fight over slavery', videos: [
          { id: '2yJmKEjBjHg', title: 'American Revolution – OverSimplified', channel: 'OverSimplified' },
          { id: 'HdNn5TZu6R8', title: 'The Civil War – OverSimplified', channel: 'OverSimplified' },
          { id: 'rjhIzemLdos', title: 'US Constitution – CrashCourse', channel: 'CrashCourse' },
        ]},
        { unit: 'World Wars & Modern Era', desc: 'WWI, WWII, Cold War, and beyond', videos: [
          { id: 'DwKPFT-RioU', title: 'WW2 – OverSimplified', channel: 'OverSimplified' },
          { id: 'I79TpDe3t2g', title: 'WW1 – OverSimplified', channel: 'OverSimplified' },
          { id: 'OIYy32RuHao', title: 'The Cold War – OverSimplified', channel: 'OverSimplified' },
        ]},
        { unit: 'US Government & Politics', desc: 'How American democracy works', videos: [
          { id: 'lrk4oY7UxpQ', title: 'Three Branches of Government', channel: 'CrashCourse' },
          { id: 'rjhIzemLdos', title: 'US Government – CrashCourse', channel: 'CrashCourse' },
        ]},
      ],
    },
  },

  Economics: {
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    color: 'from-cyan-500 to-teal-600',
    grades: {
      'High School': [
        { unit: 'Supply & Demand', desc: 'How markets determine prices', videos: [
          { id: '3ez10ADR_gM', title: 'Supply and Demand', channel: 'Khan Academy' },
          { id: 'PHe0bXAIuk0', title: 'How The Economic Machine Works', channel: 'Ray Dalio' },
          { id: 'PNtKXWNKGN8', title: 'Elasticity of Demand', channel: 'Jacob Clifford' },
        ]},
        { unit: 'Money & Banking', desc: 'How money, banks, and interest rates work', videos: [
          { id: 'mzoX7zEZ6h4', title: 'How Money Works', channel: 'CrashCourse' },
          { id: 'F-7q4NwyDWA', title: 'The Federal Reserve Explained', channel: 'CrashCourse' },
        ]},
        { unit: 'Trade & Globalization', desc: 'International trade and its effects', videos: [
          { id: 'NI9TLDIPVcs', title: 'International Trade – CrashCourse', channel: 'CrashCourse' },
          { id: 'SMmQOGhHNbI', title: 'Microeconomics Overview', channel: 'Jacob Clifford' },
        ]},
      ],
      'College / AP': [
        { unit: 'Microeconomics', desc: 'Consumer choice, firm behavior, and markets', videos: [
          { id: 'SMmQOGhHNbI', title: 'Microeconomics – Everything You Need', channel: 'Jacob Clifford' },
          { id: '3ez10ADR_gM', title: 'Supply and Demand', channel: 'Khan Academy' },
          { id: 'PNtKXWNKGN8', title: 'Elasticity of Demand', channel: 'Jacob Clifford' },
        ]},
        { unit: 'Macroeconomics', desc: 'GDP, inflation, unemployment, fiscal policy', videos: [
          { id: 'PHe0bXAIuk0', title: 'How The Economic Machine Works', channel: 'Ray Dalio' },
          { id: '7Qtr_vA3Aco', title: 'Macroeconomics Full Course', channel: 'Jacob Clifford' },
          { id: 'F-7q4NwyDWA', title: 'Fiscal and Monetary Policy', channel: 'CrashCourse' },
        ]},
        { unit: 'International Economics', desc: 'Trade, exchange rates, and global markets', videos: [
          { id: 'NI9TLDIPVcs', title: 'International Trade – CrashCourse', channel: 'CrashCourse' },
          { id: 'geoe-6NBy-c', title: 'Exchange Rates Explained', channel: 'Jacob Clifford' },
        ]},
      ],
    },
  },

  Psychology: {
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    color: 'from-fuchsia-500 to-pink-600',
    grades: {
      'High School': [
        { unit: 'Foundations of Psychology', desc: 'Major perspectives and research methods', videos: [
          { id: 'vo4pMVb0R6M', title: 'Intro to Psychology – CrashCourse', channel: 'CrashCourse' },
          { id: 'hFV71QPvX2I', title: 'The Growth Mindset', channel: 'Sprouts' },
          { id: 'wuhJ-GkRRQc', title: 'How to Study Effectively', channel: 'Thomas Frank' },
        ]},
        { unit: 'Development & Learning', desc: 'How people grow and learn', videos: [
          { id: 'mFrlBMguDjE', title: 'Nature vs Nurture', channel: 'CrashCourse' },
          { id: 'eTVMdGEICNQ', title: "Piaget's Stages of Development", channel: 'Sprouts' },
          { id: 'QTsewNrHUHU', title: 'Classical and Operant Conditioning', channel: 'CrashCourse' },
        ]},
        { unit: 'Social Psychology', desc: 'How people influence each other', videos: [
          { id: 'UGxGDdQnC1Y', title: 'Social Influence – CrashCourse', channel: 'CrashCourse' },
          { id: 'fCVlI-_4GZQ', title: 'Milgram Experiment Explained', channel: 'Sprouts' },
        ]},
      ],
      'College / AP': [
        { unit: 'Foundations & Research', desc: 'Scientific methods in psychology', videos: [
          { id: 'vo4pMVb0R6M', title: 'Intro to Psychology – CrashCourse', channel: 'CrashCourse' },
          { id: 'hFV71QPvX2I', title: 'The Growth Mindset', channel: 'Sprouts' },
          { id: 'wuhJ-GkRRQc', title: 'Research Methods in Psychology', channel: 'Thomas Frank' },
        ]},
        { unit: 'Cognitive Psychology', desc: 'Memory, perception, and thinking', videos: [
          { id: 'bSycdIx-C48', title: 'Memory – CrashCourse Psychology', channel: 'CrashCourse' },
          { id: 'n3dbH2c3l0M', title: 'Thinking and Problem Solving', channel: 'CrashCourse' },
        ]},
        { unit: 'Clinical & Abnormal Psychology', desc: 'Mental health and disorders', videos: [
          { id: 'JiTz2i4VHFw', title: 'Cognitive Behavioral Therapy Explained', channel: 'Psych Hub' },
          { id: 'uxktavpRdzU', title: 'Psychological Disorders – CrashCourse', channel: 'CrashCourse' },
          { id: 'aOSD9rTVuWc', title: 'Anxiety and Depression Explained', channel: 'Psych Hub' },
        ]},
      ],
    },
  },

  Geography: {
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'from-emerald-400 to-green-500',
    grades: {
      'Middle School': [
        { unit: 'Physical Geography', desc: 'Plate tectonics, climate, and landforms', videos: [
          { id: 'x4Af0mfDhzo', title: 'Plate Tectonics Explained', channel: 'TED-Ed' },
          { id: 'M9oGNJQFZ64', title: 'Climate Zones of the Earth', channel: 'Kurzgesagt' },
          { id: 'HCDVN7DCzYE', title: 'Layers of the Earth', channel: 'Homeschool Pop' },
        ]},
        { unit: 'Human Geography', desc: 'Population, culture, and urbanization', videos: [
          { id: 'hrsxRJdwfM0', title: 'Geography of the World', channel: 'Geography Now' },
          { id: 'GK_vRtHJZu4', title: 'Biomes of the World', channel: 'MooMoo Math and Science' },
        ]},
      ],
    },
  },

  Spanish: {
    icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
    color: 'from-red-400 to-orange-500',
    grades: {
      'High School': [
        { unit: 'Basics & Pronunciation', desc: 'Alphabet, greetings, and sounds', videos: [
          { id: 'DAp_v7EH9AA', title: 'Spanish for Beginners', channel: 'Butterfly Spanish' },
          { id: 'SLESgDGbFMY', title: 'Spanish Alphabet and Pronunciation', channel: 'SpanishPod101' },
        ]},
        { unit: 'Grammar Essentials', desc: 'Verb conjugation and sentence structure', videos: [
          { id: 'MIaJiVBNcQ4', title: 'Most Common Spanish Verbs', channel: 'SpanishPod101' },
          { id: 'JxjwKjKNRmo', title: 'Ser vs Estar Explained', channel: 'Butterfly Spanish' },
          { id: 'rvCcnf-4YSE', title: 'Past Tense – Preterite vs Imperfect', channel: 'Butterfly Spanish' },
        ]},
        { unit: 'Vocabulary & Conversation', desc: 'Everyday words and phrases', videos: [
          { id: 'TYC1LCkbP74', title: 'Spanish Listening Practice', channel: 'SpanishPod101' },
          { id: 'VhVlnfR79Pk', title: '1000 Most Common Spanish Words', channel: 'SpanishPod101' },
        ]},
      ],
    },
  },

  'Art & Music': {
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    color: 'from-fuchsia-400 to-purple-500',
    grades: {
      'High School': [
        { unit: 'Art History', desc: 'Major movements from Renaissance to Modern', videos: [
          { id: 'SO1u6gBJSvg', title: 'Art History in 15 Minutes', channel: 'Perspective' },
          { id: 'wSEd56rcCeU', title: 'Renaissance Art – CrashCourse', channel: 'CrashCourse' },
        ]},
        { unit: 'Music Theory', desc: 'Notes, scales, chords, and rhythm', videos: [
          { id: 'rgaTLrZGlk0', title: 'Music Theory in 16 Minutes', channel: 'Andrew Huang' },
          { id: '5Y01jIR3GbI', title: 'How to Read Sheet Music', channel: '12tone' },
        ]},
        { unit: 'Drawing & Visual Art', desc: 'Fundamentals of sketching and shading', videos: [
          { id: 'QGuVHet7XQ0', title: 'Drawing Fundamentals', channel: 'Proko' },
          { id: 'ewMksAbgZBc', title: 'How to Draw Anything – Basics', channel: 'Proko' },
        ]},
      ],
    },
  },

  Philosophy: {
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    color: 'from-gray-500 to-slate-600',
    grades: {
      'College / AP': [
        { unit: 'Foundations of Philosophy', desc: 'What is philosophy and why it matters', videos: [
          { id: 'BNYJQaZUDrI', title: 'What Is Philosophy? – CrashCourse', channel: 'CrashCourse' },
          { id: '1A_CAkYt3GY', title: 'Existentialism – CrashCourse', channel: 'CrashCourse' },
        ]},
        { unit: 'Ethics & Morality', desc: 'Right, wrong, and how to decide', videos: [
          { id: 'FOoffXFpAlU', title: 'Utilitarianism – CrashCourse', channel: 'CrashCourse' },
          { id: '8bIys6JoEDw', title: 'Kant and Categorical Imperative', channel: 'CrashCourse' },
        ]},
      ],
    },
  },

  'Health & PE': {
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    color: 'from-red-400 to-pink-500',
    grades: {
      'High School': [
        { unit: 'Nutrition & Diet', desc: 'How food fuels your body', videos: [
          { id: 'Y6U728AZnV0', title: 'Nutrition Basics – How Food Fuels You', channel: 'TED-Ed' },
          { id: '6w_pSqIaUEA', title: 'Macronutrients – Protein, Carbs, Fat', channel: 'TED-Ed' },
        ]},
        { unit: 'Exercise Science', desc: 'How exercise affects your body and brain', videos: [
          { id: 'wWGulLAa0O0', title: 'Exercise and the Brain', channel: 'TED-Ed' },
          { id: 'BHY0FxzoKZE', title: 'How Muscles Grow', channel: 'TED-Ed' },
        ]},
        { unit: 'Mental Health', desc: 'Stress, sleep, and emotional well-being', videos: [
          { id: 'zcMBm-UVdII', title: 'Why Is Sleep Important?', channel: 'TED-Ed' },
          { id: 'aOSD9rTVuWc', title: 'Understanding Anxiety', channel: 'Psych Hub' },
        ]},
      ],
    },
  },
};

/* ─── Helpers ─── */

function countVideos(subj) {
  let n = 0;
  for (const units of Object.values(subj.grades)) {
    for (const u of units) n += u.videos.length;
  }
  return n;
}

function countUnits(subj) {
  let n = 0;
  for (const units of Object.values(subj.grades)) n += units.length;
  return n;
}

function thumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/* ─── Component ─── */

export const SUBJECT_NAMES = Object.keys(SUBJECTS);

export default function LessonsPage({ history, onClose, initialSubject }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [watching, setWatching] = useState(null);
  const [watchUnit, setWatchUnit] = useState(null);

  const historySubjects = [...new Set(history.map(e => e.subject))];

  useEffect(() => {
    if (initialSubject && SUBJECTS[initialSubject]) {
      openSubject(initialSubject);
    }
  }, [initialSubject]);

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
          onClick={() => { setWatching(null); setWatchUnit(null); }}
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
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{selectedSubject}</span>
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">{selectedGrade}</span>
            {watchUnit && <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{watchUnit}</span>}
          </div>
        </div>
      </div>
    );
  }

  // ── Subject detail: grade tabs → unit covers → videos ──
  if (selectedSubject) {
    const subj = SUBJECTS[selectedSubject];
    const gradeKeys = Object.keys(subj.grades);
    const units = subj.grades[selectedGrade] || [];

    return (
      <div className="space-y-5 animate-slide-up">
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

        {/* Units */}
        {units.map((u, ui) => (
          <div key={u.unit} className="space-y-2">
            {/* ── Unit cover card ── */}
            <div className={`relative rounded-2xl bg-gradient-to-r ${subj.color} p-5 overflow-hidden`}>
              <div className="absolute top-3 right-4 text-white/15 text-6xl font-black select-none leading-none">
                {ui + 1}
              </div>
              <div className="relative">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
                  Unit {ui + 1}
                </p>
                <h3 className="text-lg font-bold text-white leading-tight">{u.unit}</h3>
                {u.desc && <p className="text-white/70 text-xs mt-1.5 max-w-xs">{u.desc}</p>}
                <p className="text-white/50 text-xs mt-2">{u.videos.length} {u.videos.length === 1 ? 'lesson' : 'lessons'}</p>
              </div>
            </div>

            {/* Video list */}
            {u.videos.map(video => (
              <button
                key={video.id + video.title}
                onClick={() => { setWatching(video); setWatchUnit(u.unit); }}
                className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all cursor-pointer group"
              >
                <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                  <img src={thumbnailUrl(video.id)} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                    <svg className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{video.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{video.channel}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // ── Browse: subject grid ──
  const subjectNames = Object.keys(SUBJECTS);
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose a subject to browse lessons by grade &amp; unit</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sorted.map(name => {
          const subj = SUBJECTS[name];
          const gradeCount = Object.keys(subj.grades).length;
          const videoCount = countVideos(subj);
          const unitCount = countUnits(subj);
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
                {unitCount} units &middot; {videoCount} videos
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
