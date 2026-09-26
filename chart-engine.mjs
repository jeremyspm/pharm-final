/* Chart Sim's engine: pure functions, no DOM, no imports. build-chart.mjs inlines this file into chart.html (with
   `export ` stripped) AND imports it to audit every scenario — so the questions and checks the build proves are the
   ones the page runs.

   A scenario (content/chart/*.js) describes one patient's 8-Day National Medication Chart in a few lines per order;
   compile() turns it into V, a map from every cell on the chart (see the cell ids in chart-render.mjs) to what is
   written there, plus the structured facts the questions are generated from. */

/* The regular-medicine time boxes printed on the NZ chart (NMC8D) beside every order */
export const PRINTED = ['0600', '0800', '1400', '1800', '2200'];
/* The chart's own non-administration key (NMC8D, 2012 ed., p. 11) */
export const CODES = { U: 'Patient unavailable', SM: 'Self-medicating', CP: 'Carer/Parent', R: 'Patient refused', D: 'Prescriber’s instructions', N: 'Not administered — reason in notes' };
export const PRN_LINES = 20;      // record lines per PRN order: 4 groups × 5 (NMC8D p. 5)

export const toMin = hhmm => { const t = String(hhmm).padStart(4, '0'); return +t.slice(0, 2) * 60 + +t.slice(2); };
export const abs = (day, hhmm) => (day - 1) * 1440 + toMin(hhmm);                 // minutes since 0000 on day 1
export const hhmm = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + String(m % 60).padStart(2, '0'); };
export const parseAt = at => { const m = /^(\d)@(\d{4})$/.exec(at); if (!m) throw new Error('bad time "' + at + '" — want day@HHMM'); return { day: +m[1], t: m[2], m: abs(+m[1], m[2]) }; };

/* the chart's dates: day 1 = start, written d/m/yy as a nurse would */
export function dayDate(S, day) {
  const [d, mo, y] = S.start, dt = new Date(Date.UTC(y, mo - 1, d + day - 1));
  return `${dt.getUTCDate()}/${dt.getUTCMonth() + 1}/${String(dt.getUTCFullYear()).slice(2)}`;
}
export const WEEKDAY = (S, day) => { const [d, mo, y] = S.start; return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(Date.UTC(y, mo - 1, d + day - 1)).getUTCDay()]; };

/* Where each prescribed time sits in the five printed rows: a printed time is circled; any other time is written
   in the box beside the nearest free printed row (e.g. 2000 beside 1800). */
export function slotsFor(times) {
  const out = [null, null, null, null, null];
  const list = String(times || '').split(/\s+/).filter(Boolean);
  for (const t of list) { const i = PRINTED.indexOf(t); if (i >= 0) out[i] = { t, circled: true }; }
  for (const t of list) {
    if (PRINTED.includes(t)) continue;
    let best = -1, bd = 1e9;
    PRINTED.forEach((p, i) => { const d = Math.abs(toMin(p) - toMin(t)); if (!out[i] && d < bd) { bd = d; best = i; } });
    if (best < 0) throw new Error('no free time row for ' + t);
    out[best] = { t, circled: false };
  }
  return out;
}

/* "0810 AK/LT" → {t:'0810', giv:'AK', chk:'LT'} · "AK" → given at the slot time · "R" / "D" … → a code */
export function parseAdmin(v, slotT) {
  const s = String(v).trim();
  if (CODES[s]) return { code: s };
  const m = /^(?:(\d{4})\s+)?([A-Z]{2,3})(?:\/([A-Z]{2,3}))?(?:\s+dose=(\S+))?$/.exec(s);
  if (!m) throw new Error('bad administration entry "' + v + '"');
  return { t: m[1] || slotT, giv: m[2], chk: m[3] || '', dose: m[4] || '' };
}
/* "2@0610 1g PO AK/LT" → a PRN record line */
export function parsePrn(v) {
  const m = /^(\d@\d{4})\s+(\S+)\s+(\S+)\s+([A-Z]{2,3})(?:\/([A-Z]{2,3}))?$/.exec(String(v).trim());
  if (!m) throw new Error('bad PRN record "' + v + '"');
  const a = parseAt(m[1]);
  return { day: a.day, t: a.t, m: a.m, dose: m[2], route: m[3], giv: m[4], chk: m[5] || '' };
}
/* a dose written in the record ("1g", "500mg", "2.5mg") as an amount in the order's own units, for the 24-hour sum */
export function doseAmount(txt, units) {
  const m = /^([\d.]+)\s*(mcg|microgram|mg|g|mL|units)?$/i.exec(String(txt).trim());
  if (!m) return NaN;
  const n = +m[1], u = (m[2] || units).toLowerCase(), want = String(units).toLowerCase();
  const f = { mcg: 1e-3, microgram: 1e-3, mg: 1, g: 1000, ml: 1, units: 1 };
  if (u === want) return n;
  if (f[u] != null && f[want] != null && u !== 'ml' && want !== 'ml' && u !== 'units' && want !== 'units') return n * f[u] / f[want];
  return NaN;
}

const who = (S, id) => (S.prescribers || []).find(p => p.id === id);
const nurse = (S, init) => (S.nurses || []).find(n => n.init === init);

/* ── compile: a scenario → every written cell (V) + facts ──
   The chart as it stood at S.now: an order, a signature, a record line, a bag started or finished, a cancel, shows
   only once its moment has come. So a scenario can carry the whole of its days (the night nurse's 0600 signatures
   included) and each stage shows exactly what had been written by then. */
export function compile(S) {
  const V = {}, put = (id, v) => { if (v !== undefined && v !== null && v !== '') V[id] = v; };
  const date = d => dayDate(S, d), sig = id => (who(S, id) || {}).sig || id;
  const nowM = parseAt(S.now).m, seen = m => m <= nowM, atM = (at, day, t = '0000') => at ? parseAt(at).m : abs(day, t);
  const P = S.patient;
  for (const [k, v] of Object.entries({ family: P.family, given: P.given, gender: P.gender, dob: P.dob, nhi: P.nhi })) put('pt.' + k, v);
  put('chart.no', '1'); put('chart.of', '1');
  if (S.recharted) put('recharted', date(S.recharted));
  if (P.weight) { put('wt.0', P.weight); put('wt.0d', date(P.wday || 1)); }
  if (P.height) { put('ht', P.height); put('htd', date(P.wday || 1)); }
  /* front: allergies and adverse reactions — "No" ticked only when the list is empty */
  for (const [k, list] of [['alg', S.allergies || []], ['adr', S.adverse || []]]) {
    if (!list.length) { put(k + '.none', { tick: 1 }); if (S[k === 'alg' ? 'allergyBy' : 'adverseBy']) { put(k + '.sig', sig(S[k === 'alg' ? 'allergyBy' : 'adverseBy'])); put(k + '.date', date(1)); } }
    list.forEach((a, i) => { put(`${k}.${i}.med`, a.med); put(`${k}.${i}.rx`, a.rx); });
    if (list.length) { put(k + '.sig', sig(list[0].by)); put(k + '.date', date(list[0].day || 1)); }
    /* the summary box the Once Only page carries */
    put(k + '2.' + (list.length ? 'yes' : 'no'), { tick: 1 });
    if (list.length) put(k + '2.list', list.map(a => a.med).join(', '));
  }
  const SC = { renal: 'sc.renal', preg: 'sc.preg', hep: 'sc.hep', bf: 'sc.bf' }, SU = { insulin: 'sup.insulin', analgesia: 'sup.analg', heparin: 'sup.heparin', warfarin: 'sup.warfarin' };
  if (!(S.special || []).length) put('sc.none', { tick: 1 });
  for (const s of S.special || []) put(SC[s] || 'sc.other', SC[s] ? { tick: 1 } : s);
  if (!(S.supplementary || []).length) put('sup.none', { tick: 1 });
  for (const s of S.supplementary || []) put(SU[s] || 'sup.other', SU[s] ? { tick: 1 } : s);
  (S.prescribers || []).forEach((p, i) => { put(`sigp.${i}.name`, p.name); put(`sigp.${i}.sig`, p.sig); put(`sigp.${i}.reg`, p.reg); });
  (S.nurses || []).forEach((n, i) => { put(`siga.${i}.name`, n.name); put(`siga.${i}.init`, n.init); put(`siga.${i}.reg`, n.reg); });
  /* VTE box */
  if (S.vte) {
    const v = S.vte;
    put('vte.assessed', { tick: 1 }); put('vte.date', date(v.day || 1)); put('vte.psig', sig(v.by));
    if (v.anticoag != null) put(v.anticoag ? 'vte.anticoag.y' : 'vte.anticoag.n', { tick: 1 });
    if (v.stockings != null) put(v.stockings ? 'vte.stock.y' : 'vte.stock.n', { tick: 1 });
    if (v.ipc != null) put(v.ipc ? 'vte.ipc.y' : 'vte.ipc.n', { tick: 1 });
    if (v.none) put('vte.' + v.none, { tick: 1 });
  }
  /* once only — `at` is when it was charted (else the start of its day) */
  const once = (S.once || []).map((o, i) => {
    if (!seen(atM(o.at, o.day))) return { ...o, i, hidden: 1 };
    const g0 = o.given ? parseAt(o.given.at) : null, g = g0 && seen(g0.m) ? g0 : null;
    put(`once.${i}.date`, date(o.day)); put(`once.${i}.med`, o.med); put(`once.${i}.dose`, o.dose); put(`once.${i}.units`, o.units);
    put(`once.${i}.route`, o.route); put(`once.${i}.calc`, o.calc); put(`once.${i}.psig`, sig(o.by)); put(`once.${i}.range`, o.range); put(`once.${i}.inst`, o.inst);
    if (g) { put(`once.${i}.dosedt`, date(g.day) + ' ' + g.t); put(`once.${i}.gc`, { giv: o.given.giv, chk: o.given.chk || '' }); if (o.given.tstart) put(`once.${i}.tstart`, o.given.tstart); if (o.given.tend) put(`once.${i}.tend`, o.given.tend); }
    return { ...o, i, givenAt: g };
  });
  const verbal = (S.verbal || []).map((o, i) => {
    const a = parseAt(o.at);
    if (!seen(a.m)) return { ...o, i, hidden: 1, atM: a };
    const g0 = o.given ? parseAt(o.given.at) : null, g = g0 && seen(g0.m) ? g0 : null;
    const signed = o.signed && seen(o.signedAt ? parseAt(o.signedAt).m : a.m) ? o.signed : null;
    put(`verb.${i}.dt`, date(a.day) + ' ' + a.t); put(`verb.${i}.med`, o.med); put(`verb.${i}.dose`, o.dose); put(`verb.${i}.units`, o.units); put(`verb.${i}.route`, o.route);
    put(`verb.${i}.pname`, o.pname); if (signed) put(`verb.${i}.psig`, sig(signed));
    if (g) { put(`verb.${i}.dosedt`, date(g.day) + ' ' + g.t); put(`verb.${i}.nurse`, o.given.nurse); put(`verb.${i}.witness`, o.given.witness); put(`verb.${i}.gc`, { giv: o.given.nurse, chk: o.given.witness }); }
    return { ...o, i, atM: a, givenAt: g, signed };
  }).filter(o => !o.hidden);
  /* oxygen: a line shows from its start day; its stop date once `stopAt` (or the stop day) has come */
  const o2 = [];
  if (S.o2) {
    put('o2.target', S.o2.target);
    S.o2.rows.forEach((r, i) => {
      if (!seen(abs(r.start, '0000'))) return;
      const stopped = r.stop && seen(atM(r.stopAt, r.stop));
      put(`o2.${i}.start`, date(r.start)); put(`o2.${i}.device`, r.device); put(`o2.${i}.flow`, r.flow); put(`o2.${i}.sig`, sig(r.by)); if (stopped) put(`o2.${i}.stop`, date(r.stop));
      o2.push({ ...r, i, stopped });
    });
  }
  /* PRN */
  const prn = (S.prn || []).filter(o => seen(atM(o.at, o.day))).map(o => {
    const L = o.L, rec = (o.given || []).map(parsePrn).filter(r => seen(r.m)).sort((a, b) => a.m - b.m);
    for (const f of ['med', 'dose', 'units', 'route', 'freq', 'calc', 'range', 'ind', 'inst']) put(`prn.${L}.${f}`, o[f]);
    put(`prn.${L}.date`, date(o.day)); put(`prn.${L}.max`, o.max); put(`prn.${L}.psig`, sig(o.by));
    let cease = null;
    if (o.cease && seen(parseAt(o.cease.at).m)) { cease = parseAt(o.cease.at); put(`prn.${L}.cancel`, `${sig(o.cease.by)} ${date(cease.day)} ${cease.t}`); put(`prn.${L}.x`, { day: cease.day }); }
    rec.forEach((r, j) => { r.line = j; put(`prn.${L}.${j}.date`, date(r.day)); put(`prn.${L}.${j}.time`, r.t); put(`prn.${L}.${j}.dose`, r.dose); put(`prn.${L}.${j}.route`, r.route); put(`prn.${L}.${j}.gc`, { giv: r.giv, chk: r.chk }); });
    return { ...o, rec, ceaseAt: cease };
  });
  /* regular: the order, its time rows, its 8 days of boxes */
  for (let d = 1; d <= 8; d++) put(`reg.day${d}`, date(d));
  const reg = (S.regular || []).filter(o => seen(atM(o.at, o.day, o.startT))).map(o => {
    const L = o.L, slots = slotsFor(o.times);
    for (const f of ['med', 'dose', 'units', 'route', 'freq', 'calc', 'range', 'inst']) put(`reg.${L}.${f}`, o[f]);
    put(`reg.${L}.date`, date(o.day)); put(`reg.${L}.psig`, sig(o.by));
    slots.forEach((s, k) => { if (s) put(`reg.${L}.s${k}`, s.circled ? { circle: 1 } : s.t); });
    let cease = null;
    if (o.cease && seen(parseAt(o.cease.at).m)) {
      cease = parseAt(o.cease.at); put(`reg.${L}.cancel`, `${sig(o.cease.by)} ${date(cease.day)} ${cease.t}`);
      /* "cross through order and administration": the rest of the cease day's rows, then every day after */
      put(`reg.${L}.x`, { day: cease.day, rows: slots.map((q, k) => q && toMin(q.t) > toMin(cease.t) ? k : -1).filter(k => k >= 0) });
    }
    const adm = [];
    for (const [key, v] of Object.entries(o.given || {})) {
      const a = parseAt(key), k = slots.findIndex(s => s && s.t === a.t);
      if (k < 0) throw new Error(`regular ${L} ${o.med}: nothing is due at ${a.t} (times: ${o.times})`);
      const e = { ...parseAdmin(v, a.t), day: a.day, slot: k, due: a.t, m: a.m };
      /* when it was actually written: the time given (a 2400 dose given at 0005 belongs to the day before) */
      if (!e.code) { let g = abs(a.day, e.t); if (g < a.m - 720) g += 1440; e.given = g; }
      if (!seen(e.code ? a.m : e.given)) continue;
      adm.push(e);
      const base = `reg.${L}.d${a.day}.s${k}`;
      if (e.code) put(base + '.gc', { code: e.code });
      else { put(base + '.t', e.t); put(base + '.gc', { giv: e.giv, chk: e.chk }); if (e.dose) put(base + '.dose', e.dose); }
    }
    adm.sort((a, b) => a.m - b.m);
    return { ...o, slots, adm, ceaseAt: cease, start: abs(o.day, o.startT || '0000') };
  });
  const fluids = (S.fluids || []).map((f, i) => {
    if (!seen(atM(f.at, f.day))) return { ...f, i, hidden: 1 };
    put(`fl.${i}.date`, date(f.day)); put(`fl.${i}.time`, f.time); put(`fl.${i}.vol`, f.vol); put(`fl.${i}.fluid`, f.fluid); put(`fl.${i}.route`, f.route);
    put(`fl.${i}.rate`, f.rate); put(`fl.${i}.psig`, sig(f.by));
    const st = f.started && seen(parseAt(f.started.at).m) ? f.started : null, dn = st && f.done && seen(parseAt(f.done.at).m) ? f.done : null;
    if (st) { put(`fl.${i}.astart`, parseAt(st.at).t); put(`fl.${i}.gc`, { giv: st.by, chk: st.chk || '' }); }
    if (dn) { put(`fl.${i}.tend`, parseAt(dn.at).t); put(`fl.${i}.avol`, dn.vol); }
    return { ...f, i, running: !!st && !dn, started: st, done: dn };
  });
  const now = parseAt(S.now);
  return { S, V, now, once, verbal, prn, reg, fluids, o2, dates: [1, 2, 3, 4, 5, 6, 7, 8].map(date) };
}
/* the chart as the round finds it: its moment, not the last stage's */
export const atRound = (S, R) => ({ ...S, now: R.at });

/* ── timing facts ── */
/* a regular order's next due dose after a moment: {day, t, slot} — null when ceased first or past day 8 */
export function nextDue(o, m) {
  for (let d = 1; d <= 8; d++) for (let k = 0; k < 5; k++) {
    const s = o.slots[k]; if (!s) continue;
    const at = abs(d, s.t);
    if (at <= m || at < o.start) continue;
    if (o.ceaseAt && at >= o.ceaseAt.m) return null;
    return { day: d, t: s.t, slot: k, m: at };
  }
  return null;
}
/* a PRN order at a moment: what has been given in the last 24 h, and whether it can be given now */
export function prnStatus(o, m) {
  const past = o.rec.filter(r => r.m <= m), last = past[past.length - 1] || null;
  const day24 = past.filter(r => r.m > m - 1440);
  const amount = day24.reduce((a, r) => a + doseAmount(r.dose, o.units), 0);
  const nextOk = last ? last.m + o.gapH * 60 : m;
  const maxHit = o.maxAmount != null && amount >= o.maxAmount - 1e-9;
  return { last, n24: day24.length, amount, nextOk, maxHit, can: !o.ceaseAt && m >= nextOk && !maxHit };
}
export const when = (C, m) => {
  const d = Math.floor(m / 1440) + 1, day = d === C.now.day ? 'today' : d === C.now.day - 1 ? 'yesterday' : d === C.now.day + 1 ? 'tomorrow' : 'day ' + d;
  return `${day} at ${hhmm(m)}`;
};

/* ── the reading questions, generated from the chart itself (so they can never disagree with it) ──
   {id, kind:'mcq'|'tap', q, opts?, a?, accept?:[cell ids or 'prefix*'], show:[cell ids], why, tag} */
export function questions(C, rnd) {
  const S = C.S, out = [], first = S.patient.given, nowTxt = `${WEEKDAY(S, C.now.day)} ${dayDate(S, C.now.day)}, ${C.now.t}`;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a, n) => shuffle(a).slice(0, n);
  const mcq = (id, tag, q, a, wrong, show, why) => {
    const w = [...new Set(wrong.filter(x => x && x !== a))];
    if (w.length < 2) return;
    out.push({ id, kind: 'mcq', tag, q, a, opts: shuffle([a, ...pick(w, 3)]), show, why });
  };
  const tap = (id, tag, q, accept, why) => out.push({ id, kind: 'tap', tag, q, accept, show: accept.filter(x => !x.endsWith('*')), why });
  /* two lines for one medicine (a therapy change is a new line) → name the row, or a question has two answers */
  const nm = o => C.reg.filter(x => x.med === o.med).length > 1 ? `${o.med} (row ${o.L})` : o.med;
  const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  const nameOf = init => (nurse(S, init) || {}).name || init;
  const regByL = L => C.reg.find(o => o.L === L);

  /* allergies */
  const alg = S.allergies || [], adr = S.adverse || [];
  if (alg.length) {
    const a = alg.map(x => `${x.med} — ${x.rx}`).join('; ');
    const meds = [...new Set([...C.reg.map(o => o.med), ...C.prn.map(o => o.med), ...adr.map(x => x.med)])].filter(m => !alg.some(x => x.med === m));
    mcq('alg', 'Front page', `What is ${first} allergic to?`, a,
      [...meds.slice(0, 4).map(m => `${m} — ${alg[0].rx}`), ...adr.map(x => `${x.med} — ${x.rx}`), 'Nothing — no known allergies'],
      alg.map((_, i) => `alg.${i}.med`), 'The Allergies box on the front page. Check it before every first dose — and ask the patient too.');
    tap('alg-tap', 'Front page', `Tap where the chart records ${first}’s allergies.`, ['alg.*'], 'The Allergies box, top left of the front page.');
  } else {
    mcq('alg', 'Front page', `What does the chart say about ${first}’s allergies?`, 'No known allergies — the “No” box is ticked and signed',
      ['The box is blank, so there are no allergies', 'PENICILLIN — rash', 'It says to check the notes', 'Allergies are not recorded on this chart'],
      ['alg.none'], 'The Allergies box: a ticked, signed “No” is a recorded answer. A blank box would mean nobody has asked.');
  }
  if (adr.length) mcq('adr', 'Front page', `${adr[0].med} is on the front page. What is it recorded as?`, `An adverse reaction (${adr[0].rx}) — not an allergy`,
    [`An allergy — never give it`, 'A medicine she takes at home', 'A supplementary chart', `A special-care warning`],
    ['adr.0.med', 'adr.0.rx'], 'Adverse Reactions is the right-hand box, separate from Allergies: a known bad effect that is not an immune reaction. The prescriber weighs it; it still matters.');
  /* special care + supplementary */
  const SCN = { renal: 'Renal impairment', preg: 'Pregnancy', hep: 'Hepatic impairment', bf: 'Breastfeeding' };
  const SCW = { renal: 'Renal impairment changes the dose of every medicine the kidneys clear.', hep: 'Hepatic impairment changes the dose of medicines the liver clears — paracetamol’s maximum among them.',
    preg: 'Pregnancy rules out some medicines altogether.', bf: 'Breastfeeding: some medicines pass into breast milk.' };
  if ((S.special || []).length) mcq('sc', 'Front page', 'Which “Special Care Required” box is ticked?', SCN[S.special[0]] || S.special[0],
    Object.values(SCN).concat('None — the “No” box is ticked'), [`sc.${S.special[0]}`], `Special Care Required, front page. ${SCW[S.special[0]] || ''}`);
  const SUN = { insulin: 'Diabetic/Insulin', analgesia: 'Specialised analgesia', heparin: 'Heparin', warfarin: 'Warfarin' };
  for (const s of S.supplementary || []) {
    mcq(`sup-${s}`, 'Front page', `Where would you find ${first}’s ${s === 'analgesia' ? 'PCA or epidural' : s}?`, `On a separate ${SUN[s]} chart — the front page ticks it`,
      ['In the PRN section', 'On the Regular Medicine page, row I', 'It is not prescribed', 'In the Once Only section'],
      [`sup.${s === 'analgesia' ? 'analg' : s}`], 'Supplementary Charts, front page: those medicines live on their own chart, so the main chart will not show them.');
  }
  if (S.recharted) mcq('recharted', 'Front page', `The front page has a Date Recharted: ${dayDate(S, S.recharted)}. What does it tell you?`, 'The orders were rewritten onto this chart that day — earlier doses are on the old chart',
    ['That is the day the patient was admitted to the ward', 'The chart must be rewritten again by that day', 'A pharmacist checked every order on that day'],
    ['recharted'], 'Date Recharted, top left of the front page. An 8-day chart runs out on a long stay, so the prescriber rewrites the current orders onto a new one; the old chart is kept with the notes.');
  mcq('nhi', 'Front page', `What is ${first}’s NHI number?`, S.patient.nhi,
    [S.patient.nhi.slice(0, 3) + S.patient.nhi.slice(4) + S.patient.nhi[3], S.patient.nhi.slice(0, 5) + String((+S.patient.nhi[5] + 3) % 10) + S.patient.nhi.slice(6), 'ZZZ0000', S.patient.nhi.split('').reverse().join('').toUpperCase()],
    ['pt.nhi'], 'Every page carries the patient label; the NHI is one of the three identifiers you check against the ID band.');

  /* regular orders: dose, times, who gave, codes, what is due next */
  const active = C.reg.filter(o => !o.ceaseAt || o.ceaseAt.m > abs(C.now.day, C.now.t));
  const timesTxt = o => list(o.slots.filter(Boolean).map(s => s.t).sort());
  for (const o of C.reg) {
    mcq(`dose-${o.L}`, 'Regular', `What dose and route is ${nm(o)} charted at?`, `${o.dose} ${o.units} ${o.route}`,
      [...C.reg.filter(x => x !== o).map(x => `${x.dose} ${x.units} ${x.route}`), `${o.dose} ${o.units === 'mg' ? 'mcg' : 'mg'} ${o.route}`, `${o.dose} ${o.units} ${o.route === 'PO' ? 'IV' : 'PO'}`],
      [`reg.${o.L}.dose`, `reg.${o.L}.units`, `reg.${o.L}.route`], 'The order line: Dose · Units · Route, written by the prescriber.');
    mcq(`times-${o.L}`, 'Regular', `At what time(s) is ${nm(o)} due each day?`, timesTxt(o),
      [...C.reg.filter(x => x !== o).map(timesTxt), '0800 and 1400', '0600 and 1800', '2200'],
      o.slots.map((s, k) => s ? `reg.${o.L}.s${k}` : null).filter(Boolean), 'The “Circle or actual time” column beside the order: circled printed times, or a time written in the box.');
  }
  const signed = C.reg.flatMap(o => o.adm.filter(e => e.giv).map(e => ({ o, e })));
  for (const { o, e } of pick(signed, 4)) {
    const cell = `reg.${o.L}.d${e.day}.s${e.slot}.gc`, idx = (S.nurses || []).findIndex(n => n.init === e.giv);
    mcq(`who-${o.L}-${e.day}-${e.slot}`, 'Regular', `Who gave the ${e.due} ${nm(o)} on ${dayDate(S, e.day)}?`, nameOf(e.giv),
      (S.nurses || []).map(n => n.name).concat((S.prescribers || []).map(p => p.name)), [cell, `siga.${idx}.init`, `siga.${idx}.name`],
      `Initials in the Giv/Chck box (${e.giv}${e.chk ? ' / ' + e.chk : ''}) — and the Sample Initials register on the front page says whose they are.`);
    tap(`tap-${o.L}-${e.day}-${e.slot}`, 'Regular', `Tap the box that shows the ${e.due} ${nm(o)} was given on ${dayDate(S, e.day)}.`, [cell, `reg.${o.L}.d${e.day}.s${e.slot}.t`],
      `Row ${o.L}, the ${dayDate(S, e.day)} column, the ${e.due} line.`);
  }
  for (const o of C.reg) for (const e of o.adm.filter(x => x.code)) {
    const cell = `reg.${o.L}.d${e.day}.s${e.slot}.gc`;
    mcq(`code-${o.L}-${e.day}-${e.slot}`, 'Regular', `The ${e.due} ${nm(o)} on ${dayDate(S, e.day)} has a code instead of initials. What does it mean?`, `${e.code} — ${CODES[e.code]}`,
      Object.entries(CODES).map(([k, v]) => `${k} — ${v}`), [cell], `A code in the Giv/Chck box instead of initials: no nurse gave that dose. The key is printed on the chart (U, SM, CP, R, D, N)${e.code === 'N' ? ' — N means the reason is in the clinical notes' : ''}.`);
    tap(`tapcode-${o.L}-${e.day}-${e.slot}`, 'Regular', `Tap the box that shows the ${e.due} ${nm(o)} on ${dayDate(S, e.day)} was NOT given by a nurse.`, [cell], `Row ${o.L}: the box with “${e.code}” in it.`);
  }
  const m = abs(C.now.day, C.now.t);
  for (const o of pick(active, 3)) {
    const n = nextDue(o, m); if (!n) continue;
    const others = [...new Set(C.reg.flatMap(x => x.slots.filter(Boolean).map(s => s.t)))].filter(t => t !== n.t);
    mcq(`next-${o.L}`, 'Regular', `It is ${nowTxt}. When is ${nm(o)} next due?`, when(C, n.m),
      [...others.map(t => when(C, abs(C.now.day, t) > m ? abs(C.now.day, t) : abs(C.now.day + 1, t))), when(C, n.m + 1440), when(C, n.m - 1440 > m ? n.m - 1440 : n.m + 2880)],
      [`reg.${o.L}.s${n.slot}`], 'The circled times, then the last signed box in its row.');
  }
  const ceased = C.reg.filter(o => o.ceaseAt && o.ceaseAt.m <= m);
  if (ceased.length) {
    const o = ceased[0];
    mcq(`ceased-${o.L}`, 'Regular', 'Which regular order has been stopped?', `${o.med} ${o.dose} ${o.units} ${o.route} (row ${o.L})`, C.reg.filter(x => x !== o).map(x => `${x.med} ${x.dose} ${x.units} ${x.route} (row ${x.L})`), [`reg.${o.L}.cancel`],
      '“Sign, date and time to cancel” is filled in and the order is crossed through. Never give it from that line again.');
    tap(`tapceased-${o.L}`, 'Regular', 'Tap the regular order that has been stopped.', [`reg.${o.L}.*`], `Row ${o.L} — crossed through, with the cancel box signed.`);
  }

  /* PRN: last dose, can it be given now, 24-hour total */
  for (const o of C.prn) {
    const st = prnStatus(o, m);
    if (st.last) {
      const cells = [`prn.${o.L}.${st.last.line}.date`, `prn.${o.L}.${st.last.line}.time`];
      mcq(`prnlast-${o.L}`, 'PRN', `When was ${o.med} (PRN) last given?`, when(C, st.last.m),
        o.rec.filter(r => r !== st.last).map(r => when(C, r.m)).concat([when(C, st.last.m - 120), when(C, st.last.m + 240), when(C, st.last.m - 1440)]),
        cells, 'The PRN record, beside the order on the facing page: the last line filled in.');
      tap(`tapprn-${o.L}`, 'PRN', `Tap the most recent dose of ${o.med} in the PRN record.`, [`prn.${o.L}.${st.last.line}.*`], `Row ${o.L} of the PRN record — the last line written.`);
    }
    const gapTxt = `every ${o.gapH} hours at most`;
    const yes = st.last ? `Yes — the last dose was ${when(C, st.last.m)}, and the 24-hour maximum is not reached` : 'Yes — none has been given yet, so the gap and the 24-hour maximum are fine';
    const notYet = `Not yet — not until ${when(C, st.nextOk)} (${gapTxt})`;
    const maxed = `No — ${first} has had the 24-hour maximum (${o.max})`;
    const a = o.ceaseAt ? 'No — the order has been cancelled' : st.maxHit ? maxed : st.can ? yes : notYet;
    mcq(`prncan-${o.L}`, 'PRN', `It is ${nowTxt}. ${first} asks for ${o.med} (${o.ind}). Can you give it?`, a,
      [yes, notYet.replace(when(C, st.nextOk), when(C, st.nextOk + 120)), maxed, 'No — PRN medicines are only given twice a day', 'Yes — PRN means whenever the patient asks'],
      [`prn.${o.L}.freq`, `prn.${o.L}.max`, ...(st.last ? [`prn.${o.L}.${st.last.line}.time`] : [])],
      `Frequency (${o.freq}) and Max dose/24hrs (${o.max}) on the order, then the record: ${st.n24} dose${st.n24 === 1 ? '' : 's'} in the last 24 hours${st.last ? ', the last ' + when(C, st.last.m) : ''}.`);
  }
  /* once only, verbal, oxygen, fluids */
  for (const o of C.once.filter(x => x.givenAt && !x.hidden)) {
    const g = o.given, at = when(C, o.givenAt.m), others = (S.nurses || []).filter(n => n.init !== g.giv && n.init !== g.chk).map(n => n.name);
    if (g.chk) mcq(`once-${o.i}`, 'Once Only', `${o.med} ${o.dose} ${o.units} ${o.route} was a once-only dose. When was it given, and who checked it?`, `${at} — checked by ${nameOf(g.chk)}`,
      [`${at} — checked by ${nameOf(g.giv)}`, `${when(C, o.givenAt.m + 60)} — checked by ${nameOf(g.chk)}`, ...others.slice(0, 2).map(n => `${at} — checked by ${n}`), 'It has not been given yet'],
      [`once.${o.i}.dosedt`, `once.${o.i}.gc`], '“Date & time of dose” and the Given by / Checked by box on the Once Only order.');
    else mcq(`once-${o.i}`, 'Once Only', `${o.med} ${o.dose} ${o.units} ${o.route} was a once-only dose. When was it given, and by whom?`, `${at} — by ${nameOf(g.giv)}`,
      [`${when(C, o.givenAt.m + 60)} — by ${nameOf(g.giv)}`, ...others.slice(0, 2).map(n => `${at} — by ${n}`), 'It has not been given yet'],
      [`once.${o.i}.dosedt`, `once.${o.i}.gc`], '“Date & time of dose” and the Given by box on the Once Only order.');
  }
  for (const o of C.verbal) {
    const ok = !!o.signed, due = o.atM.m + 1440;
    mcq(`verbal-${o.i}`, 'Verbal Orders', `A verbal order for ${o.med} was taken at ${dayDate(S, o.atM.day)} ${o.atM.t}. Is it complete?`,
      ok ? 'Yes — the prescriber has signed it' : m > due ? `No — still unsigned, and overdue: it was due by ${when(C, due)}` : `No — not signed yet (due within 24 hours, by ${when(C, due)})`,
      ['Yes — the nurse’s and witness’s initials are enough', ok ? `No — the prescriber has not signed it yet` : 'Yes — the prescriber has signed it', 'Verbal orders never need a signature', 'No — a verbal order cannot be given at all'],
      [`verb.${o.i}.psig`, `verb.${o.i}.pname`], 'The Verbal Orders heading on the chart: “must be signed as soon as possible or within 24 hours of order”.');
  }
  if (S.o2) {
    const t = S.o2.target;
    mcq('o2target', 'Oxygen', `What is ${first}’s target oxygen saturation?`, t + '%', ['88–92%', '92–96%', '94–98%', 'Above 90%', '100%'].filter(x => x !== t + '%'), ['o2.target'],
      'Oxygen Therapy & Medical Gases: the target saturation sits at the top of the section.');
    const cur = C.o2.find(r => !r.stopped);
    if (C.o2.length) mcq('o2now', 'Oxygen', `Is ${first} still prescribed oxygen, as of ${nowTxt}?`, cur ? `Yes — ${cur.device}, ${cur.flow}` : 'No — a stop date has been written',
      [cur ? 'No — a stop date has been written' : `Yes — ${C.o2[0].device}, ${C.o2[0].flow}`, 'Yes — via a non-rebreather at 15 L/min', 'Only at night'],
      C.o2.map(r => `o2.${r.i}.stop`), 'START DATE and STOP DATE on each oxygen line.');
  }
  const flv = C.fluids.filter(f => !f.hidden), run = flv.filter(f => f.running), flTxt = f => `${f.vol} mL ${f.fluid} at ${f.rate} mL/hr (line ${f.i + 1})`;
  if (run.length === 1) mcq('flnow', 'Fluids', `Which IV fluid is running now, as of ${nowTxt}?`, flTxt(run[0]), [...flv.filter(f => f !== run[0]).map(flTxt), 'None — the IV fluids have finished'],
    [`fl.${run[0].i}.astart`, `fl.${run[0].i}.fluid`, `fl.${run[0].i}.rate`], 'The IV fluid record: the line with an actual commencing time and no completion time is the bag running now.');
  for (const f of flv) mcq(`fl-${f.i}`, 'Fluids', `At what rate is the ${f.vol} mL of ${f.fluid} prescribed?`, `${f.rate} mL/hr`,
    [`${Math.round(f.vol / 8)} mL/hr`, `${f.rate * 2} mL/hr`, `${Math.round(f.rate / 2)} mL/hr`, `${f.vol} mL/hr`].filter(x => x !== `${f.rate} mL/hr`),
    [`fl.${f.i}.rate`], 'Rate (mL/hr) on the IV & subcut fluid record. Volume ÷ hours = rate.');
  /* the scenario's own questions (judgement the chart alone cannot generate) */
  for (const q of S.questions || []) if ((q.stage || 0) === (S.stage || 0)) out.push(ownQ(q, shuffle));
  return out;
}

/* a question the scenario writes itself: {id, stage?, tag, q, a, w:[wrong…], show, why} or {kind:'tap', accept} */
export const ownQ = (q, shuffle) => q.kind === 'tap' ? { ...q, own: 1, show: q.show || q.accept.filter(x => !x.endsWith('*')) } : { ...q, kind: 'mcq', own: 1, opts: shuffle([q.a, ...q.w]) };

/* ── checking the student's charting for one round ──
   entries: { cellId: value } (tap mode) — gc cells hold {giv, chk} or {code}; plain cells hold text.
   A round: { at:'3@1400', you: initials, rn: preceptor initials, expect: [...] }
     {do:'sign', c:'reg.K.d3.s2'}               — given: your initials + the RN's check, a time within 30 min
     {do:'code', c:'reg.J.d3.s1', code:'D'}     — not given: that code
     {do:'prn', L:'A', dose:['1g'], route:'PO'} — a new PRN record line: date, time, dose, route, your initials + check
     {do:'once', i:1}                            — once-only: date & time of dose, given by you, checked by the RN
     {do:'fluid', i:1}                           — fluids: actual commencing time, commenced by, checked by
     {do:'fluidend', i:1, vol:1000}              — a bag finished: completion time, actual volume
     {do:'reg', name}                            — your line in the Sample Initials register
     {do:'none', c:'prn.B', what, why}           — must NOT be written (e.g. a PRN given too soon)
     {do:'rn', c:'reg.J.d3.s2' | L:'B', …}       — the RN gives it and signs; the student writes nothing there
     {do:'sign', c, dose:['15 mL', …]}           — a variable dose: the dose given goes in the Dose column too
   returns [{ok, part, msg, cells}] — every expectation, then every entry no expectation asked for. */
export function checkRound(C, R, entries) {
  const out = [], used = new Set(), at = parseAt(R.at), date = dayDate(C.S, at.day);
  const txt = v => (v == null ? '' : String(v)).trim();
  const near = t => /^\d{4}$/.test(txt(t)) && Math.abs(toMin(txt(t)) - toMin(at.t)) <= 30;
  const res = (ok, msg, cells) => out.push({ ok, msg, cells });
  for (const x of R.expect) {
    if (x.do === 'sign' || x.do === 'code') {
      const [, L, d, s] = /^reg\.([A-Z]{1,2})\.d(\d)\.s(\d)$/.exec(x.c), o = C.reg.find(r => r.L === L), gc = entries[x.c + '.gc'], t = entries[x.c + '.t'];
      const label = `${o.med} · ${dayDate(C.S, +d)} · ${o.slots[+s].t}`;
      used.add(x.c + '.gc'); used.add(x.c + '.t'); used.add(x.c + '.dose');
      if (x.do === 'sign') {
        if (!gc || gc.code || !gc.giv) res(false, `${label}: should be signed as given${gc && gc.code ? ` — you wrote the code ${gc.code}` : ' — the box is empty'}.`, [x.c + '.gc']);
        else if (gc.giv !== R.you) res(false, `${label}: the “given by” initials must be yours (${R.you}).`, [x.c + '.gc']);
        else if (gc.chk !== R.rn) res(false, `${label}: given ✓, but ${gc.chk ? `the check initials (${gc.chk}) should be your RN’s` : 'the check initials are missing'} — a student’s dose carries the RN’s (${R.rn}).`, [x.c + '.gc']);
        else if (!near(t)) res(false, `${label}: signed ✓, but record the actual time given (24-hour clock, within 30 minutes of ${at.t}).`, [x.c + '.t']);
        else if (x.dose && !x.dose.map(q => q.replace(/\s/g, '').toLowerCase()).includes(txt(entries[x.c + '.dose']).replace(/\s/g, '').toLowerCase()))
          res(false, `${label}: signed ✓, but it is a variable dose — write the dose you gave (${x.dose[0]}) in the Dose column.`, [x.c + '.dose']);
        else if (x.dose) res(true, `${label}: given, ${txt(entries[x.c + '.dose'])}, signed ${R.you}/${R.rn} at ${txt(t)}.`, [x.c + '.gc']);
        else res(true, `${label}: given, signed ${R.you}/${R.rn} at ${txt(t)}.`, [x.c + '.gc']);
      } else {
        if (gc && gc.code === x.code) res(true, `${label}: not given — ${x.code} (${CODES[x.code]}).${x.why ? ' ' + x.why : ''}`, [x.c + '.gc']);
        else res(false, `${label}: should be ${x.code} (${CODES[x.code]})${gc ? (gc.code ? ` — you wrote ${gc.code}` : ' — you signed it as given') : ' — the box is empty'}.${x.why ? ' ' + x.why : ''}`, [x.c + '.gc']);
      }
    } else if (x.do === 'prn') {
      const o = C.prn.find(p => p.L === x.L), j = o.rec.length, base = `prn.${x.L}.${j}`;
      ['date', 'time', 'dose', 'route', 'gc'].forEach(f => used.add(`${base}.${f}`));
      const e = f => entries[`${base}.${f}`], gc = e('gc') || {};
      const miss = [];
      if (txt(e('date')) !== date) miss.push(`date ${date}`);
      if (!near(e('time'))) miss.push(`time (~${at.t})`);
      if (!x.dose.map(s => s.replace(/\s/g, '').toLowerCase()).includes(txt(e('dose')).replace(/\s/g, '').toLowerCase())) miss.push(`dose ${x.dose[0]}`);
      if (txt(e('route')).toUpperCase() !== x.route) miss.push(`route ${x.route}`);
      if (gc.giv !== R.you || gc.chk !== R.rn) miss.push(`initials ${R.you}/${R.rn}`);
      res(!miss.length, miss.length ? `${o.med} PRN: the next record line (line ${j + 1}) needs ${miss.join(', ')}.` : `${o.med} PRN: recorded on line ${j + 1} — ${date} ${txt(e('time'))}, ${txt(e('dose'))} ${txt(e('route'))}, ${R.you}/${R.rn}.`, [`${base}.time`]);
    } else if (x.do === 'once') {
      const b = `once.${x.i}`, o = C.once[x.i], gc = entries[b + '.gc'] || {}, dt = txt(entries[b + '.dosedt']);
      used.add(b + '.gc'); used.add(b + '.dosedt');
      const okDt = dt.startsWith(date) && near(dt.slice(date.length).trim());
      const miss = [...(okDt ? [] : [`date & time of dose (${date} ~${at.t})`]), ...(gc.giv === R.you && gc.chk === R.rn ? [] : [`given by ${R.you} / checked by ${R.rn}`])];
      res(!miss.length, miss.length ? `${o.med} once only: needs ${miss.join(' and ')}.` : `${o.med} once only: given ${dt}, ${R.you}/${R.rn}.`, [b + '.dosedt']);
    } else if (x.do === 'fluid') {
      const b = `fl.${x.i}`, f = C.fluids[x.i], gc = entries[b + '.gc'] || {};
      ['astart', 'gc'].forEach(k => used.add(`${b}.${k}`));
      const miss = [...(near(entries[b + '.astart']) ? [] : [`actual commencing time (~${at.t})`]), ...(gc.giv === R.you ? [] : [`commenced by ${R.you}`]), ...(gc.chk === R.rn ? [] : [`checked by ${R.rn}`])];
      res(!miss.length, miss.length ? `${f.fluid}: needs ${miss.join(', ')}.` : `${f.fluid}: started ${txt(entries[b + '.astart'])} by ${R.you}, checked ${R.rn}.`, [b + '.astart']);
    } else if (x.do === 'fluidend') {
      const b = `fl.${x.i}`, f = C.fluids[x.i];
      ['tend', 'avol'].forEach(k => used.add(`${b}.${k}`));
      const vol = txt(entries[b + '.avol']).replace(/\s*mL$/i, '');
      const miss = [...(near(entries[b + '.tend']) ? [] : [`completion time (~${at.t})`]), ...(vol === String(x.vol) ? [] : [`actual volume (${x.vol} mL)`])];
      res(!miss.length, miss.length ? `${f.fluid} (line ${x.i + 1}) has finished: record ${miss.join(' and ')}.` : `${f.fluid}: completed ${txt(entries[b + '.tend'])}, ${x.vol} mL in.`, [b + '.tend']);
    } else if (x.do === 'reg') {
      const i = (C.S.nurses || []).length, b = `siga.${i}`;
      ['name', 'init', 'reg'].forEach(k => used.add(`${b}.${k}`));
      const okI = txt(entries[b + '.init']) === R.you, okN = txt(entries[b + '.name']).length >= 3;
      res(okI && okN, okI && okN ? `Sample Initials register: you are on it (${R.you}).` : `Sample Initials register: add your name & designation and your initials (${R.you}) on the next free line — everyone who signs the chart must.`, [b + '.init']);
    } else if (x.do === 'rn') {
      const pre = x.c ? x.c + '.' : `prn.${x.L}.`, hits = Object.keys(entries).filter(k => k.startsWith(pre) && !used.has(k));
      hits.forEach(k => used.add(k));
      res(!hits.length, hits.length ? `${x.what}: leave it for your RN to sign — ${x.why}` : `${x.what}: left for your RN to sign — ${x.why}`, hits);
    } else if (x.do === 'none') {
      const hits = Object.keys(entries).filter(k => k.startsWith(x.c + '.') && txt(JSON.stringify(entries[k])) !== '' && !used.has(k));
      hits.forEach(k => used.add(k));
      res(!hits.length, hits.length ? `Nothing should be written for ${x.what}: ${x.why}` : `${x.what}: correctly left alone — ${x.why}`, hits.length ? hits : []);
    }
  }
  for (const k of Object.keys(entries)) if (!used.has(k)) res(false, `You wrote in a box this round did not need: ${cellLabel(C, k)}.`, [k]);
  return out;
}

/* a cell described in words, for feedback */
export function cellLabel(C, id) {
  let m;
  if ((m = /^reg\.([A-Z]{1,2})\.d(\d)\.s(\d)\.(\w+)$/.exec(id))) { const o = C.reg.find(r => r.L === m[1]); return `Regular ${m[1]}${o ? ' (' + o.med + ')' : ''} · ${dayDate(C.S, +m[2])} · ${o && o.slots[+m[3]] ? o.slots[+m[3]].t : PRINTED[+m[3]]} line`; }
  if ((m = /^prn\.([A-Z])\.(\d+)\.(\w+)$/.exec(id))) { const o = C.prn.find(r => r.L === m[1]); return `PRN ${m[1]}${o ? ' (' + o.med + ')' : ''} · record line ${+m[2] + 1}`; }
  if ((m = /^once\.(\d)\./.exec(id))) return `Once Only order ${+m[1] + 1}`;
  if ((m = /^fl\.(\d+)\./.exec(id))) return `IV fluids line ${+m[1] + 1}`;
  if ((m = /^siga\.(\d+)\./.exec(id))) return `Sample Initials register line ${+m[1] + 1}`;
  return id;
}

/* ── a round's right answer, three ways ── */
const regCell = c => { const m = /^reg\.([A-Z]{1,2})\.d(\d)\.s(\d)$/.exec(c); return m && { L: m[1], d: +m[2], s: +m[3] }; };

/* as tap-mode entries — what a perfect student would have written (the build proves checkRound passes it) */
export function modelEntries(C, R) {
  const at = parseAt(R.at), date = dayDate(C.S, at.day), E = {}, gc = { giv: R.you, chk: R.rn };
  for (const x of R.expect) {
    const t = x.t || at.t;
    if (x.do === 'sign') { E[x.c + '.t'] = t; E[x.c + '.gc'] = gc; if (x.dose) E[x.c + '.dose'] = x.dose[0]; }
    else if (x.do === 'code') E[x.c + '.gc'] = { code: x.code };
    else if (x.do === 'prn') { const b = `prn.${x.L}.${C.prn.find(p => p.L === x.L).rec.length}`; Object.assign(E, { [b + '.date']: date, [b + '.time']: t, [b + '.dose']: x.dose[0], [b + '.route']: x.route, [b + '.gc']: gc }); }
    else if (x.do === 'once') { E[`once.${x.i}.dosedt`] = `${date} ${t}`; E[`once.${x.i}.gc`] = gc; }
    else if (x.do === 'fluid') { E[`fl.${x.i}.astart`] = t; E[`fl.${x.i}.gc`] = gc; }
    else if (x.do === 'fluidend') { E[`fl.${x.i}.tend`] = t; E[`fl.${x.i}.avol`] = String(x.vol); }
    else if (x.do === 'reg') { const i = (C.S.nurses || []).length; E[`siga.${i}.name`] = R.name; E[`siga.${i}.init`] = R.you; }
  }
  return E;
}

/* as the scenario after the round — the next round, and the next set of questions, start from a correct chart */
export function applyRound(S, R) {
  S = JSON.parse(JSON.stringify(S));
  const at = parseAt(R.at);
  for (const x of R.expect) {
    const t = x.t || at.t;
    if (x.do === 'sign' || x.do === 'code') {
      const c = regCell(x.c), o = S.regular.find(r => r.L === c.L), slotT = slotsFor(o.times)[c.s].t;
      o.given = { ...(o.given || {}), [`${c.d}@${slotT}`]: x.do === 'sign' ? `${t} ${R.you}/${R.rn}${x.dose ? ' dose=' + x.dose[0].replace(/\s/g, '') : ''}` : x.code };
    } else if (x.do === 'rn' && x.c) {
      const c = regCell(x.c), o = S.regular.find(r => r.L === c.L), slotT = slotsFor(o.times)[c.s].t;
      o.given = { ...(o.given || {}), [`${c.d}@${slotT}`]: `${t} ${R.rn}` };
    } else if (x.do === 'rn') { const o = S.prn.find(p => p.L === x.L); o.given = [...(o.given || []), `${at.day}@${t} ${x.dose[0].replace(/\s/g, '')} ${x.route} ${R.rn}`]; }
    else if (x.do === 'prn') { const o = S.prn.find(p => p.L === x.L); o.given = [...(o.given || []), `${at.day}@${t} ${x.dose[0].replace(/\s/g, '')} ${x.route} ${R.you}/${R.rn}`]; }
    else if (x.do === 'once') S.once[x.i].given = { at: `${at.day}@${t}`, giv: R.you, chk: R.rn };
    else if (x.do === 'fluid') S.fluids[x.i].started = { at: `${at.day}@${t}`, by: R.you, chk: R.rn };
    else if (x.do === 'fluidend') S.fluids[x.i].done = { at: `${at.day}@${t}`, vol: x.vol };
    else if (x.do === 'reg') S.nurses = [...(S.nurses || []), { name: R.name, init: R.you, reg: '' }];
  }
  /* the chart's clock moves to the round's last entry, so everything written in it shows */
  const last = Math.max(at.m, ...R.expect.filter(x => x.t).map(x => abs(at.day, x.t)));
  S.now = `${Math.floor(last / 1440) + 1}@${hhmm(last)}`; S.stage = (S.stage || 0) + 1;
  return S;
}

/* as boxes, for handwriting: which boxes must get ink, which may, and the entry a marker would expect to read */
const PART = { tend: 'Completion time', avol: 'Actual vol.', t: 'Time', dose: 'Dose', gc: 'Giv/Chck', date: 'Date', time: 'Time', route: 'Route', dosedt: 'Date & time of dose', astart: 'Actual commencing time', name: 'Name & designation', init: 'Initial' };
export function roundKey(C, R) {
  const at = parseAt(R.at), date = dayDate(C.S, at.day), out = [], who = `${R.you}/${R.rn}`;
  for (const x of R.expect) {
    const t = x.t || at.t;
    if (x.do === 'sign' || x.do === 'code') {
      const c = regCell(x.c), o = C.reg.find(r => r.L === c.L), label = `${o.med} · ${dayDate(C.S, c.d)} · ${o.slots[c.s].t} line`;
      out.push(x.do === 'sign' ? { label, need: [x.c + '.t', x.c + '.gc', ...(x.dose ? [x.c + '.dose'] : [])], may: x.dose ? [] : [x.c + '.dose'], model: `Time ${t}${x.dose ? ' · Dose ' + x.dose[0] : ''} · Giv/Chck ${who}` }
        : { label, need: [x.c + '.gc'], may: [x.c + '.t'], model: `${x.code} — ${CODES[x.code]}` });
    } else if (x.do === 'prn') {
      const o = C.prn.find(p => p.L === x.L), j = o.rec.length, b = `prn.${x.L}.${j}`;
      out.push({ label: `${o.med} PRN — record line ${j + 1}`, need: ['date', 'time', 'dose', 'route', 'gc'].map(f => `${b}.${f}`), model: `${date} · ${t} · ${x.dose[0]} · ${x.route} · ${who}` });
    } else if (x.do === 'once') out.push({ label: `${C.once[x.i].med} once only`, need: [`once.${x.i}.dosedt`, `once.${x.i}.gc`], may: [`once.${x.i}.tstart`, `once.${x.i}.tend`], model: `${date} ${t} · given ${R.you} / checked ${R.rn}` });
    else if (x.do === 'fluid') out.push({ label: `${C.fluids[x.i].fluid} (IV fluids line ${x.i + 1})`, need: [`fl.${x.i}.astart`, `fl.${x.i}.gc`], model: `${t} · commenced ${R.you} / checked ${R.rn}` });
    else if (x.do === 'fluidend') out.push({ label: `${C.fluids[x.i].fluid} (IV fluids line ${x.i + 1}) finished`, need: [`fl.${x.i}.tend`, `fl.${x.i}.avol`], model: `Completion: ${t} · ${x.vol} mL` });
    else if (x.do === 'reg') { const i = (C.S.nurses || []).length; out.push({ label: 'Sample Initials register', need: [`siga.${i}.name`, `siga.${i}.init`], may: [`siga.${i}.reg`], model: `${R.name} · ${R.you}` }); }
    else if (x.do === 'none') out.push({ label: x.what, none: x.c + '.', why: x.why, model: 'nothing' });
    else if (x.do === 'rn') out.push({ label: x.what, none: x.c ? x.c + '.' : `prn.${x.L}.`, why: x.why, model: 'nothing — your RN signs' });
  }
  return out;
}
/* handwriting, marked for WHERE: inked = the cells the strokes landed in (ink.mjs strokeCell). What was written is
   the student's to compare against the model entry — the page asks them. */
export function checkInk(C, R, inked) {
  const key = roundKey(C, R), out = [], allowed = new Set();
  const part = id => PART[id.split('.').pop()] || id.split('.').pop();
  for (const k of key) {
    if (k.none) {
      const hits = [...inked].filter(id => id.startsWith(k.none));
      out.push({ ok: !hits.length, msg: hits.length ? `Nothing should be written for ${k.label}: ${k.why}` : `${k.label}: correctly left alone — ${k.why}`, cells: hits, k });
      continue;
    }
    k.need.forEach(id => allowed.add(id)); (k.may || []).forEach(id => allowed.add(id));
    const miss = k.need.filter(id => !inked.has(id));
    out.push({ ok: !miss.length, msg: miss.length ? `${k.label}: nothing written in ${miss.map(part).join(', ')}.` : `${k.label}: ink in the right boxes.`, cells: k.need, k });
  }
  for (const id of inked) if (!allowed.has(id) && !key.some(k => k.none && id.startsWith(k.none))) out.push({ ok: false, msg: `You wrote in a box this round did not need: ${cellLabel(C, id)}.`, cells: [id] });
  return out;
}
