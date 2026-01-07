import { NextRequest } from 'next/server';
import { EnhancedNeonGenie } from '../../../../src/core/genie-enhanced';

const genie = new EnhancedNeonGenie({ mode: 'enhanced' });

export async function POST(request: NextRequest) {
  const body = await request.json();
  const artifact = await genie.generateEnhanced({
    concept: body.concept,
    domain: body.domain,
    constraints: body.constraints,
    aestheticDirection: body.aestheticDirection
  });

  return Response.json(artifact);
}
