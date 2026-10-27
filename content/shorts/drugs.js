/* Short version of the one written question on the drugs Joan named (content/joan/drugs.js). */
export const DRUGS = [
  { quiz: 'joan-drugs', k: 'why should paracetamol not be given to a baby', title: 'Paracetamol under 3 months',
    hook: 'Young liver, slow clearance, toxic build-up.',
    groups: [
      { q: 'Why not', facts: [
        { t: 'Liver **enzymes** not yet developed', of: 0 },
        { t: 'Paracetamol **metabolised** more slowly', of: 0 },
        { t: '**Toxic** metabolites build up in the blood', of: 1 },
        { t: 'Higher risk of overdose and **liver injury**', of: 1 },
      ] },
    ] },
];
