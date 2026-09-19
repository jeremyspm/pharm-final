# Pharm · Paper Sim — Final exam

**Live: https://jeremyspm.github.io/pharm-final/** · sister sim: [INP](https://jeremyspm.github.io/inp-final/)

A practice paper for **Introduction to Pharmacology (722.544)** in the Paper Sim format
([hs2-test2](https://jeremyspm.github.io/hs2-test2/) is the format of record).

The final: **Fri 6 Nov 2026, afternoon (time not confirmed) · 80 min · 50 marks · 30 multi-choice +
short answers · 50%**. Joan, 16 Sep 2026: a short answer is **a definition plus an example in 3–4
lines**, and she will **not ask about specific drugs**.

## The thing to know before anything else

**There is no lecturer question bank for this paper.** Pharmacology has never had a Canvas quiz, so
nothing here was captured. Every question is the tool's, from two sources, and each names the
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
