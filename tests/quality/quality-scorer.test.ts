import { QualityScorer } from '../../src/core/quality-scorer';

describe('quality scorer', () => {
  it('scores with five dimensions and composite', () => {
    const scorer = new QualityScorer();
    const score = scorer.score('A future-focused market platform with technical depth');
    expect(score.composite).toBeGreaterThanOrEqual(0);
    expect(score.composite).toBeLessThanOrEqual(1);
    expect(score.ontological_depth).toBeDefined();
    expect(score.novelty).toBeDefined();
    expect(score.viability).toBeDefined();
    expect(score.zeitgeist_alignment).toBeDefined();
    expect(score.generative_potential).toBeDefined();
  });
});
