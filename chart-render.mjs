/* Chart Sim's renderer: the NZ 8-Day National Medication Chart (NMC8D, 2012 edition) redrawn as SVG, page by page,
   from the chart itself (the booklet's pages 1–12). Pure functions, no DOM: build-chart.mjs inlines this file into
   chart.html (with `export ` stripped) and imports it to prove every cell a scenario writes to exists.

   layout(id) → { id, w, h, form, cells, blocks }
     form    the printed chart (boxes, labels, tints) as an SVG string, in page units
     cells   every box a hand could write in: {id, x, y, w, h, k, n} — k is how an entry is drawn ('t' handwriting,
             'ty' typed label, 'm' medicine in block capitals, 'x' tick box, 'gc' Giv/Chck diagonal, 'sl' circle-or-time,
             'dt' a date heading), n the name printed on it. Because every rectangle is known, a tap and a pen stroke are
             both placed by arithmetic, never by guessing from the screen.
     blocks  order outlines, for crossing a ceased order through
   entries(pg, V, cls) → the written entries (V: cell id → value, as compile() makes it) as an SVG string */

export const PAGES = [
  { id: 'front', n: 'Front' }, { id: 'once', n: 'Once only' }, { id: 'prn', n: 'PRN' },
  { id: 'reg', n: 'Regular' }, { id: 'fl', n: 'IV fluids' }, { id: 'key', n: 'Key' },
];
export const REG_LETTERS = ['I', 'J', 'K', 'L', 'M', 'N', 'O'];
export const PRN_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const TIMES = ['0600', '0800', '1400', '1800', '2200'];

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const n1 = v => Math.round(v * 10) / 10;
const RED = '#d9363e', PINK = '#e9a3ab', LINE = '#4a4a4a', GREY = '#9a9a9a';

function page(id, w, h) {
  const f = [], cells = [], blocks = {};
  const p = {
    id, w, h, f, cells, blocks,
    rect(x, y, w, h, o = {}) { f.push(`<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="${o.fill || 'none'}" stroke="${o.stroke || LINE}" stroke-width="${o.sw ?? 0.6}"${o.rx ? ` rx="${o.rx}"` : ''}/>`); },
    fill(x, y, w, h, fill) { f.push(`<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="${fill}"/>`); },
    line(x1, y1, x2, y2, o = {}) { f.push(`<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" stroke="${o.stroke || LINE}" stroke-width="${o.sw ?? 0.6}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`); },
    /* printed text; '\n' splits lines */
    text(x, y, s, o = {}) {
      const size = o.size || 6.2, lines = String(s).split('\n'), lh = o.lh || size * 1.15;
      const at = `x="${n1(x)}" y="${n1(y)}" font-size="${size}"${o.bold ? ' font-weight="700"' : ''}${o.italic ? ' font-style="italic"' : ''}${o.fill ? ` fill="${o.fill}"` : ''}${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.rot ? ` transform="rotate(${o.rot} ${n1(x)} ${n1(y)})"` : ''}`;
      if (lines.length === 1) f.push(`<text ${at}>${esc(s)}</text>`);
      else f.push(`<text ${at}>${lines.map((l, i) => `<tspan x="${n1(x)}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('')}</text>`);
    },
    cell(id, x, y, w, h, k = 't', n = '', o = {}) { cells.push({ id, x: n1(x), y: n1(y), w: n1(w), h: n1(h), k, n, ...o }); },
    /* a labelled box: the printed name top-left, the whole box writable */
    box(x, y, w, h, label, id, o = {}) {
      p.rect(x, y, w, h, { fill: o.fill, stroke: o.stroke, sw: o.sw });
      if (label) p.text(x + 2.5, y + 7.5, label, { size: o.ls || 6.2, bold: o.lb });
      if (o.sub) p.text(x + 2.5, y + 13, o.sub, { size: 4.4, fill: '#666' });
      if (id) p.cell(id, x, y, w, o.ch || h, o.k || 't', o.n || label, { lab: !!label, al: o.al });
    },
    tick(id, x, y, s, n) { p.rect(x, y, s, s, { fill: '#fff', stroke: '#333', sw: 0.7 }); p.cell(id, x - 1, y - 1, s + 2, s + 2, 'x', n); },
    under(id, x, y, w, n, o = {}) { p.line(x, y, x + w, y, { stroke: '#555', sw: 0.5, dash: o.dash }); p.cell(id, x, y - 11, w, 12, o.k || 't', n); },
  };
  return p;
}

/* the ruler printed along every Medicine line, and the ⌐•¬ decimal guide in every Dose box */
function ruler(p, x, y, w, h) {
  const by = y + h - 4;
  p.line(x + 6, by, x + w - 6, by, { sw: 0.7 });
  for (let tx = x + 12, i = 0; tx < x + w - 8; tx += 21, i++) p.line(tx, by, tx, by - (i % 4 === 0 ? 5 : 3), { sw: 0.7 });
}
function decimal(p, x, y, w, h) {
  const by = y + h - 4, mid = x + w / 2;
  p.line(x + 4, by, mid - 4, by, { sw: 0.5 }); p.line(mid - 4, by, mid - 4, by - 3, { sw: 0.5 });
  p.line(mid + 4, by, x + w - 4, by, { sw: 0.5 }); p.line(mid + 4, by, mid + 4, by - 3, { sw: 0.5 });
  p.f.push(`<circle cx="${n1(mid)}" cy="${n1(by - 2)}" r="1.1" fill="#222"/>`);
}
function gcBox(p, id, x, y, w, h, o = {}) {
  p.rect(x, y, w, h, { fill: o.fill });
  p.line(x, y + h, x + w, y, { sw: 0.5 });
  if (o.labels) { p.text(x + 2, y + 7, o.labels[0], { size: 5 }); p.text(x + 2, y + h - 2.5, o.labels[1], { size: 5 }); }
  p.cell(id, x, y, w, h, 'gc', o.n || 'Giv/Chck');
}
function strip(p, x, fill, label, o = {}) {
  p.fill(x, 0, 18, p.h, fill);
  if (label) p.text(x + (o.right ? 6 : 12), 14, label, { size: 7, bold: true, rot: 90, fill: o.fg || '#222' });
}
function noWrite(p, x, cy) { p.text(x, cy, 'DO NOT WRITE IN THIS AREA', { size: 9, bold: true, fill: '#8a8a8a', rot: -90, anchor: 'middle' }); }
function ptLabel(p, x, y, pre) {
  const c = (k, cx, cy, w, n) => p.under(`${pre}pt.${k}`, cx, cy, w, n, { k: 'ty' });
  p.text(x, y, 'Family Name:', { size: 7.5 }); c('family', x + 52, y + 1, 240, 'Family name');
  p.text(x, y + 18, 'Given Name:', { size: 7.5 }); c('given', x + 48, y + 19, 150, 'Given name');
  p.text(x + 206, y + 18, 'Gender:', { size: 7.5 }); c('gender', x + 236, y + 19, 56, 'Gender');
  p.text(x + 66, y + 38, 'AFFIX PATIENT LABEL HERE', { size: 10, bold: true, italic: true, fill: '#777' });
  p.text(x, y + 58, 'Date of Birth:', { size: 7.5 }); c('dob', x + 52, y + 59, 110, 'Date of birth');
  p.text(x + 176, y + 58, 'NHI#:', { size: 7.5 }); c('nhi', x + 198, y + 59, 94, 'NHI number');
  if (pre) for (const k of ['family', 'given', 'gender', 'dob', 'nhi']) p.cells.find(q => q.id === `${pre}pt.${k}`).src = 'pt.' + k;
}

/* ── page 1: the front ── */
function front() {
  const p = page('front', 640, 812);
  p.fill(0, 0, 22, p.h, '#e6e6e6'); noWrite(p, 15, 380);
  p.text(64, 34, '8 Day National Medication Chart', { size: 15, bold: true });
  p.rect(64, 46, 190, 44, { stroke: RED, sw: 1 });
  p.text(72, 73, 'Chart', { size: 11 }); p.box(108, 53, 50, 30, '', 'chart.no', { fill: '#fff', al: 'c', n: 'Chart number' });
  p.text(164, 73, 'of', { size: 11 }); p.box(180, 53, 62, 30, '', 'chart.of', { fill: '#fff', al: 'c', n: 'Number of charts' });
  p.rect(64, 98, 190, 40, { stroke: RED, sw: 1 });
  p.text(72, 124, 'Date Recharted', { size: 11 }); p.under('recharted', 170, 126, 76, 'Date recharted');
  p.text(176, 133, 'Day   Month   Year', { size: 4.6, fill: '#555' });
  ptLabel(p, 276, 58, '');
  p.text(276, 136, 'Prescriber to write Patient’s name and NHI:', { size: 7, bold: true });
  p.line(276, 148, 620, 148, { sw: 0.5 });
  /* allergies and adverse reactions */
  for (const [k, x, title, border] of [['alg', 64, 'Allergies', RED], ['adr', 350, 'Adverse Reactions', '#666']]) {
    const y = 158, w = 270;
    p.fill(x, y, w, 196, '#fdf3a0'); p.fill(x, y, w, 17, '#f0b323');
    p.text(x + 5, y + 12.5, title, { size: 10, bold: true });
    p.text(x + w - 32, y + 12, 'No', { size: 7.5, bold: true }); p.tick(k + '.none', x + w - 17, y + 3, 11, `${title}: No`);
    p.text(x + 3, y + 24, k === 'alg' ? 'Medication / Other' : 'Medication', { size: 5.8, bold: true }); p.text(x + 150, y + 24, 'Reaction', { size: 5.8, bold: true });
    for (let i = 0; i < 4; i++) {
      const ry = y + 27 + i * 20;
      p.line(x, ry + 20, x + w, ry + 20, { sw: 0.5 });
      p.cell(`${k}.${i}.med`, x, ry, 146, 20, 'm', `${title} — medicine ${i + 1}`); p.cell(`${k}.${i}.rx`, x + 146, ry, 124, 20, 't', `${title} — reaction ${i + 1}`);
    }
    p.line(x + 146, y + 20, x + 146, y + 107, { sw: 0.5, dash: '1.5 1.5' });
    p.line(x, y + 127, x + w, y + 127, { sw: 0.6 });
    p.text(x + 3, y + 114, 'Signature', { size: 5.8, bold: true }); p.text(x + 170, y + 114, 'Date', { size: 5.8, bold: true });
    p.cell(`${k}.sig`, x, y + 107, 166, 20, 't', `${title} — signature`, { lab: true }); p.cell(`${k}.date`, x + 166, y + 107, 104, 20, 't', `${title} — date`, { lab: true });
    p.text(x + 3, y + 134, 'New on this admission', { size: 5.8, bold: true });
    p.cell(`${k}.new`, x, y + 127, w, 49, 't', `${title} — new on this admission`, { lab: true });
    p.line(x, y + 152, x + w, y + 152, { sw: 0.5 }); p.line(x, y + 176, x + w, y + 176, { sw: 0.6 });
    p.text(x + 3, y + 183, 'Signature', { size: 5.8, bold: true }); p.text(x + 170, y + 183, 'Date', { size: 5.8, bold: true });
    p.cell(`${k}.newsig`, x, y + 176, 166, 20, 't', `${title} (new) — signature`, { lab: true }); p.cell(`${k}.newdate`, x + 166, y + 176, 104, 20, 't', `${title} (new) — date`, { lab: true });
    p.rect(x, y, w, 196, { stroke: border, sw: 1.2 });
  }
  /* special care, supplementary charts */
  const panel = (x, fill, stroke, title, k, items) => {
    const y = 364, w = 270;
    p.rect(x, y, w, 76, { fill, stroke, sw: 1 });
    p.text(x + 5, y + 13, title, { size: 10, bold: true });
    p.text(x + w - 32, y + 12, 'No', { size: 7.5, bold: true }); p.tick(k + '.none', x + w - 17, y + 3, 11, `${title}: No`);
    items.forEach(([id, label], i) => {
      const cx = x + 8 + (i % 2) * 150, cy = y + 24 + Math.floor(i / 2) * 17;
      p.tick(`${k}.${id}`, cx, cy, 10, `${title}: ${label}`); p.text(cx + 16, cy + 8, label, { size: 7 });
    });
    p.tick(`${k}.otherx`, x + 8, y + 58, 10, `${title}: Other`); p.text(x + 24, y + 66, 'Other:', { size: 7 });
    p.under(`${k}.other`, x + 50, y + 68, w - 58, `${title}: Other`);
  };
  panel(64, '#bad4ee', '#3f7cc0', 'Special Care Required', 'sc', [['renal', 'Renal impairment'], ['preg', 'Pregnancy'], ['hep', 'Hepatic impairment'], ['bf', 'Breastfeeding']]);
  panel(350, '#e4e4e4', '#8a8a8a', 'Supplementary Charts', 'sup', [['insulin', 'Diabetic/Insulin'], ['analg', 'Specialised analgesia'], ['heparin', 'Heparin'], ['warfarin', 'Warfarin']]);
  /* the two registers */
  p.text(64, 464, 'Sample Signature', { size: 10 }); p.text(162, 464, 'Prescribers', { size: 10 });
  p.text(350, 464, 'Sample Initials', { size: 10 }); p.text(436, 464, 'Administrators/Others', { size: 10 });
  const reg = (x, cols, pre, who) => {
    let cx = x; const y = 470;
    for (const [lab, w] of cols) { p.rect(cx, y, w, 22); p.text(cx + 3, y + 9, lab, { size: 6.4 }); if (lab.startsWith('NAME')) p.text(cx + 3, y + 16, '(family & given)', { size: 4.2 }); cx += w; }
    for (let i = 0; i < 16; i++) {
      let rx = x; const ry = y + 22 + i * 18.5;
      for (const [lab, w, k] of cols) { p.rect(rx, ry, w, 18.5); p.cell(`${pre}.${i}.${k}`, rx, ry, w, 18.5, 't', `${who} register, line ${i + 1} — ${lab.toLowerCase()}`); rx += w; }
    }
  };
  reg(64, [['NAME & DESIGNATION', 132, 'name'], ['SIGNATURE', 88, 'sig'], ['REG. No.', 56, 'reg']], 'sigp', 'Prescribers’ signature');
  reg(346, [['NAME & DESIGNATION', 150, 'name'], ['INITIAL', 54, 'init'], ['REG. No.', 70, 'reg']], 'siga', 'Sample initials');
  p.text(64, 804, 'NMC8D September 2012', { size: 5.5 }); p.text(620, 804, '1', { size: 6, anchor: 'end' });
  return p;
}

/* an order block's top two rows, shared by Once Only, PRN and Regular */
function medRow(p, id, x, y, w, fill) {
  p.rect(x, y, w, 30, { fill }); p.text(x + 3, y + 8, 'Medicine', { size: 6.2, bold: true });
  ruler(p, x, y, w, 30); p.cell(id, x, y, w, 30, 'm', 'Medicine');
}
function doseBox(p, id, x, y, w, h, fill) { p.box(x, y, w, h, 'Dose', id, { fill, n: 'Dose', k: 'ds' }); decimal(p, x, y, w, h); }

/* ── pages 2–3: once only, verbal orders, oxygen ── */
function once() {
  const p = page('once', 640, 912);
  p.fill(0, 0, 20, p.h, '#161616'); p.text(8, 14, 'ONCE ONLY / VERBAL ORDERS / OXYGEN', { size: 7, bold: true, rot: 90, fill: '#fff' });
  /* the allergy summary every page carries */
  p.fill(40, 20, 250, 98, '#fdf3a0'); p.fill(40, 20, 250, 16, '#f0b323');
  for (const [k, x, t] of [['alg2', 40, 'Allergies'], ['adr2', 165, 'Adverse Reactions']]) {
    p.text(x + 4, 31, t, { size: 6.8, bold: true }); p.text(x + 100, 31, 'No', { size: 6.2 }); p.tick(k + '.no', x + 110, 23, 10, `${t} (page summary): No`);
    p.text(x + 4, 50, 'Yes', { size: 6.2 }); p.tick(k + '.yes', x + 18, 42, 10, `${t} (page summary): Yes`); p.text(x + 34, 50, 'List medicine(s):', { size: 6.2 });
    p.cell(k + '.list', x, 53, 125, 65, 't', `${t} (page summary): list`);
  }
  p.line(165, 20, 165, 138, { stroke: RED, sw: 1 });
  p.rect(40, 118, 125, 20, { fill: '#fdf3a0' }); p.text(43, 130, 'Refer to front page for details', { size: 5.8 });
  p.box(165, 118, 125, 20, 'Initials', 'alg2.init', { fill: '#fdf3a0', n: 'Initials (allergy summary)' });
  p.rect(40, 20, 250, 118, { stroke: RED, sw: 1.2 });
  ptLabel(p, 306, 32, 'once.');
  const wbox = (x, y, w, parts) => { p.rect(x, y, w, 18, { stroke: '#333' }); for (const [lab, id, lx, cw, n] of parts) { p.text(x + lx, y + 11.5, lab, { size: 5.4 }); if (id) p.cell(id, x + lx + (lab.length * 2.6), y, cw, 18, 't', n); } };
  wbox(306, 104, 158, [['Weight (kg)', 'wt.0', 3, 36, 'Weight (kg)'], ['Date', 'wt.0d', 78, 62, 'Weight — date']]);
  wbox(467, 104, 158, [['Weight (kg)', 'wt.1', 3, 36, 'Weight (kg), re-weighed'], ['Date', 'wt.1d', 78, 62, 'Re-weighed — date']]);
  wbox(306, 126, 124, [['Height (cm)', 'ht', 3, 30, 'Height (cm)'], ['Date', 'htd', 66, 44, 'Height — date']]);
  wbox(433, 126, 58, [['B.S.A (m²)', 'bsa', 3, 26, 'Body surface area']]);
  wbox(494, 126, 131, [['Gestational age at birth (wks)', 'ga', 3, 42, 'Gestational age at birth']]);
  p.text(40, 168, 'Once Only', { size: 15, bold: true });
  for (let i = 0; i < 4; i++) {
    const y = 176 + i * 94, x = 40, g = '#eef1ee';
    p.box(x, y, 36, 92, 'Date', `once.${i}.date`, { lb: true, ch: 42, n: 'Date' });
    medRow(p, `once.${i}.med`, 76, y, 507, g);
    doseBox(p, `once.${i}.dose`, 76, y + 30, 82, 30);
    p.box(158, y + 30, 38, 62, 'Units', `once.${i}.units`, { fill: g });
    p.box(196, y + 30, 44, 30, 'Route', `once.${i}.route`);
    p.box(240, y + 30, 86, 30, 'Dose calculation', `once.${i}.calc`, { sub: '(eg. mg/kg per dose)' });
    p.box(326, y + 30, 160, 30, 'Prescriber’s signature', `once.${i}.psig`);
    p.box(486, y + 30, 97, 30, 'Time commenced', `once.${i}.tstart`);
    p.box(76, y + 60, 82, 32, 'Dose range if needed', `once.${i}.range`);
    p.box(196, y + 60, 130, 32, 'Date & time of dose', `once.${i}.dosedt`);
    p.box(326, y + 60, 126, 32, 'Pharmacy & special instructions', `once.${i}.inst`);
    p.box(452, y + 60, 34, 32, 'Pharm', `once.${i}.pharm`);
    p.box(486, y + 60, 97, 32, 'Time completed', `once.${i}.tend`);
    gcBox(p, `once.${i}.gc`, 583, y, 42, 92, { labels: ['Given by', 'Checked by'], n: 'Given by / Checked by' });
    p.rect(x, y, 585, 92, { sw: 1 });
    p.blocks[`once.${i}`] = { x, y, w: 585, h: 92 };
  }
  p.text(40, 572, 'Verbal Orders', { size: 15, bold: true }); p.text(150, 572, '(must be signed as soon as possible or within 24 hours of order)', { size: 8.5 });
  for (let i = 0; i < 2; i++) {
    const y = 580 + i * 94, x = 40, g = '#eef1ee';
    p.box(x, y, 36, 92, 'Date\n& Time', `verb.${i}.dt`, { lb: true, ch: 42, n: 'Date & time of the order' });
    medRow(p, `verb.${i}.med`, 76, y, 507, g);
    doseBox(p, `verb.${i}.dose`, 76, y + 30, 82, 30);
    p.box(158, y + 30, 38, 62, 'Units', `verb.${i}.units`, { fill: g });
    p.box(196, y + 30, 40, 30, 'Route', `verb.${i}.route`);
    p.box(236, y + 30, 76, 30, 'Dose calculation', `verb.${i}.calc`, { sub: '(eg. mg/kg per dose)' });
    p.box(312, y + 30, 92, 30, 'Date & time of dose', `verb.${i}.dosedt`);
    p.box(404, y + 30, 82, 15, 'Initials: Nurse', `verb.${i}.nurse`, { n: 'Initials: nurse who took the order' });
    p.box(404, y + 45, 82, 15, 'Initials: Witness', `verb.${i}.witness`, { n: 'Initials: witness' });
    p.box(486, y + 30, 97, 15, 'Time commenced', `verb.${i}.tstart`);
    p.box(486, y + 45, 97, 15, 'Time completed', `verb.${i}.tend`);
    p.box(76, y + 60, 82, 32, 'Dose range if needed', `verb.${i}.range`);
    p.box(196, y + 60, 116, 32, 'Prescriber’s name', `verb.${i}.pname`);
    p.box(312, y + 60, 92, 32, 'Prescriber’s signature', `verb.${i}.psig`);
    p.box(404, y + 60, 146, 32, 'Pharmacy & Special Instructions', `verb.${i}.inst`);
    p.box(550, y + 60, 33, 32, 'Pharm', `verb.${i}.pharm`);
    gcBox(p, `verb.${i}.gc`, 583, y, 42, 92, { labels: ['Given by', 'Checked by'], n: 'Given by / Checked by' });
    p.rect(x, y, 585, 92, { sw: 1 });
  }
  p.text(40, 792, 'Oxygen Therapy & Medical Gases', { size: 13, bold: true });
  p.rect(352, 778, 273, 17, { fill: '#f4f7fb', stroke: '#8aa6c8' }); p.text(356, 789.5, 'Target Oxygen Saturation (%):', { size: 7 });
  p.cell('o2.target', 460, 778, 165, 17, 't', 'Target oxygen saturation (%)');
  const cols = [['START DATE', 'start', 100], ['DEVICE/DELIVERY', 'device', 160], ['FLOW RATE', 'flow', 100], ['SIGNATURE', 'sig', 120], ['STOP DATE', 'stop', 105]];
  let cx = 40;
  for (const [lab, , w] of cols) { p.rect(cx, 800, w, 14, { fill: '#bcd4ee' }); p.text(cx + 4, 810, lab, { size: 6.4 }); cx += w; }
  for (let i = 0; i < 5; i++) { cx = 40; for (const [lab, k, w] of cols) { p.rect(cx, 814 + i * 17, w, 17); p.cell(`o2.${i}.${k}`, cx, 814 + i * 17, w, 17, 't', `Oxygen line ${i + 1} — ${lab.toLowerCase()}`); cx += w; } }
  p.text(620, 906, '3', { size: 6, anchor: 'end' });
  return p;
}

/* ── pages 4–5: PRN orders facing their record ── */
function prn() {
  const p = page('prn', 1280, 812);
  strip(p, 0, '#e8812c', 'PRN'); strip(p, 1262, '#e8812c', 'PRN', { right: 1 });
  p.line(640, 0, 640, p.h, { stroke: '#bbb', dash: '3 3' });
  p.text(40, 34, 'As Required (PRN) Medicines', { size: 15, bold: true });
  const gx = 654, cols = [['Date', 'date', 34], ['Time', 'time', 28], ['Dose', 'dose', 30], ['Route', 'route', 26], ['Giv/Chck', 'gc', 32]];
  for (let g = 0; g < 4; g++) { let cx = gx + g * 150; for (const [lab, , w] of cols) { p.rect(cx, 30, w, 14, { fill: '#fbe6d4' }); p.text(cx + w / 2, 39.5, lab, { size: 5.4, anchor: 'middle', bold: lab === 'Date' }); cx += w; } }
  PRN_LETTERS.forEach((L, i) => {
    const y = 44 + i * 94, x = 40, fill = i % 2 ? '#fbe6d4' : '#fff';
    p.fill(x, y, 590, 92, fill);
    p.box(x, y, 36, 92, 'Date', `prn.${L}.date`, { lb: true, ch: 42, n: 'Date ordered' });
    p.text(58, y + 86, L, { size: 20, bold: true, fill: GREY, anchor: 'middle' });
    medRow(p, `prn.${L}.med`, 76, y, 554);
    doseBox(p, `prn.${L}.dose`, 76, y + 30, 84, 30);
    p.box(160, y + 30, 40, 62, 'Units', `prn.${L}.units`);
    p.box(200, y + 30, 52, 30, 'Route', `prn.${L}.route`);
    p.box(252, y + 30, 56, 30, 'Frequency', `prn.${L}.freq`);
    p.box(308, y + 30, 102, 30, 'Dose calculation', `prn.${L}.calc`, { sub: '(eg. mg/kg per dose)' });
    p.box(410, y + 30, 70, 30, 'Max dose/24hrs', `prn.${L}.max`, { stroke: PINK });
    p.box(480, y + 30, 150, 30, 'Prescriber’s signature', `prn.${L}.psig`);
    p.box(76, y + 60, 84, 32, 'Dose range if needed', `prn.${L}.range`);
    p.box(200, y + 60, 66, 32, 'Indication', `prn.${L}.ind`);
    p.box(266, y + 60, 144, 32, 'Pharmacy & special instructions', `prn.${L}.inst`);
    p.box(410, y + 60, 30, 32, 'Pharm', `prn.${L}.pharm`);
    p.box(440, y + 60, 190, 32, 'Sign, date and time to cancel', `prn.${L}.cancel`, { stroke: PINK });
    p.rect(x, y, 590, 92, { sw: 1 });
    p.blocks[`prn.${L}`] = { x: 76, y, w: 554, h: 92 };
    /* the record: 4 groups of 5 lines, filled down the first group, then the next */
    p.fill(gx, y, 600, 92, fill);
    for (let j = 0; j < 20; j++) {
      const g = Math.floor(j / 5), r = j % 5, ry = y + r * 18.4;
      let cx = gx + g * 150;
      for (const [lab, k, w] of cols) {
        if (k === 'gc') gcBox(p, `prn.${L}.${j}.gc`, cx, ry, w, 18.4, { n: `PRN ${L} record line ${j + 1} — Giv/Chck` });
        else { p.rect(cx, ry, w, 18.4); p.cell(`prn.${L}.${j}.${k}`, cx, ry, w, 18.4, 't', `PRN ${L} record line ${j + 1} — ${lab.toLowerCase()}`, { al: 'c' }); }
        cx += w;
      }
    }
    p.text(gx + 34 + 14, y + 62, L, { size: 16, bold: true, fill: GREY, anchor: 'middle' });
    p.rect(gx, y, 600, 92, { sw: 1 });
  });
  p.text(44, 806, '4', { size: 6 }); p.text(1250, 806, '5', { size: 6, anchor: 'end' });
  return p;
}

/* ── pages 6–7: VTE, regular orders facing their 8 days ── */
function reg() {
  const p = page('reg', 1280, 834);
  strip(p, 0, '#b8cde6', 'REGULAR 1'); strip(p, 1262, '#b8cde6', 'REGULAR 1', { right: 1 });
  p.line(640, 0, 640, p.h, { stroke: '#bbb', dash: '3 3' });
  p.text(40, 19, 'IF CHART IS TO BE SCANNED PLEASE ENTER PATIENT NAME:', { size: 8, bold: true, italic: true, fill: '#555' });
  p.under('scan.name', 312, 20, 200, 'Patient name (for scanning)'); p.text(518, 19, 'NHI:', { size: 8, bold: true, italic: true, fill: '#555' }); p.under('scan.nhi', 538, 20, 92, 'NHI (for scanning)');
  /* VTE */
  p.rect(40, 26, 590, 116, { stroke: RED, sw: 1 });
  p.text(46, 36, 'VENOUS THROMBOEMBOLISM (VTE) PREVENTION', { size: 7.2, bold: true, fill: RED });
  p.text(46, 45.5, 'Assess VTE risk on admission, again within 24 – 48 hours of admission, and periodically when/if the patient’s clinical condition changes significantly.', { size: 5.9 });
  p.text(46, 58, 'VTE risk assessed on admission', { size: 6.8, bold: true, fill: RED }); p.tick('vte.assessed', 158, 50, 10, 'VTE risk assessed on admission');
  p.text(186, 58, 'Date:', { size: 6.5 }); p.under('vte.date', 206, 59, 110, 'VTE assessment — date');
  p.text(356, 58, 'Prescriber’s signature:', { size: 6.5 }); p.under('vte.psig', 432, 59, 194, 'VTE assessment — prescriber’s signature');
  p.rect(46, 64, 578, 12); p.text(49, 72.5, 'VTE risk reassessed', { size: 5.8, bold: true, fill: RED });
  for (let i = 0; i < 3; i++) {
    const x = 122 + i * 167.3;
    p.line(x, 64, x, 76);
    p.text(x + 3, 72.5, 'Date:', { size: 5.8, bold: true }); p.cell(`vte.r${i}.date`, x + 22, 64, 52, 12, 't', `VTE reassessed (${i + 1}) — date`);
    p.text(x + 76, 72.5, 'Signature:', { size: 5.8, bold: true }); p.cell(`vte.r${i}.sig`, x + 110, 64, 57, 12, 't', `VTE reassessed (${i + 1}) — signature`);
  }
  p.text(46, 88, 'If NO VTE prophylaxis prescribed', { size: 6.6, bold: true, fill: RED }); p.text(170, 88, 'state reason why:', { size: 6.6, bold: true, fill: RED });
  p.text(46, 100, 'Low risk of VTE:', { size: 6.5 }); p.tick('vte.low', 102, 92, 9, 'No VTE prophylaxis: low risk');
  p.text(238, 100, 'High bleeding risk:', { size: 6.5 }); p.tick('vte.bleed', 302, 92, 9, 'No VTE prophylaxis: high bleeding risk');
  p.text(46, 112, 'Other:', { size: 6.5 }); p.line(68, 113, 318, 113, { dash: '1 1.5' }); p.line(46, 128, 318, 128, { dash: '1 1.5' });
  p.cell('vte.other', 68, 103, 250, 26, 't', 'No VTE prophylaxis: other reason');
  p.line(326, 80, 326, 138, { sw: 0.5 });
  p.text(334, 88, 'VTE prophylaxis prescribed:', { size: 6.6, bold: true, fill: RED });
  const yn = (y, lab, k) => { p.text(334, y, lab, { size: 6.5 }); p.text(560, y, 'Yes', { size: 6.5 }); p.tick(`vte.${k}.y`, 574, y - 8, 9, `${lab} Yes`); p.text(594, y, 'No', { size: 6.5 }); p.tick(`vte.${k}.n`, 606, y - 8, 9, `${lab} No`); };
  yn(99, 'Anticoagulation prescribed:', 'anticoag');
  p.text(334, 110, 'Mechanical VTE prophylaxis prescribed:', { size: 6.6, bold: true, fill: RED });
  yn(121, 'Graduated compression stockings:', 'stock'); yn(133, 'Intermittent pneumatic compression devices:', 'ipc');
  /* the orders */
  p.text(44, 164, 'Regular Medicine', { size: 15, bold: true });
  p.rect(556, 150, 74, 20); p.text(593, 162, 'Circle or actual time', { size: 5.6, anchor: 'middle' });
  const gx = 654, dayW = 75;
  for (let d = 1; d <= 8; d++) {
    const x = gx + (d - 1) * dayW;
    p.rect(x, 150, dayW, 11, { fill: '#e7edf6' }); p.text(x + 2, 158, 'Date', { size: 5.2 });
    p.cell(`reg.day${d}`, x + 16, 150, dayW - 16, 11, 'dt', `Date — day ${d} of the chart`);
    [['Time', 25], ['Dose', 21], ['Giv/Chck', 29]].reduce((cx, [lab, w]) => { p.rect(cx, 161, w, 11, { fill: '#e7edf6' }); p.text(cx + w / 2, 168.5, lab, { size: 4.8, anchor: 'middle' }); return cx + w; }, x);
  }
  REG_LETTERS.forEach((L, i) => {
    const y = 172 + i * 92, x = 40, fill = i % 2 ? '#e7edf6' : '#fff';
    p.fill(x, y, 590, 90, fill);
    p.box(x, y, 36, 90, 'Date', `reg.${L}.date`, { lb: true, ch: 42, n: 'Date ordered' });
    p.text(58, y + 84, L, { size: 20, bold: true, fill: GREY, anchor: 'middle' });
    medRow(p, `reg.${L}.med`, 76, y, 480);
    doseBox(p, `reg.${L}.dose`, 76, y + 30, 84, 28);
    p.box(160, y + 30, 40, 60, 'Units', `reg.${L}.units`);
    p.box(200, y + 30, 46, 28, 'Route', `reg.${L}.route`);
    p.box(246, y + 30, 50, 28, 'Frequency', `reg.${L}.freq`);
    p.box(296, y + 30, 84, 28, 'Dose calculation', `reg.${L}.calc`, { sub: '(eg. mg/kg per dose)' });
    p.box(380, y + 30, 176, 28, 'Prescriber’s signature', `reg.${L}.psig`);
    p.box(76, y + 58, 84, 32, 'Dose range if needed', `reg.${L}.range`);
    p.box(200, y + 58, 156, 32, 'Pharmacy & special instructions', `reg.${L}.inst`);
    p.box(356, y + 58, 30, 32, 'Pharm', `reg.${L}.pharm`);
    p.box(386, y + 58, 170, 32, 'Sign, date and time to cancel', `reg.${L}.cancel`, { stroke: PINK });
    for (let k = 0; k < 5; k++) {
      const ty = y + k * 18;
      p.rect(556, ty, 34, 18, { fill: '#fff' }); p.text(560, ty + 11.5, TIMES[k], { size: 6.2 }); p.rect(590, ty, 40, 18, { fill: '#fff' });
      p.cell(`reg.${L}.s${k}`, 556, ty, 74, 18, 'sl', `Time row ${TIMES[k]} (circle it, or write the actual time beside it)`);
    }
    p.rect(x, y, 590, 90, { sw: 1 });
    p.blocks[`reg.${L}`] = { x: 76, y, w: 480, h: 90 };
    /* 8 days × 5 time rows × Time · Dose · Giv/Chck */
    p.fill(gx, y, 8 * dayW, 90, fill);
    for (let k = 0; k < 5; k++) for (let d = 1; d <= 8; d++) {
      const cx = gx + (d - 1) * dayW, ty = y + k * 18, sh = d === 8 && k >= 3 ? '#c9d8ec' : null, id = `reg.${L}.d${d}.s${k}`;
      p.rect(cx, ty, 25, 18, { fill: sh }); p.cell(id + '.t', cx, ty, 25, 18, 't', 'Time given', { al: 'c' });
      p.rect(cx + 25, ty, 21, 18, { fill: sh }); p.cell(id + '.dose', cx + 25, ty, 21, 18, 't', 'Dose given (variable dose)', { al: 'c' });
      gcBox(p, id + '.gc', cx + 46, ty, 29, 18, { fill: sh, n: 'Giv/Chck — given by / checked by' });
    }
    for (let d = 1; d < 8; d++) p.line(gx + d * dayW, y, gx + d * dayW, y + 90, { sw: 0.9 });
    p.text(gx + 35.5, y + 62, L, { size: 16, bold: true, fill: GREY, anchor: 'middle' });
    p.rect(gx, y, 8 * dayW, 90, { sw: 1 });
    p.blocks[`reg.${L}.adm`] = { x: gx, y, w: 8 * dayW, h: 90, dayW };
  });
  p.text(gx + 7 * dayW + 64, 172 + 320, 'PRESCRIBER TO RE-WRITE MEDICATION CHART', { size: 15, bold: true, fill: '#c3cedd', rot: 90, anchor: 'middle' });
  ptLabel(p, 940, 40, 'reg.');
  p.text(44, 830, '6', { size: 6 }); p.text(1250, 830, '7', { size: 6, anchor: 'end' });
  return p;
}

/* ── page 12: IV and subcut fluids (a landscape page, drawn upright) ── */
function fluids() {
  const p = page('fl', 940, 424);
  p.rect(20, 14, 150, 92, { fill: '#fdf3a0', stroke: '#888' });
  p.text(95, 36, 'Allergy/\nAdverse Reaction\nInformation', { size: 9.5, bold: true, anchor: 'middle', lh: 12 });
  p.text(95, 92, 'Refer Front Page', { size: 7.5, bold: true, anchor: 'middle' });
  p.text(430, 50, 'INTRAVENOUS AND SUBCUTANEOUS FLUID', { size: 12, bold: true, anchor: 'middle' });
  p.text(430, 66, 'PRESCRIPTION AND INFUSION RECORD', { size: 12, bold: true, anchor: 'middle' });
  ptLabel(p, 632, 24, 'fl.');
  const cols = [['Date', 'date', 20, 58], ['Prescribed\nCommencing\nTime', 'time', 78, 54], ['Volume\n(mL)', 'vol', 132, 46], ['Intravenous and Subcutaneous Fluid and Additives', 'fluid', 178, 290],
    ['Route', 'route', 468, 32], ['Rate\n(mL / hr)', 'rate', 500, 52], ['Prescriber’s Signature', 'psig', 552, 130], ['Actual\nCommencing\nTime', 'astart', 682, 58],
    ['Commenced By\nChecked By', 'gc', 740, 62], ['Time', 'tend', 802, 52], ['Actual Vol.', 'avol', 854, 66]];
  for (const [lab, k, x, w] of cols) {
    const top = k === 'tend' || k === 'avol' ? 132 : 116;
    p.rect(x, top, w, 160 - top);
    p.text(x + w / 2, top + (k === 'fluid' || k === 'psig' || k === 'date' || k === 'route' ? 26 : 12), lab, { size: 6.4, anchor: 'middle', lh: 8 });
  }
  p.rect(802, 116, 118, 16); p.text(861, 127, 'Completion', { size: 6.4, anchor: 'middle' });
  for (let i = 0; i < 12; i++) {
    const y = 160 + i * 21, fill = i % 2 ? '#dedede' : '#fff';
    for (const [lab, k, x, w] of cols) {
      const name = `IV fluids line ${i + 1} — ${lab.replace(/\n/g, ' ').toLowerCase()}`;
      if (k === 'gc') gcBox(p, `fl.${i}.gc`, x, y, w, 21, { fill, n: `IV fluids line ${i + 1} — commenced by / checked by` });
      else { p.rect(x, y, w, 21, { fill }); p.cell(`fl.${i}.${k}`, x, y, w, 21, k === 'fluid' ? 'm' : 't', name, { al: k === 'fluid' || k === 'psig' ? '' : 'c' }); }
    }
  }
  p.rect(20, 116, 900, 160 - 116 + 12 * 21, { sw: 1 });
  p.text(24, 418, '12', { size: 6 });
  return p;
}

/* ── the key printed on page 11: instructions, recommended times, the not-given codes ── */
function key() {
  const p = page('key', 660, 214);
  const lines = [
    ['GENERAL INSTRUCTIONS', 1], ['1. Use indelible pen only to write on this chart.'], ['2. All users must complete the Sample Signature/Initial Register.'], ['3. Reg. No.   registration number.'],
    ['Prescriber’s Instructions', 1], ['1. Use approved or generic names only and prescribe using block capitals.'], ['2. Full signature.'],
    ['3. To stop a medication, enter the stop date, time, sign, and cross through order and administration.'], ['4. To alter therapy, stop the original order as per instruction 3 above, and prescribe on a new line.'],
    ['Administrator’s Instructions', 1], ['1. Record time of administration using 24-hour clock.'], ['2. For variable dose, record actual dose given.'], ['3. For variable route, record actual route used.'],
    ['4. If dose not given, record appropriate non-administration code.'], ['5. Giv/Chck   given by/checked by.'],
  ];
  lines.forEach(([t, b], i) => p.text(16, 16 + i * 12.6, t, { size: b ? 8 : 6.4, bold: !!b }));
  const tx = 348;
  p.rect(tx, 6, 178, 200, { stroke: '#555' });
  p.text(tx + 89, 17, 'RECOMMENDED', { size: 7.5, bold: true, anchor: 'middle' }); p.text(tx + 89, 26, 'ADMINISTRATION TIMES', { size: 7.5, bold: true, anchor: 'middle' });
  p.text(tx + 89, 35, 'GUIDELINES ONLY', { size: 6.5, anchor: 'middle' });
  const rows = [['Morning', 'Mane', ['0800']], ['Night', 'Nocte', ['', '1800 or 2000']], ['Twice\na day', 'BD', ['0800', '', '2000']], ['Three times\na day', 'TDS', ['0800', '1400', '2000']],
    ['Antibiotic\n8 hourly', 'q8h', ['0600', '1400', '2200']], ['Antibiotic\n6 hourly', 'q6h', ['0600', '1200', '1800', '2400']], ['Four times\na day', 'QID', ['0600', '1200', '1800', '2200']]];
  rows.forEach(([a, b, ts], i) => {
    const y = 40 + i * 23.5;
    p.rect(tx, y, 34, 23.5); p.text(tx + 2, y + (a.includes('\n') ? 9.5 : 14), a, { size: 5.2, lh: 6.2 });
    p.rect(tx + 34, y, 24, 23.5); p.text(tx + 46, y + 14, b, { size: 5.6, anchor: 'middle' });
    if (b === 'Nocte') { p.rect(tx + 58, y, 30, 23.5); p.rect(tx + 88, y, 30, 23.5); p.rect(tx + 118, y, 60, 23.5); p.text(tx + 148, y + 14, ts[1], { size: 5.8, anchor: 'middle' }); }
    else for (let c = 0; c < 4; c++) p.rect(tx + 58 + c * 30, y, 30, 23.5);
    if (b !== 'Nocte') ts.forEach((t, c) => { if (t) p.text(tx + 58 + c * 30 + 15, y + 14, t, { size: 5.8, anchor: 'middle' }); });
  });
  const cx = 534;
  p.rect(cx, 6, 120, 150, { stroke: '#555' });
  p.text(cx + 60, 18, 'NON-ADMINISTRATION', { size: 7.5, bold: true, anchor: 'middle' }); p.text(cx + 60, 27, 'CODES', { size: 7.5, bold: true, anchor: 'middle' });
  [['U', 'Patient unavailable'], ['SM', 'Self-medicating'], ['CP', 'Carer/Parent'], ['R', 'Patient refused'], ['D', 'Prescriber’s instructions'], ['N', 'Not administered']].forEach(([c, t], i) => {
    p.text(cx + 6, 44 + i * 15, c, { size: 7.5, bold: true }); p.text(cx + 24, 44 + i * 15, t, { size: 6.8 });
  });
  p.text(cx + 24, 44 + 5 * 15 + 10, '– document reason in notes', { size: 6.8 });
  return p;
}

const BUILD = { front, once, prn, reg, fl: fluids, key };
const CACHE = {};
export function layout(id) {
  if (!CACHE[id]) {
    const p = BUILD[id]();
    CACHE[id] = { id, w: p.w, h: p.h, form: p.f.join(''), cells: p.cells, blocks: p.blocks };
  }
  return CACHE[id];
}
/* every cell on the chart: id → {page, cell} */
export function cellIndex() {
  const m = new Map();
  for (const { id } of PAGES) for (const c of layout(id).cells) m.set(c.id, { page: id, cell: c });
  return m;
}

/* ── the written entries ── */
const HAND = 'en', TYPED = 'ty';
function t(x, y, s, size, o = {}) {
  const str = String(s), est = str.length * size * (o.mono ? 0.6 : 0.5);
  const fit = o.maxW && est > o.maxW ? ` textLength="${n1(o.maxW)}" lengthAdjust="spacingAndGlyphs"` : '';
  return `<text x="${n1(x)}" y="${n1(y)}" font-size="${n1(size)}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.bold ? ' font-weight="700"' : ''}${o.cls ? ` class="${o.cls}"` : ''}${fit}>${esc(str)}</text>`;
}
export function entries(pg, V, cls = HAND) {
  const out = [];
  for (const c of pg.cells) {
    const v = V[c.src || c.id];
    if (v == null || v === '') continue;
    out.push(entry(c, v, cls));
  }
  /* crossed-through orders: "cross through order and administration" (the chart's own instruction 3) */
  for (const [k, v] of Object.entries(V)) {
    const m = /^(reg|prn)\.([A-Z]{1,2})\.x$/.exec(k); if (!m) continue;
    const b = pg.blocks[`${m[1]}.${m[2]}`]; if (!b) continue;
    out.push(`<path class="${cls} cross" d="M${b.x + 4} ${b.y + b.h - 6} L${b.x + b.w - 4} ${b.y + 8} M${b.x + 4} ${b.y + 10} L${b.x + b.w - 4} ${b.y + b.h - 8}" fill="none" stroke-width="1.1"/>`);
    const a = pg.blocks[`${m[1]}.${m[2]}.adm`];
    if (a && v.day <= 8) {
      /* the rest of the cease day, then every day after, crossed out */
      for (const k2 of v.rows || []) {
        const y = a.y + k2 * 18 + 9, x0 = a.x + (v.day - 1) * a.dayW;
        out.push(`<path class="${cls} cross" d="M${x0 + 2} ${y} L${x0 + a.dayW - 2} ${y}" stroke-width="1"/>`);
      }
      if (v.day < 8) { const x0 = a.x + v.day * a.dayW; out.push(`<path class="${cls} cross" d="M${x0 + 3} ${a.y + a.h - 4} L${a.x + a.w - 3} ${a.y + 4}" fill="none" stroke-width="1.1"/>`); }
    }
  }
  return out.join('');
}
function entry(c, v, cls) {
  const { x, y, w, h } = c;
  if (c.k === 'x') return `<path class="${cls} tk" d="M${n1(x + 2)} ${n1(y + h * 0.55)} l${n1(w * 0.28)} ${n1(h * 0.32)} l${n1(w * 0.55)} ${n1(-h * 0.8)}" fill="none" stroke-width="1.3"/>`;
  if (c.k === 'gc') {
    if (v.code) return t(x + w / 2, y + h * 0.72, v.code, Math.min(h * 0.62, 11), { anchor: 'middle', bold: true, cls });
    const fs = Math.min(h * 0.4, 9);
    return t(x + 1.5, y + fs + 0.5, v.giv || '', fs, { cls, maxW: w * 0.62 }) + t(x + w - 1.5, y + h - 1.8, v.chk || '', fs, { anchor: 'end', cls, maxW: w * 0.62 });
  }
  if (c.k === 'sl') {
    if (v.circle) return `<ellipse class="${cls} ring" cx="${n1(x + 16.5)}" cy="${n1(y + h / 2 + 0.5)}" rx="14" ry="${n1(h / 2 - 1.8)}" fill="none" stroke-width="1"/>`;
    return t(x + 55, y + h * 0.7, v, 8.5, { anchor: 'middle', cls, maxW: 36 });
  }
  if (c.k === 'ds') {
    const [a, b] = String(v).split('.'), mid = x + w / 2, by = y + h - 5.5, fs = 8.5;
    return t(mid - 3, by, a, fs, { anchor: 'end', cls, maxW: w / 2 - 6 }) + (b ? t(mid + 3, by, b, fs, { cls, maxW: w / 2 - 6 }) : '');
  }
  if (c.k === 'dt') return t(x + w / 2, y + h - 2.2, v, 7, { anchor: 'middle', cls });
  if (c.k === 'ty') return t(x + 3, y + h - 2.5, v, 8, { cls: TYPED, maxW: w - 4, mono: 1 });
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  if (c.k === 'm') {
    const fs = Math.min(10.5, h * 0.42);
    return t(x + (c.lab === false ? 4 : 6), y + (h >= 28 ? h - 9 : h * 0.72), s.toUpperCase(), fs, { cls, maxW: w - 10 });
  }
  const fs = Math.min(8.5, (c.lab ? h - 9 : h) * 0.62, 8.5);
  if (c.al === 'c') return t(x + w / 2, y + h / 2 + fs * 0.36 + (c.lab ? 3 : 0), s, fs, { anchor: 'middle', cls, maxW: w - 3 });
  return t(x + 3, c.lab ? y + h - 3.5 : y + h / 2 + fs * 0.36, s, fs, { cls, maxW: w - 5 });
}
