/**
 * Presentation Layer Contracts
 * 
 * Simplified contracts for the CLI framework implementation.
 */

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly usage?: string;
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  readonly examples?: CommandExample[];
  
  execute(args: string[], options: Record<string, any>): Promise<CommandResult>;
  validate(args: string[], options: Record<string, any>): Promise<ValidationResult>;
  showHelp(): void;
}

export interface CommandArgument {
  readonly name: string;
  readonly description: string;
  readonly required: boolean;
  readonly type: 'string' | 'number' | 'boolean' | 'array';
  readonly defaultValue?: any;
  readonly validator?: ArgumentValidator;
}

export interface CommandOption {
  readonly name: string;
  readonly description: string;
  readonly type: 'string' | 'number' | 'boolean' | 'array';
  readonly required: boolean;
  readonly defaultValue?: any;
  readonly aliases?: string[];
  readonly validator?: OptionValidator;
}

export interface CommandExample {
  readonly description: string;
  readonly command: string;
  readonly explanation?: string;
}

export interface ArgumentValidator {
  validate(value: any): Promise<boolean>;
  getErrorMessage(value: any): string;
}

export interface OptionValidator {
  validate(value: any): Promise<boolean>;
  getErrorMessage(value: any): string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: ValidationError[];
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly value: any;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
  metadata?: Record<string, any>;
}

export interface IOutput {
  write(text: string): void;
  writeln(text: string): void;
  writeError(text: string): void;
  writeErrorln(text: string): void;
  clear(): void;
  flush(): void;
}

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

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}
