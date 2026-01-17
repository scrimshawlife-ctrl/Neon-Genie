/**
 * Runes Integration Demo
 *
 * Demonstrates the Elder Futhark rune system integration with Neon Genie.
 * Shows rune casting, readings, identification, and integration with ideas.
 */

import { NeonGenie } from '../src/core/genie';
import { AbraxasClient } from '../src/abraxas/client';
import { RuneSystem } from '../src/abraxas/runes';
import { RuneIdentifier } from '../src/abraxas/rune-identifier';

async function main() {
  console.log('='.repeat(80));
  console.log('NEON GENIE - ELDER FUTHARK RUNES INTEGRATION DEMO');
  console.log('='.repeat(80));
  console.log();

  // Initialize systems
  const runeSystem = new RuneSystem();
  const runeIdentifier = new RuneIdentifier();
  const abraxas = new AbraxasClient({
    apiKey: 'demo-key',
    endpoint: 'http://localhost:8080'
  });

  await abraxas.connect();

  // ============================================================================
  // Section 1: Elder Futhark Overview
  // ============================================================================

  console.log('━'.repeat(80));
  console.log('SECTION 1: ELDER FUTHARK SYSTEM');
  console.log('━'.repeat(80));
  console.log();

  const allRunes = runeSystem.getAllRunes();
  console.log(`📖 The Elder Futhark consists of ${allRunes.length} runes organized into three aetts (families):\n`);

  const aetts = ['Freya', 'Heimdall', 'Tyr'] as const;
  aetts.forEach(aett => {
    const runes = runeSystem.getRunesByAett(aett);
    console.log(`${aett}'s Aett (${runes.length} runes):`);
    runes.forEach(rune => {
      console.log(`  ${rune.character} ${rune.name.padEnd(10)} - ${rune.meaning}`);
    });
    console.log();
  });

  // ============================================================================
  // Section 2: Rune Casting for Divination
  // ============================================================================

  console.log('━'.repeat(80));
  console.log('SECTION 2: RUNE CASTING & DIVINATION');
  console.log('━'.repeat(80));
  console.log();

  const question = 'How can we create meaningful technology that serves humanity?';
  console.log(`🔮 Question: "${question}"\n`);

  // Three-rune spread (Past, Present, Future)
  const cast = await abraxas.castRunes(question, 'three');

  console.log(`Spread: ${cast.spread} (${cast.runes.length} runes)\n`);

  cast.runes.forEach((drawn, i) => {
    console.log(`${i + 1}. ${drawn.position}`);
    console.log(`   Rune: ${drawn.rune.character} ${drawn.rune.name}${drawn.reversed ? ' (Reversed)' : ''}`);
    console.log(`   Meaning: ${drawn.rune.meaning}`);
    console.log(`   Interpretation: ${drawn.interpretation}`);
    console.log();
  });

  console.log('Overall Interpretation:');
  console.log(cast.interpretation);
  console.log();

  console.log(`Guidance: ${cast.guidance}`);
  console.log();

  console.log('Energies Present:');
  console.log(`  Dominant: ${cast.energies.dominant.join(', ')}`);
  if (cast.energies.supportive.length > 0) {
    console.log(`  Supportive: ${cast.energies.supportive.join(', ')}`);
  }
  if (cast.energies.challenging.length > 0) {
    console.log(`  Challenging: ${cast.energies.challenging.join(', ')}`);
  }
  console.log();

  // ============================================================================
  // Section 3: Rune-Based Idea Identification
  // ============================================================================

  console.log('━'.repeat(80));
  console.log('SECTION 3: RUNE-BASED IDEA IDENTIFICATION');
  console.log('━'.repeat(80));
  console.log();

  // Generate an idea
  console.log('💡 Generating idea...\n');
  const genie = new NeonGenie({ mode: 'standalone' });
  const idea = await genie.generate({
    concept: 'Decentralized wellness platform connecting healers with seekers through verified credentials',
    domain: 'software',
    constraints: ['privacy-focused', 'blockchain-based'],
    tags: ['wellness', 'decentralized', 'trust']
  });

  console.log(`Title: ${idea.title}`);
  console.log(`Domain: ${idea.domain}`);
  console.log(`Themes: ${idea.themes.join(', ')}`);
  console.log();

  // Generate rune signature
  const signature = runeIdentifier.generateSignature(idea);

  console.log('🔯 Rune Signature');
  console.log('-'.repeat(80));
  console.log();

  console.log(`Primary Rune: ${signature.primary.character} ${signature.primary.name}`);
  console.log(`  Meaning: ${signature.primary.meaning}`);
  console.log(`  Keywords: ${signature.primary.keywords.join(', ')}`);
  console.log(`  Element: ${signature.primary.element || 'none'}`);
  console.log(`  Aett: ${signature.primary.aett}`);
  console.log();

  console.log('Secondary Runes:');
  signature.secondary.forEach((rune, i) => {
    console.log(`  ${i + 1}. ${rune.character} ${rune.name} - ${rune.meaning}`);
  });
  console.log();

  console.log(`Identifier: ${signature.identifier}`);
  console.log(`Short ID: ${runeIdentifier.generateShortId(idea)}`);
  console.log(`Rune Name: ${runeIdentifier.generateName(idea)}`);
  console.log(`Full Runic Encoding: ${signature.fullName}`);
  console.log();

  console.log(`Meaning: ${signature.meaning}`);
  console.log();

  console.log(`Combined Keywords: ${signature.keywords.join(', ')}`);
  console.log();

  console.log(`Power Level: ${(signature.power * 100).toFixed(1)}%`);
  const powerBar = createBar(signature.power);
  console.log(`${powerBar}`);
  console.log();

  // Rune-based tags
  const tags = runeIdentifier.generateTags(idea);
  console.log('Rune-Based Tags:');
  tags.forEach(tag => console.log(`  • ${tag}`));
  console.log();

  // Synergy calculation
  const allRunesInSignature = [signature.primary, ...signature.secondary];
  const synergy = runeIdentifier.calculateSynergy(allRunesInSignature);
  console.log(`Rune Synergy: ${(synergy * 100).toFixed(1)}%`);
  console.log();

  // ============================================================================
  // Section 4: Rune Reading for Concept
  // ============================================================================

  console.log('━'.repeat(80));
  console.log('SECTION 4: RUNE READING FOR CONCEPT');
  console.log('━'.repeat(80));
  console.log();

  const concept = 'meditation app';
  console.log(`📱 Concept: "${concept}"\n`);

  const reading = await abraxas.getRuneReading(concept);

  console.log(`Primary Rune: ${reading.primary.character} ${reading.primary.name}`);
  console.log(`  ${reading.message}`);
  console.log();

  console.log('Supporting Runes:');
  reading.secondary.forEach((rune, i) => {
    console.log(`  ${i + 1}. ${rune.character} ${rune.name} - ${rune.meaning}`);
  });
  console.log();

  console.log(`Action: ${reading.action}`);
  console.log(`Warning: ${reading.warning}`);
  console.log();

  // ============================================================================
  // Section 5: Text Encoding in Runes
  // ============================================================================

  console.log('━'.repeat(80));
  console.log('SECTION 5: TEXT ENCODING');
  console.log('━'.repeat(80));
  console.log();

  const texts = [
    'Neon Genie',
    'wisdom',
    'innovation',
    'transformation'
  ];

  console.log('📝 Converting text to Elder Futhark runes:\n');

  texts.forEach(text => {
    const encoded = runeSystem.toPhoneticRunes(text);
    console.log(`${text.padEnd(20)} → ${encoded}`);
  });
  console.log();

  // ============================================================================
  // Section 6: Rune Properties & Elements
  // ============================================================================

  console.log('━'.repeat(80));
  console.log('SECTION 6: RUNE ELEMENTS & PROPERTIES');
  console.log('━'.repeat(80));
  console.log();

  const elements = ['fire', 'water', 'air', 'earth', 'ice'] as const;
  console.log('Runes organized by element:\n');

  elements.forEach(element => {
    const elementRunes = allRunes.filter(r => r.element === element);
    if (elementRunes.length > 0) {
      console.log(`🔥 ${element.toUpperCase()} (${elementRunes.length} runes):`);
      elementRunes.forEach(rune => {
        console.log(`   ${rune.character} ${rune.name.padEnd(10)} - ${rune.keywords.slice(0, 3).join(', ')}`);
      });
      console.log();
    }
  });

  // ============================================================================
  // Section 7: Multiple Idea Comparison
  // ============================================================================

  console.log('━'.repeat(80));
  console.log('SECTION 7: COMPARING MULTIPLE IDEAS');
  console.log('━'.repeat(80));
  console.log();

  const ideas = [
    {
      concept: 'AI-powered dream journal with pattern analysis',
      domain: 'software' as const,
      tags: ['ai', 'wellness', 'personal']
    },
    {
      concept: 'Sustainable bamboo bicycle manufacturing cooperative',
      domain: 'products' as const,
      tags: ['sustainability', 'transport', 'cooperative']
    },
    {
      concept: 'Decentralized autonomous artist collective',
      domain: 'creative' as const,
      tags: ['dao', 'art', 'blockchain']
    }
  ];

  console.log('Generating rune signatures for multiple ideas:\n');

  for (const ideaDef of ideas) {
    const artifact = await genie.generate(ideaDef);
    const sig = runeIdentifier.generateSignature(artifact);

    console.log(`Idea: ${artifact.title.substring(0, 50)}...`);
    console.log(`  Signature: ${sig.identifier}`);
    console.log(`  Primary: ${sig.primary.character} ${sig.primary.name} (${sig.primary.meaning})`);
    console.log(`  Name: ${runeIdentifier.generateName(artifact)}`);
    console.log(`  Power: ${(sig.power * 100).toFixed(0)}% ${createBar(sig.power, 10)}`);
    console.log();
  }

  // ============================================================================
  // Section 8: Practical Applications
  // ============================================================================

  console.log('━'.repeat(80));
  console.log('SECTION 8: PRACTICAL APPLICATIONS');
  console.log('━'.repeat(80));
  console.log();

  console.log('✨ How to use runes in your workflow:\n');

  console.log('1. Idea Identification');
  console.log('   • Generate unique rune-based IDs for database storage');
  console.log('   • Use runic names for memorable project codenames');
  console.log('   • Create visual rune signatures for branding\n');

  console.log('2. Decision Making');
  console.log('   • Cast runes for strategic questions');
  console.log('   • Use three-rune spread for past-present-future insight');
  console.log('   • Consult rune readings when choosing between options\n');

  console.log('3. Quality Assessment');
  console.log('   • Check rune synergy scores');
  console.log('   • Align project elements with compatible rune energies');
  console.log('   • Use power level as additional quality metric\n');

  console.log('4. Categorization & Search');
  console.log('   • Tag ideas by rune aett (Freya/Heimdall/Tyr)');
  console.log('   • Filter by element associations');
  console.log('   • Group by primary rune characteristics\n');

  console.log('5. Team Collaboration');
  console.log('   • Assign rune signatures to team members');
  console.log('   • Use rune synergy to form optimal working groups');
  console.log('   • Create rune-based project rituals\n');

  // ============================================================================
  // Summary
  // ============================================================================

  console.log('━'.repeat(80));
  console.log('SUMMARY');
  console.log('━'.repeat(80));
  console.log();

  console.log('🔮 Runes Integration Complete!\n');

  console.log('Features Demonstrated:');
  console.log('  ✓ Elder Futhark system (24 runes, 3 aetts)');
  console.log('  ✓ Rune casting for divination');
  console.log('  ✓ Rune-based idea signatures');
  console.log('  ✓ Unique identifier generation');
  console.log('  ✓ Text encoding in runic script');
  console.log('  ✓ Element & property analysis');
  console.log('  ✓ Synergy calculation');
  console.log('  ✓ Practical applications');
  console.log();

  console.log('━'.repeat(80));
  console.log('The runes have spoken. May your ideas be blessed with clarity and power.');
  console.log('━'.repeat(80));
}

function createBar(value: number, length: number = 20): string {
  const filled = Math.round(value * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

// Run demo
main().catch(console.error);
