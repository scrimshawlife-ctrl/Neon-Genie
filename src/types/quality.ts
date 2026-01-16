export interface DimensionScore {
  value: number;
  rationale: string;
  subScores?: Record<string, number>;
}

export type QualityTier = 'reject' | 'consider' | 'accept' | 'prioritize';

export interface QualityScore {
  ontological_depth: DimensionScore;
  novelty: DimensionScore;
  viability: DimensionScore;
  zeitgeist_alignment: DimensionScore;
  generative_potential: DimensionScore;
  symbolic_resonance?: DimensionScore; // Optional 6th dimension (Abraxas mode)
  composite: number;
  threshold: number;
  passed: boolean;
  tier: QualityTier;
  breakdown: {
    strengths: string[];
    weaknesses: string[];
    refinements: string[];
  };
}

export const STANDALONE_WEIGHTS = {
  ontological_depth: 0.3,
  novelty: 0.25,
  viability: 0.25,
  zeitgeist_alignment: 0.15,
  generative_potential: 0.05
} as const;

export const ABRAXAS_WEIGHTS = {
  ontological_depth: 0.20,
  novelty: 0.20,
  viability: 0.15,
  zeitgeist_alignment: 0.10,
  generative_potential: 0.05,
  symbolic_resonance: 0.35  // Highest weight - symbolic dimension
} as const;
