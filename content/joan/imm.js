/* Immunology, Vaccines & Allergy (Module 8, taught 7 Oct 2026) — short answers in JOAN'S STATED
   EXAM FORMAT (a definition plus an example, 2–3 marks, no question about a specific drug), plus
   multi-choice questions on the same slides. The module's three Canvas files were harvested on
   20 Oct 2026 (course 61985, Module 8): "Allergic Reactions.pptx" (8 slides), "09. Vaccinations &
   Recognising Allergy.pptx" (15 slides; the schedule and the ASCIA signs are pictures on slides
   7–8 and 12–14) and "09. Immunology for Nurses (Emma Lambert).pdf" (39 slides; a slide number
   here is the PDF page). THE TOOL wrote every question, option and model answer from those
   slides — the wording is not Joan's or the presenters'. Her own Module 8 questions (Formative
   mini-exams 1–3: a drug allergy as an antigen, two signs of anaphylaxis after a vaccine, herd
   immunity, the influenza vaccine's route) live in content/formatives/ and are not repeated here.
   On 20 Oct she said "you must, must, must know the signs of drug allergy" and called antigen
   "the basis of all vaccination, immunisation" [1:20:50–1:21:26 of that session's tape]. */
const R = { sys: 'imm', quiz: 'joan-imm', quizName: 'In Joan’s format · Immunology, vaccines & allergy' };
const ALL = 'the Allergic Reactions deck (Module 8), ';
const VAC = 'the Vaccinations & Recognising Allergy deck (Module 8), ';
const IMM = 'Immunology for Nurses (Emma Lambert, Module 8), ';
const TAPE = 'Joan’s 20 Oct revision session ';

export const SAQS = [
  { ...R, pts: 2, q: 'How does a nurse prevent a patient being given a substance they are allergic to? Give an example.',
    steps: [
      'Avoidance: identify the allergen and avoid it — check for allergies at every healthcare encounter, record them, and the patient wears an allergy bracelet; take special care with highly suspect substances such as contrast dyes, iodine and antimicrobials.',
      'Example: before giving an antibiotic, ask the patient about allergies and check their bracelet and the allergy section of the chart; a new reaction is documented and the prescriber told.',
    ],
    src: ALL + 'slide 6' },
  { ...R, pts: 2, q: 'Define active immunity and give an example of natural and of artificial active immunity.',
    steps: [
      'Definition: immunity made and directed by the person’s own immune system, which stores memory B cells.',
      'Natural: recovering from an infection, e.g. after having chickenpox. Artificial: a vaccination, which stimulates the response without the damage of infection, e.g. the MMR vaccine at 12 months.',
    ],
    src: IMM + 'slides 23–24; the schedule from ' + VAC + 'slide 7' },
  { ...R, pts: 2, q: 'Define passive immunity and give an example of natural and of artificial passive immunity.',
    steps: [
      'Definition: antibodies introduced from a different source rather than made by the person’s own immune system — protection that is immediate but temporary.',
      'Natural: a mother’s antibodies crossing the placenta or in breastmilk. Artificial: lab-made monoclonal antibodies, e.g. pre-exposure prophylaxis for someone immunocompromised at high risk of COVID-19.',
    ],
    src: IMM + 'slides 25, 27–28' },
  { ...R, pts: 2, q: 'Define herd immunity and give an example of who it protects.',
    steps: [
      'Definition: when most people in a community are vaccinated, pathogens cannot spread easily, so the whole community is protected — some diseases can even be reduced or eliminated, e.g. polio.',
      'Who it protects: people who cannot be vaccinated or do not respond — e.g. the very young, the elderly, the immunocompromised and “non-responders”.',
    ],
    src: VAC + 'slide 4' },
  { ...R, pts: 3, q: 'Distinguish a live (attenuated) vaccine from a non-live vaccine, with an example of each and a group a live vaccine is not safe for.',
    steps: [
      'Live (attenuated): weakened pathogens that replicate without causing disease — e.g. MMR, varicella, rotavirus, BCG.',
      'Non-live: cannot replicate — inactivated (the germ is killed, e.g. polio), subunit (only microbial fragments) or mRNA (genetic instructions to make a viral protein, e.g. COVID-19).',
      'Not safe: live vaccines are not safe in pregnancy or immunosuppression — e.g. MMR is not given to a pregnant woman.',
    ],
    src: VAC + 'slide 5' },
  { ...R, pts: 2, q: 'Why is a fever a reason not to give a vaccination that day? Give an example.',
    steps: [
      'Reason: the immune system can only do one task at a time — if it is already busy responding to something else, it may not respond to the vaccine’s antigen and learn to recognise that disease.',
      'Example: a child who arrives for their 3-month vaccinations with a fever — the vaccination is put off and rebooked once they are well.',
    ],
    src: IMM + 'slide 31 (“Fever as a contraindication”)' },
];

export const MCQS = [
  { ...R, q: "Which of these is a live (attenuated) vaccine?",
    options: ["Inactivated polio","COVID-19 mRNA","MMR","A subunit vaccine"], correct: 2,
    why: "Live vaccines are weakened pathogens that replicate without causing disease: MMR, varicella, rotavirus, BCG. Inactivated, subunit and mRNA vaccines are non-live.",
    src: "the Vaccinations & Recognising Allergy deck (Module 8), slide 5" },
  { ...R, q: "Which vaccine on the NZ immunisation schedule is given by mouth?",
    options: ["Rotavirus","MMR","Pneumococcal","HPV"], correct: 0,
    why: "The rotavirus vaccine (Rotarix) is oral, at 6 weeks and 3 months; the first dose must be given before 15 weeks and the second before 25 weeks.",
    src: "the Vaccinations & Recognising Allergy deck (Module 8), slide 7 (the Immunisation Schedule card, Aug 2025)" },
  { ...R, q: "Contact dermatitis is which type of hypersensitivity reaction?",
    options: ["Type I — immediate","Type II — cytotoxic","Type III — immune complex","Type IV — delayed"], correct: 3,
    why: "Type I: hay fever, asthma, anaphylaxis. Type II: haemolytic anaemia, transfusion reactions. Type III: serum sickness, the Arthus reaction. Type IV: contact dermatitis, the tuberculin reaction.",
    src: "the Allergic Reactions deck (Module 8), slide 4" },
  { ...R, q: "Which is a sign of anaphylaxis, not a mild allergic reaction?",
    options: ["Hives","Swollen lips","Swelling of the tongue","A tingling mouth"], correct: 2,
    why: "On the ASCIA plan, hives, swelling of the lips, face or eyes and a tingling mouth are mild-to-moderate. Swelling of the tongue is one of the anaphylaxis signs — any one of them means anaphylaxis.",
    src: "the Vaccinations & Recognising Allergy deck (Module 8), slides 12–13 (the ASCIA Action Plan)" },
];
