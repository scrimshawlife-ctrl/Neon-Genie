import { NeonGenie } from '../src/core/genie';

const genie = new NeonGenie({ mode: 'standalone' });

(async () => {
  const artifact = await genie.generate({
    concept: 'A modular ritual planner for creative teams',
    domain: 'content',
    constraints: ['async collaboration', 'knowledge capture'],
    tags: ['ritual', 'collaboration']
  });

  console.log('Standalone artifact:', artifact.title, artifact.quality.composite);
})();
