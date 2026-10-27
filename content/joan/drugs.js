/* The drugs Joan named in her first revision session (Tue 20 Oct 2026 [0:19:23–0:25:39]) — paracetamol, salbutamol,
   aspirin with warfarin and heparin, GTN, the penicillins/amoxicillin, morphine — and two easy calculations, in the shape
   of her Formative mini-exams: a short stem, short options, a calculation with "(You do not need to show your working)".
   THE TOOL wrote them (27 Oct 2026), each from a lecture slide it names; they are the intro-pharm hub's questions on those
   drugs, cut down when the rest of that port was dropped. There is no drug-by-drug deck, so nothing here goes past what
   a slide says about the drug. */
const R = { sys: 'found', quiz: 'joan-drugs', quizName: 'The drugs she named · the tool’s questions' };
const C = { sys: 'calc', quiz: 'joan-calc', quizName: 'Easy calculations · the tool’s questions' };
const TAPE = ' · Joan’s 20 Oct revision session [0:19:23–0:25:39]';

export const MCQS = [
  { ...R, q: 'GTN spray for angina is given under the tongue. This route is:',
    options: ['Buccal', 'Sublingual', 'Enteral', 'Intradermal'], correct: 1,
    why: 'Sublingual is under the tongue: GTN enters the bloodstream directly and acts very quickly. Buccal is through the lining of the cheek.',
    src: 'Pharmacology Concepts (2) 2026 slide 31' + TAPE },
  { ...R, q: 'A patient on warfarin starts taking aspirin. The main risk is:',
    options: ['Bleeding', 'Blood clots', 'An asthma attack', 'Liver damage'], correct: 0,
    why: 'Warfarin and aspirin both inhibit clotting, in different ways, so together their effects add up (an additive interaction): the risk of bleeding rises.',
    src: 'Pharmacodynamics 2026 slide 45' + TAPE },
  { ...R, q: 'A patient who uses a salbutamol inhaler for asthma is started on metoprolol (a beta blocker). What may happen?',
    options: ['The salbutamol works less well', 'The salbutamol works better', 'The risk of bleeding rises', 'Nothing — they do not interact'], correct: 0,
    why: 'Salbutamol is a beta agonist that opens the airways; metoprolol is a beta antagonist that blocks the same receptors, so the reliever works less well in the lungs.',
    src: 'Pharmacodynamics 2026 slide 45' + TAPE },
  { ...R, q: 'Morphine is which class of controlled drug?',
    options: ['Class A', 'Class B', 'Class C', 'Not a controlled drug'], correct: 1,
    why: 'Class B: drugs of dependence with a high risk of harm, restricted prescribing and dispensing, kept in a double-locked safe — e.g. morphine. Class A drugs (heroin, cocaine) are not prescribed for medical use.',
    src: 'Legal & Ethical 2026 slide 14' + TAPE },
  { ...R, q: 'The suffix “-cillin”, as in amoxicillin, tells you the drug is:',
    options: ['A beta blocker', 'A penicillin antibiotic', 'A statin', 'A proton pump inhibitor'], correct: 1,
    why: '-cillin is the penicillin family (amoxicillin); -olol is a beta blocker (metoprolol); -statin lowers cholesterol (atorvastatin).',
    src: 'Pharmacology Concepts (1) 2026 slide 42' + TAPE },
  { ...R, q: 'Which medicine is in Pregnancy Category A?',
    options: ['Isotretinoin', 'Paracetamol', 'Tetracycline', 'Cocaine'], correct: 1,
    why: 'Category A: taken by a large number of pregnant people without any proven increase in malformations or other harm. Paracetamol is the deck’s example; Category X is the contraindicated end.',
    src: 'Lifespan 2026 slide 15' + TAPE },
  { ...C, q: 'A child is prescribed paracetamol 250 mg. The suspension is 200 mg/5 mL. How many mL should be given? (You do not need to show your working)',
    options: ['5 mL', '6.25 mL', '4 mL', '62.5 mL'], correct: 1,
    why: 'Want ÷ got × volume: 250 mg ÷ 200 mg × 5 mL = 6.25 mL. The units already match, so nothing to convert.',
    src: 'Medication Calculations 2026 slides 27–29 (worked example 4)' },
  { ...C, q: 'Morphine 4 mg is prescribed. You dilute a 1 mL ampoule of 5 mg/mL with 9 mL of sterile water. How many mL should be given? (You do not need to show your working)',
    options: ['0.8 mL', '4 mL', '8 mL', '10 mL'], correct: 2,
    why: 'Add first: 1 mL + 9 mL = 10 mL, still holding 5 mg. Then 4 mg ÷ 5 mg × 10 mL = 8 mL.',
    src: 'Medication Calculations 2026 slides 99–100 (worked example 24)' },
];

export const SAQS = [
  { ...R, pts: 2, q: 'Why should paracetamol not be given to a baby under 3 months (or under 5 kg) without medical advice?',
    steps: [
      'The baby’s liver enzymes are not yet developed, so paracetamol is metabolised more slowly.',
      'Toxic metabolites build up in the blood, so the risk of overdose and liver injury is higher.',
    ],
    src: 'Lifespan 2026 slide 29 (BPAC NZ, 2018)' + TAPE },
];
