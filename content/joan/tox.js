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
  /* ── the seven terms (slides 6–13): her learning outcome, her "key words and definitions" ── */
  { ...R, pts: 2, q: 'Define a licit drug and an illicit drug, with an example of each.',
    steps: [
      'Licit: a medication or drug that is lawful and permitted — prescription, restricted, pharmacy-only and general sale medicines, and some controlled drugs (some Class B and C). Example: alcohol, or an opioid analgesic taken as prescribed.',
      'Illicit: a drug that is unlawful or otherwise not permitted — every Class A controlled drug, some Class B and a few Class C. Example: methamphetamine (Class A).',
    ],
    src: D + 'slides 7 and 19' },
  { ...R, pts: 2, q: 'Define drug misuse and give an example.',
    steps: [
      'Definition: the use of any substance for a purpose that is different from legal or medical guidelines (World Health Organization). Under Aotearoa New Zealand law it means any illegal, harmful or unauthorised use of a controlled drug under the Misuse of Drugs Act 1975.',
      'Example: taking a medicine prescribed for someone else, or taking a prescribed medicine for a purpose it was not prescribed for, such as to get high.',
    ],
    src: D + 'slide 8' },
  { ...R, pts: 2, q: 'Define drug abuse and give an example. How is it different from misuse?',
    steps: [
      'Definition: self-administration of a drug or substance in chronically excessive amounts, in a way that differs from approved medical use or the usual social patterns of the culture, and that results in physical or psychological harm.',
      'Example and difference: drinking heavily every day until it damages health, work or relationships. Misuse is use outside legal or medical guidelines; abuse adds chronically excessive amounts and harm — and what counts as abuse depends on a society’s laws, history, religion and ethos.',
    ],
    src: D + 'slides 8–9 and the speaker notes' },
  { ...R, pts: 3, q: 'Define drug dependence. What is the difference between psychological and physical dependence? Give an example.',
    steps: [
      'Definition: a drug is pursued compulsively, without a therapeutic indication (no medical need), and despite adverse effects — psychological, social and/or physical.',
      'Psychological dependence: out-of-control cravings, often with denial. Physical dependence: not using the drug causes withdrawal symptoms — her formative’s answer: withdrawal symptoms if a prescribed drug is stopped abruptly.',
      'Example: a person who has taken an opioid for months gets withdrawal symptoms when it is stopped suddenly, so it is weaned. A person can also be medically dependent on a medicine, such as insulin or a daily inhaler — that is not addiction.',
    ],
    src: D + 'slide 10 and the speaker notes · her Formative mini-exam 1 Q4 and ' + J + '[1:48:07–1:50:15]' },
  { ...R, pts: 3, q: 'Define drug addiction and give an example. How is addiction different from dependence?',
    steps: [
      'Definition: a behavioural pattern of drug use — overwhelming involvement in getting the drug and using the drug, with impairment in three functional systems (motivation-reward, mood and behavioural inhibition) and a high tendency to relapse.',
      'Example: a person who keeps using despite losing their job and relationships, and relapses after stopping. The same behavioural pattern can occur in gambling, disordered eating or shopping.',
      'Difference: addiction is compulsive use with craving, loss of control and continued use despite harm; dependence is withdrawal symptoms when the drug is stopped. Someone on a daily inhaler is dependent on it, not addicted to it.',
    ],
    src: D + 'slide 12 · ' + J + '[1:48:29–1:50:15] · her Formative test three Q5' },
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
  { ...R, pts: 2, q: 'What is a substance use disorder, and how is it diagnosed?',
    steps: [
      'Definition: a mental health condition, diagnosed with the DSM-5 (the Diagnostic and Statistical Manual of Mental Disorders), in which use of a substance causes problems in a person’s life.',
      'Diagnosis: by the number of the eleven criteria met — the more criteria, the more severe (mild, moderate, severe). Example criteria: cravings, failing to cut down, needing more for the same effect (tolerance), withdrawal symptoms.',
    ],
    src: D + 'slides 14–16 (15–16 are Pusheen slides: the concept, not the criteria counts)' },
  { ...R, pts: 2, q: 'Name the four groups of risk factors for substance abuse in young adults, and give an example of one.',
    steps: [
      'The four groups: family-related, individual, social and environmental, and behavioural.',
      'Example (any one): family — relatives who use, stress at home, childhood trauma; individual — an impulsive personality, mental ill health, access through a prescription after an injury; social — peer influence, cultural and societal acceptance, the law; behavioural — frequent use, at first “socially”.',
    ],
    src: D + 'slide 17 and the brainstorm notes on slide 14 (Alhammad et al., 2022)' },

  /* ── interactions, supports and the nurse’s role (slides 3, 25–28, 33–34) ── */
  { ...R, pts: 2, q: 'What is a medication–drug interaction, and how can a nurse check for one? Give an example.',
    steps: [
      'Definition: a licit or illicit substance (alcohol, marijuana, nicotine, sedatives, opioids) changes the effect of a medication, or the two together cause harm. The nurse checks with the New Zealand Formulary’s Interactions checker.',
      'Example: alcohol taken with another depressant, such as an opioid or a benzodiazepine, raises the risk of overdose — over a third of New Zealand’s fatal overdoses involved alcohol.',
    ],
    src: D + 'slides 25–28 · For-interest article “Drug overdose deaths rising in NZ” (NZ Herald, 2024)' },
  { ...R, pts: 2, q: 'What is the nurse’s role with a person whose substance use is a concern? Give an example of where a nurse can refer them.',
    steps: [
      'Role: anyone can take drugs, so avoid stereotyping; ask about use, give a brief intervention, offer referrals, follow up and advocate — and use it as a chance for harm-reduction education.',
      'Example: Community Alcohol and Drug Services (CADS), including Te Ātea Marinō (the Māori CADS service), Tupu (Pasifika) and Altered High (youth), or a rehabilitation provider such as Odyssey House; information at the Drug Foundation, The Level and Alcohol Drug Help websites.',
    ],
    src: D + 'speaker notes on slide 3, slides 27 and 33–34' },
  { ...R, pts: 2, q: 'What is harm reduction? Give an example from Aotearoa New Zealand.',
    steps: [
      'Definition: reducing the harm of drug use for people who are going to use anyway, rather than only telling them not to — for example education about which combinations are dangerous.',
      'Example: free, legal drug checking at festivals and clinics (Know Your Stuff NZ, legal since the Misuse of Drugs Act was changed), or making naloxone available to people at risk of an opioid overdose.',
    ],
    src: D + 'slide 27 · For-interest articles on drug checking (NZ Herald, 2023; Stuff, 2022) and overdose deaths (NZ Herald, 2024)' },

  /* ── toxicology: poisoning, overdose, antidotes (slides 35–40) ── */
  { ...R, pts: 2, q: 'Define poisoning. What is the difference between acute and chronic poisoning? Give an example.',
    steps: [
      'Definition: harm from a substance taken in or contacted — by ingestion or contact with chemicals such as heavy metals, pesticides or household cleaners; usually accidental. Most things can be poisonous, depending on how much is taken, the person’s age and size, whether they are already unwell, and other medicines it may react with.',
      'Acute: the poison enters the body in a short time — for example a child swallows household cleaner. Chronic: it builds up gradually in the body — for example heavy metals over months.',
    ],
    src: D + 'slide 37' },
  { ...R, pts: 2, q: 'What is the difference between poisonous and venomous? Give an example of each.',
    steps: [
      'Poisonous: you touch or eat it and you get hurt — for example a poisonous plant, berry or mushroom.',
      'Venomous: it bites or stings you and you get hurt — for example a bee, a wasp or the katipō spider (New Zealand has very few venomous creatures).',
    ],
    src: D + 'slide 36 and the speaker notes' },
  { ...R, pts: 2, q: 'What is the National Poisons Centre, and when should someone call it? Give an example.',
    steps: [
      'Definition: a free, 24-hour advice line — 0800 764 766 (0800 POISON). Call 111 instead if the person is unconscious or has stopped breathing.',
      'When (any one): someone has swallowed a medicine, household product, chemical or poisonous plant, berry or mushroom; taken too much medication (an overdose); inhaled harmful fumes; splashed a toxic substance on the eyes or skin; or has symptoms from a “recreational” drug.',
    ],
    src: D + 'slide 38 and the speaker notes' },
  { ...R, pts: 2, q: 'Define an antidote and give an example.',
    steps: [
      'Definition: a substance that counteracts a poison — by binding it to reduce the free toxin, by slowing or speeding an enzyme, or by blocking its receptors (an antagonist).',
      'Example: naloxone (Narcan) is an opioid antagonist that reverses an opioid overdose; N-acetylcysteine (NAC) reduces the toxic metabolites made from paracetamol in a paracetamol overdose.',
    ],
    src: D + 'slides 39–40' },
];

export const MCQS = [
  { ...M, q: 'Which of these is a LICIT drug?',
    options: ['A Class A controlled drug', 'A general sale medicine', 'Any drug that is not permitted', 'A drug bought without a prescription from a dealer'], correct: 1,
    why: 'Licit = lawful and permitted: prescription, restricted, pharmacy-only and general sale medicines, and some Class B and C controlled drugs. Every Class A drug is illicit.',
    src: D + 'slide 7' },
  { ...M, q: 'Which statement about illicit drugs is correct?',
    options: ['They include every Class A controlled drug, some Class B and a few Class C', 'They include every controlled drug', 'They include only Class C controlled drugs', 'They are drugs that can be prescribed but are often misused'], correct: 0,
    why: 'Illicit = unlawful or not permitted: all Class A, some Class B and a few Class C. Some controlled drugs (some of Class B and C) are licit — morphine, for example, is prescribed.',
    src: D + 'slide 7' },
  { ...M, q: 'Under Aotearoa New Zealand law, “drug misuse” refers to',
    options: ['Taking any medicine more than once a day', 'Any illegal, harmful or unauthorised use of a controlled drug under the Misuse of Drugs Act 1975', 'Any use of alcohol or tobacco', 'Forgetting to take a prescribed medicine'], correct: 1,
    why: 'Clinically, misuse is using any substance for a purpose different from legal or medical guidelines (WHO). Legally, in NZ, it is illegal, harmful or unauthorised use of a controlled drug under the Misuse of Drugs Act 1975.',
    src: D + 'slide 8' },
  { ...M, q: 'Self-administration of a substance in chronically excessive amounts, differing from approved medical use or usual social patterns, and resulting in physical or psychological harm, is',
    options: ['Drug tolerance', 'Drug misuse', 'Drug abuse', 'Physical dependence'], correct: 2,
    why: 'That is the deck’s definition of drug abuse: chronically excessive amounts, outside approved or usual use, AND harm.',
    src: D + 'slide 9' },
  { ...M, q: 'Which describes PHYSICAL dependence?',
    options: ['Out-of-control cravings, often with denial', 'Needing a higher dose for the same effect', 'Withdrawal symptoms when the drug is not used', 'Overwhelming involvement in getting and using the drug'], correct: 2,
    why: 'Physical dependence: not using the drug causes withdrawal symptoms. Cravings with denial is psychological dependence; a higher dose for the same effect is tolerance; overwhelming involvement is addiction.',
    src: D + 'slide 10' },
  { ...M, q: 'Drug addiction impairs which three functional systems?',
    options: ['Motivation-reward, mood and behavioural inhibition', 'Absorption, distribution and excretion', 'Memory, hearing and vision', 'Breathing, heart rate and temperature'], correct: 0,
    why: 'Addiction is a behavioural pattern of use, with impairment in motivation-reward, mood and behavioural inhibition, and a high tendency to relapse.',
    src: D + 'slide 12' },
  { ...M, q: 'A patient on regular morphine says it no longer controls their pain at the same dose. This is most likely',
    options: ['Addiction', 'Tolerance', 'Drug abuse', 'An allergic reaction'], correct: 1,
    why: 'Tolerance: repeated doses cause decreasing effects, or the dose must rise to keep the same effect. Morphine users develop tolerance rapidly; marijuana causes little.',
    src: D + 'slide 13' },
  { ...M, q: 'Which manual do clinicians use to diagnose a substance use disorder?',
    options: ['The New Zealand Formulary', 'The DSM-5', 'The Medicines Act 1981', 'The National Medication Chart'], correct: 1,
    why: 'The DSM-5 (Diagnostic and Statistical Manual of Mental Disorders) — diagnosis and severity depend on the number of its criteria met.',
    src: D + 'slides 14–15' },
  { ...M, q: 'Alcohol, GHB, sedatives such as lorazepam, and nitrous oxide are all',
    options: ['Stimulants', 'Depressants', 'Both stimulant and depressant', 'Psychedelics'], correct: 1,
    why: 'Depressants (“downers”) slow the central nervous system. On her chart, MDMA and methamphetamine are stimulants; nicotine, marijuana, psychedelics and synthetic cannabinoids are both. A Pusheen slide: the concept, not every row.',
    src: D + 'slides 20–21 (Pusheen slides) and the speaker notes' },
  { ...M, q: 'Where can a nurse check for an interaction between a prescribed medicine and alcohol, marijuana or nicotine?',
    options: ['The New Zealand Formulary Interactions checker', 'The DSM-5', 'The patient’s discharge summary', 'The Misuse of Drugs Act 1975'], correct: 0,
    why: 'The deck has you use the NZ Formulary’s Interactions tab: it lists some licit and illicit “drugs”, such as alcohol, marijuana and nicotine.',
    src: D + 'slides 25–26' },
  { ...M, q: 'Te Ātea Marinō is',
    options: ['A Pasifika rehabilitation house', 'The Māori Community Alcohol and Drug Service (CADS)', 'The National Poisons Centre', 'A drug-checking service at festivals'], correct: 1,
    why: 'CADS services in Auckland: Te Ātea Marinō (Māori), Tupu (Pasifika) and Altered High (youth).',
    src: D + 'slide 34' },
  { ...M, q: 'Which is ACUTE poisoning?',
    options: ['Heavy metals building up in the body over years', 'A poison entering the body in a short time', 'Needing more of a drug for the same effect', 'A bee sting'], correct: 1,
    why: 'Acute: the poison enters the body in a short time. Chronic: it accumulates gradually.',
    src: D + 'slide 37' },
  { ...M, q: 'Something that bites or stings you and you get hurt is',
    options: ['Poisonous', 'Venomous', 'Illicit', 'Toxic only if eaten'], correct: 1,
    why: 'Venomous: it bites or stings you. Poisonous: you touch or eat it.',
    src: D + 'slide 36' },
  { ...M, q: 'The National Poisons Centre is',
    options: ['0800 764 766, free and 24 hours', '111, for advice only', 'Open business hours, through a GP referral', 'A service only for recreational drug use'], correct: 0,
    why: '0800 764 766 (0800 POISON), free, 24 hours: swallowed medicines or products, an overdose, inhaled fumes, a splash on eyes or skin, symptoms from a recreational drug. Call 111 if the person is unconscious or not breathing.',
    src: D + 'slide 38 and the speaker notes' },
  { ...M, q: 'Naloxone (Narcan) reverses an opioid overdose because it is',
    options: ['An opioid agonist', 'An opioid antagonist', 'A binder that absorbs the opioid in the gut', 'An enzyme that speeds up opioid metabolism'], correct: 1,
    why: 'Naloxone blocks the opioid receptors — an antagonist (receptor blocking is one of the ways antidotes work).',
    src: D + 'slide 40' },
  { ...M, q: 'N-acetylcysteine (NAC) is the antidote for an overdose of',
    options: ['Morphine', 'Paracetamol', 'Alcohol', 'Benzodiazepines'], correct: 1,
    why: 'NAC reduces the production of the toxic metabolites made from paracetamol.',
    src: D + 'slide 40' },
  { ...M, q: 'Activated charcoal works as an antidote by',
    options: ['Blocking receptors', 'Speeding up an enzyme', 'Binding the toxin to reduce free toxin levels', 'Increasing urine output'], correct: 2,
    why: 'The four mechanisms on her slide: binders (activated charcoal), enzyme inhibition, enzyme activation, and blocking receptors (antagonists).',
    src: D + 'slide 39' },
];
