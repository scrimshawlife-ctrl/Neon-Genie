import type { IdeaArtifact } from '../types/artifact';

interface IndexedArtifact {
  artifact: IdeaArtifact;
  embedding: number[];
}

export class SemanticSearch {
  private readonly index = new Map<string, IndexedArtifact>();
  private pipelinePromise: Promise<((text: string) => Promise<number[]>) | null> | null = null;

  private async getPipeline(): Promise<((text: string) => Promise<number[]>) | null> {
    if (!this.pipelinePromise) {
      this.pipelinePromise = import('@xenova/transformers')
        .then(async (module) => {
          const extractor = await module.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
          return async (text: string) => {
            const output = await extractor(text, { pooling: 'mean', normalize: true });
            return Array.from(output.data) as number[];
          };
        })
        .catch(() => null);
    }
    return this.pipelinePromise;
  }

  private mockEmbedding(text: string): number[] {
    const vector = new Array(384).fill(0);
    const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
    tokens.forEach((token, index) => {
      const hash = token.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const position = (hash + index * 13) % vector.length;
      vector[position] += 0.05;
    });
    return vector;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const pipeline = await this.getPipeline();
    if (!pipeline) {
      return this.mockEmbedding(text);
    }
    return pipeline(text);
  }

  async indexArtifact(artifact: IdeaArtifact): Promise<void> {
    const embedding = await this.generateEmbedding(
      `${artifact.title} ${artifact.concept} ${artifact.solution}`
    );
    this.index.set(artifact.id, { artifact, embedding });
  }

  async indexBatch(artifacts: IdeaArtifact[]): Promise<void> {
    for (const artifact of artifacts) {
      await this.indexArtifact(artifact);
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i += 1) {
      dot += a[i] * b[i];
      normA += a[i] ** 2;
      normB += b[i] ** 2;
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  async findSimilar(text: string, limit = 5): Promise<IdeaArtifact[]> {
    const queryEmbedding = await this.generateEmbedding(text);
    const scored = Array.from(this.index.values()).map((entry) => ({
      artifact: entry.artifact,
      score: this.cosineSimilarity(queryEmbedding, entry.embedding)
    }));
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => entry.artifact);
  }

  async search(query: string, limit = 5): Promise<IdeaArtifact[]> {
    return this.findSimilar(query, limit);
  }

  async findDuplicates(threshold = 0.85): Promise<Array<[IdeaArtifact, IdeaArtifact]>> {
    const entries = Array.from(this.index.values());
    const duplicates: Array<[IdeaArtifact, IdeaArtifact]> = [];
    for (let i = 0; i < entries.length; i += 1) {
      for (let j = i + 1; j < entries.length; j += 1) {
        const similarity = this.cosineSimilarity(entries[i].embedding, entries[j].embedding);
        if (similarity >= threshold) {
          duplicates.push([entries[i].artifact, entries[j].artifact]);
        }
      }
    }
    return duplicates;
  }

  getStats(): { count: number; memoryBytes: number } {
    const memoryBytes = Array.from(this.index.values()).reduce(
      (sum, entry) => sum + entry.embedding.length * 8,
      0
    );
    return { count: this.index.size, memoryBytes };
  }
}
