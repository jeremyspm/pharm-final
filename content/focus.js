/* focus.js — what to learn for the Pharmacology final, and how far. One row per topic, in the
 * format hs2-test2 set (estate rule 2026-09-17).
 *
 * WHERE THE NUMBERS COME FROM. Nothing is counted by hand: each row says where its questions
 * live (`from`) and build.mjs fills n / pts / qz / saq and FAILS unless every question in the
 * bank lands in exactly one row. Rows that share a quiz row are split by a pattern on the stem
 * (the Legal & ethical quiz → three rows) or on the source deck (the "In Joan's format" rows).
 *
 * WHAT THE NUMBERS ARE NOT. Every question in this bank is the TOOL's. A big count here means a
 * long deck, not Joan's emphasis — so, unlike HS2, marks are NOT used to rank anything.
 *
 * WHAT RANKS THE ROWS INSTEAD — her own pointing, then the syllabus:
 *   tier 0  she said it on tape, Wed 16 Sep 2026 (a student's recording, transcribed): after
 *           the legal & ethical material — "so these will be assessed in your exam, okay?"
 *           [1:02:38]; and deck 13 handed over as an online package "you're going to do for
 *           me" [59:31]. The syllabus maps the exam to LO 1, 3 & 4 and leaves out LO2 (the
 *           legal-and-ethical-standards outcome) — the tape is later and more specific, so the
 *           tape wins, and the row says so.
 *   tier 1  a learning outcome the exam assesses names it (LO1 principles · LO3 medication
 *           education · LO4 mechanisms and effects). Her one worked example of an exam
 *           question ("the meaning of contraindication, and give an example" [1:05:06]) comes
 *           from the first of these; by house rule a tape flag floors a row at tier 1.
 *   tier 2  taught and examinable ("all modules"), named by no assessed outcome.
 *   tier 3  has its own assessment, so the final is unlikely to lean on it.
 * Her revision sessions re-rank this list; whatever she names there goes into tier 0. The first
 * was Tue 20 Oct 2026 (a student's recording, transcribed; timestamps below are that tape's):
 * she must-must-musted the abbreviations [1:18:39] and the signs of drug allergy [1:20:50], named
 * the drug classes to know [0:19:23–0:25:14], and set Formative mini-exam 1. Her three formative
 * mini-exams (content/formatives/) are HER questions: rows claim them by mini-exam and question
 * number with F() below, and a row holding any of them shows that not all of it is the tool's.
 *
 * Her 16 Sep line "she will not ask about specific drugs" no longer stands as it was: on 20 Oct she
 * said there will be "a few specific drug classes" and "maybe one question on GTN", applied and
 * nurse-focused (what you assess before, what you monitor), and her own formatives name amoxicillin,
 * paracetamol and adrenaline. Her exam-prep slide asks for "a simple understanding" of paracetamol
 * and salbutamol. A drug's deep pharmacology is still out ("not a pharmacy exam" [0:25:05]).
 *
 * `done` = what you must be able to DO · `ask` = the shape she described (a definition plus an
 * example, 3–4 lines; no specific-drug questions) · `cap` = where it stops, and on what evidence. */
const S = (quiz, re) => ({ quiz: [quiz], src: re });
/* her formative questions by number: F({1:[4, 7, 's13'], 3:[5]}) = mini-exam 1 Q4, Q7 and short answer Q13, mini-exam 3
   Q5 (each src line names its question; mini-exam 2 numbers its short answers from 11, so a short answer is 's'+number) */
const F = (spec) => ({ quiz: ['form1', 'form2', 'form3'], src: new RegExp('mini-exam (?:' + Object.entries(spec).map(([e, ns]) => {
  const mc = ns.filter(n => typeof n === 'number'), sa = ns.filter(n => typeof n === 'string').map(n => n.slice(1));
  const alt = [mc.length ? `Q(?:${mc.join('|')})` : '', sa.length ? `short answer Q(?:${sa.join('|')})` : ''].filter(Boolean);
  return `${e}, answers document, (?:${alt.join('|')})`;
}).join('|') + ')(?!\\d)') });
const LAW = /Misuse of Drugs|Medicines Act|controlled drug|Act, Regulation|an Act, a regulation|three key Acts|regulators of NZ|legislation mean|classifications of medicines|prescription medicine on their own|proper prescribing/i;
const COMPETENCE = /Annual Practising|Health Practitioners Competence|HPCAA|\bpou\b|cultural safety|scope of practice|fitness to practise|Nursing Council of New Zealand from/i;

export const FOCUS = [

/* ══════════ TIER 0 — she said it on tape, 16 Sep ══════════ */
{ id:'law', sys:'law', tier:0, t:'Medicines law and controlled drugs', flag:'tape',
  from:[{ quiz:['legal','joan-law'], q: LAW }, F({2:[11], 3:['s15']})],
  done:'Say what an Act, a regulation, a policy and a guideline are; name the three key Acts and what each does; give the four legal classifications of medicines (prescription · restricted · pharmacy-only · general sale) with an example; define a controlled drug and describe Classes A, B and C and how they are stored; name the regulators (Medsafe, PHARMAC, HRC, CARM); say what the law means at the bedside — no prescription or standing order, no administration; nurses do not prescribe or dispense; insist on proper prescribing.',
  ask:'A definition plus an example in 3–4 lines. Her own framing question in the lecture: “what is the difference between a controlled drug and a prescribed drug?” (all controlled drugs are prescribed; not all prescribed drugs are controlled).',
  cap:'Examples of drugs in a class are HER examples and fair game as examples; she will not ask you about a specific drug’s pharmacology. Penalty details and police powers were one line on a slide. The syllabus does not list the legal-standards outcome (LO2) for the exam — but she said after this lecture that it “will be assessed”, and the tape is the later word.',
  src:'Deck 09 slides 2–20 · her 16 Sep lecture [00:00–10:14] · her Escape Room answer sheet, Lock 1' },

{ id:'competence', sys:'law', tier:0, t:'HPCAA, scope of practice, fitness to practise and the six pou', flag:'tape SKIP',
  from:[{ quiz:['legal','joan-law','joan-ethics'], q: COMPETENCE }],
  done:'Give the purpose of the HPCAA 2003 (public safety) and the four things it requires of an RN; define scope of practice as demonstrated competence, not a task list, with something outside an RN’s scope; say what fitness to practise means and what endangers it; say what the Nursing Council does, tell it from NZNO (regulator with an enforceable Code of Conduct vs union with a Code of Ethics), and that “nurse” is a protected title; say what a pou is and name all six; define cultural safety as the Council does.',
  ask:'Definition plus example. The Escape Room (Lock 2) is the model: given a scenario, name two pou that were compromised and say how.',
  cap:'She explained the WORD pou and then skipped the six individually (slides 38–45: “I’m not going to go into the pou today”) — unlectured but in the deck and in her own Escape Room answers, so read them yourself. The $130 fee and the register details are colour, not content.',
  src:'Deck 09 slides 28–45 · her 16 Sep lecture [21:02–36:59] · Escape Room answer sheet, Lock 2' },

{ id:'conduct-ethics', sys:'law', tier:0, t:'Code of Conduct, Code of Ethics values and ethical issues in pharmacology', flag:'tape SKIP',
  from:[{ quiz:['legal','joan-law','joan-ethics'], q: /^(?![\s\S]*(?:Misuse of Drugs|Medicines Act|controlled drug|Act, Regulation|an Act, a regulation|three key Acts|regulators of NZ|legislation mean|classifications of medicines|prescription medicine on their own|proper prescribing|Annual Practising|Health Practitioners Competence|HPCAA|\bpou\b|cultural safety|scope of practice|fitness to practise|Nursing Council of New Zealand from))/i }],
  done:'Say which of the four key documents is law, which are enforceable standards and which is a guideline; give a Code of Conduct principle with a medicines example (P2 excipients · P4 double-check · P5 no information over the phone · P7 report errors honestly); define veracity, autonomy, rangatiratanga, beneficence, non-maleficence, justice, confidentiality and fidelity, each with an example; say why PRN and believed-or-not pain are ethical problems; say why concealing an error is worse than making it (the Nurse D case).',
  ask:'Definition plus example — “define veracity and give an example”. The Escape Room (Lock 3) asks for a Code of Conduct principle with an example of how practice could improve; Lock 4 is a crossword of the Māori and Western values.',
  cap:'She worked through only veracity, rangatiratanga and autonomy and set the rest as reading (slides 64–83), and ran none of the scenarios (46–52, 84–88). Slide 90, the four-document comparison table, is the best single revision page in the deck. You will not be asked to recite all sixteen values; you may be asked to define any one.',
  src:'Deck 09 slides 21–27 and 53–90 · her 16 Sep lecture [10:14–21:02] and [36:59–1:03:38] · Escape Room answer sheet, Locks 3–4' },

{ id:'devmkt', sys:'law', tier:0, t:'Drug development, clinical trials and medicines advertising', flag:'tape SD',
  from:[{ quiz:['devmkt','joan-devmkt'] }, F({2:['s15']})],
  done:'Give the five stages from discovery to post-market monitoring; give the purpose of clinical trial Phases 1–4 (safe? · works? · at scale? · keep watching); name the three bodies that approve a trial in NZ (Medsafe, SCOTT, HDEC) and what each checks; define informed consent in a trial; say when a placebo is acceptable and what randomisation costs a participant; name the five kinds of medicines advertising; say why NZ is unusual; say how a nurse can advertise by accident and how to avoid it (generic names, balanced facts).',
  ask:'Definition plus example — “what is a reminder advertisement?”, “when is a placebo ethically acceptable?”.',
  cap:'Never lectured: on 16 Sep she ran out of time and handed it over as a self-directed online package — still examinable. Participant numbers and progression percentages are the kind of detail a 3–4 line answer has no room for; know what each phase is FOR. Thalidomide is the one historical example she told herself.',
  src:'Deck 13 (33 slides) · her 16 Sep lecture [59:31] and [1:00:26]' },

/* ══════════ TIER 1 — an assessed learning outcome names it ══════════ */
{ id:'concepts1', sys:'found', tier:1, t:'Core terms — contraindication, precaution, interaction, drug names, Medsafe and PHARMAC', flag:'tape LO1',
  from:[{ quiz:['concepts1'] }, S('joan-found', /Pharmacology Concepts \(1\)/), F({1:['s13','s14','s15','s16']})],
  done:'Define pharmacology and a medication; define contraindication, precaution and medication interaction, each with an example; give a medicine’s three names and say why generic prescribing is preferred (and its two exceptions); define bioequivalence; tell Medsafe (regulates) from PHARMAC (funds); say what a nurse must know before giving any medicine.',
  ask:'Her own worked example of an exam short answer comes from here: “what is the meaning of contraindication, and give an example” [1:05:06]. “Mostly definitions, because it’s an introductory paper.”',
  cap:'Generic-name suffixes are in the deck, but deep drug-naming detail is not her exam. Not tested, she said on 20 Oct: the history of pharmacology and where a drug’s ingredients come from — “that was just getting you going at the beginning” [0:35:32–0:36:04]. Keep a glossary of the definitions, “like when you learn a foreign language” [0:37:47], and learn HER definition: answers in other words take longer to mark [1:42:22].',
  src:'Deck 01 Pharmacology Concepts (1) · her 16 Sep lecture [1:05:06] · her 20 Oct revision session · her Formative mini-exam 1, Q13–16' },

/* ══════════ TIER 0 (20 Oct) — what she named in the first revision session ══════════ */
{ id:'drugs', sys:'found', tier:0, t:'The drugs and drug classes she named on 20 Oct', flag:'tape noquiz',
  done:'For each, say its class, what it is for, what you assess before giving it and what you monitor while the patient is on it: paracetamol (analgesic — and other products that contain it, such as cold-and-flu remedies) · salbutamol (bronchodilator) · aspirin (antiplatelet) with the anticoagulants warfarin and heparin · GTN, glyceryl trinitrate (a nitrate, anti-anginal; sublingual because it is fast and stomach acid destroys it) · the penicillin family and amoxicillin (antimicrobials — know why she says antimicrobials, not antibiotics) · morphine (opioid; six or seven formulations).',
  ask:'“Very much applied kind of nursing stuff” — what to assess before you give the drug, what to monitor [0:25:14–0:25:39]. Her exam-prep slide asks for “a simple understanding” of paracetamol and salbutamol. Her formatives name amoxicillin (storage and giving at home), paracetamol (an unusually high dose) and adrenaline (a volume).',
  cap:'“Promise me you won’t” spend half a day on GTN — “there might be one question on GTN” [0:24:41]; a student once spent a whole day on aspirin. “It’s not a pharmacy exam” [0:25:05]. No question in this tool drills these drug by drug yet; the intro-pharm hub’s drug-class cards (MoA · Use · Adverse · Nursing) are the place to read them.',
  src:'Her 20 Oct revision session [0:19:23–0:25:39] · her exam-prep slides, slide 10' },

{ id:'pk1', sys:'pkpd', tier:1, t:'Pharmacokinetics 1 — absorption, bioavailability, first pass, distribution', flag:'LO1',
  from:[{ quiz:['pk1'] }, S('joan-pkpd', /Pharmacokinetics \(1\)/), F({1:[7], 3:['s13']})],
  done:'Define pharmacokinetics and name ADME; define absorption and say which route needs none; list what changes absorption (membrane, lipid solubility, blood flow, food); define bioavailability (IV = 100%) and the hepatic first-pass effect, with the 100 mg → 20 mg example; explain plasma protein binding and what competition for binding sites does; say what the blood–brain and placental barriers keep out.',
  ask:'Definition plus example — “define bioavailability and give an example”. LO1 (“apply pharmacological principles”) is assessed in the exam and this is its centre.',
  cap:'The lecture’s examples of drugs concentrating in particular tissues are named drugs — know the principle, not the drug. No calculations here beyond the first-pass arithmetic.',
  src:'Deck 04 Pharmacokinetics (1)' },

{ id:'pk2', sys:'pkpd', tier:1, t:'Pharmacokinetics 2 — metabolism, excretion, half-life, therapeutic range', flag:'LO1',
  from:[{ quiz:['pk2'] }, S('joan-pkpd', /Pharmacokinetics \(2\)/), F({2:[5], 3:[3]})],
  done:'Define metabolism (the liver, enzymes, usually to an inactive water-soluble metabolite); contrast enzyme inducers and inhibitors and what each does to dosing; name the routes that avoid first pass; separate excretion, elimination and clearance; define half-life (about five to clear, three to five to reach steady state); define the therapeutic range and therapeutic drug monitoring (peak and trough).',
  ask:'Definition plus example — “define half-life and give an example of how it is used”.',
  cap:'Summarising one named drug under all four ADME headings is a specific-drug question — drillable here, never in a mock, and not her exam.',
  src:'Deck 04 Pharmacokinetics (2)' },

{ id:'pd', sys:'pkpd', tier:1, t:'Pharmacodynamics and adverse effects', flag:'LO1 LO4',
  from:[{ quiz:['pd'] }, S('joan-pkpd', /deck 04 Pharmacodynamics/), S('joan-admin', /deck 04 Pharmacodynamics/), F({1:[2,5,6], 2:[3], 3:[2,11]})],
  done:'Define pharmacodynamics; define affinity, efficacy and potency; tell an agonist from an antagonist with lock and key; explain receptor up- and down-regulation; describe a dose–response relationship and the therapeutic range (MEC to MTC); define an adverse effect against an adverse drug event; list person- and drug-related risk factors; say what CARM is and who may report.',
  ask:'Definition plus example — “distinguish an agonist from an antagonist and give an example of each”. LO4 (mechanisms of action, therapeutic uses, side effects) is assessed here as principle, not drug by drug.',
  cap:'Every lecture example of a drug acting on a receptor, enzyme, channel or carrier is a named drug — use one as YOUR example if it helps. On 20 Oct she named the classes to know (row “The drugs and drug classes she named”); a deep drug-by-drug question is still not her exam.',
  src:'Deck 04 Pharmacodynamics' },

{ id:'educ', sys:'admin', tier:1, t:'Medication errors and patient education (Ask · Build · Check)', flag:'LO3',
  from:[{ quiz:['educ'] }, S('joan-admin', /Patient Education \(2\)/), F({1:[9,'s17','s18'], 3:[4,'s14']})],
  done:'Define a medication error and separate it from an adverse effect; give ways to prevent errors and the steps for managing and reporting one; say what concealment costs; run Ask–Build–Check for a medicine; adapt medication education for a child, a teenager and an older adult; tie an education example to a Te Tiriti principle.',
  ask:'Definition plus example — “define a medication error and give an example”. LO3 (medication education for health literacy and self-management) is assessed in the exam and this lecture is the only place it is taught.',
  cap:'Ask–Build–Check is the same model as in the INP paper’s Health Literacy lecture — learn it once. Listing all five Te Tiriti principles with meanings is a five-mark list question: drillable, not her format.',
  src:'Deck 05 Medication Administration and Patient Education (2)' },

/* ══════════ TIER 2 — taught and examinable, named by no assessed outcome ══════════ */
{ id:'concepts2', sys:'found', tier:0, t:'Classification, routes, formulations and abbreviations', flag:'tape LO1',
  from:[{ quiz:['concepts2'] }, S('joan-found', /Pharmacology Concepts \(2\)/), F({1:[1,10], 2:[6], 3:[1,6,9,10]})],
  done:'Name the ways medicines are classified; tell a local from a systemic effect; compare routes (oral, IV, IM, subcutaneous, inhaled, topical, rectal) for speed and drawbacks; define dissolution, excipient and enteric coating and say why a coated tablet is not crushed; read the common prescription abbreviations (prn, bd, tds, qid, mane, nocte, stat, PO, SL, SC, IM, IV, PR, NKDA).',
  ask:'Abbreviations: “you must, must, must know your abbreviations … you’ve got to leave this course knowing how to read a prescription” [1:18:39]. Expect a prescription to interpret — drug, route, time, frequency — not “what does PO mean”, which is “too easy” [0:43:27]. Four of her formative questions are exactly that (TDS · BD prn · QID PR · EC). Why formulations differ — GTN sublingual, morphine in six or seven forms — was her worked example [0:44:37–0:47:27]. Chart Speak drills every abbreviation.',
  cap:'An eleven-abbreviation recall list is a five-mark list question — drillable, never dealt into a mock. The nurse cannot legally change a route: check with the prescriber [0:48:09].',
  src:'Deck 01 Pharmacology Concepts (2)' },

{ id:'admin', sys:'admin', tier:2, t:'Safe medication administration — the rights and checks, the medication chart', flag:'',
  from:[{ quiz:['admin'] }, S('joan-admin', /Patient Education \(1\)/), F({1:[11], 2:[2,4,10], 3:['s16','s18']})],
  done:'Give the rights and checks as taught in this course (8 rights + 2 checks — Med Admin deck (1) slide 23) and what each asks of you; say how identity is checked; say what to do when no route is written; act correctly on a refusal; explain right indication and why PRN needs a nursing assessment; state the documentation rules; say who may prescribe.',
  ask:'Definition plus example — “what does right indication require? give an example”.',
  cap:'The outcome this belongs to (LO2) is assessed by the practical and the calculations test, not listed for the exam — but “all modules” are examinable. The MoH aged-care guide’s shorter “5 rights” is a different list: use the course’s.',
  src:'Deck 05 Medication Administration and Patient Education (1)' },

{ id:'elderly', sys:'life', tier:2, t:'Medicines in the older adult and polypharmacy', flag:'LO1',
  from:[{ quiz:['elderly'] }, S('joan-life', /Elderly & Polypharmacy/), F({2:[1,12]})],
  done:'Define an older person (65+, young-old, old-old, frail); say how ageing changes absorption, distribution, metabolism and renal excretion and what that does to dosing; name the common adverse effects in older adults; define polypharmacy (five or more), why it happens, its risks and how it is managed; say when a tablet may be crushed; tell errors of commission from omission.',
  ask:'Definition plus example — “define polypharmacy and give an example of a risk it raises”.',
  cap:'The Beers Criteria examples and the prevalence figures are named drugs and statistics — not 3–4 line material.',
  src:'Deck 06a Medication in the Elderly & Polypharmacy' },

{ id:'lifespan', sys:'life', tier:2, t:'Medicines in pregnancy, lactation and children', flag:'LO1',
  from:[{ quiz:['lifespan'] }, S('joan-life', /Pregnancy, Lactation/), F({1:['s19'], 2:[9,'s11','s12'], 3:[7]})],
  done:'Say how medicines reach the foetus and when it is most vulnerable; define a teratogen and the highest-risk period; say what the pregnancy categories A and X mean; give the three things that decide transfer into breast milk and the guiding principle; say why children are not small adults; describe neonatal and childhood pharmacokinetics in a sentence each; give the age bands.',
  ask:'Definition plus example — “define a teratogen and give an example”.',
  cap:'The table of named teratogens and the substance-by-substance effects on the foetus are specific-drug content — drillable here, not her exam.',
  src:'Deck 07 Medications in Pregnancy, Lactation and Children' },

{ id:'allergy', sys:'imm', tier:0, t:'Drug allergy, anaphylaxis and vaccines (Module 8)', flag:'tape LO4',
  from:[{ quiz:['allergy'] }, F({1:[3], 2:['s13'], 3:[12,'s17']})],
  done:'Recognise anaphylaxis from its signs against a mild-to-moderate reaction; give the steps of the ASCIA plan in order, including positioning and its exceptions; say what is given first when someone with asthma and a food allergy suddenly cannot breathe, and why.',
  ask:'“I’ve really pushed that you must, must, must know the signs of drug allergy” [1:20:50] — and the word antigen, “the basis of all vaccination, immunisation” [1:21:15]. Her formatives ask what a drug allergy is (an antigen and an immune response), two signs of anaphylaxis to monitor after a vaccination, herd immunity, and the route for an influenza vaccine (IM, deltoid).',
  cap:'The tool’s own questions here are still only the ASCIA plan: the Module 8 decks (Allergic Reactions, Vaccinations & Recognising Allergy, Immunology for Nurses) are on Canvas but not yet built into questions. Her four formative questions are the row’s only vaccine and allergy-mechanism material.',
  src:'ASCIA Action Plan for Anaphylaxis (Canvas) · her 20 Oct revision session · her Formative mini-exams 1–3' },

{ id:'cam', sys:'cam', tier:2, t:'Rongoā Māori (Module 10, part 1)', flag:'',
  from:[{ quiz:['joan-cam'] }],
  done:'Define rongoā Māori and its three parts (mirimiri, karakia, rongoā rākau); say who is responsible for a traditional medicine (the tohunga or practitioner) and what a nurse does when whānau ask about one; give the five things to consider alongside prescribed medicines; tell the biomedical from the wholistic view; define integrated medicine; say what Tikanga ā Rongoā is; say why health is a taonga.',
  ask:'Definition plus example. A guest lecture (15 Sep), so how Joan will ask it is unknown; the NZNO guideline paragraph quoted on slide 9 is the most examinable thing in the deck.',
  cap:'The plant-by-plant slides are the specific-drug problem in another form — no question here asks about a named plant. The presenter’s own prescribing model (astrology, elements) is described as his own.',
  src:'Rongoā 2026 deck (guest lecture, 15 Sep)' },

{ id:'socio-cam', sys:'cam', tier:2, t:'Socioeconomic factors and complementary/alternative medicines (Module 10, part 2)', flag:'SD',
  from:[F({1:[8], 2:[7]})],
  done:'Tell conventional, alternative and complementary medicine apart: conventional is the Western medicine our health system is built on; ALTERNATIVE is used INSTEAD of it; COMPLEMENTARY — with an E — alongside it. Her hook: carrot juice instead of chemo is alternative; carrot juice with chemo is complementary [1:30:29–1:32:23].',
  ask:'Both of her formative questions here are that distinction. “If you didn’t [do the session], you won’t know what these terms mean” [1:30:43].',
  cap:'A self-directed online session (14 Oct); its Canvas material is not in this tool yet, so the row is her two formative questions and nothing of the tool’s.',
  src:'Her 20 Oct revision session · her Formative mini-exams 1 and 2' },

{ id:'tox', sys:'tox', tier:2, t:'Licit and illicit drugs and toxicology (Module 9)', flag:'SD',
  from:[F({1:[4], 3:[5]})],
  done:'Define addiction, dependence and tolerance and tell them apart: ADDICTION is compulsive use with craving, loss of control and use despite harm; DEPENDENCE is withdrawal symptoms if a drug is stopped abruptly — and “medical dependence” (an inhaler every day, insulin) is not addiction; TOLERANCE needs more for the same effect. Know the common myths about addiction [1:22:21].',
  ask:'Her formative Q4 (mini-exam 1) and Q5 (mini-exam 3) are exactly this. Mini-exam 1’s answer document keys Q4 as C; she corrected it in class to B [1:48:07–1:50:15].',
  cap:'Moved to a self-directed session on Wed 21 Oct, 1–5 pm, because the lecturers are on strike [0:30:35–0:31:41]; the Canvas module was still empty on 20 Oct. The row is her two formative questions until its material is on Canvas.',
  src:'Her 20 Oct revision session · her Formative mini-exams 1 and 3' },

/* ══════════ TIER 3 — has its own assessment ══════════ */
{ id:'calcs', sys:'calc', tier:3, t:'Medication calculations', flag:'',
  from:[{ quiz:['calcs'] }, F({1:[12], 2:[8,'s14'], 3:[8]})],
  done:'State the dose formula and the drip-rate formula; convert units; work a tablet, a liquid, a weight-based and a drip-rate question; apply the course’s rounding rules; spot a red herring.',
  ask:'“A few popped into” the final, “not going to be hard ones”, multi-choice, no working shown [0:16:49–0:17:18, 0:25:40]; bring a simple calculator. Her formatives have one per paper — a weight-based dose, tablets from grams, a mL from mg/kg — and a 1-mark adrenaline volume as a short answer. Read what is asked: “it’s just the milligrams” [1:36:17].',
  cap:'Calculations also have their own test (15 out of 15 to pass, with resits). Worked calculations of the tool’s are never dealt into the written section of a mock.',
  src:'Deck 02 Medication Calculations' },
];
