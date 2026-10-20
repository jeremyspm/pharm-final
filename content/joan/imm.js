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
  /* ── allergy: what it is, its signs, its causes ── */
  { ...R, pts: 2, q: 'Define an allergic reaction and give an example of a common allergen.',
    steps: [
      'Definition: an exaggerated immune response to a foreign substance — the body treats something harmless (a food protein, a medicine) as an antigen and mounts a response against it. Anaphylaxis is its most severe, life-threatening form.',
      'Example: pollen, dust mites, pet dander (dried saliva, not the fur), food proteins, insect stings or a medication — e.g. a patient who says they are “a little bit allergic” to an antibiotic.',
    ],
    src: ALL + 'slide 3; the drug-as-antigen idea is Joan’s Formative mini-exam 1, Q3' },
  { ...R, pts: 3, q: 'List three body systems in which the signs of a drug allergy can show, with a sign in each.',
    steps: [
      'Skin: rash, hives (urticaria), itching, swelling of the lips or eyelids, flushed or pale skin, tingling lips.',
      'Respiratory: sneezing, coughing, a runny or stuffy nose, shortness of breath and wheezing — from swelling of the tongue, throat and upper airway and constriction of the airways.',
      'Digestive: nausea, abdominal pain, vomiting, diarrhoea — or, in anaphylaxis, the circulation: hypotension, a weak rapid pulse, dizziness and loss of consciousness.',
    ],
    src: ALL + 'slide 5; ' + TAPE + '[1:20:50] (“must, must, must know the signs of drug allergy”)' },
  { ...R, pts: 3, q: 'Define anaphylaxis and distinguish it from a mild-to-moderate allergic reaction, giving a sign of each.',
    steps: [
      'Definition: the most severe form of allergic reaction — an acute onset of life-threatening airway, breathing and/or circulation problems, usually with skin or mucosal changes. It needs immediate emergency care.',
      'Mild-to-moderate: skin, mouth and gut signs with the airway, breathing and circulation intact — e.g. hives or welts, swelling of the lips, face or eyes, a tingling mouth. It may not come first: anaphylaxis can be the first sign.',
      'Anaphylaxis: any ONE of difficult or noisy breathing, swelling of the tongue, swelling or tightness in the throat, wheeze or persistent cough, difficulty talking or a hoarse voice, persistent dizziness or collapse, or a pale and floppy young child.',
    ],
    src: VAC + 'slides 11–14 (the ASCIA Action Plan and the IMAC anaphylaxis factsheet); ' + ALL + 'slides 3 and 5' },
  { ...R, pts: 2, q: 'Explain why an allergic reaction causes redness and swelling, and give an example.',
    steps: [
      'Explanation: the underlying physiology of hypersensitivity and anaphylaxis is excessive, acute inflammation — more blood to the tissue gives redness and heat; histamine and other proinflammatory markers increase capillary permeability, fluid moves into the tissue and it swells, and the swelling presses on nerve endings (pain).',
      'Example: hives and swollen lips after a new medicine; in anaphylaxis the same swelling in the tongue and throat narrows the airway.',
    ],
    src: IMM + 'slides 32–33' },
  { ...R, pts: 2, q: 'Distinguish an immediate (Type I) from a delayed (Type IV) hypersensitivity reaction, with an example of each.',
    steps: [
      'Immediate (Type I): the reaction follows exposure within minutes — e.g. hay fever, asthma, anaphylaxis.',
      'Delayed-type (Type IV): the reaction appears hours to days after contact — e.g. contact dermatitis, the tuberculin skin-test reaction.',
    ],
    src: ALL + 'slide 4 (the four types of allergic reaction)' },
  { ...R, pts: 3, q: 'Name three groups of causes of allergic reactions, with an example of each.',
    steps: [
      'Genetic factors: a family history of allergies.',
      'Environmental factors: exposure to allergens, pollution, lifestyle changes.',
      'Other factors: age, gender, infections, the state of the immune system.',
    ],
    src: ALL + 'slide 3' },
  { ...R, pts: 2, q: 'How does a nurse prevent a patient being given a substance they are allergic to? Give an example.',
    steps: [
      'Avoidance: identify the allergen and avoid it — check for allergies at every healthcare encounter, record them, and the patient wears an allergy bracelet; take special care with highly suspect substances such as contrast dyes, iodine and antimicrobials.',
      'Example: before giving an antibiotic, ask the patient about allergies and check their bracelet and the allergy section of the chart; a new reaction is documented and the prescriber told.',
    ],
    src: ALL + 'slide 6' },
  { ...R, pts: 2, q: 'Name the groups of medicines used to treat allergic reactions, and give an example of when one is used.',
    steps: [
      'Groups: adrenaline (a vasoconstrictor), antihistamines, corticosteroids and bronchodilators; immunotherapy for some allergies; adrenaline auto-injectors (EpiPen) for emergencies.',
      'Example: an antihistamine for a mild-to-moderate reaction; for anaphylaxis the adrenaline device is given first, before anything else.',
    ],
    src: ALL + 'slide 6; ' + VAC + 'slides 12–13 (the ASCIA plan’s actions)' },

  /* ── the immune system ── */
  { ...R, pts: 2, q: 'Define an antigen and give an example.',
    steps: [
      'Definition: anything that can trigger an immune response in the body. Immunity to something means the body recognises its antigen — Joan calls it “the basis of all vaccination, immunisation”.',
      'Example: proteins on the surface of bacterial cells or viral particles, proteins on human cells, or allergens like pollen — and in a drug allergy the body treats the medicine itself as an antigen.',
    ],
    src: IMM + 'slide 9; ' + TAPE + '[1:20:50–1:21:26]' },
  { ...R, pts: 2, q: 'Distinguish the innate from the adaptive immune system, and give an example of each.',
    steps: [
      'Innate: general defences that do not distinguish between threats, treat them all the same way and act immediately — e.g. the skin as a barrier and its acid mantle, the HCl in the stomach, phagocytes like macrophages, and inflammation.',
      'Adaptive: lymphocytes in a coordinated response that targets one specific pathogen, using antigen recognition, memory B cells, plasma cells and antibodies — e.g. the fast, specific response to a disease you have been vaccinated against.',
    ],
    src: IMM + 'slides 6–7' },
  { ...R, pts: 2, q: 'Define immunity and explain how a vaccine produces it.',
    steps: [
      'Definition: a biological state in which the body can resist a disease (or a toxin).',
      'How a vaccine works: it induces immunological memory against a specific disease, so that if the body is later exposed to that pathogen the immune system neutralises the infection or toxin before disease can occur — e.g. the influenza vaccine each year.',
    ],
    src: VAC + 'slide 3 (Health New Zealand | Te Whatu Ora, 2026)' },
  { ...R, pts: 2, q: 'What is the difference between vaccination and immunisation? Give an example.',
    steps: [
      'Vaccination is the act of deliberately introducing an antigen into the body; immunisation is the development of memory B cells, stored in the lymph nodes, that allow a rapid response to a second infection.',
      'Example: being vaccinated is receiving a varicella injection; being immunised is being able to respond to the varicella virus and destroy it with minimal symptoms.',
    ],
    src: IMM + 'slide 22' },
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

  /* ── vaccines ── */
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
  { ...R, pts: 2, q: 'What is the Aotearoa New Zealand immunisation schedule for? Give two examples of the diseases it covers.',
    steps: [
      'Function: the national timetable of which vaccines are given at which age — from pregnancy and 6 weeks through childhood to 45 and 65 years — so each person is protected at the ages the diseases are most dangerous.',
      'Examples: whooping cough (pertussis), tetanus and diphtheria in pregnancy and at 6 weeks, 3 and 5 months; measles, mumps and rubella at 12 and 15 months; HPV at 11–12 years; influenza and shingles at 65.',
    ],
    src: VAC + 'slides 2 and 6–8 (the Immunisation Schedule card, Aug 2025)' },
  { ...R, pts: 2, q: 'Give an example of a special group who may need immunisation beyond the routine schedule, and say why.',
    steps: [
      'Special groups: people whose health or situation changes their risk — infants with medical complexities, the immunocompromised, people with chronic kidney or liver disease, immigrants and refugees, occupation-related groups and travellers.',
      'Example: a healthcare worker vaccinated because of workplace exposure risk, or a traveller vaccinated against a disease at their destination.',
    ],
    src: VAC + 'slide 9 (Health New Zealand | Te Whatu Ora, 2026, Immunisation of special groups)' },
  { ...R, pts: 2, q: 'Why is a fever a reason not to give a vaccination that day? Give an example.',
    steps: [
      'Reason: the immune system can only do one task at a time — if it is already busy responding to something else, it may not respond to the vaccine’s antigen and learn to recognise that disease.',
      'Example: a child who arrives for their 3-month vaccinations with a fever — the vaccination is put off and rebooked once they are well.',
    ],
    src: IMM + 'slide 31 (“Fever as a contraindication”)' },
  { ...R, pts: 3, q: 'What are the common adverse effects after a vaccination, and when do they appear? Give an example of a rare but serious one.',
    steps: [
      'Common: local — pain, redness, swelling and warmth at the injection site; systemic — fatigue, headache, muscle or joint aches, mild fever, chills; in children, mild nausea or reduced appetite.',
      'Timing: most appear within 24 hours and resolve in 1–3 days; they reflect normal immune activation, not infection.',
      'Rare but serious: anaphylaxis or a severe allergic reaction (and myocarditis/pericarditis with some vaccines) — very rare, and the benefits overwhelmingly outweigh the risks.',
    ],
    src: IMM + 'slides 37 and 39' },
  { ...R, pts: 2, q: 'What does CARM do? Give an example of something a nurse would report to it.',
    steps: [
      'CARM, the Centre for Adverse Reactions Monitoring, monitors and reviews reported adverse reactions to medicines, vaccines and other therapeutic products in Aotearoa New Zealand, and shares anonymised data internationally through the WHO drug monitoring programme.',
      'Example: anaphylaxis, or a hypotonic–hyporesponsive episode (sudden pallor, floppiness and unresponsiveness), in a baby after a vaccination.',
    ],
    src: VAC + 'slide 10 (University of Otago, NZ Pharmacovigilance Centre, 2024); ' + IMM + 'slide 38' },
];

export const MCQS = [
  { ...R, q: 'Which of these is part of the INNATE immune system?',
    options: ['Memory B cells', 'Plasma cells', 'The acid in the stomach (HCl)', 'Antibodies made after a vaccination'], correct: 2,
    why: 'The innate system is the general, immediate defence that treats every threat the same way: skin and its acid mantle, stomach HCl, phagocytes such as macrophages, inflammation. Memory B cells, plasma cells and antibodies belong to the adaptive system.',
    src: IMM + 'slide 7' },
  { ...R, q: 'Which best describes an antigen?',
    options: ['An antibody made by plasma cells', 'Anything that can trigger an immune response in the body', 'A white blood cell that eats bacteria', 'A medicine that blocks histamine'], correct: 1,
    why: 'An antigen is anything that can trigger an immune response — a protein on a bacterium or virus, on a human cell, or an allergen like pollen. Antibodies are what the body makes against it.',
    src: IMM + 'slide 9' },
  { ...R, q: 'An antibody binds to a pathogen and marks it so the innate immune system can find and destroy it quickly. This antibody function is:',
    options: ['Neutralisation', 'Opsonisation', 'Agglutination', 'Cytotoxicity'], correct: 1,
    why: 'Opsonisation is the “hunter’s mark”. Neutralisation blocks the pathogen from entering host cells; agglutination clumps antigens together; cytotoxicity removes the body’s own damaged or infected cells.',
    src: IMM + 'slide 20' },
  { ...R, q: 'A newborn is protected by antibodies received in breastmilk. This is:',
    options: ['Natural active immunity', 'Artificial active immunity', 'Natural passive immunity', 'Artificial passive immunity'], correct: 2,
    why: 'Passive = antibodies from another source; natural = by a normal biological process (placenta, breastmilk). Lab-made monoclonal antibodies are artificial passive; vaccination is artificial active; recovering from infection is natural active.',
    src: IMM + 'slide 25' },
  { ...R, q: 'A person develops memory B cells after receiving a vaccine. This is:',
    options: ['Natural active immunity', 'Artificial active immunity', 'Natural passive immunity', 'Artificial passive immunity'], correct: 1,
    why: 'Active = the person’s own immune system makes the response and stores memory B cells; artificial = through vaccination, without the damage of infection.',
    src: IMM + 'slides 23–24' },
  { ...R, q: 'Which of these is a LIVE (attenuated) vaccine?',
    options: ['Inactivated polio vaccine', 'COVID-19 mRNA vaccine', 'MMR (measles, mumps, rubella)', 'A subunit vaccine'], correct: 2,
    why: 'Live vaccines are weakened pathogens that replicate without causing disease: MMR, varicella, rotavirus, BCG. Inactivated, subunit and mRNA vaccines are non-live.',
    src: VAC + 'slide 5' },
  { ...R, q: 'Live (attenuated) vaccines are NOT safe for which group?',
    options: ['Adults over 65', 'Pregnant women and people who are immunosuppressed', 'Healthcare workers', 'Children at 12 months'], correct: 1,
    why: 'A live vaccine’s weakened pathogen still replicates — not safe in pregnancy or immunosuppression. The 12-month MMR is itself a live vaccine.',
    src: VAC + 'slide 5' },
  { ...R, q: 'On the Aotearoa New Zealand immunisation schedule, which vaccine is given by mouth?',
    options: ['Rotavirus', 'Measles, mumps and rubella', 'Pneumococcal', 'Human papillomavirus (HPV)'], correct: 0,
    why: 'The rotavirus vaccine (Rotarix) is oral, at 6 weeks and 3 months; the first dose must be given before 15 weeks and the second before 25 weeks.',
    src: VAC + 'slide 7 (the Immunisation Schedule card, Aug 2025)' },
  { ...R, q: 'At 65 years, the immunisation schedule offers vaccines against tetanus, diphtheria and whooping cough, influenza and:',
    options: ['Measles', 'Shingles (zoster)', 'Rotavirus', 'Meningococcal B'], correct: 1,
    why: 'At 65: Boostrix (tetanus, diphtheria, whooping cough), influenza, and Shingrix for shingles (2 doses, 2–6 months apart).',
    src: VAC + 'slide 8 (the Immunisation Schedule card, Aug 2025)' },
  { ...R, q: 'Most common reactions after a vaccination (a sore arm, mild fever, tiredness) appear and resolve:',
    options: ['Within 24 hours, resolving in 1–3 days', 'After a week, lasting a month', 'Only after the second dose', 'Within 5 minutes, resolving in an hour'], correct: 0,
    why: 'Most reactions appear within 24 hours and resolve in 1–3 days. They reflect normal immune activation, not infection.',
    src: IMM + 'slide 37' },
  { ...R, q: 'Sudden pallor, floppiness and unresponsiveness in a baby within hours of a vaccination describes:',
    options: ['A hypotonic–hyporesponsive episode (HHE)', 'Herd immunity', 'A Type IV hypersensitivity reaction', 'A normal local reaction'], correct: 0,
    why: 'HHE: sudden pallor or cyanosis, hypotonia and hyporesponsiveness, starting from 1 hour (up to 48 hours) after immunisation — transient, thought to be brief autonomic instability.',
    src: IMM + 'slide 38' },
  { ...R, q: 'Contact dermatitis is an example of which type of hypersensitivity reaction?',
    options: ['Type I — immediate', 'Type II — cytotoxic', 'Type III — immune complex', 'Type IV — delayed-type'], correct: 3,
    why: 'Type I: hay fever, asthma, anaphylaxis. Type II: haemolytic anaemia, transfusion reactions. Type III: serum sickness, the Arthus reaction. Type IV: contact dermatitis, the tuberculin reaction.',
    src: ALL + 'slide 4' },
  { ...R, q: 'Anaphylaxis is which type of hypersensitivity reaction?',
    options: ['Type I — immediate', 'Type II — cytotoxic', 'Type III — immune complex', 'Type IV — delayed-type'], correct: 0,
    why: 'Anaphylaxis, hay fever and asthma are Type I (immediate) reactions.',
    src: ALL + 'slide 4' },
  { ...R, q: 'An allergy to pets is usually a reaction to:',
    options: ['The fur itself', 'Pet dander — dried saliva', 'Fleas on the animal', 'The pet’s food'], correct: 1,
    why: 'The deck’s point: pet dander is dried saliva, not the fur.',
    src: ALL + 'slide 3' },
  { ...R, q: 'The underlying physiology of a hypersensitivity reaction and anaphylaxis is:',
    options: ['Too few white blood cells', 'Excessive, acute inflammation', 'An infection caused by the vaccine', 'A drug building up in the body over time'], correct: 1,
    why: 'Excessive, acute inflammation: histamine and other proinflammatory markers raise capillary permeability, so fluid leaks into tissue — redness, heat, swelling, pain.',
    src: IMM + 'slides 32–33' },
  { ...R, q: 'Which is a sign of ANAPHYLAXIS rather than of a mild-to-moderate allergic reaction?',
    options: ['Hives or welts', 'Swelling of the lips, face or eyes', 'Swelling of the tongue', 'A tingling mouth'], correct: 2,
    why: 'On the ASCIA plan, hives, swelling of the lips, face or eyes and a tingling mouth are mild-to-moderate. Swelling of the tongue is one of the anaphylaxis signs — any one of them means anaphylaxis.',
    src: VAC + 'slides 12–13 (the ASCIA Action Plan)' },
  { ...R, q: 'Which substances does the Allergic Reactions deck name as highly suspect for allergy, needing special care?',
    options: ['Contrast dyes, iodine and antimicrobials', 'Water, saline and glucose', 'Oxygen and nitrous oxide', 'Vitamins and minerals'], correct: 0,
    why: 'Avoidance means identifying and avoiding the allergen, with special care for highly suspect substances — contrast dyes, iodine, antimicrobials — plus bracelets and an allergy check at every healthcare encounter.',
    src: ALL + 'slide 6' },
  { ...R, q: 'CARM (the Centre for Adverse Reactions Monitoring):',
    options: ['Approves new vaccines for use in NZ', 'Decides which vaccines are funded', 'Monitors and reviews reported adverse reactions to medicines and vaccines', 'Sets the immunisation schedule'], correct: 2,
    why: 'CARM monitors and reviews reported adverse reactions to medicines, vaccines and other therapeutic products in NZ and shares anonymised data with the WHO programme. Medsafe approves; PHARMAC funds.',
    src: VAC + 'slide 10' },
];
