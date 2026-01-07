import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { NeonGenie } from '../../src/core/genie';

describe('NeonGenie core', () => {
  it('generates artifacts with quality scores', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ng-genie-'));
    const genie = new NeonGenie({ corpusPath: tempDir, mode: 'standalone' });

    const artifact = await genie.generate({
      concept: 'Research hub for emergent energy systems',
      domain: 'research'
    });

    expect(artifact.quality.composite).toBeGreaterThanOrEqual(0);
    expect(artifact.quality.composite).toBeLessThanOrEqual(1);
  });
});
