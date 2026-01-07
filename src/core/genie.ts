import { CorpusStorage } from '../corpus/storage';
import type { AnalysisReport, IdeaArtifact, IdeationPrompt } from '../types/artifact';
import type { IdeationDomain } from '../types/domain';
import { createLineage, createProvenance, finalizeArtifact, trackTransformation } from './provenance';
import {
  defineArchitecture,
  generateComponents,
  generateConcept,
  parsePrompt
} from './ideation-engine';
import { QualityScorer } from './quality-scorer';

export interface GenieConfig {
  corpusPath?: string;
  mode?: string;
}

export class NeonGenie {
  protected readonly storage: CorpusStorage;
  protected readonly scorer: QualityScorer;
  protected readonly mode: string;

  constructor(config: GenieConfig = {}) {
    this.storage = new CorpusStorage(config.corpusPath ?? 'corpus');
    this.scorer = new QualityScorer();
    this.mode = config.mode ?? 'standalone';
  }

  async generate(prompt: IdeationPrompt): Promise<IdeaArtifact> {
    const parsed = parsePrompt({ ...prompt, mode: this.mode });
    const concept = generateConcept(parsed);
    const components = generateComponents(parsed);
    const architecture = defineArchitecture(components, parsed.constraints);
    const quality = this.scorer.score(prompt.concept);

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
      provenance: createProvenance('neon-genie'),
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
    return finalized;
  }

  async analyze(prompt: IdeationPrompt): Promise<AnalysisReport> {
    const artifact = await this.generate(prompt);
    return {
      id: artifact.id,
      summary: `Analysis for ${artifact.title} in ${artifact.domain}.`,
      recommendations: artifact.quality.breakdown.refinements,
      risks: ['Ensure constraints are fully validated before deployment.'],
      opportunities: ['Expand into adjacent domains for scale.'],
      score: artifact.quality
    };
  }

  async evolve(parentId: string, feedback: string[]): Promise<IdeaArtifact | null> {
    const parent = await this.storage.retrieve(parentId);
    if (!parent) {
      return null;
    }
    const updatedPrompt: IdeationPrompt = {
      concept: `${parent.concept} refined with ${feedback.join(', ')}`,
      domain: parent.domain,
      constraints: parent.metadata.constraints,
      tags: parent.metadata.tags,
      aestheticDirection: parent.metadata.aestheticDirection,
      mode: this.mode
    };
    const parsed = parsePrompt(updatedPrompt);
    const concept = generateConcept(parsed);
    const components = generateComponents(parsed);
    const architecture = defineArchitecture(components, parsed.constraints);
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
      provenance: trackTransformation(parent.provenance, 'Evolved with feedback'),
      lineage: createLineage(parent.id),
      metadata: {
        constraints: parsed.constraints,
        tags: parsed.tags,
        mode: this.mode,
        aestheticDirection: parsed.aestheticDirection,
        createdAt: new Date().toISOString()
      }
    };

    const finalized = finalizeArtifact({
      ...artifact,
      lineage: {
        ...artifact.lineage,
        children: []
      }
    });

    parent.lineage.children.push(finalized.id);
    await this.storage.store(parent);
    await this.storage.store(finalized);
    return finalized;
  }

  async search(query: string): Promise<IdeaArtifact[]> {
    const artifacts = await this.storage.list();
    return artifacts.filter((artifact) =>
      `${artifact.title} ${artifact.concept} ${artifact.solution}`.toLowerCase().includes(query.toLowerCase())
    );
  }

  async findSimilar(id: string): Promise<IdeaArtifact[]> {
    const artifact = await this.storage.retrieve(id);
    if (!artifact) {
      return [];
    }
    const artifacts = await this.storage.list({ domain: artifact.domain });
    return artifacts
      .filter((item) => item.id !== id)
      .sort((a, b) => this.calculateSimilarityScore(artifact, b) - this.calculateSimilarityScore(artifact, a))
      .slice(0, 5);
  }

  async export(id: string, format: 'json' | 'markdown'): Promise<string | null> {
    const artifact = await this.storage.retrieve(id);
    if (!artifact) {
      return null;
    }
    if (format === 'json') {
      return JSON.stringify(artifact, null, 2);
    }
    return this.exportMarkdown(artifact);
  }

  getMode(): string {
    return this.mode;
  }

  async getStats(): Promise<{
    total: number;
    byDomain: Record<IdeationDomain, number>;
    byMode: Record<string, number>;
    avgQuality: number;
  }> {
    return this.storage.getStats();
  }

  protected generateId(): string {
    return `idea_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  protected calculateSimilarityScore(a: IdeaArtifact, b: IdeaArtifact): number {
    const sharedTags = a.metadata.tags.filter((tag) => b.metadata.tags.includes(tag)).length;
    return (sharedTags + a.themes.filter((theme) => b.themes.includes(theme)).length) / 10;
  }

  protected exportMarkdown(artifact: IdeaArtifact): string {
    return [
      `# ${artifact.title}`,
      `**Domain:** ${artifact.domain}`,
      `**Concept:** ${artifact.concept}`,
      `## Problem`,
      artifact.problem,
      `## Solution`,
      artifact.solution,
      `## Components`,
      ...artifact.components.map((component) => `- ${component.name}: ${component.function}`),
      `## Architecture`,
      `- Storage: ${artifact.architecture.storage}`,
      `- Computation: ${artifact.architecture.computation}`,
      `- Interface: ${artifact.architecture.interface}`,
      `## Quality`,
      `Composite Score: ${artifact.quality.composite.toFixed(2)}`
    ].join('\n');
  }
}
