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
];
