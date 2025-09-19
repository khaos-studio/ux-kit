"use strict";
/**
 * Presentation Contracts for Codex Support Integration
 *
 * These contracts define the presentation layer interfaces for Codex integration,
 * including CLI commands, user interfaces, and output formatting.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexPresentationUtils = exports.CodexOutputFormattingException = exports.CodexUserInterfaceException = exports.CodexCLICommandException = exports.CodexPresentationException = exports.TextStyle = exports.OutputFormat = exports.MessageType = exports.NotificationType = void 0;
/**
 * Notification types
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["INFO"] = "info";
    NotificationType["SUCCESS"] = "success";
    NotificationType["WARNING"] = "warning";
    NotificationType["ERROR"] = "error";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
/**
 * Message types for user interface
 */
var MessageType;
(function (MessageType) {
    MessageType["INFO"] = "info";
    MessageType["SUCCESS"] = "success";
    MessageType["WARNING"] = "warning";
    MessageType["ERROR"] = "error";
    MessageType["DEBUG"] = "debug";
})(MessageType || (exports.MessageType = MessageType = {}));
/**
 * Output format types
 */
var OutputFormat;
(function (OutputFormat) {
    OutputFormat["TEXT"] = "text";
    OutputFormat["JSON"] = "json";
    OutputFormat["YAML"] = "yaml";
    OutputFormat["TABLE"] = "table";
    OutputFormat["MARKDOWN"] = "markdown";
})(OutputFormat || (exports.OutputFormat = OutputFormat = {}));
/**
 * Text styles
 */
var TextStyle;
(function (TextStyle) {
    TextStyle["BOLD"] = "bold";
    TextStyle["ITALIC"] = "italic";
    TextStyle["UNDERLINE"] = "underline";
    TextStyle["STRIKETHROUGH"] = "strikethrough";
    TextStyle["DIM"] = "dim";
    TextStyle["INVERSE"] = "inverse";
})(TextStyle || (exports.TextStyle = TextStyle = {}));
// ============================================================================
// Presentation Exceptions
// ============================================================================
/**
 * Base exception for presentation layer errors
 */
class CodexPresentationException extends Error {
    constructor(message, code, recoverable = false, originalError) {
        super(message);
        this.code = code;
        this.recoverable = recoverable;
        this.originalError = originalError;
        this.name = 'CodexPresentationException';
    }
}
exports.CodexPresentationException = CodexPresentationException;
/**
 * Exception thrown when CLI command execution fails
 */
class CodexCLICommandException extends CodexPresentationException {
    constructor(message, command, args, originalError) {
        super(message, 'CODEX_CLI_COMMAND_ERROR', true, originalError);
        this.command = command;
        this.args = args;
        this.name = 'CodexCLICommandException';
    }
}
exports.CodexCLICommandException = CodexCLICommandException;
/**
 * Exception thrown when user interface operations fail
 */
class CodexUserInterfaceException extends CodexPresentationException {
    constructor(message, operation, originalError) {
        super(message, 'CODEX_USER_INTERFACE_ERROR', true, originalError);
        this.operation = operation;
        this.name = 'CodexUserInterfaceException';
    }
}
exports.CodexUserInterfaceException = CodexUserInterfaceException;
/**
 * Exception thrown when output formatting fails
 */
class CodexOutputFormattingException extends CodexPresentationException {
    constructor(message, format, data, originalError) {
        super(message, 'CODEX_OUTPUT_FORMATTING_ERROR', false, originalError);
        this.format = format;
        this.data = data;
        this.name = 'CodexOutputFormattingException';
    }
}
exports.CodexOutputFormattingException = CodexOutputFormattingException;
// ============================================================================
// Presentation Utilities
// ============================================================================
/**
 * Utility class for presentation operations
 */
class CodexPresentationUtils {
    /**
     * Create default CLI command options
     */
    static createDefaultCLIOptions() {
        return [
            {
                name: 'help',
                shortName: 'h',
                description: 'Display help information',
                type: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'verbose',
                shortName: 'v',
                description: 'Enable verbose output',
                type: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'output',
                shortName: 'o',
                description: 'Output format',
                type: 'string',
                required: false,
                defaultValue: 'text',
                choices: ['text', 'json', 'yaml', 'table', 'markdown']
            }
        ];
    }
    /**
     * Format validation response for display
     */
    static formatValidationResponse(response) {
        const status = response.result === 'success' ? '✓' : '✗';
        const message = response.result === 'success'
            ? `Codex CLI validation successful (${response.version})`
            : `Codex CLI validation failed: ${response.errorMessage}`;
        return `${status} ${message}`;
    }
    /**
     * Format status for display
     */
    static formatStatus(status) {
        const lines = [
            `Status: ${status.status}`,
            `Initialized: ${status.isInitialized ? 'Yes' : 'No'}`,
            `Configured: ${status.isConfigured ? 'Yes' : 'No'}`,
            `CLI Available: ${status.cliAvailable ? 'Yes' : 'No'}`,
            `Templates Generated: ${status.templatesGenerated ? 'Yes' : 'No'}`,
            `Error Count: ${status.errorCount}`
        ];
        if (status.lastValidation) {
            lines.push(`Last Validation: ${status.lastValidation.toISOString()}`);
        }
        return lines.join('\n');
    }
    /**
     * Create user-friendly error message
     */
    static createUserFriendlyError(error) {
        let message = `Error: ${error.message}`;
        if (error.suggestions && error.suggestions.length > 0) {
            message += '\n\nSuggestions:';
            error.suggestions.forEach(suggestion => {
                message += `\n  • ${suggestion}`;
            });
        }
        if (error.recoverable) {
            message += '\n\nThis error is recoverable. You can try again or use alternative options.';
        }
        return message;
    }
}
exports.CodexPresentationUtils = CodexPresentationUtils;
//# sourceMappingURL=presentation-contracts.js.map