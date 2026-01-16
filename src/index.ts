// Core exports
export { NeonGenie, GenieConfig } from './core/genie';
export { EnhancedNeonGenie } from './core/genie-enhanced';

// Domain handlers
export { SoftwareDomainHandler } from './domains/handlers/software';
export { BrandsDomainHandler } from './domains/handlers/brands';

// Semantic search
export { SemanticSearch } from './corpus/semantic-search';

// Abraxas integration
export { AbraxasClient, AbraxasConfig } from './abraxas/client';
export { SymbolicResonanceScorer } from './quality/symbolic-resonance';
export { EnhancedQualityScorer } from './quality/enhanced-scorer';

// Types
export * from './types/artifact';
export * from './types/domain';
export * from './types/quality';
