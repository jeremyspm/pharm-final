/* srs-engine.mjs — the scheduler behind cards.html, a stripped-down Anki (27 Oct 2026: "copy anki basically, I want a
   full stripped down version of anki with all of its shit as a tab"). Pure functions over a plain state object, shared
   by the page and cards.check.mjs. It follows Anki's SM-2 scheduler (v3 defaults), not FSRS:
     new / learning   learning steps (default 1m 10m): Again → first step · Hard → repeat the step (the first step:
                      halfway to the next) · Good → next step, or graduate at the graduating interval (1d) · Easy →
                      graduate at the easy interval (4d). A card starts at the starting ease (250%).
     review           Again → a lapse: ease −20 (floor 130), interval × new-interval (0) floored at 1d, into the
                      relearning steps (10m) · Hard → interval × hard interval (1.2), ease −15 · Good → (interval +
                      days late ÷ 2) × ease · Easy → (interval + days late) × ease × easy bonus (1.3), ease +15. Each
                      is at least a day past the one before it, fuzzed once 3d+, capped at the maximum interval.
     relearning       Again → first step · Hard → repeat · Good → next step or back to review · Easy → review, +1d.
     leech            8 lapses (then every 4 more) suspends the card and tags it "leech".
     days             a day rolls over at 4 am local time; learning cards are due by the clock, reviews by the day.
     limits           new cards a day (20) and reviews a day (200), counted from today's review log.
   State: {v:1, cards:{id:{type,due,ivl,ease,step,reps,lapses,susp,buried,flag,mark,leech}}, log:[...], cfg}. */
export const DEFAULTS = { newPerDay: 20, revPerDay: 200, learnSteps: [1, 10], gradIvl: 1, easyIvl: 4, relearnSteps: [10],
  startEase: 2.5, easyBonus: 1.3, hardIvl: 1.2, ivlMod: 1, lapseMult: 0, minIvl: 1, maxIvl: 36500, leech: 8, newOrder: 'deck',
  rollover: 4, learnAhead: 20 };
const MIN = 6e4, DAY = 864e5;
export const NEW = 0, LEARN = 1, REVIEW = 2, RELEARN = 3;

/* the day number, rolling over at cfg.rollover o'clock local time */
export function dayOf(now, cfg = DEFAULTS) { const d = new Date(now); return Math.floor((now - d.getTimezoneOffset() * MIN - cfg.rollover * 36e5) / DAY); }
export function newState(cfg = {}) { return { v: 1, cards: {}, log: [], cfg: { ...DEFAULTS, ...cfg } }; }
export const cardOf = (s, id) => s.cards[id] || { type: NEW, due: 0, ivl: 0, ease: 0, step: 0, reps: 0, lapses: 0 };

/* fuzz: Anki's spread for intervals of 3 days and up, deterministic per card and day so a preview matches the answer */
function fuzz(ivl, seed) {
  if (ivl < 2.5) return Math.round(ivl);
  const r = ivl < 7 ? Math.max(1, Math.round(ivl * 0.25)) : ivl < 30 ? Math.max(2, Math.round(ivl * 0.15)) : Math.max(4, Math.round(ivl * 0.05));
  let h = 2166136261; for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const u = ((h >>> 0) % 1000) / 999;
  return Math.round(ivl - r + u * 2 * r);
}
const clampIvl = (x, cfg) => Math.max(cfg.minIvl, Math.min(cfg.maxIvl, Math.round(x)));

/* what answering `ease` (1 Again · 2 Hard · 3 Good · 4 Easy) does to a card — no side effects */
export function schedule(c0, ease, now, cfg = DEFAULTS, id = '') {
  const c = { ...c0 }, today = dayOf(now, cfg);
  const stepDue = mins => ({ due: now + Math.round(mins * MIN) });
  const graduate = ivl => { c.type = REVIEW; c.ivl = clampIvl(ivl, cfg); c.due = today + c.ivl; c.step = 0; };
  c.reps = (c.reps || 0) + 1;
  if (c.type === NEW || c.type === LEARN) {
    const steps = cfg.learnSteps, i = c.type === NEW ? 0 : c.step || 0;
    if (c.type === NEW) c.ease = cfg.startEase;
    if (ease === 1) { c.type = LEARN; c.step = 0; Object.assign(c, stepDue(steps[0])); }
    else if (ease === 2) { c.type = LEARN; c.step = i; Object.assign(c, stepDue(i === 0 && steps.length > 1 ? (steps[0] + steps[1]) / 2 : i === 0 ? steps[0] * 1.5 : steps[i])); }
    else if (ease === 3) { if (i + 1 < steps.length) { c.type = LEARN; c.step = i + 1; Object.assign(c, stepDue(steps[i + 1])); } else graduate(cfg.gradIvl); }
    else graduate(cfg.easyIvl);
    return c;
  }
  if (c.type === RELEARN) {
    const steps = cfg.relearnSteps, i = c.step || 0;
    if (ease === 1) { c.step = 0; Object.assign(c, stepDue(steps[0])); }
    else if (ease === 2) Object.assign(c, stepDue(i === 0 && steps.length > 1 ? (steps[0] + steps[1]) / 2 : i === 0 ? steps[0] * 1.5 : steps[i]));
    else if (ease === 3) { if (i + 1 < steps.length) { c.step = i + 1; Object.assign(c, stepDue(steps[i + 1])); } else { c.type = REVIEW; c.step = 0; c.due = today + c.ivl; } }
    else { c.type = REVIEW; c.step = 0; c.ivl = clampIvl(c.ivl + 1, cfg); c.due = today + c.ivl; }
    return c;
  }
  /* review */
  const late = Math.max(0, today - c.due), ivl = c.ivl || 1;
  if (ease === 1) {
    c.lapses = (c.lapses || 0) + 1; c.ease = Math.max(1.3, c.ease - 0.2);
    c.ivl = clampIvl(ivl * cfg.lapseMult, cfg);
    if (cfg.relearnSteps.length) { c.type = RELEARN; c.step = 0; Object.assign(c, stepDue(cfg.relearnSteps[0])); } else c.due = today + c.ivl;
    if (c.lapses >= cfg.leech && (c.lapses - cfg.leech) % Math.max(1, Math.floor(cfg.leech / 2)) === 0) { c.leech = true; c.susp = true; }
    return c;
  }
  const hard = Math.max(ivl + 1, ivl * cfg.hardIvl * cfg.ivlMod);
  const good = Math.max(hard + 1, (ivl + late / 2) * c.ease * cfg.ivlMod);
  const easy = Math.max(good + 1, (ivl + late) * c.ease * cfg.easyBonus * cfg.ivlMod);
  const pick = ease === 2 ? hard : ease === 3 ? good : easy;
  c.ivl = Math.min(cfg.maxIvl, Math.max(cfg.minIvl, fuzz(pick, id + ':' + today + ':' + ease)));
  if (ease === 2) c.ease = Math.max(1.3, c.ease - 0.15);
  if (ease === 4) c.ease = c.ease + 0.15;
  c.due = today + c.ivl;
  return c;
}

/* the label on each answer button: when the card comes back */
export function preview(c, ease, now, cfg = DEFAULTS, id = '') {
  const n = schedule(c, ease, now, cfg, id);
  if (n.type === LEARN || n.type === RELEARN) return span((n.due - now) / 1000);
  return span((n.due - dayOf(now, cfg)) * 86400);
}
export function span(sec) {
  if (sec < 60) return '<1m';
  if (sec < 3600) return Math.round(sec / 60) + 'm';
  if (sec < 86400) return Math.round(sec / 3600) + 'h';
  const d = sec / 86400;
  if (d < 30) return Math.round(d) + 'd';
  if (d < 365) return (d / 30).toFixed(1).replace(/\.0$/, '') + 'mo';
  return (d / 365).toFixed(1).replace(/\.0$/, '') + 'y';
}

/* today's counts from the log: new cards introduced, reviews done (Anki's daily limits) */
export function todayDone(s, now) {
  const today = dayOf(now, s.cfg); let nw = 0, rv = 0, n = 0, again = 0, ms = 0;
  for (const r of s.log) if (dayOf(r.t, s.cfg) === today) { n++; ms += r.ms || 0; if (r.e === 1) again++; if (r.from === NEW) nw++; else if (r.from === REVIEW) rv++; }
  return { nw, rv, n, again, ms };
}
const live = (c, today) => !c.susp && !(c.buried >= today);

/* the queues for a set of card ids (one deck or all): learning due now, reviews due today, new within today's limit */
export function queues(s, ids, now) {
  const cfg = s.cfg, today = dayOf(now, cfg), done = todayDone(s, now);
  const learn = [], ahead = [], rev = [], nw = [];
  for (const id of ids) {
    const c = cardOf(s, id); if (!live(c, today)) continue;
    if (c.type === LEARN || c.type === RELEARN) { if (c.due <= now) learn.push(id); else if (c.due <= now + cfg.learnAhead * MIN) ahead.push(id); }
    else if (c.type === REVIEW) { if (c.due <= today) rev.push(id); }
    else nw.push(id);
  }
  learn.sort((a, b) => s.cards[a].due - s.cards[b].due); ahead.sort((a, b) => s.cards[a].due - s.cards[b].due);
  rev.sort((a, b) => s.cards[a].due - s.cards[b].due || (a < b ? -1 : 1));
  if (cfg.newOrder === 'random') nw.sort((a, b) => fuzz(1000, a) - fuzz(1000, b));
  return { learn, ahead, rev: rev.slice(0, Math.max(0, cfg.revPerDay - done.rv)), nw: nw.slice(0, Math.max(0, cfg.newPerDay - done.nw)), today };
}
/* the next card: learning that is due, then reviews and new cards mixed (one new after every few reviews, as Anki
   mixes them), then learning cards up to 20 minutes early so a session can end */
export function nextCard(s, ids, now) {
  const q = queues(s, ids, now);
  if (q.learn.length) return { id: q.learn[0], q };
  if (q.rev.length && q.nw.length) {
    const every = Math.max(1, Math.round(q.rev.length / q.nw.length));
    const nDone = todayDone(s, now).n;
    return { id: nDone % (every + 1) === every ? q.nw[0] : q.rev[0], q };
  }
  if (q.rev.length) return { id: q.rev[0], q };
  if (q.nw.length) return { id: q.nw[0], q };
  if (q.ahead.length) return { id: q.ahead[0], q };
  return { id: null, q };
}
/* answer: schedule, log, and return what undo needs */
export function answer(s, id, ease, now, ms = 0) {
  const before = s.cards[id] ? { ...s.cards[id] } : null, c0 = cardOf(s, id);
  const c = schedule(c0, ease, now, s.cfg, id);
  s.cards[id] = c;
  s.log.push({ id, t: now, e: ease, from: c0.type, ivl: c.type === REVIEW ? c.ivl : -Math.round((c.due - now) / 1000), last: c0.ivl || 0, ms });
  return { id, before };
}
export function undo(s, u) { if (!u) return; if (u.before) s.cards[u.id] = u.before; else delete s.cards[u.id]; const i = s.log.map(r => r.id).lastIndexOf(u.id); if (i >= 0) s.log.splice(i, 1); }

/* stats for the Stats tab */
export function stats(s, ids, now) {
  const today = dayOf(now, s.cfg), set = new Set(ids);
  const count = { new: 0, learn: 0, young: 0, mature: 0, susp: 0 };
  const forecast = Array(30).fill(0);
  for (const id of ids) {
    const c = cardOf(s, id);
    if (c.susp) { count.susp++; continue; }
    if (c.type === NEW) count.new++; else if (c.type !== REVIEW) count.learn++; else if (c.ivl >= 21) count.mature++; else count.young++;
    if (c.type === REVIEW) { const d = Math.max(0, c.due - today); if (d < 30) forecast[d]++; }
    else if (c.type !== NEW) forecast[0]++;
  }
  const hist = Array(30).fill(0), ret = { young: [0, 0], mature: [0, 0] };
  for (const r of s.log) {
    if (!set.has(r.id)) continue;
    const ago = today - dayOf(r.t, s.cfg); if (ago >= 0 && ago < 30) hist[29 - ago]++;
    if (r.from === REVIEW && ago < 30) { const k = r.last >= 21 ? 'mature' : 'young'; ret[k][1]++; if (r.e > 1) ret[k][0]++; }
  }
  return { count, forecast, hist, ret, today: todayDone({ ...s, log: s.log.filter(r => set.has(r.id)) }, now) };
}
