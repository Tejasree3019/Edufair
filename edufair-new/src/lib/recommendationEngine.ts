import type { User, Scholarship, ScholarshipRecommendation } from '@/types';

/**
 * EDUFAIR RECOMMENDATION ENGINE
 * 
 * This module contains the core algorithms for:
 * 1. Scholarship matching and filtering
 * 2. Suitability scoring
 * 3. Success probability estimation
 * 4. Priority ranking
 */

/**
 * Helper function to get field value supporting both snake_case and camelCase
 */
function getScholarshipField(scholarship: any, snakeCase: string, camelCase: string): any {
  return scholarship[snakeCase] !== undefined ? scholarship[snakeCase] : scholarship[camelCase];
}

/**
 * Check if a student meets basic eligibility criteria for a scholarship
 */
export function checkEligibility(student: User, scholarship: Scholarship): {
  isEligible: boolean;
  failedCriteria: string[];
} {
  const failedCriteria: string[] = [];

  // Check academic grade
  const minGrade = getScholarshipField(scholarship, 'min_academic_grade', 'minGPA');
  const maxGrade = getScholarshipField(scholarship, 'max_academic_grade', 'maxGPA');
  if (minGrade && (student.academic_grade || 0) < minGrade) {
    failedCriteria.push(`Academic grade below minimum of ${minGrade}`);
  }
  if (maxGrade && (student.academic_grade || 0) > maxGrade) {
    failedCriteria.push(`Academic grade exceeds maximum of ${maxGrade}`);
  }

  // Check family income
  if (scholarship.min_family_income && (student.family_income || 0) < scholarship.min_family_income) {
    failedCriteria.push(`Family income below minimum of ${scholarship.min_family_income}`);
  }
  if (scholarship.max_family_income && (student.family_income || 0) > scholarship.max_family_income) {
    failedCriteria.push(`Family income exceeds maximum of ${scholarship.max_family_income}`);
  }

  // Check country eligibility (support both naming conventions)
  const eligibleCountries = getScholarshipField(scholarship, 'eligible_countries', 'eligibleCountries');
  if (eligibleCountries?.length && !eligibleCountries.includes(student.country || '')) {
    failedCriteria.push(`Country not in eligible list`);
  }

  // Check region eligibility
  if (scholarship.eligible_regions?.length && !scholarship.eligible_regions.includes(student.region_state || '')) {
    failedCriteria.push(`Region not in eligible list`);
  }

  // Check education level (support both naming conventions)
  const eligibleLevels = getScholarshipField(scholarship, 'eligible_education_levels', 'eligibleLevels');
  if (eligibleLevels?.length && student.education_level && !eligibleLevels.includes(student.education_level)) {
    failedCriteria.push(`Education level not eligible`);
  }

  // Check field of study (support both naming conventions)
  const eligibleFields = getScholarshipField(scholarship, 'eligible_fields_of_study', 'eligibleFields');
  if (eligibleFields?.length && !eligibleFields.includes(student.preferred_field_of_study || '')) {
    failedCriteria.push(`Field of study not eligible`);
  }

  return {
    isEligible: failedCriteria.length === 0,
    failedCriteria,
  };
}

/**
 * Calculate Eligibility Match Score (0-1)
 * Measures how well the student matches the scholarship requirements
 */
export function calculateEligibilityMatchScore(student: User, scholarship: Scholarship): number {
  let score = 0;
  let factors = 0;

  // Academic grade match (30 points)
  const minGrade = getScholarshipField(scholarship, 'min_academic_grade', 'minGPA');
  const maxGrade = getScholarshipField(scholarship, 'max_academic_grade', 'maxGPA');
  if (minGrade && maxGrade) {
    const gradeRange = maxGrade - minGrade;
    const studentGrade = student.academic_grade || 0;
    const gradePosition = (studentGrade - minGrade) / gradeRange;
    score += Math.min(1, Math.max(0, gradePosition)) * 0.30;
    factors++;
  }

  // Family income match (20 points)
  if (scholarship.min_family_income && scholarship.max_family_income) {
    const incomeRange = scholarship.max_family_income - scholarship.min_family_income;
    const studentIncome = student.family_income || 0;
    const incomePosition = (studentIncome - scholarship.min_family_income) / incomeRange;
    score += Math.min(1, Math.max(0, incomePosition)) * 0.20;
    factors++;
  }

  // Field of study match (25 points) - support both naming conventions
  const eligibleFields = getScholarshipField(scholarship, 'eligible_fields_of_study', 'eligibleFields');
  if (eligibleFields?.length) {
    const matches = eligibleFields.includes(student.preferred_field_of_study || '');
    score += matches ? 0.25 : 0;
    factors++;
  }

  // Country match (15 points) - support both naming conventions
  const eligibleCountries = getScholarshipField(scholarship, 'eligible_countries', 'eligibleCountries');
  if (eligibleCountries?.length) {
    const matches = eligibleCountries.includes(student.country || '');
    score += matches ? 0.15 : 0;
    factors++;
  }

  // Education level match (10 points) - support both naming conventions
  const eligibleLevels = getScholarshipField(scholarship, 'eligible_education_levels', 'eligibleLevels');
  if (eligibleLevels?.length && student.education_level) {
    const matches = eligibleLevels.includes(student.education_level);
    score += matches ? 0.10 : 0;
    factors++;
  }

  return factors > 0 ? score : 0;
}

/**
 * Calculate Success Probability (0-1)
 * Estimates likelihood of scholarship approval based on multiple factors
 */
export function calculateSuccessProbability(
  student: User,
  scholarship: Scholarship,
  eligibilityScore: number
): number {
  let probability = eligibilityScore * 0.40; // Eligibility is 40% of probability

  // Historical acceptance rate impact (30%)
  const acceptanceRate = scholarship.historical_acceptance_rate || 0.5;
  probability += acceptanceRate * 0.30;

  // Credibility and institutional trust (20%)
  probability += (scholarship.credibility_score || 0.5) * 0.20;

  // Risk level adjustment (10%)
  const riskMultiplier = {
    low: 1.0,
    medium: 0.8,
    high: 0.5,
  };
  probability *= riskMultiplier[scholarship.risk_level] || 0.8;

  // Competition level adjustment based on awards available
  if (scholarship.total_awards_available && scholarship.previous_year_awardees) {
    const competitionRatio = scholarship.previous_year_awardees / Math.max(scholarship.total_awards_available, 1);
    const competitionAdjustment = 1 - Math.min(competitionRatio, 0.5); // Max 50% reduction
    probability *= competitionAdjustment;
  }

  return Math.min(1, Math.max(0, probability));
}

/**
 * Calculate Reward vs Competition Score (0-1)
 * Higher value = better reward relative to competition
 */
export function calculateRewardVsCompetition(scholarship: Scholarship): number {
  // Base reward score (higher amounts = higher score) - support both naming conventions
  const amount = getScholarshipField(scholarship, 'scholarship_amount', 'amount') || 0;
  const baseReward = Math.min(1, amount / 50000); // Normalize to 50k max

  // Competition factor
  let competitionFactor = 0.5; // Default medium competition
  
  const totalAwards = getScholarshipField(scholarship, 'total_awards_available', 'awardCount');
  const prevAwardees = getScholarshipField(scholarship, 'previous_year_awardees', 'previousAwardees');
  
  if (totalAwards && prevAwardees) {
    const acceptanceRate = prevAwardees / totalAwards;
    competitionFactor = acceptanceRate; // Lower competition = higher acceptance rate
  }

  // Calculate final score: higher reward + lower competition = higher score
  return (baseReward * 0.6 + competitionFactor * 0.4);
}

/**
 * Calculate Overall Suitability Score (0-1)
 * Weighted combination of all factors
 */
export function calculateOverallSuitabilityScore(
  eligibilityScore: number,
  credibilityScore: number,
  rewardVsCompetition: number
): number {
  return (
    eligibilityScore * 0.45 +      // 45% - How well student matches
    credibilityScore * 0.30 +       // 30% - Scholarship credibility
    rewardVsCompetition * 0.25      // 25% - Value for effort
  );
}

/**
 * Generate matching reasons based on student-scholarship alignment
 */
export function generateMatchingReasons(student: User, scholarship: Scholarship): string[] {
  const reasons: string[] = [];

  // Field of study match - support both naming conventions
  const eligibleFields = getScholarshipField(scholarship, 'eligible_fields_of_study', 'eligibleFields');
  if (eligibleFields?.includes(student.preferred_field_of_study || '')) {
    reasons.push(`Matches your preferred field: ${student.preferred_field_of_study}`);
  }

  // Country match - support both naming conventions
  const eligibleCountries = getScholarshipField(scholarship, 'eligible_countries', 'eligibleCountries');
  if (eligibleCountries?.includes(student.country || '')) {
    reasons.push(`Available in your country: ${student.country}`);
  }

  // Grade match - support both naming conventions
  const minGrade = getScholarshipField(scholarship, 'min_academic_grade', 'minGPA');
  if (minGrade && (student.academic_grade || 0) >= minGrade) {
    reasons.push(`Your academic performance meets the requirements`);
  }

  // Income match
  if ((student.family_income || 0) >= (scholarship.min_family_income || 0) && 
      (student.family_income || 0) <= (scholarship.max_family_income || Infinity)) {
    reasons.push(`Your family income is within the eligible range`);
  }

  // Credibility - support both naming conventions
  const credibility = getScholarshipField(scholarship, 'credibility_score', 'credibilityScore') || 0;
  if (credibility >= 0.7) {
    reasons.push(`This is a highly credible scholarship provider`);
  }

  // Living expenses - support both naming conventions
  const coversExpenses = getScholarshipField(scholarship, 'covers_living_expenses', 'coversLivingExpenses');
  if (coversExpenses) {
    reasons.push(`Covers living expenses in addition to tuition`);
  }

  return reasons.length > 0 ? reasons : ['You meet the basic eligibility criteria'];
}

/**
 * Identify risk factors for a specific scholarship match
 */
export function identifyRiskFactors(student: User, scholarship: Scholarship): string[] {
  const risks: string[] = [];

  // Risk level - support both naming conventions
  const riskLevel = getScholarshipField(scholarship, 'risk_level', 'riskLevel');
  if (riskLevel === 'high') {
    risks.push('High-risk scholarship - verify legitimacy before applying');
  }

  // Credibility - support both naming conventions
  const credibility = getScholarshipField(scholarship, 'credibility_score', 'credibilityScore') || 0.5;
  if (credibility < 0.6) {
    risks.push('Lower credibility score - research institution thoroughly');
  }

  // Acceptance rate - support both naming conventions
  const acceptanceRate = getScholarshipField(scholarship, 'historical_acceptance_rate', 'acceptanceRate') || 0.5;
  if (acceptanceRate < 0.2) {
    risks.push('Very competitive - low historical acceptance rate');
  }

  // Deadline - support both naming conventions
  const deadline = getScholarshipField(scholarship, 'application_deadline', 'deadline');
  if (deadline) {
    const deadlineDate = new Date(deadline);
    const daysUntilDeadline = Math.floor((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDeadline < 7) {
      risks.push(`Deadline approaching - only ${daysUntilDeadline} days left`);
    }
  }

  // Award count - support both naming conventions
  const awardCount = getScholarshipField(scholarship, 'total_awards_available', 'awardCount') || 0;
  if (awardCount < 10) {
    risks.push('Limited number of awards available');
  }

  return risks;
}

/**
 * Rank scholarships for a student
 * Returns sorted list by overall suitability score
 */
export function rankScholarshipsForStudent(
  student: User,
  scholarships: Scholarship[],
  recommendations: Map<string, Partial<ScholarshipRecommendation>>
): Array<{ scholarship: Scholarship; score: number; priority: 'high' | 'medium' | 'low' }> {
  const ranked = scholarships
    .filter(s => {
      const eligibility = checkEligibility(student, s);
      return eligibility.isEligible;
    })
    .map(scholarship => {
      const rec = recommendations.get(scholarship.id) || {};
      const score = rec.overall_suitability_score || 0;
      
      let priority: 'high' | 'medium' | 'low' = 'medium';
      if (score >= 0.75) priority = 'high';
      else if (score < 0.5) priority = 'low';

      return { scholarship, score, priority };
    })
    .sort((a, b) => b.score - a.score);

  return ranked;
}

/**
 * Generate comprehensive scholarship recommendation
 */
export function generateScholarshipRecommendation(
  student: User,
  scholarship: Scholarship
): Partial<ScholarshipRecommendation> {
  const { isEligible, failedCriteria } = checkEligibility(student, scholarship);

  if (!isEligible) {
    return {
      eligibility_match_score: 0,
      credibility_score: getScholarshipField(scholarship, 'credibility_score', 'credibilityScore') || 0.5,
      reward_vs_competition_score: calculateRewardVsCompetition(scholarship),
      overall_suitability_score: 0,
      matching_reasons: [],
      risk_factors: failedCriteria,
      priority_level: 'low',
    };
  }

  const eligibilityScore = calculateEligibilityMatchScore(student, scholarship);
  const credibilityScore = getScholarshipField(scholarship, 'credibility_score', 'credibilityScore') || 0.5;
  const rewardVsCompetition = calculateRewardVsCompetition(scholarship);
  const overallScore = calculateOverallSuitabilityScore(eligibilityScore, credibilityScore, rewardVsCompetition);

  const matchingReasons = generateMatchingReasons(student, scholarship);
  const riskFactors = identifyRiskFactors(student, scholarship);

  // Improved priority assignment - better aligned with score ranges
  let priority: 'high' | 'medium' | 'low' = 'low';
  if (overallScore >= 0.65) priority = 'high';
  else if (overallScore >= 0.40) priority = 'medium';

  return {
    eligibility_match_score: eligibilityScore,
    credibility_score: credibilityScore,
    reward_vs_competition_score: rewardVsCompetition,
    overall_suitability_score: overallScore,
    matching_reasons: matchingReasons,
    risk_factors: riskFactors,
    priority_level: priority,
  };
}
