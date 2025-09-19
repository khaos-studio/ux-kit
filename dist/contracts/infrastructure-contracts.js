"use strict";
/**
 * Infrastructure Contracts for Codex Support Integration
 *
 * These contracts define the infrastructure layer interfaces for Codex integration,
 * including file system operations, CLI interactions, and external service integrations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexInfrastructureUtils = exports.CodexExternalServiceException = exports.CodexCLIExecutionException = exports.CodexFileSystemException = exports.CodexInfrastructureException = exports.LogLevel = exports.TemplateFormat = void 0;
/**
 * Template file formats
 */
var TemplateFormat;
(function (TemplateFormat) {
    TemplateFormat["MARKDOWN"] = "markdown";
    TemplateFormat["JSON"] = "json";
    TemplateFormat["YAML"] = "yaml";
})(TemplateFormat || (exports.TemplateFormat = TemplateFormat = {}));
/**
 * Log levels
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// ============================================================================
// Infrastructure Exceptions
// ============================================================================
/**
 * Base exception for infrastructure layer errors
 */
class CodexInfrastructureException extends Error {
    constructor(message, code, recoverable = false, originalError) {
        super(message);
        this.code = code;
        this.recoverable = recoverable;
        this.originalError = originalError;
        this.name = 'CodexInfrastructureException';
    }
}
exports.CodexInfrastructureException = CodexInfrastructureException;
/**
 * Exception thrown when file system operations fail
 */
class CodexFileSystemException extends CodexInfrastructureException {
    constructor(message, filePath, operation, originalError) {
        super(message, 'CODEX_FILESYSTEM_ERROR', true, originalError);
        this.filePath = filePath;
        this.operation = operation;
        this.name = 'CodexFileSystemException';
    }
}
exports.CodexFileSystemException = CodexFileSystemException;
/**
 * Exception thrown when CLI execution fails
 */
class CodexCLIExecutionException extends CodexInfrastructureException {
    constructor(message, command, result, originalError) {
        super(message, 'CODEX_CLI_EXECUTION_ERROR', true, originalError);
        this.command = command;
        this.result = result;
        this.name = 'CodexCLIExecutionException';
    }
}
exports.CodexCLIExecutionException = CodexCLIExecutionException;
/**
 * Exception thrown when external service integration fails
 */
class CodexExternalServiceException extends CodexInfrastructureException {
    constructor(message, service, request, originalError) {
        super(message, 'CODEX_EXTERNAL_SERVICE_ERROR', true, originalError);
        this.service = service;
        this.request = request;
        this.name = 'CodexExternalServiceException';
    }
}
exports.CodexExternalServiceException = CodexExternalServiceException;
// ============================================================================
// Infrastructure Utilities
// ============================================================================
/**
 * Utility class for infrastructure operations
 */
class CodexInfrastructureUtils {
    /**
     * Create default CLI execution options
     */
    static createDefaultCLIOptions() {
        return {
            timeout: 30000, // 30 seconds
            captureOutput: true,
            captureError: true
        };
    }
    /**
     * Validate file path format
     */
    static isValidFilePath(path) {
        return path.length > 0 && !path.includes('\0');
    }
    /**
     * Validate directory path format
     */
    static isValidDirectoryPath(path) {
        return path.length > 0 && !path.includes('\0');
    }
    /**
     * Create error from CLI execution result
     */
    static createErrorFromCLIResult(result, command) {
        return {
            code: 'CLI_EXECUTION_FAILED',
            message: `Command '${command}' failed with exit code ${result.exitCode}`,
            details: {
                exitCode: result.exitCode,
                stdout: result.stdout,
                stderr: result.stderr,
                executionTime: result.executionTime
            },
            suggestions: [
                'Check if the command is installed and available in PATH',
                'Verify command syntax and arguments',
                'Check file permissions and access rights'
            ],
            recoverable: true,
            timestamp: new Date()
        };
    }
}
exports.CodexInfrastructureUtils = CodexInfrastructureUtils;
//# sourceMappingURL=infrastructure-contracts.js.map