/* Foundations (Module 1) and pharmacokinetics & pharmacodynamics (Modules 3–4) — short
   answers in JOAN'S STATED EXAM FORMAT: a definition plus an example, 3–4 lines, no question
   about a specific drug. Her own worked example of the format, 16 Sep 2026 [1:05:06]: "what is
   the meaning of contraindication, and give an example" — it is the first question here.
   THE TOOL wrote every question and model answer; definitions follow the wording of her
   lecture decks (the slide is named), and the examples are kept generic on purpose. */
const F = { sys: 'found', quiz: 'joan-found', quizName: 'In Joan’s format · Foundations' };
const K = { sys: 'pkpd', quiz: 'joan-pkpd', quizName: 'In Joan’s format · Pharmacokinetics & dynamics' };
const C1 = 'deck 01 Pharmacology Concepts (1), ';
const C2 = 'deck 01 Pharmacology Concepts (2), ';
const PK1 = 'deck 04 Pharmacokinetics (1), ';
const PK2 = 'deck 04 Pharmacokinetics (2), ';
const PD = 'deck 04 Pharmacodynamics, ';

export const SAQS = [
  { ...F, pts: 2, q: 'What is the meaning of “contraindication”? Give an example.',
    steps: [
      'Definition: a situation in which a medication should NOT be used, because it may be harmful to the person.',
      'Example: a known severe allergy to that medicine — it must not be given; or a medicine known to harm the foetus in a woman who is pregnant.',
    ],
    src: 'Joan’s own example of a short answer, Legal & Ethical lecture 16 Sep 2026 [1:05:06]; definition from ' + C1 + 'slide 31' },
  { ...F, pts: 2, q: 'Define a medication interaction and give an example.',
    steps: [
      'Definition: a reaction in which the effect or activity of a medication is altered by another substance or condition — another medication, a food, a complementary or alternative medicine, or a medical condition.',
      'Example: a herbal remedy or a food that changes how much of a prescribed medicine is absorbed or broken down, making it stronger or weaker — which is why a nurse asks about everything the person takes.',
    ],
    src: C1 + 'slide 32' },
  { ...F, pts: 2, q: 'Distinguish a local effect from a systemic effect of a medication, and give an example of each.',
    steps: [
      'Local effect: the effect occurs at the immediate site of administration — e.g. a cream applied to a skin rash, or eye drops.',
      'Systemic effect: the medication must be absorbed into the circulation and distributed to the place where it acts — e.g. a tablet swallowed for a headache.',
    ],
    src: C2 + 'slides 26–27' },
  { ...K, pts: 2, q: 'Define bioavailability and give an example comparing two routes.',
    steps: [
      'Definition: how much of the dose actually reaches the bloodstream.',
      'Example: intravenous = 100%; the same medicine by mouth is lower, because some is not absorbed from the gut and some is broken down by the liver before it reaches the circulation.',
    ],
    src: PK1 + 'slide 34' },
  { ...K, pts: 2, q: 'What is plasma protein binding, and why does it matter? Give an example.',
    steps: [
      'Definition: many drugs bind reversibly to plasma proteins, mainly albumin; only the FREE (unbound) drug can leave the blood and have an effect.',
      'Example: two highly protein-bound medicines compete for the same binding site, or a malnourished older adult has low albumin — more free drug circulates, so the effect and the risk of toxicity increase.',
    ],
    src: PK1 + 'slides 37–38' },
  { ...K, pts: 2, q: 'Define half-life and give an example of how it is used.',
    steps: [
      'Definition: the time taken for the plasma concentration of a drug to fall by one half — not how long the whole drug stays in the body.',
      'Example: a medicine with a 6-hour half-life is almost completely cleared after about 5 half-lives (30 hours), and takes about 3–5 half-lives of regular dosing to reach steady state — which is what sets the dosing interval.',
    ],
    src: PK2 + 'slides 32 and 38; speaker notes to deck 09 slide 20' },
  { ...K, pts: 2, q: 'Define the therapeutic range and give an example of when it is monitored.',
    steps: [
      'Definition: the range of plasma concentration within which a drug produces its desired effect without causing toxicity — above the minimum effective concentration and below the toxic one.',
      'Example: therapeutic drug monitoring for a medicine with a NARROW therapeutic range (such as some anticoagulants) — blood levels are taken at peak and trough to keep the dose safe and effective.',
    ],
    src: PK2 + 'slides 36–37' },
];
