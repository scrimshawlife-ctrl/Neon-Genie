/**
 * Rune-Based Idea Identifier
 *
 * Generates unique, meaningful rune-based identifiers for ideas.
 * Each idea gets a rune signature that reflects its essential qualities.
 */

import { RuneSystem, Rune } from './runes';
import { IdeaArtifact } from '../types/artifact';

export interface RuneSignature {
  primary: Rune;        // Core rune representing the idea's essence
  secondary: Rune[];    // Supporting runes (2-3)
  identifier: string;   // Short rune-based identifier (3-5 characters)
  fullName: string;     // Full runic name
  meaning: string;      // Human-readable interpretation
  keywords: string[];   // Combined keywords from all runes
  power: number;        // 0-1 score based on rune synergy
}

export class RuneIdentifier {
  private runeSystem: RuneSystem;

  constructor() {
    this.runeSystem = new RuneSystem();
  }

  /**
   * Generate a rune signature for an idea
   */
  generateSignature(artifact: IdeaArtifact): RuneSignature {
    // Combine key aspects of the idea
    const essence = `${artifact.title} ${artifact.domain} ${artifact.themes.join(' ')}`;
    const seed = this.hashString(essence);

    // Select primary rune based on domain and essence
    const allRunes = this.runeSystem.getAllRunes();
    const primaryIdx = seed % allRunes.length;
    const primary = allRunes[primaryIdx];

    // Select 2-3 secondary runes
    const secondaryCount = 2 + (seed % 2);
    const secondary: Rune[] = [];
    for (let i = 1; i <= secondaryCount; i++) {
      const idx = (seed + i * 7) % allRunes.length;
      if (idx !== primaryIdx && !secondary.find(r => r.name === allRunes[idx].name)) {
        secondary.push(allRunes[idx]);
      }
    }

    // Generate identifier (rune characters)
    const identifier = primary.character + secondary.map(r => r.character).join('');

    // Generate full name (rune encoding of title)
    const fullName = this.runeSystem.toPhoneticRunes(artifact.title.substring(0, 20));

    // Build meaning
    const meaning = this.generateMeaning(primary, secondary, artifact);

    // Collect all keywords
    const keywords = [
      ...primary.keywords,
      ...secondary.flatMap(r => r.keywords)
    ].slice(0, 8);

    // Calculate power based on synergy
    const power = this.calculatePower(primary, secondary, artifact);

    return {
      primary,
      secondary,
      identifier,
      fullName,
      meaning,
      keywords: [...new Set(keywords)],
      power
    };
  }

  /**
   * Generate a short rune-based ID (for database/filesystem use)
   */
  generateShortId(artifact: IdeaArtifact): string {
    const signature = this.generateSignature(artifact);
    // Convert rune characters to hex-like representation for filesystem safety
    const chars = signature.identifier.split('');
    return chars.map(c => {
      const code = c.charCodeAt(0).toString(16).padStart(4, '0');
      return code.substring(2); // Take last 2 chars
    }).join('');
  }

  /**
   * Generate a human-readable rune name
   */
  generateName(artifact: IdeaArtifact): string {
    const signature = this.generateSignature(artifact);
    const runeNames = [signature.primary, ...signature.secondary].map(r => r.name);
    return `${runeNames[0]} of ${runeNames.slice(1).join(' and ')}`;
  }

  /**
   * Get rune-based tags for categorization
   */
  generateTags(artifact: IdeaArtifact): string[] {
    const signature = this.generateSignature(artifact);
    const tags: string[] = [];

    // Add aett (family) tags
    tags.push(`aett:${signature.primary.aett.toLowerCase()}`);

    // Add element tags
    [signature.primary, ...signature.secondary].forEach(rune => {
      if (rune.element) {
        tags.push(`element:${rune.element}`);
      }
    });

    // Add quality tags based on primary rune
    signature.primary.upright.qualities.forEach(q => {
      tags.push(`quality:${q.toLowerCase().replace(' ', '-')}`);
    });

    return [...new Set(tags)];
  }

  /**
   * Calculate synergy between runes
   */
  calculateSynergy(runes: Rune[]): number {
    if (runes.length < 2) return 0.5;

    let synergy = 0;
    const totalPairs = runes.length * (runes.length - 1) / 2;

    // Check element compatibility
    for (let i = 0; i < runes.length; i++) {
      for (let j = i + 1; j < runes.length; j++) {
        const rune1 = runes[i];
        const rune2 = runes[j];

        // Same aett bonus
        if (rune1.aett === rune2.aett) {
          synergy += 0.3;
        }

        // Element compatibility
        if (rune1.element && rune2.element) {
          if (this.elementsCompatible(rune1.element, rune2.element)) {
            synergy += 0.4;
          }
        }

        // Keyword overlap
        const overlap = rune1.keywords.filter(k => rune2.keywords.includes(k)).length;
        synergy += overlap * 0.1;
      }
    }

    return Math.min(1, synergy / totalPairs);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private generateMeaning(primary: Rune, secondary: Rune[], artifact: IdeaArtifact): string {
    const parts: string[] = [];

    parts.push(`The essence of ${primary.name} (${primary.meaning})`);

    if (secondary.length > 0) {
      const names = secondary.map(r => `${r.name} (${r.meaning})`).join(' and ');
      parts.push(`supported by ${names}`);
    }

    parts.push(`manifests in the ${artifact.domain} domain`);

    return parts.join(', ');
  }

  private calculatePower(primary: Rune, secondary: Rune[], artifact: IdeaArtifact): number {
    let power = 0.5; // Base power

    // Rune synergy
    const synergy = this.calculateSynergy([primary, ...secondary]);
    power += synergy * 0.3;

    // Quality score influence
    if (artifact.quality.composite) {
      power += artifact.quality.composite * 0.2;
    }

    return Math.min(1, power);
  }

  private elementsCompatible(elem1: string, elem2: string): boolean {
    const compatible: { [key: string]: string[] } = {
      'fire': ['air', 'fire'],
      'air': ['fire', 'air'],
      'water': ['earth', 'water'],
      'earth': ['water', 'earth'],
      'ice': ['water', 'air']
    };

    return compatible[elem1]?.includes(elem2) || false;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
