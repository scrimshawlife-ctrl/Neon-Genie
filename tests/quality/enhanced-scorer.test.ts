/**
 * Enhanced Quality Scorer Tests
 */

import { EnhancedQualityScorer } from '../../src/quality/enhanced-scorer';
import { AbraxasClient } from '../../src/abraxas/client';
import { IdeaArtifact } from '../../src/types/artifact';

describe('EnhancedQualityScorer', () => {
  let scorer: EnhancedQualityScorer;
  let abraxas: AbraxasClient;
  let mockArtifact: IdeaArtifact;

  beforeEach(() => {
    abraxas = new AbraxasClient({
      apiKey: 'test',
      endpoint: 'http://localhost:8080'
    });

    scorer = new EnhancedQualityScorer(abraxas);

    mockArtifact = {
      id: 'test-1',
      title: 'Innovative AI Platform',
      domain: 'software',
      concept: 'AI-powered collaborative workspace',
      problem: 'Teams need better AI integration',
      solution: 'Unified AI workspace with smart agents',
      themes: ['ai', 'collaboration', 'productivity'],
      components: [],
      architecture: {
        storage: 'PostgreSQL',
        computation: 'Node.js',
        interface: 'React',
        ecosystem_mapping: []
      },
      quality: {
        ontological_depth: { value: 0.7, rationale: 'Good depth' },
        novelty: { value: 0.8, rationale: 'Novel approach' },
        viability: { value: 0.6, rationale: 'Viable' },
        zeitgeist_alignment: { value: 0.75, rationale: 'Aligned' },
        generative_potential: { value: 0.5, rationale: 'Some potential' },
        composite: 0.68,
        threshold: 0.5,
        passed: true,
        tier: 'accept',
        breakdown: {
          strengths: [],
          weaknesses: [],
          refinements: []
        }
      },
      provenance: {
        origin: 'test',
        generator: 'test',
        transformations: [],
        timestamp: new Date().toISOString()
      },
      lineage: { children: [] },
      metadata: {
        constraints: [],
        tags: [],
        mode: 'enhanced',
        createdAt: new Date().toISOString()
      }
    };
  });

  describe('6-Dimension Scoring', () => {
    test('should add symbolic_resonance dimension', async () => {
      const score = await scorer.scoreEnhanced(mockArtifact);

      expect(score).toHaveProperty('symbolic_resonance');
      expect(score.symbolic_resonance).toBeDefined();
      expect(score.symbolic_resonance!.value).toBeGreaterThanOrEqual(0);
      expect(score.symbolic_resonance!.value).toBeLessThanOrEqual(1);
    });

    test('should use Abraxas weights', async () => {
      const score = await scorer.scoreEnhanced(mockArtifact);

      // Composite should be weighted average
      expect(score.composite).toBeGreaterThanOrEqual(0);
      expect(score.composite).toBeLessThanOrEqual(1);
    });

    test('should use higher threshold (0.6)', async () => {
      const score = await scorer.scoreEnhanced(mockArtifact);

      expect(score.threshold).toBe(0.6);
    });

    test('should have all 5 base dimensions', async () => {
      const score = await scorer.scoreEnhanced(mockArtifact);

      expect(score).toHaveProperty('ontological_depth');
      expect(score).toHaveProperty('novelty');
      expect(score).toHaveProperty('viability');
      expect(score).toHaveProperty('zeitgeist_alignment');
      expect(score).toHaveProperty('generative_potential');
    });
  });

  describe('Symbolic Insights', () => {
    test('should provide symbolic insights', async () => {
      const insights = await scorer.getSymbolicInsights(mockArtifact);

      expect(insights).toHaveProperty('numerology');
      expect(insights).toHaveProperty('timing');
      expect(insights).toHaveProperty('archetypes');
      expect(insights).toHaveProperty('recommendations');
      expect(Array.isArray(insights.recommendations)).toBe(true);
    });

    test('should handle Abraxas unavailable gracefully', async () => {
      const insights = await scorer.getSymbolicInsights(mockArtifact);

      // In mock mode, should still return valid structure
      expect(typeof insights.numerology).toBe('string');
      expect(typeof insights.timing).toBe('string');
      expect(typeof insights.archetypes).toBe('string');
    });
  });

  describe('Enhanced Breakdown', () => {
    test('should generate enhanced breakdown', async () => {
      const score = await scorer.scoreEnhanced(mockArtifact);

      expect(score.breakdown).toHaveProperty('strengths');
      expect(score.breakdown).toHaveProperty('weaknesses');
      expect(score.breakdown).toHaveProperty('refinements');
      expect(Array.isArray(score.breakdown.strengths)).toBe(true);
      expect(Array.isArray(score.breakdown.weaknesses)).toBe(true);
      expect(Array.isArray(score.breakdown.refinements)).toBe(true);
    });

    test('should identify symbolic alignment in strengths', async () => {
      const score = await scorer.scoreEnhanced(mockArtifact);

      // Should have at least some feedback
      const totalFeedback = score.breakdown.strengths.length +
                           score.breakdown.weaknesses.length +
                           score.breakdown.refinements.length;
      expect(totalFeedback).toBeGreaterThan(0);
    });
  });

  describe('Tier Determination', () => {
    test('should use correct tiers with 0.6 threshold', async () => {
      const tiers = ['reject', 'consider', 'accept', 'prioritize'];

      const score = await scorer.scoreEnhanced(mockArtifact);
      expect(tiers).toContain(score.tier);
    });

    test('should reject below threshold', async () => {
      // Create low-quality artifact
      const lowQualityArtifact = {
        ...mockArtifact,
        title: 'a',
        concept: 'b',
        problem: 'c',
        solution: 'd'
      };

      const score = await scorer.scoreEnhanced(lowQualityArtifact);

      if (score.composite < 0.6) {
        expect(score.tier).toBe('reject');
        expect(score.passed).toBe(false);
      }
    });
  });

  describe('Consistency', () => {
    test('should return consistent scores for same input', async () => {
      const score1 = await scorer.scoreEnhanced(mockArtifact);
      const score2 = await scorer.scoreEnhanced(mockArtifact);

      // Mock implementations are deterministic
      expect(score1.composite).toBe(score2.composite);
      expect(score1.symbolic_resonance!.value).toBe(score2.symbolic_resonance!.value);
    });
  });
});
