"use strict";
/**
 * Application Contracts for Codex Support Integration
 *
 * These contracts define the application layer interfaces and services for Codex integration,
 * following the existing UX-Kit architecture patterns.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexApplicationUtils = exports.TemplateGenerationApplicationException = exports.CodexValidationApplicationException = exports.CodexInitializationException = exports.CodexApplicationException = void 0;
// ============================================================================
// Application Exceptions
// ============================================================================
/**
 * Base exception for application layer errors
 */
class CodexApplicationException extends Error {
    constructor(message, code, recoverable = false, originalError) {
        super(message);
        this.code = code;
        this.recoverable = recoverable;
        this.originalError = originalError;
        this.name = 'CodexApplicationException';
    }
}
exports.CodexApplicationException = CodexApplicationException;
/**
 * Exception thrown when initialization fails
 */
class CodexInitializationException extends CodexApplicationException {
    constructor(message, request, originalError) {
        super(message, 'CODEX_INITIALIZATION_FAILED', true, originalError);
        this.request = request;
        this.name = 'CodexInitializationException';
    }
}
exports.CodexInitializationException = CodexInitializationException;
/**
 * Exception thrown when validation fails
 */
class CodexValidationApplicationException extends CodexApplicationException {
    constructor(message, request, originalError) {
        super(message, 'CODEX_VALIDATION_APPLICATION_FAILED', true, originalError);
        this.request = request;
        this.name = 'CodexValidationApplicationException';
    }
}
exports.CodexValidationApplicationException = CodexValidationApplicationException;
/**
 * Exception thrown when template generation fails
 */
class TemplateGenerationApplicationException extends CodexApplicationException {
    constructor(message, request, originalError) {
        super(message, 'TEMPLATE_GENERATION_APPLICATION_FAILED', false, originalError);
        this.request = request;
        this.name = 'TemplateGenerationApplicationException';
    }
}
exports.TemplateGenerationApplicationException = TemplateGenerationApplicationException;
// ============================================================================
// Application Utilities
// ============================================================================
/**
 * Utility class for application layer operations
 */
class CodexApplicationUtils {
    /**
     * Create default Codex configuration
     */
    static createDefaultConfiguration() {
        return {
            enabled: true,
            validationEnabled: true,
            fallbackToCustom: true,
            templatePath: 'templates/codex-commands',
            timeout: 30000 // 30 seconds
        };
    }
    /**
     * Validate application configuration
     */
    static validateApplicationConfig(config) {
        return (config.validationTimeout > 0 &&
            config.templateGenerationTimeout > 0 &&
            config.maxRetryAttempts >= 0 &&
            config.retryDelay >= 0);
    }
    /**
     * Create error response
     */
    static createErrorResponse(error) {
        return {
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
                suggestions: error.suggestions,
                recoverable: error.recoverable,
                timestamp: error.timestamp
            }
        };
    }
    /**
     * Create success response
     */
    static createSuccessResponse(data) {
        return {
            success: true,
            data,
            timestamp: new Date()
        };
    }
}
exports.CodexApplicationUtils = CodexApplicationUtils;
//# sourceMappingURL=application-contracts.js.map