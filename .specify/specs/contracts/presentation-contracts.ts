/**
 * Presentation Layer Contracts
 * 
 * This file defines the presentation layer interfaces and types for the UX-Kit TypeScript CLI.
 * The presentation layer handles user interface, command parsing, output formatting, and
 * IDE integration, following clean architecture principles.
 * 
 * The presentation layer is inspired by GitHub's spec-kit approach for structured workflows.
 */

import { CommandResult } from './application-contracts';

// ============================================================================
// CLI Application Interfaces
// ============================================================================

/**
 * CLI application interface
 */
export interface ICLIApplication {
  readonly name: string;
  readonly version: string;
  readonly description: string;
  
  registerCommand(command: ICommand): void;
  unregisterCommand(name: string): void;
  getCommand(name: string): ICommand | null;
  listCommands(): ICommand[];
  
  execute(args: string[]): Promise<void>;
  showHelp(): void;
  showVersion(): void;
  
  setOutput(output: IOutput): void;
  setErrorOutput(errorOutput: IOutput): void;
  setLogger(logger: ILogger): void;
}

/**
 * Command interface
 */
export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly usage: string;
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  readonly examples: CommandExample[];
  
  execute(args: string[], options: Record<string, any>): Promise<CommandResult>;
  validate(args: string[], options: Record<string, any>): Promise<ValidationResult>;
  showHelp(): void;
}

/**
 * Command argument definition
 */
export interface CommandArgument {
  readonly name: string;
  readonly description: string;
  readonly required: boolean;
  readonly type: 'string' | 'number' | 'boolean' | 'array';
  readonly defaultValue?: any;
  readonly validator?: ArgumentValidator;
}

/**
 * Command option definition
 */
export interface CommandOption {
  readonly name: string;
  readonly description: string;
  readonly type: 'string' | 'number' | 'boolean' | 'array';
  readonly required: boolean;
  readonly defaultValue?: any;
  readonly aliases?: string[];
  readonly validator?: OptionValidator;
}

/**
 * Command example
 */
export interface CommandExample {
  readonly description: string;
  readonly command: string;
  readonly explanation?: string;
}

/**
 * Argument validator
 */
export interface ArgumentValidator {
  validate(value: any): Promise<boolean>;
  getErrorMessage(value: any): string;
}

/**
 * Option validator
 */
export interface OptionValidator {
  validate(value: any): Promise<boolean>;
  getErrorMessage(value: any): string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: ValidationError[];
}

/**
 * Validation error
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly value: any;
}

// ============================================================================
// Output Interfaces
// ============================================================================

/**
 * Output interface
 */
export interface IOutput {
  write(text: string): void;
  writeln(text: string): void;
  writeError(text: string): void;
  writeErrorln(text: string): void;
  clear(): void;
  flush(): void;
}

/**
 * Console output implementation
 */
export interface IConsoleOutput extends IOutput {
  readonly name: 'console';
  readonly colors: boolean;
  readonly timestamps: boolean;
  
  write(text: string): void;
  writeln(text: string): void;
  writeError(text: string): void;
  writeErrorln(text: string): void;
  clear(): void;
  flush(): void;
}

/**
 * File output implementation
 */
export interface IFileOutput extends IOutput {
  readonly name: 'file';
  readonly filePath: string;
  readonly append: boolean;
  
  write(text: string): void;
  writeln(text: string): void;
  writeError(text: string): void;
  writeErrorln(text: string): void;
  clear(): void;
  flush(): void;
}

// ============================================================================
// Formatter Interfaces
// ============================================================================

/**
 * Formatter interface
 */
export interface IFormatter {
  format(data: any, options?: FormatOptions): string;
  formatTable(data: any[], options?: TableFormatOptions): string;
  formatList(items: any[], options?: ListFormatOptions): string;
  formatJson(data: any, options?: JsonFormatOptions): string;
  formatYaml(data: any, options?: YamlFormatOptions): string;
  formatMarkdown(data: any, options?: MarkdownFormatOptions): string;
}

/**
 * Format options
 */
export interface FormatOptions {
  readonly indent?: number;
  readonly colors?: boolean;
  readonly maxWidth?: number;
  readonly truncate?: boolean;
}

/**
 * Table format options
 */
export interface TableFormatOptions extends FormatOptions {
  readonly headers?: string[];
  readonly align?: 'left' | 'center' | 'right';
  readonly border?: boolean;
  readonly padding?: number;
}

/**
 * List format options
 */
export interface ListFormatOptions extends FormatOptions {
  readonly style?: 'bullet' | 'numbered' | 'dash';
  readonly indent?: number;
  readonly separator?: string;
}

/**
 * JSON format options
 */
export interface JsonFormatOptions extends FormatOptions {
  readonly pretty?: boolean;
  readonly sortKeys?: boolean;
  readonly replacer?: (key: string, value: any) => any;
}

/**
 * YAML format options
 */
export interface YamlFormatOptions extends FormatOptions {
  readonly indent?: number;
  readonly lineWidth?: number;
  readonly noRefs?: boolean;
  readonly sortKeys?: boolean;
}

/**
 * Markdown format options
 */
export interface MarkdownFormatOptions extends FormatOptions {
  readonly level?: number;
  readonly includeToc?: boolean;
  readonly codeBlocks?: boolean;
  readonly tables?: boolean;
}

// ============================================================================
// Progress Interfaces
// ============================================================================

/**
 * Progress indicator interface
 */
export interface IProgressIndicator {
  start(total: number, message?: string): void;
  update(current: number, message?: string): void;
  increment(message?: string): void;
  finish(message?: string): void;
  stop(): void;
  isRunning(): boolean;
}

/**
 * Spinner progress indicator
 */
export interface ISpinnerProgressIndicator extends IProgressIndicator {
  readonly name: 'spinner';
  readonly spinner: string;
  readonly interval: number;
  
  start(total: number, message?: string): void;
  update(current: number, message?: string): void;
  increment(message?: string): void;
  finish(message?: string): void;
  stop(): void;
  isRunning(): boolean;
}

/**
 * Bar progress indicator
 */
export interface IBarProgressIndicator extends IProgressIndicator {
  readonly name: 'bar';
  readonly width: number;
  readonly character: string;
  readonly emptyCharacter: string;
  
  start(total: number, message?: string): void;
  update(current: number, message?: string): void;
  increment(message?: string): void;
  finish(message?: string): void;
  stop(): void;
  isRunning(): boolean;
}

// ============================================================================
// Logger Interfaces
// ============================================================================

/**
 * Logger interface
 */
export interface ILogger {
  debug(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, context?: Record<string, any>): void;
  fatal(message: string, context?: Record<string, any>): void;
  
  setLevel(level: LogLevel): void;
  getLevel(): LogLevel;
  isEnabled(level: LogLevel): boolean;
}

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

// ============================================================================
// IDE Integration Interfaces
// ============================================================================

/**
 * IDE integration interface
 */
export interface IIDEIntegration {
  readonly name: string;
  readonly version: string;
  readonly supportedCommands: string[];
  
  registerSlashCommand(command: ISlashCommand): void;
  unregisterSlashCommand(name: string): void;
  getSlashCommand(name: string): ISlashCommand | null;
  listSlashCommands(): ISlashCommand[];
  
  executeSlashCommand(name: string, args: string[]): Promise<void>;
  showSlashCommandHelp(name: string): void;
  showAllSlashCommands(): void;
}

/**
 * Slash command interface
 */
export interface ISlashCommand {
  readonly name: string;
  readonly description: string;
  readonly usage: string;
  readonly examples: SlashCommandExample[];
  
  execute(args: string[], context: IDEContext): Promise<void>;
  validate(args: string[]): Promise<ValidationResult>;
  showHelp(): void;
}

/**
 * Slash command example
 */
export interface SlashCommandExample {
  readonly description: string;
  readonly command: string;
  readonly explanation?: string;
}

/**
 * IDE context
 */
export interface IDEContext {
  readonly workspace: string;
  readonly currentFile?: string;
  readonly selection?: string;
  readonly cursor?: CursorPosition;
  readonly project?: ProjectInfo;
}

/**
 * Cursor position
 */
export interface CursorPosition {
  readonly line: number;
  readonly column: number;
  readonly offset: number;
}

/**
 * Project information
 */
export interface ProjectInfo {
  readonly name: string;
  readonly path: string;
  readonly type: string;
  readonly version?: string;
  readonly dependencies?: Record<string, string>;
}

// ============================================================================
// Cursor IDE Integration
// ============================================================================

/**
 * Cursor IDE integration
 */
export interface ICursorIntegration extends IIDEIntegration {
  readonly name: 'cursor';
  readonly version: string;
  readonly supportedCommands: string[];
  
  registerSlashCommand(command: ISlashCommand): void;
  unregisterSlashCommand(name: string): void;
  getSlashCommand(name: string): ISlashCommand | null;
  listSlashCommands(): ISlashCommand[];
  
  executeSlashCommand(name: string, args: string[]): Promise<void>;
  showSlashCommandHelp(name: string): void;
  showAllSlashCommands(): void;
  
  // Cursor-specific methods
  getCurrentWorkspace(): Promise<string>;
  getCurrentFile(): Promise<string | null>;
  getSelection(): Promise<string | null>;
  getCursorPosition(): Promise<CursorPosition | null>;
  insertText(text: string, position?: CursorPosition): Promise<void>;
  replaceSelection(text: string): Promise<void>;
  showNotification(message: string, type?: NotificationType): Promise<void>;
}

/**
 * Notification types
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// ============================================================================
// Command Implementations
// ============================================================================

/**
 * Init command
 */
export interface IInitCommand extends ICommand {
  readonly name: 'init';
  readonly description: 'Initialize UX-Kit in the current project';
  readonly usage: 'uxkit init [options]';
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  readonly examples: CommandExample[];
  
  execute(args: string[], options: {
    'ai-agent'?: string;
    'template'?: string;
    'force'?: boolean;
  }): Promise<CommandResult>;
}

/**
 * Research questions command
 */
export interface IResearchQuestionsCommand extends ICommand {
  readonly name: 'research:questions';
  readonly description: 'Generate research questions from a prompt';
  readonly usage: 'uxkit research:questions <prompt> [options]';
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  readonly examples: CommandExample[];
  
  execute(args: string[], options: {
    'study'?: string;
    'categories'?: string[];
    'max-questions'?: number;
  }): Promise<CommandResult>;
}

/**
 * Research sources command
 */
export interface IResearchSourcesCommand extends ICommand {
  readonly name: 'research:sources';
  readonly description: 'Discover and log research sources';
  readonly usage: 'uxkit research:sources [options]';
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  readonly examples: CommandExample[];
  
  execute(args: string[], options: {
    'study'?: string;
    'types'?: string[];
    'max-sources'?: number;
    'auto-discover'?: boolean;
  }): Promise<CommandResult>;
}

/**
 * Research summarize command
 */
export interface IResearchSummarizeCommand extends ICommand {
  readonly name: 'research:summarize';
  readonly description: 'Summarize source documents';
  readonly usage: 'uxkit research:summarize <source> [options]';
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  readonly examples: CommandExample[];
  
  execute(args: string[], options: {
    'study'?: string;
    'focus-areas'?: string[];
    'max-length'?: number;
  }): Promise<CommandResult>;
}

/**
 * Research interview command
 */
export interface IResearchInterviewCommand extends ICommand {
  readonly name: 'research:interview';
  readonly description: 'Format interview transcripts';
  readonly usage: 'uxkit research:interview <transcript> [options]';
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  readonly examples: CommandExample[];
  
  execute(args: string[], options: {
    'study'?: string;
    'participant'?: string;
    'focus-areas'?: string[];
  }): Promise<CommandResult>;
}

/**
 * Research synthesize command
 */
export interface IResearchSynthesizeCommand extends ICommand {
  readonly name: 'research:synthesize';
  readonly description: 'Synthesize insights from all artifacts';
  readonly usage: 'uxkit research:synthesize [options]';
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  readonly examples: CommandExample[];
  
  execute(args: string[], options: {
    'study'?: string;
    'format'?: string;
    'focus-areas'?: string[];
    'categories'?: string[];
    'min-confidence'?: number;
  }): Promise<CommandResult>;
}

// ============================================================================
// Presentation Exceptions
// ============================================================================

/**
 * Base class for presentation exceptions
 */
export abstract class PresentationException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Exception thrown when command parsing fails
 */
export class CommandParsingException extends PresentationException {
  readonly code = 'COMMAND_PARSING_ERROR';
  readonly statusCode = 400;
  
  constructor(command: string, args: string[], originalError: Error) {
    super(
      `Failed to parse command '${command}' with args [${args.join(', ')}]: ${originalError.message}`,
      { command, args, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when command validation fails
 */
export class CommandValidationException extends PresentationException {
  readonly code = 'COMMAND_VALIDATION_ERROR';
  readonly statusCode = 400;
  
  constructor(command: string, errors: ValidationError[]) {
    super(
      `Command validation failed for '${command}': ${errors.map(e => e.message).join(', ')}`,
      { command, errors }
    );
  }
}

/**
 * Exception thrown when output operations fail
 */
export class OutputException extends PresentationException {
  readonly code = 'OUTPUT_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, originalError: Error) {
    super(
      `Output operation '${operation}' failed: ${originalError.message}`,
      { operation, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when formatting fails
 */
export class FormattingException extends PresentationException {
  readonly code = 'FORMATTING_ERROR';
  readonly statusCode = 500;
  
  constructor(format: string, data: any, originalError: Error) {
    super(
      `Formatting failed for format '${format}': ${originalError.message}`,
      { format, data, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when IDE integration fails
 */
export class IDEIntegrationException extends PresentationException {
  readonly code = 'IDE_INTEGRATION_ERROR';
  readonly statusCode = 500;
  
  constructor(ide: string, operation: string, originalError: Error) {
    super(
      `IDE integration failed for '${ide}' during '${operation}': ${originalError.message}`,
      { ide, operation, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when slash command execution fails
 */
export class SlashCommandException extends PresentationException {
  readonly code = 'SLASH_COMMAND_ERROR';
  readonly statusCode = 500;
  
  constructor(command: string, args: string[], originalError: Error) {
    super(
      `Slash command '${command}' failed with args [${args.join(', ')}]: ${originalError.message}`,
      { command, args, originalError: originalError.message }
    );
  }
}