/* HAND-WRITTEN short answers in the format Joan described for the final on 16 Sep 2026:
   a definition plus an example, 3-4 lines, no question about a specific drug.
   THE TOOL wrote them (questions and model answers) - they are not Joan's wording, and the
   page says so. One file per topic under content/joan/; port-intro-pharm.mjs appends them to
   the generated content/authored-saqs.js. Shape: { sys, quiz, quizName, q, steps:[definition,
   example, (a third point)], pts, src } - src names her deck + slide, her answer sheet, or her
   recorded lecture + timestamp. Add a topic = add its file + one line here, then
   `node port-intro-pharm.mjs && node build.mjs`. */
import * as foundPkpd from './joan/found-pkpd.js';
import * as adminLife from './joan/admin-life.js';
import * as law from './joan/law.js';
import * as ethics from './joan/ethics.js';
import * as devmkt from './joan/devmkt.js';
import * as cam from './joan/cam.js';

export const JOAN_SAQS = [foundPkpd, adminLife, law, ethics, devmkt, cam].flatMap(m => m.SAQS);
