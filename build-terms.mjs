/* Build terms.html — Chart Speak, the med-chart terms & abbreviations trainer — from content/terms/ and
   terms-engine.mjs, into terms-template.html, with the Paper Sim's stylesheet copied in from template.html so
   the two pages can never drift apart.

   Gates fail the build both ways, in the house manner: a reference to a term that does not exist is as fatal as
   a question with two right answers. And the audit does not read the code, it DRIVES it — every term, both ways
   round, dealt many times with the same engine the page ships — asserting each question shows its answer exactly
   once, never repeats an option, never offers a synonym or a same-spelled term beside the answer, and is full.

     node build-terms.mjs          → terms.html
     node build-terms.mjs --lint   → also print wording that may give an answer away */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TERMS, CATS, PROMPTS, ORDERS, SCENES, DANGERS, SECTION_OPTS, CODE_OPTS } from './content/terms/index.js';
import * as E from './terms-engine.mjs';
import { META } from './sim.config.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const fails = [], notes = [];
const fail = m => fails.push(m);

/* ── terms ── */
const ids = new Set(), catIds = new Set(CATS.map(c => c.id)), scopeIds = new Set([...catIds]);
for (const t of TERMS) {
  const where = `term ${t.id || '(no id)'}`;
  if (!/^[A-Za-z0-9_-]+$/.test(t.id || '')) fail(`${where}: bad id`);
  if (ids.has(t.id)) fail(`${where}: duplicate id`); ids.add(t.id);
  if (!catIds.has(t.c)) fail(`${where}: category ${t.c} is not in CATS`);
  for (const f of ['t', 'm']) if (typeof t[f] !== 'string' || !t[f].trim()) fail(`${where}: needs ${f}`);
  if (t.m && t.m.length > 110) fail(`${where}: meaning is ${t.m.length} chars — keep it to one line (≤110)`);
  if (t.kd && !['abbr', 'term'].includes(t.kd)) fail(`${where}: kd must be abbr or term`);
  if (t.k && !['must', 'deck', 'ward', 'safe'].includes(t.k)) fail(`${where}: unknown provenance ${t.k}`);
  if (t.k === 'deck' && !t.src) fail(`${where}: a deck term must name its source (src)`);
  if (t.a && (!Array.isArray(t.a) || t.a.some(x => typeof x !== 'string' || !x.trim()))) fail(`${where}: a must be a list of spellings`);
  for (const s of t.also || []) if (!scopeIds.has(s)) fail(`${where}: also names unknown scope ${s}`);
  if (!PROMPTS[t.c + '.' + t.s] && !PROMPTS[E.kindOf(t)]) fail(`${where}: no prompt for its kind`);
}
for (const t of TERMS) for (const c of t.cf || []) {
  if (!ids.has(c)) fail(`term ${t.id}: confusion ${c} does not exist`);
  if (c === t.id) fail(`term ${t.id}: lists itself as a confusion`);
}
/* a synonym group of one is a typo */
const gCount = {}; for (const t of TERMS) if (t.g) gCount[t.g] = (gCount[t.g] || 0) + 1;
for (const [g, n] of Object.entries(gCount)) if (n < 2) fail(`synonym group "${g}" has only one term — a typo?`);
/* two terms that mean the same thing must be marked as such (same g), or share a spelling (then the engine keeps
   them apart anyway) — otherwise a question could offer both */
const byMeaning = new Map();
for (const t of TERMS) { const k = E.normM(t.m); if (!byMeaning.has(k)) byMeaning.set(k, []); byMeaning.get(k).push(t); }
for (const [, ts] of byMeaning) for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
  const a = ts[i], b = ts[j];
  if (!(a.g && a.g === b.g) && !E.clash(a, b)) fail(`terms ${a.id} and ${b.id} have the same meaning "${a.m}" — give them one synonym group (g)`);
}
/* the same spelling with different meanings is real (PR route / PR pulse) — the engine keeps them apart; list them */
const sameSpelled = [];
for (let i = 0; i < TERMS.length; i++) for (let j = i + 1; j < TERMS.length; j++)
  if (E.clash(TERMS[i], TERMS[j]) && E.normM(TERMS[i].m) !== E.normM(TERMS[j].m)) sameSpelled.push(`${TERMS[i].t}: ${TERMS[i].id} / ${TERMS[j].id}`);

/* ── the audit: deal every question, many times ── */
let seed = 20260926;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const DEALS = 40;
let nQ = 0, nDeals = 0; const posHist = { f: [0, 0, 0, 0], r4: [0, 0, 0, 0], r5: [0, 0, 0, 0, 0], r6: [0, 0, 0, 0, 0, 0] };
const tierUse = { cf: 0, sub: 0, cat: 0, far: 0 };
const byId = new Map(TERMS.map(t => [t.id, t]));
for (const t of TERMS) for (const dir of t.rev === 0 ? ['f'] : ['f', 'r']) {
  nQ++;
  for (let d = 0; d < DEALS; d++) {
    nDeals++;
    const { opts, ans } = E.options(t, dir, TERMS, rnd), where = `question ${t.id}/${dir}`;
    const want = E.optCount(dir, t, TERMS);
    if (opts.length !== want) { fail(`${where}: only ${opts.length} options could be dealt (wants ${want})`); break; }
    if (opts[ans].id !== t.id) { fail(`${where}: the answer is not where the engine says`); break; }
    if (opts.filter(o => o.id === t.id).length !== 1) { fail(`${where}: the answer appears ${opts.filter(o => o.id === t.id).length} times`); break; }
    const keys = opts.map(o => dir === 'f' ? E.normM(o.text) : E.normW(o.text));
    if (new Set(keys).size !== keys.length) { fail(`${where}: two options read the same: ${opts.map(o => o.text).join(' | ')}`); break; }
    const bad = opts.find(o => o.id !== t.id && ((t.g && byId.get(o.id).g === t.g) || E.clash(t, byId.get(o.id))));
    if (bad) { fail(`${where}: offers ${bad.id}, a synonym or same-spelled term — two right answers`); break; }
    if (dir === 'r' && opts.some(o => E.kindOf(byId.get(o.id)) !== E.kindOf(t))) { fail(`${where}: mixes abbreviations with words — the odd one out is the answer`); break; }
    posHist[dir === 'f' ? 'f' : 'r' + want][ans]++;
    for (const o of opts) if (o.id !== t.id) { const x = byId.get(o.id);
      tierUse[(t.cf || []).includes(o.id) ? 'cf' : x.c === t.c && x.s === t.s ? 'sub' : x.c === t.c ? 'cat' : 'far']++; }
  }
}
/* the answer's position must be uniform — a biased slot is learnable */
for (const k of Object.keys(posHist)) {
  const h = posHist[k], tot = h.reduce((a, b) => a + b, 0), exp = tot / h.length;
  /* 3.5 standard deviations of a fair count: catches "the answer is usually first", not sampling noise */
  if (tot && h.some(n => Math.abs(n - exp) > 3.5 * Math.sqrt(exp))) fail(`answer position is not uniform (${k}): ${h.join(' / ')}`);
}

/* ── the deal order: misses first, then part-way, then new, then refreshers ── */
{
  const pool = TERMS.slice(0, 12), S = {}, now = 1e12;
  E.record(S, pool[5].id, false, now - 1000, E.LOCK.t);                       // a miss
  E.record(S, pool[7].id, true, now - 500, E.LOCK.t);                         // part-way
  for (let i = 0; i < 3; i++) E.record(S, pool[9].id, true, now - E.REFRESH_MS - 1, E.LOCK.t);   // locked, stale
  const got = E.deal(pool, S, pool.length, now, rnd);
  if (got[0].id !== pool[5].id) fail('deal: a missed term does not lead the run');
  if (got.length !== pool.length || new Set(got.map(x => x.id)).size !== pool.length) fail('deal: the run lost or repeated a term');
  /* spacing: a term answered right a moment ago waits behind every new term; one answered 10+ minutes ago does not */
  const S2 = {}; E.record(S2, pool[0].id, true, now - 1000, E.LOCK.t); E.record(S2, pool[1].id, true, now - E.GAP_MS - 1, E.LOCK.t);
  const run = E.deal(pool, S2, 3, now, rnd).map(x => x.id);
  if (run.includes(pool[0].id)) fail('deal: a term seen seconds ago was dealt ahead of new ones — no spacing');
  if (!run.includes(pool[1].id)) fail('deal: a part-learned term due again was not dealt');
  if (!S[pool[9].id].L) fail(`record: ${E.LOCK.t} right in a row did not lock a term`);
  E.record(S, pool[9].id, false, now, E.LOCK.t);
  if (S[pool[9].id].L || S[pool[9].id].s !== 0) fail('record: a wrong answer did not unlock a term');
}

/* ── orders ── every wrong reading must be the right one with ONE thing changed: a word diff may find at most two
   changed stretches (e.g. "under … under" → "over … over"), and the lengths must stay close — otherwise the right
   reading is the one that reads differently, and it can be picked without reading the chart at all */
function diffRuns(a, b) {
  const A = a.split(/\s+/), B = b.split(/\s+/), n = A.length, m = B.length;
  const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  let i = 0, j = 0, runs = 0, inRun = false;
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) { i++; j++; inRun = false; continue; }
    if (!inRun) { runs++; inRun = true; }
    if (j < m && (i >= n || L[i][j + 1] >= L[i + 1][j])) j++; else i++;
  }
  return runs;
}
const SECS = ['reg', 'prn', 'once', 'fluid', 'o2'], oIds = new Set();
for (const o of ORDERS) {
  const where = `order ${o.id}`;
  if (oIds.has(o.id)) fail(`${where}: duplicate id`); oIds.add(o.id);
  if (!SECS.includes(o.sec)) fail(`${where}: unknown section ${o.sec}`);
  for (const f of ['med', 'dose', 'route', 'freq', 'read']) if (!o[f]) fail(`${where}: needs ${f}`);
  if (!Array.isArray(o.bad) || o.bad.length !== 3 || o.bad.some(b => !b[0] || !b[1])) fail(`${where}: needs exactly 3 wrong readings, each with its why`);
  const texts = [o.read, ...(o.bad || []).map(b => b[0])].map(E.normM);
  if (new Set(texts).size !== texts.length) fail(`${where}: two readings are the same`);
  for (const [b] of o.bad || []) {
    const runs = diffRuns(o.read, b), ratio = b.length / o.read.length;
    if (runs > (o.maxRuns || 2)) fail(`${where}: a wrong reading changes ${runs} things, not one — "${b.slice(0, 70)}…"`);
    if (ratio < 0.8 || ratio > 1.25) fail(`${where}: a wrong reading is ${Math.round(ratio * 100)}% the length of the right one — the length gives it away`);
  }
  if (!o.tk || !o.tk.length) fail(`${where}: needs words to decode (tk)`);
  for (const k of o.tk || []) if (!ids.has(k)) fail(`${where}: decodes ${k}, which is not a term`);
}
/* ── scenes ── */
const xIds = new Set();
for (const s of SCENES) {
  const where = `scene ${s.id}`;
  if (xIds.has(s.id)) fail(`${where}: duplicate id`); xIds.add(s.id);
  if (!s.q || !s.why) fail(`${where}: needs q and why`);
  if (s.k === 'sec' && !SECTION_OPTS.includes(s.a)) fail(`${where}: answer "${s.a}" is not a section`);
  else if (s.k === 'code' && !CODE_OPTS.includes(s.a)) fail(`${where}: answer "${s.a}" is not a code`);
  else if (s.k === 'mcq' && (!Array.isArray(s.opts) || s.opts.length < 3 || new Set(s.opts).size !== s.opts.length)) fail(`${where}: needs 3+ distinct options (the first is the answer)`);
  else if (s.k === 'mcq' && s.opts[0].length > 1.2 * Math.max(...s.opts.slice(1).map(o => o.length))) fail(`${where}: the answer is much the longest option — length gives it away`);
  else if (!['sec', 'code', 'mcq'].includes(s.k)) fail(`${where}: unknown kind ${s.k}`);
}
for (const c of CODE_OPTS) if (!SCENES.some(s => s.a === c)) notes.push(`code ${c} has no scenario`);
/* ── dangers: exactly one dangerous part per line, and no other part on the danger list ── */
const dangerForms = new Set();
for (const t of TERMS) if (t.c === 'safe' || (t.also || []).includes('safe')) {
  if (t.kd === 'term') continue;                                              // "trailing zero" is a concept, not a spelling
  dangerForms.add(t.t); if (t.c === 'safe') for (const a of t.a || []) dangerForms.add(a);
}
const dIds = new Set();
for (const d of DANGERS) {
  const where = `danger ${d.id}`;
  if (dIds.has(d.id)) fail(`${where}: duplicate id`); dIds.add(d.id);
  if (!ids.has(d.d)) fail(`${where}: teaches ${d.d}, which is not a term`);
  if (d.tk.filter(x => x[1]).length !== 1) fail(`${where}: must mark exactly one dangerous part`);
  for (const [txt, hot] of d.tk) if (!hot) {
    if (dangerForms.has(txt)) fail(`${where}: "${txt}" is also on the danger list — one danger per line`);
    if (/\d\.0\b/.test(txt)) fail(`${where}: "${txt}" has a trailing zero — one danger per line`);
    if (/(^|[^\d])\.\d/.test(txt)) fail(`${where}: "${txt}" has a naked decimal — one danger per line`);
    if (/\d+U\b|\bIU\b|µg|\bcc\b/.test(txt)) fail(`${where}: "${txt}" carries a dangerous unit — one danger per line`);
  }
  if (!d.risk || !d.fix) fail(`${where}: needs risk and fix`);
}

/* ── wording that may give the answer away (a word of the term inside its own meaning) — printed, not fatal ── */
if (process.argv.includes('--lint')) {
  const stop = new Set(['with', 'from', 'into', 'that', 'this', 'your', 'the', 'and', 'for', 'a', 'of']);
  for (const t of TERMS) {
    const words = E.normM(t.t).split(' ').filter(w => w.length >= 4 && !stop.has(w));
    const m = ' ' + E.normM(t.m) + ' ';
    const hit = words.filter(w => m.includes(' ' + w.slice(0, Math.max(4, w.length - 2))));
    if (hit.length) console.log(`  lint ${t.id}: "${t.t}" → "${t.m}" repeats ${hit.join(', ')}`);
  }
}

if (fails.length) { console.error('BUILD FAILED:\n  ' + fails.slice(0, 60).join('\n  ') + (fails.length > 60 ? `\n  …and ${fails.length - 60} more` : '')); process.exit(1); }

/* ── emit ── */
const css = (fs.readFileSync(path.join(HERE, 'template.html'), 'utf8').match(/<style>([\s\S]*?)<\/style>/) || [])[1];
if (!css) { console.error('BUILD FAILED: no <style> in template.html to copy'); process.exit(1); }
const engine = fs.readFileSync(path.join(HERE, 'terms-engine.mjs'), 'utf8').replace(/^export /gm, '');
if (/^\s*import\b/m.test(engine)) { console.error('BUILD FAILED: terms-engine.mjs must not import anything — it is inlined'); process.exit(1); }
const DATA = {
  built: new Date().toISOString().slice(0, 10), prefix: META.prefix, hue: (META.tool || {}).hue || '#4f46e5',
  kick: (META.tool || {}).kick || META.paper, short: META.short, back: META.h1 ? META.h1.replace(/\s*·\s*Paper Sim$/, '') + ' · Paper Sim' : 'Paper Sim',
  cats: CATS, prompts: PROMPTS, terms: TERMS, orders: ORDERS, scenes: SCENES, dangers: DANGERS, sectionOpts: SECTION_OPTS, codeOpts: CODE_OPTS,
};
const tpl = fs.readFileSync(path.join(HERE, 'terms-template.html'), 'utf8');
for (const mk of ['/*@PAPERSIM_CSS@*/', '/*@DATA@*/', '/*@ENGINE@*/']) if (tpl.split(mk).length !== 2) { console.error('BUILD FAILED: expected exactly one ' + mk); process.exit(1); }
const json = JSON.stringify(DATA).replace(/<\//g, '<\\/');
const out = tpl.replace('/*@PAPERSIM_CSS@*/', () => css).replace('/*@DATA@*/', () => json).replace('/*@ENGINE@*/', () => engine);
/* parse the page's own script before it ships: one bad escape kills a single-file app silently (estate memory
   "silent JS death in single-file apps") */
const scripts = [...out.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 1) { console.error('BUILD FAILED: expected one inline script'); process.exit(1); }
try { new Function(scripts[0]); } catch (e) { console.error('BUILD FAILED: the page script does not parse — ' + e.message); process.exit(1); }
fs.writeFileSync(path.join(HERE, 'terms.html'), out);

const byCat = CATS.map(c => `${c.id} ${TERMS.filter(t => t.c === c.id).length}`).join(' · ');
const prov = ['must', 'deck', 'ward', 'safe'].map(k => `${k} ${TERMS.filter(t => (t.k || 'ward') === k).length}`).join(' · ');
const tu = Object.values(tierUse).reduce((a, b) => a + b, 0);
console.log(`terms: ${TERMS.length} (${byCat})`);
console.log(`provenance: ${prov}`);
console.log(`audit: ${nQ} questions dealt ${DEALS}× each = ${nDeals} deals — every one full, answer once, no repeats, no two right answers`);
console.log(`answer position: forward ${posHist.f.join('/')} · reverse, 6 options ${posHist.r6.join('/')} · 5 ${posHist.r5.join('/')} · 4 ${posHist.r4.join('/')}`);
console.log(`wrong options drawn from: confusions ${Math.round(100 * tierUse.cf / tu)}% · sub-group ${Math.round(100 * tierUse.sub / tu)}% · category ${Math.round(100 * tierUse.cat / tu)}% · elsewhere ${Math.round(100 * tierUse.far / tu)}%`);
console.log(`same spelling, different meaning (kept apart): ${sameSpelled.join(' · ') || 'none'}`);
console.log(`orders ${ORDERS.length} · scenes ${SCENES.length} · dangers ${DANGERS.length}${notes.length ? ' · ' + notes.join('; ') : ''}`);
console.log(`terms.html ${(fs.statSync(path.join(HERE, 'terms.html')).size / 1024) | 0} KB · script parses`);
