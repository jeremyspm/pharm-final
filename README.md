# Pharm · Paper Sim — Final exam

**Live: https://jeremyspm.github.io/pharm-final/** · sister sim: [INP](https://jeremyspm.github.io/inp-final/)

A practice paper for **Introduction to Pharmacology (722.544)** in the Paper Sim format
([hs2-test2](https://jeremyspm.github.io/hs2-test2/) is the format of record).

The final: **Thu 5 Nov 2026, a morning or an afternoon sitting (group not advised yet) · 80 min · 41
questions, 50 marks · 30 multi-choice (1 mark) + 11 short answers worth 1–4 marks (20 marks) under three
clinical scenarios · 50%** (her exam-prep slides; Joan in class, 20 Oct 2026). Sat on **MIT computers in the
ECHO exam software** — practice sessions 27/28 Oct. Joan, 16 Sep: a short answer is **a definition plus an
example**; 20 Oct: applied and nurse-focused, with **a few questions on the drug classes she named**
(paracetamol, salbutamol, aspirin/warfarin/heparin, GTN, the penicillins, morphine) and a few easy
calculations, no working shown.

## The thing to know before anything else

**Joan's own questions are in here — but only these.** On 20 Oct 2026 she published three **Formative
mini-exams** with answers (Assessment Information → Exam Practice (Formative) Tests): Word documents, her
key highlighted, her model answers in red. **54 questions — 36 multi-choice, 18 short answers — verbatim**
in `content/formatives/` (one file per mini-exam, aggregated by `content/hers.js`), listed first on the
page and carrying no "tool's question" tag. The tool changes two things, and the card says so: mini-exam 1
**Q4 is keyed B**, not the document's C, because she corrected it in class (20 Oct [1:48:07–1:50:15]); her
working, which leaked into mini-exam 3 Q8's stem, is moved into its explanation. Mini-exam 1's explanations
are the tool's, written from her spoken feedback that morning and cited by timestamp.

There are still **no Canvas quizzes on pharmacology**: the only ones are medication-calculation practice
tests. Everything else is the tool's, from two sources, and each names the slide or lecture moment that
supplies its answer:

- **75 short answers in Joan's stated format** — a definition plus an example, 2–3 marks. Hand-written
  (19 Sep 2026) in `content/joan/`, one file per topic, from her own Escape Room answer sheet, her recorded
  16 Sep Legal & Ethical lecture (cited by timestamp), deck 13 (the self-directed Drug Development
  package), the Rongoā Māori deck, and the definitions in the Module 1–6 decks.
- **289 questions — 100 multi-choice, 189 written — from the
  [intro-pharm](https://jeremyspm.github.io/intro-pharm/) hub**, written from the 14 lecture decks and
  carried across unchanged. Each multi-choice carries a short explanation that is the tool's.

`port-intro-pharm.mjs` merges the two into the generated `content/authored-*.js`. The home screen says all
this in a banner, not in a footnote.

### Her questions, and the shared pipeline

`content/hers.js` is an **optional hook in the shared `build.mjs`**: the lecturer's own questions that were
never a Canvas quiz. They are pushed with `her: 1` (no `authored`), so the page treats them as hers; a
written answer's source line reads "Question and model answer are Joan's". A written question may carry
`any: k` — her answer lists alternatives and any k of them earn its marks ("one piece of safe advice…"); the
template marks such a line as pts/k and caps the question at its marks, the results screen says so, and the
written-answers trainer locks it at k lines. Her 18 short answers have short versions in
`content/shorts/hers.js`. A sim without `content/hers.js` is untouched (inp-final rebuilt to identical data).

## What is honest about its limits

- **The Joan-format questions are the tool's reading of her format, not her questions.** Her one worked
  example ("what is the meaning of contraindication, and give an example") is the first of them.
- **intro-pharm's written questions pre-date her description of the exam.** They all stay under Pick my
  rep, but a mock leaves out 95 of the 189: any that carry 4+ marks, name a drug she has NOT named as
  examinable, ask for the lecture's own drug examples, or are worked calculations. On 20 Oct she named the
  classes that will come up, so paracetamol, aspirin, morphine, amoxicillin and adrenaline no longer keep a
  question out (`OFFLIST` in `port-intro-pharm.mjs`; `--list` prints every hit).
- **The mock's written section** deals 11 questions up to 20 marks (`shape.saq` + `shape.saqMarks`, the
  template keeping at least a mark for every slot still to fill — 200 test deals all came out 30 + 11 = 20).
  It does **not** yet group them into three clinical scenarios, and the page says so. Once on 20 Oct she
  said "there are 60" [0:14:30]; her slide and her own count four minutes later say 41.
- **The tool's own questions cover Modules 1–7 plus Rongoā Māori.** Module 8 (Immunology, Vaccines &
  Allergy, taught 7 Oct) has decks on Canvas not yet built into questions — the tool has only the ASCIA
  plan. Module 10 part 2 (CAM, self-directed 14 Oct) and Module 9 (Licit & Illicit, moved to a
  self-directed session Wed 21 Oct, 1–5 pm, because of the strike; its Canvas module was empty on 20 Oct)
  have only her formative questions. All examinable.
- **Deck 13, Drug Development & Marketing, was never lectured** — a self-directed online package.
- **The focus checklist** (`content/focus.js`, 19 rows) is built: per topic what you must be able to DO,
  the shape Joan described, where it stops. The build counts each row's questions and fails unless every
  question sits in exactly one row; her formative questions are claimed by mini-exam and question number
  (`F()`). **Counts rank nothing here.** The top band is what she said on tape — 16 Sep (legal and
  ethical, drug development) and 20 Oct (abbreviations, the signs of drug allergy, the drug classes, a
  row of its own with no questions yet) — then topics an assessed learning outcome names, then the rest,
  then calculations.
- Slide images and warm-up chains are not ported yet.

## Chart Speak — every med-chart term, drilled (`terms.html`)

**Live: https://jeremyspm.github.io/pharm-final/terms.html**, and a row on the home screen under
*Read a med chart*. A trainer for reading a medication chart before placement: **420 abbreviations,
symbols and terms** in 11 topics (when & how often · routes · forms & release · doses, units & rates ·
the chart itself · the danger list · IV, lines, tubes & oxygen · obs & labs · notes shorthand ·
the course's pharmacology words · law, regulators & roles), **35 real-looking orders** to decode,
**17 dangerous ways of writing** to spot, and **33 chart-rule scenarios** (which section, which
not-given code, PRN maths, the 30-minute window).

- **Every term says where it comes from.** 19 are the course's own Must-Know abbreviations list
  (Concepts (2) slides 77–80). 14 are printed on the NZ chart itself. 155 name the course deck and slide they come from — the
  pharmacology words use the decks' definitions, the same ones the Joan-format short answers teach.
  209 are everyday NZ ward usage in the tool's words, and 23 come from the international
  error-prone list. The page says the hospital's own list wins where they differ.
- **The not-given codes are the NZ chart's own key** — U patient unavailable · SM self-medicating ·
  CP carer/parent · R refused · D prescriber's instructions · N not administered (reason in notes) —
  with its recommended times (mane 0800 · nocte 1800 or 2000 · BD 0800/2000 · TDS 0800/1400/2000 ·
  QID 0600/1200/1800/2200 · q8h 0600/1400/2200 · q6h 0600/1200/1800/2400), taken from the 8-Day
  National Medication Chart (NMC8D, 2012 edition, page 11). The first version shipped the Australian
  chart's letters (A F L N R S V W) — corrected 26 Sep 2026 once the real chart was in hand.
- **Not a dosing guide.** The orders use typical adult doses so they look like a real chart, and
  every order says so.
- **How it drills.** A wrong option is a real trap (the term's listed confusions first, then its
  sub-group, then its topic), never a synonym or a same-spelled term (PR the route / PR the pulse,
  OD daily / OD overdose). 2 right in a row locks a term, the second at least 10 minutes after the
  first; a locked term comes back after a week. Every wrong chart reading is the right sentence with
  one thing changed. Progress lives in this browser under `phf.cs.*`; a one-line summary under
  `phf.more.terms` feeds the home row.

```
node build-terms.mjs          # content/terms/*.js + terms-engine.mjs + terms-template.html -> terms.html
node build-terms.mjs --lint   # also print meanings that repeat their own term's words
```

The page wears `template.html`'s own stylesheet, copied in at build time, so the two cannot drift.
The build fails on: a broken reference; two terms with one meaning that could meet in a question;
a danger line with more than one dangerous part; a wrong chart reading that changes more than one
thing or is much longer or shorter than the right one; a rule question whose answer is the longest
option. It also deals every term question 40 times, both ways round, with the page's own engine
(`terms-engine.mjs` is inlined, never retyped), and fails if a question is short of options, shows
its answer twice, repeats an option, offers two right answers, or biases where the answer sits.
The home row is `META.more` in `sim.config.mjs`, a generic hook in the shared template that does
nothing in a sim without it.

## Chart Sim — read a real NZ chart, then chart on it (`chart.html`)

**Live: https://jeremyspm.github.io/pharm-final/chart.html**, the second row under *Read a med chart*. The **NZ
8-Day National Medication Chart** (NMC8D, 2012 edition) redrawn box for box from the booklet's own pages — front page
(allergies, adverse reactions, special care, supplementary charts, both registers), Once Only / Verbal Orders /
Oxygen, PRN orders facing their record, VTE + Regular orders facing their 8 days, the IV fluid record, and the key
printed inside the chart. Ten invented patients, each part-charted like a chart picked up on the ward, with 3–6 med
rounds each (45 in all), most running into a second day:

| Patient | What it teaches |
|---|---|
| Margaret, 82 — broken hip | a stopped order you must not sign; D on the prescriber's word, then given next day once the numbers allow; a controlled-drug PRN; the 24-hour maximum as a rolling 24 hours |
| Hemi, 67 — COPD flare | SM for his own inhaler, then signed when a nurse gives it from ward stock; U at X-ray; a verbal order unsigned past 24 h; an 88–92% oxygen target |
| Grace, 58 — leg cellulitis | a therapy change is a ceased line plus a new line; N with its reason in the notes; CP for her husband's eye drops on an afternoon shift |
| Tom, 74 — Parkinson's + UTI | time-critical levodopa at his own times (the 30-minute window works both ways); an IV dose the RN gives and signs, so the student signs nothing; R; metoclopramide on his Adverse Reactions |
| Daniel, 48 — liver disease | a recharted chart; hepatic impairment; a variable dose (the dose given goes in the Dose column); N when pharmacy has not supplied it; a 2 g paracetamol maximum — a round where the right move is to give nothing |
| Sione, 58 — day 1 after bowel surgery | two supplementary charts (PCA, insulin); D written on the order itself; an aspirin allergy that matters for NSAIDs; two antiemetics where the 8-hour gap decides; a fluid bag with KCl; day 3 — metformin back once he is eating, a BP under the order's limit, the PCA down and a PRN opioid charted |
| Ropata, 71 — stroke, nil by mouth | a change of route is a new line (aspirin PR crossed through, aspirin NG below); a CR tablet that cannot be crushed for the NG tube (D, then rewritten); calf pumps in the VTE box; a two-route PRN where the route used is recorded; a last bag with no next bag written |
| Aroha, 31 — day 1 after a caesarean | breastfeeding in Special Care; an allergy found in theatre under "New on this admission"; midwives (RM) as checkers; an IV dose the midwife gives and signs; a PRN dose range; codeine avoided while breastfeeding |
| Frank, 69 — PE and new AF | treatment-dose enoxaparin from the Dose calculation box (mg/kg); digoxin held and given on the apical pulse; two loading doses on the Once Only page; a cancelled PRN replaced by another; a second oxygen line |
| Betty, 79 — broken wrist, three weekly medicines | methotrexate (Mondays only), alendronate (Wednesdays, before food) and folic acid (Thursdays) with every other day ruled off — signing nothing where nothing is due |

**The chart keeps time.** Everything written carries its moment and the chart shows only what had been written by
then, so a scenario scripts its whole timeline (the night nurse's 0600 signatures, a verbal order signed late, an
oxygen stop date) and a round the next morning finds them. Reading shows the chart as the last round left it;
charting shows it as the next round finds it.

- **Read**: questions generated from the chart itself (so they cannot disagree with it) — allergies, doses, times,
  who gave what (via the Sample Initials register), what a code means, what is due next, whether a PRN can be given
  now (gap and 24-hour maximum), what was stopped, oxygen targets, fluid rates — plus each patient's own judgement
  questions. Some are answered by tapping the right box. Tap any box, any time, to see what it is.
- **Chart it**: a round happens ("0805 — you give all her 0800 tablets except the metoprolol…"); the student writes it
  in, is marked, and the chart moves on with the right answer written in, so the next round and the next questions
  start from a correct chart.
- **How it marks.** Every box is a named rectangle (`chart-render.mjs`), and each round has an answer key.
  *Tap to fill* is marked for you (`checkRound`): the right box (medicine, day, time line), the right thing in it
  (initials or which code), the student's initials AND the RN's check, a time within 30 minutes, a PRN line with a
  dose and route the order allows, the register line on a first signature — and anything written where nothing
  should be, by name. *Handwrite* (pen, drawing tablet, or finger if chosen): nothing reads handwriting. Where the
  ink landed is marked for you (`checkInk`; a stroke belongs to the box holding most of its points); what it says is
  self-marked against the right entry drawn beside it. The page says so. The line width is chosen in the pen tools
  (fine by default — about a ballpoint beside the chart's lettering; the first version drew a felt-tip). With "my finger
  writes too", one finger writes and two fingers move and zoom the chart: a second finger landing turns a stroke that
  has only just begun into a two-finger move (the first version took the second finger for a resting palm, so two
  fingers never moved the chart).
- **The ink is Giga's.** `ink.mjs` carries `inkPathFromOutline` and `sketchStrokePath` from gigastudyapp
  `lib/ink-path.js` byte for byte (the build diffs them whenever `../gigastudyapp` is checked out), and the pointer
  handling follows its SketchNodeView (pressure rule, coalesced samples, a dot for a tap, whole-stroke eraser) on the
  vendored **perfect-freehand 1.2.3** (MIT, pinned by sha256). Pen writes; one finger pans; two fingers zoom; a palm
  is ignored while the pen is busy.
- **Not a dosing guide.** Typical adult doses so the chart looks real; invented people. A hospital's own policy (who
  checks what, where a code is written) wins where it differs.

```
node build-chart.mjs   # content/chart/*.js + chart-engine.mjs + chart-render.mjs + ink.mjs + vendor/ -> chart.html
```

The build fails if a scenario writes a box the chart does not have or a row letter off the sheet; if any question
it deals (every stage, 30 times) shows its answer twice, repeats an option, or points at a box that is not there; if
a patient's own question gives its answer away by length; if a round's model answer fails its own check, or passes
with nothing written, with the wrong day, without the RN's check, with the student signing a dose the RN gave, or
with stray ink; if the story contradicts the chart (a PRN the round gives that the chart says cannot be given then,
or that would take the 24-hour total past the maximum, or one it withholds that could be given); if a scripted
signature sits in a box a round asks the student to fill, or anything is signed on a day a weekly order rules off; if, after the round, anything the model wrote is not
where it put it; or if a stroke drawn across a box is not placed in it. The modules are inlined as namespaces (never retyped) and the page's
script is parsed before it ships. Progress lives under `phf.chart.*`; `phf.more.chart` feeds the home row.

## How it is built

Template + `sim.config.mjs` + `content/`, on the shared pipeline (`node shared-check.mjs` proves
the shared files match the sibling sims byte for byte). With no captures, `PATHS.bank` and
`PATHS.cap` are null and every question comes from `content/authored-*.js`.

```
node port-intro-pharm.mjs    # bank/intro-pharm.json + content/joan-saqs.js -> content/authored-*.js
node port-intro-pharm.mjs --list   # every written question the noMock rule keeps out of a mock
node build.mjs               # -> index.html, gates fail both ways
node resplice.mjs            # only the template changed
```

`bank/intro-pharm.json` is `const DATA` lifted out of `../intro-pharm/index.html`, untouched.

State lives in this browser only (`phf.*`). Nothing is sent anywhere.
