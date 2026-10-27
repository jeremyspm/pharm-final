/* THE TOOL's questions (27 Oct 2026: cut to what Joan's own 54 do not already ask). Short answers in the format Joan
   described for the final on 16 Sep 2026 — a definition plus an example — and, in drugs.js, the drugs she named on 20 Oct
   with two easy calculations. They are not Joan's wording, and the page says so. One file per topic under content/joan/;
   gen-authored.mjs writes them into the generated content/authored-*.js. Shape: { sys, quiz, quizName, q,
   steps:[definition, example, (a third point)], pts, src } - src names her deck + slide, her answer sheet, or her
   recorded lecture + timestamp. A topic file may also export MCQS (shape { sys, quiz, quizName, q, options, correct, why,
   src }). Add a topic = add its file + one line here, then `node gen-authored.mjs && node build.mjs`. */
import * as foundPkpd from './joan/found-pkpd.js';
import * as adminLife from './joan/admin-life.js';
import * as law from './joan/law.js';
import * as ethics from './joan/ethics.js';
import * as devmkt from './joan/devmkt.js';
import * as cam from './joan/cam.js';
import * as imm from './joan/imm.js';
import * as tox from './joan/tox.js';
import * as drugs from './joan/drugs.js';
import * as abbr from './joan/abbr.js';

const TOPICS = [abbr, drugs, foundPkpd, adminLife, law, ethics, devmkt, imm, tox, cam];
export const JOAN_SAQS = TOPICS.flatMap(m => m.SAQS);
export const JOAN_MCQS = TOPICS.flatMap(m => m.MCQS || []);
