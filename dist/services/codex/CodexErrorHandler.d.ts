/**
 * CodexErrorHandler Service
 *
 * Implements comprehensive error handling for Codex integration operations.
 * Provides user-friendly error messages, categorization, and recovery suggestions.
 */
import { IErrorHandlingService } from '../../contracts/infrastructure-contracts';
import { CodexError } from '../../contracts/domain-contracts';
/**
 * Service for handling errors in Codex integration operations
 */
export declare class CodexErrorHandler implements IErrorHandlingService {
    /**
     * Handle file system errors with appropriate categorization and suggestions
     */
    handleFileSystemError(error: Error, operation: string): CodexError;
    /**
     * Handle CLI execution errors with appropriate categorization and suggestions
     */
    handleCLIExecutionError(error: Error, command: string): CodexError;
    /**
     * Handle validation errors with appropriate categorization and suggestions
     */
    handleValidationError(error: Error, context: string): CodexError;
    /**
     * Handle configuration errors with appropriate categorization and suggestions
     */
    handleConfigurationError(error: Error, config: any): CodexError;
    /**
     * Create user-friendly error messages from CodexError objects
     */
    createUserFriendlyError(error: CodexError): string;
    /**
     * Extract error type from error message for file system errors
     */
    private extractErrorType;
    /**
     * Extract error type from error message for CLI execution errors
     */
    private extractCLIErrorType;
    /**
     * Extract error type from error message for validation errors
     */
    private extractValidationErrorType;
    /**
     * Extract error type from error message for configuration errors
     */
    private extractConfigurationErrorType;
}
