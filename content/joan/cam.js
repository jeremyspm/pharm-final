/* Rongoā Māori (part of Module 10, Socioeconomic Factors & Complementary/Alternative
   Medicines) — short answers in JOAN'S STATED EXAM FORMAT: a definition plus an example,
   3–4 lines, no question about a specific drug (or, here, a specific plant).
   The Rongoā session was a guest lecture on 15 Sep 2026; its deck "Rongoa 2026.pptx" was
   harvested from Canvas on 19 Sep. THE TOOL wrote every question and model answer from that
   deck — the wording is not the lecturer's. The rest of Module 10 is a self-directed Canvas
   quiz on 14 Oct and is not in this bank. */
const R = { sys: 'cam', quiz: 'joan-cam', quizName: 'In Joan’s format · Rongoā Māori' };
const DECK = 'the Rongoā 2026 deck, ';

export const SAQS = [
  { ...R, pts: 2, q: 'Define rongoā Māori and give an example of each of its three parts.',
    steps: [
      'Definition: traditional Māori healing, with a strong spiritual element in how remedies are prepared — a Māori model of health rather than only a set of remedies.',
      'Its three parts: mirimiri (massage / body work), karakia (prayer) and rongoā rākau (native plant-based remedies, e.g. a leaf prepared as a balm, oil or tonic).',
    ],
    src: DECK + 'slides 9 and 12 (quoting the NZNO Guidelines for Nurses on the Administration of Medicines 2024, s 7.7)' },
  { ...R, pts: 2, q: 'Who is responsible for a traditional Māori medicine, and what should a nurse do when whānau ask for advice about using one?',
    steps: [
      'Responsibility rests with the tohunga or rongoā practitioner — karakia and kawa differ between tribal areas, and the nurse does not prescribe or prepare it.',
      'The nurse arranges a discussion with everyone involved, including the tohunga or practitioner, so the client can make an informed decision — e.g. bringing the practitioner, the whānau and the prescriber together before a remedy is started in hospital.',
    ],
    src: DECK + 'slide 9 (NZNO Guidelines 2024, s 7.7)' },
  { ...R, pts: 3, q: 'List three issues a nurse should consider when a patient wants to use rongoā alongside prescribed medicines, and give an example of why one matters.',
    steps: [
      'Any three, from the guideline’s five: the knowledge and experience of the practitioner · whether the substance is appropriate for the client’s condition · potential side effects.',
      'Potential interactions with other prescribed medicines · whether there is any evidence-based information about the remedy.',
      'Example: a plant tonic traditionally used to lower blood sugar, taken with prescribed diabetes medicine, could add to its effect — so the prescriber needs to know and blood glucose needs watching.',
    ],
    src: DECK + 'slide 9 (NZNO Guidelines 2024, s 7.7); slides 14–15 for the example' },
  { ...R, pts: 2, q: 'Distinguish the biomedical view of medicine from the wholistic view, and give an example of a wholistic model.',
    steps: [
      'Biomedical view: illness is a fault in one part of the body, found and treated with a targeted intervention (reductionist). Wholistic view: the person is treated as a whole — body, mind, spirit, whānau and environment together.',
      'Example: Te Whare Tapa Whā — taha tinana, taha hinengaro, taha wairua and taha whānau; rongoā is itself a Māori model of health.',
    ],
    src: DECK + 'slides 2, 12 and 29' },
  { ...R, pts: 2, q: 'What is integrated medicine? Give an example.',
    steps: [
      'Definition: bringing evidence-based complementary and alternative therapies together with conventional (biomedical) care, sharing evidence between the two systems for the common goal of improving people’s health — while recognising that large gaps in the evidence remain.',
      'Example: a patient receiving mirimiri and karakia alongside their prescribed treatment, with the team and the practitioner each aware of what the other is doing.',
    ],
    src: DECK + 'slide 3 (Mortada, 2024)' },
  { ...R, pts: 2, q: 'What is Tikanga ā Rongoā (Ministry of Health, 2014), and what is it for?',
    steps: [
      'Definition: a voluntary standard, developed with the rongoā sector, that sets clear requirements for providers of rongoā services — a benchmark of excellence.',
      'Purpose / example: safe, quality rongoā care for tūroro (patients) — it supports consistent quality between providers and the ongoing development of the rongoā workforce.',
    ],
    src: DECK + 'slide 11' },
  { ...R, pts: 2, q: 'Health is described as a taonga under Te Tiriti o Waitangi. Explain what that means, and give a statistic that shows the obligation is not being met.',
    steps: [
      'Meaning: Te Tiriti guaranteed Māori the same rights and privileges as British subjects, and Māori retained tino rangatiratanga over their taonga (treasures) — health is a taonga, so there is a right to equal health outcomes.',
      'Statistic: life expectancy at birth is 7.1 years shorter for Māori than for non-Māori, with many of the worst health outcomes of any population in Aotearoa (Sheridan et al., 2024).',
    ],
    src: DECK + 'slide 7' },
  { ...R, pts: 2, q: 'What is te maramataka, and how is it used in health? Give an example.',
    steps: [
      'Definition: the Māori lunar calendar — an indigenous system of attuning with the environment.',
      'Use / example: each phase is associated with different energy, mood and activity levels, so it is used to anticipate wellbeing and to plan activity and rest around it — e.g. checking today’s phase for expected mood and energy.',
    ],
    src: DECK + 'slide 28 (Warbrick et al., 2023)' },
];
