/**
 * AAL/ABX-Runes Overlay Bridge Demo
 *
 * Demonstrates deterministic invocation of NeonGenie
 * via the overlay bridge API.
 */

import { DeterministicNeonGenie } from '../src/overlay';
import type { IdeationPrompt } from '../src/types/artifact';

async function main() {
  console.log('=== AAL/ABX-Runes Overlay Bridge Demo ===\n');

  // Define deterministic provenance
  const provenance = {
    run_id: 'demo-run-001',
    timestamp_iso: '2025-01-18T12:00:00.000Z',
    seed: 'demo-seed-deterministic'
  };

  console.log('Provenance:');
  console.log(JSON.stringify(provenance, null, 2));
  console.log();

  // Create deterministic genie instance
  const genie = new DeterministicNeonGenie({
    corpusPath: './demo-corpus',
    mode: 'standalone',
    provenance
  });

  // Test 1: Generate artifact
  console.log('--- Test 1: Generate Artifact ---');
  const generatePrompt: IdeationPrompt = {
    concept: 'Deterministic build system for reproducible software',
    domain: 'software',
    constraints: ['hermetic', 'cacheable', 'distributed'],
    tags: ['build', 'determinism', 'devops']
  };

  const artifact1 = await genie.generate(generatePrompt);
  console.log('Generated Artifact ID:', artifact1.id);
  console.log('Title:', artifact1.title);
  console.log('Quality Score:', artifact1.quality.composite);
  console.log('Timestamp:', artifact1.provenance.timestamp);
  console.log();

  // Test 2: Generate again with same provenance (should be identical)
  console.log('--- Test 2: Verify Determinism ---');
  const genie2 = new DeterministicNeonGenie({
    corpusPath: './demo-corpus',
    mode: 'standalone',
    provenance
  });

  const artifact2 = await genie2.generate(generatePrompt);
  console.log('Second Generation ID:', artifact2.id);
  console.log('IDs match:', artifact1.id === artifact2.id);
  console.log('Titles match:', artifact1.title === artifact2.title);
  console.log('Determinism verified:', JSON.stringify(artifact1) === JSON.stringify(artifact2));
  console.log();

  // Test 3: Analyze concept
  console.log('--- Test 3: Analyze Concept ---');
  const analyzePrompt: IdeationPrompt = {
    concept: 'Real-time collaborative code editor',
    domain: 'software'
  };

  const report = await genie.analyze(analyzePrompt);
  console.log('Analysis ID:', report.id);
  console.log('Summary:', report.summary);
  console.log('Recommendations:', report.recommendations.slice(0, 2));
  console.log();

  // Test 4: Export artifact
  console.log('--- Test 4: Export Artifact ---');
  const markdownExport = await genie.export(artifact1.id, 'markdown');
  if (markdownExport) {
    console.log('Markdown Export (first 200 chars):');
    console.log(markdownExport.substring(0, 200) + '...\n');
  } else {
    console.log('Export failed (artifact not found)\n');
  }

  // Test 5: Different provenance produces different ID
  console.log('--- Test 5: Different Provenance ---');
  const genie3 = new DeterministicNeonGenie({
    corpusPath: './demo-corpus',
    mode: 'standalone',
    provenance: {
      run_id: 'demo-run-002', // Different run_id
      timestamp_iso: '2025-01-18T12:00:00.000Z',
      seed: 'demo-seed-deterministic'
    }
  });

  const artifact3 = await genie3.generate(generatePrompt);
  console.log('Different run_id produces different ID:', artifact3.id);
  console.log('IDs differ:', artifact1.id !== artifact3.id);
  console.log();

  console.log('=== Demo Complete ===');
  console.log('\nKey Takeaways:');
  console.log('✓ Identical provenance → identical artifacts');
  console.log('✓ All timestamps from provenance, not Date.now()');
  console.log('✓ IDs generated deterministically via SHA-256');
  console.log('✓ Full SEED compliance: no hidden randomness or clocks');
}

main().catch(console.error);
