import type { Architecture, Component, IdeationPrompt } from '../types/artifact';

export interface ParsedPrompt {
  concept: string;
  domain: IdeationPrompt['domain'];
  constraints: string[];
  aestheticDirection?: string;
  tags: string[];
}

export interface Concept {
  title: string;
  problem: string;
  solution: string;
  themes: string[];
}

export const parsePrompt = (prompt: IdeationPrompt): ParsedPrompt => ({
  concept: prompt.concept.trim(),
  domain: prompt.domain,
  constraints: prompt.constraints ?? [],
  aestheticDirection: prompt.aestheticDirection,
  tags: prompt.tags ?? []
});

export const extractThemes = (concept: string): string[] => {
  const tokens = concept
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);
  return Array.from(new Set(tokens)).slice(0, 5);
};

export const generateTitle = (concept: string): string => {
  const words = concept.split(' ').filter(Boolean);
  return words.slice(0, 4).join(' ');
};

export const identifyProblem = (concept: string): string =>
  `The current landscape lacks a focused solution for ${concept.toLowerCase()}.`;

export const proposeSolution = (concept: string): string =>
  `Introduce a system that orchestrates ${concept.toLowerCase()} with clear outcomes.`;

export const generateConcept = (parsed: ParsedPrompt): Concept => ({
  title: generateTitle(parsed.concept),
  problem: identifyProblem(parsed.concept),
  solution: proposeSolution(parsed.concept),
  themes: extractThemes(parsed.concept)
});

export const generateComponents = (
  parsed: ParsedPrompt
): Component[] => {
  const baseTech = parsed.domain === 'software' ? ['TypeScript', 'Node.js'] : ['Strategy'];
  return [
    {
      name: 'Core Engine',
      function: 'Coordinates the ideation flow and orchestrates outputs.',
      owner: 'Core Team',
      integration: 'Integrates with domain-specific handlers.',
      tech: baseTech,
      features: ['Prompt parsing', 'Concept synthesis', 'Quality scoring']
    },
    {
      name: 'Experience Layer',
      function: 'Delivers the result to stakeholders with clarity.',
      owner: 'Experience Team',
      integration: 'Connects to export and distribution channels.',
      tech: parsed.domain === 'brands' ? ['Design Systems', 'Figma'] : ['Markdown'],
      features: ['Narrative framing', 'Visualization', 'Export readiness']
    }
  ];
};

export const defineArchitecture = (
  components: Component[],
  constraints: string[]
): Architecture => {
  const hasRealtime = constraints.some((item) => item.toLowerCase().includes('realtime'));
  return {
    storage: hasRealtime ? 'Event-sourced data store' : 'Document-oriented store',
    computation: 'Modular services with deterministic pipelines',
    interface: hasRealtime ? 'Streaming dashboard' : 'Insight portal',
    ecosystem_mapping: components.map((component) => component.name)
  };
};
