/* rep.build.mjs — builds rep.html, the guided-recall page for the written section (ported 27 Oct 2026 from hs2-final's
   "Learn the cases": read it, key words hidden one a line, then all, then key words typed from memory, drilled over days).
   A shared Paper Sim pipeline file (shared-check.mjs); build.mjs and resplice.mjs run it after the page is written.
   A sim without content/rep.js has no guided page, and this says so.

   What goes in, from content/rep.js (export const REP = {...}):
     pieces   the sim's own pieces, each written from a lecturer's slide in her words:
              {id, group, title, ask, src, facts:['a line with its **key words** bold', …], hook?, note?, who?:'hers'|'tool'}
     recall   the lecturer's own closed questions turned into recall — the stem asked without its options, her key as the
              answer: {items:[[question id, key words?, group?], …], group?:{quizId: groupId}}. Key words are substrings of
              her key to bold (default: all of it). Several go on one card, per lecture.
     written  (default true) every written question with a short version (content/shorts.js): hers first, the tool's last.
     groups   [{id, title, hue}] — default META.sys with META.hue.
     order    which kinds come first in the queue — default ['pieces', 'hers', 'recall', 'tool'].
   Every gate is a hard failure: a key word not in its line, a recall id that is not a lecturer's closed question, a piece
   with no source, a group that does not exist. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadShorts } from './shorts.mjs';
import { META } from './sim.config.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(HERE, 'content', 'rep.js');
const die = m => { console.error('REP BUILD FAILED: ' + m); process.exit(1); };

if (!fs.existsSync(FILE)) console.log('rep.html: none (no content/rep.js)');
else {
  const { REP } = await import(pathToFileURL(FILE).href + '?' + Date.now());
  const html = fs.readFileSync(path.join(HERE, 'index.html'), 'utf8');
  const m = html.match(/const DATA = (\{[\s\S]*?\});\r?\n/);
  if (!m) die('no bank in index.html');
  const bank = JSON.parse(m[1]);
  const { shorts, fails } = loadShorts(bank.questions);
  if (fails.length) die(fails.join('\n'));
  const groups = REP.groups || Object.entries(META.sys).map(([id, title]) => ({ id, title, hue: (META.hue || {})[id] ?? 220 }));
  const gIds = new Set(groups.map(g => g.id));
  const bolds = t => [...String(t).matchAll(/\*\*(.+?)\*\*/g)].map(x => x[1]);
  const kinds = { pieces: [], hers: [], recall: [], tool: [] };

  /* 1 · the sim's own pieces, from the lecturer's slides */
  for (const p of REP.pieces || []) {
    const at = 'piece ' + p.id;
    if (!p.id || !p.title || !p.ask || !p.src) die(at + ': needs id, title, ask and src');
    if (!gIds.has(p.group)) die(at + ': no group ' + p.group);
    if (!Array.isArray(p.facts) || !p.facts.length) die(at + ': no facts');
    for (const t of p.facts) if (!bolds(t).length) die(`${at}: line "${t}" has no **key word**`);
    kinds.pieces.push({ id: 'rv-' + p.id, group: p.group, who: p.who || 'hers', title: p.title, qt: p.ask, source: p.src, note: p.note || null,
      short: { title: p.title, hook: p.hook || '', groups: [{ q: p.part || p.title, facts: p.facts.map((t, i) => ({ t, of: [i] })) }] } });
  }

  /* 2 · written questions with their short versions: the lecturer's, then the tool's */
  if (REP.written !== false) for (const q of bank.questions) {
    if (!q.saq) continue;
    const s = shorts[q.id];
    if (!s) continue;
    const g = (REP.writtenGroup || {})[q.quiz] || q.sys;
    if (!gIds.has(g)) die('written question ' + q.id + ': no group ' + g);
    (q.authored ? kinds.tool : kinds.hers).push({ id: q.id, group: g, who: q.authored ? 'tool' : 'hers', title: s.title, qt: q.qt || q.q,
      scenario: q.scenario || null, source: q.saq.src, steps: q.saq.steps, note: null, short: s });
  }

  /* 3 · the lecturer's closed questions as recall, one card per lecture and group */
  const R = REP.recall;
  if (R) {
    const cards = new Map();
    for (const [id, kw, gOver] of R.items) {
      const q = bank.questions.find(x => x.id === id);
      if (!q) die('recall: no question ' + id);
      if (q.authored || q.saq || !q.key || q.key.length !== 1) die('recall: ' + id + ' is not one of the lecturer\'s single-key closed questions');
      const ans = q.ol ? q.ol[q.key[0]] : q.key[0];
      let t = ans;
      for (const k of [].concat(kw || ans)) {
        if (!t.includes(k)) die(`recall ${id}: key word "${k}" is not in her key "${ans}"`);
        t = t.replace(k, '**' + k + '**');
      }
      const quiz = bank.quizzes.find(z => z.id === q.quiz);
      const g = gOver || (R.group || {})[q.quiz] || q.sys;
      if (!gIds.has(g)) die('recall ' + id + ': no group ' + g);
      const key = g + '|' + q.quiz;
      if (!cards.has(key)) cards.set(key, { quiz, g, facts: [] });
      cards.get(key).facts.push({ t, of: [0], ask: q.qt || q.q });
    }
    const who = (META.who || 'the lecturer').replace(/^the /, 'The '), whose = who + (/s$/.test(who) ? '’' : '’s');
    for (const [key, c] of cards) {
      const name = c.quiz ? c.quiz.name : 'the quiz';
      kinds.recall.push({ id: 'rc-' + key.replace(/\W+/g, '-'), group: c.g, who: 'hers', recall: true,
        title: `Quiz recall · ${name}`, qt: `${whose} own quiz questions (${name}), answered without their options. Type each answer.`,
        source: `Questions and answers from the Canvas quiz “${name}”: each answer is the lecturer’s key, asked here without the options.`, note: null,
        short: { title: `Quiz recall · ${name}`, hook: '', groups: [{ q: name, facts: c.facts }] } });
    }
  }

  const order = REP.order || ['pieces', 'hers', 'recall', 'tool'];
  const questions = order.flatMap(k => kinds[k] || []);
  if (new Set(questions.map(q => q.id)).size !== questions.length) die('two pieces share an id');
  for (const g of groups) if (!questions.some(q => q.group === g.id)) die('group ' + g.id + ' has nothing in it');
  const facts = questions.reduce((n, q) => n + q.short.groups.flatMap(g => g.facts).length, 0);

  const date = META.sitting.date, d = new Date(date + 'T12:00:00'); d.setDate(d.getDate() - 1);
  const last = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const meta = { prefix: META.prefix, hue: META.tool.hue, icon: META.tool.icon, kick: META.tool.kick, name: REP.name || 'Learn the short answers',
    sub: REP.sub || '', exam: date, last, examDay: REP.examDay || date, who: META.who || 'the lecturer', groupWord: REP.groupWord || 'topics',
    how: REP.how || '', home: './' };
  const counts = Object.fromEntries(Object.entries(kinds).map(([k, v]) => [k, v.length]));
  const d2 = { version: 1, meta, groups, questions, counts, facts };
  const json = JSON.stringify(d2).replace(/<\//g, '<\\/');
  const V = crypto.createHash('sha1').update(['rep.js', 'rep.css', 'rep-engine.mjs'].map(f => fs.readFileSync(path.join(HERE, f), 'utf8')).join('')).digest('hex').slice(0, 8);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fill = { TITLE: `${META.short || META.title} · ${meta.name}`, PREFIX: META.prefix, HUB: `https://jeremyspm.github.io/#${META.hub}/learn`,
    SHORT: META.tool.name, H1: meta.name, FOOT: REP.foot || 'Student-made revision. Not MIT material. Progress stays in this browser.', V };
  let out = fs.readFileSync(path.join(HERE, 'rep.template.html'), 'utf8');
  for (const [k, v] of Object.entries(fill)) out = out.split('@' + k + '@').join(k === 'FOOT' ? v : esc(v));
  out = out.replace('/*@REP_DATA@*/', () => json);
  fs.writeFileSync(path.join(HERE, 'rep.html'), out);
  console.log(`rep.html: ${questions.length} pieces (${Object.entries(counts).map(([k, v]) => v + ' ' + k).join(' · ')}), ${facts} key-word lines`);
}
