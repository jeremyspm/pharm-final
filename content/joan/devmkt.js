/* Drug development & marketing (Module 7, deck 13) — short answers in JOAN'S STATED EXAM
   FORMAT: a definition plus an example, 3–4 lines, no question about a specific drug.
   Deck 13 was never lectured: on 16 Sep 2026 Joan reassigned it as a self-directed online
   package [59:31 of that lecture], still examinable. THE TOOL wrote every question and model
   answer, from the deck's own slides; ported from the estate's Deck 13 study pack
   (deck13-drug-development-STUDY-PACK.md, 16 Sep 2026) with a slide named for each. */
const R = { sys: 'law', quiz: 'joan-devmkt', quizName: 'In Joan’s format · Drug development & marketing' };
const DECK = 'deck 13 Drug Development & Marketing, ';
const LEC = 'Joan’s Legal & Ethical lecture, 16 Sep 2026, ';

export const SAQS = [
  { ...R, pts: 2, q: 'Define bioequivalence and explain why it matters, with an example.',
    steps: [
      'Definition: two formulations are bioequivalent when the same active ingredient reaches the bloodstream at the same rate and to the same extent.',
      'Why and example: a generic may only be substituted for a brand if it is bioequivalent, so the patient gets the same therapeutic effect — e.g. a pharmacy dispensing the funded generic instead of the original brand of the same medicine.',
    ],
    src: DECK + 'slide 6 (“Remember bioequivalence!”); defined in deck 01 Pharmacology Concepts (1), slides 49–50' },
  { ...R, pts: 2, q: 'What is Phase 4 of clinical research, and why does it exist? Give an example.',
    steps: [
      'Definition: post-market monitoring of long-term safety and effectiveness in several thousand patients over years, after Medsafe approval.',
      'Why and example: rare or delayed adverse effects only show up at population scale — e.g. a medicine withdrawn after post-market reports revealed a serious risk the trials were too small to see.',
    ],
    src: DECK + 'slides 11–12' },
  { ...R, pts: 2, q: 'What is direct-to-consumer advertising of medicines, and why is Aotearoa New Zealand unusual?',
    steps: [
      'Definition: advertising that promotes a specific branded prescription medicine to the public — its benefits, uses and risks.',
      'New Zealand is one of only two developed countries that permit it; most restrict prescription-medicine advertising to health professionals, because consumer advertising can drive demand for medicines that may not be appropriate.',
    ],
    src: DECK + 'slides 22 and 24' },
];
