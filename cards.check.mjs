/* cards.check.mjs — the scheduler against Anki's SM-2 rules (srs-engine.mjs). `node cards.check.mjs`; exits 1 on a miss. */
import { newState, schedule, answer, undo, nextCard, queues, preview, dayOf, NEW, LEARN, REVIEW, RELEARN, DEFAULTS } from './srs-engine.mjs';

let bad = 0;
const ok = (cond, what) => { if (!cond) { bad++; console.log('FAIL', what); } };
const T0 = new Date(2026, 9, 28, 9, 0).getTime(), MIN = 6e4, DAY = 864e5, cfg = DEFAULTS;
const fresh = { type: NEW, due: 0, ivl: 0, ease: 0, step: 0, reps: 0, lapses: 0 };

/* learning steps */
let c = schedule(fresh, 3, T0, cfg);
ok(c.type === LEARN && c.step === 1 && c.due - T0 === 10 * MIN && c.ease === 2.5, 'new Good → 10m step, ease 250%');
ok(schedule(fresh, 1, T0, cfg).due - T0 === MIN, 'new Again → 1m');
ok(schedule(fresh, 2, T0, cfg).due - T0 === 5.5 * MIN, 'new Hard → halfway between 1m and 10m');
let g = schedule(c, 3, T0 + 10 * MIN, cfg);
ok(g.type === REVIEW && g.ivl === 1 && g.due === dayOf(T0, cfg) + 1, 'second Good graduates at 1d');
let e = schedule(fresh, 4, T0, cfg);
ok(e.type === REVIEW && e.ivl === 4, 'new Easy graduates at 4d');

/* reviews */
const rv = { type: REVIEW, ivl: 10, ease: 2.5, due: dayOf(T0, cfg), step: 0, reps: 3, lapses: 0 };
const h = schedule(rv, 2, T0, cfg, 'x'), gd = schedule(rv, 3, T0, cfg, 'x'), ez = schedule(rv, 4, T0, cfg, 'x');
ok(h.ivl >= 10 && h.ivl <= 14 && Math.abs(h.ease - 2.35) < 1e-9, 'review Hard ≈ ×1.2, ease −15');
ok(gd.ivl >= 21 && gd.ivl <= 29, 'review Good ≈ ×2.5 (fuzzed)');
ok(ez.ivl > gd.ivl && Math.abs(ez.ease - 2.65) < 1e-9, 'review Easy > Good, ease +15');
const lp = schedule(rv, 1, T0, cfg, 'x');
ok(lp.type === RELEARN && lp.due - T0 === 10 * MIN && lp.ivl === 1 && Math.abs(lp.ease - 2.3) < 1e-9 && lp.lapses === 1, 'lapse → relearn 10m, ivl 1d, ease −20');
const back = schedule(lp, 3, T0 + 10 * MIN, cfg);
ok(back.type === REVIEW && back.ivl === 1, 'relearn Good → back to review at the new interval');
ok(Math.max(1.3, 1.3 - 0.2) === 1.3 && schedule({ ...rv, ease: 1.3 }, 1, T0, cfg).ease === 1.3, 'ease floor 130%');
const late = schedule({ ...rv, due: dayOf(T0, cfg) - 10 }, 3, T0, cfg, 'y');
ok(late.ivl > gd.ivl, 'a late Good gets credit for the days late');

/* leech */
let L = { ...rv, lapses: 7 };
L = schedule(L, 1, T0, cfg, 'z');
ok(L.leech && L.susp, '8th lapse suspends and tags a leech');

/* day rollover at 4 am */
const d1 = new Date(2026, 9, 29, 3, 59).getTime(), d2 = new Date(2026, 9, 29, 4, 1).getTime();
ok(dayOf(d2, cfg) - dayOf(d1, cfg) === 1, 'the day rolls over at 4 am');

/* queues, limits, undo */
const s = newState({ newPerDay: 3 });
const ids = Array.from({ length: 10 }, (_, i) => 'c' + i);
ok(queues(s, ids, T0).nw.length === 3, 'new cards capped at the daily limit');
let n1 = nextCard(s, ids, T0).id; const u = answer(s, n1, 3, T0);
ok(s.cards[n1].type === LEARN && queues(s, ids, T0).nw.length === 2, 'answering a new card uses up the day\'s allowance');
ok(nextCard(s, ids, T0).id !== n1, 'a learning card waits for its step');
ok(nextCard(s, ids, T0 + 11 * MIN).id === n1, 'it comes back when its step is due');
undo(s, u);
ok(!s.cards[n1] && s.log.length === 0, 'undo puts the card and the log back');
ok(preview(fresh, 3, T0, cfg) === '10m' && preview(fresh, 4, T0, cfg) === '4d', 'button labels: Good 10m, Easy 4d');
s.cards.c5 = { ...fresh, susp: true };
ok(!queues(s, ids, T0).nw.includes('c5'), 'a suspended card is never dealt');
s.cards.c6 = { ...fresh, buried: dayOf(T0, cfg) };
ok(!queues(s, ['c6'], T0).nw.includes('c6') && queues(s, ['c6'], T0 + DAY).nw.includes('c6'), 'a buried card is back tomorrow');

console.log(bad ? `${bad} check(s) failed` : 'scheduler: all checks pass');
process.exit(bad ? 1 : 0);
