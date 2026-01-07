export type IdeationDomain =
  | 'software'
  | 'brands'
  | 'products'
  | 'content'
  | 'business'
  | 'systems'
  | 'creative'
  | 'research'
  | 'events'
  | 'education';

export const DOMAIN_METADATA: Record<
  IdeationDomain,
  { description: string; primarySignals: string[] }
> = {
  software: {
    description: 'Digital products, platforms, and technical systems.',
    primarySignals: ['stack', 'architecture', 'users']
  },
  brands: {
    description: 'Identity, positioning, and experiential brand systems.',
    primarySignals: ['aesthetic', 'voice', 'audience']
  },
  products: {
    description: 'Physical or digital offerings and their ecosystems.',
    primarySignals: ['materials', 'manufacturing', 'distribution']
  },
  content: {
    description: 'Narratives, media strategies, and publishing systems.',
    primarySignals: ['story', 'format', 'distribution']
  },
  business: {
    description: 'Operating models, go-to-market, and revenue engines.',
    primarySignals: ['model', 'market', 'ops']
  },
  systems: {
    description: 'Complex infrastructures and interconnected processes.',
    primarySignals: ['flows', 'dependencies', 'optimization']
  },
  creative: {
    description: 'Artistic explorations, concepts, and experiential design.',
    primarySignals: ['expression', 'medium', 'emotion']
  },
  research: {
    description: 'Investigation, discovery, and experimental programs.',
    primarySignals: ['hypothesis', 'method', 'insight']
  },
  events: {
    description: 'Experiential gatherings, rituals, and live engagements.',
    primarySignals: ['journey', 'venue', 'participation']
  },
  education: {
    description: 'Learning systems, curricula, and knowledge transfer.',
    primarySignals: ['curriculum', 'pedagogy', 'outcomes']
  }
};
