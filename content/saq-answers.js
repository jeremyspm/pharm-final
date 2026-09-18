/* Model answers for essay questions captured from Canvas — this course's quizzes have
   none, so the list is empty. `norm` is the shared key normaliser (byte-identical to
   hs2-test2/content/saq-answers.js). */
export const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const SAQ_ANSWERS = [];
