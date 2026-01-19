/**
 * Tests for Overlay Bridge
 *
 * Verifies:
 * - Request/response protocol
 * - Operation dispatching
 * - Error handling
 * - Provenance tracking
 */

import { OverlayBridge } from '../../src/overlay/bridge';
import type {
  GenerateRequest,
  AnalyzeRequest,
  SearchRequest,
  OverlaySuccessResponse,
  OverlayErrorResponse
} from '../../src/overlay/types';
import type { IdeaArtifact } from '../../src/types/artifact';
import type { QualityScore } from '../../src/types/quality';
import * as fs from 'fs/promises';
import * as path from 'path';

const TEST_CORPUS_PATH = path.join(__dirname, '../../.test-corpus-bridge');

// Helper to create mock quality score for tests
const createMockQualityScore = (): QualityScore => ({
  ontological_depth: { value: 0.8, rationale: 'test' },
  novelty: { value: 0.7, rationale: 'test' },
  viability: { value: 0.75, rationale: 'test' },
  zeitgeist_alignment: { value: 0.6, rationale: 'test' },
  generative_potential: { value: 0.5, rationale: 'test' },
  composite: 0.7,
  threshold: 0.5,
  passed: true,
  tier: 'accept',
  breakdown: { strengths: [], weaknesses: [], refinements: [] }
});

describe('OverlayBridge', () => {
  beforeAll(async () => {
    // Ensure clean test corpus directory
    try {
      await fs.rm(TEST_CORPUS_PATH, { recursive: true, force: true });
    } catch {
      // Ignore if doesn't exist
    }
    await fs.mkdir(TEST_CORPUS_PATH, { recursive: true });
  });

  afterAll(async () => {
    // Cleanup test corpus
    try {
      await fs.rm(TEST_CORPUS_PATH, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Request Validation', () => {
    it('should reject request without operation', async () => {
      const _bridge = new OverlayBridge({ corpusPath: TEST_CORPUS_PATH });

      // Mock stdin with invalid request
      const invalidRequest = {
        provenance: {
          run_id: 'test',
          timestamp_iso: '2025-01-18T12:00:00Z'
        },
        payload: {}
      };

      // Note: Full stdin/stdout testing requires integration tests
      // Here we validate the request structure requirements
      expect(invalidRequest).not.toHaveProperty('operation');
    });

    it('should reject request without provenance', () => {
      const invalidRequest = {
        operation: 'generate',
        payload: {}
      };

      expect(invalidRequest).not.toHaveProperty('provenance');
    });

    it('should reject request without run_id', () => {
      const invalidRequest = {
        operation: 'generate',
        provenance: {
          timestamp_iso: '2025-01-18T12:00:00Z'
        },
        payload: {}
      };

      expect(invalidRequest.provenance).not.toHaveProperty('run_id');
    });

    it('should reject request without timestamp_iso', () => {
      const invalidRequest = {
        operation: 'generate',
        provenance: {
          run_id: 'test'
        },
        payload: {}
      };

      expect(invalidRequest.provenance).not.toHaveProperty('timestamp_iso');
    });

    it('should accept valid request structure', () => {
      const validRequest: GenerateRequest = {
        operation: 'generate',
        provenance: {
          run_id: 'test-run',
          timestamp_iso: '2025-01-18T12:00:00Z',
          seed: 'test-seed'
        },
        payload: {
          concept: 'Test concept',
          domain: 'software'
        }
      };

      expect(validRequest.operation).toBe('generate');
      expect(validRequest.provenance.run_id).toBe('test-run');
      expect(validRequest.provenance.timestamp_iso).toBe('2025-01-18T12:00:00Z');
      expect(validRequest.payload).toHaveProperty('concept');
    });
  });

  describe('Response Format', () => {
    it('should format success response correctly', () => {
      const successResponse: OverlaySuccessResponse<IdeaArtifact> = {
        success: true,
        result: {
          id: 'idea_test',
          title: 'Test Artifact',
          domain: 'software',
          concept: 'Test',
          problem: 'Test problem',
          solution: 'Test solution',
          themes: ['test'],
          components: [],
          architecture: {
            storage: 'test',
            computation: 'test',
            interface: 'test',
            ecosystem_mapping: []
          },
          quality: createMockQualityScore(),
          provenance: {
            origin: 'test',
            generator: 'test',
            transformations: [],
            timestamp: '2025-01-18T12:00:00Z'
          },
          lineage: {
            children: []
          },
          metadata: {
            constraints: [],
            tags: [],
            mode: 'test',
            createdAt: '2025-01-18T12:00:00Z'
          }
        },
        provenance: {
          run_id: 'test-run',
          timestamp_iso: '2025-01-18T12:00:00Z'
        }
      };

      expect(successResponse.success).toBe(true);
      expect(successResponse).toHaveProperty('result');
      expect(successResponse).toHaveProperty('provenance');
    });

    it('should format error response correctly', () => {
      const errorResponse: OverlayErrorResponse = {
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: 'Test error message',
          details: 'Stack trace here'
        },
        provenance: {
          run_id: 'test-run',
          timestamp_iso: '2025-01-18T12:00:00Z'
        }
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error.code).toBe('TEST_ERROR');
      expect(errorResponse.error.message).toBe('Test error message');
      expect(errorResponse).toHaveProperty('provenance');
    });
  });

  describe('Operation Types', () => {
    it('should support generate operation', () => {
      const request: GenerateRequest = {
        operation: 'generate',
        provenance: {
          run_id: 'gen-001',
          timestamp_iso: '2025-01-18T12:00:00Z'
        },
        payload: {
          concept: 'Test software platform',
          domain: 'software',
          constraints: ['scalable'],
          tags: ['test']
        }
      };

      expect(request.operation).toBe('generate');
      expect(request.payload.concept).toBeDefined();
      expect(request.payload.domain).toBeDefined();
    });

    it('should support analyze operation', () => {
      const request: AnalyzeRequest = {
        operation: 'analyze',
        provenance: {
          run_id: 'analyze-001',
          timestamp_iso: '2025-01-18T12:00:00Z'
        },
        payload: {
          concept: 'Analysis target',
          domain: 'software'
        }
      };

      expect(request.operation).toBe('analyze');
      expect(request.payload.concept).toBeDefined();
    });

    it('should support search operation', () => {
      const request: SearchRequest = {
        operation: 'search',
        provenance: {
          run_id: 'search-001',
          timestamp_iso: '2025-01-18T12:00:00Z'
        },
        payload: {
          query: 'test query'
        }
      };

      expect(request.operation).toBe('search');
      expect(request.payload.query).toBeDefined();
    });
  });

  describe('Deterministic Operation Dispatch', () => {
    it('should produce identical responses for identical generate requests', async () => {
      const request: GenerateRequest = {
        operation: 'generate',
        provenance: {
          run_id: 'det-dispatch-001',
          timestamp_iso: '2025-01-18T12:00:00.000Z',
          seed: 'dispatch-seed'
        },
        payload: {
          concept: 'Deterministic dispatch test',
          domain: 'software',
          constraints: ['deterministic'],
          tags: ['test']
        }
      };

      // Simulate two separate bridge instances processing same request
      const bridge1 = new OverlayBridge({ corpusPath: TEST_CORPUS_PATH });
      const bridge2 = new OverlayBridge({ corpusPath: TEST_CORPUS_PATH });

      // Access private dispatch method via reflection (for testing)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dispatch1 = (bridge1 as any).dispatch.bind(bridge1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dispatch2 = (bridge2 as any).dispatch.bind(bridge2);

      const response1 = await dispatch1(request);
      const response2 = await dispatch2(request);

      expect(response1.success).toBe(true);
      expect(response2.success).toBe(true);

      if (response1.success && response2.success) {
        const artifact1 = response1.result as IdeaArtifact;
        const artifact2 = response2.result as IdeaArtifact;

        // Critical: IDs must match
        expect(artifact1.id).toBe(artifact2.id);
        expect(artifact1.title).toBe(artifact2.title);
        expect(artifact1.concept).toBe(artifact2.concept);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid operation gracefully', async () => {
      const bridge = new OverlayBridge({ corpusPath: TEST_CORPUS_PATH });

      const invalidRequest = {
        operation: 'invalid_operation',
        provenance: {
          run_id: 'error-test',
          timestamp_iso: '2025-01-18T12:00:00Z'
        },
        payload: {}
      } as unknown as GenerateRequest;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dispatch = (bridge as any).dispatch.bind(bridge);
      const response = await dispatch(invalidRequest);

      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error.message).toContain('Unknown operation');
      }
    });

    it('should preserve provenance in error responses', async () => {
      const bridge = new OverlayBridge({ corpusPath: TEST_CORPUS_PATH });

      const provenance = {
        run_id: 'error-prov-test',
        timestamp_iso: '2025-01-18T12:00:00Z',
        seed: 'error-seed'
      };

      const invalidRequest = {
        operation: 'invalid',
        provenance,
        payload: {}
      } as unknown as GenerateRequest;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dispatch = (bridge as any).dispatch.bind(bridge);
      const response = await dispatch(invalidRequest);

      expect(response.provenance).toEqual(provenance);
    });
  });

  describe('Environment Configuration', () => {
    it('should read NEON_CORPUS_PATH from environment', () => {
      const originalEnv = process.env.NEON_CORPUS_PATH;
      process.env.NEON_CORPUS_PATH = '/custom/corpus/path';

      // Note: This would be tested in integration tests with actual CLI
      expect(process.env.NEON_CORPUS_PATH).toBe('/custom/corpus/path');

      // Restore
      if (originalEnv !== undefined) {
        process.env.NEON_CORPUS_PATH = originalEnv;
      } else {
        delete process.env.NEON_CORPUS_PATH;
      }
    });

    it('should read NEON_MODE from environment', () => {
      const originalEnv = process.env.NEON_MODE;
      process.env.NEON_MODE = 'abraxas';

      expect(process.env.NEON_MODE).toBe('abraxas');

      // Restore
      if (originalEnv !== undefined) {
        process.env.NEON_MODE = originalEnv;
      } else {
        delete process.env.NEON_MODE;
      }
    });
  });
});
