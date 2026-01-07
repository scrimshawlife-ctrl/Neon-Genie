import { EnhancedNeonGenie } from '../src/core/genie-enhanced';

const genie = new EnhancedNeonGenie({ mode: 'enhanced' });

(async () => {
  const softwareIdea = await genie.generateEnhanced({
    concept: 'Realtime collaboration platform for on-site engineers',
    domain: 'software',
    constraints: ['realtime', 'offline capable', 'privacy focused'],
    tags: ['realtime', 'field ops']
  });

  const brandIdea = await genie.generateEnhanced({
    concept: 'Luxury wellness collective for new-age founders',
    domain: 'brands',
    constraints: ['premium', 'experiential'],
    aestheticDirection: 'Neon-alchemical minimalism',
    tags: ['luxury', 'wellness']
  });

  const semanticResults = await genie.searchSemantic('collaboration platform');
  const similar = await genie.findSimilarSemantic('luxury wellness');
  const duplicates = await genie.detectDuplicates(0.9);

  console.log('Software idea components:', softwareIdea.components.length);
  console.log('Brand idea aesthetic:', brandIdea.metadata.aestheticDirection);
  console.log('Semantic results:', semanticResults.length);
  console.log('Similar ideas:', similar.length);
  console.log('Duplicates detected:', duplicates.length);
  console.log('Semantic stats:', genie.getSemanticStats());
})();
