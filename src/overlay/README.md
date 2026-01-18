# AAL/ABX-Runes Overlay Bridge

Deterministic process-based interface for NeonGenie invocation via stdin/stdout.

## Overview

The overlay bridge enables NeonGenie to function as an AAL (Autonomous Artifact Lineage) overlay module, providing:

- **Deterministic execution**: Identical inputs → identical outputs
- **Provenance tracking**: Explicit run_id and timestamp_iso for all operations
- **Process isolation**: Clean stdin/stdout protocol
- **SEED compliance**: No hidden clocks, randomness, or side effects

## Protocol

### Request Format (stdin)

```json
{
  "operation": "generate|analyze|evolve|search|findSimilar|export",
  "provenance": {
    "run_id": "unique-run-identifier",
    "timestamp_iso": "2025-01-18T12:00:00.000Z",
    "seed": "optional-deterministic-seed"
  },
  "payload": {
    // Operation-specific payload
  }
}
```

### Response Format (stdout)

**Success:**
```json
{
  "success": true,
  "result": {
    // Operation-specific result
  },
  "provenance": {
    "run_id": "unique-run-identifier",
    "timestamp_iso": "2025-01-18T12:00:00.000Z",
    "seed": "optional-deterministic-seed"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Stack trace or additional context"
  },
  "provenance": {
    "run_id": "unique-run-identifier",
    "timestamp_iso": "2025-01-18T12:00:00.000Z"
  }
}
```

## Operations

### Generate

Creates a new artifact from an ideation prompt.

**Payload:**
```json
{
  "concept": "A distributed task scheduling system",
  "domain": "software",
  "constraints": ["cloud-native", "fault-tolerant"],
  "aestheticDirection": "minimalist",
  "tags": ["distributed", "scheduling"]
}
```

**Result:** `IdeaArtifact`

### Analyze

Analyzes a concept and provides recommendations.

**Payload:**
```json
{
  "concept": "Mobile app for habit tracking",
  "domain": "software"
}
```

**Result:** `AnalysisReport`

### Evolve

Creates a child artifact from a parent with feedback.

**Payload:**
```json
{
  "parentId": "idea_abc123",
  "feedback": ["Add offline support", "Improve scalability"]
}
```

**Result:** `IdeaArtifact` (with lineage linking)

### Search

Text-based search across stored artifacts.

**Payload:**
```json
{
  "query": "distributed system"
}
```

**Result:** `IdeaArtifact[]`

### FindSimilar

Find artifacts similar to a given artifact ID.

**Payload:**
```json
{
  "id": "idea_abc123"
}
```

**Result:** `IdeaArtifact[]`

### Export

Export an artifact in a specific format.

**Payload:**
```json
{
  "id": "idea_abc123",
  "format": "json" // or "markdown"
}
```

**Result:** `string` (formatted artifact)

## Usage

### Command Line

```bash
# Build the project first
npm run build

# Using echo
echo '{
  "operation": "generate",
  "provenance": {
    "run_id": "run-001",
    "timestamp_iso": "2025-01-18T12:00:00Z",
    "seed": "test-seed"
  },
  "payload": {
    "concept": "Test concept",
    "domain": "software"
  }
}' | node dist/overlay/cli.js

# Using a file
cat request.json | node dist/overlay/cli.js

# With environment variables
NEON_CORPUS_PATH=/custom/corpus NEON_MODE=abraxas \
  cat request.json | node dist/overlay/cli.js
```

### Programmatic

```typescript
import { OverlayBridge } from '@aal/neon-genie/overlay';

const bridge = new OverlayBridge({
  corpusPath: './corpus',
  mode: 'standalone'
});

await bridge.run(); // Reads from stdin, writes to stdout
```

### Direct API

```typescript
import { DeterministicNeonGenie } from '@aal/neon-genie/overlay';

const genie = new DeterministicNeonGenie({
  corpusPath: './corpus',
  mode: 'standalone',
  provenance: {
    run_id: 'manual-run-001',
    timestamp_iso: new Date().toISOString(),
    seed: 'my-seed'
  }
});

const artifact = await genie.generate({
  concept: 'Distributed task scheduler',
  domain: 'software',
  constraints: ['fault-tolerant']
});
```

## Determinism Guarantees

### ID Generation

Artifact IDs are deterministically generated using:
- SHA-256 hash of (run_id, timestamp_iso, seed)
- Format: `idea_{16-char-hex}`

**Example:**
```typescript
run_id: "run-001"
timestamp_iso: "2025-01-18T12:00:00Z"
seed: "test-seed"

// Always produces: idea_f4a3b2c1d0e9f8a7
```

### Timestamps

All timestamps come from `provenance.timestamp_iso`, not `Date.now()`:
- No hidden clock dependencies
- Reproducible across runs
- ISO 8601 format required

### Randomness

All randomness is seeded:
- Explicit seed in provenance OR
- Derived seed from SHA-256(run_id + timestamp_iso)
- Seeded PRNG using SHA-256 counter mode

### Content Hashes

Artifact hashes use stable serialization:
- Object keys sorted alphabetically
- Deterministic JSON stringification
- SHA-256 hashing

## Environment Variables

- `NEON_CORPUS_PATH` - Corpus storage directory (default: `corpus`)
- `NEON_MODE` - Execution mode: `standalone` or `abraxas` (default: `standalone`)

## Exit Codes

- `0` - Success
- `1` - Error (see error response on stdout)

## Example Workflow

```bash
# 1. Generate an artifact
echo '{
  "operation": "generate",
  "provenance": {
    "run_id": "workflow-001",
    "timestamp_iso": "2025-01-18T12:00:00Z"
  },
  "payload": {
    "concept": "Task scheduler",
    "domain": "software"
  }
}' | node dist/overlay/cli.js > artifact.json

# 2. Extract artifact ID
ARTIFACT_ID=$(jq -r '.result.id' artifact.json)

# 3. Find similar artifacts
echo "{
  \"operation\": \"findSimilar\",
  \"provenance\": {
    \"run_id\": \"workflow-002\",
    \"timestamp_iso\": \"2025-01-18T12:01:00Z\"
  },
  \"payload\": {
    \"id\": \"$ARTIFACT_ID\"
  }
}" | node dist/overlay/cli.js

# 4. Export as markdown
echo "{
  \"operation\": \"export\",
  \"provenance\": {
    \"run_id\": \"workflow-003\",
    \"timestamp_iso\": \"2025-01-18T12:02:00Z\"
  },
  \"payload\": {
    \"id\": \"$ARTIFACT_ID\",
    \"format\": \"markdown\"
  }
}" | node dist/overlay/cli.js > artifact.md
```

## Testing

```bash
# Run overlay tests
npm test -- tests/overlay

# Test determinism specifically
npm test -- tests/overlay/deterministic.test.ts

# Test full integration
npm test
```

## Architecture

```
overlay/
├── types.ts              # Request/response type definitions
├── deterministic.ts      # Deterministic utilities (ID, hash, PRNG)
├── deterministic-genie.ts # DeterministicNeonGenie subclass
├── bridge.ts             # Overlay bridge (stdin/stdout protocol)
├── cli.ts                # CLI entry point
├── index.ts              # Public exports
└── README.md             # This file

tests/overlay/
├── deterministic.test.ts       # Determinism utility tests
├── deterministic-genie.test.ts # DeterministicNeonGenie tests
└── bridge.test.ts              # Bridge protocol tests
```

## ABX-Core Compliance

- **Modular**: Clean separation of concerns (types, utils, genie, bridge)
- **Explicit IO**: All inputs via stdin, all outputs via stdout
- **No side effects**: No cross-module mutations or hidden state
- **Deterministic**: Identical inputs → identical outputs
- **Provenance-tracked**: All operations include run_id and timestamp

## SEED Compliance

- **S**table: Same provenance → same results
- **E**xplicit: All randomness seeded, all timestamps from provenance
- **E**xhaustive: Complete error handling, no silent fallbacks
- **D**eterministic: No Date.now(), Math.random(), or UUID v4

## License

Same as parent project (Neon-Genie).
