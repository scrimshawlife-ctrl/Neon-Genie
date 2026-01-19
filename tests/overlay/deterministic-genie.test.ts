/**
 * Tests for DeterministicNeonGenie
 *
 * Verifies:
 * - Deterministic artifact generation
 * - Provenance injection
 * - Identical inputs → identical outputs
 */

import { DeterministicNeonGenie } from '../../src/overlay/deterministic-genie';
import type { IdeationPrompt } from '../../src/types/artifact';
import * as fs from 'fs/promises';
import * as path from 'path';

const TEST_CORPUS_PATH = path.join(__dirname, '../../.test-corpus-overlay');

describe('DeterministicNeonGenie', () => {
  beforeAll(async () => {
    // Ensure clean test corpus directory
    try {
      await fs.rm(TEST_CORPUS_PATH, { recursive: true, force: true });
    } catch {
      // Ignore if doesn't exist
    }
    await fs.mkdir(TEST_CORPUS_PATH, { recursive: true });
  });

  afterAll(async () => {
    // Cleanup test corpus
    try {
      await fs.rm(TEST_CORPUS_PATH, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Constructor', () => {
    it('should require provenance in config', () => {
      expect(() => {
        new DeterministicNeonGenie({
          corpusPath: TEST_CORPUS_PATH
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any); // Intentionally missing provenance
      }).toThrow(/requires provenance/);
    });

    it('should validate timestamp_iso format', () => {
      expect(() => {
        new DeterministicNeonGenie({
          corpusPath: TEST_CORPUS_PATH,
          provenance: {
            run_id: 'test-run',
            timestamp_iso: 'invalid-timestamp'
          }
        });
      }).toThrow(/Invalid ISO 8601 timestamp/);
    });

    it('should accept valid provenance', () => {
      expect(() => {
        new DeterministicNeonGenie({
          corpusPath: TEST_CORPUS_PATH,
          provenance: {
            run_id: 'test-run',
            timestamp_iso: '2025-01-18T12:00:00Z'
          }
        });
      }).not.toThrow();
    });
  });

  describe('Deterministic Generation', () => {
    it('should generate identical artifacts for identical inputs', async () => {
      const prompt: IdeationPrompt = {
        concept: 'Deterministic testing platform',
        domain: 'software',
        constraints: ['open-source', 'reproducible'],
        tags: ['testing', 'determinism']
      };

      const provenance = {
        run_id: 'det-test-001',
        timestamp_iso: '2025-01-18T12:00:00.000Z',
        seed: 'test-seed-123'
      };

      const genie1 = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance,
        mode: 'standalone'
      });

      const genie2 = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance,
        mode: 'standalone'
      });

      const artifact1 = await genie1.generate(prompt);
      const artifact2 = await genie2.generate(prompt);

      // Critical: IDs must match
      expect(artifact1.id).toBe(artifact2.id);

      // All deterministic fields must match
      expect(artifact1.title).toBe(artifact2.title);
      expect(artifact1.domain).toBe(artifact2.domain);
      expect(artifact1.concept).toBe(artifact2.concept);
      expect(artifact1.problem).toBe(artifact2.problem);
      expect(artifact1.solution).toBe(artifact2.solution);
      expect(artifact1.themes).toEqual(artifact2.themes);

      // Provenance timestamp must match
      expect(artifact1.provenance.timestamp).toBe(provenance.timestamp_iso);
      expect(artifact2.provenance.timestamp).toBe(provenance.timestamp_iso);

      // Must include overlay run tracking
      expect(artifact1.provenance.transformations).toContain(`overlay_run:${provenance.run_id}`);
    });

    it('should generate different artifacts for different run_ids', async () => {
      const prompt: IdeationPrompt = {
        concept: 'Test concept',
        domain: 'software'
      };

      const genie1 = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance: {
          run_id: 'run-001',
          timestamp_iso: '2025-01-18T12:00:00Z',
          seed: 'same-seed'
        }
      });

      const genie2 = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance: {
          run_id: 'run-002',
          timestamp_iso: '2025-01-18T12:00:00Z',
          seed: 'same-seed'
        }
      });

      const artifact1 = await genie1.generate(prompt);
      const artifact2 = await genie2.generate(prompt);

      // IDs must differ
      expect(artifact1.id).not.toBe(artifact2.id);
    });

    it('should generate different artifacts for different timestamps', async () => {
      const prompt: IdeationPrompt = {
        concept: 'Test concept',
        domain: 'software'
      };

      const genie1 = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance: {
          run_id: 'run-001',
          timestamp_iso: '2025-01-18T12:00:00Z'
        }
      });

      const genie2 = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance: {
          run_id: 'run-001',
          timestamp_iso: '2025-01-18T13:00:00Z'
        }
      });

      const artifact1 = await genie1.generate(prompt);
      const artifact2 = await genie2.generate(prompt);

      // IDs must differ
      expect(artifact1.id).not.toBe(artifact2.id);
    });
  });

  describe('Analyze Operation', () => {
    it('should produce deterministic analysis reports', async () => {
      const prompt: IdeationPrompt = {
        concept: 'Analysis test concept',
        domain: 'software'
      };

      const provenance = {
        run_id: 'analyze-001',
        timestamp_iso: '2025-01-18T12:00:00Z',
        seed: 'analyze-seed'
      };

      const genie1 = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance
      });

      const genie2 = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance
      });

      const report1 = await genie1.analyze(prompt);
      const report2 = await genie2.analyze(prompt);

      // IDs must match
      expect(report1.id).toBe(report2.id);

      // Content must match
      expect(report1.summary).toBe(report2.summary);
      expect(report1.recommendations).toEqual(report2.recommendations);
      expect(report1.risks).toEqual(report2.risks);
      expect(report1.opportunities).toEqual(report2.opportunities);
    });
  });

  describe('Provenance Tracking', () => {
    it('should expose provenance via getProvenance()', () => {
      const provenance = {
        run_id: 'prov-test-001',
        timestamp_iso: '2025-01-18T12:00:00Z',
        seed: 'prov-seed'
      };

      const genie = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance
      });

      const retrieved = genie.getProvenance();

      expect(retrieved.run_id).toBe(provenance.run_id);
      expect(retrieved.timestamp_iso).toBe(provenance.timestamp_iso);
      expect(retrieved.seed).toBe(provenance.seed);
    });

    it('should return copy of provenance (not reference)', () => {
      const provenance = {
        run_id: 'copy-test',
        timestamp_iso: '2025-01-18T12:00:00Z'
      };

      const genie = new DeterministicNeonGenie({
        corpusPath: TEST_CORPUS_PATH,
        provenance
      });

      const retrieved = genie.getProvenance();
      retrieved.run_id = 'modified';

      // Original should be unchanged
      expect(genie.getProvenance().run_id).toBe('copy-test');
    });
  });

  describe('CRITICAL: End-to-End Determinism', () => {
    it('should produce byte-identical artifacts across 10 independent runs', async () => {
      const prompt: IdeationPrompt = {
        concept: 'End-to-end determinism test platform for distributed systems',
        domain: 'software',
        constraints: ['cloud-native', 'fault-tolerant', 'observable'],
        aestheticDirection: 'minimalist',
        tags: ['e2e', 'determinism', 'distributed']
      };

      const provenance = {
        run_id: 'e2e-determinism-001',
        timestamp_iso: '2025-01-18T12:34:56.789Z',
        seed: 'critical-determinism-seed'
      };

      // Run 10 times
      const artifacts = await Promise.all(
        Array.from({ length: 10 }, async () => {
          const genie = new DeterministicNeonGenie({
            corpusPath: TEST_CORPUS_PATH,
            provenance,
            mode: 'standalone'
          });
          return await genie.generate(prompt);
        })
      );

      // All artifacts must be identical
      const firstArtifact = artifacts[0];

      artifacts.forEach((artifact, _index) => {
        expect(artifact.id).toBe(firstArtifact.id);
        expect(artifact.title).toBe(firstArtifact.title);
        expect(artifact.concept).toBe(firstArtifact.concept);
        expect(artifact.problem).toBe(firstArtifact.problem);
        expect(artifact.solution).toBe(firstArtifact.solution);
        expect(artifact.themes).toEqual(firstArtifact.themes);
        expect(artifact.components).toEqual(firstArtifact.components);
        expect(artifact.architecture).toEqual(firstArtifact.architecture);
        expect(artifact.quality).toEqual(firstArtifact.quality);
        expect(artifact.provenance.timestamp).toBe(provenance.timestamp_iso);
      });

      // Verify unique ID across runs
      const uniqueIds = new Set(artifacts.map(a => a.id));
      expect(uniqueIds.size).toBe(1);
    });
  });
});
