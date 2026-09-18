# Pharm · Paper Sim — Final exam

A practice paper for **Introduction to Pharmacology (722.544)** in the Paper Sim format
([hs2-test2](https://jeremyspm.github.io/hs2-test2/) is the format of record).

The final: **Fri 6 Nov 2026, afternoon (time not confirmed) · 80 min · 50 marks · 30 multi-choice +
short answers · 50%**. Joan, 16 Sep 2026: a short answer is **a definition plus an example in 3–4
lines**, and she will **not ask about specific drugs**.

## The thing to know before anything else

**There is no lecturer question bank for this paper.** Pharmacology has never had a Canvas quiz, so
nothing here was captured. All 289 questions — 100 multi-choice, 189 written — were written by the
[intro-pharm](https://jeremyspm.github.io/intro-pharm/) hub from the 14 lecture decks and are
carried across unchanged by `port-intro-pharm.mjs`. Each names the slide that supplies its answer;
each multi-choice carries a short explanation that is the tool's, not Joan's. The home screen says
this in a banner, not in a footnote.

## What is honest about its limits

- **The written questions pre-date her description of the exam.** Many are longer multi-part
  questions and some name specific drugs. They over-train rather than mis-train, but they are not
  her format. Short definition-plus-example questions written from her recorded lectures
  (9 Sep, 16 Sep, and every lecture recorded from here) are the next layer.
- **The number of short answers is unpublished.** The mock deals written questions to **20 marks**
  (50 − 30, assuming one mark per multi-choice), spread one per topic, and says that is arithmetic,
  not knowledge. The formative mini exams in the revision sessions (21, 27, 28 Oct) may settle it.
- **The bank is Modules 1–7 — everything taught before the mid-semester break.** Modules 8, 9 and
  10 have not been taught: Immunology, Vaccines & Allergy (Wed 7 Oct; only the ASCIA plan is here),
  Socioeconomic Factors & CAM (Wed 14 Oct — a self-directed **Canvas quiz**, the first lecturer
  questions this paper will ever have: capture the graded page), Licit & Illicit Drugs & Toxicology
  (Tue 20 Oct). Examinable. Revision sessions with formative mini exams: 21, 27, 28 Oct.
- **Deck 13, Drug Development & Marketing, was never lectured** — a self-directed online package.
- The focus checklist is owed; slide images and warm-up chains are not ported yet.

## How it is built

Template + `sim.config.mjs` + `content/`, on the shared pipeline (`node shared-check.mjs` proves
the shared files match the sibling sims byte for byte). With no captures, `PATHS.bank` and
`PATHS.cap` are null and every question comes from `content/authored-*.js`.

```
node port-intro-pharm.mjs    # bank/intro-pharm.json -> content/authored-mcqs.js + authored-saqs.js
node build.mjs               # -> index.html, gates fail both ways
node resplice.mjs            # only the template changed
```

`bank/intro-pharm.json` is `const DATA` lifted out of `../intro-pharm/index.html`, untouched.

State lives in this browser only (`phf.*`). Nothing is sent anywhere.
