import type { DimensionScore, QualityScore, QualityTier } from '../types/quality';
import { STANDALONE_WEIGHTS } from '../types/quality';

const clamp = (value: number): number => Math.min(1, Math.max(0, value));

export class QualityScorer {
  score(promptText: string): QualityScore {
    const ontological_depth = this.scoreOntologicalDepth(promptText);
    const novelty = this.scoreNovelty(promptText);
    const viability = this.scoreViability(promptText);
    const zeitgeist_alignment = this.scoreZeitgeist(promptText);
    const generative_potential = this.scoreGenerativePotential(promptText);

    const composite = this.calculateComposite({
      ontological_depth,
      novelty,
      viability,
      zeitgeist_alignment,
      generative_potential
    });

    const tier = this.determineTier(composite);
    const breakdown = this.generateBreakdown({
      ontological_depth,
      novelty,
      viability,
      zeitgeist_alignment,
      generative_potential
    });

    return {
      ontological_depth,
      novelty,
      viability,
      zeitgeist_alignment,
      generative_potential,
      composite,
      threshold: 0.5,
      passed: composite >= 0.5,
      tier,
      breakdown
    };
  }

  scoreOntologicalDepth(promptText: string): DimensionScore {
    const length = promptText.split(' ').length;
    const value = clamp(length / 40);
    return {
      value,
      rationale: 'Depth rises as the concept includes layered intent and systemic scope.',
      subScores: {
        surface: clamp(0.25 - value / 4),
        functional: clamp(value * 0.35),
        psychological: clamp(value * 0.45),
        philosophical: clamp(value * 0.7),
        ontological: clamp(value * 0.9)
      }
    };
  }

  scoreNovelty(promptText: string): DimensionScore {
    const unique = new Set(promptText.toLowerCase().split(/\W+/)).size;
    const value = clamp(unique / 30);
    return {
      value,
      rationale: 'Novelty increases with diverse language and distinctive framing.',
      subScores: {
        derivative: clamp(0.3 - value / 2),
        recombinant: clamp(value * 0.6),
        novel: clamp(value * 0.8),
        paradigmatic: clamp(value)
      }
    };
  }

  scoreViability(promptText: string): DimensionScore {
    const keywords = ['market', 'resource', 'regulatory', 'technical', 'team'];
    const hits = keywords.filter((keyword) => promptText.toLowerCase().includes(keyword)).length;
    const technical = clamp(0.4 + hits * 0.05);
    const resource = clamp(0.35 + hits * 0.04);
    const market = clamp(0.3 + hits * 0.06);
    const regulatory = clamp(0.25 + hits * 0.05);
    const value = clamp(technical * 0.3 + resource * 0.2 + market * 0.3 + regulatory * 0.2);
    return {
      value,
      rationale: 'Viability balances technical feasibility, resources, market fit, and compliance.',
      subScores: {
        technical,
        resource,
        market,
        regulatory
      }
    };
  }

  scoreZeitgeist(promptText: string): DimensionScore {
    const hits = ['future', 'trend', 'cultural', 'climate', 'ai', 'sustainability'].filter(
      (keyword) => promptText.toLowerCase().includes(keyword)
    ).length;
    const trend = clamp(0.4 + hits * 0.05);
    const contrarian = clamp(0.35 + hits * 0.04);
    const future = clamp(0.3 + hits * 0.06);
    const timeless = clamp(0.4 + hits * 0.03);
    const value = clamp(trend * 0.2 + contrarian * 0.3 + future * 0.3 + timeless * 0.2);
    return {
      value,
      rationale: 'Zeitgeist alignment reflects cultural pulse and long-term resonance.',
      subScores: {
        trend,
        contrarian,
        future,
        timeless
      }
    };
  }

  scoreGenerativePotential(promptText: string): DimensionScore {
    const base = clamp(promptText.length / 200);
    return {
      value: base,
      rationale: 'Generative potential improves when the concept extends to ecosystems.',
      subScores: {
        extensibility: clamp(base * 0.9),
        platform: clamp(base * 0.8),
        network: clamp(base * 0.7),
        evolution: clamp(base)
      }
    };
  }

  calculateComposite(scores: {
    ontological_depth: DimensionScore;
    novelty: DimensionScore;
    viability: DimensionScore;
    zeitgeist_alignment: DimensionScore;
    generative_potential: DimensionScore;
  }): number {
    return clamp(
      scores.ontological_depth.value * STANDALONE_WEIGHTS.ontological_depth +
        scores.novelty.value * STANDALONE_WEIGHTS.novelty +
        scores.viability.value * STANDALONE_WEIGHTS.viability +
        scores.zeitgeist_alignment.value * STANDALONE_WEIGHTS.zeitgeist_alignment +
        scores.generative_potential.value * STANDALONE_WEIGHTS.generative_potential
    );
  }

  generateBreakdown(scores: {
    ontological_depth: DimensionScore;
    novelty: DimensionScore;
    viability: DimensionScore;
    zeitgeist_alignment: DimensionScore;
    generative_potential: DimensionScore;
  }): QualityScore['breakdown'] {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const refinements: string[] = [];

    const entries = Object.entries(scores) as Array<[string, DimensionScore]>;
    entries.forEach(([name, score]) => {
      if (score.value >= 0.7) {
        strengths.push(`${name} is strong.`);
      } else if (score.value <= 0.45) {
        weaknesses.push(`${name} needs reinforcement.`);
        refinements.push(`Expand ${name.replace('_', ' ')} through clearer detail.`);
      }
    });

    if (strengths.length === 0) {
      strengths.push('Balanced foundation with room for amplification.');
    }

    if (weaknesses.length === 0) {
      refinements.push('Introduce bold differentiators to push the score higher.');
    }

    return { strengths, weaknesses, refinements };
  }

  determineTier(score: number): QualityTier {
    if (score < 0.5) {
      return 'reject';
    }
    if (score < 0.65) {
      return 'consider';
    }
    if (score < 0.8) {
      return 'accept';
    }
    return 'prioritize';
  }
}
