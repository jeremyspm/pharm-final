/* Chart Speak's drill engine: pure functions, no DOM, no imports. build-terms.mjs inlines this file into
   terms.html (with `export ` stripped) AND imports it to audit every question it can deal — so the code the
   audit passes is byte for byte the code that ships. */

export const LOCK = { t: 2, o: 2, x: 2, d: 1 };   // right answers in a row that lock a term / order / scene / danger
export const GAP_MS = 10 * 60e3;                  // a part-learned item is not asked again until 10 minutes have passed,
                                                   // so "2 in a row" is two separate recalls, not one remembered twice
export const REFRESH_MS = 7 * 864e5;              // a locked item comes back for one check after a week

/* a written form, compared loosely: case, dots and spaces never make two forms different (b.d. = bd = BD) */
export const normW = s => String(s).toLowerCase().replace(/[.\s]+/g, '');
/* a meaning, compared loosely: case and punctuation never make two meanings different */
export const normM = s => String(s).toLowerCase().replace(/[^a-z0-9µ%<>@#?↑↓]+/g, ' ').trim();
export const kindOf = t => t.kd || 'abbr';
const written = t => [t.t, ...(t.a || [])].map(normW);
/* two terms share a written form (PR the route and PR the pulse; OD once daily and OD overdose): neither may
   ever be offered in the other's question, or one question would have two right answers */
export const clash = (a, b) => { const w = new Set(written(a)); return written(b).some(x => w.has(x)); };

export function promptFor(t, dir, PROMPTS) {
  const p = PROMPTS[t.c + '.' + t.s] || PROMPTS[kindOf(t)];
  return p[dir === 'f' ? 0 : 1];
}
/* forward (written form → meaning) deals 4 meanings, stacked; reverse (meaning → written form) deals up to 6 short
   forms — but no more than the term's own sub-group can fill (never under 4), so a small family like 3/24 · 3/7 ·
   3/52 · 3/12 is not padded with forms anyone can rule out at a glance */
export function optCount(dir, term, TERMS) {
  if (dir === 'f') return 4;
  const sib = TERMS.filter(x => x.c === term.c && x.s === term.s && kindOf(x) === kindOf(term)).length;
  return Math.max(4, Math.min(6, sib));
}

/* the shape of a written form: a wrong option should look like the answer, or the shape gives it away
   (one lower-case word among five capitals is picked without reading) */
const shapeW = s => { const x = String(s);
  return { c: /[A-Z]/.test(x) && !/[a-z]/.test(x) ? 'U' : /[a-z]/.test(x) && !/[A-Z]/.test(x) ? 'L' : /[A-Za-z]/.test(x) ? 'M' : '-',
    d: /\d/.test(x), p: /[\/:%<>@#?↑↓]/.test(x), n: x.length }; };
const distW = (a, b) => (a.c !== b.c ? 1.5 : 0) + (a.d !== b.d ? 1 : 0) + (a.p !== b.p ? 0.7 : 0) + Math.min(1.5, Math.abs(a.n - b.n) / Math.max(3, a.n));
const distM = (a, b) => Math.min(2, Math.abs(a.length - b.length) / Math.max(14, a.length));

/* The options for one question. The wrong options are the whole design (estate memory
   "drill-dropdowns-not-typing"): drawn first from the term's own classic confusions (cf), then its sub-group,
   then its category, then anywhere — and within a tier, the closest in shape first. Never offered: a term
   with the same meaning (g), a term sharing its written form (clash), a text equal to the answer, and in a
   reverse question a written form of a different kind (an abbreviation among words). */
export function options(term, dir, TERMS, rnd) {
  const text = x => dir === 'f' ? x.m : x.t;
  const ans = text(term), want = optCount(dir, term, TERMS);
  const seen = new Set([dir === 'f' ? normM(ans) : normW(ans)]);
  const key = x => dir === 'f' ? normM(text(x)) : normW(text(x));
  const ok = x => x.id !== term.id && !(term.g && x.g === term.g) && !clash(term, x)
    && (dir === 'f' || kindOf(x) === kindOf(term)) && !seen.has(key(x));
  const out = [];
  const take = list => { for (const x of list) { if (out.length >= want - 1) return; if (ok(x)) { out.push(x); seen.add(key(x)); } } };
  const byId = new Map(TERMS.map(x => [x.id, x]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sA = dir === 'f' ? null : shapeW(ans);
  const near = list => list.map(x => ({ x, k: (dir === 'f' ? distM(ans, text(x)) : distW(sA, shapeW(text(x)))) + rnd() * 0.9 }))
    .sort((p, q) => p.k - q.k).map(p => p.x);
  take(shuffle((term.cf || []).map(id => byId.get(id)).filter(Boolean)));
  take(near(TERMS.filter(x => x.c === term.c && x.s === term.s)));
  take(near(TERMS.filter(x => x.c === term.c)));
  take(near(TERMS.filter(x => x.c !== term.c)));
  const opts = shuffle(out).map(x => ({ id: x.id, text: text(x) }));
  const at = Math.floor(rnd() * (opts.length + 1));
  opts.splice(at, 0, { id: term.id, text: ans });
  return { opts, ans: at };
}

/* the first time a term is seen it is always read (written form → meaning): that is the skill a chart asks for.
   After that, either way round. t.rev === 0 keeps a term one-way. */
export function pickDir(t, st, rnd) {
  if (t.rev === 0 || !st || !st.n) return 'f';
  return rnd() < 0.5 ? 'f' : 'r';
}

/* one answer. s = right in a row, n = times seen, w = times wrong, t = when last seen, L = locked */
export function record(ST, id, right, now, lockAt) {
  const s = ST[id] || (ST[id] = { s: 0, n: 0, w: 0, t: 0 });
  s.n++; s.t = now;
  if (right) { s.s++; if (s.s >= lockAt) s.L = 1; }
  else { s.s = 0; s.w++; delete s.L; }
  return s;
}
export const isMiss = st => !!st && !st.L && st.n > 0 && st.s === 0 && st.w > 0;

export const isPart = st => !!st && !st.L && st.n > 0 && !isMiss(st);

/* What a run deals, in this order: the ones you got wrong last time (most-missed first); the ones you are
   part-way through that were last seen 10+ minutes ago (oldest first); new ones (in the order they are written —
   the commonest first); part-way ones seen in the last 10 minutes (only if the run still has room); locked ones a
   week or more old (a refresher); then any other locked ones. Misses lead; everything after them is shuffled
   within the run so a run is never a list you can learn the order of. */
export function deal(pool, ST, size, now, rnd) {
  const st = x => ST[x.id];
  const by = (f, g) => pool.filter(f).sort(g);
  const old = (a, b) => st(a).t - st(b).t;
  const miss = by(x => isMiss(st(x)), (a, b) => st(b).w - st(a).w || old(a, b));
  const due = by(x => isPart(st(x)) && now - st(x).t >= GAP_MS, old);
  const fresh = pool.filter(x => !st(x) || !st(x).n);
  const recent = by(x => isPart(st(x)) && now - st(x).t < GAP_MS, old);
  const stale = by(x => st(x) && st(x).L && now - st(x).t >= REFRESH_MS, old);
  const done = by(x => st(x) && st(x).L && now - st(x).t < REFRESH_MS, old);
  const all = [...miss, ...due, ...fresh, ...recent, ...stale, ...done].slice(0, size);
  const lead = all.slice(0, miss.length), rest = all.slice(miss.length);
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  return [...lead, ...rest];
}

/* n in the pool · L locked · part on their way (right last time, not locked yet) · miss wrong last time · seen */
export function progress(pool, ST) {
  let L = 0, seen = 0, miss = 0, part = 0;
  for (const x of pool) { const s = ST[x.id]; if (!s) continue; if (s.n) seen++; if (s.L) L++; if (isMiss(s)) miss++; if (isPart(s)) part++; }
  return { n: pool.length, L, seen, miss, part };
}
