/**
 * Symbolic Resonance Scorer
 *
 * The 6th dimension of quality scoring that evaluates ideas through
 * symbolic, archetypal, and divinatory lenses using the Abraxas API.
 *
 * This scorer analyzes:
 * - Numerological vibration
 * - Temporal alignment (ephemeris)
 * - Gematria resonance
 * - Archetypal strength
 *
 * When Abraxas API is unavailable, returns neutral score.
 */

import { DimensionScore } from '../types/quality';
import { IdeaArtifact } from '../types/artifact';
import { AbraxasClient } from '../abraxas/client';

export class SymbolicResonanceScorer {
  constructor(private abraxas: AbraxasClient) {}

  /**
   * Score an artifact's symbolic resonance
   *
   * Combines four sub-dimensions:
   * 1. Numerology - vibrational alignment
   * 2. Timing - ephemeris alignment
   * 3. Gematria - symbolic resonance
   * 4. Archetypes - pattern strength
   *
   * @param artifact The idea artifact to score
   * @returns Dimension score with sub-scores
   */
  async score(artifact: IdeaArtifact): Promise<DimensionScore> {
    // If Abraxas is not connected, return neutral score
    if (!this.abraxas.isConnected()) {
      return {
        value: 0.5,
        rationale: 'Abraxas API unavailable - symbolic analysis deferred',
        subScores: {
          numerology: 0.5,
          timing: 0.5,
          gematria: 0.5,
          archetypes: 0.5
        }
      };
    }

    try {
      // Get symbolic analyses
      const numerology = await this.abraxas.analyzeNumerology(artifact.title);
      const ephemeris = await this.abraxas.getEphemeris(new Date(artifact.metadata.createdAt));
      const gematria = await this.abraxas.calculateGematria(artifact.concept);
      const archetypes = await this.abraxas.identifyArchetypes(artifact.concept);

      // Extract sub-scores
      const numerologyScore = numerology.score;
      const timingScore = ephemeris.alignment;
      const gematriaScore = gematria.resonance;
      const archetypeScore = archetypes.strength;

      // Calculate composite (equal weights)
      const value = (numerologyScore + timingScore + gematriaScore + archetypeScore) / 4;

      // Build rationale
      const rationale = [
        `Numerology: ${numerology.vibration} (${numerology.primaryNumber})`,
        `Timing: ${(ephemeris.alignment * 100).toFixed(0)}% alignment`,
        `Archetype: ${archetypes.primary}`,
        `Gematria: ${gematria.value}`
      ].join('; ');

      return {
        value,
        rationale,
        subScores: {
          numerology: numerologyScore,
          timing: timingScore,
          gematria: gematriaScore,
          archetypes: archetypeScore
        }
      };
    } catch (error) {
      // Fallback on error
      return {
        value: 0.5,
        rationale: `Symbolic analysis error: ${error instanceof Error ? error.message : 'unknown'}`,
        subScores: {
          numerology: 0.5,
          timing: 0.5,
          gematria: 0.5,
          archetypes: 0.5
        }
      };
    }
  }

  /**
   * Get detailed symbolic insights for an artifact
   *
   * @param artifact The idea artifact to analyze
   * @returns Detailed symbolic analysis
   */
  async getInsights(artifact: IdeaArtifact): Promise<{
    numerology: string;
    timing: string;
    archetypes: string;
    recommendations: string[];
  }> {
    if (!this.abraxas.isConnected()) {
      return {
        numerology: 'Abraxas API unavailable',
        timing: 'Abraxas API unavailable',
        archetypes: 'Abraxas API unavailable',
        recommendations: ['Connect to Abraxas API for symbolic insights']
      };
    }

    try {
      const numerology = await this.abraxas.analyzeNumerology(artifact.title);
      const ephemeris = await this.abraxas.getEphemeris(new Date(artifact.metadata.createdAt));
      const archetypes = await this.abraxas.identifyArchetypes(artifact.concept);

      return {
        numerology: `${numerology.vibration} (${numerology.primaryNumber}): ${numerology.interpretation}`,
        timing: `Alignment: ${(ephemeris.alignment * 100).toFixed(0)}%. Favorable for: ${ephemeris.favorableActivities.join(', ')}`,
        archetypes: `${archetypes.primary}: ${archetypes.description}. Shadow: ${archetypes.shadow}`,
        recommendations: [
          `Embrace ${numerology.characteristics[0].toLowerCase()} energy`,
          ephemeris.alignment > 0.7 ? 'Excellent timing for launch' : 'Consider delaying launch',
          archetypes.integration
        ]
      };
    } catch (error) {
      return {
        numerology: 'Analysis error',
        timing: 'Analysis error',
        archetypes: 'Analysis error',
        recommendations: ['Retry symbolic analysis']
      };
    }
  }
}
