/**
 * Abraxas Integration Demo
 *
 * Demonstrates the full 6-dimension quality scoring with symbolic analysis.
 * Shows comparison between standalone mode (5D) and Abraxas mode (6D).
 */

import { NeonGenie } from '../src/core/genie';
import { EnhancedQualityScorer } from '../src/quality/enhanced-scorer';
import { AbraxasClient } from '../src/abraxas/client';
import { QualityScore } from '../src/types/quality';

async function main() {
  console.log('='.repeat(80));
  console.log('NEON GENIE - ABRAXAS INTEGRATION DEMO');
  console.log('='.repeat(80));
  console.log();

  // Initialize Abraxas client
  console.log('📡 Initializing Abraxas client...');
  const abraxas = new AbraxasClient({
    apiKey: 'demo-key',
    endpoint: 'http://localhost:8080',
    enableSymbolicScoring: true,
    enableSigilGeneration: true,
    enableOracleConsultation: true,
    enableTimingOptimization: true
  });

  const connected = await abraxas.connect();
  console.log(`   Status: ${connected ? '✅ Connected' : '⚠️  Mock mode (API unavailable)'}`);
  console.log();

  // Generate an idea with base genie
  console.log('💡 Generating idea...');
  const genie = new NeonGenie({ mode: 'standalone' });
  const artifact = await genie.generate({
    concept: 'AI-powered meditation app with biometric feedback and personalized soundscapes',
    domain: 'software',
    constraints: ['privacy-focused', 'offline-capable'],
    tags: ['wellness', 'ai', 'mobile']
  });

  console.log(`   Title: ${artifact.title}`);
  console.log(`   Domain: ${artifact.domain}`);
  console.log();

  // Compare scoring modes
  console.log('━'.repeat(80));
  console.log('QUALITY SCORING COMPARISON');
  console.log('━'.repeat(80));
  console.log();

  // Standalone mode (5 dimensions)
  console.log('📊 STANDALONE MODE (5 Dimensions, Threshold: 0.5)');
  console.log('-'.repeat(80));
  displayQualityScore(artifact.quality, false);
  console.log();

  // Abraxas mode (6 dimensions)
  console.log('🔮 ABRAXAS MODE (6 Dimensions, Threshold: 0.6)');
  console.log('-'.repeat(80));
  const enhancedScorer = new EnhancedQualityScorer(abraxas);
  const abraxasScore = await enhancedScorer.scoreEnhanced(artifact);
  displayQualityScore(abraxasScore, true);
  console.log();

  // Symbolic insights
  console.log('━'.repeat(80));
  console.log('SYMBOLIC INSIGHTS');
  console.log('━'.repeat(80));
  console.log();

  const insights = await enhancedScorer.getSymbolicInsights(artifact);
  console.log('🔢 Numerology:');
  console.log(`   ${insights.numerology}`);
  console.log();
  console.log('⏰ Timing:');
  console.log(`   ${insights.timing}`);
  console.log();
  console.log('🎭 Archetypes:');
  console.log(`   ${insights.archetypes}`);
  console.log();
  console.log('💡 Recommendations:');
  insights.recommendations.forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });
  console.log();

  // Individual Abraxas API demonstrations
  console.log('━'.repeat(80));
  console.log('ABRAXAS API DEMONSTRATIONS');
  console.log('━'.repeat(80));
  console.log();

  // Tarot reading
  console.log('🃏 Tarot Reading');
  console.log('-'.repeat(80));
  const tarot = await abraxas.drawTarot(
    'What energy surrounds this meditation app concept?',
    'three-card'
  );
  console.log(`Spread: ${tarot.spread}`);
  console.log();
  tarot.cards.forEach(card => {
    console.log(`${card.position}:`);
    console.log(`  Card: ${card.card}${card.reversed ? ' (Reversed)' : ''}`);
    console.log(`  Interpretation: ${card.interpretation}`);
    console.log();
  });
  console.log(`Synthesis: ${tarot.synthesis}`);
  console.log(`Guidance: ${tarot.guidance}`);
  console.log();

  // I-Ching consultation
  console.log('☯️  I-Ching Consultation');
  console.log('-'.repeat(80));
  const iching = await abraxas.consultIChing(
    'How should we approach development of this wellness platform?'
  );
  console.log(`Hexagram ${iching.number}: ${iching.name} (${iching.chinese})`);
  console.log();
  console.log(`Judgment: ${iching.judgment}`);
  console.log(`Image: ${iching.image}`);
  console.log(`Guidance: ${iching.guidance}`);
  console.log();

  // Optimal timing windows
  console.log('📅 Optimal Launch Timing');
  console.log('-'.repeat(80));
  const now = new Date();
  const future = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
  const windows = await abraxas.getOptimalWindows(
    'Launch meditation app',
    { start: now, end: future }
  );

  console.log(`Analyzing next 90 days for optimal launch windows:\n`);
  windows.forEach((window, i) => {
    const score = (window.score * 100).toFixed(0);
    const emoji = window.type === 'optimal' ? '⭐' :
                  window.type === 'favorable' ? '✨' : '○';
    console.log(`${emoji} Window ${i + 1} (${window.type.toUpperCase()}) - Score: ${score}%`);
    console.log(`   Period: ${formatDate(window.start)} to ${formatDate(window.end)}`);
    console.log(`   Influences: ${window.influences.join(', ')}`);
    console.log(`   ${window.recommendations}`);
    console.log();
  });

  // Sigil generation
  console.log('🔯 Sigil Generation');
  console.log('-'.repeat(80));
  const sigil = await abraxas.generateSigil(
    'Bring calm and clarity to millions',
    'geometric'
  );
  console.log(`Intent: ${sigil.intent}`);
  console.log(`Style: ${sigil.style}`);
  console.log(`Symmetry: ${sigil.geometry.symmetry}`);
  console.log(`Elements: ${sigil.geometry.elements}`);
  console.log(`Complexity: ${(sigil.geometry.complexity * 100).toFixed(0)}%`);
  console.log();
  console.log(`Activation: ${sigil.activationInstructions}`);
  console.log();
  console.log('SVG Preview (first 200 chars):');
  console.log(sigil.svg.substring(0, 200) + '...');
  console.log();

  // Summary
  console.log('━'.repeat(80));
  console.log('SUMMARY');
  console.log('━'.repeat(80));
  console.log();
  console.log(`Idea: ${artifact.title}`);
  console.log(`Standalone Score: ${(artifact.quality.composite * 100).toFixed(1)}% (${artifact.quality.tier})`);
  console.log(`Abraxas Score: ${(abraxasScore.composite * 100).toFixed(1)}% (${abraxasScore.tier})`);
  console.log();

  if (abraxasScore.passed && !artifact.quality.passed) {
    console.log('🎯 Idea passed Abraxas threshold but failed standalone!');
  } else if (!abraxasScore.passed && artifact.quality.passed) {
    console.log('⚠️  Idea passed standalone but failed higher Abraxas threshold.');
  } else if (abraxasScore.passed) {
    console.log('✅ Idea passed both scoring modes!');
  } else {
    console.log('❌ Idea needs refinement in both modes.');
  }
  console.log();

  console.log('━'.repeat(80));
  console.log('Demo complete! Abraxas integration ready for production use.');
  console.log('When real API becomes available, update config and enjoy live symbolic analysis.');
  console.log('━'.repeat(80));
}

function displayQualityScore(score: QualityScore, includeSymbolic: boolean) {
  const dimensions = [
    { name: 'Ontological Depth', key: 'ontological_depth' },
    { name: 'Novelty', key: 'novelty' },
    { name: 'Viability', key: 'viability' },
    { name: 'Zeitgeist Alignment', key: 'zeitgeist_alignment' },
    { name: 'Generative Potential', key: 'generative_potential' }
  ];

  if (includeSymbolic && score.symbolic_resonance) {
    dimensions.push({ name: 'Symbolic Resonance ⭐', key: 'symbolic_resonance' });
  }

  console.log('Dimensions:');
  dimensions.forEach(dim => {
    const value = score[dim.key].value;
    const percentage = (value * 100).toFixed(1);
    const bar = createBar(value);
    console.log(`  ${dim.name.padEnd(25)} ${bar} ${percentage}%`);
  });

  console.log();
  console.log(`Composite: ${(score.composite * 100).toFixed(1)}%`);
  console.log(`Threshold: ${(score.threshold * 100).toFixed(0)}%`);
  console.log(`Status: ${score.passed ? '✅ PASSED' : '❌ NEEDS REFINEMENT'}`);
  console.log(`Tier: ${score.tier.toUpperCase()}`);

  if (score.breakdown.strengths.length > 0) {
    console.log();
    console.log('Strengths:');
    score.breakdown.strengths.forEach((s: string) => console.log(`  ✓ ${s}`));
  }

  if (score.breakdown.weaknesses.length > 0) {
    console.log();
    console.log('Weaknesses:');
    score.breakdown.weaknesses.forEach((w: string) => console.log(`  ✗ ${w}`));
  }
}

function createBar(value: number, length: number = 20): string {
  const filled = Math.round(value * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Run demo
main().catch(console.error);
