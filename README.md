# 🌟 Neon Genie v3.7.1-Enhanced

> A divinatory ideation engine blending deterministic pipelines with symbolic depth

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

Neon Genie is an advanced ideation engine that generates structured artifacts with quality scoring, semantic search, and symbolic analysis. It operates across multiple domains (software, brands, products, and more) with deterministic provenance tracking and AI-powered similarity detection.

---

## ✨ Key Features

- **🎯 Multi-Domain Ideation** - Generate structured concepts across 10 specialized domains
- **🧠 Semantic Search** - Vector-based similarity detection using transformer embeddings
- **📊 5-Dimension Quality Scoring** - Ontological depth, novelty, viability, zeitgeist, and generative potential
- **🔮 Symbolic Analysis** - Optional Abraxas integration for numerology, tarot, I-Ching, and more
- **🌳 Provenance Tracking** - Full lineage and evolution history for every artifact
- **🎨 Domain Handlers** - Specialized generators for software architecture and brand identity
- **🔄 Deterministic Overlay** - SEED-compliant bridge for reproducible execution
- **🌐 Web Playground** - Interactive UI for exploring and generating ideas
- **🚀 Edge Deployment** - Docker-ready for NVIDIA Jetson Orin Nano

---

## 📦 Installation

```bash
npm install @aal/neon-genie
```

**For Development:**

```bash
git clone https://github.com/scrimshawlife-ctrl/Neon-Genie.git
cd Neon-Genie
npm install
npm run build
```

---

## 🚀 Quick Start

### Basic Generation (Standalone Mode)

```typescript
import { NeonGenie } from '@aal/neon-genie';

const genie = new NeonGenie({ mode: 'standalone' });

const artifact = await genie.generate({
  concept: 'A modular ritual planner for creative teams',
  domain: 'content',
  constraints: ['async collaboration', 'knowledge capture'],
  tags: ['ritual', 'collaboration']
});

console.log(artifact.title);
console.log(artifact.quality.composite); // 0.0-1.0
console.log(artifact.quality.tier); // reject, consider, accept, prioritize
```

### Enhanced Generation with Domain Handlers

```typescript
import { EnhancedNeonGenie } from '@aal/neon-genie';

const genie = new EnhancedNeonGenie({ mode: 'enhanced' });

// Software Domain - Generates architecture & tech stack
const software = await genie.generateEnhanced({
  concept: 'Realtime collaboration suite for field engineers',
  domain: 'software',
  constraints: ['realtime', 'offline capable', 'privacy focused'],
  tags: ['field ops', 'edge computing']
});

console.log(software.components); // Product Core, Interface Gateway, Intelligence Layer
console.log(software.architecture.techStack); // TypeScript, Node.js, PostgreSQL, WebSockets...
console.log(software.architecture.deployment); // edge caching, offline-first sync...

// Brand Domain - Generates visual identity & voice
const brand = await genie.generateEnhanced({
  concept: 'Luxury wellness brand for remote professionals',
  domain: 'brands',
  constraints: ['premium', 'digital-first'],
  tags: ['wellness', 'B2C']
});

console.log(brand.components); // Visual Identity, Brand Voice, Experience Design, Guidelines
console.log(brand.metadata.aesthetic); // Aesthetic direction guidance
```

### Semantic Search

```typescript
// Search by text query
const results = await genie.searchSemantic('collaboration platform', { limit: 5 });

// Find similar artifacts
const similar = await genie.findSimilarSemantic('luxury wellness', { limit: 3 });

// Detect duplicates
const duplicates = await genie.detectDuplicates(0.85); // 85% similarity threshold
```

---

## 🏗️ Architecture

Neon Genie operates in three layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Web Playground                        │
│               Interactive UI for Generation                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              🎨 Enhanced Layer (EnhancedNeonGenie)          │
│         Domain Handlers + Semantic Search + Abraxas         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              ⚙️  Core Layer (NeonGenie)                     │
│    Prompt Parsing → Component Generation → Quality Score   │
│         Provenance Tracking → Corpus Storage                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│         🔄 Deterministic Overlay (AAL/ABX-Runes Bridge)     │
│          SEED-Compliant Stdin/Stdout Protocol               │
└─────────────────────────────────────────────────────────────┘
```

### Pipeline Flow

```
User Prompt
    ↓
Parse Concept → Extract Domain + Constraints + Tags
    ↓
Generate Title & Problem Statement
    ↓
Generate Components (Domain-Specific)
    ↓
Define Architecture & Tech Stack (if applicable)
    ↓
Calculate Quality Score (5 or 6 dimensions)
    ↓
Store in Corpus (Append-Only JSON)
    ↓
Return Artifact with Provenance
```

---

## 📊 Quality Scoring System

### Standalone Mode (5 Dimensions)

**Quality Threshold: 0.5**

| Dimension | Weight | Description | Scale |
|-----------|--------|-------------|-------|
| **Ontological Depth** | 30% | Surface → Functional → Psychological → Philosophical → Ontological | 0.0-1.0 |
| **Novelty** | 25% | Derivative → Recombinant → Novel → Paradigmatic | 0.0-1.0 |
| **Viability** | 25% | Technical (30%) + Resource (20%) + Market (30%) + Regulatory (20%) | 0.0-1.0 |
| **Zeitgeist Alignment** | 15% | Trend (20%) + Contrarian (30%) + Future (30%) + Timeless (20%) | 0.0-1.0 |
| **Generative Potential** | 5% | Extensibility + Platform Potential + Network Effects | 0.0-1.0 |

**Composite Score:** Weighted average of all dimensions (0.0-1.0)

**Quality Tiers:**
- **Reject** (< 0.5): Below threshold, needs refinement
- **Consider** (0.5-0.7): Meets basic standards
- **Accept** (0.7-0.85): Strong quality
- **Prioritize** (> 0.85): Exceptional quality

### Abraxas Mode (6 Dimensions)

When Abraxas integration is enabled, a **6th dimension** is added:

**Quality Threshold: 0.6** (raised to reflect deeper symbolic standards)

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Ontological Depth | 20% | _(reduced from 30%)_ |
| Novelty | 20% | _(reduced from 25%)_ |
| Viability | 15% | _(reduced from 25%)_ |
| Zeitgeist Alignment | 10% | _(reduced from 15%)_ |
| Generative Potential | 5% | _(same)_ |
| **Symbolic Resonance** | **35%** | Numerology + Ephemeris + Gematria + Archetypes |

```typescript
import { EnhancedQualityScorer, AbraxasClient } from '@aal/neon-genie';

const abraxas = new AbraxasClient({
  apiKey: 'your-api-key',
  endpoint: 'https://abraxas.example.com'
});

const scorer = new EnhancedQualityScorer(abraxas);
const score = await scorer.scoreEnhanced(artifact);

console.log(score.symbolic_resonance); // 6th dimension (0.0-1.0)
console.log(score.composite); // Weighted with Abraxas weights
console.log(score.tier); // Threshold now 0.6
```

---

## 🎨 Domain Handlers

Neon Genie ships with **10 specialized domains**:

| Domain | Description | Example Use Cases |
|--------|-------------|-------------------|
| **software** | Generates architecture, tech stack, deployment strategy | Web apps, APIs, mobile apps, AI systems |
| **brands** | Creates visual identity, brand voice, experience design | Brand launches, rebrands, visual systems |
| **products** | Physical/digital product concepts | Consumer goods, SaaS products, hardware |
| **content** | Content strategies and frameworks | Editorial calendars, content systems |
| **business** | Business models and strategies | Startups, revenue models, market positioning |
| **systems** | Process and operational systems | Workflows, automation, integrations |
| **creative** | Creative projects and campaigns | Art installations, campaigns, experiences |
| **research** | Research programs and methodologies | Academic research, R&D initiatives |
| **events** | Event concepts and experiences | Conferences, workshops, community events |
| **education** | Educational programs and curricula | Courses, training programs, curricula |

### Software Domain Handler

**Capabilities:**
- ✅ Detects architectural patterns (API, web, mobile, desktop, CLI, realtime, database, AI, blockchain)
- ✅ Selects appropriate tech stack based on patterns
- ✅ Recommends security measures (zero trust, MFA, RLS)
- ✅ Defines deployment strategies (blue/green, edge caching, serverless)

**Components Generated:**
1. **Product Core** - Orchestrates workflows and domain logic
2. **Interface Gateway** - Cross-device experiences
3. **Intelligence Layer** - Automation and recommendations

**Example:**

```typescript
const software = await genie.generateEnhanced({
  concept: 'Privacy-focused note-taking app with E2E encryption',
  domain: 'software',
  constraints: ['privacy focused', 'offline', 'mobile-first'],
  tags: ['encryption', 'productivity']
});

// Automatically detects: mobile, database, privacy patterns
// Tech stack: TypeScript, Node.js, React Native, PostgreSQL
// Architecture: offline-first sync, edge caching, client-side encryption
// Security: zero trust auth, end-to-end encryption, no server-side plain text
```

### Brands Domain Handler

**Capabilities:**
- ✅ Analyzes brand characteristics (industry, personality, audience, values)
- ✅ Generates aesthetic direction
- ✅ Maps to strategy hub (positioning, rituals, communities)

**Components Generated:**
1. **Visual Identity System** - Color, typography, symbols
2. **Brand Voice & Messaging** - Tone, language, narratives
3. **Brand Experience Design** - Multisensory touchpoints
4. **Brand Guidelines** - Governance and standards

**Example:**

```typescript
const brand = await genie.generateEnhanced({
  concept: 'Sustainable fashion brand for Gen Z',
  domain: 'brands',
  constraints: ['sustainable', 'digital-first', 'affordable'],
  tags: ['fashion', 'B2C', 'sustainability']
});

// Automatically analyzes: industry (fashion), audience (Gen Z), values (sustainability)
// Aesthetic: Contemporary, bold, eco-conscious
// Components: Visual identity, brand voice, experience design, guidelines
```

---

## 🔮 Abraxas Integration (Symbolic Analysis)

Neon Genie includes scaffolding for **Abraxas**, a symbolic computation API that adds divinatory depth to ideation.

### Current Status

🟡 **Mock Mode** - Abraxas API is not yet publicly available. The client operates with deterministic mock data for development.

### Symbolic Features

When Abraxas becomes available, you'll have access to:

| Feature | Description |
|---------|-------------|
| 🔢 **Numerology** | Vibrational analysis of concepts (1-9 primary numbers) |
| 🌙 **Ephemeris** | Temporal/planetary alignment scoring |
| 🔤 **Gematria** | Symbolic resonance calculation |
| 🎭 **Archetypes** | Jungian pattern recognition (Creator, Explorer, Sage, Hero) |
| 🃏 **Tarot** | Three-card spreads for divinatory guidance |
| ☯️  **I-Ching** | Hexagram consultation for situation analysis |
| ᚱ **Runes** | Elder Futhark encoding and divination |
| 🔯 **Sigils** | Intent manifestation symbols (SVG) |
| ⏰ **Timing** | Optimal launch window calculation |

### Usage Example

```typescript
import { AbraxasClient, EnhancedQualityScorer } from '@aal/neon-genie';

// Create client (currently operates in mock mode)
const abraxas = new AbraxasClient({
  apiKey: 'test-key',
  endpoint: 'http://localhost:8080'
});

await abraxas.connect(); // Returns false (mock mode active)

// Use with enhanced quality scorer
const scorer = new EnhancedQualityScorer(abraxas);
const quality = await scorer.scoreEnhanced(artifact);

// Access 6th dimension
console.log(quality.symbolic_resonance); // 0.55-1.0

// Get detailed symbolic insights
const insights = await scorer.getSymbolicInsights(artifact);

console.log(insights.numerology);
// { primary: 7, vibration: 0.85, characteristics: ["Seeker", "Analyst", "Mystic"] }

console.log(insights.timing);
// { optimal_windows: [{ start: "2026-02", end: "2026-04", score: 0.92 }] }

console.log(insights.archetypes);
// { primary: "Creator", shadow: "Perfectionist", integration: "..." }

// Divination methods
const tarot = await abraxas.drawTarot('Will this concept succeed?', 'three_card');
const iching = await abraxas.consultIChing('How to approach market entry?');
const rune = await abraxas.encodeRune('INNOVATION');
```

### Migration to Live API

When Abraxas becomes available:

1. ✅ Update `AbraxasConfig` with real endpoint and API key
2. ✅ Client automatically connects to live API
3. ✅ Mock implementations replaced seamlessly
4. ✅ No code changes required in your application

---

## 🧠 Semantic Search

Neon Genie uses **transformer-based embeddings** for semantic similarity detection.

### Technology

- **Model:** `Xenova/all-MiniLM-L6-v2` (384-dimensional embeddings)
- **Library:** `@xenova/transformers` (local inference, no API calls)
- **Fallback:** Mock embeddings for offline development

### Operations

```typescript
// Index artifacts automatically on creation
const artifact = await genie.generateEnhanced({ concept: '...' });
// Artifact is immediately searchable

// Semantic search by query
const results = await genie.searchSemantic('collaboration platform', {
  limit: 5
});

results.forEach(r => {
  console.log(`${r.artifact.title} - Similarity: ${r.similarity.toFixed(2)}`);
});

// Find similar artifacts by text
const similar = await genie.findSimilarSemantic('luxury wellness brand', {
  limit: 3
});

// Detect duplicates above threshold
const duplicates = await genie.detectDuplicates(0.85);
duplicates.forEach(pair => {
  console.log(`${pair.artifact1.title} <-> ${pair.artifact2.title}`);
  console.log(`Similarity: ${pair.similarity.toFixed(2)}`);
});

// Get semantic stats
const stats = await genie.getSemanticStats();
console.log(`Indexed: ${stats.indexed}, Memory: ${stats.memory_bytes / 1024}KB`);
```

---

## 🌳 Provenance & Evolution

Every artifact has full provenance tracking and can evolve over time.

### Provenance Metadata

```typescript
interface Provenance {
  id: string;                    // SHA-256 hash (idea_abc123...)
  timestamp: number;             // Unix timestamp
  generator: string;             // System that created it
  parent_id?: string;            // Parent artifact ID (for evolution)
  transformation?: string[];     // Applied transformations
}
```

### Artifact Evolution

```typescript
// Create base artifact
const parent = await genie.generate({
  concept: 'Productivity app for creative teams',
  domain: 'software',
  tags: ['productivity']
});

console.log(parent.provenance.id); // idea_abc123...

// Evolve based on feedback
const child = await genie.evolve(parent.provenance.id, [
  'Add realtime collaboration',
  'Focus on async workflows',
  'Include knowledge capture'
]);

console.log(child.provenance.parent_id); // idea_abc123...
console.log(child.provenance.transformation);
// ["Add realtime collaboration", "Focus on async workflows", ...]

// Build evolution trees
const lineage = corpus.filter(a => a.provenance.parent_id === parent.provenance.id);
```

---

## 🔄 Deterministic Overlay (AAL/ABX-Runes Bridge)

The **Overlay Bridge** provides a **SEED-compliant stdin/stdout protocol** for deterministic, reproducible execution.

### Features

- ✅ Deterministic ID generation (SHA-256 content hashing)
- ✅ Seeded PRNG for consistent randomness
- ✅ Timestamp from provenance metadata (not system clock)
- ✅ JSON-based request/response protocol
- ✅ Operations: generate, analyze, evolve, search, findSimilar, export

### CLI Usage

```bash
# Install CLI
npm install -g @aal/neon-genie

# Run overlay bridge
echo '{"operation":"generate","params":{"concept":"AI writing assistant","domain":"software"}}' | \
  neon-genie-overlay

# Output: {"status":"success","result":{...artifact...}}
```

### Programmatic Usage

```typescript
import { OverlayBridge } from '@aal/neon-genie';

const bridge = new OverlayBridge({
  corpusPath: './corpus',
  seedSource: 'DETERMINISTIC_SEED'
});

const input = {
  operation: 'generate',
  params: {
    concept: 'Decentralized identity protocol',
    domain: 'software',
    constraints: ['privacy', 'blockchain'],
    tags: ['identity', 'web3']
  }
};

const response = await bridge.execute(input);
console.log(response.result.provenance.id); // Deterministic ID
```

---

## 📁 Corpus Management

Artifacts are stored in an **append-only JSON corpus**.

### Configuration

```typescript
const genie = new NeonGenie({
  mode: 'standalone',
  corpusPath: './custom-corpus' // Default: ./corpus
});
```

### Operations

```typescript
// List all artifacts
const all = await genie.list();

// Filter by domain
const software = await genie.list({ domain: 'software' });

// Filter by quality threshold
const highQuality = await genie.list({ minQuality: 0.7 });

// Get statistics
const stats = await genie.getStats();
console.log(stats.total); // Total artifacts
console.log(stats.byDomain); // { software: 42, brands: 18, ... }
console.log(stats.avgQuality); // 0.73

// Export artifacts
const json = await genie.export(artifactId, 'json');
const markdown = await genie.export(artifactId, 'markdown');
```

---

## 🌐 Web Playground

The optional **Web Playground** provides an interactive UI for exploring Neon Genie.

### Features

- 🎨 Interactive generation form with domain selector
- 📊 Visual quality radar chart (5 or 6 dimensions)
- 🧩 Component breakdown display
- 📋 JSON export with copy-to-clipboard
- 🔍 Semantic search interface
- 📈 Corpus statistics dashboard

### Running the Playground

```bash
cd web-playground
npm install
npm run dev
```

Navigate to `http://localhost:5173`

---

## 🚀 Deployment

### Local Development

```bash
# Build the library
npm run build

# Run demos
npm run demo              # Standalone demo
npm run demo:enhanced     # Enhanced demo with domain handlers
npm run demo:abraxas      # Abraxas integration demo

# Run tests
npm test
npm run test:coverage
npm run test:watch
```

### Docker / Orin Nano Deployment

For **edge deployment** on NVIDIA Jetson Orin Nano or any Docker-capable system:

```bash
cd deployment/orin-nano
./deploy.sh
```

The service will be available at `http://localhost:3000`.

#### Configuration Options

See [deployment/orin-nano/README.md](deployment/orin-nano/README.md) for:
- Environment variables
- Volume mounting
- GPU acceleration (Jetson)
- Custom corpus paths
- Production hardening

---

## 🛠️ API Reference

### NeonGenie (Core)

```typescript
class NeonGenie {
  generate(prompt: IdeaPrompt): Promise<IdeaArtifact>
  analyze(prompt: IdeaPrompt): Promise<AnalysisReport>
  evolve(parentId: string, feedback: string[]): Promise<IdeaArtifact>
  search(query: string): Promise<IdeaArtifact[]>
  findSimilar(id: string): Promise<IdeaArtifact[]>
  export(id: string, format: 'json' | 'markdown'): Promise<string>
  list(filter?: CorpusFilter): Promise<IdeaArtifact[]>
  getStats(): Promise<CorpusStats>
  getMode(): 'standalone' | 'enhanced'
}
```

### EnhancedNeonGenie (Extended)

```typescript
class EnhancedNeonGenie extends NeonGenie {
  generateEnhanced(prompt: IdeaPrompt): Promise<IdeaArtifact>
  searchSemantic(query: string, options?: SearchOptions): Promise<SearchResult[]>
  findSimilarSemantic(text: string, options?: SearchOptions): Promise<SearchResult[]>
  detectDuplicates(threshold?: number): Promise<DuplicatePair[]>
  getSemanticStats(): Promise<SemanticStats>
}
```

### AbraxasClient (Symbolic API)

```typescript
class AbraxasClient {
  connect(): Promise<boolean>
  analyzeNumerology(text: string): Promise<NumerologyResult>
  getEphemeris(timestamp: number): Promise<EphemerisResult>
  calculateGematria(text: string): Promise<GematriaResult>
  identifyArchetypes(text: string): Promise<ArchetypeResult>
  drawTarot(question: string, spread: SpreadType): Promise<TarotResult>
  consultIChing(situation: string): Promise<IChingResult>
  encodeRune(text: string): Promise<RuneResult>
  generateSigil(intent: string, style?: string): Promise<SigilResult>
  getOptimalWindows(concept: string, range: DateRange): Promise<TimingResult>
}
```

---

## 📚 Documentation

- **[DOCS_INDEX.md](DOCS_INDEX.md)** - Complete documentation index
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[MIGRATION.md](MIGRATION.md)** - Migration guides
- **[RELEASE_NOTES.md](RELEASE_NOTES.md)** - Detailed release notes
- **[UPGRADE_SUMMARY.md](UPGRADE_SUMMARY.md)** - Quick upgrade reference

---

## 🧪 Examples

Check out the [examples](examples/) directory for complete usage examples:

- `standalone-demo.ts` - Core functionality demo
- `enhanced-demo.ts` - Domain handlers and semantic search
- `abraxas-demo.ts` - Symbolic analysis integration

---

## 🤝 Contributing

Contributions are welcome! Please ensure:

- ✅ All tests pass (`npm test`)
- ✅ Code is linted (`npm run lint`)
- ✅ TypeScript types are correct
- ✅ Documentation is updated

---

## 📄 License

MIT © Applied Alchemy Labs

---

## 🙏 Acknowledgments

- **Semantic Search:** Powered by [Xenova Transformers](https://github.com/xenova/transformers.js)
- **Symbolic Framework:** Inspired by esoteric computing traditions
- **Architecture:** Built with TypeScript, Node.js, and deterministic principles

---

## 📧 Contact

For questions, feedback, or collaboration:

- **GitHub Issues:** [Report bugs or request features](https://github.com/scrimshawlife-ctrl/Neon-Genie/issues)
- **Author:** Applied Alchemy Labs

---

<div align="center">

**Built with ❤️ for divinatory ideation and symbolic computation**

</div>
