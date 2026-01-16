# Migration Guide: v3.7.0 → v3.7.1-enhanced

This guide helps you upgrade from Neon Genie v3.7.0 to v3.7.1-enhanced.

## Overview

v3.7.1-enhanced is **100% backward compatible** with v3.7.0. All existing code will continue to work without changes. The new features are additive and opt-in.

## What's New

- ✨ Abraxas integration (6th quality dimension)
- ✨ Enhanced quality scorer with symbolic analysis
- ✨ Orin Nano deployment configuration
- ✨ Comprehensive test suite
- ✨ Additional demos and documentation

## Breaking Changes

**None.** This is a feature-additive release.

## Installation

```bash
# Update package
npm install @aal/neon-genie@3.7.1-enhanced

# Install new dependencies
npm install

# Rebuild
npm run build
```

## Migration Steps

### Step 1: Update Dependencies (Optional)

The only new dependency is `@xenova/transformers` for semantic search. It's already in package.json, so just run:

```bash
npm install
```

### Step 2: Update Imports (Optional)

If you want to use new features, add these imports:

```typescript
// New exports in v3.7.1-enhanced
import {
  // Abraxas integration
  AbraxasClient,
  AbraxasConfig,
  SymbolicResonanceScorer,
  EnhancedQualityScorer,

  // Enhanced types
  ABRAXAS_WEIGHTS
} from '@aal/neon-genie';
```

### Step 3: Adopt New Features (Optional)

Choose which new features to adopt:

#### Option A: Keep Using Standalone Mode (No Changes)

Your existing code continues to work:

```typescript
import { NeonGenie } from '@aal/neon-genie';

const genie = new NeonGenie({ mode: 'standalone' });
const idea = await genie.generate({
  concept: 'Your concept',
  domain: 'software'
});

// Still uses 5-dimension scoring
console.log(idea.quality.composite); // Works as before
```

#### Option B: Add Abraxas Scoring to Existing Ideas

Enhance your existing workflow with symbolic scoring:

```typescript
import { NeonGenie, AbraxasClient, EnhancedQualityScorer } from '@aal/neon-genie';

// Generate idea as usual
const genie = new NeonGenie({ mode: 'standalone' });
const idea = await genie.generate({
  concept: 'Your concept',
  domain: 'software'
});

// Add Abraxas scoring
const abraxas = new AbraxasClient({
  apiKey: 'your-key',
  endpoint: 'https://abraxas-api.example.com'
});

const scorer = new EnhancedQualityScorer(abraxas);
const enhancedScore = await scorer.scoreEnhanced(idea);

console.log(enhancedScore.symbolic_resonance); // New 6th dimension
console.log(enhancedScore.composite); // Recalculated with Abraxas weights
```

#### Option C: Full Migration to Enhanced Mode

Use all new features:

```typescript
import { EnhancedNeonGenie, AbraxasClient } from '@aal/neon-genie';

const genie = new EnhancedNeonGenie({ mode: 'enhanced' });
await genie.initialize();

// Generate with enhanced domain handlers
const idea = await genie.generateEnhanced({
  concept: 'Your concept',
  domain: 'software',
  constraints: ['realtime', 'privacy-focused']
});

// Use semantic search
const similar = await genie.searchSemantic('meditation wellness');

// Detect duplicates
const duplicates = await genie.detectDuplicates(0.85);
```

## API Changes

### No Breaking Changes

All existing methods work identically:

- `NeonGenie.generate()` ✅ Unchanged
- `NeonGenie.analyze()` ✅ Unchanged
- `NeonGenie.evolve()` ✅ Unchanged
- `NeonGenie.search()` ✅ Unchanged
- `NeonGenie.findSimilar()` ✅ Unchanged
- `NeonGenie.export()` ✅ Unchanged

### New Methods

#### EnhancedNeonGenie

```typescript
// New methods (opt-in)
await genie.generateEnhanced(prompt);
await genie.searchSemantic(query, limit);
await genie.findSimilarSemantic(artifact, limit);
await genie.detectDuplicates(threshold);
genie.getSemanticStats();
```

#### EnhancedQualityScorer

```typescript
// New scoring methods
await scorer.scoreEnhanced(artifact);
await scorer.getSymbolicInsights(artifact);
```

#### AbraxasClient

```typescript
// All new (9 methods)
await abraxas.analyzeNumerology(text);
await abraxas.getEphemeris(timestamp);
await abraxas.calculateGematria(text);
await abraxas.identifyArchetypes(text);
await abraxas.generateSigil(intent, style);
await abraxas.drawTarot(question, spread);
await abraxas.consultIChing(situation);
await abraxas.getOptimalWindows(concept, range);
await abraxas.encodeRune(text);
```

## Type Changes

### QualityScore Interface

```typescript
// v3.7.0
interface QualityScore {
  ontological_depth: DimensionScore;
  novelty: DimensionScore;
  viability: DimensionScore;
  zeitgeist_alignment: DimensionScore;
  generative_potential: DimensionScore;
  composite: number;
  threshold: number;
  passed: boolean;
  tier: QualityTier;
  breakdown: {...};
}

// v3.7.1-enhanced (backward compatible)
interface QualityScore {
  ontological_depth: DimensionScore;
  novelty: DimensionScore;
  viability: DimensionScore;
  zeitgeist_alignment: DimensionScore;
  generative_potential: DimensionScore;
  symbolic_resonance?: DimensionScore; // NEW - optional
  composite: number;
  threshold: number;
  passed: boolean;
  tier: QualityTier;
  breakdown: {...};
}
```

The `symbolic_resonance` field is **optional**, so existing code compiles without changes.

### New Constants

```typescript
// v3.7.0
export const STANDALONE_WEIGHTS = {...};

// v3.7.1-enhanced (additive)
export const STANDALONE_WEIGHTS = {...}; // Unchanged
export const ABRAXAS_WEIGHTS = {...};    // New
```

## Configuration Changes

### No Required Changes

All existing configurations work:

```typescript
// v3.7.0 and v3.7.1-enhanced
const genie = new NeonGenie({
  mode: 'standalone',
  corpusPath: './my-corpus'
});
```

### New Optional Configuration

```typescript
// v3.7.1-enhanced only
const abraxas = new AbraxasClient({
  apiKey: 'your-key',
  endpoint: 'https://abraxas-api.example.com',
  timeout: 5000,
  enableSymbolicScoring: true,
  enableSigilGeneration: true,
  enableOracleConsultation: true,
  enableTimingOptimization: true
});
```

## Testing Changes

### No Test Updates Required

Existing tests continue to pass:

```bash
npm test  # All existing tests pass
```

### New Tests Available

```bash
npm test tests/abraxas/         # Test Abraxas integration
npm test tests/quality/         # Test enhanced scoring
npm run test:coverage           # NEW: Coverage report
```

## Demo Changes

### Existing Demos Unchanged

```bash
npm run demo          # Still works
npm run demo:enhanced # Still works
```

### New Demos

```bash
npm run demo:abraxas  # NEW: Full Abraxas demonstration
```

## Deployment Changes

### No Deployment Changes Required

Your existing deployment works:

```bash
npm run build
# Deploy as usual
```

### New Deployment Option

```bash
# NEW: Docker deployment for edge devices
cd deployment/orin-nano
./deploy.sh
```

## Common Migration Patterns

### Pattern 1: Gradual Migration

Start using new features incrementally:

**Week 1:** Add Abraxas client, test in development
```typescript
const abraxas = new AbraxasClient({...});
await abraxas.connect();
```

**Week 2:** Score a few ideas with Abraxas
```typescript
const scorer = new EnhancedQualityScorer(abraxas);
const score = await scorer.scoreEnhanced(idea);
```

**Week 3:** Fully integrate symbolic insights
```typescript
const insights = await scorer.getSymbolicInsights(idea);
// Use in decision-making
```

### Pattern 2: Side-by-Side Comparison

Compare scoring modes:

```typescript
// Generate idea
const idea = await genie.generate({...});

// Standalone score (existing)
const standaloneScore = idea.quality;

// Abraxas score (new)
const abraxasScore = await scorer.scoreEnhanced(idea);

// Compare
console.log('Standalone:', standaloneScore.composite);
console.log('Abraxas:', abraxasScore.composite);
console.log('Symbolic:', abraxasScore.symbolic_resonance?.value);
```

### Pattern 3: Feature Flags

Enable features based on environment:

```typescript
const useAbraxas = process.env.ENABLE_ABRAXAS === 'true';

if (useAbraxas) {
  const scorer = new EnhancedQualityScorer(abraxas);
  quality = await scorer.scoreEnhanced(idea);
} else {
  quality = idea.quality; // Use built-in score
}
```

## Rollback Plan

If you need to rollback:

```bash
# Downgrade package
npm install @aal/neon-genie@3.7.0

# Remove new dependencies (optional)
npm uninstall @xenova/transformers

# Rebuild
npm run build
```

Your code will work because v3.7.1 is backward compatible.

## Performance Considerations

### No Performance Regression

Existing operations have **identical performance**:

- Idea generation: Same speed
- Quality scoring (5D): Same speed
- Corpus operations: Same speed

### New Feature Performance

- **Abraxas scoring**: +50-100ms (mock mode), varies when API available
- **Semantic search**: +100ms first search (embedding loading), <10ms subsequent
- **Duplicate detection**: O(n²) - use on smaller datasets or in background

### Optimization Tips

1. **Lazy load Abraxas**: Only initialize when needed
   ```typescript
   let abraxas: AbraxasClient | null = null;
   function getAbraxas() {
     if (!abraxas) abraxas = new AbraxasClient({...});
     return abraxas;
   }
   ```

2. **Cache semantic embeddings**: Already automatic in SemanticSearch

3. **Batch scoring**: Score multiple ideas before Abraxas analysis
   ```typescript
   const ideas = await Promise.all([
     genie.generate({...}),
     genie.generate({...}),
     genie.generate({...})
   ]);

   const scores = await Promise.all(
     ideas.map(idea => scorer.scoreEnhanced(idea))
   );
   ```

## Support & Resources

- **Documentation**: See updated README.md
- **Examples**: Check `examples/abraxas-demo.ts`
- **Tests**: Review `tests/abraxas/` for usage patterns
- **Deployment**: See `deployment/orin-nano/README.md`
- **Changelog**: Full details in CHANGELOG.md

## FAQ

**Q: Do I need to change my code?**
A: No. v3.7.1-enhanced is fully backward compatible.

**Q: Is Abraxas API required?**
A: No. The client works in mock mode without the API.

**Q: Will Abraxas scoring slow down my app?**
A: In mock mode: minimal impact (<100ms). Real API: depends on network.

**Q: Can I use some features but not others?**
A: Yes. All new features are opt-in and independent.

**Q: What happens if I don't have an Abraxas API key?**
A: Client automatically uses mock mode with deterministic results.

**Q: Should I migrate to EnhancedNeonGenie?**
A: Optional. NeonGenie still works great. Upgrade when you want enhanced domain handlers.

**Q: Are there any breaking changes?**
A: None whatsoever. This is a feature-additive release.

---

**Need help?** Open an issue on GitHub or check the comprehensive test suite for examples.
