/* Chart Speak — the med-chart terms & abbreviations trainer (terms.html, built by build-terms.mjs).
   Everything the trainer knows lives in this folder; the build checks it both ways and fails loudly.

   A TERM:
     id    unique key (letters, digits, - and _)
     c     category (CATS below) · s  sub-group — the first place wrong options are drawn from
     t     how it is written on a chart · a  other ways it is written (shown; never offered as a wrong option)
     m     what it means — the answer in the drill, kept to one line
     x     more: shown after answering and in the glossary · w  ⚠ how it goes wrong (danger)
     g     synonym group: terms that mean the same thing never sit opposite each other in one question
     cf    classic confusions (term ids) — dealt first as the wrong options, because they are the real traps
     kd    'abbr' (default) or 'term' (a word with a definition) — decides how the question is asked
     k     provenance: 'must' the course’s Must-Know abbreviations list (Must Know: Medication & Prescription
           Abbreviations 01.26 · Concepts (2) slides 77–80) · 'deck' a course deck, named in src ·
           'ward' standard NZ ward usage, in this tool’s words · 'safe' the international error-prone list ·
           'nmc' printed on the NZ 8-Day National Medication Chart itself (NMC8D, 2012 ed.)
     src   where it comes from (required for 'deck')
     also  extra scopes a term belongs to (e.g. OD and SC are on the danger list as well as their own) */
import { TERMS as when } from './when.js';
import { TERMS as routeForm } from './route-form.js';
import { TERMS as unitChart } from './unit-chart.js';
import { TERMS as safeIv } from './safe-iv.js';
import { TERMS as obsNotes } from './obs-notes.js';
import { TERMS as pharmLaw } from './pharm-law.js';
export { ORDERS, SCENES, DANGERS, SECTION_OPTS, CODE_OPTS } from './chart-drills.js';

export const CATS = [
  { id: 'when', n: 'When & how often', ic: '⏰', d: 'OD, BD, TDS, QID, PRN, stat, mane, nocte — plus 24-hour time and 3/7-style durations.' },
  { id: 'route', n: 'Routes', ic: '💉', d: 'PO, SL, SC, IM, IV, PR and every other way a medicine gets in.' },
  { id: 'form', n: 'Forms & release', ic: '💊', d: 'tab, cap, susp, supp, MDI — and the SR, MR and EC tablets you never crush.' },
  { id: 'unit', n: 'Doses, units & rates', ic: '⚖️', d: 'mg vs mcg, units, mmol, mg/kg, drops/min, 1:1000 — and the course’s calculation words.' },
  { id: 'chart', n: 'The chart itself', ic: '📋', d: 'NHI, ADR, NKDA, the chart’s sections, the not-given codes and the rules for charting.' },
  { id: 'safe', n: 'Danger list', ic: '⚠️', d: 'Ways of writing that have hurt people — what they mean, and what to write instead.' },
  { id: 'iv', n: 'IV, lines, tubes & oxygen', ic: '🩸', d: 'PIVC, PICC, KVO, NaCl 0.9%, IDC, nasal prongs, target SpO₂.' },
  { id: 'obs', n: 'Obs & labs', ic: '📈', d: 'What you check before you give — BP, HR, RR, BGL, INR, K⁺, eGFR.' },
  { id: 'notes', n: 'Notes shorthand', ic: '🗒', d: 'Hx, Dx, c/o, NBM, #NOF, ?UTI, AF, CKD — the rest of the chart.' },
  { id: 'pharm', n: 'Pharmacology words', ic: '🧪', d: 'The course’s own definitions: half-life, bioavailability, agonist, contraindication…' },
  { id: 'law', n: 'Law, regulators & roles', ic: '🏛', d: 'Medsafe, PHARMAC, CARM, Class A/B/C, standing orders, who can prescribe.' },
];

/* how a question is asked, by kind — [forward (written form → meaning), reverse (meaning → written form)].
   A 'c.s' key overrides its kind for one sub-group. */
export const PROMPTS = {
  abbr: ['On a chart, this means…', 'How is this written on a chart?'],
  term: ['What does it mean?', 'Which word is this?'],
  'when.clock': ['In 24-hour time, this is…', 'How is this written in 24-hour time?'],
  'when.dur': ['In the notes, this means…', 'How is this written in NZ shorthand?'],
  'chart.code': ['In a dose box, this code means…', 'Which code goes in the dose box?'],
  'safe.pinch': ['In A PINCH, this letter stands for…', 'Which letter of A PINCH is this?'],
  'safe.sym': ['On a chart, this symbol means…', 'Which symbol is this?'],
};

export const TERMS = [...when, ...routeForm, ...unitChart, ...safeIv, ...obsNotes, ...pharmLaw];
