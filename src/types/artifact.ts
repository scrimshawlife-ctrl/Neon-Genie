import type { IdeationDomain } from './domain';
import type { QualityScore } from './quality';

export interface Component {
  name: string;
  function: string;
  owner: string;
  integration: string;
  tech: string[];
  features: string[];
}

export interface Architecture {
  storage: string;
  computation: string;
  interface: string;
  ecosystem_mapping: string[];
}

export interface Provenance {
  origin: string;
  generator: string;
  transformations: string[];
  timestamp: string;
}

export interface Lineage {
  parent?: string;
  children: string[];
  hash?: string;
}

export interface IdeationPrompt {
  concept: string;
  domain: IdeationDomain;
  constraints?: string[];
  aestheticDirection?: string;
  tags?: string[];
  mode?: string;
}

export interface AnalysisReport {
  id: string;
  summary: string;
  recommendations: string[];
  risks: string[];
  opportunities: string[];
  score: QualityScore;
}

export interface IdeaArtifact {
  id: string;
  title: string;
  domain: IdeationDomain;
  concept: string;
  problem: string;
  solution: string;
  themes: string[];
  components: Component[];
  architecture: Architecture;
  quality: QualityScore;
  provenance: Provenance;
  lineage: Lineage;
  metadata: {
    constraints: string[];
    tags: string[];
    mode: string;
    aestheticDirection?: string;
    createdAt: string;
  };
}
