// Static data for the Insulin Pump Finder tool.
// Ported as-is from legacy-reference/tools/insulin-pump-finder/index.html

export interface QuizOption {
  l: string
  s?: string
  v: string
}

export interface QuizQuestion {
  id: string
  e: string
  h: string
  hint: string
  opts: QuizOption[]
}

export interface Answers {
  age?: string
  dtype?: string
  inj?: string
  hypo?: string
  a1c?: string
  life?: string
  budget?: string
  ptype?: string
  auto?: string
  commit?: string
  [key: string]: string | undefined
}

export interface Pump {
  key: 'm780g' | 'ypso' | 'renu'
  name: string
  tag: string
  price: string
  pnote: string
  type: string
  avail: string
  ac: string
  india: boolean
  comingSoon?: boolean
  grad: string
  feats: string[]
  pros: string[]
  cons: string[]
  bestFor: string[]
  ctaTxt: string
  ctaUrl: string
  ctaC: string
  ctaNote?: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'age',
    e: '👤',
    h: 'What is your age group?',
    hint: 'Pump interface complexity, regulatory approvals, and caregiver monitoring features can vary by age — especially for children.',
    opts: [
      { l: 'Child — Under 13 years', v: 'child' },
      { l: 'Teen — 13 to 19 years', v: 'teen' },
      { l: 'Adult — 20 to 40 years', v: 'adult_y' },
      { l: 'Adult — 41 to 60 years', v: 'adult_m' },
      { l: 'Senior — 60 and above', v: 'senior' },
    ],
  },
  {
    id: 'dtype',
    e: '🩸',
    h: 'What type of diabetes do you have?',
    hint: 'Insulin pumps are most often prescribed for Type 1 diabetes. They can also help Type 2 patients who need intensive insulin therapy — usually three or more injections per day.',
    opts: [
      { l: 'Type 1 Diabetes', v: 't1' },
      { l: 'Type 2 — on Multiple Daily Injections', s: 'Type 2 requiring 3 or more insulin doses per day', v: 't2' },
      { l: 'Gestational / Planning Pregnancy', s: 'Diabetes during pregnancy, or trying to conceive', v: 'gest' },
      { l: 'Other / Not sure', v: 'other' },
    ],
  },
  {
    id: 'inj',
    e: '💉',
    h: 'How many insulin injections do you take per day?',
    hint: 'A pump replaces these injections with a continuous flow of insulin delivered through a tiny soft cannula placed under your skin — no repeated needle pricks.',
    opts: [
      { l: '1–2 per day', s: 'Long-acting only, or basal + one mealtime dose', v: 'low' },
      { l: '3–4 per day', s: 'Basal + mealtime boluses — standard MDI regimen', v: 'med' },
      { l: '5 or more per day', s: 'Intensive therapy with frequent corrections too', v: 'high' },
      { l: 'Not on insulin yet', s: 'Currently on oral medication only', v: 'none' },
    ],
  },
  {
    id: 'hypo',
    e: '⚠️',
    h: 'How often do you experience low blood sugar (hypoglycemia)?',
    hint: 'A "hypo" means blood sugar below 70 mg/dL — causing dizziness, shakiness, or sweating. Advanced pumps with Hybrid Closed-Loop can automatically reduce insulin before a low happens.',
    opts: [
      { l: 'Never or very rarely', s: 'Less than once a month — generally well controlled', v: 'rare' },
      { l: 'Occasionally — 1 to 3 times per week', s: 'Manageable lows; sometimes need glucose or juice', v: 'mod' },
      { l: 'Almost daily', s: 'A serious concern — lows are disrupting my life', v: 'freq' },
    ],
  },
  {
    id: 'a1c',
    e: '📊',
    h: 'What was your most recent HbA1c reading?',
    hint: "HbA1c reflects your average blood sugar over 3 months. The general target for most adults is below 7% (53 mmol/mol). Pick the closest range if you don't have the exact number.",
    opts: [
      { l: 'Below 7% — well within target', v: 'good' },
      { l: '7–8% — slightly above target', v: 'mod' },
      { l: '8–10% — above target, needs improvement', v: 'high' },
      { l: 'Above 10% — significantly elevated', v: 'vhigh' },
      { l: "I don't know my HbA1c", v: 'dk' },
    ],
  },
  {
    id: 'life',
    e: '🏃',
    h: 'How would you describe your typical lifestyle?',
    hint: 'Very active users — sports, gym, swimming, frequent travel — often benefit from more discreet, waterproof pump designs.',
    opts: [
      { l: 'Mostly sedentary', s: 'Desk job; limited regular physical activity', v: 'sed' },
      { l: 'Moderately active', s: 'Regular walks, light exercise, household activities', v: 'mod' },
      { l: 'Very active', s: 'Sports, gym, swimming, outdoor activities, frequent travel', v: 'act' },
    ],
  },
  {
    id: 'budget',
    e: '💰',
    h: 'What is your one-time budget for the pump device?',
    hint: 'This is the device cost only. Consumables — infusion sets and CGM sensors — typically add ₹10,000–₹25,000 per month. Check whether your health insurance covers insulin pump therapy.',
    opts: [
      { l: 'Under ₹2 Lakh', s: 'Looking for the most affordable option available', v: 'low' },
      { l: '₹2 – ₹3.5 Lakh', s: '₹2,00,000 to ₹3,50,000', v: 'med' },
      { l: '₹3.5 – ₹5 Lakh', s: '₹3,50,000 to ₹5,00,000', v: 'high' },
      { l: 'Above ₹5 Lakh / Insurance Covered', s: 'Budget is not the primary constraint', v: 'vhigh' },
    ],
  },
  {
    id: 'ptype',
    e: '🔧',
    h: 'Tubed or tubeless patch pump — do you have a preference?',
    hint: 'A tubed pump clips to your pocket or belt with thin tubing to a site on your skin. A patch (tubeless) pump sticks directly onto your skin — no external device, no visible tubing.',
    opts: [
      { l: 'Strongly prefer tubeless / patch', s: 'Discretion is important — I want nothing external or visible', v: 'patch' },
      { l: 'Prefer tubed pump', s: 'Fine with tubing — I want proven, established technology', v: 'tubed' },
      { l: 'No strong preference', s: 'Open to either — show me the best fit', v: 'open' },
    ],
  },
  {
    id: 'auto',
    e: '🤖',
    h: 'How important is automated insulin adjustment (Hybrid Closed-Loop)?',
    hint: 'Hybrid Closed-Loop means the pump reads your glucose every 5 minutes and automatically adjusts insulin — like a partial artificial pancreas. It reduces the mental burden of managing diabetes significantly.',
    opts: [
      { l: 'Very important', s: 'I want as much automation as possible', v: 'high' },
      { l: 'Nice to have', s: 'Appealing, but not my top priority', v: 'med' },
      { l: 'Not needed', s: "I'm comfortable managing insulin manually", v: 'low' },
    ],
  },
  {
    id: 'commit',
    e: '📚',
    h: 'Are you ready to commit to learning pump therapy?',
    hint: 'Pumps have a learning curve — clinics typically provide 2–4 weeks of training. You also need to change the small infusion set (a soft tube under the skin) every 2–3 days to prevent infection.',
    opts: [
      { l: 'Yes — fully committed', s: 'Ready to attend training and follow the maintenance routine', v: 'yes' },
      { l: 'Yes — with proper clinic support', s: 'Happy to commit given thorough guidance from my hospital', v: 'train' },
      { l: 'Still deciding', s: "I'm still evaluating whether pump therapy is right for me", v: 'unsure' },
    ],
  },
]

export const PUMPS: Record<Pump['key'], Pump> = {
  m780g: {
    key: 'm780g',
    name: 'Medtronic MiniMed 780G',
    tag: 'Most Advanced Closed-Loop System in India',
    price: '₹3,00,000 – ₹3,50,000',
    pnote: 'Distributor-listed prices in Pune, Hyderabad & Delhi — verify before purchase',
    type: 'Tubed · Hybrid Closed-Loop',
    avail: 'Available Now',
    ac: 'pt-green',
    india: true,
    grad: 'linear-gradient(140deg,#1d4ed8,#0ea5e9)',
    feats: [
      'SmartGuard™ automatically adjusts insulin every 5 minutes, 24/7, based on live CGM readings',
      'Meal Detection Technology — auto-corrects if you miss or under-dose a meal bolus',
      'Approved in India for ages 7 and above with Type 1 Diabetes (Medtronic India)',
      'Simplera Sync CGM sensor — no fingerstick calibrations; easy peel-and-apply',
      'Up to 5 family members can monitor your glucose in real time via CareLink™ Connect app',
      'Waterproof to 3.6 m depth for 24 hours — safe for swimming and bathing',
    ],
    pros: [
      'Only pump in India with full Hybrid Closed-Loop automation — greatest day-to-day relief',
      'Proven distributor network in Delhi, Mumbai, Hyderabad, Pune, Chennai',
      'SmartGuard significantly cuts overnight hypoglycemia risk',
      'Caregiver remote monitoring — essential for children and elderly',
      'Personalised glucose target settable down to 100 mg/dL',
    ],
    cons: [
      'Highest upfront cost of India-available options',
      'Tubed design — cannot match patch pump discretion',
      'CGM consumables add ~₹15,000–22,000/month on top of device cost',
      'Steepest learning curve — requires structured training sessions',
    ],
    bestFor: ['Type 1 Diabetes (age 7+)', 'Frequent hypoglycemia', 'Maximum automation', 'Children & Teens', 'Pregnancy with T1D (doctor supervision)'],
    ctaTxt: 'Enquire at Medtronic India',
    ctaUrl: 'https://www.medtronic-diabetes.in',
    ctaC: 'c-jade',
  },
  ypso: {
    key: 'ypso',
    name: 'mylife YpsoPump',
    tag: 'Swiss-Engineered · Intuitive · App-Controlled',
    price: '~ ₹3,50,000',
    pnote: 'Ypsomed India Pvt. Ltd. listed price (New Delhi) — verify with your local distributor',
    type: 'Tubed · OLED Touchscreen · Open-Loop',
    avail: 'Available Now',
    ac: 'pt-green',
    india: true,
    grad: 'linear-gradient(140deg,#0a7c6e,#12a898)',
    feats: [
      'OLED icon-based touchscreen — language-independent, extremely easy to navigate',
      'mylife App: view glucose trend, deliver boluses from your smartphone without touching the pump',
      'Compatible with FreeStyle Libre 2/3 and Dexcom G6 — CGMs widely available in India',
      'IPX8 waterproof — up to 1 m for 60 minutes; safe for bathing',
      '360° rotating infusion set (Orbit) — easy site changes in any position',
      '⚠ CamAPS FX closed-loop system is NOT marketed in India (Europe/Australia/NZ only) — open-loop use here',
    ],
    pros: [
      'Most beginner-friendly interface of any pump currently in India',
      'Compact and lightweight (83g) — sits discreetly in a pocket',
      'Works with FreeStyle Libre sensors — popular and more affordable in India',
      'Established India presence through Ypsomed India Pvt. Ltd.',
      'Infusion set and reservoir changed independently — flexible routine',
    ],
    cons: [
      'No Hybrid Closed-Loop in India — CamAPS FX not marketed here',
      'Must manually deliver all meal boluses yourself',
      'Similar price to 780G but without auto-correction capability',
      'Tubed — not suitable when maximum discretion is the top priority',
    ],
    bestFor: ['First-time pump users', 'Seniors & less tech-savvy patients', 'Type 1 & Type 2 MDI', 'Moderate-to-high budget', 'Prefers simplicity over automation'],
    ctaTxt: 'Enquire at Ypsomed India',
    ctaUrl: 'https://www.mylife-diabetescare.com',
    ctaC: 'c-jade',
  },
  renu: {
    key: 'renu',
    name: 'Renu MedTech InsuPatch',
    tag: "🇮🇳 India's First Homegrown Patch Pump — Coming Soon",
    price: 'Expected well below ₹2 Lakh',
    pnote: 'Exact launch price not confirmed — still in prototype/trial stage as of late 2025',
    type: 'Tubeless Patch · Made in India',
    avail: 'NOT YET AVAILABLE — Prototype Stage',
    ac: 'pt-red',
    india: false,
    comingSoon: true,
    grad: 'linear-gradient(140deg,#d97706,#f59e0b)',
    feats: [
      'Tubeless — patches directly onto skin (abdomen, upper arm, thigh); no external device',
      'No tubing, no clip-on unit — completely hidden under clothing at all times',
      'Smartphone app controlled — bolus from your phone',
      'Engineered for Indian conditions — climate, attire, and lifestyle considered',
      'Targeting a price point at a fraction of imported pump costs',
    ],
    pros: [
      'Maximum discretion — truly invisible under clothing',
      'Expected to be the most affordable insulin pump in India when launched',
      'Purpose-built for Indian users — local service network anticipated',
      'No import dependency or foreign exchange markup',
    ],
    cons: [
      '⚠ NOT commercially available as of March 2026 — prototype/trial stage only',
      'No real-world long-term safety or effectiveness data yet',
      'Exact price, CGM compatibility, and full features not officially confirmed',
      'No Hybrid Closed-Loop planned in the initial release',
    ],
    bestFor: ['Budget-conscious patients', 'Maximum discretion priority', 'Active lifestyle & sports', 'Children & Teens (once launched)', 'Early adopters willing to wait'],
    ctaTxt: 'Register Interest with Renu MedTech',
    ctaUrl: 'https://www.renumedtech.com',
    ctaC: 'c-amb',
    ctaNote: '⏳ Not commercially available yet. Contact manufacturer to register interest and be notified at launch.',
  },
}
