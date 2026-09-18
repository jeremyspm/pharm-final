/* Assemble index.html from the parsed question bank. Shared Paper Sim pipeline, ported
   from hs2-test2/build.mjs: everything sim-specific (paths, quiz map, META) comes from
   sim.config.mjs. Nothing here authors questions — stems, options and keys come from the capture
   verbatim; authored content lives in content/ and is joined by gates that fail
   the build in BOTH directions (an unmatched answer file entry is as fatal as an
   unanswered essay). */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { CHAINS } from './content/chains.js';
import { CASES } from './content/cases.js';
import { AUTHORED_SAQS } from './content/authored-saqs.js';
import { AUTHORED_MCQS } from './content/authored-mcqs.js';
import { PATHS, QUIZ, ROUTE, NO_MOCK, EXCLUDE, NO_IMAGE_OK, META } from './sim.config.mjs';
import { SAQ_ANSWERS, norm } from './content/saq-answers.js';
import { loadVideos, loadVideoMatches, loadRefMatches, loadPartRefs, matchVideo, matchRefs, matchParts } from './content/explain.mjs';
import { structuredStems, plainText } from './stem-html.mjs';
import { OVERRIDES } from './content/overrides.js';
import { AUTHORED_STEMS } from './content/authored-stems.js';
import { FOCUS } from './content/focus.js';
import { HELPLINE } from './content/helpline.js';
import { QTOPIC } from './content/qtopic.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
/* a paper with no Canvas quizzes at all (PATHS.bank / PATHS.cap null) has no captured bank:
   every question then comes from content/authored-*.js and says so on the page */
const BANK = PATHS.bank ? path.resolve(HERE, PATHS.bank) : null;
const CAP = PATHS.cap ? path.resolve(HERE, PATHS.cap) : null;

const bank = BANK ? JSON.parse(fs.readFileSync(path.join(BANK, 'questions.json'), 'utf8')) : { quizzes: [] };
const imgBind = CAP ? JSON.parse(fs.readFileSync(path.join(HERE, 'images.json'), 'utf8')) : {};
/* a full-page-save capture inlines every figure as a data: URI, so it has no manifests */
const readJSON = (p, d) => fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : d;
const manifest = CAP ? readJSON(path.join(CAP, 'images/manifest.json'), {}) : {};
const extManifest = CAP ? readJSON(path.join(CAP, 'images/ext-manifest.json'), {}) : {};
/* the same captures, read a second way: structure kept, blanks and images in place.
   `q` (flat, hers verbatim) stays the id + search text; `qh` is what the student sees. */
const STEMS = CAP ? structuredStems(CAP, manifest, extManifest) : {};

/* QUIZ (quiz id -> [group, name]), EXCLUDE, NO_IMAGE_OK, ROUTE and NO_MOCK are declared in
   sim.config.mjs — same shapes and the same both-ways gates as hs2-test2. */
const noImgOkUsed = new Set();
const noMockUsed = new Set();
const routeSys = (txt) => (ROUTE.find(([, re]) => re.test(txt)) || ['mixed'])[0];
if (Object.values(QUIZ).some(([g]) => !META.sys[g])) { console.error('BUILD FAILED: a QUIZ row names a group META.sys does not have'); process.exit(1); }

/* id hashes the CONTENT (stem + key), not the position — Canvas renumbers, and a
   review quiz can carry the same stem twice; identical content dedupes silently. */
const qid = (quiz, stem, content) =>
  'q' + crypto.createHash('sha1').update(quiz + '|' + stem + '|' + JSON.stringify(content ?? '')).digest('hex').slice(0, 10);

const stripImgRefs = (s) => s
  .replace(/\[\[IMG[^\]]*\]\]/g, ' ')
  /* Canvas page furniture that leaks into stems — never part of the question */
  .replace(/https?:\/\/\S+/g, ' ')
  .replace(/\(?\s*Links to an external site\.?\s*\)?/gi, ' ')
  .replace(/This video may display YouTube ads\.?/gi, ' ')
  .replace(/Continue to YouTube content\.?/gi, ' ')
  .replace(/Minimize embedded content\.?/gi, ' ')
  .replace(/\s+/g, ' ').trim();

const questions = [], held = [], quizzes = [];
const saqUsed = new Set();
const structFails = []; let nInline = 0;
const orderInferred = [];   // typed blanks placed by document order (capture lost the blank ids) — READ THESE
const overridesUsed = new Set();
const authoredUsed = new Set();

for (const z of bank.quizzes) {
  const fid = (z.file.match(/CAP-(\d+)/) || [])[1];
  if (!QUIZ[fid]) { console.error('BUILD FAILED: capture ' + z.file + ' has no QUIZ row in sim.config.mjs'); process.exit(1); }
  const [qsys, qname] = QUIZ[fid];
  let kept = 0;
  z.questions.forEach((q, idx) => {
    if (q.type === 'text_only_question' || q.type === 'unknown') return;
    const stemRaw = q.q || '';
    let stem = stripImgRefs(stemRaw);
    /* Some of her matching questions have NO stem in Canvas itself — the content
       is entirely in the pairs. A synthesised stem keeps them dealable; it is
       labelled generic on purpose, never invented content. */
    if (!stem && q.key && q.key.kind === 'pairs' && q.key.pairs.length >= 2)
      stem = 'Match each item with its correct partner.';
    if (!stem) { held.push({ quiz: qname, why: 'empty stem' }); return; }
    const ex = EXCLUDE.find(e => e.quiz === fid && norm(stem).startsWith(e.k));
    if (ex) { held.push({ quiz: qname, why: ex.why, q: stem.slice(0, 80) }); return; }
    const imgs = ((imgBind[path.basename(z.file)] || {})[idx] || []);
    const okNoImg = NO_IMAGE_OK.find(e => e.quiz === fid && norm(stem).startsWith(e.k));
    if (okNoImg) noImgOkUsed.add(okNoImg);
    const needsImg = !okNoImg && (/\[\[IMG/.test(stemRaw) || /\b(image|diagram|picture|micrograph|labell?ed|figure) (above|below|shown)\b/i.test(stem));
    if (needsImg && !imgs.length) { held.push({ quiz: qname, why: 'image did not survive capture', q: stem.slice(0, 80) }); return; }
    const sys = qsys === 'mixed' ? routeSys(stem + ' ' + (q.answers || []).map(a => a.text).join(' ')) : qsys;
    const base = { id: qid(fid, stem, q.key), quiz: fid, sys, pts: +q.points || 1, q: stem, imgs };
    /* kept in the bank, never dealt into a mock paper (sim.config.mjs NO_MOCK) */
    const nm = NO_MOCK.find(e => e.quiz === fid && (norm(stem) + ' ').startsWith(e.k));
    if (nm) { noMockUsed.add(nm); base.nm = 1; }
    /* structured stem: only images this question actually ships may be placed inline;
       blank markers are validated per type below, so a stem can never show a blank
       the key does not have, or hide one it does. */
    const authoredSt = AUTHORED_STEMS.find(a => a.quiz === fid && norm(stem).startsWith(a.k));
    if (authoredSt) authoredUsed.add(authoredSt);
    const st = authoredSt ? authoredSt.st : (STEMS[path.basename(z.file)] || {})[idx];
    if (st && st.html) {
      base.qh = st.html.replace(/\[\[IMG:([^\]]+)\]\]/g, (m, f) => imgs.includes(f) ? m : '');
      if (!/<(?:p|ul|ol|div)\b/.test(base.qh)) base.qh = '<p>' + base.qh + '</p>';
    } else base.qh = '<p>' + stem.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) + '</p>'; // synthesised stem
    /* one-line text of the SAME stem for titles and the Ask-AI prompt — the flat
       capture split words at inline tags ("a nta gonist") and carries "[ Select ]" */
    base.qt = plainText(base.qh);
    const blankMarkers = (h) => [...(h || '').matchAll(/\[\[BLANK:(\d+|\?)\]\]/g)].map(m => m[1]);
    const placeBlanks = (n) => {
      const ks = blankMarkers(base.qh);
      const ok = base.qh && ks.length === n && !ks.includes('?') && new Set(ks).size === n && ks.every(k => +k < n);
      if (!ok) { structFails.push(`${qname} #${idx + 1}: ${n} blanks in key, markers [${ks.join(',')}] in stem — "${stem.slice(0, 60)}"`); base.qh = (base.qh || '').replace(/\[\[BLANK:[^\]]*\]\]/g, '____'); return null; }
      nInline++;
      if (st.orderInferred) orderInferred.push(`${qname} #${idx + 1}: "${plainText(base.qh).slice(0, 110)}" ← ${q.key.blanks.map(b => b.correct).join(' | ')}`);
      return st.ctx;
    };
    if (base.qh && q.type !== 'multiple_dropdowns_question' && q.type !== 'fill_in_multiple_blanks_question' && blankMarkers(base.qh).length) {
      structFails.push(`${qname} #${idx + 1}: blank markers in a ${q.type}`); base.qh = base.qh.replace(/\[\[BLANK:[^\]]*\]\]/g, '____');
    }

    if (q.type === 'essay_question') {
      const hit = SAQ_ANSWERS.find(a => norm(stem).startsWith(a.k) || norm(stem).includes(a.k));
      if (!hit) { held.push({ quiz: qname, why: 'essay with no authored model answer', q: stem.slice(0, 80) }); return; }
      saqUsed.add(hit.k);
      questions.push({ ...base, type: 'essay', pts: Math.max(base.pts, hit.steps.length ? Math.min(6, hit.steps.length) : base.pts), saq: { steps: hit.steps, src: 'Model answer is the tool’s · from ' + hit.src } });
      kept++; return;
    }
    if (!q.key) { held.push({ quiz: qname, why: 'no extracted key', q: stem.slice(0, 80) }); return; }
    if (q.key.kind === 'pairs') {
      if (q.key.pairs.length < 2) { held.push({ quiz: qname, why: 'matching with <2 recovered pairs', q: stem.slice(0, 80) }); return; }
      questions.push({ ...base, type: 'match', pairs: q.key.pairs, pts: Math.max(base.pts, q.key.pairs.length) });
      kept++; return;
    }
    if (q.key.kind === 'blanks') {
      if (q.key.blanks.some(b => !b.options.length || !b.correct)) { held.push({ quiz: qname, why: 'blank with no options/correct', q: stem.slice(0, 80) }); return; }
      /* bk: how the blank is answered — 'dd' = her dropdown (options are choices, ONE
         is right), 'fib' = typed (options are the accepted spellings, ALL are right).
         The two must grade differently; the old single path marked any dropdown
         choice correct. */
      const bk = q.type === 'multiple_dropdowns_question' ? 'dd' : 'fib';
      const ctx = placeBlanks(q.key.blanks.length);
      const blanks = q.key.blanks.map((b, k) => ({ ...b, ctx: ctx ? (ctx[k] || '') : '' }));
      /* extra accepted answers, declared in content/overrides.js and matched here by
         id + blank + her correct answer — a stale override fails the build below */
      for (const o of OVERRIDES.filter(o => o.id === base.id)) {
        const b = blanks[o.blank];
        if (!b || b.correct !== o.correct) continue;
        b.also = [...new Set([...(b.also || []), ...o.also])];
        overridesUsed.add(o);
      }
      questions.push({ ...base, type: 'cloze', bk, blanks, pts: Math.max(base.pts, q.key.blanks.length) });
      kept++; return;
    }
    /* options family. Some of her MCQs store options as bare letters (a/b/c/d)
       with the real text only in each answer's title attribute — enrich from the
       title, keys re-derived through the SAME rule so they can never diverge. */
    const cleanTitle = t => (t || '').replace(/\.?\s*This was the correct answer\.?$/i, '').trim();
    const enrich = a => { const t = (a.text || '').trim(), ti = cleanTitle(a.titleAttr);
      return (t.length < 3 && ti.length >= 3) ? ti : t; };
    const ans = (q.answers || []).filter(a => (a.text || '').trim() || cleanTitle(a.titleAttr));
    let opts = [...new Set(ans.map(enrich).filter(Boolean))];
    /* "All/None of the above" only means what it says when it IS below the others —
       the capture holds them in Canvas's per-attempt shuffle order. Display order only. */
    const above = o => /^(?:all|none|both) of (?:the above|these)/i.test(o);
    opts = [...opts.filter(o => !above(o)), ...opts.filter(above)];
    const key = [...new Set(ans.filter(a => a.correctClass || a.weight === '100').map(enrich))];
    const lettered = opts.every(o => o.length < 3) && /\b[a-d]\.\s/.test(stem);
    if (!opts.length || opts.length < 2 || !key.length || !key.every(k => opts.includes(k))) {
      held.push({ quiz: qname, why: 'key text not among options', q: stem.slice(0, 80) }); return;
    }
    if (opts.some(o => o.length < 3) && !lettered && !imgs.length) {
      held.push({ quiz: qname, why: 'letter-only options with no lettered stem or image', q: stem.slice(0, 80) }); return;
    }
    const type = q.type === 'true_false_question' ? 'tf'
      : q.type === 'multiple_answers_question' ? 'multi' : 'mcq';
    /* bare-letter options (a/b/c/d) get their text from the stem's own lettered list,
       so the card reads "b. Fibula" instead of "b" — display only; the key stays hers.
       Only when every option letter is found exactly once in the stem. */
    let ol = null;
    if (lettered) {
      const found = {};
      for (const m of stem.matchAll(/(?:^|\s)([a-d])\.\s*(.+?)(?=\s+[a-d]\.\s*\S|$)/g)) { if (found[m[1]]) { found.__dup = true; } found[m[1]] = m[2].trim(); }
      if (!found.__dup && opts.every(o => found[o.toLowerCase()])) ol = Object.fromEntries(opts.map(o => [o, found[o.toLowerCase()]]));
    }
    questions.push({ ...base, type, opts, key, ...(ol ? { ol } : {}) });
    kept++;
  });
  if (kept) quizzes.push({ id: fid, name: qname, sys: qsys, n: kept });
}

/* the tool's own questions (content/authored-mcqs.js, content/authored-saqs.js): a course
   whose quizzes carry no written questions still sits a written section, and a course with
   no quizzes at all still sits a paper. Every one is labelled as the tool's on the page and
   names its source. Each entry may name the quiz row it belongs under ({quiz, quizName});
   without one it lands in a single "written practice" row. */
{
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rows = new Map();   // quiz id -> {id,name,sys,n}
  const row = (a) => {
    const id = a.quiz || 'authored';
    if (!rows.has(id)) rows.set(id, { id, name: a.quizName || 'Written practice — the tool’s questions', sys: a.quiz ? a.sys : 'authored', n: 0, authored: 1 });
    rows.get(id).n++; return id;
  };
  const seen = new Set();
  const die = (why, a) => { console.error('BUILD FAILED: authored question ' + why + ': ' + JSON.stringify(a).slice(0, 140)); process.exit(1); };
  for (const a of AUTHORED_MCQS) {
    if (!a.q || !a.src || !META.sys[a.sys]) die('needs q, src and a META.sys group', a);
    if (!Array.isArray(a.options) || a.options.length < 2 || new Set(a.options).size !== a.options.length) die('needs 2+ distinct options', a);
    if (!Number.isInteger(a.correct) || !a.options[a.correct]) die('has no valid key', a);
    if (seen.has('m|' + a.q)) die('repeats a stem', a); seen.add('m|' + a.q);
    questions.push({ id: qid(a.quiz || 'authored', a.q, a.options[a.correct]), quiz: row(a), sys: a.sys, pts: 1, q: a.q,
      qh: '<p>' + esc(a.q) + '</p>', qt: a.q, imgs: [], type: 'mcq', authored: 1, opts: a.options, key: [a.options[a.correct]],
      src: a.src, ...(a.why ? { why: a.why } : {}) });
  }
  for (const a of AUTHORED_SAQS) {
    if (!a.q || !a.src || !META.sys[a.sys]) die('needs q, src and a META.sys group', a);
    if (!Array.isArray(a.steps) || a.steps.length < 2) die('needs 2+ model steps', a);
    if (seen.has('s|' + a.q)) die('repeats a stem', a); seen.add('s|' + a.q);
    questions.push({ id: qid(a.quiz || 'authored', a.q, a.steps), quiz: row(a), sys: a.sys, pts: a.pts || a.steps.length, q: a.q,
      qh: '<p>' + esc(a.q) + '</p>', qt: a.q, imgs: [], type: 'essay', authored: 1, ...(a.fmt ? { fmt: a.fmt } : {}),
      saq: { steps: a.steps, src: 'Question and model answer are the tool’s · from ' + a.src } });
  }
  quizzes.push(...rows.values());
}

/* ── the explain layer: video + judged text references per question ──
   each file is optional: a sim with no video shelf or no judged references ships none,
   and the page says so rather than showing an empty row */
const CONTENT = path.join(HERE, 'content');
const has = f => fs.existsSync(path.join(CONTENT, f));
const videos = has('dmdm-all.json') ? loadVideos(CONTENT) : [];
const vmatches = has('video-matches.json') ? loadVideoMatches(CONTENT, videos) : {};
const rmatches = has('ref-matches.json') ? loadRefMatches(CONTENT) : {};
const pmatches = loadPartRefs(path.join(HERE, 'content'));
let nPartQ = 0, nPartRefs = 0; const pmUsed = new Set();
const SLIDESRC = CAP ? path.join(CAP, 'slides') : null;   // rendered deck slides live beside the captures
let nVid = 0, nRef = 0, nSlide = 0, nSlideText = 0, nHer = 0, nCourse = 0, nPat = 0, nPatOnly = 0;
const usedSlides = new Set(), vmUsed = new Set(), rmUsed = new Set();
for (const q of questions) {
  const v = matchVideo(q, videos, vmatches); if (v) { q.vid = v; nVid++; vmUsed.add(q.id); }
  const refs = [];
  for (const r of matchRefs(q, rmatches)) {
    rmUsed.add(q.id);
    if (r.k === 'slide') {
      /* A question that carries its OWN image is its own authority — a retrieved
         slide with a different letter/label scheme beside it contradicts the
         figure the student just answered on (the label-the-glands bug). Such
         questions keep text references only, never a second figure. */
      if (q.imgs.length) continue;
      const png = SLIDESRC ? path.join(SLIDESRC, r.slug, `slide-${r.n}.png`) : null;
      if (png && fs.existsSync(png)) {
        const name = `${r.slug}-${r.n}.jpg`;
        usedSlides.add(JSON.stringify([png, name]));
        refs.push({ k: 'slide', src: r.src, slide: name }); nSlide++;
      } else if (r.t) { refs.push({ k: 'slide', src: r.src, t: r.t }); nSlideText++; }   /* deck not rendered: quote the slide's own words — never point at a picture we can't show */
    } else {
      refs.push(r);
      if (r.k === 'her') nHer++; else if (r.k === 'course') nCourse++; else nPat++;
    }
  }
  if (refs.length) { q.refs = refs; nRef++; if (refs.every(r => r.k === 'patton')) nPatOnly++; }
  const prefs = matchParts(q, pmatches);
  if (prefs.length) { q.prefs = prefs; nPartQ++; nPartRefs += prefs.length; pmUsed.add(q.id); }
}
console.log(`references per part: ${nPartRefs} parts referenced over ${nPartQ} multi-part questions`);
console.log(`explain layer: ${nVid}/${questions.length} questions matched a video (${Math.round(100 * nVid / Math.max(1, questions.length))}%); ` +
  `${nRef} carry a judged reference (${nSlide} her slide images + ${nSlideText} slides quoted as text, ${nHer} her prose, ${nCourse} course files, ${nPat} Patton excerpts; ${nPatOnly} Patton-only) — from ${videos.length} videos`);
/* compress + ship only the referenced slides */
const SLIDEOUT = path.join(HERE, 'img', 'slides');
fs.mkdirSync(SLIDEOUT, { recursive: true });
fs.writeFileSync(path.join(HERE, 'slides-todo.json'),
  JSON.stringify([...usedSlides].map(s => JSON.parse(s)), null, 1));

/* her worked helpline answer, under the question: q.hl = the focus topic whose section
   teaches this question (content/qtopic.js, read by hand). Both directions gated: an id
   that matches no live question is stale, a topic with no section would render nothing. */
let nHl = 0; const hlUsed = new Set();
for (const q of questions) if (QTOPIC[q.id]) { q.hl = QTOPIC[q.id]; nHl++; hlUsed.add(q.id); }
/* ── gates ─────────────────────────────────────────────────────────── */
const fails = [];
for (const [qid, t] of Object.entries(QTOPIC)) {
  if (!hlUsed.has(qid)) fails.push('qtopic entry matched NO question: ' + qid);
  if (!HELPLINE[t]) fails.push(`qtopic topic has no helpline section: ${t} (${qid})`);
}
for (const a of SAQ_ANSWERS) if (!saqUsed.has(a.k)) fails.push('saq-answers entry matched NO essay: "' + a.k + '"');
/* a verified video match whose question id no longer exists is stale evidence,
   not a harmless extra — same rule as an override that matched nothing */
for (const qid of Object.keys(vmatches)) if (!vmUsed.has(qid)) fails.push('video-matches entry matched NO question: ' + qid);
for (const qid of Object.keys(rmatches)) if (!rmUsed.has(qid)) fails.push('ref-matches entry matched NO question: ' + qid);
for (const qid of Object.keys(pmatches)) if (!pmUsed.has(qid)) fails.push('part-refs entry matched NO question: ' + qid);
/* identical content captured twice (review quizzes repeat questions) — keep one */
const dup = new Set(); let dropped = 0;
for (let i = questions.length - 1; i >= 0; i--) {
  if (dup.has(questions[i].id)) { questions.splice(i, 1); dropped++; }
  else dup.add(questions[i].id);
}
if (dropped) console.log('deduped', dropped, 'identical duplicate captures');
for (const q of questions) for (const f of q.imgs) if (!CAP || !fs.existsSync(path.join(CAP, 'images', f))) fails.push('missing image file ' + f);
for (const c of CHAINS) if (c.beads.filter(b => b.t).length < 4) fails.push('chain too short: ' + c.id);
/* every blank-type question must carry every one of its blanks inline, once, in the
   stem the student sees — a blank the key has but the stem lacks is the exact bug this
   layer exists to kill, so it fails the build rather than falling back quietly */
for (const s of structFails) fails.push('stem structure: ' + s);
for (const o of OVERRIDES) if (!overridesUsed.has(o)) fails.push(`override matched nothing: ${o.id} blank ${o.blank} "${o.correct}"`);
for (const a of AUTHORED_STEMS) if (!authoredUsed.has(a)) fails.push(`authored-stem matched NO question: ${a.quiz} "${a.k}"`);
for (const e of NO_IMAGE_OK) if (!noImgOkUsed.has(e)) fails.push(`no-image-ok matched NO question: ${e.quiz} "${e.k}"`);
for (const e of NO_MOCK) if (!noMockUsed.has(e)) fails.push(`no-mock matched NO question: ${e.quiz} "${e.k}"`);
for (const f of FOCUS) if (!META.sys[f.sys]) fails.push('focus row names a group META.sys does not have: ' + f.id);
for (const q of questions) if (!q.qh) fails.push('no structured stem for ' + q.id + ' "' + q.q.slice(0, 60) + '"');
for (const q of questions) if (q.qh && /\[\[(?!IMG:|BLANK:\d+\]\])/.test(q.qh)) fails.push('stray marker in ' + q.id);
if (fails.length) { console.error('BUILD FAILED:\n  ' + fails.join('\n  ')); process.exit(1); }
console.log(`her worked helpline answer under ${nHl} questions`);
console.log(`structured stems: ${questions.filter(q => q.qh).length}/${questions.length} · blanks placed inline in ${nInline} cloze questions`);
if (orderInferred.length) console.log(`blank order INFERRED from document order in ${orderInferred.length} question(s) — read each sentence with its answers:\n  ` + orderInferred.join('\n  '));

/* ── emit ──────────────────────────────────────────────────────────── */
/* video reach is a stat, not a sentence: the template reads these so the home
   screen can never quote a count the bank has moved past */
const reached = new Set();
for (const q of questions) if (q.vid) { reached.add(q.vid.id); if (q.vid.alt) reached.add(q.vid.alt.id); }
const DATA = {
  built: new Date().toISOString().slice(0, 10),
  stats: { n: questions.length, nAuthored: questions.filter(q => q.authored).length, held: held.length, videos: videos.length, videosReached: reached.size,
    videosFill: videos.filter(v => v.ch).length,
    withVideo: questions.filter(q => q.vid).length,
    withRef: nRef, withHer: questions.filter(q => q.refs && q.refs.some(r => r.k === 'slide' || r.k === 'her')).length, withCourse: nCourse,
    withPatton: nPat, pattonOnly: nPatOnly, partQ: nPartQ, partRefs: nPartRefs, withHl: nHl },
  quizzes: META.quizOrder
    ? quizzes.sort((a, b) => (META.quizOrder.indexOf(a.id) + 1 || 999) - (META.quizOrder.indexOf(b.id) + 1 || 999))
    : quizzes.sort((a, b) => a.sys.localeCompare(b.sys) || a.name.localeCompare(b.name)),
  questions, chains: CHAINS, cases: CASES, focus: FOCUS, helpline: HELPLINE, held,
  meta: META,
};
const tpl = fs.readFileSync(path.join(HERE, 'template.html'), 'utf8');
const marker = '/*@BANK@*/';
if (tpl.split(marker).length !== 2) { console.error('BUILD FAILED: expected exactly one ' + marker); process.exit(1); }
const out = tpl.replace(marker, () => JSON.stringify(DATA));   // function form: a `$'` inside the bank must not be a replacement pattern
fs.writeFileSync(path.join(HERE, 'index.html'), out);

/* Parse-check the page's own inline script before it ships. A single bad escape
   kills the whole app with nothing but a blank page and exit code 0 - this is the
   cheapest possible guard against that. */
{
  const scripts = [...out.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  if (!scripts.length) { console.error('BUILD FAILED: no inline script found to verify'); process.exit(1); }
  scripts.forEach((src, i) => {
    try { new Function(src); }
    catch (e) {
      console.error(`BUILD FAILED: inline script #${i + 1} does not parse - ${e.message}`);
      const line = (e.lineNumber || 0);
      console.error(src.split('\n').slice(Math.max(0, line - 3), line + 2).join('\n'));
      process.exit(1);
    }
  });
  console.log(`script parse check: ${scripts.length} inline script(s) OK`);
}

/* images ship beside the page */
const IMGDIR = path.join(HERE, 'img');
fs.mkdirSync(IMGDIR, { recursive: true });
const used = new Set(questions.flatMap(q => q.imgs));
for (const f of used) fs.copyFileSync(path.join(CAP, 'images', f), path.join(IMGDIR, f));

fs.writeFileSync(path.join(HERE, 'held.json'), JSON.stringify(held, null, 1));
const by = {}; for (const q of questions) by[q.sys] = (by[q.sys] || 0) + 1;
const byT = {}; for (const q of questions) byT[q.type] = (byT[q.type] || 0) + 1;
console.log('bank:', questions.length, 'questions ·', quizzes.length, 'quizzes ·', used.size, 'images ·', held.length, 'held');
console.log('by system:', JSON.stringify(by), '\nby type:', JSON.stringify(byT));
console.log('index.html', (fs.statSync(path.join(HERE, 'index.html')).size / 1024 | 0) + ' KB');
