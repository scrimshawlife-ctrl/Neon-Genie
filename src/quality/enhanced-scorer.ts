/**
 * Enhanced Quality Scorer
 *
 * 6-dimension quality scoring that extends the base scorer with
 * symbolic resonance analysis via Abraxas integration.
 *
 * Dimensions:
 * 1. Ontological Depth (20%)
 * 2. Novelty (20%)
 * 3. Viability (15%)
 * 4. Zeitgeist Alignment (10%)
 * 5. Generative Potential (5%)
 * 6. Symbolic Resonance (35%) ← NEW
 *
 * The symbolic dimension has the highest weight, reflecting the
 * importance of archetypal and divinatory alignment.
 *
 * Threshold: 0.6 (higher than standalone mode's 0.5)
 */

import { QualityScorer } from '../core/quality-scorer';
import { SymbolicResonanceScorer } from './symbolic-resonance';
import { AbraxasClient } from '../abraxas/client';
import { QualityScore, QualityTier, ABRAXAS_WEIGHTS } from '../types/quality';
import { IdeaArtifact } from '../types/artifact';

const clamp = (value: number): number => Math.min(1, Math.max(0, value));

export class EnhancedQualityScorer extends QualityScorer {
  private symbolicScorer: SymbolicResonanceScorer;

  constructor(private abraxas: AbraxasClient) {
    super();
    this.symbolicScorer = new SymbolicResonanceScorer(abraxas);
  }

  /**
   * Score an artifact with 6 dimensions including symbolic resonance
   *
   * @param artifact The idea artifact to score
   * @returns Complete quality score with symbolic dimension
   */
  async scoreEnhanced(artifact: IdeaArtifact): Promise<QualityScore> {
    // Get base 5-dimension scores
    const promptText = `${artifact.title} ${artifact.concept} ${artifact.problem} ${artifact.solution}`;
    const baseScore = this.score(promptText);

    // Get 6th dimension (symbolic resonance)
    const symbolic_resonance = await this.symbolicScorer.score(artifact);

    // Recalculate composite with Abraxas weights
    const composite = clamp(
      baseScore.ontological_depth.value * ABRAXAS_WEIGHTS.ontological_depth +
        baseScore.novelty.value * ABRAXAS_WEIGHTS.novelty +
        baseScore.viability.value * ABRAXAS_WEIGHTS.viability +
        baseScore.zeitgeist_alignment.value * ABRAXAS_WEIGHTS.zeitgeist_alignment +
        baseScore.generative_potential.value * ABRAXAS_WEIGHTS.generative_potential +
        symbolic_resonance.value * ABRAXAS_WEIGHTS.symbolic_resonance
    );

    // Higher threshold for Abraxas mode
    const threshold = 0.6;
    const passed = composite >= threshold;
    const tier = this.determineTier(composite, threshold);

    // Enhanced breakdown including symbolic insights
    const breakdown = this.generateEnhancedBreakdown({
      ...baseScore,
      symbolic_resonance,
      composite
    });

    return {
      ontological_depth: baseScore.ontological_depth,
      novelty: baseScore.novelty,
      viability: baseScore.viability,
      zeitgeist_alignment: baseScore.zeitgeist_alignment,
      generative_potential: baseScore.generative_potential,
      symbolic_resonance,
      composite,
      threshold,
      passed,
      tier,
      breakdown
    };
  }

  /**
   * Determine quality tier with custom threshold
   *
   * @param score Composite score
   * @param threshold Minimum passing threshold
   * @returns Quality tier
   */
  determineTier(score: number, threshold: number = 0.6): QualityTier {
    if (score < threshold) {
      return 'reject';
    }
    if (score < 0.7) {
      return 'consider';
    }
    if (score < 0.85) {
      return 'accept';
    }
    return 'prioritize';
  }

  /**
   * Generate enhanced breakdown including symbolic insights
   *
   * @param scores All dimension scores including symbolic
   * @returns Detailed breakdown with strengths, weaknesses, refinements
   */
  private generateEnhancedBreakdown(scores: {
    ontological_depth: { value: number; rationale: string };
    novelty: { value: number; rationale: string };
    viability: { value: number; rationale: string };
    zeitgeist_alignment: { value: number; rationale: string };
    generative_potential: { value: number; rationale: string };
    symbolic_resonance: { value: number; rationale: string };
    composite: number;
  }): QualityScore['breakdown'] {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const refinements: string[] = [];

    const dimensions = [
      { name: 'ontological_depth', score: scores.ontological_depth },
      { name: 'novelty', score: scores.novelty },
      { name: 'viability', score: scores.viability },
      { name: 'zeitgeist_alignment', score: scores.zeitgeist_alignment },
      { name: 'generative_potential', score: scores.generative_potential },
      { name: 'symbolic_resonance', score: scores.symbolic_resonance }
    ];

    dimensions.forEach(({ name, score }) => {
      if (score.value >= 0.75) {
        strengths.push(`${name.replace('_', ' ')} is exceptional (${(score.value * 100).toFixed(0)}%)`);
      } else if (score.value >= 0.6) {
        strengths.push(`${name.replace('_', ' ')} is solid (${(score.value * 100).toFixed(0)}%)`);
      } else if (score.value <= 0.45) {
        weaknesses.push(`${name.replace('_', ' ')} needs strengthening (${(score.value * 100).toFixed(0)}%)`);

        if (name === 'symbolic_resonance') {
          refinements.push('Consider timing, archetypal alignment, and numerological resonance');
        } else {
          refinements.push(`Expand ${name.replace('_', ' ')} through deeper exploration`);
        }
      }
    });

    // Add symbolic-specific insights
    if (scores.symbolic_resonance.value >= 0.7) {
      strengths.push('Symbolically aligned - favorable for manifestation');
    }

    if (strengths.length === 0) {
      strengths.push('Balanced across dimensions with growth potential');
    }

    if (weaknesses.length === 0 && scores.composite < 0.85) {
      refinements.push('Introduce bold differentiators to achieve prioritize tier');
    }

    return { strengths, weaknesses, refinements };
  }

  /**
   * Get symbolic insights for an artifact
   *
   * @param artifact The idea artifact
   * @returns Detailed symbolic analysis
   */
  async getSymbolicInsights(artifact: IdeaArtifact) {
    return this.symbolicScorer.getInsights(artifact);
  }
}
