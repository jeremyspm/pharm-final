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
  /* ── Module 1 ── */
  { ...F, pts: 2, q: 'What is the meaning of “contraindication”? Give an example.',
    steps: [
      'Definition: a situation in which a medication should NOT be used, because it may be harmful to the person.',
      'Example: a known severe allergy to that medicine — it must not be given; or a medicine known to harm the foetus in a woman who is pregnant.',
    ],
    src: 'Joan’s own example of a short answer, Legal & Ethical lecture 16 Sep 2026 [1:05:06]; definition from ' + C1 + 'slide 31' },
  { ...F, pts: 2, q: 'What is a “precaution” in relation to a medication, and how does it differ from a contraindication? Give an example.',
    steps: [
      'Definition: a warning that the medication should be used with special care because of a heightened risk of adverse effects — unlike a contraindication, it MAY still be used, with careful monitoring or a dose adjustment.',
      'Example: reduced kidney function in an older adult — the medicine is still given, but at a lower dose and with monitoring.',
    ],
    src: C1 + 'slide 31' },
  { ...F, pts: 2, q: 'Define a medication interaction and give an example.',
    steps: [
      'Definition: a reaction in which the effect or activity of a medication is altered by another substance or condition — another medication, a food, a complementary or alternative medicine, or a medical condition.',
      'Example: a herbal remedy or a food that changes how much of a prescribed medicine is absorbed or broken down, making it stronger or weaker — which is why a nurse asks about everything the person takes.',
    ],
    src: C1 + 'slide 32' },
  { ...F, pts: 2, q: 'Distinguish a medicine’s generic name from its brand (proprietary) name, and give an example of why the difference matters.',
    steps: [
      'Generic name: the official name of the active ingredient, approved by the regulator — one per medicine. Brand name: chosen and owned by the company that markets it — one medicine may have several.',
      'Why it matters: a patient who knows only brand names may not realise two products are the same medicine and take both; prescribing and teaching by generic name reduces error (and lets the pharmacist dispense the funded brand).',
    ],
    src: C1 + 'slides 39–48' },
  { ...F, pts: 2, q: 'Distinguish the roles of Medsafe and PHARMAC, with an example of a decision each would make.',
    steps: [
      'Medsafe is the medicines and medical devices safety authority: it REGULATES — e.g. deciding whether a new medicine is safe and of good enough quality to be approved for use in New Zealand.',
      'PHARMAC decides which medicines are FUNDED (subsidised) within a fixed budget — e.g. which brand of a medicine is subsidised.',
    ],
    src: C1 + 'slides 36–37' },
  { ...F, pts: 2, q: 'Distinguish a local effect from a systemic effect of a medication, and give an example of each.',
    steps: [
      'Local effect: the effect occurs at the immediate site of administration — e.g. a cream applied to a skin rash, or eye drops.',
      'Systemic effect: the medication must be absorbed into the circulation and distributed to the place where it acts — e.g. a tablet swallowed for a headache.',
    ],
    src: C2 + 'slides 26–27' },
  { ...F, pts: 2, q: 'What is an excipient? Give an example and one reason a nurse needs to know about them.',
    steps: [
      'Definition: an inert (inactive) ingredient in a formulation — fillers, binders, colours, flavours, stabilisers; the active medicine may be only a small fraction of the tablet.',
      'Example and reason: the gelatine in a capsule shell — it matters to patients who are vegetarian, vegan or avoid it for religious reasons, so the nurse checks (Code of Conduct Principle 2).',
    ],
    src: C2 + 'slides 62–63; Joan’s Legal & Ethical lecture 16 Sep 2026 [41:57]' },
  { ...F, pts: 2, q: 'What is an enteric coating, and what is it for? Give an example of what goes wrong if it is ignored.',
    steps: [
      'Definition: a coating that stops a tablet dissolving in the stomach; it dissolves in the intestine, where the medicine is then absorbed — protecting the medicine from stomach acid, protecting the stomach from the medicine, or delaying its action.',
      'Example: crushing an enteric-coated tablet for a patient who cannot swallow destroys the coating, so it is absorbed too fast or irritates the stomach — check with a pharmacist first.',
    ],
    src: C2 + 'slide 66; deck 06a Elderly & Polypharmacy, slide 22' },

  /* ── Modules 3–4 ── */
  { ...K, pts: 2, q: 'Define pharmacokinetics and give an example of one of its four processes.',
    steps: [
      'Definition: “what the body does to the drug” — the passage of a drug through the body by absorption, distribution, metabolism and excretion (ADME).',
      'Example (any one): absorption — a swallowed tablet dissolving and entering the bloodstream from the gut; metabolism — the liver modifying the drug; excretion — the kidneys removing it in urine.',
    ],
    src: PK1 + 'slides 5–7' },
  { ...K, pts: 2, q: 'Define absorption, and give an example of a route that does not require it.',
    steps: [
      'Definition: the process by which unchanged drug reaches the bloodstream (systemic circulation) after it has been given and has dissolved.',
      'Example: the intravenous route — the medicine is put directly into the bloodstream, so nothing has to be absorbed and the effect is rapid.',
    ],
    src: PK1 + 'slide 13' },
  { ...K, pts: 2, q: 'Define bioavailability and give an example comparing two routes.',
    steps: [
      'Definition: how much of the dose actually reaches the bloodstream.',
      'Example: intravenous = 100%; the same medicine by mouth is lower, because some is not absorbed from the gut and some is broken down by the liver before it reaches the circulation.',
    ],
    src: PK1 + 'slide 34' },
  { ...K, pts: 2, q: 'Explain the hepatic first-pass effect and give an example of its consequence.',
    steps: [
      'Definition: a medicine taken by mouth is absorbed from the gut and passes through the liver before reaching the rest of the body; the liver breaks down part of it, so only a portion of the dose arrives unchanged.',
      'Example: of a 100 mg tablet, 80 mg is absorbed and the liver removes 60 mg — 20 mg reaches the circulation (bioavailability 20%). So oral doses are often larger than IV doses, and sublingual, transdermal or IV routes avoid it.',
    ],
    src: PK1 + 'slides 35–36' },
  { ...K, pts: 2, q: 'What is plasma protein binding, and why does it matter? Give an example.',
    steps: [
      'Definition: many drugs bind reversibly to plasma proteins, mainly albumin; only the FREE (unbound) drug can leave the blood and have an effect.',
      'Example: two highly protein-bound medicines compete for the same binding site, or a malnourished older adult has low albumin — more free drug circulates, so the effect and the risk of toxicity increase.',
    ],
    src: PK1 + 'slides 37–38' },
  { ...K, pts: 2, q: 'Define drug metabolism and give an example of something that changes it.',
    steps: [
      'Definition: the biological transformation of a drug, almost always by enzymes and mainly in the liver, usually into a less active, more water-soluble compound that can be excreted.',
      'Example: an enzyme inhibitor slows metabolism, so drug levels rise and toxicity may follow; an enzyme inducer speeds it up, so a higher dose may be needed — diet, other medicines, alcohol and smoking can all do this. Liver disease also slows metabolism.',
    ],
    src: PK2 + 'slides 11–12 and 15' },
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
  { ...K, pts: 2, q: 'Define pharmacodynamics and give an example.',
    steps: [
      'Definition: “what the drug does to the body” — the study of drug–target interactions, mechanisms of action and the resulting biological effects.',
      'Example: a medicine binding to a receptor on airway muscle and making it relax, so breathing becomes easier — where it acts, how, and what change in function follows.',
    ],
    src: PD + 'slides 4–5' },
  { ...K, pts: 2, q: 'Distinguish an agonist from an antagonist and give an example of each.',
    steps: [
      'Agonist: binds to AND activates a receptor, producing the same effect as the body’s own chemical — the key fits the lock and opens the door. Example: a reliever inhaler that activates beta receptors to open the airways.',
      'Antagonist: binds to the receptor and blocks it without producing a response — the key fits but the door will not open. Example: a beta blocker, which stops the body’s own adrenaline from binding.',
    ],
    src: PD + 'slides 23–24' },
  { ...K, pts: 2, q: 'Distinguish potency from efficacy, with an example.',
    steps: [
      'Potency: the amount of drug needed to produce a given effect — a more potent drug gives the same effect at a lower dose. Efficacy: the ability of the drug to produce a response; maximal efficacy is the greatest response possible however much the dose is raised.',
      'Example: two pain relievers may both relieve mild pain (one at 5 mg, one at 500 mg — different potency), but only one may be able to relieve severe pain at any dose (greater efficacy).',
    ],
    src: PD + 'slides 14–16' },
  { ...K, pts: 2, q: 'Define an adverse effect and give an example. How does it differ from an adverse drug event?',
    steps: [
      'Definition: a harmful effect suspected to be caused by a medicine or vaccine (the preferred term for “side effect” or adverse drug reaction). Example: nausea (mild) or liver injury or a severe allergy (serious).',
      'An adverse drug EVENT is an injury related to the drug but not always due to the drug itself — e.g. harm from an error in prescribing, dispensing or administration.',
    ],
    src: PD + 'slides 43–44' },
];
