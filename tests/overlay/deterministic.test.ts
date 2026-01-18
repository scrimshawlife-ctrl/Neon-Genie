/**
 * Tests for Deterministic Utilities
 *
 * Verifies SEED compliance:
 * - Identical inputs produce identical outputs
 * - No hidden randomness or clock dependencies
 * - Stable hashing and ID generation
 */

import {
  deterministicId,
  generateArtifactId,
  SeededRandom,
  validateTimestamp,
  isoToMillis,
  contentHash,
  deriveSeed
} from '../../src/overlay/deterministic';

describe('Deterministic Utilities', () => {
  describe('deterministicId', () => {
    it('should generate same ID for same inputs', () => {
      const id1 = deterministicId('run-123', '2025-01-18T12:00:00Z', 'seed-abc');
      const id2 = deterministicId('run-123', '2025-01-18T12:00:00Z', 'seed-abc');

      expect(id1).toBe(id2);
      expect(id1).toHaveLength(16);
      expect(id1).toMatch(/^[0-9a-f]+$/); // Hex string
    });

    it('should generate different ID for different inputs', () => {
      const id1 = deterministicId('run-123', '2025-01-18T12:00:00Z');
      const id2 = deterministicId('run-456', '2025-01-18T12:00:00Z');

      expect(id1).not.toBe(id2);
    });

    it('should be order-sensitive', () => {
      const id1 = deterministicId('a', 'b', 'c');
      const id2 = deterministicId('c', 'b', 'a');

      expect(id1).not.toBe(id2);
    });
  });

  describe('generateArtifactId', () => {
    it('should generate same artifact ID for same provenance', () => {
      const id1 = generateArtifactId('run-123', '2025-01-18T12:00:00Z', 'seed-abc');
      const id2 = generateArtifactId('run-123', '2025-01-18T12:00:00Z', 'seed-abc');

      expect(id1).toBe(id2);
      expect(id1).toMatch(/^idea_[0-9a-f]{16}$/);
    });

    it('should generate different ID for different run_id', () => {
      const id1 = generateArtifactId('run-123', '2025-01-18T12:00:00Z');
      const id2 = generateArtifactId('run-456', '2025-01-18T12:00:00Z');

      expect(id1).not.toBe(id2);
    });

    it('should generate different ID for different timestamp', () => {
      const id1 = generateArtifactId('run-123', '2025-01-18T12:00:00Z');
      const id2 = generateArtifactId('run-123', '2025-01-18T13:00:00Z');

      expect(id1).not.toBe(id2);
    });
  });

  describe('SeededRandom', () => {
    it('should generate same sequence for same seed', () => {
      const rng1 = new SeededRandom('test-seed-123');
      const rng2 = new SeededRandom('test-seed-123');

      const sequence1 = [rng1.next(), rng1.next(), rng1.next()];
      const sequence2 = [rng2.next(), rng2.next(), rng2.next()];

      expect(sequence1).toEqual(sequence2);
    });

    it('should generate different sequence for different seed', () => {
      const rng1 = new SeededRandom('seed-a');
      const rng2 = new SeededRandom('seed-b');

      const val1 = rng1.next();
      const val2 = rng2.next();

      expect(val1).not.toBe(val2);
    });

    it('should generate numbers in [0, 1) range', () => {
      const rng = new SeededRandom('range-test');

      for (let i = 0; i < 100; i++) {
        const val = rng.next();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    });

    it('should generate same integer sequence for same seed', () => {
      const rng1 = new SeededRandom('int-seed');
      const rng2 = new SeededRandom('int-seed');

      const ints1 = [rng1.nextInt(0, 100), rng1.nextInt(0, 100), rng1.nextInt(0, 100)];
      const ints2 = [rng2.nextInt(0, 100), rng2.nextInt(0, 100), rng2.nextInt(0, 100)];

      expect(ints1).toEqual(ints2);
    });

    it('should shuffle array deterministically', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const rng1 = new SeededRandom('shuffle-seed');
      const rng2 = new SeededRandom('shuffle-seed');

      const shuffled1 = rng1.shuffle([...array]);
      const shuffled2 = rng2.shuffle([...array]);

      expect(shuffled1).toEqual(shuffled2);
      expect([...shuffled1].sort((a, b) => a - b)).toEqual(array); // Same elements
    });

    it('should pick same choice for same seed', () => {
      const choices = ['a', 'b', 'c', 'd', 'e'];

      const rng1 = new SeededRandom('choice-seed');
      const rng2 = new SeededRandom('choice-seed');

      const choice1 = rng1.choice(choices);
      const choice2 = rng2.choice(choices);

      expect(choice1).toBe(choice2);
    });

    it('should generate same alphanumeric string for same seed', () => {
      const rng1 = new SeededRandom('alpha-seed');
      const rng2 = new SeededRandom('alpha-seed');

      const str1 = rng1.alphanumeric(10);
      const str2 = rng2.alphanumeric(10);

      expect(str1).toBe(str2);
      expect(str1).toHaveLength(10);
      expect(str1).toMatch(/^[0-9a-z]+$/);
    });
  });

  describe('validateTimestamp', () => {
    it('should accept valid ISO 8601 timestamps', () => {
      const validTimestamps = [
        '2025-01-18T12:00:00Z',
        '2025-01-18T12:00:00.000Z',
        '2025-01-18T12:00:00+00:00',
        '2025-01-18T12:00:00-05:00'
      ];

      validTimestamps.forEach(ts => {
        expect(() => validateTimestamp(ts)).not.toThrow();
        expect(validateTimestamp(ts)).toBe(ts);
      });
    });

    it('should reject invalid timestamps', () => {
      const invalidTimestamps = [
        'not-a-date',
        '2025-13-40T99:99:99Z', // Invalid date
        '12345678', // Unix timestamp
        ''
      ];

      invalidTimestamps.forEach(ts => {
        expect(() => validateTimestamp(ts)).toThrow(/Invalid ISO 8601 timestamp/);
      });
    });
  });

  describe('isoToMillis', () => {
    it('should convert ISO timestamp to milliseconds', () => {
      const iso = '2025-01-18T12:00:00Z';
      const millis = isoToMillis(iso);

      expect(millis).toBe(new Date(iso).getTime());
      expect(typeof millis).toBe('number');
    });

    it('should produce same result for equivalent timestamps', () => {
      const iso1 = '2025-01-18T12:00:00Z';
      const iso2 = '2025-01-18T12:00:00.000Z';

      expect(isoToMillis(iso1)).toBe(isoToMillis(iso2));
    });
  });

  describe('contentHash', () => {
    it('should generate same hash for same content', () => {
      const content = { key: 'value', number: 42 };

      const hash1 = contentHash(content);
      const hash2 = contentHash(content);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex length
    });

    it('should generate different hash for different content', () => {
      const content1 = { key: 'value1' };
      const content2 = { key: 'value2' };

      const hash1 = contentHash(content1);
      const hash2 = contentHash(content2);

      expect(hash1).not.toBe(hash2);
    });

    it('should be order-independent for object keys', () => {
      const content1 = { a: 1, b: 2, c: 3 };
      const content2 = { c: 3, b: 2, a: 1 };

      const hash1 = contentHash(content1);
      const hash2 = contentHash(content2);

      expect(hash1).toBe(hash2);
    });

    it('should handle string content', () => {
      const str = 'test string';

      const hash1 = contentHash(str);
      const hash2 = contentHash(str);

      expect(hash1).toBe(hash2);
    });
  });

  describe('deriveSeed', () => {
    it('should return explicit seed when provided', () => {
      const runId = 'run-123';
      const timestamp = '2025-01-18T12:00:00Z';
      const explicitSeed = 'my-explicit-seed';

      const seed = deriveSeed(runId, timestamp, explicitSeed);

      expect(seed).toBe(explicitSeed);
    });

    it('should derive deterministic seed from run_id and timestamp', () => {
      const runId = 'run-123';
      const timestamp = '2025-01-18T12:00:00Z';

      const seed1 = deriveSeed(runId, timestamp);
      const seed2 = deriveSeed(runId, timestamp);

      expect(seed1).toBe(seed2);
      expect(seed1).toMatch(/^[0-9a-f]{64}$/); // SHA-256 hex
    });

    it('should derive different seed for different inputs', () => {
      const seed1 = deriveSeed('run-123', '2025-01-18T12:00:00Z');
      const seed2 = deriveSeed('run-456', '2025-01-18T12:00:00Z');

      expect(seed1).not.toBe(seed2);
    });
  });

  describe('CRITICAL: Determinism end-to-end test', () => {
    it('should produce identical artifact IDs across multiple runs with same provenance', () => {
      const provenance = {
        run_id: 'test-run-001',
        timestamp_iso: '2025-01-18T12:00:00.000Z',
        seed: 'deterministic-test-seed'
      };

      // Simulate 5 identical runs
      const ids = Array.from({ length: 5 }, () =>
        generateArtifactId(provenance.run_id, provenance.timestamp_iso, provenance.seed)
      );

      // All IDs must be identical
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(1);
      expect(ids[0]).toMatch(/^idea_[0-9a-f]{16}$/);
    });

    it('should produce different artifact IDs for different run_ids', () => {
      const timestamp = '2025-01-18T12:00:00.000Z';
      const seed = 'same-seed';

      const id1 = generateArtifactId('run-001', timestamp, seed);
      const id2 = generateArtifactId('run-002', timestamp, seed);
      const id3 = generateArtifactId('run-003', timestamp, seed);

      const uniqueIds = new Set([id1, id2, id3]);
      expect(uniqueIds.size).toBe(3);
    });
  });
});
