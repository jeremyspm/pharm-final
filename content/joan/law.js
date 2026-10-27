/* Legal & ethical (Module 7) — short answers in JOAN'S STATED EXAM FORMAT: a definition plus
   an example, 3–4 lines, no question about a specific drug (her words, 16 Sep 2026).
   THE TOOL wrote every question and model answer; the wording is not hers. Sources, in the
   order they were used: her own Escape Room answer sheet (Canvas file 08), her Legal &
   Ethical lecture of Wed 16 Sep 2026 (a student's recording, transcribed — cited by
   timestamp), and her deck 09 "Legal & Ethical Aspects of Pharmacology in Nursing" (slides). */
const R = { sys: 'law', quiz: 'joan-law', quizName: 'In Joan’s format · Legal & ethical' };
const LEC = 'Joan’s Legal & Ethical lecture, 16 Sep 2026, ';
const DECK = 'deck 09 Legal & Ethical Aspects, ';
const ESC = 'Joan’s Escape Room answer sheet (file 08), ';

export const SAQS = [
  { ...R, pts: 2, q: 'What is a controlled drug? Give an example of how controlled drugs are handled differently on a ward.',
    steps: [
      'Definition: a medicine placed under special legal restriction by the Misuse of Drugs Act 1975 because of its potential for abuse, dependence and harm. All controlled drugs are prescribed, but not all prescribed drugs are controlled.',
      'Example: opioids such as morphine (Class B) are kept in a double-locked safe inside a locked medication room with restricted key-holders, and there are penalties for unlawful prescribing, supply or administration.',
    ],
    src: LEC + '[00:00–02:39]; ' + DECK + 'slides 12–14' },
  { ...R, pts: 2, q: 'Define “scope of practice” and give an example of something outside a registered nurse’s scope.',
    steps: [
      'Definition: the area of practice a practitioner is educated, competent and authorised to work in, set by the regulatory authority (the Nursing Council) under the HPCAA — about demonstrated competence, not a list of tasks.',
      'Example (any one): prescribing a medicine (unless a designated RN prescriber) · dispensing — moving stock from bulk into a labelled patient pack is the pharmacist’s role · practising in a specialty the nurse has no training or experience in.',
    ],
    src: LEC + '[09:10] and [26:29]; ' + DECK + 'slides 7, 20 and 30–31' },
];
