/* Short versions of the 21 Module 8 short answers IN JOAN'S FORMAT (immunology, vaccines & allergy; content/joan/imm.js).
   The tool wrote every one of those questions and model answers; each is cut here to one fact a line, grouped under the
   question's own parts, with a memory hook. Gated by shorts.mjs (see content/shorts.js). */
const G = (q, ...facts) => ({ q, facts: facts.map(([t, of, fix]) => (fix ? { t, of, fix } : { t, of })) });
const Q = 'joan-imm';

export const IMM = [
  { quiz: Q, k: 'how does a nurse prevent a patient', title: 'Preventing an allergic exposure',
    hook: 'Ask every time; check the bracelet; beware the suspects.',
    groups: [
      G('Avoidance',
        ['**Check** for allergies at **every healthcare encounter**', 0],
        ['**Record** them; the patient wears an **allergy bracelet**', 0],
        ['**Highly suspect**: **contrast dyes**, **iodine**, **antimicrobials**', 0]),
      G('Example',
        ['Before an **antibiotic**: **ask**, check **bracelet** and **chart**', 1],
        ['A new reaction is **documented**; the **prescriber told**', 1]),
    ] },
  { quiz: Q, k: 'define active immunity and give', title: 'Active immunity — natural and artificial',
    hook: 'Active = your own body did the work.',
    groups: [
      G('Definition',
        ['Made by the person’s **own immune system**', 0],
        ['Stores **memory B cells**', 0]),
      G('Examples',
        ['**Natural**: **recovering** from an infection, e.g. **chickenpox**', 1],
        ['**Artificial**: a **vaccination**, e.g. **MMR** at **12 months**', 1]),
    ] },
  { quiz: Q, k: 'define passive immunity and give', title: 'Passive immunity — natural and artificial',
    hook: 'Passive = borrowed antibodies: instant, but they run out.',
    groups: [
      G('Definition',
        ['**Antibodies** from a **different source**', 0],
        ['**Immediate** but **temporary**', 0]),
      G('Examples',
        ['**Natural**: across the **placenta** or in **breastmilk**', 1],
        ['**Artificial**: lab-made **monoclonal antibodies**', 1],
        ['e.g. **pre-exposure prophylaxis** for someone **immunocompromised**', 1]),
    ] },
  { quiz: Q, k: 'define herd immunity and give an example', title: 'Herd immunity',
    hook: 'Enough people immune, and the bug has nowhere to go.',
    groups: [
      G('Definition',
        ['**Most people** vaccinated: pathogens **cannot spread easily**', 0],
        ['The **whole community** is protected', 0],
        ['Some diseases **reduced** or **eliminated**, e.g. **polio**', 0]),
      G('Who it protects',
        ['Those who **cannot be vaccinated** or **do not respond**', 1],
        ['**Very young**, **elderly**, **immunocompromised**, **non-responders**', 1]),
    ] },
  { quiz: Q, k: 'distinguish a live attenuated vaccine', title: 'Live vs non-live vaccines',
    hook: 'Live replicates — so not in pregnancy or immunosuppression.',
    groups: [
      G('Live (attenuated)',
        ['**Weakened pathogens** that **replicate** without disease', 0],
        ['e.g. **MMR**, **varicella**, **rotavirus**, **BCG**', 0]),
      G('Non-live',
        ['**Cannot replicate**', 1],
        ['**Inactivated** (e.g. **polio**), **subunit**, **mRNA** (e.g. **COVID-19**)', 1]),
      G('Not safe for',
        ['**Pregnancy** or **immunosuppression**', 2],
        ['e.g. **MMR** not given to a **pregnant woman**', 2]),
    ] },
  { quiz: Q, k: 'why is a fever a reason not', title: 'Fever — put the vaccine off',
    hook: 'The immune system can only do one job at a time.',
    groups: [
      G('Reason',
        ['The immune system does **one task at a time**', 0],
        ['**Busy** with something else: may **not respond** to the vaccine', 0]),
      G('Example',
        ['A child with a **fever** at their **3-month vaccinations**', 1],
        ['**Put off**, **rebooked** once **well**', 1]),
    ] },
];
