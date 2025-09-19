"use strict";
/**
 * Codex Error Integration Service
 *
 * Integrates Codex error handling with existing error system.
 * Provides comprehensive error categorization, user-friendly messages,
 * recovery suggestions, and logging integration.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexErrorIntegration = void 0;
/**
 * Service for integrating Codex error handling with existing error system
 */
class CodexErrorIntegration {
    constructor(errorHandlingService) {
        this.errorHandlingService = errorHandlingService;
    }
    /**
     * Handle Codex errors with appropriate categorization and integration
     */
    async handleCodexError(error, errorType, context) {
        try {
            let codexError;
            // Route to appropriate error handler based on error type
            switch (errorType) {
                case 'file-system':
                    codexError = this.errorHandlingService.handleFileSystemError(error, context);
                    break;
                case 'cli-execution':
                    codexError = this.errorHandlingService.handleCLIExecutionError(error, context);
                    break;
                case 'validation':
                    codexError = this.errorHandlingService.handleValidationError(error, context);
                    break;
                case 'configuration':
                    codexError = this.errorHandlingService.handleConfigurationError(error, context);
                    break;
                case 'codex-api':
                    // Handle Codex-specific API errors
                    codexError = this.handleCodexAPIError(error, context);
                    break;
                default:
                    // Handle unknown error types
                    codexError = this.handleUnknownError(error, context);
                    break;
            }
            // Create user-friendly error message
            const userFriendlyMessage = this.errorHandlingService.createUserFriendlyError(codexError);
            // Provide fallback suggestions if none are available
            const suggestions = codexError.suggestions && codexError.suggestions.length > 0
                ? [...codexError.suggestions]
                : this.getFallbackSuggestions();
            return {
                success: false,
                error: userFriendlyMessage,
                suggestions,
                recoverable: codexError.recoverable,
                details: codexError.details
            };
        }
        catch (handlingError) {
            // If error handling itself fails, provide a safe fallback
            return {
                success: false,
                error: 'An error occurred while processing the error',
                suggestions: [
                    'Check system logs for more details',
                    'Try the operation again',
                    'Contact support if issue persists',
                    'Check system resources'
                ],
                recoverable: true,
                details: {
                    originalError: error.message,
                    handlingError: handlingError instanceof Error ? handlingError.message : 'Unknown handling error'
                }
            };
        }
    }
    /**
     * Handle Codex-specific API errors
     */
    handleCodexAPIError(error, context) {
        const errorMessage = error.message.toLowerCase();
        let suggestions = [];
        if (errorMessage.includes('rate limit')) {
            suggestions = [
                'Wait before retrying the request',
                'Check API rate limits',
                'Implement exponential backoff',
                'Contact Codex support if issue persists'
            ];
        }
        else if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized')) {
            suggestions = [
                'Check API credentials',
                'Verify API key format',
                'Regenerate API key if needed',
                'Check API key permissions'
            ];
        }
        else if (errorMessage.includes('timeout') || errorMessage.includes('connection')) {
            suggestions = [
                'Check internet connection',
                'Retry the request',
                'Check API status',
                'Increase timeout settings'
            ];
        }
        else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
            suggestions = [
                'Check API endpoint URL',
                'Verify resource exists',
                'Check API version',
                'Review API documentation'
            ];
        }
        else {
            suggestions = [
                'Check API documentation',
                'Verify request format',
                'Contact Codex support',
                'Check API status page'
            ];
        }
        return {
            code: 'CODEX_API_ERROR',
            message: `Codex API error occurred during ${context}`,
            details: {
                originalError: error.message,
                context,
                errorType: this.extractCodexErrorType(errorMessage)
            },
            suggestions,
            recoverable: true,
            timestamp: new Date()
        };
    }
    /**
     * Handle unknown error types
     */
    handleUnknownError(error, context) {
        return {
            code: 'UNKNOWN_ERROR',
            message: `Unknown error occurred during ${context}`,
            details: {
                originalError: error.message,
                context,
                errorType: 'UNKNOWN'
            },
            suggestions: [
                'Check system logs for more details',
                'Try the operation again',
                'Contact support if issue persists',
                'Check system resources'
            ],
            recoverable: true,
            timestamp: new Date()
        };
    }
    /**
     * Extract Codex-specific error type from error message
     */
    extractCodexErrorType(errorMessage) {
        if (errorMessage.includes('rate limit'))
            return 'RATE_LIMIT_EXCEEDED';
        if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized'))
            return 'AUTHENTICATION_ERROR';
        if (errorMessage.includes('timeout') || errorMessage.includes('connection'))
            return 'CONNECTION_ERROR';
        if (errorMessage.includes('not found') || errorMessage.includes('404'))
            return 'RESOURCE_NOT_FOUND';
        if (errorMessage.includes('permission') || errorMessage.includes('forbidden'))
            return 'PERMISSION_DENIED';
        if (errorMessage.includes('invalid') || errorMessage.includes('bad request'))
            return 'INVALID_REQUEST';
        return 'UNKNOWN_API_ERROR';
    }
    /**
     * Get fallback suggestions when no specific suggestions are available
     */
    getFallbackSuggestions() {
        return [
            'Check system logs for more details',
            'Try the operation again',
            'Contact support if issue persists',
            'Check system resources'
        ];
    }
    /**
     * Get error handling statistics
     */
    getErrorHandlingStats() {
        // This would typically track statistics from actual error handling
        // For now, return empty stats as this is a basic implementation
        return {
            totalErrors: 0,
            errorTypes: {},
            recoverableErrors: 0,
            nonRecoverableErrors: 0
        };
    }
    /**
     * Reset error handling statistics
     */
    resetErrorHandlingStats() {
        // This would typically reset statistics tracking
        // For now, this is a no-op as this is a basic implementation
    }
}
exports.CodexErrorIntegration = CodexErrorIntegration;
//# sourceMappingURL=CodexErrorIntegration.js.map