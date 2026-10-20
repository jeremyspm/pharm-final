/* Joan's OWN questions, read by build.mjs (the optional content/hers.js hook): the three Formative mini-exams she
   published with answers on 20 Oct 2026 (Assessment Information → Exam Practice (Formative) Tests). They are not Canvas
   quizzes — each is a Word document with her key highlighted and her model answers in red — so nothing here is a
   capture; content/formatives/ transcribes them verbatim, one file per mini-exam. She sits them in class one per revision
   session (1 on Tue 20 Oct; 2 and 3 in the sessions after), and published all three answer documents at once.
   These are the first pharmacology questions on this paper that she wrote herself. */
import * as one from './formatives/mini-exam-1.js';
import * as two from './formatives/mini-exam-2.js';
import * as three from './formatives/mini-exam-3.js';

const ALL = [one, two, three];
export const HER_MCQS = ALL.flatMap(m => m.MCQS);
export const HER_SAQS = ALL.flatMap(m => m.SAQS);
