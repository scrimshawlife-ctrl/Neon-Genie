/**
 * Deterministic Utilities for AAL/ABX-Runes Overlay
 *
 * Provides cryptographically stable, seedable functions that replace
 * non-deterministic operations (Date.now(), Math.random(), UUID v4).
 *
 * SEED Compliance:
 * - All randomness derives from explicit seed
 * - All timestamps come from provenance.timestamp_iso
 * - All IDs computed via SHA-256 hashing
 */

import * as crypto from 'crypto';

/**
 * Generate a deterministic ID from components using SHA-256
 *
 * @param components - Ordered list of values to hash
 * @returns Deterministic hex string (16 chars)
 */
export function deterministicId(...components: (string | number)[]): string {
  const input = components.join('::');
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  return hash.slice(0, 16);
}

/**
 * Generate artifact ID with deterministic hash
 *
 * @param runId - Unique run identifier from provenance
 * @param timestamp - ISO timestamp from provenance
 * @param seed - Optional seed for additional entropy
 * @returns Artifact ID in format: idea_{hash}
 */
export function generateArtifactId(
  runId: string,
  timestamp: string,
  seed?: string
): string {
  const components = [runId, timestamp];
  if (seed) {
    components.push(seed);
  }
  const hash = deterministicId(...components);
  return `idea_${hash}`;
}

/**
 * Seeded pseudo-random number generator (PRNG)
 * Uses SHA-256 to create deterministic sequence
 */
export class SeededRandom {
  private state: string;
  private counter: number;

  constructor(seed: string) {
    this.state = seed;
    this.counter = 0;
  }

  /**
   * Generate next random number in [0, 1)
   */
  next(): number {
    const input = `${this.state}::${this.counter}`;
    const hash = crypto.createHash('sha256').update(input).digest();
    this.counter++;

    // Convert first 8 bytes to number in [0, 1)
    let value = 0;
    for (let i = 0; i < 8; i++) {
      value = value * 256 + hash[i];
    }
    // Normalize to [0, 1) range
    return value / (256 ** 8);
  }

  /**
   * Generate random integer in [min, max)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Shuffle array in-place using Fisher-Yates
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Pick random element from array
   */
  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)];
  }

  /**
   * Generate random alphanumeric string
   */
  alphanumeric(length: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[this.nextInt(0, chars.length)];
    }
    return result;
  }
}

/**
 * Create deterministic timestamp validator
 *
 * @param timestampIso - ISO 8601 timestamp string
 * @returns Validated timestamp or throws
 */
export function validateTimestamp(timestampIso: string): string {
  const parsed = new Date(timestampIso);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid ISO 8601 timestamp: ${timestampIso}`);
  }
  return timestampIso;
}

/**
 * Extract Unix milliseconds from ISO timestamp
 * (for compatibility with existing code expecting numeric timestamps)
 *
 * @param timestampIso - ISO 8601 timestamp
 * @returns Milliseconds since epoch
 */
export function isoToMillis(timestampIso: string): number {
  return new Date(timestampIso).getTime();
}

/**
 * Deterministic content hash (SHA-256)
 *
 * @param content - Content to hash (object will be JSON stringified)
 * @returns Hex hash string
 */
export function contentHash(content: unknown): string {
  const serialized = typeof content === 'string'
    ? content
    : JSON.stringify(content, Object.keys(content as object).sort());

  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Create a deterministic seed from run metadata
 * If no explicit seed provided, derives from run_id + timestamp
 *
 * @param runId - Run identifier
 * @param timestamp - ISO timestamp
 * @param explicitSeed - Optional explicit seed
 * @returns Deterministic seed string
 */
export function deriveSeed(
  runId: string,
  timestamp: string,
  explicitSeed?: string
): string {
  if (explicitSeed) {
    return explicitSeed;
  }
  return contentHash(`${runId}::${timestamp}`);
}
