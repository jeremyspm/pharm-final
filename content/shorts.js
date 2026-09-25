/* The SHORT versions of this paper's written answers (26 Sep 2026, his rule: estate memory "saq-short-answers"). Every
   written question in this bank is the tool's, and so is its full model answer; a full answer packs several facts into a
   line, and nobody recalls that cold. So each one is cut into short lines, one fact a line, grouped under the question's
   own parts, with a memory hook. Gated by shorts.mjs: every **bold** word must be in the step (`of`) it is cut from,
   every step needs a line, a line is at most 14 words, and every written question needs a short version.
     shorts/joan.js     — the 75 short answers in Joan's format (listed first on the page, as the paper asks them)
     shorts/topics-a.js — the topic rows' written questions, Modules 1–5 (concepts to administration)
     shorts/topics-b.js — the topic rows' written questions, Modules 5–8 (patient education to anaphylaxis) */
import { JOAN } from './shorts/joan.js';
import { TOPICS_A } from './shorts/topics-a.js';
import { TOPICS_B } from './shorts/topics-b.js';

export const SHORTS = [...JOAN, ...TOPICS_A, ...TOPICS_B];
