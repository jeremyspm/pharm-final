/* Chart Sim — the patients (chart.html, built by build-chart.mjs). Each file is one patient's NZ 8-Day National
   Medication Chart, written as the orders and signatures on it; chart-engine.mjs compile() turns it into every box.
   The build proves every box it writes exists on the chart, every question has one right answer, and every round's
   model answer passes its own check — so a scenario that does not fit the real chart fails the build.

   NOT A DOSING GUIDE: the doses are typical adult doses so the chart looks real. The people are invented.

   A SCENARIO
     id, t (name), sub (one line), story (handover, a few sentences)
     start [d, m, yyyy]   day 1 of the chart · now 'day@HHMM' — the moment the chart is first read
     patient { family, given, gender, dob, nhi, weight, height }
     prescribers [{ id, name, sig, reg }] · nurses [{ name, init, reg }] (the Sample Initials register, in order)
     allergies / adverse [{ med, rx, by }] (empty → the "No" box ticked and signed by allergyBy / adverseBy)
     special ['renal'|'preg'|'hep'|'bf'] · supplementary ['insulin'|'analgesia'|'heparin'|'warfarin'] · vte {…}
     regular [{ L (I–O), day, startT, med, dose, units, route, freq, times 'HHMM …', by, inst?, range?, calc?,
                given { 'day@HHMM': 'AK' | 'AK/LT' | '0815 AK/LT' | a code U SM CP R D N }, cease? { at, by } }]
     prn [{ L (A–H), day, med, dose, units, route, freq, max, gapH, maxAmount (in the order's units), ind, by,
            given ['day@HHMM dose route AK/LT', …] }]
     once [{ day, med, dose, units, route, by, inst?, from? (appears after that round), given? { at, giv, chk } }]
     verbal [{ at, med, dose, units, route, pname, signed? (prescriber id), given { at, nurse, witness } }]
     fluids [{ day, time, vol, fluid, route, rate, by, started? { at, by, chk }, done? { at, vol } }]
     o2 { target, rows [{ start (day), device, flow, by, stop? }] }
     questions — the scenario's own (judgement the chart alone cannot generate): { id, stage?, tag, q, a, w:[wrong…],
                 show:[cells], why } or { kind:'tap', accept:[cells or 'prefix.*'] }
     rounds — what happens next, in order: { at, rn (the RN's initials), title, brief:[lines], ask?:[questions],
              expect:[{do:'sign'|'code'|'prn'|'once'|'fluid'|'fluidend'|'reg'|'none', …}] } (see checkRound) */
import hip from './hip.js';
import copd from './copd.js';
import cellulitis from './cellulitis.js';

export const SCENARIOS = [hip, copd, cellulitis];
