import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { EnhancedNeonGenie } from '../../src/core/genie-enhanced';

describe('integration workflow', () => {
  it('generates and analyzes artifacts end-to-end', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ng-flow-'));
    const genie = new EnhancedNeonGenie({ mode: 'enhanced', corpusPath: tempDir });

    const artifact = await genie.generateEnhanced({
      concept: 'Realtime planning tool for event producers',
      domain: 'software',
      constraints: ['realtime', 'offline capable'],
      tags: ['events']
    });

    const analysis = await genie.analyze({
      concept: 'Strategic workshop for creative teams',
      domain: 'events'
    });

    expect(artifact.components.length).toBeGreaterThan(0);
    expect(analysis.score.composite).toBeGreaterThanOrEqual(0);
  });
});
