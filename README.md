# Neon Genie v3.7.1-Enhanced

Neon Genie is a divinatory ideation engine that blends deterministic pipelines with symbolic depth, producing structured artifacts, quality scores, and lineage-aware evolution. The v3.7.1-Enhanced release delivers a standalone core system plus enhanced domain handlers for software and brand ideation, along with semantic search.

## Overview

Neon Genie operates in two layers:

- **Standalone Core**: deterministic prompt parsing, component generation, quality scoring, provenance, and corpus storage.
- **Enhanced Overlay**: domain-specific handlers (software + brands) and semantic search for vector similarity.

## Installation

```bash
npm install
npm run build
```

## Quick Start

```ts
import { EnhancedNeonGenie } from '@aal/neon-genie';

const genie = new EnhancedNeonGenie({ mode: 'enhanced' });

const artifact = await genie.generateEnhanced({
  concept: 'Realtime collaboration suite for field engineers',
  domain: 'software',
  constraints: ['realtime', 'offline capable'],
  tags: ['field ops']
});

console.log(artifact.title, artifact.quality.composite);
```

## Core API

### `NeonGenie`

- `generate(prompt)` → full generation pipeline
- `analyze(prompt)` → analysis report with refinements
- `evolve(parentId, feedback)` → create child artifact with provenance
- `search(query)` → text search against corpus
- `findSimilar(id)` → domain-based similarity search
- `export(id, format)` → JSON or Markdown export
- `getMode()` → current mode
- `getStats()` → corpus statistics

### `EnhancedNeonGenie`

- `generateEnhanced(prompt)` → enhanced generation with domain handlers
- `searchSemantic(query)` → vector similarity search
- `findSimilarSemantic(text)` → semantic similarity by prompt
- `detectDuplicates(threshold)` → duplicate detection
- `getSemanticStats()` → embedding cache metrics

## Quality Scoring

### Standalone Mode (5 Dimensions)

The standalone quality score is composed of five dimensions:

- **Ontological Depth (30%)**: surface → functional → psychological → philosophical → ontological
- **Novelty (25%)**: derivative → recombinant → novel → paradigmatic
- **Viability (25%)**: technical (30%), resource (20%), market (30%), regulatory (20%)
- **Zeitgeist Alignment (15%)**: trend (20%), contrarian (30%), future (30%), timeless (20%)
- **Generative Potential (5%)**: extensibility, platform, network, evolution

The default threshold is `0.5`. Ideas below the threshold are flagged for refinement.

### Abraxas Mode (6 Dimensions)

When Abraxas integration is enabled, a 6th dimension is added:

- **Ontological Depth (20%)**
- **Novelty (20%)**
- **Viability (15%)**
- **Zeitgeist Alignment (10%)**
- **Generative Potential (5%)**
- **Symbolic Resonance (35%)**: numerology, timing, gematria, archetypes

The threshold is raised to `0.6` to reflect higher quality standards with symbolic analysis.

```ts
import { EnhancedQualityScorer, AbraxasClient } from '@aal/neon-genie';

const abraxas = new AbraxasClient({
  apiKey: 'your-key',
  endpoint: 'https://abraxas-api.example.com'
});

const scorer = new EnhancedQualityScorer(abraxas);
const score = await scorer.scoreEnhanced(artifact);

console.log(score.symbolic_resonance); // 6th dimension
console.log(score.composite); // Weighted average with Abraxas weights
```

## Domains

Neon Genie ships with ten ideation domains:

- software
- brands
- products
- content
- business
- systems
- creative
- research
- events
- education

## Usage Examples

```bash
npm run demo
npm run demo:enhanced
```

## Corpus Storage

Artifacts are stored as append-only JSON records. By default, the corpus is stored in `./corpus`, but you can configure the path via `GenieConfig`.

## Web Playground

The optional web playground offers a UI for generating ideas, inspecting quality scores, and exporting JSON.

```bash
cd web-playground
npm install
npm run dev
```

## Deployment

### Local Development

- Build the library with `npm run build`.
- Run demos with `npm run demo` or `npm run demo:enhanced`.
- Launch the playground in `web-playground` with `npm run dev`.

### Orin Nano / Docker Deployment

For edge deployment on NVIDIA Jetson Orin Nano or any Docker-capable system:

```bash
cd deployment/orin-nano
./deploy.sh
```

The service will be available at `http://localhost:3000`.

See [deployment/orin-nano/README.md](deployment/orin-nano/README.md) for detailed configuration options.

## Abraxas Integration

Neon Genie includes integration scaffolding for the Abraxas symbolic computation API. When available, Abraxas provides:

- **Numerology**: Vibrational analysis of concepts
- **Ephemeris**: Temporal/planetary alignment scoring
- **Gematria**: Symbolic resonance calculation
- **Archetypes**: Pattern recognition and shadow analysis
- **Sigils**: Intent manifestation symbols (SVG)
- **Tarot**: Divinatory guidance for ideation
- **I-Ching**: Situation consultation
- **Timing**: Optimal launch window calculation
- **Runes**: Encoding and divination

### Current Status

Abraxas API is not yet publicly available. The client currently operates in **mock mode**, returning deterministic symbolic data for development and testing.

### Usage

```ts
import { AbraxasClient, EnhancedQualityScorer } from '@aal/neon-genie';

// Create Abraxas client (mock mode)
const abraxas = new AbraxasClient({
  apiKey: 'test-key',
  endpoint: 'http://localhost:8080'
});

await abraxas.connect(); // Returns false (mock mode)

// Use with enhanced quality scorer
const scorer = new EnhancedQualityScorer(abraxas);
const quality = await scorer.scoreEnhanced(artifact);

// Access symbolic insights
const insights = await scorer.getSymbolicInsights(artifact);
console.log(insights.numerology);
console.log(insights.timing);
console.log(insights.archetypes);
```

### When Abraxas Becomes Available

1. Update `AbraxasConfig` with real endpoint and API key
2. The client will automatically connect to the real API
3. Mock implementations will be replaced with live symbolic computation
4. All features will work seamlessly without code changes

### API Methods

All methods work in mock mode now and will connect to real API when available:

```ts
// Symbolic analysis
await abraxas.analyzeNumerology(text);
await abraxas.getEphemeris(timestamp);
await abraxas.calculateGematria(text);
await abraxas.identifyArchetypes(text);

// Divination
await abraxas.drawTarot(question, spread);
await abraxas.consultIChing(situation);
await abraxas.encodeRune(text);

// Practical
await abraxas.generateSigil(intent, style);
await abraxas.getOptimalWindows(concept, dateRange);
```

## License

MIT
