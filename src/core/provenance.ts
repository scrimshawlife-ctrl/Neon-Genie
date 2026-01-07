import crypto from 'crypto';
import type { IdeaArtifact, Lineage, Provenance } from '../types/artifact';

const ORIGIN = 'neon-genie-v3.7.0';

export const createProvenance = (generator = 'neon-genie-core'): Provenance => ({
  origin: ORIGIN,
  generator,
  transformations: [],
  timestamp: new Date().toISOString()
});

export const trackTransformation = (
  provenance: Provenance,
  transformation: string
): Provenance => ({
  ...provenance,
  transformations: [...provenance.transformations, transformation],
  timestamp: new Date().toISOString()
});

export const createLineage = (parent?: string): Lineage => ({
  parent,
  children: []
});

export const generateHash = (content: unknown): string => {
  const canonical = JSON.stringify(content, Object.keys(content as object).sort());
  return crypto.createHash('sha256').update(canonical).digest('hex');
};

export const finalizeArtifact = (artifact: IdeaArtifact): IdeaArtifact => {
  const hash = generateHash({
    id: artifact.id,
    title: artifact.title,
    concept: artifact.concept,
    components: artifact.components,
    architecture: artifact.architecture
  });

  return {
    ...artifact,
    lineage: {
      ...artifact.lineage,
      hash
    }
  };
};
