/* shorts.mjs — the short versions of the written answers (his rule, 26 Sep 2026, estate memory "saq-short-answers"),
   gated and keyed to the bank's question ids, for build.mjs and resplice.mjs (spliced into the page at /*@SHORTS@*\/).
   A shared Paper Sim pipeline file (shared-check.mjs): ported from hs2-final's shorts.mjs, same gates.
   A sim's own short versions live in content/shorts.js (export const SHORTS = [...]). A sim without that file has none
   yet: the build says so, and its written questions keep their full model answers as the tick list.
   An entry: {quiz, k, title, hook, groups: [{q, facts: [{t, of, fix?}]}], skip?, none?, a?}
     quiz + k — the quiz row and the opening of the question, normalised; it must match exactly ONE written question
                (a = the normalised opening of the answer's first step, for two questions that open the same way).
     a line   — {t, of}: `of` = the step (or steps) of the full answer it is cut from; every **bold** word must be found
                there, and a line is at most 14 words. `fix` = the line corrects its step, with the reason shown on the
                page (only a fix line may bold a word its step does not have).
     skip     — {step: reason} for a step that carries no fact; every other step must have a line.
     none     — the question has no text to cut (with the reason): it keeps its full answer as the tick list.
   Every gate is a hard failure. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(HERE, 'content', 'shorts.js');
const { SHORTS } = fs.existsSync(FILE) ? await import(pathToFileURL(FILE).href) : { SHORTS: null };

const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const pad = t => ' ' + String(t).toLowerCase().replace(/\*\*/g, '').replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
const stem = q => norm(q.qt || q.q || '');

/* one short version against the answer (its steps) it was cut from */
function checkEntry(s, at, steps, fails) {
  const flat = [], skip = s.skip || {};
  if (!String(s.title || '').trim() || String(s.title).split(/\s+/).length > 8) fails.push(`${at}: title empty or over 8 words`);
  if (!String(s.hook || '').trim()) fails.push(`${at}: hook empty`);
  if (!Array.isArray(s.groups) || !s.groups.length) fails.push(`${at}: no groups`);
  for (const g of s.groups || []) {
    if (!String(g.q || '').trim()) fails.push(`${at}: a group has no heading`);
    if (!Array.isArray(g.facts) || !g.facts.length) fails.push(`${at}: group "${g.q}" has no lines`);
    flat.push(...(g.facts || []));
  }
  for (const [i, why] of Object.entries(skip)) {
    if (!(Number(i) >= 0 && Number(i) < steps.length)) fails.push(`${at}: skip ${i} is out of range`);
    if (!String(why || '').trim()) fails.push(`${at}: skip ${i} needs a reason`);
  }
  for (const f of flat) {
    const ofs = Array.isArray(f.of) ? f.of : [f.of];
    if (!ofs.length || !ofs.every(i => Number.isInteger(i) && i >= 0 && i < steps.length)) { fails.push(`${at}: line "${f.t}" cites ${JSON.stringify(f.of)}, out of range`); continue; }
    if (ofs.some(i => i in skip)) fails.push(`${at}: line "${f.t}" cites a skipped step`);
    const bold = [...String(f.t).matchAll(/\*\*(.+?)\*\*/g)].map(m => m[1]);
    if (!bold.length) fails.push(`${at}: line "${f.t}" has no bold mark word`);
    if ('fix' in f) { if (!String(f.fix || '').trim()) fails.push(`${at}: correction line "${f.t}" needs its reason`); }
    else { const src = pad(ofs.map(i => steps[i]).join(' ')); for (const b of bold) if (!src.includes(pad(b))) fails.push(`${at}: bold "${b}" is not in step ${ofs.map(i => i + 1).join('+')}`); }
    if (String(f.t).split(/\s+/).length > 14) fails.push(`${at}: line "${f.t}" is over 14 words`);
  }
  steps.forEach((_, i) => { if (!(i in skip) && !flat.some(f => (Array.isArray(f.of) ? f.of : [f.of]).includes(i))) fails.push(`${at}: step ${i + 1} has no short line (skip it, with the reason, if it carries no fact)`); });
}
/* what the page gets: the lines, the steps each is cut from (a step's quote, q.prefs, is shown under the first line cut
   from that step, so the page needs `of` too) and the corrections' reasons */
const pack = (s, id) => ({ id, title: s.title, hook: s.hook,
  groups: s.groups.map(g => ({ q: g.q, facts: g.facts.map(f => {
    const of = Array.isArray(f.of) ? f.of : [f.of];
    return 'fix' in f ? { t: f.t, of, fix: f.fix } : { t: f.t, of }; }) })) });

/* {shorts: {question id -> short version}, fails: [...], none: true when this sim has no content/shorts.js} */
export function loadShorts(questions) {
  const fails = [], out = {};
  if (!SHORTS) return { shorts: out, fails, none: true };
  const W = questions.filter(q => q.saq), done = new Set();
  for (const s of SHORTS) {
    const at = `${s.quiz} "${s.k}"${s.a ? ` / "${s.a}"` : ''}`;
    const hit = W.filter(q => q.quiz === s.quiz && stem(q).startsWith(s.k) && (!s.a || norm(q.saq.steps[0] || '').startsWith(s.a)));
    if (hit.length !== 1) { fails.push(`${at}: matched ${hit.length} written questions (needs exactly 1)`); continue; }
    const q = hit[0];
    if (done.has(q.id)) { fails.push(`${at}: a second short version for the same question`); continue; }
    done.add(q.id);
    if ('none' in s) { if (!String(s.none || '').trim()) fails.push(`${at}: 'none' needs its reason`); continue; }
    checkEntry(s, at, q.saq.steps, fails);
    out[q.id] = pack(s, `${s.quiz}:${s.k}${s.a ? ':' + s.a : ''}`);
  }
  for (const q of W) if (!done.has(q.id)) fails.push(`written question ${q.id} [${q.quiz}] ("${stem(q).slice(0, 50)}") has no short version, and no 'none' with its reason`);
  return { shorts: out, fails };
}

/* JSON for an inline <script>: a "</" inside it would end the script block early */
export const shortsJSON = o => JSON.stringify(o).replace(/<\//g, '<\\/');
