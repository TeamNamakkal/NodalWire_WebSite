// US payroll tax calculation — 2026 IRS Publication 15-T Percentage Method for
// Automated Payroll Systems (Worksheet 1A), plus FICA. Figures below are printed
// directly from the 2026 Pub 15-T (irs.gov/pub/irs-pdf/p15t.pdf) and the SSA's
// 2026 wage-base announcement. Re-verify against the current-year Pub 15-T
// before relying on this for a new tax year.

const PAY_PERIODS_PER_YEAR = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12
};

const SOCIAL_SECURITY_RATE = 0.062;
const SOCIAL_SECURITY_WAGE_BASE_2026 = 184500;
const MEDICARE_RATE = 0.0145;

// Each row: { over, notOver, base, rate, subtractFrom }
// tentativeWithholding = base + rate * (adjustedAnnualWage - subtractFrom)
const FEDERAL_BRACKETS_2026 = {
  standard: {
    single: [
      { over: 0, notOver: 7500, base: 0, rate: 0, subtractFrom: 0 },
      { over: 7500, notOver: 19900, base: 0, rate: 0.10, subtractFrom: 7500 },
      { over: 19900, notOver: 57900, base: 1240, rate: 0.12, subtractFrom: 19900 },
      { over: 57900, notOver: 113200, base: 5800, rate: 0.22, subtractFrom: 57900 },
      { over: 113200, notOver: 209275, base: 17966, rate: 0.24, subtractFrom: 113200 },
      { over: 209275, notOver: 263725, base: 41024, rate: 0.32, subtractFrom: 209275 },
      { over: 263725, notOver: 648100, base: 58448, rate: 0.35, subtractFrom: 263725 },
      { over: 648100, notOver: Infinity, base: 192979.25, rate: 0.37, subtractFrom: 648100 }
    ],
    married: [
      { over: 0, notOver: 19300, base: 0, rate: 0, subtractFrom: 0 },
      { over: 19300, notOver: 44100, base: 0, rate: 0.10, subtractFrom: 19300 },
      { over: 44100, notOver: 120100, base: 2480, rate: 0.12, subtractFrom: 44100 },
      { over: 120100, notOver: 230700, base: 11600, rate: 0.22, subtractFrom: 120100 },
      { over: 230700, notOver: 422850, base: 35932, rate: 0.24, subtractFrom: 230700 },
      { over: 422850, notOver: 531750, base: 82048, rate: 0.32, subtractFrom: 422850 },
      { over: 531750, notOver: 788000, base: 116896, rate: 0.35, subtractFrom: 531750 },
      { over: 788000, notOver: Infinity, base: 206583.50, rate: 0.37, subtractFrom: 788000 }
    ],
    head_of_household: [
      { over: 0, notOver: 15550, base: 0, rate: 0, subtractFrom: 0 },
      { over: 15550, notOver: 33250, base: 0, rate: 0.10, subtractFrom: 15550 },
      { over: 33250, notOver: 83000, base: 1770, rate: 0.12, subtractFrom: 33250 },
      { over: 83000, notOver: 121250, base: 7740, rate: 0.22, subtractFrom: 83000 },
      { over: 121250, notOver: 217300, base: 16155, rate: 0.24, subtractFrom: 121250 },
      { over: 217300, notOver: 271750, base: 39207, rate: 0.32, subtractFrom: 217300 },
      { over: 271750, notOver: 656150, base: 56631, rate: 0.35, subtractFrom: 271750 },
      { over: 656150, notOver: Infinity, base: 191171.00, rate: 0.37, subtractFrom: 656150 }
    ]
  },
  higher: {
    single: [
      { over: 0, notOver: 8050, base: 0, rate: 0, subtractFrom: 0 },
      { over: 8050, notOver: 14250, base: 0, rate: 0.10, subtractFrom: 8050 },
      { over: 14250, notOver: 33250, base: 620, rate: 0.12, subtractFrom: 14250 },
      { over: 33250, notOver: 60900, base: 2900, rate: 0.22, subtractFrom: 33250 },
      { over: 60900, notOver: 108938, base: 8983, rate: 0.24, subtractFrom: 60900 },
      { over: 108938, notOver: 136163, base: 20512, rate: 0.32, subtractFrom: 108938 },
      { over: 136163, notOver: 328350, base: 29224, rate: 0.35, subtractFrom: 136163 },
      { over: 328350, notOver: Infinity, base: 96489.63, rate: 0.37, subtractFrom: 328350 }
    ],
    married: [
      { over: 0, notOver: 16100, base: 0, rate: 0, subtractFrom: 0 },
      { over: 16100, notOver: 28500, base: 0, rate: 0.10, subtractFrom: 16100 },
      { over: 28500, notOver: 66500, base: 1240, rate: 0.12, subtractFrom: 28500 },
      { over: 66500, notOver: 121800, base: 5800, rate: 0.22, subtractFrom: 66500 },
      { over: 121800, notOver: 217875, base: 17966, rate: 0.24, subtractFrom: 121800 },
      { over: 217875, notOver: 272325, base: 41024, rate: 0.32, subtractFrom: 217875 },
      { over: 272325, notOver: 400450, base: 58448, rate: 0.35, subtractFrom: 272325 },
      { over: 400450, notOver: Infinity, base: 103291.75, rate: 0.37, subtractFrom: 400450 }
    ],
    head_of_household: [
      { over: 0, notOver: 12075, base: 0, rate: 0, subtractFrom: 0 },
      { over: 12075, notOver: 20925, base: 0, rate: 0.10, subtractFrom: 12075 },
      { over: 20925, notOver: 45800, base: 885, rate: 0.12, subtractFrom: 20925 },
      { over: 45800, notOver: 64925, base: 3870, rate: 0.22, subtractFrom: 45800 },
      { over: 64925, notOver: 112950, base: 8077.50, rate: 0.24, subtractFrom: 64925 },
      { over: 112950, notOver: 140175, base: 19603.50, rate: 0.32, subtractFrom: 112950 },
      { over: 140175, notOver: 332375, base: 28315.50, rate: 0.35, subtractFrom: 140175 },
      { over: 332375, notOver: Infinity, base: 95585.50, rate: 0.37, subtractFrom: 332375 }
    ]
  }
};

// Pluggable per-state calculators. TX has no state income tax. Add more states
// here later without touching any other part of the calculation pipeline.
const STATE_TAX_CALCULATORS = {
  TX: () => 0
};

function calculateStateTax(state, grossPay) {
  const calc = STATE_TAX_CALCULATORS[state];
  return calc ? calc(grossPay) : 0;
}

function annualizeGrossPay(grossPayPerPeriod, payFrequency) {
  const periods = PAY_PERIODS_PER_YEAR[payFrequency];
  if (!periods) throw new Error(`Unknown pay frequency: ${payFrequency}`);
  return grossPayPerPeriod * periods;
}

function calculateFederalWithholding({ grossPayPerPeriod, payFrequency, filingStatus, w4Step2Checkbox, w4Deductions, w4OtherIncome, w4Dependents, w4ExtraWithholding }) {
  const periods = PAY_PERIODS_PER_YEAR[payFrequency];
  const annualWage = annualizeGrossPay(grossPayPerPeriod, payFrequency);

  // Worksheet 1A: adjust annual wage for Step 4(a) other income and Step 4(b) deductions
  const adjustedAnnualWage = Math.max(0, annualWage + (w4OtherIncome || 0) - (w4Deductions || 0));

  const scheduleSet = w4Step2Checkbox ? FEDERAL_BRACKETS_2026.higher : FEDERAL_BRACKETS_2026.standard;
  const brackets = scheduleSet[filingStatus] || scheduleSet.single;
  const bracket = brackets.find(b => adjustedAnnualWage >= b.over && adjustedAnnualWage < b.notOver) || brackets[brackets.length - 1];

  const tentativeAnnualWithholding = bracket.base + bracket.rate * (adjustedAnnualWage - bracket.subtractFrom);

  // Step 3: annual tax credit (dependents), simplified to a flat per-dependent amount
  const annualCredit = (w4Dependents || 0) * 2000;
  const afterCreditsAnnual = Math.max(0, tentativeAnnualWithholding - annualCredit);

  const perPeriodWithholding = afterCreditsAnnual / periods;
  const extraWithholding = w4ExtraWithholding || 0;

  return Math.max(0, round2(perPeriodWithholding + extraWithholding));
}

function calculateFica({ grossPayPerPeriod, ytdGrossBeforeThisPeriod }) {
  const ytdAfter = ytdGrossBeforeThisPeriod + grossPayPerPeriod;
  const remainingSsRoom = Math.max(0, SOCIAL_SECURITY_WAGE_BASE_2026 - ytdGrossBeforeThisPeriod);
  const ssTaxableThisPeriod = Math.min(grossPayPerPeriod, remainingSsRoom);

  const socialSecurity = round2(ssTaxableThisPeriod * SOCIAL_SECURITY_RATE);
  const medicare = round2(grossPayPerPeriod * MEDICARE_RATE);

  return { socialSecurity, medicare };
}

function calculatePayslip({
  grossPayPerPeriod,
  payFrequency,
  state,
  filingStatus,
  w4Step2Checkbox,
  w4Deductions,
  w4OtherIncome,
  w4Dependents,
  w4ExtraWithholding,
  ytdGrossBeforeThisPeriod
}) {
  const federalWithholding = calculateFederalWithholding({
    grossPayPerPeriod, payFrequency, filingStatus, w4Step2Checkbox,
    w4Deductions, w4OtherIncome, w4Dependents, w4ExtraWithholding
  });

  const { socialSecurity, medicare } = calculateFica({
    grossPayPerPeriod,
    ytdGrossBeforeThisPeriod: ytdGrossBeforeThisPeriod || 0
  });

  const stateWithholding = round2(calculateStateTax(state, grossPayPerPeriod));

  const netPay = round2(grossPayPerPeriod - federalWithholding - socialSecurity - medicare - stateWithholding);

  return {
    grossPay: round2(grossPayPerPeriod),
    federalWithholding,
    socialSecurity,
    medicare,
    stateWithholding,
    netPay
  };
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export {
  PAY_PERIODS_PER_YEAR,
  SOCIAL_SECURITY_WAGE_BASE_2026,
  SOCIAL_SECURITY_RATE,
  MEDICARE_RATE,
  annualizeGrossPay,
  calculateFederalWithholding,
  calculateFica,
  calculateStateTax,
  calculatePayslip
};
