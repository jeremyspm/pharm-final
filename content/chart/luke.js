/* John Luke — the 722.544 CLS medication administration scenario (Canvas: Medication Administration Practical Assessment,
   Version 2) on HIS chart: name, NHI, DOB, weight/height, prescriber (BLACK, Penny #67321), the enalapril order and the
   sample initials (MALL, Maria · CRAIG, Janine RN) are from "Mr Lukes chart 2022.pdf" on the 722.544 Canvas, so the dates
   are August 2022 and he is 79 as the brief says. Teaches: the two new orders from the brief (paracetamol 1 g PO qid,
   metoprolol succinate CR 47.5 mg PO daily); signing your first dose with the RN's check; the right time for a qid drug;
   W — withheld by YOUR decision (pulse 52, no hold parameter), not D; R — a refusal. */
export default {
  id: 'luke', t: 'John Luke, 79', sub: 'Your CLS med admin patient: heart failure, high BP, backache',
  story: 'Mr Luke has long-standing congestive heart failure and high blood pressure, and takes his regular medicines for them. Lately his blood pressure has been higher than usual and he keeps getting backache, so on Thursday morning his doctor added two new medicines: paracetamol 1 g four times a day, and metoprolol succinate CR 47.5 mg once a day. It is Thursday, 0745. This is the patient from your CLS medication administration assessment, on his own chart from Canvas.',
  start: [17, 8, 2022], now: '2@0745',
  patient: { family: 'LUKE', given: 'John', gender: 'M', dob: '16/12/1942', nhi: 'DGY2963', weight: 75, height: 167 },
  prescribers: [
    { id: 'pb', name: 'BLACK, Penny · Doctor', sig: 'PBlack', reg: '67321' },
  ],
  nurses: [
    { name: 'MALL, Maria · RN', init: 'MM', reg: '192936' },
    { name: 'CRAIG, Janine · RN', init: 'JC', reg: '' },   // her chart entry prints no number, so none is invented
  ],
  allergies: [], allergyBy: 'pb',
  adverse: [], adverseBy: 'pb',
  special: [], supplementary: [],
  regular: [
    { L: 'I', day: 1, startT: '0800', med: 'ENALAPRIL', dose: '5', units: 'mg', route: 'PO', freq: 'daily', times: '0800', by: 'pb',
      given: { '2@0800': '0815 JC', '3@0800': '0815 JC' } },
    { L: 'J', day: 2, at: '2@0700', startT: '1200', med: 'PARACETAMOL', dose: '1', units: 'g', route: 'PO', freq: 'QID', times: '0600 1200 1800 2200', by: 'pb', inst: 'Max 4 g in 24 h from all sources',
      given: { '2@1800': 'MM', '2@2200': 'MM', '3@0600': 'MM' } },
    { L: 'K', day: 2, at: '2@0700', startT: '0800', med: 'METOPROLOL SUCCINATE CR', dose: '47.5', units: 'mg', route: 'PO', freq: 'daily', times: '0800', by: 'pb', inst: 'Swallow whole. Check pulse and BP first' },
  ],
  questions: [
    { id: 'lk-ind', tag: 'Regular', q: 'Why was metoprolol succinate CR added for Mr Luke?', a: 'His blood pressure has been higher than usual',
      w: ['For the backache he keeps getting lately', 'To slow a new fast irregular heartbeat', 'To help him sleep through the night'],
      show: ['reg.K.med', 'reg.K.date'], why: 'The scenario: his GP added it because his BP has been higher than usual (he also has heart failure). The CLS rubric’s “right indication” must be about HIM, not a textbook list.' },
    { id: 'lk-max', tag: 'Regular', q: 'Paracetamol 1 g QID — how much is that in 24 hours?', a: '4 g: the maximum, so no other paracetamol',
      w: ['2 g: well under, so Panadol from home is fine', '6 g: over the maximum, so query it today', '1 g: one dose, spread over the whole day'],
      show: ['reg.J.dose', 'reg.J.freq', 'reg.J.inst'], why: '1 g × 4 = 4 g, the 24-hour maximum. Any other paracetamol (Panadol, cold-and-flu products) would take him over it.' },
    { id: 'lk-crush', tag: 'Regular', q: 'Mr Luke struggles with big tablets. Can his metoprolol be crushed?', a: 'No: it is controlled release (CR)',
      w: ['Yes: crush it into a spoon of yoghurt', 'Yes: but only in half a glass of water', 'No: it has to be given as an injection'],
      show: ['reg.K.med', 'reg.K.inst'], why: 'CR = controlled release: swallow whole. It can be halved, never crushed or chewed. Ask the pharmacist about other options.' },
  ],
  rounds: [
    { at: '2@0810', rn: 'JC', title: '0800 — your assessment drug',
      brief: ['Thursday morning. Janine Craig (RN, initials JC) is supervising you. You have not signed Mr Luke’s chart before.',
        '0805 — his pulse is 68 and his BP 152/88, so his new metoprolol is safe to give. He tells you his full name and date of birth, you check his wristband and NHI, and he has no allergies.',
        '0810 — with Janine checking, you give Mr Luke metoprolol succinate CR 47.5 mg PO, swallowed whole with water. (Janine gives his enalapril herself.)'],
      ask: [{ id: 'r1time', tag: 'Regular', q: 'His paracetamol is also new today. Is a dose due at 0800?', a: 'No: QID times are 0600, 1200, 1800, 2200',
        w: ['Yes: every new medicine starts at 0800', 'Yes: QID means it is given at any time', 'No: it is only given when he asks for it'],
        show: ['reg.J.s1', 'reg.J.s2'], why: 'QID on this chart = 0600, 1200, 1800, 2200 (the recommended times), and the first time circled for him is 1200.' }],
      expect: [
        { do: 'reg' },
        { do: 'sign', c: 'reg.K.d2.s1', t: '0810' },
      ] },
    { at: '2@1210', rn: 'JC', title: 'Midday',
      brief: ['1205 — Mr Luke says his back is aching. His first paracetamol is due at 1200.',
        '1210 — with Janine checking, you give him paracetamol 1 g PO: two 500 mg tablets.'],
      expect: [{ do: 'sign', c: 'reg.J.d2.s2', t: '1210' }] },
    { at: '3@0810', rn: 'JC', title: 'Friday: pulse 52',
      brief: ['Friday morning. At 0800 Mr Luke’s pulse is 52 and his BP 108/64, and he feels light-headed when he stands.',
        'There is no hold parameter on the metoprolol order. You and Janine decide NOT to give it, Janine rings the doctor, and you write why in his notes.'],
      ask: [{ id: 'r3w', tag: 'Regular', q: 'Pulse 52, no hold parameter, and you and Janine decide not to give it. What goes in the box?', a: 'W — withheld, the reason in the notes',
        w: ['D — prescriber’s instructions', 'Your initials: 52 is close enough', 'N — not administered, nothing more'],
        show: ['reg.K.inst'], why: 'The decision was yours and the RN’s, not the prescriber’s: W (withheld), with the reason in the notes. D is for when the prescriber says not to give it (or their own written hold parameter).' }],
      expect: [{ do: 'code', c: 'reg.K.d3.s1', code: 'W', why: 'Withheld by your and the RN’s decision (pulse 52, no hold parameter), with the reason in the notes and the doctor told.' }] },
    { at: '3@1215', rn: 'JC', title: 'He says no',
      brief: ['1210 — Mr Luke says he does not want his paracetamol: “My back is fine today, and I hate taking pills.”',
        'You explain what it is for and what might happen without it. He still says no, and Janine agrees you respect that. You will tell the next shift.'],
      expect: [{ do: 'code', c: 'reg.J.d3.s2', code: 'R', why: 'A competent refusal: R, the reason documented, the next shift told, and the dose discarded.' }] },
  ],
};
