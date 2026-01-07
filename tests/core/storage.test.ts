import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { CorpusStorage } from '../../src/corpus/storage';
import { createLineage, createProvenance } from '../../src/core/provenance';
import type { IdeaArtifact } from '../../src/types/artifact';

const buildArtifact = (id: string): IdeaArtifact => ({
  id,
  title: 'Storage Test',
  domain: 'business',
  concept: 'Storage test concept',
  problem: 'Problem',
  solution: 'Solution',
  themes: ['storage'],
  components: [],
  architecture: {
    storage: 'test',
    computation: 'test',
    interface: 'test',
    ecosystem_mapping: []
  },
  quality: {
    ontological_depth: { value: 0.6, rationale: '' },
    novelty: { value: 0.6, rationale: '' },
    viability: { value: 0.6, rationale: '' },
    zeitgeist_alignment: { value: 0.6, rationale: '' },
    generative_potential: { value: 0.6, rationale: '' },
    composite: 0.6,
    threshold: 0.5,
    passed: true,
    tier: 'accept',
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

describe('corpus storage', () => {
  it('stores and retrieves artifacts', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ng-storage-'));
    const storage = new CorpusStorage(tempDir);
    const artifact = buildArtifact('storage_1');

    await storage.store(artifact);
    const retrieved = await storage.retrieve('storage_1');

    expect(retrieved?.id).toEqual('storage_1');
  });
});
