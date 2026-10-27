/* The guided-recall page (rep.html, built by rep.build.mjs) for the Pharmacology written section, 27 Oct 2026: the
   HS2 Final ladder on this paper's short answers. Joan's own 18 (her three Formative mini-exams, her model answers, cut
   into short lines in content/shorts/hers.js) come first in the queue; then the abbreviations she said you must know, as
   four key-word cards; then the tool's 34 in her format, tagged. One group per topic (META.sys), plus Abbreviations.
   The abbreviation cards are the course's Must-Know list (Must Know: Medication & Prescription Abbreviations 01.26,
   Pharmacology Concepts (2) slides 77–80) and the four more she named on 20 Oct — Q6H [1:19:01], EC, SR, CR
   [1:33:06–1:33:25] — with the meanings Chart Speak drills (content/terms/). */
import { META } from '../sim.config.mjs';

const MUST = 'The course’s Must Know: Medication & Prescription Abbreviations list (01.26), Pharmacology Concepts (2) slides 77–80 · Joan, 20 Oct: “You must, must, must know your abbreviations” [1:18:40]';
/* small cards (5 or fewer lines), so none is split into parts while its question still lists every term */
const pieces = [
  { id: 'abbr-often', group: 'abbr', title: 'How often', src: MUST,
    ask: 'What do these mean on a medication chart: OD, BD, TDS, QID?',
    facts: ['OD — **once a day**', 'BD — **twice a day**', 'TDS — **three times a day**', 'QID — **four times a day**'] },
  { id: 'abbr-clock', group: 'abbr', title: 'By the clock, or when needed', src: MUST + ' · Q6H: Joan, 20 Oct [1:19:01]',
    ask: 'What do these mean on a medication chart: q4h, q6h, PRN, stat?',
    facts: ['q4h — every **4 hours**', 'q6h — every **6 hours**', 'PRN — **when required**', 'stat — **immediately**'] },
  { id: 'abbr-day', group: 'abbr', title: 'Time of day and meals', src: MUST,
    ask: 'What do these mean on a medication chart: mane, nocte, ac, pc?',
    facts: ['mane — in the **morning**', 'nocte — at **night**', 'ac — **before meals**', 'pc — **after meals**'] },
  { id: 'abbr-enteral', group: 'abbr', title: 'Routes: mouth, tongue, rectum', src: MUST,
    ask: 'What route does each mean: PO, SL, PR?',
    facts: ['PO — **by mouth**', 'SL — under the **tongue** (**sublingual**)', 'PR — into the **rectum**'] },
  { id: 'abbr-inject', group: 'abbr', title: 'Routes: injections', src: MUST,
    ask: 'What route does each mean: SC, IM, IV?',
    facts: ['SC — under the **skin** (**subcutaneous**)', 'IM — into a **muscle**', 'IV — into a **vein**'] },
  { id: 'abbr-release', group: 'abbr', title: 'Tablets you never crush', src: 'Joan, 20 Oct [1:33:06–1:33:25] (“EC, SR, CR”) · Pharmacology Concepts (2) 2026, slide 66',
    ask: 'What do these mean: EC, SR, CR?',
    facts: ['EC — **enteric coated**', 'SR — **slow release**', 'CR — **controlled release**'] },
  { id: 'abbr-allergy', group: 'abbr', title: 'Allergies', src: MUST,
    ask: 'What do these mean on a chart: NKA, NKDA?',
    facts: ['NKA — **no known allergies**', 'NKDA — no known **drug** allergies'] },
];

export const REP = {
  name: 'Learn the short answers',
  sub: 'Joan’s 18 short answers first, then the abbreviations, then the tool’s 34 · read it, type it, it comes back',
  groupWord: 'topics',
  how: 'Joan’s own short answers — her three Formative mini-exams, her model answers — come first in the queue. Then the abbreviations she said you must, must, must know: the course’s Must-Know list and the four more she named on 20 Oct. The tool’s short answers in her format (a definition plus an example) come last and are tagged “Tool’s question”.',
  foot: 'Student-made revision from Joan’s Formative mini-exams and the course’s lecture decks. Not MIT material. Progress stays in this browser.',
  groups: [{ id: 'abbr', title: 'Abbreviations (must know)', hue: 45 },
    ...Object.entries(META.sys).map(([id, title]) => ({ id, title, hue: META.hue[id] }))],
  pieces,
  order: ['hers', 'pieces', 'recall', 'tool'],
};
