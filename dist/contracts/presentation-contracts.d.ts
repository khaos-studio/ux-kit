/**
 * Presentation Contracts for Codex Support Integration
 *
 * These contracts define the presentation layer interfaces for Codex integration,
 * including CLI commands, user interfaces, and output formatting.
 */
import { CodexConfiguration, CodexValidationResponse, CodexCommandTemplate, CodexStatus, CodexError } from './domain-contracts';
/**
 * Interface for logging operations
 */
export interface ILogger {
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
}
/**
 * Validation error information
 */
export interface ValidationError {
    readonly field: string;
    readonly message: string;
    readonly value: any;
}
/**
 * Interface for Cursor IDE integration
 */
export interface ICursorIntegration {
    /**
     * Check if Cursor is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Get Cursor version
     */
    getVersion(): Promise<string | null>;
    /**
     * Execute slash command
     */
    executeSlashCommand(name: string, args: string[]): Promise<void>;
    /**
     * Get current cursor position
     */
    getCursorPosition(): Promise<CursorPosition | null>;
    /**
     * Show notification
     */
    showNotification(message: string, type: NotificationType): Promise<void>;
}
/**
 * Slash command interface
 */
export interface ISlashCommand {
    readonly name: string;
    readonly description: string;
    readonly parameters: readonly string[];
    readonly examples?: readonly string[];
    readonly execute: (params: Record<string, any>) => Promise<void>;
}
/**
 * Cursor position information
 */
export interface CursorPosition {
    readonly line: number;
    readonly character: number;
    readonly file: string;
}
/**
 * Notification types
 */
export declare enum NotificationType {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error"
}
/**
 * Interface for output operations
 */
export interface IOutput {
    /**
     * Write a line to output
     */
    writeln(message: string): void;
    /**
     * Write text to output without newline
     */
    write(message: string): void;
    /**
     * Write error message to output
     */
    writeErrorln(message: string): void;
}
/**
 * Interface for command execution
 */
export interface ICommand {
    /**
     * Command name
     */
    readonly name: string;
    /**
     * Command description
     */
    readonly description: string;
    /**
     * Command usage
     */
    readonly usage: string;
    /**
     * Command arguments
     */
    readonly arguments: Array<{
        name: string;
        description: string;
        required: boolean;
        type: 'string' | 'number' | 'boolean';
    }>;
    /**
     * Command options
     */
    readonly options: readonly any[];
    /**
     * Command examples
     */
    readonly examples: readonly any[];
    /**
     * Execute command
     */
    execute(args: string[], options: Record<string, any>): Promise<CommandResult>;
    /**
     * Validate command arguments
     */
    validate(args: string[], options: Record<string, any>): Promise<ValidationResult>;
    /**
     * Show help information
     */
    showHelp(): void;
}
/**
 * Result of command execution
 */
export interface CommandResult {
    /**
     * Whether the command executed successfully
     */
    success: boolean;
    /**
     * Result message
     */
    message: string;
    /**
     * Additional data
     */
    data?: any;
    /**
     * Error messages if any
     */
    errors?: string[];
}
/**
 * Result of command validation
 */
export interface ValidationResult {
    /**
     * Whether validation passed
     */
    valid: boolean;
    /**
     * Validation errors
     */
    errors: Array<{
        field: string;
        message: string;
        value: any;
    }>;
}
/**
 * Interface for CLI command execution
 */
export interface ICLICommand {
    /**
     * Command name
     */
    readonly name: string;
    /**
     * Command description
     */
    readonly description: string;
    /**
     * Command usage
     */
    readonly usage: string;
    /**
     * Command options
     */
    readonly options: readonly CLICommandOption[];
    /**
     * Execute command
     */
    execute(args: readonly string[], options: Record<string, any>): Promise<CLICommandResult>;
    /**
     * Validate command arguments
     */
    validate(args: readonly string[], options: Record<string, any>): Promise<boolean>;
    /**
     * Get command help
     */
    getHelp(): string;
}
/**
 * CLI command option definition
 */
export interface CLICommandOption {
    readonly name: string;
    readonly shortName?: string;
    readonly description: string;
    readonly type: 'string' | 'boolean' | 'number' | 'array';
    readonly required: boolean;
    readonly defaultValue?: any;
    readonly choices?: readonly string[];
}
/**
 * CLI command execution result
 */
export interface CLICommandResult {
    readonly success: boolean;
    readonly message: string;
    readonly data?: any;
    readonly error?: CodexError;
    readonly exitCode: number;
}
/**
 * Interface for user interface operations
 */
export interface IUserInterface {
    /**
     * Display message to user
     */
    displayMessage(message: string, type?: MessageType): void;
    /**
     * Display error to user
     */
    displayError(error: CodexError): void;
    /**
     * Display progress indicator
     */
    displayProgress(message: string, progress: number): void;
    /**
     * Display confirmation prompt
     */
    displayConfirmation(message: string): Promise<boolean>;
    /**
     * Display selection prompt
     */
    displaySelection(message: string, choices: readonly string[]): Promise<string>;
    /**
     * Display input prompt
     */
    displayInput(message: string, defaultValue?: string): Promise<string>;
    /**
     * Clear screen
     */
    clearScreen(): void;
    /**
     * Display help information
     */
    displayHelp(helpText: string): void;
}
/**
 * Message types for user interface
 */
export declare enum MessageType {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error",
    DEBUG = "debug"
}
/**
 * Interface for output formatting
 */
export interface IOutputFormatter {
    /**
     * Format validation response
     */
    formatValidationResponse(response: CodexValidationResponse): string;
    /**
     * Format status information
     */
    formatStatus(status: CodexStatus): string;
    /**
     * Format command templates
     */
    formatCommandTemplates(templates: readonly CodexCommandTemplate[]): string;
    /**
     * Format error information
     */
    formatError(error: CodexError): string;
    /**
     * Format configuration
     */
    formatConfiguration(config: CodexConfiguration): string;
    /**
     * Format help text
     */
    formatHelp(helpText: string): string;
}
/**
 * Output format types
 */
export declare enum OutputFormat {
    TEXT = "text",
    JSON = "json",
    YAML = "yaml",
    TABLE = "table",
    MARKDOWN = "markdown"
}
/**
 * Interface for interactive prompts
 */
export interface IInteractivePrompt {
    /**
     * Display AI agent selection prompt
     */
    displayAIAgentSelection(): Promise<string>;
    /**
     * Display Codex configuration prompt
     */
    displayCodexConfigurationPrompt(): Promise<Partial<CodexConfiguration>>;
    /**
     * Display validation confirmation prompt
     */
    displayValidationConfirmation(): Promise<boolean>;
    /**
     * Display template generation confirmation
     */
    displayTemplateGenerationConfirmation(): Promise<boolean>;
    /**
     * Display error resolution prompt
     */
    displayErrorResolutionPrompt(error: CodexError): Promise<string>;
}
/**
 * Interface for progress reporting
 */
export interface IProgressReporter {
    /**
     * Start progress reporting
     */
    startProgress(message: string): void;
    /**
     * Update progress
     */
    updateProgress(progress: number, message?: string): void;
    /**
     * Complete progress
     */
    completeProgress(message?: string): void;
    /**
     * Report error
     */
    reportError(error: CodexError): void;
    /**
     * Stop progress reporting
     */
    stopProgress(): void;
}
/**
 * Interface for command line interface operations
 */
export interface ICommandLineInterface {
    /**
     * Parse command line arguments
     */
    parseArguments(args: readonly string[]): ParsedArguments;
    /**
     * Display command help
     */
    displayHelp(command: string): void;
    /**
     * Display version information
     */
    displayVersion(): void;
    /**
     * Execute command
     */
    executeCommand(command: string, args: readonly string[]): Promise<void>;
    /**
     * Register command
     */
    registerCommand(command: ICLICommand): void;
    /**
     * Get available commands
     */
    getAvailableCommands(): readonly string[];
}
/**
 * Parsed command line arguments
 */
export interface ParsedArguments {
    readonly command: string;
    readonly args: readonly string[];
    readonly options: Record<string, any>;
    readonly valid: boolean;
    readonly errors: readonly string[];
}
/**
 * Interface for display operations
 */
export interface IDisplayService {
    /**
     * Display table
     */
    displayTable(data: readonly any[], columns: readonly string[]): void;
    /**
     * Display list
     */
    displayList(items: readonly string[], title?: string): void;
    /**
     * Display code block
     */
    displayCodeBlock(code: string, language?: string): void;
    /**
     * Display JSON
     */
    displayJSON(data: any): void;
    /**
     * Display YAML
     */
    displayYAML(data: any): void;
    /**
     * Display markdown
     */
    displayMarkdown(markdown: string): void;
}
/**
 * Interface for theme and styling
 */
export interface IThemeService {
    /**
     * Get theme colors
     */
    getColors(): ThemeColors;
    /**
     * Apply theme to text
     */
    applyTheme(text: string, style: TextStyle): string;
    /**
     * Get styled message
     */
    getStyledMessage(message: string, type: MessageType): string;
    /**
     * Get styled error
     */
    getStyledError(error: CodexError): string;
    /**
     * Get styled success
     */
    getStyledSuccess(message: string): string;
}
/**
 * Theme colors
 */
export interface ThemeColors {
    readonly primary: string;
    readonly secondary: string;
    readonly success: string;
    readonly warning: string;
    readonly error: string;
    readonly info: string;
    readonly background: string;
    readonly foreground: string;
}
/**
 * Text styles
 */
export declare enum TextStyle {
    BOLD = "bold",
    ITALIC = "italic",
    UNDERLINE = "underline",
    STRIKETHROUGH = "strikethrough",
    DIM = "dim",
    INVERSE = "inverse"
}
/**
 * Base exception for presentation layer errors
 */
export declare class CodexPresentationException extends Error {
    readonly code: string;
    readonly recoverable: boolean;
    readonly originalError?: Error | undefined;
    constructor(message: string, code: string, recoverable?: boolean, originalError?: Error | undefined);
}
/**
 * Exception thrown when CLI command execution fails
 */
export declare class CodexCLICommandException extends CodexPresentationException {
    readonly command: string;
    readonly args: readonly string[];
    constructor(message: string, command: string, args: readonly string[], originalError?: Error);
}
/**
 * Exception thrown when user interface operations fail
 */
export declare class CodexUserInterfaceException extends CodexPresentationException {
    readonly operation: string;
    constructor(message: string, operation: string, originalError?: Error);
}
/**
 * Exception thrown when output formatting fails
 */
export declare class CodexOutputFormattingException extends CodexPresentationException {
    readonly format: OutputFormat;
    readonly data: any;
    constructor(message: string, format: OutputFormat, data: any, originalError?: Error);
}
/**
 * Utility class for presentation operations
 */
export declare class CodexPresentationUtils {
    /**
     * Create default CLI command options
     */
    static createDefaultCLIOptions(): readonly CLICommandOption[];
    /**
     * Format validation response for display
     */
    static formatValidationResponse(response: CodexValidationResponse): string;
    /**
     * Format status for display
     */
    static formatStatus(status: CodexStatus): string;
    /**
     * Create user-friendly error message
     */
    static createUserFriendlyError(error: CodexError): string;
}
