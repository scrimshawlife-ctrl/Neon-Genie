import { createLineage, createProvenance, finalizeArtifact, generateHash } from '../../src/core/provenance';
import type { IdeaArtifact } from '../../src/types/artifact';

const baseArtifact = (): IdeaArtifact => ({
  id: 'idea_test',
  title: 'Test Concept',
  domain: 'software',
  concept: 'Test concept',
  problem: 'Test problem',
  solution: 'Test solution',
  themes: ['test'],
  components: [],
  architecture: {
    storage: 'test',
    computation: 'test',
    interface: 'test',
    ecosystem_mapping: []
  },
  quality: {
    ontological_depth: { value: 0.5, rationale: '' },
    novelty: { value: 0.5, rationale: '' },
    viability: { value: 0.5, rationale: '' },
    zeitgeist_alignment: { value: 0.5, rationale: '' },
    generative_potential: { value: 0.5, rationale: '' },
    composite: 0.5,
    threshold: 0.5,
    passed: true,
    tier: 'consider',
    breakdown: { strengths: [], weaknesses: [], refinements: [] }
  },
  provenance: createProvenance('test'),
  lineage: createLineage(),
  metadata: {
    constraints: [],
    tags: [],
    mode: 'standalone',
    createdAt: new Date().toISOString()
  }
});

describe('provenance', () => {
  it('generates deterministic hashes', () => {
    const hashA = generateHash({ hello: 'world' });
    const hashB = generateHash({ hello: 'world' });
    expect(hashA).toEqual(hashB);
  });

  it('finalizes artifacts with hash', () => {
    const artifact = finalizeArtifact(baseArtifact());
    expect(artifact.lineage.hash).toBeDefined();
  });
});
