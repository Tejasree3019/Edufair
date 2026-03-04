import type { User, Institution, Course, Scholarship } from '@/types';

/**
 * FEE RECOMMENDATION & COST ANALYSIS ENGINE
 * 
 * Provides intelligent financial planning:
 * - Cost breakdown analysis
 * - Funding source optimization
 * - Financial feasibility scoring
 * - ROI calculation
 */

export interface CostBreakdown {
  tuition: number;
  livingExpenses: number;
  otherExpenses: number;
  total: number;
}

export interface FundingPlan {
  scholarshipFunding: number;
  grantFunding: number;
  loanRecommended: number;
  selfFunded: number;
  total: number;
}

export interface FinancialAnalysis {
  costBreakdown: CostBreakdown;
  fundingPlan: FundingPlan;
  feasibilityScore: number;
  affordabilityAnalysis: string;
  futureEarningPotential: number;
  roiScore: number;
  riskAssessment: string;
}

/**
 * Calculate cost breakdown for a student's education
 */
export function calculateCostBreakdown(
  institution: Institution,
  course: Course,
  yearsOfStudy: number
): CostBreakdown {
  const tuition = (course.tuition_annual || institution.average_tuition_annual || 0) * yearsOfStudy;
  const livingExpenses = (institution.average_living_costs_annual || 0) * yearsOfStudy;
  const otherExpenses = tuition * 0.05; // Assume 5% for books, materials, etc.

  return {
    tuition,
    livingExpenses,
    otherExpenses,
    total: tuition + livingExpenses + otherExpenses,
  };
}

/**
 * Calculate optimal funding plan based on available scholarships and student financial situation
 */
export function calculateFundingPlan(
  student: User,
  totalCost: number,
  availableScholarships: Scholarship[]
): FundingPlan {
  // Sort scholarships by amount (highest first)
  const sortedScholarships = [...availableScholarships].sort(
    (a, b) => b.scholarship_amount - a.scholarship_amount
  );

  let scholarshipFunding = 0;
  let grantFunding = 0;

  // Allocate scholarship funding
  for (const scholarship of sortedScholarships) {
    const amount = Math.min(scholarship.scholarship_amount, totalCost - scholarshipFunding);
    if (scholarship.amount_type === 'full_tuition') {
      scholarshipFunding += amount;
    } else if (scholarship.amount_type === 'partial') {
      scholarshipFunding += amount * 0.5;
    } else {
      scholarshipFunding += amount;
    }

    if (scholarshipFunding >= totalCost * 0.8) break;
  }

  // Estimate grant funding based on family income
  const familyIncome = student.family_income || 0;
  if (familyIncome < 20000) {
    grantFunding = totalCost * 0.3; // 30% from government grants
  } else if (familyIncome < 50000) {
    grantFunding = totalCost * 0.15; // 15% from grants
  } else {
    grantFunding = totalCost * 0.05; // 5% from grants
  }

  const fundedAmount = scholarshipFunding + grantFunding;
  const remainingCost = Math.max(0, totalCost - fundedAmount);

  // Recommend loan amount based on remaining cost
  const loanRecommended = remainingCost * 0.6; // Only recommend 60% as loan
  const selfFunded = remainingCost * 0.4; // 40% should come from family/savings

  return {
    scholarshipFunding: Math.min(scholarshipFunding, totalCost),
    grantFunding: Math.min(grantFunding, totalCost - scholarshipFunding),
    loanRecommended: Math.max(0, loanRecommended),
    selfFunded: Math.max(0, selfFunded),
    total: Math.min(scholarshipFunding, totalCost) + 
           Math.min(grantFunding, totalCost - scholarshipFunding) + 
           Math.max(0, loanRecommended) + 
           Math.max(0, selfFunded),
  };
}

/**
 * Calculate Financial Feasibility Score (0-1)
 * Determines how affordable this education is for the student
 */
export function calculateFinancialFeasibilityScore(
  student: User,
  totalCost: number,
  fundingPlan: FundingPlan
): number {
  const familyIncome = student.family_income || 20000;
  
  // Income-to-cost ratio (lower is better)
  const costToIncomeRatio = totalCost / (familyIncome * 4); // 4 years average
  const incomeAffordability = Math.max(0, 1 - costToIncomeRatio / 2);

  // Funding coverage
  const fundingCoverage = (fundingPlan.scholarshipFunding + fundingPlan.grantFunding) / totalCost;

  // Self-funded burden
  const selfFundBurden = Math.max(0, 1 - (fundingPlan.selfFunded / familyIncome));

  // Loan burden (should not exceed 50% of future earnings)
  const estimatedFutureEarnings = student.academic_grade ? student.academic_grade * 5000 : 50000; // Rough estimate
  const loanBurden = Math.max(0, 1 - (fundingPlan.loanRecommended / (estimatedFutureEarnings * 5)));

  // Weighted score
  const score = (
    incomeAffordability * 0.25 +
    fundingCoverage * 0.35 +
    selfFundBurden * 0.20 +
    loanBurden * 0.20
  );

  return Math.min(1, Math.max(0, score));
}

/**
 * Generate affordability analysis text
 */
export function generateAffordabilityAnalysis(
  student: User,
  totalCost: number,
  fundingPlan: FundingPlan,
  feasibilityScore: number
): string {
  const familyIncome = student.family_income || 0;
  const costToIncomeRatio = totalCost / Math.max(familyIncome, 1);

  let analysis = '';

  if (feasibilityScore >= 0.8) {
    analysis = `✅ Highly Feasible: This education is affordable for your financial situation. `;
  } else if (feasibilityScore >= 0.6) {
    analysis = `✓ Moderately Feasible: This education is manageable with some financial planning. `;
  } else if (feasibilityScore >= 0.4) {
    analysis = `⚠️ Challenging: This education will require significant financial planning. `;
  } else {
    analysis = `❌ Difficult: This education may present substantial financial challenges. `;
  }

  analysis += `Total cost is ${costToIncomeRatio.toFixed(1)}x your annual family income. `;

  if (fundingPlan.scholarshipFunding + fundingPlan.grantFunding > 0) {
    const fundingPercentage = ((fundingPlan.scholarshipFunding + fundingPlan.grantFunding) / totalCost * 100).toFixed(0);
    analysis += `${fundingPercentage}% is covered by scholarships and grants. `;
  }

  if (fundingPlan.loanRecommended > 0) {
    analysis += `We recommend a loan of up to ${fundingPlan.loanRecommended.toFixed(0)}. `;
  }

  analysis += `Please discuss this plan with your family to ensure financial readiness.`;

  return analysis;
}

/**
 * Calculate Return on Investment (ROI) Score
 * Based on earning potential vs education cost
 */
export function calculateROIScore(
  course: Course,
  totalCost: number,
  yearsOfStudy: number
): number {
  const avgStartingSalary = course.avg_starting_salary || 40000;
  const employmentRate = course.employment_rate || 0.8;

  // Career earnings projection (estimate 35-year career)
  const careerEarnings = avgStartingSalary * employmentRate * 35;
  
  // Annual return percentage
  const totalReturn = careerEarnings - totalCost;
  const annualROI = (totalReturn / totalCost / yearsOfStudy) * 100;

  // Normalize to 0-1 scale (target 15% annual ROI)
  const roiScore = Math.min(1, Math.max(0, annualROI / 15 / 100));

  return roiScore;
}

/**
 * Generate risk assessment based on various factors
 */
export function generateRiskAssessment(
  student: User,
  totalCost: number,
  fundingPlan: FundingPlan,
  institution: any
): string {
  const familyIncome = student.family_income || 0;
  const risks: string[] = [];

  // Income-based risks
  if (totalCost > familyIncome * 5) {
    risks.push('High cost relative to annual family income');
  }

  // Funding risks
  if (fundingPlan.loanRecommended > 30000) {
    risks.push('Substantial loan burden - consider career earning potential');
  }

  if (fundingPlan.scholarshipFunding + fundingPlan.grantFunding < totalCost * 0.3) {
    risks.push('Limited grant/scholarship coverage - heavy reliance on personal funding');
  }

  // Institution risks
  if (institution && institution.scam_risk_level === 'medium') {
    risks.push('Moderate credibility concerns with institution');
  }

  if (institution && institution.scam_risk_level === 'high') {
    risks.push('High credibility concerns - verify institution legitimacy');
  }

  // Employment risks
  if (institution && institution.employment_outcome_rate && institution.employment_outcome_rate < 0.6) {
    risks.push('Employment outcomes below average - verify career prospects');
  }

  if (risks.length === 0) {
    return '✅ No significant financial risks identified.';
  }

  return `⚠️ Risks identified: ${risks.join('; ')}.`;
}

/**
 * Comprehensive financial analysis
 */
export function generateFinancialAnalysis(
  student: User,
  institution: Institution,
  course: Course,
  availableScholarships: Scholarship[],
  yearsOfStudy: number = 4
): FinancialAnalysis {
  // Calculate cost breakdown
  const costBreakdown = calculateCostBreakdown(institution, course, yearsOfStudy);

  // Calculate funding plan
  const fundingPlan = calculateFundingPlan(student, costBreakdown.total, availableScholarships);

  // Calculate feasibility
  const feasibilityScore = calculateFinancialFeasibilityScore(student, costBreakdown.total, fundingPlan);

  // Generate affordability analysis
  const affordabilityAnalysis = generateAffordabilityAnalysis(
    student,
    costBreakdown.total,
    fundingPlan,
    feasibilityScore
  );

  // Calculate future earning potential
  const futureEarningPotential = (course.avg_starting_salary || 40000) * (course.employment_rate || 0.8);

  // Calculate ROI
  const roiScore = calculateROIScore(course, costBreakdown.total, yearsOfStudy);

  // Generate risk assessment
  const riskAssessment = generateRiskAssessment(student, costBreakdown.total, fundingPlan, institution);

  return {
    costBreakdown,
    fundingPlan,
    feasibilityScore,
    affordabilityAnalysis,
    futureEarningPotential,
    roiScore,
    riskAssessment,
  };
}
