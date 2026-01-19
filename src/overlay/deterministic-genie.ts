/**
 * Deterministic NeonGenie Subclass
 *
 * Extends NeonGenie to provide SEED-compliant deterministic execution:
 * - ID generation via SHA-256 hashing
 * - Provenance-tracked timestamps
 * - Optional seeded randomness
 *
 * NO CHANGES to core NeonGenie API surface.
 */

import { NeonGenie, type GenieConfig } from '../core/genie';
import type { IdeaArtifact, IdeationPrompt } from '../types/artifact';
import type { OverlayProvenance } from './types';
import { generateArtifactId, deriveSeed, validateTimestamp } from './deterministic';

/**
 * Extended config with overlay provenance
 */
export interface DeterministicGenieConfig extends GenieConfig {
  /** Required provenance for deterministic execution */
  provenance: OverlayProvenance;
}

/**
 * Deterministic variant of NeonGenie
 *
 * Overrides non-deterministic methods:
 * - generateId() uses SHA-256 instead of Date.now() + Math.random()
 * - Timestamps from provenance.timestamp_iso instead of current time
 */
export class DeterministicNeonGenie extends NeonGenie {
  private readonly provenance: OverlayProvenance;
  private readonly seed: string;

  constructor(config: DeterministicGenieConfig) {
    super(config);

    // Validate provenance
    if (!config.provenance) {
      throw new Error('DeterministicNeonGenie requires provenance in config');
    }

    validateTimestamp(config.provenance.timestamp_iso);
    this.provenance = config.provenance;
    this.seed = deriveSeed(
      config.provenance.run_id,
      config.provenance.timestamp_iso,
      config.provenance.seed
    );
  }

  /**
   * Override: Generate deterministic artifact ID
   *
   * Uses SHA-256 hash of (run_id, timestamp, seed) instead of
   * Date.now() + Math.random()
   */
  protected generateId(): string {
    return generateArtifactId(
      this.provenance.run_id,
      this.provenance.timestamp_iso,
      this.seed
    );
  }

  /**
   * Override: Generate with provenance injection
   *
   * Ensures timestamp comes from provenance, not Date.now()
   */
  async generate(prompt: IdeationPrompt): Promise<IdeaArtifact> {
    const artifact = await super.generate(prompt);

    // Inject deterministic timestamp into provenance
    artifact.provenance.timestamp = this.provenance.timestamp_iso;

    // Add run_id to provenance transformations
    artifact.provenance.transformations.push(`overlay_run:${this.provenance.run_id}`);

    return artifact;
  }

  /**
   * Override: Analyze with provenance injection
   */
  async analyze(prompt: IdeationPrompt): Promise<import('../types/artifact').AnalysisReport> {
    const report = await super.analyze(prompt);

    // Inject deterministic ID and timestamp
    const deterministicId = this.generateId();
    return {
      ...report,
      id: deterministicId
    };
  }

  /**
   * Get overlay provenance
   */
  getProvenance(): OverlayProvenance {
    return { ...this.provenance };
  }
}
