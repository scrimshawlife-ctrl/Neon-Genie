/**
 * AAL/ABX-Runes Overlay Bridge Type Definitions
 *
 * Defines the contract for deterministic, provenance-tracked
 * process invocation via stdin/stdout.
 */

import type { IdeationPrompt, IdeaArtifact, AnalysisReport } from '../types/artifact';

/**
 * Provenance metadata required for deterministic execution
 */
export interface OverlayProvenance {
  /** Unique identifier for this execution run */
  run_id: string;

  /** ISO 8601 timestamp for this execution */
  timestamp_iso: string;

  /** Optional seed for deterministic randomness */
  seed?: string;
}

/**
 * Base request structure for all overlay operations
 */
export interface OverlayRequest {
  /** Operation to perform */
  operation: 'generate' | 'analyze' | 'evolve' | 'search' | 'findSimilar' | 'export';

  /** Required provenance metadata */
  provenance: OverlayProvenance;

  /** Operation-specific payload */
  payload: unknown;
}

/**
 * Generate operation request
 */
export interface GenerateRequest extends OverlayRequest {
  operation: 'generate';
  payload: IdeationPrompt;
}

/**
 * Analyze operation request
 */
export interface AnalyzeRequest extends OverlayRequest {
  operation: 'analyze';
  payload: IdeationPrompt;
}

/**
 * Evolve operation request
 */
export interface EvolveRequest extends OverlayRequest {
  operation: 'evolve';
  payload: {
    parentId: string;
    feedback: string[];
  };
}

/**
 * Search operation request
 */
export interface SearchRequest extends OverlayRequest {
  operation: 'search';
  payload: {
    query: string;
  };
}

/**
 * FindSimilar operation request
 */
export interface FindSimilarRequest extends OverlayRequest {
  operation: 'findSimilar';
  payload: {
    id: string;
  };
}

/**
 * Export operation request
 */
export interface ExportRequest extends OverlayRequest {
  operation: 'export';
  payload: {
    id: string;
    format: 'json' | 'markdown';
  };
}

/**
 * Union type of all valid requests
 */
export type AnyOverlayRequest =
  | GenerateRequest
  | AnalyzeRequest
  | EvolveRequest
  | SearchRequest
  | FindSimilarRequest
  | ExportRequest;

/**
 * Success response wrapper
 */
export interface OverlaySuccessResponse<T = unknown> {
  success: true;
  result: T;
  provenance: OverlayProvenance;
}

/**
 * Error response wrapper
 */
export interface OverlayErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  provenance: OverlayProvenance;
}

/**
 * Union type of all possible responses
 */
export type OverlayResponse = OverlaySuccessResponse | OverlayErrorResponse;

/**
 * Generate operation response
 */
export interface GenerateResponse extends OverlaySuccessResponse<IdeaArtifact> {
  result: IdeaArtifact;
}

/**
 * Analyze operation response
 */
export interface AnalyzeResponse extends OverlaySuccessResponse<AnalysisReport> {
  result: AnalysisReport;
}

/**
 * Evolve operation response
 */
export interface EvolveResponse extends OverlaySuccessResponse<IdeaArtifact> {
  result: IdeaArtifact;
}

/**
 * Search operation response
 */
export interface SearchResponse extends OverlaySuccessResponse<IdeaArtifact[]> {
  result: IdeaArtifact[];
}

/**
 * FindSimilar operation response
 */
export interface FindSimilarResponse extends OverlaySuccessResponse<IdeaArtifact[]> {
  result: IdeaArtifact[];
}

/**
 * Export operation response
 */
export interface ExportResponse extends OverlaySuccessResponse<string> {
  result: string;
}
