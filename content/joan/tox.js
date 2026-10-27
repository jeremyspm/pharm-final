/* Licit and illicit drugs & toxicology (Module 9) — the self-directed session of Wed 21 Oct 2026 (the lecturers were on
   strike). Its Canvas module dropped that afternoon: one deck, "Licit and Illicit Drugs.pptx" (41 slides), and a page
   pointing at the For-interest articles (tobacco, coffee, overdose deaths, drug checking at festivals, marijuana).
   THE TOOL wrote every question and model answer here; definitions follow the deck's wording (the slide is named).

   Her rule for this deck (slide 3): "If you see Pusheen the cat on the slide, you may be tested on the concept but not
   the statistics or finer details." Pusheen is on slides 3, 11, 15, 16, 20, 21, 23, 24, 27, 28, 30, 31 and 32 — the
   withdrawal symptoms, the substance use disorder criteria and severity bands, stimulant or depressant, the slang, the
   drug-combination chart and every statistic. A question cut from one of those asks the concept only, and its src says
   "Pusheen slide". Everything else (the seven terms, licit and illicit, risk factors, interactions, supports,
   toxicology, antidotes) is examinable in full.

   Her announcement (week 11): "Note key words and definitions eg addiction, dependence, as the L/O for this session will
   be tested in the Exam." Her 20 Oct correction stands over the deck: on her formative (mini-exam 1 Q4), DEPENDENCE is
   withdrawal symptoms when a drug is stopped abruptly, and compulsive use with craving, loss of control and use despite
   harm is ADDICTION [1:48:07–1:50:15]. */
const R = { sys: 'tox', quiz: 'joan-tox', quizName: 'In Joan’s format · Licit & illicit drugs, toxicology' };
const M = { sys: 'tox', quiz: 'tox', quizName: 'M9 · Licit & illicit drugs, toxicology' };
const D = 'deck Licit and Illicit Drugs (Module 9), ';
const J = 'Joan in class, Tue 20 Oct 2026 ';

export const SAQS = [
  { ...R, pts: 2, q: 'Define a licit drug and an illicit drug, with an example of each.',
    steps: [
      'Licit: a medication or drug that is lawful and permitted — prescription, restricted, pharmacy-only and general sale medicines, and some controlled drugs (some Class B and C). Example: alcohol, or an opioid analgesic taken as prescribed.',
      'Illicit: a drug that is unlawful or otherwise not permitted — every Class A controlled drug, some Class B and a few Class C. Example: methamphetamine (Class A).',
    ],
    src: D + 'slides 7 and 19' },
  { ...R, pts: 2, q: 'Define drug tolerance and give an example.',
    steps: [
      'Definition: a physical state in which repeated doses of a drug cause decreasing effects, or the dose must be increased to maintain the same effect (receptor downregulation, from pharmacodynamics).',
      'Example: a person on regular morphine needs higher doses for the same pain relief — morphine users develop tolerance rapidly, whereas marijuana causes little tolerance. Not every drug causes it.',
    ],
    src: D + 'slide 13' },
  { ...R, pts: 2, q: 'What is withdrawal? Give an example of its symptoms and what affects how severe it is.',
    steps: [
      'Definition: the symptoms when a person who is physically dependent stops or cuts down a substance. It ranges from mild to severe and lasts days or weeks, depending on the substance, how long it was used, age, other conditions and psychological state, and whether it was weaned or stopped “cold turkey”.',
      'Example: general symptoms such as insomnia, fatigue, irritability and cravings; severe withdrawal can bring paranoia, confusion, tremors and disorientation.',
    ],
    src: D + 'slide 11 (a Pusheen slide: the concept, not the full symptom list)' },
  { ...R, pts: 2, q: 'What is harm reduction? Give an example from Aotearoa New Zealand.',
    steps: [
      'Definition: reducing the harm of drug use for people who are going to use anyway, rather than only telling them not to — for example education about which combinations are dangerous.',
      'Example: free, legal drug checking at festivals and clinics (Know Your Stuff NZ, legal since the Misuse of Drugs Act was changed), or making naloxone available to people at risk of an opioid overdose.',
    ],
    src: D + 'slide 27 · For-interest articles on drug checking (NZ Herald, 2023; Stuff, 2022) and overdose deaths (NZ Herald, 2024)' },
  { ...R, pts: 2, q: 'Define an antidote and give an example.',
    steps: [
      'Definition: a substance that counteracts a poison — by binding it to reduce the free toxin, by slowing or speeding an enzyme, or by blocking its receptors (an antagonist).',
      'Example: naloxone (Narcan) is an opioid antagonist that reverses an opioid overdose; N-acetylcysteine (NAC) reduces the toxic metabolites made from paracetamol in a paracetamol overdose.',
    ],
    src: D + 'slides 39–40' },
];

export const MCQS = [
  { ...M, q: "A patient on regular morphine says the same dose no longer controls their pain. This is most likely:",
    options: ["Addiction","Tolerance","Drug abuse","An allergy"], correct: 1,
    why: "Tolerance: repeated doses cause decreasing effects, or the dose must rise to keep the same effect. Morphine users develop tolerance rapidly; marijuana causes little.",
    src: "deck Licit and Illicit Drugs (Module 9), slide 13" },
  { ...M, q: "Which describes acute poisoning?",
    options: ["A poison building up over years","A poison entering the body in a short time","Needing more drug for the same effect","A bee sting"], correct: 1,
    why: "Acute: the poison enters the body in a short time. Chronic: it accumulates gradually.",
    src: "deck Licit and Illicit Drugs (Module 9), slide 37" },
  { ...M, q: "Naloxone (Narcan) reverses an opioid overdose because it is:",
    options: ["An opioid agonist","An opioid antagonist","A gut binder","An enzyme"], correct: 1,
    why: "Naloxone blocks the opioid receptors — an antagonist (receptor blocking is one of the ways antidotes work).",
    src: "deck Licit and Illicit Drugs (Module 9), slide 40" },
  { ...M, q: "N-acetylcysteine (NAC) is the antidote to an overdose of:",
    options: ["Morphine","Paracetamol","Alcohol","Benzodiazepines"], correct: 1,
    why: "NAC reduces the production of the toxic metabolites made from paracetamol.",
    src: "deck Licit and Illicit Drugs (Module 9), slide 40" },
];
