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
  { ...R, pts: 3, q: 'What does “pou” mean in the Nursing Council’s Standards of Competence? Name the six pou and give an example of one being compromised.',
    steps: [
      'Meaning: a pou is a pillar or post — the six pou hold up competent practice the way posts hold up a building.',
      'The six: Māori Health · Cultural Safety · Whanaungatanga & Communication · Pūkengatanga & Evidence-Informed Practice · Manaakitanga & People-Centred Care · Rangatiratanga & Leadership.',
      'Example: a nurse who knows a patient has taken his own opioid but does not tell the prescriber, document it or hand it over has compromised Whanaungatanga & Communication (and, by not escalating, Rangatiratanga & Leadership).',
    ],
    src: LEC + '[35:25–36:59]; ' + DECK + 'slide 38; ' + ESC + 'Lock 2' },
  { ...R, pts: 2, q: 'State one principle of the Nursing Council Code of Conduct and give an example of how it applies to medicines.',
    steps: [
      'Any one of the eight, e.g. Principle 7 — act with integrity to justify health consumers’ trust; Principle 4 — maintain trust by providing safe and competent care; Principle 2 — respect cultural needs and values.',
      'Matching example: P7 — report a medication error honestly and immediately, including someone else’s. P4 — double-check with another nurse before giving a medicine you have not given before. P2 — check the excipients, e.g. a gelatine capsule for a vegetarian or for religious reasons.',
    ],
    src: LEC + '[36:59–47:13]; ' + DECK + 'slides 55–62' },
  { ...R, pts: 2, q: 'Explain the nurse’s duty of privacy and confidentiality, and give an example involving a telephone enquiry.',
    steps: [
      'Duty (Code of Conduct Principle 5): protect personal health information and use or share it only for appropriate professional purposes — it is the patient’s information, and notes are accessed only by those caring for that patient.',
      'Example: a caller says she is a patient’s wife and asks how he is. The answer is “sorry, we can’t give patient information over the phone” — you cannot verify who is calling; offer to ring back or have the patient ring them.',
    ],
    src: LEC + '[43:04–45:07]; ' + DECK + 'slide 59' },
  { ...R, pts: 2, q: 'Define veracity and give an example of it in medication practice.',
    steps: [
      'Definition: truthfulness — being honest and giving accurate, clear and transparent information in all professional interactions (a Western value in the NZNO Code of Ethics).',
      'Example: telling a patient honestly what a medicine is for and what its common side effects are; or owning up to a medication error straight away. (Exceptions: therapeutic privilege, a patient who asks not to know, an emergency.)',
    ],
    src: LEC + '[50:52]; ' + DECK + 'slide 78' },
  { ...R, pts: 2, q: 'Define autonomy and give an example relating to medicines.',
    steps: [
      'Definition: the right of choice — informed, voluntary consent without coercion, with appropriate disclosure and checking of understanding, including the right to refuse and to withdraw at any time.',
      'Example: a competent patient declines a prescribed medicine. The nurse checks they understand the consequences, respects the refusal, documents it and informs the prescriber — they do not pressure or hide it in food.',
    ],
    src: LEC + '[56:25]; ' + DECK + 'slide 73' },
  { ...R, pts: 2, q: 'Define rangatiratanga as a value in the NZNO Code of Ethics and give a bedside example.',
    steps: [
      'Definition: self-determination — people’s right to make decisions about their own bodies and health, including refusing care entirely. Māori want self-determination over their own health, and so does every other patient.',
      'Example: supporting a patient and whānau to decide for themselves whether to start a treatment — giving the information, then respecting the choice even when the nurse would have chosen differently.',
    ],
    src: LEC + '[52:46]; ' + DECK + 'slide 64' },
  { ...R, pts: 3, q: 'Define beneficence and non-maleficence, and give an example where beneficence conflicts with another value.',
    steps: [
      'Beneficence: do good — acting in ways that promote the person’s wellbeing and improve outcomes.',
      'Non-maleficence: do no harm — avoiding physical, emotional or cultural harm and minimising risk.',
      'Conflict example: a medicine would do the patient good (beneficence) but the patient refuses it (autonomy) — the nurse may not override a competent refusal.',
    ],
    src: DECK + 'slides 74–75' },
  { ...R, pts: 2, q: 'What does PRN mean, and why did Joan call it an ethical problem? Give an example.',
    steps: [
      'Meaning: pro re nata — “as necessary”. It is an ethical problem because it is subjective: as necessary to whom, and who decides? The nurse’s judgement and beliefs shape whether the patient receives the medicine.',
      'Example: pain relief charted PRN — whether the patient gets it can depend on whether the nurse believes their pain, because unlike a fever there is no machine that measures it; fear of causing addiction also makes some nurses give less.',
    ],
    src: LEC + '[1:01:28–1:03:38]; ' + DECK + 'slide 89' },
  { ...R, pts: 2, q: 'Why is concealing a medication error treated more seriously than the error itself? Give an example.',
    steps: [
      'Reason: an error is usually accidental and is managed in-house — report it, reflect, be supervised for a time. Concealment is deliberate: it denies the patient monitoring and treatment, and it breaches integrity (Code of Conduct Principle 7), so it becomes professional misconduct.',
      'Example: “Nurse D” gave the wrong medicine, realised 20 minutes later, did nothing and took two days to report; the patient died. She was found guilty of professional misconduct, suspended, fined and supervised.',
    ],
    src: LEC + '[15:52–21:02] and [24:42]; ' + DECK + 'slides 26–27' },
  { ...R, pts: 2, q: 'Explain why patients should be taught the generic name of their medicines, and give an example of the harm when they are not.',
    steps: [
      'Reason: one medicine may be sold under several brand names; a patient who knows only the brand cannot tell staff what they already take, so the same medicine can be given twice. Medication education is a nursing responsibility.',
      'Example: in Joan’s escape-room scenario a man who knew his opioid only by its brand name said he had never had morphine, and was given a second dose from the hospital chart — he became drowsy, confused and nauseated.',
    ],
    src: ESC + 'Lock 1, Task 3' },
];
