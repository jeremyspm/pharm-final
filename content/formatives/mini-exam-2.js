/* Joan’s Formative mini-exam 2 — HER questions, answer key and model answers, VERBATIM (her typos kept), from the
   answers document on Canvas (Assessment Information → Exam Practice (Formative) Tests, published 20 Oct 2026).
   Transcribed by script from the .docx (yellow/green highlight = her key, red text = her model answer), then read by
   hand against the document. `why` is the TOOL’s explanation.
   `any: k` = her answer lists alternatives and any k of them earn the marks. */
const R = { quiz: 'form2', quizName: 'Joan’s formative · mini-exam 2' };
const D = 'Joan’s Formative mini-exam 2, answers document';

export const MCQS = [
  { ...R, sys: "life", q: "Mr Lata is 79 and has been living with hypertension for many years. He has been on several medications. An ageing person undergoes a variety of physiological changes that may change their response to medications. Which if these factors is most likely to cause a prescriber to alter Mr Lata’s medication dose?",
    options: ["Loss of body weight", "Impaired vision", "Reduced sense of taste", "Decreased renal function"], correct: 3,
    src: D + ', Q1' },
  { ...R, sys: "admin", q: "Mr Lata is admitted to hospital for chest pain. When a Registered nurse administers medication to Mr Lata it is essential that the eight rights of medication administration are checked, because:",
    options: ["They decrease the risk of a medication error", "They increase the chance an adverse drug reaction", "They focus on the pharmacokinetics and pharmacodynamics", "They increase the chance of curing disease"], correct: 0,
    src: D + ', Q2' },
  { ...R, sys: "pkpd", q: "A drug that binds to a cell receptor and does not cause a response is called a/an:",
    options: ["Agonist", "Antagonist", "Beta blocker", "Ion-channel modulator"], correct: 1,
    src: D + ', Q3' },
  { ...R, sys: "admin", q: "Mr Lata is prescribed several medications but has difficulty swallowing the largest tablet. The nurse should:",
    options: ["Compete an incident report and notify the charge nurse", "Crush the tablets and give them with yoghurt", "Administer by an alternative oral liquid formulation if available", "Document that Mr Lata has refused his medication every day"], correct: 2,
    src: D + ', Q4' },
  { ...R, sys: "pkpd", q: "Most drugs and their metabolites are excreted by which organ?",
    options: ["Liver", "Lungs", "Salivary glands", "Kidney"], correct: 3,
    src: D + ', Q5' },
  { ...R, sys: "found", q: "Sonia is a 55-year-old Samoan woman admitted to the ward for management of symptoms caused by her Adult Congenital Heart Disease. Sonia is prescribed diclofenac 60mcg QID PR. What is the correct interpretation of this prescription:",
    options: ["Give diclofenac 60mcg four times a day per right nostril", "Give diclofenac 60mcg four times a day via the rectal route", "Give diclofenac 60mg 4 hourly per nasal route", "Give 60mcg of diclofenac 4 tablets as needed"], correct: 1,
    src: D + ', Q6' },
  { ...R, sys: "cam", q: "Sonia wants to access an osteopath, alongside her medication, as part of her care plan. When a therapy or treatment is used alongside pharmacological intervention, this is called:",
    options: ["Alternative medicine", "Competitive medicine", "Complementary medicine", "Adverse medicine"], correct: 2,
    src: D + ', Q7' },
  { ...R, sys: "calc", q: "Sonia is also prescribed Cilazapril 500mg PO OD. In stock there are tablets of 0.25g. How many tablets should he be administered to Sonia in a single dose?",
    options: ["1 tablet", "2 tablets", "5 tablets", "10 tablets"], correct: 1,
    why: "Convert first: 0.25 g = 250 mg, so 500 mg ÷ 250 mg = 2 tablets. The dose is the question’s, for the arithmetic — it is not a real cilazapril dose.",
    src: D + ', Q8' },
  { ...R, sys: "life", q: "Sonia noticed that she takes much larger doses of medication than her daughter. Which is the main reason why children are prescribed lower doses of medications?",
    options: ["they have immature livers and kidneys", "they have under-developed bones", "more than one medication in their stomach at once makes them vomit", "they may not like the taste of larger doses"], correct: 0,
    src: D + ', Q9' },
  { ...R, sys: "admin", q: "Sonia asks the nurse if her medication can be left on her hospital side table while she has a shower. The best response from the registered nurse would be:",
    options: ["“No, it is unsafe to leave it on your side table. Please take it while I am here with you, or I can bring it back after your shower\"", "“No, I will document that you have refused this dose”", "“Yes, I’ll leave it on your side table, you can take it when you have had your shower”", "“Yes, I will document the dose now and leave it in your drawer, you can take it whenever you feel ready”"], correct: 0,
    src: D + ', Q10' },
  { ...R, sys: "law", q: "Which statement is the most accurate about controlled medications/drugs?",
    options: ["Controlled drugs are substances subject to special legal controls to reduce misuse and abuse", "Controlled drugs can be prescribed by any Registered Nurse working under a General Practitioner (GP)", "Controlled drugs may be purchased over the counter but must be explained by a pharmacist", "Controlled drugs are illicit substances, it is illegal to administer them to patients"], correct: 0,
    src: D + ', Q11' },
  { ...R, sys: "life", q: "Which strategy would be most appropriate and effective for improving medication adherence in older adults who take multiple prescribed medications?",
    options: ["Set up automated email reminders", "Discourage questions so that they don't get confused", "Ask their family/whaanau to manage their medications for them", "Use pill organisers or blister packs, and visual aids"], correct: 3,
    src: D + ', Q12' },
];

export const SAQS = [
  { ...R, sys: "life", pts: 1, q: "Describe the function of the placental barrier (1pt)",
    scenario: "Sienna and Solomon have a 4-year-old child Max, and are currently 20 weeks pregnant. They are visiting their local Practice Nurse. Answer the following questions in relation to this scenario.",
    steps: [
      "It separates maternal blood from foetal blood, and provides a non-selective barrier which many different nutrients and molecules may cross",
    ],
    src: D + ', short answer Q11 · her answer gives examples' },
  { ...R, sys: "life", pts: 1, q: "Define the term teratogenic effect (1pt)",
    scenario: "Sienna and Solomon have a 4-year-old child Max, and are currently 20 weeks pregnant. They are visiting their local Practice Nurse. Answer the following questions in relation to this scenario.",
    steps: [
      "This is an effect of a substance (such as a medication) which alters the development of a foetus during pregnancy e.g. it may change the growth and development of the brain",
    ],
    src: D + ', short answer Q12 · her answer gives examples' },
  { ...R, sys: "imm", pts: 2, q: "The nurse is administering vaccinations to Max. Identify two (2) symptoms of anaphylaxis that the nurse will need to monitor for (2pts)",
    scenario: "Sienna and Solomon have a 4-year-old child Max, and are currently 20 weeks pregnant. They are visiting their local Practice Nurse. Answer the following questions in relation to this scenario.",
    steps: [
      "Noisy breathing e.g. stridor, wheeze",
      "Persistent dizziness, they may collapse",
    ],
    src: D + ', short answer Q13 · her answer gives examples' },
  { ...R, sys: "calc", pts: 1, q: "If Max does experience anaphylaxis, he will need Adrenaline 0.3mg IM stat. Adrenaline ampoules of 1:1000 (1mg/1mL) are available. What volume of adrenaline would be administered to Max in a single dose? (1pt)",
    scenario: "Sienna and Solomon have a 4-year-old child Max, and are currently 20 weeks pregnant. They are visiting their local Practice Nurse. Answer the following questions in relation to this scenario.",
    steps: [
      "0.3mL",
    ],
    src: D + ', short answer Q14' },
  { ...R, sys: "law", pts: 2, q: "Sienna has been invited to participate in a clinical trial that evaluates the effectiveness of playing music while pregnant to improve the sleep of newborn infant. Identify and describe one (1) ethical consideration of Sienna participating in a clinical trial? (2pts)",
    scenario: "Sienna and Solomon have a 4-year-old child Max, and are currently 20 weeks pregnant. They are visiting their local Practice Nurse. Answer the following questions in relation to this scenario.",
    any: 1,
    steps: [
      "Informed consent: Sienna needs to know all of the information about the trial, the potential benefits, and the potential risks to her and the unborn foetus, before Sienna agrees to take part.",
      "Informed consent: Sienna can remove her consent at any time, even if she agrees to take part in the study at the start.",
    ],
    src: D + ', short answer Q15 · her answer gives examples' },
];
