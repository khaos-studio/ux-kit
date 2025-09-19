/**
 * Presentation Contracts for Codex Support Integration
 * 
 * These contracts define the presentation layer interfaces for Codex integration,
 * including CLI commands, user interfaces, and output formatting.
 */

import {
  CodexConfiguration,
  CodexValidationResponse,
  CodexCommandTemplate,
  CodexStatus,
  CodexError
} from './domain-contracts';

// ============================================================================
// Output Contracts
// ============================================================================

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

// ============================================================================
// CLI Command Contracts
// ============================================================================

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
  readonly arguments: readonly string[];
  
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
  errors: Array<{ field: string; message: string; value: any }>;
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

// ============================================================================
// User Interface Contracts
// ============================================================================

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
export enum MessageType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DEBUG = 'debug'
}

// ============================================================================
// Output Formatting Contracts
// ============================================================================

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
export enum OutputFormat {
  TEXT = 'text',
  JSON = 'json',
  YAML = 'yaml',
  TABLE = 'table',
  MARKDOWN = 'markdown'
}

// ============================================================================
// Interactive Prompts Contracts
// ============================================================================

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

// ============================================================================
// Progress Reporting Contracts
// ============================================================================

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

// ============================================================================
// Command Line Interface Contracts
// ============================================================================

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

// ============================================================================
// Display Contracts
// ============================================================================

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

// ============================================================================
// Theme and Styling Contracts
// ============================================================================

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
export enum TextStyle {
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  STRIKETHROUGH = 'strikethrough',
  DIM = 'dim',
  INVERSE = 'inverse'
}

// ============================================================================
// Presentation Exceptions
// ============================================================================

/**
 * Base exception for presentation layer errors
 */
export class CodexPresentationException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly recoverable: boolean = false,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'CodexPresentationException';
  }
}

/**
 * Exception thrown when CLI command execution fails
 */
export class CodexCLICommandException extends CodexPresentationException {
  constructor(
    message: string,
    public readonly command: string,
    public readonly args: readonly string[],
    originalError?: Error
  ) {
    super(message, 'CODEX_CLI_COMMAND_ERROR', true, originalError);
    this.name = 'CodexCLICommandException';
  }
}

/**
 * Exception thrown when user interface operations fail
 */
export class CodexUserInterfaceException extends CodexPresentationException {
  constructor(
    message: string,
    public readonly operation: string,
    originalError?: Error
  ) {
    super(message, 'CODEX_USER_INTERFACE_ERROR', true, originalError);
    this.name = 'CodexUserInterfaceException';
  }
}

/**
 * Exception thrown when output formatting fails
 */
export class CodexOutputFormattingException extends CodexPresentationException {
  constructor(
    message: string,
    public readonly format: OutputFormat,
    public readonly data: any,
    originalError?: Error
  ) {
    super(message, 'CODEX_OUTPUT_FORMATTING_ERROR', false, originalError);
    this.name = 'CodexOutputFormattingException';
  }
}

// ============================================================================
// Presentation Utilities
// ============================================================================

/**
 * Utility class for presentation operations
 */
export class CodexPresentationUtils {
  /**
   * Create default CLI command options
   */
  static createDefaultCLIOptions(): readonly CLICommandOption[] {
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
  static formatValidationResponse(response: CodexValidationResponse): string {
    const status = response.result === 'success' ? '✓' : '✗';
    const message = response.result === 'success' 
      ? `Codex CLI validation successful (${response.version})`
      : `Codex CLI validation failed: ${response.errorMessage}`;
    
    return `${status} ${message}`;
  }
  
  /**
   * Format status for display
   */
  static formatStatus(status: CodexStatus): string {
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
  static createUserFriendlyError(error: CodexError): string {
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