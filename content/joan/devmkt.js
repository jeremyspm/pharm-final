/* Drug development & marketing (Module 7, deck 13) — short answers in JOAN'S STATED EXAM
   FORMAT: a definition plus an example, 3–4 lines, no question about a specific drug.
   Deck 13 was never lectured: on 16 Sep 2026 Joan reassigned it as a self-directed online
   package [59:31 of that lecture], still examinable. THE TOOL wrote every question and model
   answer, from the deck's own slides; ported from the estate's Deck 13 study pack
   (deck13-drug-development-STUDY-PACK.md, 16 Sep 2026) with a slide named for each. */
const R = { sys: 'law', quiz: 'joan-devmkt', quizName: 'In Joan’s format · Drug development & marketing' };
const DECK = 'deck 13 Drug Development & Marketing, ';
const LEC = 'Joan’s Legal & Ethical lecture, 16 Sep 2026, ';

export const SAQS = [
  { ...R, pts: 2, q: 'Define bioequivalence and explain why it matters, with an example.',
    steps: [
      'Definition: two formulations are bioequivalent when the same active ingredient reaches the bloodstream at the same rate and to the same extent.',
      'Why and example: a generic may only be substituted for a brand if it is bioequivalent, so the patient gets the same therapeutic effect — e.g. a pharmacy dispensing the funded generic instead of the original brand of the same medicine.',
    ],
    src: DECK + 'slide 6 (“Remember bioequivalence!”); defined in deck 01 Pharmacology Concepts (1), slides 49–50' },
  { ...R, pts: 2, q: 'Why is bringing a new medicine to market so slow and expensive? Give an example of an event that made regulators this cautious.',
    steps: [
      'Reason: before marketing, developers must prove the medicine works, that its side effects are known and that it is safe in humans — it takes about 10–20 years and millions of dollars, and only about 5 in 5,000 compounds ever reach human testing.',
      'Example: thalidomide — marketed to pregnant women in the 1950s, it caused birth defects and years of litigation. “We don’t want another thalidomide tragedy.”',
    ],
    src: DECK + 'slides 4 and 6; ' + LEC + '[1:00:26]' },
  { ...R, pts: 3, q: 'Name the five key phases of the drug development pathway in order.',
    steps: [
      'Discovery and development (laboratory research to find promising compounds) → preclinical research (safety testing in laboratory models, sometimes animals, before any human).',
      'Clinical trials (multi-phase studies in people, for safety and effectiveness) → Medsafe review (the data are reviewed and the medicine approved or rejected).',
      'Post-market monitoring — surveillance continues after release; e.g. adverse reactions reported to CARM.',
    ],
    src: DECK + 'slide 7' },
  { ...R, pts: 2, q: 'Describe the purpose of Phase 1 of a clinical trial and give an example of what is measured.',
    steps: [
      'Purpose: safety and dosage — tested in a small group of 20–100 people, who may be healthy volunteers, over several months.',
      'Example: recording adverse effects at gradually increasing doses to find the dose range that is tolerated.',
    ],
    src: DECK + 'slide 10' },
  { ...R, pts: 2, q: 'What is the difference between Phase 2 and Phase 3 of a clinical trial?',
    steps: [
      'Phase 2 tests efficacy and side effects in several hundred people who have the condition, over months to two years (about a third progress).',
      'Phase 3 confirms safety and effectiveness in a large population — 300 to 3,000 people with the condition over one to four years — before the company applies for approval.',
    ],
    src: DECK + 'slides 10–11' },
  { ...R, pts: 2, q: 'What is Phase 4 of clinical research, and why does it exist? Give an example.',
    steps: [
      'Definition: post-market monitoring of long-term safety and effectiveness in several thousand patients over years, after Medsafe approval.',
      'Why and example: rare or delayed adverse effects only show up at population scale — e.g. a medicine withdrawn after post-market reports revealed a serious risk the trials were too small to see.',
    ],
    src: DECK + 'slides 11–12' },
  { ...R, pts: 3, q: 'Name the three bodies that must approve a clinical trial before it can begin in New Zealand and state what each checks.',
    steps: [
      'Medsafe — the preclinical studies, pharmacokinetics and pharmacodynamics, chemical stability and quality.',
      'SCOTT (Standing Committee on Therapeutic Trials) — the science: the safety and appropriateness of the trial design.',
      'HDEC (Health and Disability Ethics Committees) — ethical compliance.',
    ],
    src: DECK + 'slide 9' },
  { ...R, pts: 2, q: 'What is Medsafe’s role after a medicine has been approved? Give an example.',
    steps: [
      'Role: ongoing post-market surveillance — tracking adverse events and updating the medicine’s risk and benefit information; the company must also keep monitoring.',
      'Example: adverse reactions reported by nurses, doctors or patients to the Centre for Adverse Reactions Monitoring (CARM) feed this surveillance.',
    ],
    src: DECK + 'slide 12; deck 09 Legal & Ethical Aspects, slide 10' },
  { ...R, pts: 2, q: 'Define informed consent in a clinical trial and give one thing a participant must understand.',
    steps: [
      'Definition: consent that is voluntary, competent and adequately informed — and that can be withdrawn at any time.',
      'Must understand (any one): the risks and potential benefits · every procedure involved · that taking part is voluntary · that research is not the same as personalised treatment — the trial answers a question, it does not treat them individually.',
    ],
    src: DECK + 'slide 16' },
  { ...R, pts: 2, q: 'When is the use of a placebo ethically acceptable in a clinical trial? Give an example.',
    steps: [
      'Acceptable when no proven treatment exists for the condition, or when it is methodologically necessary and does not cause serious harm; problematic if those receiving placebo risk harm or a worsening condition.',
      'Example: a placebo arm in a trial for a condition that has no effective therapy yet — nobody is denied a treatment that works.',
    ],
    src: DECK + 'slide 17' },
  { ...R, pts: 2, q: 'What ethical problem does randomisation raise in a clinical trial?',
    steps: [
      'Randomising participants to a placebo or comparator increases validity, but it may deny a participant the best currently known treatment.',
      'It is only justified where there is genuine professional uncertainty that one treatment is better than the other — e.g. a new medicine compared with standard care when nobody yet knows which is better.',
    ],
    src: DECK + 'slide 18' },
  { ...R, pts: 2, q: 'Give one reason vulnerable patients need special protection in clinical trials, and one way protection can go too far.',
    steps: [
      'Reason: the history of human research includes serious abuses, and strict rules in some countries push trials into countries with weaker protections.',
      'Too far: over-protection can conflict with autonomy — e.g. a patient with a life-threatening cancer may reasonably want to accept a higher-risk trial and be denied the choice.',
    ],
    src: DECK + 'slides 14 and 19' },
  { ...R, pts: 2, q: 'What is direct-to-consumer advertising of medicines, and why is Aotearoa New Zealand unusual?',
    steps: [
      'Definition: advertising that promotes a specific branded prescription medicine to the public — its benefits, uses and risks.',
      'New Zealand is one of only two developed countries that permit it; most restrict prescription-medicine advertising to health professionals, because consumer advertising can drive demand for medicines that may not be appropriate.',
    ],
    src: DECK + 'slides 22 and 24' },
  { ...R, pts: 2, q: 'What is a “reminder” advertisement for a medicine? Give an example.',
    steps: [
      'Definition: an advertisement that mentions the medicine’s name only, without saying what it treats — it keeps the brand familiar rather than informing.',
      'Example: a billboard or pen showing only a branded product name and logo.',
    ],
    src: DECK + 'slide 26' },
  { ...R, pts: 2, q: 'What is health-seeking (disease awareness) advertising, and why can it be a concern?',
    steps: [
      'Definition: advertising that educates the public about a health condition rather than a product — e.g. “talk to your doctor about…” campaigns.',
      'Concern: it may directly or indirectly steer people towards a related brand, driving demand for a medicine while looking like neutral health education.',
    ],
    src: DECK + 'slide 25' },
  { ...R, pts: 2, q: 'Name two requirements of the Therapeutic and Health Advertising Code, and say who administers it.',
    steps: [
      'Administered by the Advertising Standards Authority; anyone can complain and complaints are investigated.',
      'Requirements (any two): claims substantiated with credible evidence · truthful, not misleading, no exaggerated benefits · key safety information included · testimonials genuine · endorsements must not imply guaranteed outcomes · unapproved medicines may not be advertised, even to health professionals.',
    ],
    src: DECK + 'slides 29–31' },
  { ...R, pts: 2, q: 'How can a nurse accidentally advertise a medicine, and how is it avoided? Give an example.',
    steps: [
      'How: advertising is defined broadly and includes what is said aloud — recommending or praising one BRAND over another to a patient can count as advertising.',
      'Avoid it by talking in generic names and giving factual, balanced, evidence-based information; individualised advice using generic names is exempt. Example: naming the generic pain reliever rather than saying a particular brand “is the best”.',
    ],
    src: DECK + 'slide 32' },
];
