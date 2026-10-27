/* Professional conduct & ethics (Module 7, second half) — short answers in JOAN'S STATED EXAM
   FORMAT: a definition plus an example, 3–4 lines, no question about a specific drug.
   THE TOOL wrote every question and model answer; the wording is not hers. Sources: her Legal
   & Ethical lecture of Wed 16 Sep 2026 (recording, cited by timestamp), her Escape Room answer
   sheet (Canvas file 08) and her deck 09 (slides). Slides 38–45 and 64–83 were set as
   self-study in that lecture — still examinable ("these will be assessed in your exam"). */
const R = { sys: 'law', quiz: 'joan-ethics', quizName: 'In Joan’s format · Conduct, competence & ethics' };
const LEC = 'Joan’s Legal & Ethical lecture, 16 Sep 2026, ';
const DECK = 'deck 09 Legal & Ethical Aspects, ';
const ESC = 'Joan’s Escape Room answer sheet (file 08), ';

export const SAQS = [
  { ...R, pts: 2, q: 'Explain the nurse’s duty of privacy and confidentiality, and give an example involving a telephone enquiry.',
    steps: [
      'Duty (Code of Conduct Principle 5): protect personal health information and use or share it only for appropriate professional purposes — it is the patient’s information, and notes are accessed only by those caring for that patient.',
      'Example: a caller says she is a patient’s wife and asks how he is. The answer is “sorry, we can’t give patient information over the phone” — you cannot verify who is calling; offer to ring back or have the patient ring them.',
    ],
    src: LEC + '[43:04–45:07]; ' + DECK + 'slide 59' },
  { ...R, pts: 2, q: 'Define autonomy and give an example relating to medicines.',
    steps: [
      'Definition: the right of choice — informed, voluntary consent without coercion, with appropriate disclosure and checking of understanding, including the right to refuse and to withdraw at any time.',
      'Example: a competent patient declines a prescribed medicine. The nurse checks they understand the consequences, respects the refusal, documents it and informs the prescriber — they do not pressure or hide it in food.',
    ],
    src: LEC + '[56:25]; ' + DECK + 'slide 73' },
  { ...R, pts: 2, q: 'Why is concealing a medication error treated more seriously than the error itself? Give an example.',
    steps: [
      'Reason: an error is usually accidental and is managed in-house — report it, reflect, be supervised for a time. Concealment is deliberate: it denies the patient monitoring and treatment, and it breaches integrity (Code of Conduct Principle 7), so it becomes professional misconduct.',
      'Example: “Nurse D” gave the wrong medicine, realised 20 minutes later, did nothing and took two days to report; the patient died. She was found guilty of professional misconduct, suspended, fined and supervised.',
    ],
    src: LEC + '[15:52–21:02] and [24:42]; ' + DECK + 'slides 26–27' },
];
