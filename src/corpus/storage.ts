import { promises as fs } from 'fs';
import path from 'path';
import type { IdeaArtifact } from '../types/artifact';
import type { IdeationDomain } from '../types/domain';

export interface CorpusFilter {
  domain?: IdeationDomain;
  minQuality?: number;
  mode?: string;
}

export class CorpusStorage {
  constructor(private readonly rootPath: string) {}

  private artifactPath(id: string): string {
    return path.join(this.rootPath, `${id}.json`);
  }

  private async ensureRoot(): Promise<void> {
    await fs.mkdir(this.rootPath, { recursive: true });
  }

  async store(artifact: IdeaArtifact): Promise<void> {
    await this.ensureRoot();
    await fs.writeFile(this.artifactPath(artifact.id), JSON.stringify(artifact, null, 2));
  }

  async retrieve(id: string): Promise<IdeaArtifact | null> {
    try {
      const data = await fs.readFile(this.artifactPath(id), 'utf-8');
      return JSON.parse(data) as IdeaArtifact;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async list(filter: CorpusFilter = {}): Promise<IdeaArtifact[]> {
    await this.ensureRoot();
    const files = await fs.readdir(this.rootPath);
    const artifacts: IdeaArtifact[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) {
        continue;
      }
      const data = await fs.readFile(path.join(this.rootPath, file), 'utf-8');
      const artifact = JSON.parse(data) as IdeaArtifact;
      if (filter.domain && artifact.domain !== filter.domain) {
        continue;
      }
      if (filter.mode && artifact.metadata.mode !== filter.mode) {
        continue;
      }
      if (filter.minQuality && artifact.quality.composite < filter.minQuality) {
        continue;
      }
      artifacts.push(artifact);
    }
    return artifacts;
  }

  async update(id: string, update: Partial<IdeaArtifact>): Promise<IdeaArtifact | null> {
    const existing = await this.retrieve(id);
    if (!existing) {
      return null;
    }
    const merged = { ...existing, ...update };
    await this.store(merged);
    return merged;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await fs.unlink(this.artifactPath(id));
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  async getStats(): Promise<{
    total: number;
    byDomain: Record<IdeationDomain, number>;
    byMode: Record<string, number>;
    avgQuality: number;
  }> {
    const artifacts = await this.list();
    const byDomain = artifacts.reduce((acc, artifact) => {
      acc[artifact.domain] = (acc[artifact.domain] ?? 0) + 1;
      return acc;
    }, {} as Record<IdeationDomain, number>);

    const byMode = artifacts.reduce((acc, artifact) => {
      acc[artifact.metadata.mode] = (acc[artifact.metadata.mode] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgQuality =
      artifacts.reduce((sum, artifact) => sum + artifact.quality.composite, 0) /
      (artifacts.length || 1);

    return {
      total: artifacts.length,
      byDomain,
      byMode,
      avgQuality
    };
  }
}
