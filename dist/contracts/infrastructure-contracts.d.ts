/**
 * Infrastructure Contracts for Codex Support Integration
 *
 * These contracts define the infrastructure layer interfaces for Codex integration,
 * including file system operations, CLI interactions, and external service integrations.
 */
import { CodexConfiguration, CodexValidationResponse, CodexCommandTemplate, CodexError } from './domain-contracts';
/**
 * Interface for file system operations
 */
export interface IFileSystemService {
    /**
     * Check if file exists
     */
    fileExists(path: string): Promise<boolean>;
    /**
     * Check if directory exists
     */
    directoryExists(path: string): Promise<boolean>;
    /**
     * Create directory recursively
     */
    createDirectory(path: string): Promise<void>;
    /**
     * Read file content
     */
    readFile(path: string): Promise<string>;
    /**
     * Write file content
     */
    writeFile(path: string, content: string): Promise<void>;
    /**
     * List files in directory
     */
    listFiles(directory: string, pattern?: string): Promise<readonly string[]>;
    /**
     * Delete file
     */
    deleteFile(path: string): Promise<void>;
    /**
     * Get file stats
     */
    getFileStats(path: string): Promise<FileStats>;
    /**
     * Ensure a directory exists (create if it doesn't exist)
     */
    ensureDirectoryExists(path: string): Promise<void>;
    /**
     * Delete a directory
     */
    deleteDirectory(path: string, recursive?: boolean): Promise<void>;
    /**
     * Check if a path exists
     */
    pathExists(path: string): Promise<boolean>;
    /**
     * Check if a path is a directory
     */
    isDirectory(path: string): Promise<boolean>;
    /**
     * List directories in a directory
     */
    listDirectories(path: string): Promise<string[]>;
    /**
     * Join multiple path segments into a single path
     */
    joinPaths(...paths: string[]): string;
    /**
     * Extract the basename from a path
     */
    basename(path: string, ext?: string): string;
    /**
     * Extract the directory name from a path
     */
    dirname(path: string): string;
}
/**
 * File statistics information
 */
export interface FileStats {
    readonly size: number;
    readonly created: Date;
    readonly modified: Date;
    readonly isFile: boolean;
    readonly isDirectory: boolean;
    readonly permissions: string;
}
/**
 * Interface for executing CLI commands
 */
export interface ICLIExecutionService {
    /**
     * Execute command and return result
     */
    executeCommand(command: string, args: readonly string[], options?: CLIExecutionOptions): Promise<CLIExecutionResult>;
    /**
     * Check if command is available in PATH
     */
    isCommandAvailable(command: string): Promise<boolean>;
    /**
     * Get command version
     */
    getCommandVersion(command: string): Promise<string | null>;
    /**
     * Execute command with timeout
     */
    executeCommandWithTimeout(command: string, args: readonly string[], timeout: number): Promise<CLIExecutionResult>;
}
/**
 * Options for CLI command execution
 */
export interface CLIExecutionOptions {
    readonly workingDirectory?: string;
    readonly environment?: Record<string, string>;
    readonly timeout?: number;
    readonly captureOutput?: boolean;
    readonly captureError?: boolean;
}
/**
 * Result of CLI command execution
 */
export interface CLIExecutionResult {
    readonly exitCode: number;
    readonly stdout: string;
    readonly stderr: string;
    readonly executionTime: number;
    readonly success: boolean;
    readonly error?: string;
}
/**
 * Interface for Codex CLI interactions
 */
export interface ICodexCLIService {
    /**
     * Validate Codex CLI installation
     */
    validateInstallation(): Promise<CodexValidationResponse>;
    /**
     * Get Codex CLI version
     */
    getVersion(): Promise<string | null>;
    /**
     * Execute Codex command
     */
    executeCodexCommand(command: string, args: readonly string[]): Promise<CLIExecutionResult>;
    /**
     * Check if Codex CLI is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Get Codex CLI path
     */
    getCLIPath(): Promise<string | null>;
}
/**
 * Interface for template file operations
 */
export interface ITemplateFileService {
    /**
     * Generate template file
     */
    generateTemplateFile(template: CodexCommandTemplate, outputPath: string, format: TemplateFormat): Promise<void>;
    /**
     * Read template file
     */
    readTemplateFile(filePath: string): Promise<CodexCommandTemplate>;
    /**
     * Validate template file
     */
    validateTemplateFile(filePath: string): Promise<boolean>;
    /**
     * List template files
     */
    listTemplateFiles(directory: string): Promise<readonly string[]>;
    /**
     * Delete template file
     */
    deleteTemplateFile(filePath: string): Promise<void>;
}
/**
 * Template file formats
 */
export declare enum TemplateFormat {
    MARKDOWN = "markdown",
    JSON = "json",
    YAML = "yaml"
}
/**
 * Interface for configuration file operations
 */
export interface IConfigurationService {
    /**
     * Load configuration from file
     */
    loadConfiguration(filePath: string): Promise<CodexConfiguration>;
    /**
     * Save configuration to file
     */
    saveConfiguration(config: CodexConfiguration, filePath: string): Promise<void>;
    /**
     * Validate configuration
     */
    validateConfiguration(config: CodexConfiguration): Promise<boolean>;
    /**
     * Get default configuration
     */
    getDefaultConfiguration(): CodexConfiguration;
    /**
     * Merge configurations
     */
    mergeConfigurations(base: CodexConfiguration, override: Partial<CodexConfiguration>): CodexConfiguration;
}
/**
 * Interface for logging operations
 */
export interface ILoggingService {
    /**
     * Log debug message
     */
    debug(message: string, context?: any): void;
    /**
     * Log info message
     */
    info(message: string, context?: any): void;
    /**
     * Log warning message
     */
    warn(message: string, context?: any): void;
    /**
     * Log error message
     */
    error(message: string, error?: Error, context?: any): void;
    /**
     * Set log level
     */
    setLogLevel(level: LogLevel): void;
    /**
     * Enable/disable logging
     */
    setEnabled(enabled: boolean): void;
}
/**
 * Log levels
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
/**
 * Interface for validation operations
 */
export interface IValidationService {
    /**
     * Validate file path
     */
    validateFilePath(path: string): Promise<boolean>;
    /**
     * Validate directory path
     */
    validateDirectoryPath(path: string): Promise<boolean>;
    /**
     * Validate command template
     */
    validateCommandTemplate(template: CodexCommandTemplate): Promise<boolean>;
    /**
     * Validate configuration
     */
    validateConfiguration(config: CodexConfiguration): Promise<boolean>;
    /**
     * Validate CLI command
     */
    validateCLICommand(command: string): Promise<boolean>;
}
/**
 * Interface for error handling operations
 */
export interface IErrorHandlingService {
    /**
     * Handle file system errors
     */
    handleFileSystemError(error: Error, operation: string): CodexError;
    /**
     * Handle CLI execution errors
     */
    handleCLIExecutionError(error: Error, command: string): CodexError;
    /**
     * Handle validation errors
     */
    handleValidationError(error: Error, context: string): CodexError;
    /**
     * Handle configuration errors
     */
    handleConfigurationError(error: Error, config: any): CodexError;
    /**
     * Create user-friendly error message
     */
    createUserFriendlyError(error: CodexError): string;
}
/**
 * Interface for external service integrations
 */
export interface IExternalServiceIntegration {
    /**
     * Check service availability
     */
    isServiceAvailable(): Promise<boolean>;
    /**
     * Get service status
     */
    getServiceStatus(): Promise<ServiceStatus>;
    /**
     * Execute service request
     */
    executeRequest(request: ServiceRequest): Promise<ServiceResponse>;
    /**
     * Handle service errors
     */
    handleServiceError(error: Error): Promise<ServiceError>;
}
/**
 * Service status information
 */
export interface ServiceStatus {
    readonly available: boolean;
    readonly version?: string;
    readonly lastChecked: Date;
    readonly error?: string;
}
/**
 * Service request structure
 */
export interface ServiceRequest {
    readonly endpoint: string;
    readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    readonly headers?: Record<string, string>;
    readonly body?: any;
    readonly timeout?: number;
}
/**
 * Service response structure
 */
export interface ServiceResponse {
    readonly statusCode: number;
    readonly headers: Record<string, string>;
    readonly body: any;
    readonly success: boolean;
    readonly error?: string;
}
/**
 * Service error structure
 */
export interface ServiceError {
    readonly code: string;
    readonly message: string;
    readonly statusCode?: number;
    readonly recoverable: boolean;
    readonly timestamp: Date;
}
/**
 * Base exception for infrastructure layer errors
 */
export declare class CodexInfrastructureException extends Error {
    readonly code: string;
    readonly recoverable: boolean;
    readonly originalError?: Error | undefined;
    constructor(message: string, code: string, recoverable?: boolean, originalError?: Error | undefined);
}
/**
 * Exception thrown when file system operations fail
 */
export declare class CodexFileSystemException extends CodexInfrastructureException {
    readonly filePath: string;
    readonly operation: string;
    constructor(message: string, filePath: string, operation: string, originalError?: Error);
}
/**
 * Exception thrown when CLI execution fails
 */
export declare class CodexCLIExecutionException extends CodexInfrastructureException {
    readonly command: string;
    readonly result: CLIExecutionResult;
    constructor(message: string, command: string, result: CLIExecutionResult, originalError?: Error);
}
/**
 * Exception thrown when external service integration fails
 */
export declare class CodexExternalServiceException extends CodexInfrastructureException {
    readonly service: string;
    readonly request: ServiceRequest;
    constructor(message: string, service: string, request: ServiceRequest, originalError?: Error);
}
/**
 * Utility class for infrastructure operations
 */
export declare class CodexInfrastructureUtils {
    /**
     * Create default CLI execution options
     */
    static createDefaultCLIOptions(): CLIExecutionOptions;
    /**
     * Validate file path format
     */
    static isValidFilePath(path: string): boolean;
    /**
     * Validate directory path format
     */
    static isValidDirectoryPath(path: string): boolean;
    /**
     * Create error from CLI execution result
     */
    static createErrorFromCLIResult(result: CLIExecutionResult, command: string): CodexError;
}
