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
  { ...R, pts: 3, q: 'Describe the three classes of controlled drug under the Misuse of Drugs Act 1975, with an example of each.',
    steps: [
      'Class A — high potential for abuse, very high risk of harm, never prescribed for medical use (e.g. heroin, methamphetamine).',
      'Class B — drugs of dependence with a high risk of harm; prescribing and dispensing are restricted and they must be kept in a double-locked safe (e.g. morphine and the other opioids).',
      'Class C — lower potential for abuse but may lead to dependence, moderate risk of harm; prescribed “normally” but still locked away (e.g. codeine, diazepam).',
    ],
    src: LEC + '[00:00–04:46]; ' + DECK + 'slide 14' },
  { ...R, pts: 3, q: 'Name the four legal classifications of medicines under the Medicines Act 1981 and give an example of one of them.',
    steps: [
      'Prescription medicine — supplied or administered only on a prescription from an authorised or designated prescriber, or by standing order. Restricted (pharmacist-only) medicine — sold only by a pharmacist, who must explain it to the patient.',
      'Pharmacy-only medicine — sold in a pharmacy or hospital. General sale medicine — anything not classified above, sold from any retail outlet.',
      'Example (any one): an antibiotic such as amoxicillin is prescription-only; a simple pain reliever such as paracetamol is general sale and can be bought in a supermarket.',
    ],
    src: ESC + 'Lock 1 Task 1; ' + DECK + 'slides 6 and 8' },
  { ...R, pts: 3, q: 'Distinguish an Act, a regulation and a policy, and give an example of each that governs medicines.',
    steps: [
      'An Act (statute) is a law made by Parliament — e.g. the Medicines Act 1981 or the Misuse of Drugs Act 1975.',
      'Regulations are made underneath an Act and give the instructions for how it is enforced — e.g. the Medicines Regulations 1984.',
      'A policy or procedure is an enforceable rule within one organisation — e.g. a hospital’s medication policy; organisations differ, so a nurse must know their own. (A guideline is best-practice advice.)',
    ],
    src: DECK + 'slides 3–6; ' + LEC + '[09:10–10:14]' },
  { ...R, pts: 2, q: 'Explain why a nurse may not give a prescription medicine on their own judgement, and give an example.',
    steps: [
      'Principle: prescription medicines may only be administered according to the direction of an authorised prescriber or a standing order — the dose, frequency and route. Nurses do not prescribe, and must also understand the therapeutic purpose of what they give.',
      'Example: a patient’s blood glucose is 18 mmol/L — the nurse cannot decide to give insulin; without a prescription or standing order they must contact the prescriber. (Even telling a colleague to “take a couple of paracetamol” is prescribing.)',
    ],
    src: LEC + '[04:46] and [09:10]; ' + DECK + 'slides 16 and 20' },
  { ...R, pts: 2, q: 'What does it mean to “insist on proper prescribing”? Give an example.',
    steps: [
      'Meaning: the nurse has a legal duty to question an incomplete or unclear prescription and to ask the prescriber clarifying questions before administering — not to guess, and not to withhold.',
      'Example: the route is missing, the allergies have not been checked, or the handwriting cannot be read — go back to the prescriber. In Joan’s story a nurse who “didn’t want to bother the doctor” left a patient in severe pain for a whole shift.',
    ],
    src: LEC + '[04:46–08:03]; ' + DECK + 'slide 16' },
  { ...R, pts: 2, q: 'What is the purpose of the Health Practitioners Competence Assurance Act 2003? Give one thing it requires of a registered nurse.',
    steps: [
      'Purpose: to protect public safety, by ensuring regulated health practitioners are competent and fit to practise and work within a defined scope of practice.',
      'Requirement (any one): work within the scope set by the Nursing Council · renew an annual practising certificate (APC) · show continuing clinical and cultural competence · be accountable through disciplinary pathways. (Healthcare assistants are not regulated under it.)',
    ],
    src: LEC + '[21:02–22:08]; ' + DECK + 'slides 29–31' },
  { ...R, pts: 2, q: 'Define “scope of practice” and give an example of something outside a registered nurse’s scope.',
    steps: [
      'Definition: the area of practice a practitioner is educated, competent and authorised to work in, set by the regulatory authority (the Nursing Council) under the HPCAA — about demonstrated competence, not a list of tasks.',
      'Example (any one): prescribing a medicine (unless a designated RN prescriber) · dispensing — moving stock from bulk into a labelled patient pack is the pharmacist’s role · practising in a specialty the nurse has no training or experience in.',
    ],
    src: LEC + '[09:10] and [26:29]; ' + DECK + 'slides 7, 20 and 30–31' },
  { ...R, pts: 2, q: 'What does “fitness to practise” mean? Give an example of something that could put it in doubt.',
    steps: [
      'Meaning: the nurse has the necessary qualifications and training, is healthy enough that no untreated physical or mental condition impedes their work, and is of good conduct and standing — it is not physical fitness.',
      'Example (any one): an arrest for possessing an illegal drug · sustained dishonesty or cheating as a student (the head of school signs a fitness-to-practise declaration before registration) · an open conduct investigation.',
    ],
    src: LEC + '[13:06] and [26:29–28:19]' },
  { ...R, pts: 3, q: 'Distinguish the Nursing Council of New Zealand from the New Zealand Nurses Organisation, and name the document each publishes about how nurses should act.',
    steps: [
      'NCNZ is the regulatory authority set up under the HPCAA: it registers, audits, disciplines and can de-register nurses. Its document is the Code of Conduct (behaviour) — enforceable, a breach can cost your registration.',
      'NZNO is a union with voluntary membership that represents and supports nurses. Its document is the Code of Ethics (2019) — a guideline, but expected of all RNs.',
      'Example of the difference: a nurse who hides a medication error can be disciplined by NCNZ; NZNO is who that nurse might turn to for advice and representation.',
    ],
    src: LEC + '[47:13–50:52]; ' + DECK + 'slide 90' },
];
