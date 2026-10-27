/* The SHORT versions of this paper's written answers (26 Sep 2026, his rule: estate memory "saq-short-answers"). Every
   written question in this bank is the tool's, and so is its full model answer; a full answer packs several facts into a
   line, and nobody recalls that cold. So each one is cut into short lines, one fact a line, grouped under the question's
   own parts, with a memory hook. Gated by shorts.mjs: every **bold** word must be in the step (`of`) it is cut from,
   every step needs a line, a line is at most 14 words, and every written question needs a short version.
     shorts/hers.js     — Joan's OWN 18 short answers, her three Formative mini-exams (her model answers, cut by the tool)
     shorts/joan.js     — the 22 short answers in Joan's format (listed first on the page, as the paper asks them)
     shorts/imm.js      — the 6 Module 8 short answers in Joan's format (immunology, vaccines & allergy)
     shorts/tox.js      — the 5 Module 9 short answers in Joan's format (licit & illicit drugs, toxicology)
     shorts/drugs.js    — the one written question on the drugs she named on 20 Oct
   27 Oct 2026: topics-a.js and topics-b.js went with the intro-pharm questions they were cut from. */
import { HERS } from './shorts/hers.js';
import { JOAN } from './shorts/joan.js';
import { IMM } from './shorts/imm.js';
import { TOX } from './shorts/tox.js';
import { DRUGS } from './shorts/drugs.js';

export const SHORTS = [...HERS, ...JOAN, ...IMM, ...TOX, ...DRUGS];
