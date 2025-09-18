/**
 * Presentation Layer Contracts
 * 
 * These interfaces define the presentation layer contracts
 * for the UX-Kit system. They represent CLI interfaces,
 * command parsing, and output formatting.
 */

import { ResearchStudy, ResearchContext } from './domain-contracts';

// ============================================================================
// CLI Contracts
// ============================================================================

export interface ICLIApplication {
  readonly name: string;
  readonly version: string;
  readonly description: string;
  
  registerCommand(command: ICommand): void;
  execute(args: string[]): Promise<CLIResult>;
  showHelp(): void;
  showVersion(): void;
}

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  readonly handler: ICommandHandler;
  readonly prerequisites: string[];
  readonly examples: CommandExample[];
}

export interface CommandArgument {
  readonly name: string;
  readonly description: string;
  readonly required: boolean;
  readonly type: ArgumentType;
  readonly validation?: ValidationRule[];
}

export interface CommandOption {
  readonly name: string;
  readonly description: string;
  readonly short?: string;
  readonly long: string;
  readonly type: OptionType;
  readonly default?: any;
  readonly required: boolean;
  readonly validation?: ValidationRule[];
}

export interface CommandExample {
  readonly command: string;
  readonly description: string;
}

export enum ArgumentType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  FILE = 'file',
  DIRECTORY = 'directory'
}

export enum OptionType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array'
}

export interface ValidationRule {
  readonly type: ValidationType;
  readonly value?: any;
  readonly message: string;
}

export enum ValidationType {
  REQUIRED = 'required',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
  PATTERN = 'pattern',
  RANGE = 'range',
  CUSTOM = 'custom'
}

// ============================================================================
// Command Handlers
// ============================================================================

export interface ICommandHandler {
  handle(request: CommandRequest): Promise<CommandResponse>;
}

export interface CommandRequest {
  readonly command: string;
  readonly arguments: Record<string, any>;
  readonly options: Record<string, any>;
  readonly context: CommandContext;
}

export interface CommandResponse {
  readonly success: boolean;
  readonly message?: string;
  readonly data?: any;
  readonly error?: CommandError;
}

export interface CommandContext {
  readonly workingDirectory: string;
  readonly user: string;
  readonly sessionId: string;
  readonly timestamp: Date;
  readonly environment: Record<string, string>;
}

export interface CommandError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, any>;
  readonly suggestions?: string[];
}

// ============================================================================
// Slash Command Contracts
// ============================================================================

export interface ISlashCommandHandler {
  readonly command: string;
  readonly description: string;
  
  handle(args: string[], context: IDEContext): Promise<SlashCommandResponse>;
  validate(args: string[]): ValidationResult;
  getHelp(): string;
}

export interface IDEContext {
  readonly ide: IDE;
  readonly workspace: string;
  readonly file?: string;
  readonly selection?: string;
  readonly user: string;
  readonly sessionId: string;
}

export interface SlashCommandResponse {
  readonly success: boolean;
  readonly message?: string;
  readonly output?: string;
  readonly error?: SlashCommandError;
  readonly actions?: SlashCommandAction[];
}

export interface SlashCommandError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, any>;
  readonly suggestions?: string[];
}

export interface SlashCommandAction {
  readonly type: ActionType;
  readonly data: any;
  readonly description: string;
}

export enum ActionType {
  CREATE_FILE = 'create_file',
  UPDATE_FILE = 'update_file',
  INSERT_TEXT = 'insert_text',
  SHOW_MESSAGE = 'show_message',
  OPEN_FILE = 'open_file',
  REFRESH_VIEW = 'refresh_view'
}

export enum IDE {
  CURSOR = 'cursor',
  VS_CODE = 'vscode',
  INTELLIJ = 'intellij',
  WEBSTORM = 'webstorm',
  UNKNOWN = 'unknown'
}

// ============================================================================
// Output Formatting
// ============================================================================

export interface IOutputFormatter {
  formatStudy(study: ResearchStudy): string;
  formatQuestions(questions: any[]): string;
  formatSources(sources: any[]): string;
  formatSummaries(summaries: any[]): string;
  formatInterviews(interviews: any[]): string;
  formatInsights(insights: any[]): string;
  formatError(error: CommandError): string;
  formatSuccess(message: string): string;
  formatProgress(progress: ProgressInfo): string;
}

export interface ProgressInfo {
  readonly taskId: string;
  readonly description: string;
  readonly progress: number;
  readonly message?: string;
  readonly status: ProgressStatus;
}

export enum ProgressStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// ============================================================================
// Interactive Prompts
// ============================================================================

export interface IInteractivePrompter {
  promptText(question: string, options?: PromptOptions): Promise<string>;
  promptSelect(question: string, choices: Choice[]): Promise<string>;
  promptMultiSelect(question: string, choices: Choice[]): Promise<string[]>;
  promptConfirm(question: string): Promise<boolean>;
  promptPassword(question: string): Promise<string>;
  promptFile(question: string, options?: FilePromptOptions): Promise<string>;
}

export interface PromptOptions {
  readonly default?: string;
  readonly validate?: (input: string) => boolean | string;
  readonly required?: boolean;
  readonly mask?: string;
}

export interface Choice {
  readonly name: string;
  readonly value: string;
  readonly description?: string;
}

export interface FilePromptOptions {
  readonly type?: 'file' | 'directory';
  readonly exists?: boolean;
  readonly extensions?: string[];
  readonly basePath?: string;
}

// ============================================================================
// Progress Tracking
// ============================================================================

export interface IProgressTracker {
  start(taskId: string, description: string): void;
  update(taskId: string, progress: number, message?: string): void;
  complete(taskId: string, message?: string): void;
  fail(taskId: string, error: Error): void;
  stop(taskId: string): void;
}

export interface IProgressDisplay {
  showSpinner(message: string): void;
  showProgress(progress: number, message: string): void;
  showSuccess(message: string): void;
  showError(message: string): void;
  showWarning(message: string): void;
  showInfo(message: string): void;
  hide(): void;
}

// ============================================================================
// Theme and Styling
// ============================================================================

export interface IThemeService {
  getCurrentTheme(): Theme;
  setTheme(theme: Theme): void;
  getColor(color: Color): string;
  getStyle(style: Style): string;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

export enum Color {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  MUTED = 'muted'
}

export enum Style {
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  STRIKETHROUGH = 'strikethrough'
}

// ============================================================================
// Help System
// ============================================================================

export interface IHelpService {
  getCommandHelp(command: string): string;
  getGlobalHelp(): string;
  searchHelp(query: string): HelpResult[];
  getExamples(command: string): CommandExample[];
}

export interface HelpResult {
  readonly command: string;
  readonly description: string;
  readonly relevance: number;
}

// ============================================================================
// Configuration UI
// ============================================================================

export interface IConfigurationUI {
  showConfiguration(): Promise<void>;
  editConfiguration(key: string): Promise<void>;
  resetConfiguration(): Promise<void>;
  validateConfiguration(): Promise<ValidationResult>;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: ValidationError[];
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
}

// ============================================================================
// CLI Result Types
// ============================================================================

export interface CLIResult {
  readonly success: boolean;
  readonly exitCode: number;
  readonly message?: string;
  readonly data?: any;
  readonly error?: CLIError;
}

export interface CLIError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, any>;
  readonly suggestions?: string[];
  readonly helpUrl?: string;
}

// ============================================================================
// Command Registry
// ============================================================================

export interface ICommandRegistry {
  register(command: ICommand): void;
  unregister(commandName: string): void;
  get(commandName: string): ICommand | undefined;
  list(): ICommand[];
  search(query: string): ICommand[];
}

// ============================================================================
// Event System
// ============================================================================

export interface IEventEmitter {
  on(event: string, listener: EventListener): void;
  off(event: string, listener: EventListener): void;
  emit(event: string, data?: any): void;
  once(event: string, listener: EventListener): void;
}

export interface EventListener {
  (data?: any): void;
}

// ============================================================================
// Logging
// ============================================================================

export interface ILogger {
  debug(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, error?: Error, context?: Record<string, any>): void;
}

export interface LogContext {
  readonly correlationId: string;
  readonly userId?: string;
  readonly studyId?: string;
  readonly command?: string;
  readonly timestamp: Date;
  readonly metadata?: Record<string, any>;
}
