import type { FormData } from "./quiz-config";

export type Segment = "diy" | "dwy" | "dfy";

export interface ScoreResult {
  segment: Segment;
  scores: { diy: number; dwy: number; dfy: number };
  isOverride: boolean;
}

interface ScoreWeights {
  diy: number;
  dwy: number;
  dfy: number;
}

// Scoring weights per question per answer
const SCORING_MAP: Record<string, Record<string, ScoreWeights>> = {
  business_type: {
    solo: { diy: 3, dwy: 0, dfy: 0 },
    small_team: { diy: 0, dwy: 2, dfy: 0 },
    growing: { diy: 0, dwy: 0, dfy: 2 },
    established: { diy: 0, dwy: 0, dfy: 3 },
  },
  monthly_revenue: {
    pre_revenue: { diy: 3, dwy: 0, dfy: 0 },
    under_5k: { diy: 2, dwy: 0, dfy: 0 },
    "5k_20k": { diy: 0, dwy: 2, dfy: 0 },
    "20k_50k": { diy: 0, dwy: 1, dfy: 2 },
    "50k_100k": { diy: 0, dwy: 0, dfy: 2 },
    "100k_plus": { diy: 0, dwy: 0, dfy: 3 },
  },
  bottleneck: {
    marketing: { diy: 0, dwy: 2, dfy: 0 },
    operations: { diy: 0, dwy: 0, dfy: 2 },
    need_app: { diy: 0, dwy: 0, dfy: 3 },
    customer_support: { diy: 0, dwy: 1, dfy: 2 },
    not_sure: { diy: 1, dwy: 2, dfy: 0 },
  },
  ai_comfort: {
    advanced: { diy: 3, dwy: 0, dfy: 1 },
    clear: { diy: 2, dwy: 0, dfy: 2 },
    general_idea: { diy: 0, dwy: 3, dfy: 0 },
    exploring: { diy: 2, dwy: 1, dfy: 0 },
    unclear: { diy: 1, dwy: 2, dfy: 0 },
  },
  time_available: {
    under_2hrs: { diy: 0, dwy: 0, dfy: 2 },
    "2_5hrs": { diy: 0, dwy: 2, dfy: 0 },
    "5_10hrs": { diy: 2, dwy: 0, dfy: 0 },
    "10plus_hrs": { diy: 3, dwy: 0, dfy: 0 },
  },
  budget: {
    free: { diy: 3, dwy: 0, dfy: 0 },
    "100_500": { diy: 0, dwy: 2, dfy: 0 },
    "500_2000": { diy: 0, dwy: 2, dfy: 1 },
    "2000_plus": { diy: 0, dwy: 0, dfy: 3 },
    project: { diy: 0, dwy: 0, dfy: 3 },
  },
  // Q7 (implementation_preference) is handled as override, not scored
  success_vision: {
    basic_automations: { diy: 2, dwy: 0, dfy: 0 },
    systematized: { diy: 0, dwy: 2, dfy: 0 },
    custom_systems: { diy: 0, dwy: 0, dfy: 2 },
    launched_app: { diy: 0, dwy: 0, dfy: 2 },
  },
  // Q9 (industry) is data only, not scored
  urgency: {
    asap: { diy: 0, dwy: 0, dfy: 2 },
    "30_days": { diy: 0, dwy: 2, dfy: 0 },
    "90_days": { diy: 1, dwy: 0, dfy: 0 },
    exploring: { diy: 2, dwy: 0, dfy: 0 },
  },
};

// Fields to not score when Q7 = "not_sure" (scored separately)
const NOT_SURE_BONUS: ScoreWeights = { diy: 1, dwy: 2, dfy: 0 };

export function calculateSegment(formData: FormData): ScoreResult {
  // Q7 hard override: if user explicitly picks DIY/DWY/DFY, that's the result
  const q7Answer = formData.implementation_preference;
  if (q7Answer === "diy" || q7Answer === "dwy" || q7Answer === "dfy") {
    // Still calculate scores for data enrichment
    const scores = calculateWeightedScores(formData);
    return {
      segment: q7Answer,
      scores,
      isOverride: true,
    };
  }

  // Q7 = "not_sure" or empty: fall back to weighted scoring
  const scores = calculateWeightedScores(formData);

  // Add "not sure" bonus points
  if (q7Answer === "not_sure") {
    scores.diy += NOT_SURE_BONUS.diy;
    scores.dwy += NOT_SURE_BONUS.dwy;
    scores.dfy += NOT_SURE_BONUS.dfy;
  }

  // Determine winner. Tie-breaker: DWY wins.
  let segment: Segment = "dwy"; // default tie-breaker
  if (scores.dfy > scores.dwy && scores.dfy > scores.diy) {
    segment = "dfy";
  } else if (scores.diy > scores.dwy && scores.diy > scores.dfy) {
    segment = "diy";
  } else if (scores.dwy >= scores.diy && scores.dwy >= scores.dfy) {
    segment = "dwy";
  }

  return {
    segment,
    scores,
    isOverride: false,
  };
}

function calculateWeightedScores(formData: FormData): {
  diy: number;
  dwy: number;
  dfy: number;
} {
  const scores = { diy: 0, dwy: 0, dfy: 0 };

  const scoredFields = [
    "business_type",
    "monthly_revenue",
    "bottleneck",
    "ai_comfort",
    "time_available",
    "budget",
    "success_vision",
    "urgency",
  ] as const;

  for (const field of scoredFields) {
    const answer = formData[field as keyof FormData] as string;
    const fieldMap = SCORING_MAP[field];
    if (fieldMap && answer && fieldMap[answer]) {
      const weights = fieldMap[answer];
      scores.diy += weights.diy;
      scores.dwy += weights.dwy;
      scores.dfy += weights.dfy;
    }
  }

  return scores;
}
