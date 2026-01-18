#!/usr/bin/env node
/**
 * AAL/ABX-Runes Overlay Bridge CLI
 *
 * Executable entry point for process-based invocation.
 *
 * Usage:
 *   echo '{"operation":"generate",...}' | node dist/overlay/cli.js
 *   cat request.json | neon-genie-overlay
 *
 * Environment Variables:
 *   NEON_CORPUS_PATH - Corpus storage directory (default: 'corpus')
 *   NEON_MODE - Execution mode (default: 'standalone')
 */

import { main } from './bridge';

// Execute bridge
main().catch((error) => {
  console.error('Fatal overlay error:', error);
  process.exit(1);
});
