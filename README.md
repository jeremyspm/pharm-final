# Pharm · Paper Sim — Final exam

**Live: https://jeremyspm.github.io/pharm-final/** · sister sim: [INP](https://jeremyspm.github.io/inp-final/)

A practice paper for **Introduction to Pharmacology (722.544)** in the Paper Sim format
([hs2-test2](https://jeremyspm.github.io/hs2-test2/) is the format of record).

The final: **Fri 6 Nov 2026, afternoon (time not confirmed) · 80 min · 50 marks · 30 multi-choice +
short answers · 50%**. Joan, 16 Sep 2026: a short answer is **a definition plus an example in 3–4
lines**, and she will **not ask about specific drugs**.

## The thing to know before anything else

**There is no lecturer question bank for this paper.** Its only Canvas quizzes are medication-
calculation practice tests (formative tests 1–5, answers on Canvas — not mined yet); nothing on
pharmacology itself has ever been set, so nothing here was captured. Every question is the tool's, from two sources, and each names the
slide or lecture moment that supplies its answer:

- **75 short answers in Joan's stated format** — a definition plus an example, 2–3 marks, no
  question about a specific drug. Hand-written (19 Sep 2026) in `content/joan/`, one file per
  topic, from her own Escape Room answer sheet, her recorded 16 Sep Legal & Ethical lecture (cited
  by timestamp), deck 13 (the self-directed Drug Development package), the Rongoā Māori deck, and
  the definitions in the Module 1–6 decks. Eight rows named "In Joan's format", listed first.
- **289 questions — 100 multi-choice, 189 written — from the
  [intro-pharm](https://jeremyspm.github.io/intro-pharm/) hub**, written from the 14 lecture decks
  and carried across unchanged. Each multi-choice carries a short explanation that is the tool's.

`port-intro-pharm.mjs` merges the two into the generated `content/authored-*.js`. The home screen
says all this in a banner, not in a footnote.

## What is honest about its limits

- **The Joan-format questions are the tool's reading of her format, not her questions.** Her one
  worked example ("what is the meaning of contraindication, and give an example") is the first of
  them. The 9 Sep lecture was an essay briefing with no standalone pharmacology content, so nothing
  was taken from it.
- **intro-pharm's written questions pre-date her description of the exam.** They all stay under
  Pick my rep, but a mock, which claims the paper's shape, leaves out 97 of the 189: any that carry
  4+ marks, name a specific drug, ask for the lecture's own drug examples, or are worked
  calculations. The rule is written down in `port-intro-pharm.mjs` (`--list` prints every hit);
  the multi-choice are untouched.
- **The number of short answers is unpublished.** The mock deals written questions to **20 marks**
  (50 − 30, assuming one mark per multi-choice), spread one per topic, and says that is arithmetic,
  not knowledge. The formative mini exams in the revision sessions (21, 27, 28 Oct) may settle it.
- **The bank is Modules 1–7 — everything taught before the mid-semester break.** Modules 8, 9 and
  10 have not been taught: Immunology, Vaccines & Allergy (Wed 7 Oct; only the ASCIA plan is here),
  Socioeconomic Factors & CAM (Wed 14 Oct — a self-directed **Canvas quiz**, the first lecturer
  questions this paper will ever have: capture the graded page; its Rongoā Māori part was lectured
  15 Sep and IS in the bank, written from its deck), Licit & Illicit Drugs & Toxicology
  (Tue 20 Oct). Examinable. Revision sessions with formative mini exams: 21, 27, 28 Oct.
- **Deck 13, Drug Development & Marketing, was never lectured** — a self-directed online package.
- **The focus checklist** (`content/focus.js`, 18 rows) is built: per topic what you must be able
  to DO, the shape Joan described, where it stops. The build counts each row's questions and fails
  unless every question sits in exactly one row. **Counts rank nothing here** (every question is
  the tool's): the top band is what she said on tape on 16 Sep, then topics an assessed learning
  outcome names, then the rest, then calculations. The page flags one contradiction: the syllabus
  leaves the legal-standards outcome out of the exam's list, and she said on tape it is assessed.
- Slide images and warm-up chains are not ported yet.

## Chart Speak — every med-chart term, drilled (`terms.html`)

**Live: https://jeremyspm.github.io/pharm-final/terms.html**, and a row on the home screen under
*Read a med chart*. A trainer for reading a medication chart before placement: **414 abbreviations,
symbols and terms** in 11 topics (when & how often · routes · forms & release · doses, units & rates ·
the chart itself · the danger list · IV, lines, tubes & oxygen · obs & labs · notes shorthand ·
the course's pharmacology words · law, regulators & roles), **35 real-looking orders** to decode,
**17 dangerous ways of writing** to spot, and **31 chart-rule scenarios** (which section, which
not-given code, PRN maths, the 30-minute window).

- **Every term says where it comes from.** 19 are the course's own Must-Know abbreviations list
  (Concepts (2) slides 77–80). 155 name the course deck and slide they come from — the
  pharmacology words use the decks' definitions, the same ones the Joan-format short answers teach.
  217 are everyday NZ ward usage in the tool's words, and 23 come from the international
  error-prone list. The page says the hospital's own list wins where they differ.
- **The not-given codes** (A absent · F fasting · L leave · N not available · R refused ·
  S self-administered · V vomiting · W withheld) are the national-chart letters; the page says the
  key printed on the chart wins. HQSC's own user guide could not be read while this was built —
  check a code or rule there if it matters.
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
