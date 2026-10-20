/* Joan’s Formative mini-exam 1 — HER questions, answer key and model answers, VERBATIM (her typos kept), from the
   answers document on Canvas (Assessment Information → Exam Practice (Formative) Tests, published 20 Oct 2026).
   Transcribed by script from the .docx (yellow/green highlight = her key, red text = her model answer), then read by
   hand against the document. `why` is the TOOL’s explanation, written from her spoken feedback in class on 20 Oct (cited by timestamp).
   `any: k` = her answer lists alternatives and any k of them earn the marks. */
const R = { quiz: 'form1', quizName: 'Joan’s formative · mini-exam 1' };
const D = 'Joan’s Formative mini-exam 1, answers document';

export const MCQS = [
  { ...R, sys: "found", q: "The term “TDS” on a medication chart means that the patient requires their medication how frequently?",
    options: ["Three hourly", "Two times a day", "Through dermal stab", "Three times a day"], correct: 3,
    why: "TDS is three times a day. She: you must know every abbreviation — QID, TDS, Q6H, BD — to read a prescription; this exact one probably won't be on the paper, another will.",
    src: D + ', Q1' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:18:28]' },
  { ...R, sys: "pkpd", q: "Maximal drug efficacy is defined as",
    options: ["Maximum response a drug can produce", "The potency of a drug", "The drug’s relationship to agonists", "The half-life of a drug"], correct: 0,
    why: "Efficacy is the maximum response a drug can produce, from the pharmacodynamics lecture beside specificity, selectivity and potency. Her example: paracetamol is for mild to moderate pain; once it reaches its maximal efficacy you move to another class.",
    src: D + ', Q2' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:19:11]' },
  { ...R, sys: "imm", q: "Luisa, a 35-year-old woman, is prescribed an antibiotic for a post-operative wound infection. Luisa mentions she is “a little bit allergic to penicillin.” A medication (drug) allergy occurs when:",
    options: ["When ‘cellular memory’ takes place in the body", "When the body sees the medication (drug) as an antigen and an immune response is mounted against the drug", "When the body has an unwanted but predictable response to a medication (drug)", "When too much of a medication (drug) has accumulated in the body over time"], correct: 1,
    why: "An allergy is the immune system treating the drug as an antigen — an 'enemy' — and mounting a response. She stressed knowing the signs of drug allergy, and the word antigen as the basis of immunisation.",
    src: D + ', Q3' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:20:23]' },
  { ...R, sys: "tox", q: "Sione is reluctant to take his prescribed analgesic medicine because he fears becoming dependent on it. He asks what 'dependence' means. Which description is accurate for dependence?",
    options: ["Any repeated use of a medicine for pain relief that extends beyond six months", "Experiencing withdrawal symptoms if a prescribed drug is stopped abruptly", "A pattern of compulsive use with craving, loss of control, and continued use despite harm", "The onset of antisocial behaviour such as aggression, playing loud music, or refusing family activities"], correct: 1,
    why: "Her document marks C, but she corrected it in class: C (compulsive use, craving, loss of control, use despite harm) describes ADDICTION. Dependence is B — withdrawal symptoms if a prescribed drug is stopped abruptly. Using an inhaler every day is medical dependence, not addiction. This tool keys B.",
    src: D + ', Q4' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:21:49] and the correction [1:48:07–1:50:15]' },
  { ...R, sys: "pkpd", q: "A drug that binds to a cell receptor and effects a response is called",
    options: ["An agonist", "A receptor blocker", "A channel blocker", "An antagonist"], correct: 0,
    why: "An agonist binds a receptor and causes a response (an antagonist binds and does not) — pharmacodynamics.",
    src: D + ', Q5' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:22:42]' },
  { ...R, sys: "pkpd", q: "What does the acronym ADR stand for?",
    options: ["A drug response", "A dangerous reaction", "Avoidable drug response", "Adverse drug reaction"], correct: 3,
    why: "ADR = adverse drug reaction. The term has largely taken over from 'side effect'; adverse always means bad, and an allergic reaction is one kind of ADR.",
    src: D + ', Q6' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:23:16]' },
  { ...R, sys: "pkpd", q: "For medications that may be affected by very high first pass metabolism, which route of administration would NOT be prescribed?",
    options: ["Intravenous", "Intramuscular", "Sublingual", "Oral"], correct: 3,
    why: "A negative question — read it carefully. A drug with very high first-pass metabolism is broken down by the liver straight after absorption from the gut, so it is not given orally; an IV dose reaches the whole body before it ever gets to the liver.",
    src: D + ', Q7' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:24:55]' },
  { ...R, sys: "cam", q: "When therapies are used instead of conventional medicine in an effort to achieve the same therapeutic effect in the body, they are often referred to as:",
    options: ["Traditional therapies", "Complementary therapies", "Energy therapies", "Alternative therapies"], correct: 3,
    why: "'Instead of' is the key: alternative replaces conventional (Western) medicine; complementary — with an E — is used alongside it. Her memory hook: carrot juice instead of chemo is alternative; carrot juice with chemo is complementary.",
    src: D + ', Q8' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:30:29]' },
  { ...R, sys: "admin", q: "Which approach best supports health literacy when educating a patient about a new medication?",
    options: ["Use plain language and confirm understanding with teach-back", "Use medical terminology to ensure accuracy", "Provide written instructions only", "Give minimal explanation to avoid confusion"], correct: 0,
    why: "Teach-back — Ask, Build, Check, as in the CLS.",
    src: D + ', Q9' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:32:35]' },
  { ...R, sys: "found", q: "The benefit of an enteric-coated tablet is that it",
    options: ["Offers resistance to the digestive action of the stomach", "Cab be administered whole or crushed", "Can pass through the stomach without harming it", "Can be absorbed in the stomach"], correct: 0,
    why: "EC = enteric-coated: the coating resists the stomach and dissolves in the small intestine, because the drug irritates or ulcerates the stomach. C is close, but A is the best answer — watch for bold or underlined words.",
    src: D + ', Q10' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:32:58]' },
  { ...R, sys: "law", q: "A person can legally refuse to take their medication.",
    options: ["True. This should be documented", "False. This is an example of non-adherence", "True. The family members need to be notified", "False. Only patients who are in the community can do this"], correct: 0,
    why: "Anyone can legally refuse, so the two 'False' answers go. Family need not be told (her: you don't notify my husband). Document it and report it to the prescriber. The exception — the Mental Health (Compulsory Assessment and Treatment) Act — is not in this question.",
    src: D + ', Q11' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:34:32]' },
  { ...R, sys: "calc", q: "Pati, 3months old, weighs 11kg and is prescribed penicillin 20mg/kg every 8 hours. How many mg should be given in a single dose? (You do not need to show your working)",
    options: ["100mg", "50mg", "220mg", "300mg"], correct: 2,
    why: "Read what is asked: just the milligrams, not the mL. 11 kg × 20 mg/kg = 220 mg. The age and weight are the question’s, for the arithmetic.",
    src: D + ', Q12' + ' · Joan’s feedback in class, Tue 20 Oct 2026 [1:35:58]' },
];

export const SAQS = [
  { ...R, sys: "found", pts: 1, q: "What does prophylaxis mean? (1pt)",
    steps: [
      "Prevention of a disease before it occurs",
    ],
    src: D + ', short answer Q13 · Joan’s feedback in class, Tue 20 Oct 2026 [1:36:26]' },
  { ...R, sys: "found", pts: 1, q: "Name one medication that is an example of prophylaxis (1pt)",
    steps: [
      "(e.g.) The influenza vaccine",
    ],
    src: D + ', short answer Q14 · her answer gives examples · Joan’s feedback in class, Tue 20 Oct 2026 [1:37:47]' },
  { ...R, sys: "found", pts: 2, q: "Medications have three names: A chemical name, a generic name, and a brand name. Which of these names is most important for the Registered Nurse to use in practice AND why? (2pt)",
    steps: [
      "Generic Name",
      "Generic names are internationally approved, and used by both prescribers and medication administrators. They reduce the risk of medication errors, and allow pharmacists to dispense the most cost-effective options for families.",
    ],
    src: D + ', short answer Q15 · Joan’s feedback in class, Tue 20 Oct 2026 [1:38:41]' },
  { ...R, sys: "found", pts: 1, q: "Which entity in Aotearoa New Zealand is responsible for assessing and monitoring the quality and safety of medications? (1pt)",
    steps: [
      "Medsafe",
    ],
    src: D + ', short answer Q16 · Joan’s feedback in class, Tue 20 Oct 2026 [1:41:11]' },
  { ...R, sys: "admin", pts: 1, q: "Define medication adherence (1pt)",
    steps: [
      "Where a patient takes their prescribed medication according to the medication plan that they agreed on with their prescriber. This might include the dose, route, frequency",
    ],
    src: D + ', short answer Q17 · Joan’s feedback in class, Tue 20 Oct 2026 [1:41:45]' },
  { ...R, sys: "admin", pts: 4, q: "List four (FOUR) barriers that may prevent a patient from achieving medication adherence (4pt)",
    steps: [
      "Inability to access their medication e.g. they do not have transport to the pharmacy",
      "They do not understand why they need to take the medication",
      "They may have a physical impairment that prevents them from being able to open the packaging",
      "They may live a very busy lifestyle and forget to take doses",
    ],
    src: D + ', short answer Q18 · her answer gives examples · Joan’s feedback in class, Tue 20 Oct 2026 [1:42:50]' },
  { ...R, sys: "life", pts: 2, q: "What is one piece of safe advice a Registered Nurse could discuss with a parent who is going to be storing and administering oral amoxicillin suspension to their child for the first time? (2pt)",
    any: 1,
    steps: [
      "It must be stored in the fridge",
      "It must be stored out of reach of the child",
      "You must finish the whole course to completely treat the infection",
      "Use a proper medicine measuring cup or syringe, rather than a household teaspoon to measure",
    ],
    src: D + ', short answer Q19 · her answer gives examples · Joan’s feedback in class, Tue 20 Oct 2026 [1:45:43]' },
];
