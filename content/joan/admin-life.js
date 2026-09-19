/* Medication administration & education (Module 5) and medicines across the lifespan
   (Module 6) — short answers in JOAN'S STATED EXAM FORMAT: a definition plus an example,
   3–4 lines, no question about a specific drug. THE TOOL wrote every question and model
   answer; definitions follow the wording of her lecture decks (the slide is named), and the
   examples are kept generic on purpose. */
const A = { sys: 'admin', quiz: 'joan-admin', quizName: 'In Joan’s format · Administration & safety' };
const L = { sys: 'life', quiz: 'joan-life', quizName: 'In Joan’s format · Across the lifespan' };
const MA1 = 'deck 05 Medication Administration & Patient Education (1), ';
const MA2 = 'deck 05 Medication Administration & Patient Education (2), ';
const PD = 'deck 04 Pharmacodynamics, ';
const ELD = 'deck 06a Medication in the Elderly & Polypharmacy, ';
const LIFE = 'deck 07 Medications in Pregnancy, Lactation and Children, ';

export const SAQS = [
  /* ── Module 5 ── */
  { ...A, pts: 2, q: 'Define a medication error and give an example. How does it differ from an adverse effect?',
    steps: [
      'Definition: any preventable event that may cause or lead to inappropriate medication use or patient harm while the medication is in the control of the health professional, patient or consumer. Example: a dose given twice because the first was not documented, or a medicine given to a patient with a known allergy to it.',
      'Difference: an adverse effect is harm caused by the medicine itself, even when used correctly; a medication error is harm arising from human action — most trace back to a lapse in the rights and checks.',
    ],
    src: MA2 + 'slides 4–5' },
  { ...A, pts: 2, q: 'What is the “right to refuse” in medication administration? Give an example of what the nurse does when a patient refuses.',
    steps: [
      'Definition: a patient has the right to refuse a medication (unless being treated under the Mental Health Act) — an expression of informed consent and autonomy.',
      'Example: the nurse explains the consequences of not taking it, documents the refusal and the reason, informs the prescriber and the next shift, and discards the refused dose rather than storing it — no pressure, no hiding it in food.',
    ],
    src: MA1 + 'slide 39' },
  { ...A, pts: 2, q: 'What does the “right indication” require of the nurse giving a medication? Give an example.',
    steps: [
      'Meaning: the administering nurse is accountable for knowing WHY the medicine is being given — is it being given for the right reason for this patient?',
      'Example: a PRN (as-needed) medicine — the nurse must assess the patient and decide that the reason it was charted for is actually present before giving it.',
    ],
    src: MA1 + 'slide 40' },
  { ...A, pts: 2, q: 'What is CARM, and who can report to it? Give an example of something that should be reported.',
    steps: [
      'Definition: the Centre for Adverse Reactions Monitoring — New Zealand’s database of suspected adverse reactions to medicines and vaccines; health professionals, patients and whānau can all report.',
      'Example: a patient develops a widespread rash and facial swelling after starting a new medicine — it is documented, an alert is placed on their record, and it is reported to CARM.',
    ],
    src: PD + 'slide 48; deck 09 Legal & Ethical Aspects, slide 10' },

  /* ── Module 6 ── */
  { ...L, pts: 2, q: 'Define polypharmacy and give an example of a risk it raises.',
    steps: [
      'Definition: the concurrent use of multiple medications, usually five or more — with the connotation that too many, or unnecessary, medicines are being taken.',
      'Example (any one): an older adult on many medicines has a higher risk of drug–drug interactions and adverse effects, of falls, of not taking them as prescribed, and of death.',
    ],
    src: ELD + 'slides 34–36' },
  { ...L, pts: 2, q: 'How is an “older person” defined in Aotearoa New Zealand? Give an example of why age matters when giving medicines.',
    steps: [
      'Definition: aged 65 years and over — “young-old” 65–79, “old-old” 80+; frail elderly means 65+ with at least one debilitating condition. People age at very different rates.',
      'Example: kidney function declines with age, so a medicine cleared by the kidneys stays in the body longer and can build up to toxic levels — doses are often lower and adverse effects more common.',
    ],
    src: ELD + 'slides 4 and 16' },
  { ...L, pts: 2, q: 'When may a tablet be crushed for a patient who cannot swallow it? Give an example of the harm crushing can cause.',
    steps: [
      'Only when a pharmacist has advised that crushing does not compromise the medicine AND it is in the patient’s best interest.',
      'Example: crushing an enteric-coated or modified-release tablet releases the whole dose at once — it may be absorbed too rapidly and cause harm, or become less effective or ineffective.',
    ],
    src: ELD + 'slide 22' },
  { ...L, pts: 2, q: 'Define a teratogen and give an example. When is the risk highest?',
    steps: [
      'Definition: any substance or factor that can cause developmental abnormalities in a foetus during pregnancy — physical birth defects, developmental delay, intellectual disability.',
      'Example: some prescription medicines, and also over-the-counter and herbal products, alcohol, nicotine and drugs of misuse. The risk is highest in the first trimester (weeks 0–12), when the organs are forming.',
    ],
    src: LIFE + 'slide 8' },
  { ...L, pts: 2, q: 'On what does the transfer of a medicine into breast milk depend, and what is the guiding principle for a breastfeeding parent who needs medication?',
    steps: [
      'Most medicines can enter breast milk. How much reaches the infant depends on the parent’s plasma concentration of the drug, the amount of milk the infant consumes, and the drug’s lipid solubility.',
      'Principle, with example: maintaining the parent’s health is essential, so a needed medicine should not automatically be stopped — the prescriber weighs the risk to the infant against the risk of not treating the parent.',
    ],
    src: LIFE + 'slide 18' },
  { ...L, pts: 2, q: '“Children are just small adults.” Explain why this is false for medicines, and give an example.',
    steps: [
      'Children are physiologically different from adults and constantly developing: different body composition (about 75% water, less fat), immature protective barriers, and poorer temperature and homeostatic control — so they handle medicines differently.',
      'Example: a child’s dose is calculated from body weight (mg per kg), never by simply scaling down an adult dose.',
    ],
    src: LIFE + 'slides 24–25' },
];
