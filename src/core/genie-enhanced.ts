import { SemanticSearch } from '../corpus/semantic-search';
import type { IdeaArtifact, IdeationPrompt } from '../types/artifact';
import { BrandsDomainHandler } from '../domains/handlers/brands';
import { SoftwareDomainHandler } from '../domains/handlers/software';
import { defineArchitecture, generateComponents, generateConcept, parsePrompt } from './ideation-engine';
import { NeonGenie } from './genie';
import { createLineage, createProvenance, finalizeArtifact } from './provenance';

export class EnhancedNeonGenie extends NeonGenie {
  private readonly softwareHandler = new SoftwareDomainHandler();
  private readonly brandsHandler = new BrandsDomainHandler();
  private readonly semanticSearch = new SemanticSearch();

  async generateEnhanced(prompt: IdeationPrompt): Promise<IdeaArtifact> {
    const parsed = parsePrompt({ ...prompt, mode: this.mode });
    const concept = generateConcept(parsed);

    let components = generateComponents(parsed);
    let architecture = defineArchitecture(components, parsed.constraints);

    if (parsed.domain === 'software') {
      components = this.softwareHandler.generateComponents(parsed.concept, parsed.constraints);
      architecture = this.softwareHandler.defineArchitecture(parsed.constraints);
    }

    if (parsed.domain === 'brands') {
      const characteristics = this.brandsHandler.analyzeCharacteristics(parsed.concept);
      components = this.brandsHandler.generateComponents(characteristics);
      architecture = this.brandsHandler.defineArchitecture(characteristics);
    }

    const quality = this.scorer.score(parsed.concept);

    const artifact: IdeaArtifact = {
      id: this.generateId(),
      title: concept.title,
      domain: parsed.domain,
      concept: parsed.concept,
      problem: concept.problem,
      solution: concept.solution,
      themes: concept.themes,
      components,
      architecture,
      quality,
      provenance: createProvenance('neon-genie-enhanced'),
      lineage: createLineage(),
      metadata: {
        constraints: parsed.constraints,
        tags: parsed.tags,
        mode: this.mode,
        aestheticDirection: parsed.aestheticDirection,
        createdAt: new Date().toISOString()
      }
    };

    const finalized = finalizeArtifact(artifact);
    await this.storage.store(finalized);
    await this.semanticSearch.indexArtifact(finalized);
    return finalized;
  }

  async searchSemantic(query: string): Promise<IdeaArtifact[]> {
    return this.semanticSearch.search(query);
  }

  async findSimilarSemantic(text: string): Promise<IdeaArtifact[]> {
    return this.semanticSearch.findSimilar(text);
  }

  async detectDuplicates(threshold = 0.85): Promise<Array<[IdeaArtifact, IdeaArtifact]>> {
    return this.semanticSearch.findDuplicates(threshold);
  }

  getSemanticStats(): { count: number; memoryBytes: number } {
    return this.semanticSearch.getStats();
  }

}
