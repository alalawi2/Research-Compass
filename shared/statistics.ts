/**
 * Statistical calculation utilities for sample size determination
 * All formulas are standard statistical methods - no licensing restrictions
 */

// Standard normal distribution quantile function (inverse CDF)
function normalQuantile(p: number): number {
  // Approximation using Beasley-Springer-Moro algorithm
  const a = [
    -3.969683028665376e1, 2.209460984245205e2,
    -2.759285104469687e2, 1.383577518672690e2,
    -3.066479806614716e1, 2.506628277459239
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2,
    -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1,
    -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1,
    2.445134137142996, 3.754408661907416
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q, r;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}

// T-distribution quantile (approximation)
function tQuantile(p: number, df: number): number {
  const z = normalQuantile(p);
  const g1 = (z ** 3 + z) / 4;
  const g2 = (5 * z ** 5 + 16 * z ** 3 + 3 * z) / 96;
  const g3 = (3 * z ** 7 + 19 * z ** 5 + 17 * z ** 3 - 15 * z) / 384;
  
  return z + g1 / df + g2 / (df ** 2) + g3 / (df ** 3);
}

export interface SampleSizeResult {
  sampleSize: number;
  totalSampleSize?: number;
  power: number;
  alpha: number;
  effectSize: number;
  notes?: string;
}

/**
 * Independent samples t-test sample size calculation
 */
export function calculateTTestIndependent(params: {
  alpha: number;
  power: number;
  effectSize: number;
  ratio?: number; // n2/n1 ratio, default 1
}): SampleSizeResult {
  const { alpha, power, effectSize, ratio = 1 } = params;
  
  const zAlpha = normalQuantile(1 - alpha / 2);
  const zBeta = normalQuantile(power);
  
  const n1 = ((zAlpha + zBeta) ** 2) * (1 + 1 / ratio) / (effectSize ** 2);
  const n2 = n1 * ratio;
  
  return {
    sampleSize: Math.ceil(n1),
    totalSampleSize: Math.ceil(n1 + n2),
    power,
    alpha,
    effectSize,
    notes: `Group 1: ${Math.ceil(n1)}, Group 2: ${Math.ceil(n2)}`
  };
}

/**
 * Paired samples t-test sample size calculation
 */
export function calculateTTestPaired(params: {
  alpha: number;
  power: number;
  effectSize: number;
}): SampleSizeResult {
  const { alpha, power, effectSize } = params;
  
  const zAlpha = normalQuantile(1 - alpha / 2);
  const zBeta = normalQuantile(power);
  
  const n = ((zAlpha + zBeta) / effectSize) ** 2;
  
  return {
    sampleSize: Math.ceil(n),
    power,
    alpha,
    effectSize,
    notes: "Number of pairs required"
  };
}

/**
 * One-way ANOVA sample size calculation
 */
export function calculateANOVA(params: {
  alpha: number;
  power: number;
  effectSize: number;
  numGroups: number;
}): SampleSizeResult {
  const { alpha, power, effectSize, numGroups } = params;
  
  const zAlpha = normalQuantile(1 - alpha);
  const zBeta = normalQuantile(power);
  
  // Simplified calculation
  const n = ((zAlpha + zBeta) / effectSize) ** 2 * (numGroups / (numGroups - 1));
  const perGroup = Math.ceil(n);
  
  return {
    sampleSize: perGroup,
    totalSampleSize: perGroup * numGroups,
    power,
    alpha,
    effectSize,
    notes: `${perGroup} participants per group, ${numGroups} groups`
  };
}

/**
 * Chi-square test sample size calculation
 */
export function calculateChiSquare(params: {
  alpha: number;
  power: number;
  effectSize: number; // w (effect size for chi-square)
  df: number; // degrees of freedom
}): SampleSizeResult {
  const { alpha, power, effectSize, df } = params;
  
  const zAlpha = normalQuantile(1 - alpha);
  const zBeta = normalQuantile(power);
  
  // Approximation for chi-square
  const lambda = (zAlpha + zBeta) ** 2;
  const n = lambda / (effectSize ** 2);
  
  return {
    sampleSize: Math.ceil(n),
    power,
    alpha,
    effectSize,
    notes: `Degrees of freedom: ${df}`
  };
}

/**
 * Mann-Whitney U test (Wilcoxon rank-sum) sample size calculation
 */
export function calculateMannWhitney(params: {
  alpha: number;
  power: number;
  effectSize: number;
  ratio?: number;
}): SampleSizeResult {
  const { alpha, power, effectSize, ratio = 1 } = params;
  
  // Use ARE (Asymptotic Relative Efficiency) = 0.955 for normal data
  const ARE = 0.955;
  const adjustedEffect = effectSize * Math.sqrt(ARE);
  
  const zAlpha = normalQuantile(1 - alpha / 2);
  const zBeta = normalQuantile(power);
  
  const n1 = ((zAlpha + zBeta) ** 2) * (1 + 1 / ratio) / (adjustedEffect ** 2);
  const n2 = n1 * ratio;
  
  return {
    sampleSize: Math.ceil(n1),
    totalSampleSize: Math.ceil(n1 + n2),
    power,
    alpha,
    effectSize,
    notes: `Non-parametric test. Group 1: ${Math.ceil(n1)}, Group 2: ${Math.ceil(n2)}`
  };
}

/**
 * Wilcoxon signed-rank test sample size calculation
 */
export function calculateWilcoxon(params: {
  alpha: number;
  power: number;
  effectSize: number;
}): SampleSizeResult {
  const { alpha, power, effectSize } = params;
  
  // ARE for Wilcoxon signed-rank vs paired t-test
  const ARE = 0.955;
  const adjustedEffect = effectSize * Math.sqrt(ARE);
  
  const zAlpha = normalQuantile(1 - alpha / 2);
  const zBeta = normalQuantile(power);
  
  const n = ((zAlpha + zBeta) / adjustedEffect) ** 2;
  
  return {
    sampleSize: Math.ceil(n),
    power,
    alpha,
    effectSize,
    notes: "Non-parametric paired test. Number of pairs required"
  };
}

/**
 * Correlation test sample size calculation
 */
export function calculateCorrelation(params: {
  alpha: number;
  power: number;
  rho: number; // expected correlation coefficient
}): SampleSizeResult {
  const { alpha, power, rho } = params;
  
  const zAlpha = normalQuantile(1 - alpha / 2);
  const zBeta = normalQuantile(power);
  
  // Fisher's z transformation
  const zRho = 0.5 * Math.log((1 + rho) / (1 - rho));
  
  const n = ((zAlpha + zBeta) / zRho) ** 2 + 3;
  
  return {
    sampleSize: Math.ceil(n),
    power,
    alpha,
    effectSize: rho,
    notes: `Expected correlation: ${rho.toFixed(3)}`
  };
}

/**
 * Log-rank test for survival analysis sample size calculation
 */
export function calculateLogRank(params: {
  alpha: number;
  power: number;
  hazardRatio: number;
  eventProbability: number; // probability of event occurring
}): SampleSizeResult {
  const { alpha, power, hazardRatio, eventProbability } = params;
  
  const zAlpha = normalQuantile(1 - alpha / 2);
  const zBeta = normalQuantile(power);
  
  const logHR = Math.log(hazardRatio);
  const events = 4 * ((zAlpha + zBeta) / logHR) ** 2;
  const n = events / eventProbability;
  
  return {
    sampleSize: Math.ceil(n / 2), // per group
    totalSampleSize: Math.ceil(n),
    power,
    alpha,
    effectSize: hazardRatio,
    notes: `Hazard ratio: ${hazardRatio.toFixed(2)}, Expected events: ${Math.ceil(events)}`
  };
}

/**
 * Cross-sectional study sample size calculation (for prevalence/proportion)
 */
export function calculateCrossSectional(params: {
  alpha: number;
  power?: number;
  prevalence: number; // expected prevalence/proportion (0-1)
  marginOfError: number; // desired margin of error (0-1)
  populationSize?: number; // finite population correction (optional)
}): SampleSizeResult {
  const { alpha, prevalence, marginOfError, populationSize } = params;
  
  const zAlpha = normalQuantile(1 - alpha / 2);
  
  // Sample size for infinite population
  const p = prevalence;
  const e = marginOfError;
  const n = (zAlpha ** 2 * p * (1 - p)) / (e ** 2);
  
  // Apply finite population correction if population size is provided
  let adjustedN = n;
  if (populationSize && populationSize > 0) {
    adjustedN = n / (1 + (n - 1) / populationSize);
  }
  
  const confidenceLevel = (1 - alpha) * 100;
  const notes = populationSize 
    ? `${confidenceLevel}% CI, ±${(marginOfError * 100).toFixed(1)}% margin of error. Population: ${populationSize.toLocaleString()}`
    : `${confidenceLevel}% CI, ±${(marginOfError * 100).toFixed(1)}% margin of error (infinite population)`;
  
  return {
    sampleSize: Math.ceil(adjustedN),
    power: params.power || 0.80,
    alpha,
    effectSize: prevalence,
    notes
  };
}

/**
 * Generate power curve data for visualization
 */
export function generatePowerCurve(params: {
  testType: string;
  alpha: number;
  effectSize: number;
  sampleSizeRange: [number, number];
  numPoints?: number;
}): Array<{ sampleSize: number; power: number }> {
  const { testType, alpha, effectSize, sampleSizeRange, numPoints = 20 } = params;
  const [minN, maxN] = sampleSizeRange;
  const step = (maxN - minN) / (numPoints - 1);
  
  const data: Array<{ sampleSize: number; power: number }> = [];
  
  for (let i = 0; i < numPoints; i++) {
    const n = Math.round(minN + step * i);
    
    // Calculate power for given sample size (reverse calculation)
    const zAlpha = normalQuantile(1 - alpha / 2);
    let power: number;
    
    if (testType === 'ttest-independent' || testType === 'mann-whitney') {
      const ncp = effectSize * Math.sqrt(n / 2);
      power = 1 - normalQuantile(zAlpha - ncp);
    } else if (testType === 'ttest-paired' || testType === 'wilcoxon') {
      const ncp = effectSize * Math.sqrt(n);
      power = 1 - normalQuantile(zAlpha - ncp);
    } else {
      // Generic approximation
      const ncp = effectSize * Math.sqrt(n);
      power = 1 - normalQuantile(zAlpha - ncp);
    }
    
    // Clamp power between 0 and 1
    power = Math.max(0, Math.min(1, power));
    
    data.push({ sampleSize: n, power });
  }
  
  return data;
}
