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

The standalone quality score is composed of five dimensions:

- **Ontological Depth (30%)**: surface → functional → psychological → philosophical → ontological
- **Novelty (25%)**: derivative → recombinant → novel → paradigmatic
- **Viability (25%)**: technical (30%), resource (20%), market (30%), regulatory (20%)
- **Zeitgeist Alignment (15%)**: trend (20%), contrarian (30%), future (30%), timeless (20%)
- **Generative Potential (5%)**: extensibility, platform, network, evolution

The default threshold is `0.5`. Ideas below the threshold are flagged for refinement.

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

- Build the library with `npm run build`.
- Run demos with `npm run demo` or `npm run demo:enhanced`.
- Launch the playground in `web-playground` with `npm run dev`.

## License

MIT
