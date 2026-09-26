/* Build chart.html — Chart Sim, the NZ 8-Day National Medication Chart to read and to chart on — from
   content/chart/, chart-engine.mjs, chart-render.mjs, ink.mjs and the vendored perfect-freehand, into
   chart-template.html, with the Paper Sim's stylesheet copied in from template.html.

   The gates fail the build both ways, in the house manner. A scenario must fit the real chart (every box it writes
   exists, every row letter is on the sheet), every question it can deal must have exactly one right answer, every
   round's model answer must pass the round's own check while an empty or misplaced one fails it, and the story must
   agree with the chart (a PRN the round gives must be givable at that minute; one it withholds must not be). The
   engine the build proves is the file the page runs: each module is inlined, never retyped.

     node build-chart.mjs */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { SCENARIOS } from './content/chart/index.js';
import * as E from './chart-engine.mjs';
import * as R from './chart-render.mjs';
import * as PFmod from './vendor/perfect-freehand-1.2.3.mjs';
import { META } from './sim.config.mjs';

globalThis.getStroke = PFmod.getStroke;           // ink.mjs, like Giga's, calls getStroke; the page gets it from PF
const INK = await import('./ink.mjs');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const read = f => fs.readFileSync(path.join(HERE, f), 'utf8');
const fails = [], notes = [];
const fail = m => fails.push(m);

/* ── the vendored library is the one pinned, and the ink is still Giga's ── */
const PF_SHA = 'a02e221f71a757e46915a51d8f5ffc8d1788d9134e063b3edd21f429c973d46c';
const pfSrc = read('vendor/perfect-freehand-1.2.3.mjs');
if (crypto.createHash('sha256').update(pfSrc).digest('hex') !== PF_SHA) fail('vendor/perfect-freehand-1.2.3.mjs is not the pinned 1.2.3 build (sha256 changed)');
const fnSrc = (src, name) => { const i = src.indexOf(`export function ${name}(`); if (i < 0) return null; const j = src.indexOf('\n}\n', i); return src.slice(i, j + 2); };
const inkSrc = read('ink.mjs'), gigaPath = path.join(HERE, '../gigastudyapp/lib/ink-path.js');
if (fs.existsSync(gigaPath)) {
  const giga = fs.readFileSync(gigaPath, 'utf8');
  for (const f of ['inkPathFromOutline', 'sketchStrokePath']) {
    const a = fnSrc(inkSrc, f), b = fnSrc(giga, f);
    if (!a || !b) fail(`ink: ${f} missing from ${!a ? 'ink.mjs' : 'Giga'}`);
    else if (a !== b) fail(`ink: ${f} has drifted from Giga's lib/ink-path.js — port it again, don't re-implement`);
  }
  notes.push('ink: inkPathFromOutline + sketchStrokePath match Giga byte for byte');
} else notes.push('ink: ../gigastudyapp not checked out — Giga diff skipped');

/* ── the chart: every cell id unique ── */
const IDX = new Map();
for (const { id } of R.PAGES) for (const c of R.layout(id).cells) {
  if (IDX.has(c.id)) fail(`render: cell ${c.id} is on ${IDX.get(c.id).page} and ${id}`);
  IDX.set(c.id, { page: id, cell: c });
}
const exists = id => id.endsWith('*') ? [...IDX.keys()].some(k => k.startsWith(id.slice(0, -1))) : IDX.has(id);

/* ── the scenarios ── */
let seed = 20261014;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const DEALS = 30, pos = [0, 0, 0, 0];
const STUDENT = { you: 'QQ', name: 'TEST, Student · Student Nurse' };
const lenGate = (where, a, w) => { const mx = Math.max(...w.map(x => x.length)); if (a.length > 1.2 * mx) fail(`${where}: the answer is much the longest option (${a.length} vs ${mx}) — length gives it away`); };
const sids = new Set(); let nQ = 0, nRounds = 0, nExpect = 0;
const allStaff = new Map();
for (const S0 of SCENARIOS) {
  const W = `scenario ${S0.id || '(no id)'}`;
  if (!/^[a-z0-9-]+$/.test(S0.id || '')) fail(`${W}: bad id`);
  if (sids.has(S0.id)) fail(`${W}: duplicate id`); sids.add(S0.id);
  for (const f of ['t', 'sub', 'story', 'start', 'now', 'patient', 'rounds']) if (!S0[f]) fail(`${W}: needs ${f}`);
  const pids = new Set((S0.prescribers || []).map(p => p.id)), inits = (S0.nurses || []).map(n => n.init);
  if (new Set(inits).size !== inits.length) fail(`${W}: two nurses share initials`);
  for (const n of S0.nurses || []) { if (!/^[A-Z]{2,3}$/.test(n.init)) fail(`${W}: nurse initials "${n.init}" must be 2–3 capitals`); allStaff.set(n.init, (allStaff.get(n.init) || 0) + 1); }
  const by = (w, id) => { if (id && !pids.has(id)) fail(`${W}: ${w} is by "${id}", who is not a prescriber`); };
  for (const o of S0.regular || []) { if (!R.REG_LETTERS.includes(o.L)) fail(`${W}: regular row ${o.L} is not on the first Regular sheet (I–O)`); by(`regular ${o.L}`, o.by); if (o.cease) by(`regular ${o.L} cease`, o.cease.by); }
  for (const o of S0.prn || []) {
    if (!R.PRN_LETTERS.includes(o.L)) fail(`${W}: PRN row ${o.L} is not A–H`); by(`PRN ${o.L}`, o.by);
    if (!(o.gapH > 0)) fail(`${W}: PRN ${o.L} needs gapH (hours between doses)`);
    if (o.maxAmount == null || !o.max) fail(`${W}: PRN ${o.L} needs max and maxAmount — the chart’s Max dose/24hrs is never blank`);
    for (const g of o.given || []) { const r = E.parsePrn(g); if (isNaN(E.doseAmount(r.dose, o.units))) fail(`${W}: PRN ${o.L} record "${g}" — dose not in ${o.units}`); if (!inits.includes(r.giv) || (r.chk && !inits.includes(r.chk))) fail(`${W}: PRN ${o.L} record "${g}" — initials not in the register`); }
  }
  for (const L of [...(S0.regular || []), ...(S0.prn || [])].map(o => o.L)) if ([...(S0.regular || []), ...(S0.prn || [])].filter(o => o.L === L).length > 1) fail(`${W}: row ${L} used twice`);
  for (const o of S0.regular || []) for (const [k, v] of Object.entries(o.given || {})) { const a = E.parseAdmin(v, '0000'); if (a.giv && (!inits.includes(a.giv) || (a.chk && !inits.includes(a.chk)))) fail(`${W}: regular ${o.L} ${k} "${v}" — initials not in the register`); }
  for (const o of S0.once || []) by('once only', o.by);
  for (const f of S0.fluids || []) by('fluid', f.by);
  let S = S0;
  for (let st = 0; st <= S0.rounds.length; st++) {
    const WS = `${W} stage ${st}`;
    let C;
    try { C = E.compile(S); } catch (e) { fail(`${WS}: does not compile — ${e.message}`); break; }
    for (const k of Object.keys(C.V)) if (!IDX.has(k) && !/^(reg|prn)\.[A-Z]{1,2}\.x$/.test(k)) fail(`${WS}: writes ${k}, which is not a box on the chart`);
    /* the questions, dealt many times */
    for (let d = 0; d < DEALS; d++) {
      const qs = E.questions(C, rnd), qids = new Set();
      for (const q of qs) {
        const WQ = `${WS} question ${q.id}`;
        if (qids.has(q.id)) { fail(`${WQ}: duplicate id`); continue; } qids.add(q.id);
        for (const id of q.show || []) if (!exists(id)) fail(`${WQ}: shows ${id}, which is not on the chart`);
        if (q.kind === 'tap') { if (!(q.accept || []).length || q.accept.some(a => !exists(a))) fail(`${WQ}: a tap answer that is not on the chart`); continue; }
        if (!Array.isArray(q.opts) || q.opts.length < 3) { fail(`${WQ}: fewer than 3 options`); continue; }
        if (q.opts.filter(o => o === q.a).length !== 1) fail(`${WQ}: the answer appears ${q.opts.filter(o => o === q.a).length} times`);
        if (new Set(q.opts).size !== q.opts.length) fail(`${WQ}: two options read the same`);
        if (q.opts.some(o => !o || /undefined|NaN|null/.test(o))) fail(`${WQ}: an option is broken: ${q.opts.join(' | ')}`);
        if (q.opts.length === 4) pos[q.opts.indexOf(q.a)]++;
      }
      if (d === 0) nQ += qs.length;
    }
    for (const q of S0.questions || []) if (q.kind !== 'tap' && (q.stage || 0) === st) lenGate(`${WS} own question ${q.id}`, q.a, q.w);
    if (st === S0.rounds.length) break;
    /* the round */
    const Rd = { ...S0.rounds[st], ...STUDENT }, WR = `${W} round ${st + 1}`, at = E.parseAt(Rd.at);
    nRounds++;
    if (!inits.includes(Rd.rn)) fail(`${WR}: the RN ${Rd.rn} is not in the register`);
    if (at.m < E.parseAt(S.now).m) fail(`${WR}: happens before the chart’s “now”`);
    for (const q of Rd.ask || []) { lenGate(`${WR} ask ${q.id}`, q.a, q.w); for (const id of q.show || []) if (!exists(id)) fail(`${WR} ask ${q.id}: shows ${id}, not on the chart`); }
    for (const x of Rd.expect) {
      nExpect++;
      if ((x.do === 'sign' || x.do === 'code')) {
        const m = /^reg\.([A-Z]{1,2})\.d(\d)\.s(\d)$/.exec(x.c || ''); if (!m) { fail(`${WR}: ${x.do} needs c = reg.L.dD.sK`); continue; }
        const o = C.reg.find(r => r.L === m[1]), slot = o && o.slots[+m[3]];
        if (!o || !slot) { fail(`${WR}: ${x.c} — no order or nothing due on that line`); continue; }
        const due = E.abs(+m[2], slot.t);
        if (o.ceaseAt && due >= o.ceaseAt.m) fail(`${WR}: ${x.c} — that dose is after the order was stopped`);
        if (due < o.start) fail(`${WR}: ${x.c} — that dose is before the order started`);
        /* a dose is signed near its time; a code can be written when the patient is back (U after X-ray) */
        if (Math.abs(due - at.m) > (x.do === 'sign' ? 120 : 240)) fail(`${WR}: ${x.c} — due ${slot.t} on day ${m[2]}, far from the round (${Rd.at})`);
        if (x.do === 'code' && !E.CODES[x.code]) fail(`${WR}: ${x.code} is not on the chart’s key`);
      }
      if (x.do === 'prn') {
        const o = C.prn.find(p => p.L === x.L); if (!o) { fail(`${WR}: no PRN ${x.L}`); continue; }
        const st2 = E.prnStatus(o, E.abs(at.day, x.t || at.t));
        if (!st2.can) fail(`${WR}: the round gives PRN ${x.L} (${o.med}) but the chart says it cannot be given then`);
        if (isNaN(E.doseAmount(x.dose[0].replace(/\s/g, ''), o.units))) fail(`${WR}: PRN ${x.L} dose ${x.dose[0]} is not in ${o.units}`);
        if (!String(o.route).split('/').includes(x.route)) fail(`${WR}: PRN ${x.L} route ${x.route} is not what the order allows (${o.route})`);
      }
      if (x.do === 'none') {
        if (!x.what || !x.why) fail(`${WR}: a "none" needs what and why`);
        const mp = /^prn\.([A-H])$/.exec(x.c), mr = /^reg\.([A-Z]{1,2})\.d(\d)$/.exec(x.c);
        if (mp) { const o = C.prn.find(p => p.L === mp[1]); if (!o) fail(`${WR}: no PRN ${mp[1]}`); else if (E.prnStatus(o, at.m).can) fail(`${WR}: withholds PRN ${mp[1]}, but the chart says it could be given at ${at.t}`); }
        else if (mr) { const o = C.reg.find(r => r.L === mr[1]); if (!o) fail(`${WR}: no regular ${mr[1]}`); else if (!o.ceaseAt || o.ceaseAt.m > at.m) notes.push(`${WR}: "none" on active row ${mr[1]}`); }
        else fail(`${WR}: "none" c must be prn.X or reg.L.dD`);
      }
      if ((x.do === 'once' && !C.once[x.i]) || ((x.do === 'fluid' || x.do === 'fluidend') && !C.fluids[x.i])) fail(`${WR}: ${x.do} ${x.i} does not exist`);
      if (x.do === 'once' && C.once[x.i] && (C.once[x.i].hidden || C.once[x.i].givenAt)) fail(`${WR}: once ${x.i} is hidden or already given`);
      if (x.do === 'fluid' && C.fluids[x.i] && C.fluids[x.i].started) fail(`${WR}: fluid ${x.i} is already running`);
      if (x.do === 'fluidend' && C.fluids[x.i] && (!C.fluids[x.i].started || C.fluids[x.i].done)) fail(`${WR}: fluid ${x.i} is not running`);
    }
    const M = E.modelEntries(C, Rd);
    for (const k of Object.keys(M)) if (!IDX.has(k)) fail(`${WR}: the model answer writes ${k}, not a box on the chart`);
    for (const k of Object.keys(M)) if (C.V[k] != null) fail(`${WR}: the model answer writes over ${k}, which is already written`);
    const good = E.checkRound(C, Rd, M);
    for (const r of good) if (!r.ok) fail(`${WR}: the model answer fails its own check — ${r.msg}`);
    const empty = E.checkRound(C, Rd, {});
    Rd.expect.forEach((x, i) => { if (x.do !== 'none' && empty[i].ok) fail(`${WR}: expectation ${i + 1} (${x.do}) passes with nothing written`); });
    /* misplaced: every administration a day late, and no check initials */
    const late = {}, nochk = {};
    for (const [k, v] of Object.entries(M)) { late[k.replace(/^(reg\.[A-Z]{1,2}\.d)(\d)/, (_, a, d) => a + (+d % 8 + 1))] = v; nochk[k] = v && v.giv ? { giv: v.giv, chk: '' } : v; }
    if (Rd.expect.some(x => x.do === 'sign' || x.do === 'code') && E.checkRound(C, Rd, late).every(r => r.ok)) fail(`${WR}: signing the wrong day passes`);
    if (Rd.expect.some(x => ['sign', 'prn', 'once', 'fluid'].includes(x.do)) && E.checkRound(C, Rd, nochk).every(r => r.ok)) fail(`${WR}: leaving out the RN’s check passes`);
    /* handwriting: ink in exactly the needed boxes passes; ink in a box nobody asked for fails */
    const need = new Set(E.roundKey(C, Rd).flatMap(k => k.need || []));
    for (const id of need) if (!IDX.has(id)) fail(`${WR}: the handwriting key needs ${id}, not a box on the chart`);
    if (!E.checkInk(C, Rd, need).every(r => r.ok)) fail(`${WR}: ink in the right boxes does not pass the handwriting check`);
    if (E.checkInk(C, Rd, new Set([...need, 'reg.O.d8.s4.t'])).every(r => r.ok)) fail(`${WR}: stray ink passes the handwriting check`);
    /* and a stroke drawn through the middle of each needed box lands in it */
    for (const id of need) {
      const { cell } = IDX.get(id) || {}; if (!cell) continue;
      const stroke = { pts: [0.25, 0.4, 0.55, 0.7].map(f => [cell.x + cell.w * f, cell.y + cell.h * (0.35 + f / 3), 0.5]) };
      if (INK.strokeCell(stroke, R.layout(IDX.get(id).page).cells) !== id) fail(`${WR}: a stroke across ${id} is not placed in it`);
    }
    S = E.applyRound(S, Rd);
  }
}
for (const [i, n] of allStaff) if (n > 1) notes.push(`initials ${i} are on ${n} charts (fine — different patients)`);
const tot4 = pos.reduce((a, b) => a + b, 0), exp4 = tot4 / 4, sd = Math.sqrt(tot4 * 0.25 * 0.75);
if (tot4 && pos.some(n => Math.abs(n - exp4) > 3.5 * sd)) fail(`answer position is biased: ${pos.join('/')}`);
/* the ink library draws: a stroke comes back as a closed SVG path */
if (!/^M [\d.]+ [\d.]+ Q [\d. ]+ Z$/.test(INK.sketchStrokePath({ pts: [[50, 50, 0.5], [60, 55, 0.5], [70, 58, 0.5]], size: 2 }))) fail('ink: sketchStrokePath does not return a closed path');

if (fails.length) { console.error('BUILD FAILED:\n  ' + [...new Set(fails)].slice(0, 60).join('\n  ') + (fails.length > 60 ? `\n  …and ${fails.length - 60} more` : '')); process.exit(1); }

/* ── emit ── */
const css = (read('template.html').match(/<style>([\s\S]*?)<\/style>/) || [])[1];
if (!css) { console.error('BUILD FAILED: no <style> in template.html to copy'); process.exit(1); }
/* each module becomes a namespace: its exports, and nothing else, reach the page */
function ns(name, file, pre = '') {
  const src = read(file);
  if (/^\s*import\b/m.test(src)) { console.error(`BUILD FAILED: ${file} must not import anything — it is inlined`); process.exit(1); }
  const names = [...src.matchAll(/^export (?:const|function|let) (\w+)/gm)].map(m => m[1]);
  return `const ${name} = (() => {\n${pre}${src.replace(/^export /gm, '')}\nreturn { ${names.join(', ')} };\n})();`;
}
const pfName = (pfSrc.match(/(\w+) as getStroke/) || [])[1];
if (!pfName) { console.error('BUILD FAILED: cannot find getStroke in the vendored perfect-freehand'); process.exit(1); }
const libs = [
  `/* perfect-freehand 1.2.3 (MIT, Steve Ruiz) — vendor/perfect-freehand-1.2.3.mjs, pinned by sha256 */\nconst PF = (() => {\n${pfSrc.replace(/export\s*\{[^}]*\};?/, '').replace(/\/\/# sourceMappingURL=.*$/m, '')}\nreturn ${pfName};\n})();`,
  ns('CE', 'chart-engine.mjs'), ns('CR', 'chart-render.mjs'), ns('INK', 'ink.mjs', 'const getStroke = PF;\n'),
].join('\n');
const DATA = {
  built: new Date().toISOString().slice(0, 10), prefix: META.prefix, hue: (META.tool || {}).hue || '#4f46e5', short: META.short,
  back: META.h1 ? META.h1.replace(/\s*·\s*Paper Sim$/, '') + ' · Paper Sim' : 'Paper Sim', scenarios: SCENARIOS,
};
const tpl = read('chart-template.html');
for (const mk of ['/*@PAPERSIM_CSS@*/', '/*@DATA@*/', '/*@LIBS@*/']) if (tpl.split(mk).length !== 2) { console.error('BUILD FAILED: expected exactly one ' + mk); process.exit(1); }
const out = tpl.replace('/*@PAPERSIM_CSS@*/', () => css).replace('/*@DATA@*/', () => JSON.stringify(DATA).replace(/<\//g, '<\\/')).replace('/*@LIBS@*/', () => libs);
const scripts = [...out.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 1) { console.error('BUILD FAILED: expected one inline script'); process.exit(1); }
try { new Function(scripts[0]); } catch (e) { console.error('BUILD FAILED: the page script does not parse — ' + e.message); process.exit(1); }
fs.writeFileSync(path.join(HERE, 'chart.html'), out);

console.log(`scenarios: ${SCENARIOS.map(s => `${s.id} (${s.rounds.length} rounds)`).join(' · ')}`);
console.log(`chart: ${R.PAGES.length} pages, ${IDX.size} boxes`);
console.log(`audit: ${nQ} questions over every stage, dealt ${DEALS}× each — one right answer, no repeats, every box they point at exists`);
console.log(`rounds: ${nRounds} with ${nExpect} expectations — model passes, empty fails, wrong day fails, missing check fails, stray ink fails`);
console.log(`answer position (4-option): ${pos.join('/')}`);
for (const n of notes) console.log('note: ' + n);
console.log(`chart.html ${(fs.statSync(path.join(HERE, 'chart.html')).size / 1024) | 0} KB · script parses`);
