/**
 * Codex Error Integration Service
 *
 * Integrates Codex error handling with existing error system.
 * Provides comprehensive error categorization, user-friendly messages,
 * recovery suggestions, and logging integration.
 */
import { IErrorHandlingService } from '../contracts/infrastructure-contracts';
/**
 * Result interface for error handling operations
 */
export interface CodexErrorResult {
    success: boolean;
    error?: string;
    suggestions?: string[];
    recoverable?: boolean;
    details?: any;
}
/**
 * Service for integrating Codex error handling with existing error system
 */
export declare class CodexErrorIntegration {
    private errorHandlingService;
    constructor(errorHandlingService: IErrorHandlingService);
    /**
     * Handle Codex errors with appropriate categorization and integration
     */
    handleCodexError(error: Error, errorType: string, context: any): Promise<CodexErrorResult>;
    /**
     * Handle Codex-specific API errors
     */
    private handleCodexAPIError;
    /**
     * Handle unknown error types
     */
    private handleUnknownError;
    /**
     * Extract Codex-specific error type from error message
     */
    private extractCodexErrorType;
    /**
     * Get fallback suggestions when no specific suggestions are available
     */
    private getFallbackSuggestions;
    /**
     * Get error handling statistics
     */
    getErrorHandlingStats(): {
        totalErrors: number;
        errorTypes: Record<string, number>;
        recoverableErrors: number;
        nonRecoverableErrors: number;
    };
    /**
     * Reset error handling statistics
     */
    resetErrorHandlingStats(): void;
}
