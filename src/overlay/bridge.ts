/**
 * AAL/ABX-Runes Overlay Bridge
 *
 * Process-based stdin/stdout interface for deterministic NeonGenie invocation.
 *
 * Protocol:
 * 1. Read exactly one JSON request from stdin
 * 2. Dispatch to appropriate operation handler
 * 3. Write exactly one JSON response to stdout
 * 4. Exit with code 0 (success) or 1 (error)
 *
 * SEED Compliance:
 * - All operations are deterministic given same provenance
 * - No hidden clocks or randomness
 * - Explicit error handling (no silent fallbacks)
 */

import * as readline from 'readline';
import { DeterministicNeonGenie, type DeterministicGenieConfig } from './deterministic-genie';
import type {
  AnyOverlayRequest,
  OverlayResponse,
  OverlaySuccessResponse,
  OverlayErrorResponse,
  OverlayProvenance,
  GenerateRequest,
  AnalyzeRequest,
  EvolveRequest,
  SearchRequest,
  FindSimilarRequest,
  ExportRequest
} from './types';

/**
 * Overlay Bridge Configuration
 */
export interface OverlayBridgeConfig {
  /** Corpus storage path */
  corpusPath?: string;

  /** Execution mode */
  mode?: string;
}

/**
 * Main overlay bridge class
 */
export class OverlayBridge {
  private readonly config: OverlayBridgeConfig;

  constructor(config: OverlayBridgeConfig = {}) {
    this.config = config;
  }

  /**
   * Read single JSON request from stdin
   */
  private async readRequest(): Promise<AnyOverlayRequest> {
    return new Promise((resolve, reject) => {
      let inputBuffer = '';

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
      });

      rl.on('line', (line) => {
        inputBuffer += line;
      });

      rl.on('close', () => {
        try {
          if (inputBuffer.trim() === '') {
            reject(new Error('Empty input received from stdin'));
            return;
          }

          const request = JSON.parse(inputBuffer) as AnyOverlayRequest;

          // Validate request structure
          if (!request.operation) {
            reject(new Error('Missing required field: operation'));
            return;
          }

          if (!request.provenance) {
            reject(new Error('Missing required field: provenance'));
            return;
          }

          if (!request.provenance.run_id) {
            reject(new Error('Missing required field: provenance.run_id'));
            return;
          }

          if (!request.provenance.timestamp_iso) {
            reject(new Error('Missing required field: provenance.timestamp_iso'));
            return;
          }

          if (!request.payload) {
            reject(new Error('Missing required field: payload'));
            return;
          }

          resolve(request);
        } catch (error) {
          reject(new Error(`Invalid JSON input: ${(error as Error).message}`));
        }
      });

      rl.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Write single JSON response to stdout
   */
  private writeResponse(response: OverlayResponse): void {
    const json = JSON.stringify(response, null, 2);
    process.stdout.write(json + '\n');
  }

  /**
   * Create success response
   */
  private createSuccessResponse<T>(
    result: T,
    provenance: OverlayProvenance
  ): OverlaySuccessResponse<T> {
    return {
      success: true,
      result,
      provenance
    };
  }

  /**
   * Create error response
   */
  private createErrorResponse(
    error: Error,
    provenance: OverlayProvenance
  ): OverlayErrorResponse {
    return {
      success: false,
      error: {
        code: error.name || 'OverlayError',
        message: error.message,
        details: error.stack
      },
      provenance
    };
  }

  /**
   * Dispatch request to appropriate handler
   */
  private async dispatch(request: AnyOverlayRequest): Promise<OverlayResponse> {
    // Create deterministic genie instance
    const genieConfig: DeterministicGenieConfig = {
      corpusPath: this.config.corpusPath,
      mode: this.config.mode,
      provenance: request.provenance
    };

    const genie = new DeterministicNeonGenie(genieConfig);

    try {
      switch (request.operation) {
        case 'generate':
          return await this.handleGenerate(genie, request as GenerateRequest);

        case 'analyze':
          return await this.handleAnalyze(genie, request as AnalyzeRequest);

        case 'evolve':
          return await this.handleEvolve(genie, request as EvolveRequest);

        case 'search':
          return await this.handleSearch(genie, request as SearchRequest);

        case 'findSimilar':
          return await this.handleFindSimilar(genie, request as FindSimilarRequest);

        case 'export':
          return await this.handleExport(genie, request as ExportRequest);

        default:
          throw new Error(`Unknown operation: ${(request as AnyOverlayRequest).operation}`);
      }
    } catch (error) {
      return this.createErrorResponse(error as Error, request.provenance);
    }
  }

  /**
   * Handle generate operation
   */
  private async handleGenerate(
    genie: DeterministicNeonGenie,
    request: GenerateRequest
  ): Promise<OverlayResponse> {
    const artifact = await genie.generate(request.payload);
    return this.createSuccessResponse(artifact, request.provenance);
  }

  /**
   * Handle analyze operation
   */
  private async handleAnalyze(
    genie: DeterministicNeonGenie,
    request: AnalyzeRequest
  ): Promise<OverlayResponse> {
    const report = await genie.analyze(request.payload);
    return this.createSuccessResponse(report, request.provenance);
  }

  /**
   * Handle evolve operation
   */
  private async handleEvolve(
    genie: DeterministicNeonGenie,
    request: EvolveRequest
  ): Promise<OverlayResponse> {
    const { parentId, feedback } = request.payload;
    const artifact = await genie.evolve(parentId, feedback);
    return this.createSuccessResponse(artifact, request.provenance);
  }

  /**
   * Handle search operation
   */
  private async handleSearch(
    genie: DeterministicNeonGenie,
    request: SearchRequest
  ): Promise<OverlayResponse> {
    const { query } = request.payload;
    const artifacts = await genie.search(query);
    return this.createSuccessResponse(artifacts, request.provenance);
  }

  /**
   * Handle findSimilar operation
   */
  private async handleFindSimilar(
    genie: DeterministicNeonGenie,
    request: FindSimilarRequest
  ): Promise<OverlayResponse> {
    const { id } = request.payload;
    const artifacts = await genie.findSimilar(id);
    return this.createSuccessResponse(artifacts, request.provenance);
  }

  /**
   * Handle export operation
   */
  private async handleExport(
    genie: DeterministicNeonGenie,
    request: ExportRequest
  ): Promise<OverlayResponse> {
    const { id, format } = request.payload;
    const exported = await genie.export(id, format);
    return this.createSuccessResponse(exported, request.provenance);
  }

  /**
   * Main execution loop
   *
   * Reads stdin → Dispatches → Writes stdout → Exits
   */
  async run(): Promise<void> {
    try {
      const request = await this.readRequest();
      const response = await this.dispatch(request);
      this.writeResponse(response);
      process.exit(0);
    } catch (error) {
      // Fatal error before we could read provenance
      const errorResponse: OverlayErrorResponse = {
        success: false,
        error: {
          code: 'FATAL_ERROR',
          message: (error as Error).message,
          details: (error as Error).stack
        },
        provenance: {
          run_id: 'unknown',
          timestamp_iso: new Date().toISOString()
        }
      };

      this.writeResponse(errorResponse);
      process.exit(1);
    }
  }
}

/**
 * CLI entry point
 */
export async function main(): Promise<void> {
  const bridge = new OverlayBridge({
    corpusPath: process.env.NEON_CORPUS_PATH || 'corpus',
    mode: process.env.NEON_MODE || 'standalone'
  });

  await bridge.run();
}
