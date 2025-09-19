/**
 * Domain Contracts for Codex Support Integration
 * 
 * These contracts define the core domain interfaces and types for Codex integration
 * following the existing UX-Kit architecture patterns.
 */

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * AI Agent types supported by UX-Kit
 */
export enum AIAgentType {
  CURSOR = 'cursor',
  CODEX = 'codex',
  CUSTOM = 'custom'
}

/**
 * Codex integration status
 */
export enum CodexIntegrationStatus {
  NOT_INITIALIZED = 'not_initialized',
  INITIALIZING = 'initializing',
  INITIALIZED = 'initialized',
  VALIDATING = 'validating',
  VALIDATED = 'validated',
  ERROR = 'error'
}

/**
 * Codex CLI validation result
 */
export enum CodexValidationResult {
  SUCCESS = 'success',
  CLI_NOT_FOUND = 'cli_not_found',
  CLI_INVALID = 'cli_invalid',
  PERMISSION_DENIED = 'permission_denied',
  UNKNOWN_ERROR = 'unknown_error'
}

// ============================================================================
// Domain Interfaces
// ============================================================================

/**
 * Core configuration for Codex integration
 */
export interface CodexConfiguration {
  readonly enabled: boolean;
  readonly cliPath?: string;
  readonly validationEnabled: boolean;
  readonly fallbackToCustom: boolean;
  readonly templatePath: string;
  readonly timeout: number; // milliseconds
}

/**
 * Result of Codex CLI validation
 */
export interface CodexValidationResponse {
  readonly result: CodexValidationResult;
  readonly cliPath?: string;
  readonly version?: string;
  readonly errorMessage?: string;
  readonly suggestions?: string[];
  readonly timestamp: Date;
}

/**
 * Codex command template structure
 */
export interface CodexCommandTemplate {
  readonly name: string;
  readonly description: string;
  readonly command: string;
  readonly parameters: readonly CodexCommandParameter[];
  readonly examples: readonly string[];
  readonly category: string;
  readonly version: string;
}

/**
 * Parameter definition for Codex commands
 */
export interface CodexCommandParameter {
  readonly name: string;
  readonly type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  readonly required: boolean;
  readonly description: string;
  readonly defaultValue?: any;
  readonly validation?: (value: any) => boolean;
  readonly options?: readonly string[]; // for enum-like parameters
}

/**
 * Status of Codex integration
 */
export interface CodexStatus {
  readonly isInitialized: boolean;
  readonly isConfigured: boolean;
  readonly cliAvailable: boolean;
  readonly templatesGenerated: boolean;
  readonly lastValidation?: Date;
  readonly errorCount: number;
  readonly status: CodexIntegrationStatus;
}

/**
 * Error information for Codex operations
 */
export interface CodexError {
  readonly code: string;
  readonly message: string;
  readonly details?: any;
  readonly suggestions?: readonly string[];
  readonly recoverable: boolean;
  readonly timestamp: Date;
}

// ============================================================================
// Domain Services
// ============================================================================

/**
 * Service for validating Codex CLI availability and configuration
 */
export interface ICodexValidator {
  /**
   * Validate Codex CLI installation and configuration
   */
  validateCodexCLI(): Promise<CodexValidationResponse>;
  
  /**
   * Quick check for Codex CLI availability
   */
  isCodexAvailable(): Promise<boolean>;
  
  /**
   * Find Codex CLI executable path
   */
  getCodexPath(): Promise<string | null>;
  
  /**
   * Get Codex CLI version information
   */
  getCodexVersion(): Promise<string | null>;
}

/**
 * Service for generating Codex command templates
 */
export interface ICodexCommandGenerator {
  /**
   * Generate all Codex command templates
   */
  generateTemplates(config: CodexConfiguration): Promise<void>;
  
  /**
   * Get specific template by name
   */
  getTemplate(name: string): Promise<CodexCommandTemplate | null>;
  
  /**
   * List all available templates
   */
  listTemplates(): Promise<readonly CodexCommandTemplate[]>;
  
  /**
   * Validate template structure
   */
  validateTemplate(template: CodexCommandTemplate): boolean;
  
  /**
   * Generate template for specific command
   */
  generateCommandTemplate(commandName: string, config: CodexConfiguration): Promise<CodexCommandTemplate>;
}

/**
 * Main service for Codex integration
 */
export interface ICodexIntegration {
  /**
   * Initialize Codex integration
   */
  initialize(config: CodexConfiguration): Promise<void>;
  
  /**
   * Validate Codex setup
   */
  validate(): Promise<CodexValidationResponse>;
  
  /**
   * Generate command templates
   */
  generateCommandTemplates(): Promise<void>;
  
  /**
   * Get current integration status
   */
  getStatus(): Promise<CodexStatus>;
  
  /**
   * Reset integration to initial state
   */
  reset(): Promise<void>;
}

// ============================================================================
// Domain Events
// ============================================================================

/**
 * Base interface for domain events
 */
export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly timestamp: Date;
  readonly aggregateId: string;
}

/**
 * Event fired when Codex integration is initialized
 */
export interface CodexIntegrationInitializedEvent extends DomainEvent {
  readonly eventType: 'CodexIntegrationInitialized';
  readonly configuration: CodexConfiguration;
}

/**
 * Event fired when Codex validation completes
 */
export interface CodexValidationCompletedEvent extends DomainEvent {
  readonly eventType: 'CodexValidationCompleted';
  readonly result: CodexValidationResponse;
}

/**
 * Event fired when Codex templates are generated
 */
export interface CodexTemplatesGeneratedEvent extends DomainEvent {
  readonly eventType: 'CodexTemplatesGenerated';
  readonly templateCount: number;
  readonly outputPath: string;
}

/**
 * Event fired when Codex integration encounters an error
 */
export interface CodexIntegrationErrorEvent extends DomainEvent {
  readonly eventType: 'CodexIntegrationError';
  readonly error: CodexError;
}

// ============================================================================
// Domain Value Objects
// ============================================================================

/**
 * Value object representing a Codex command
 */
export class CodexCommand {
  constructor(
    public readonly name: string,
    public readonly template: CodexCommandTemplate,
    public readonly parameters: Map<string, any> = new Map()
  ) {}
  
  /**
   * Validate command parameters
   */
  validate(): boolean {
    for (const param of this.template.parameters) {
      if (param.required && !this.parameters.has(param.name)) {
        return false;
      }
      
      const value = this.parameters.get(param.name);
      if (value !== undefined && param.validation && !param.validation(value)) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * Get command as string
   */
  toString(): string {
    let command = this.template.command;
    
    for (const [key, value] of this.parameters) {
      const placeholder = `{${key}}`;
      if (command.includes(placeholder)) {
        command = command.replace(placeholder, String(value));
      }
    }
    
    return command;
  }
}

/**
 * Value object representing Codex configuration validation result
 */
export class CodexConfigurationValidation {
  constructor(
    public readonly isValid: boolean,
    public readonly errors: readonly string[] = [],
    public readonly warnings: readonly string[] = []
  ) {}
  
  /**
   * Check if configuration has errors
   */
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
  
  /**
   * Check if configuration has warnings
   */
  hasWarnings(): boolean {
    return this.warnings.length > 0;
  }
  
  /**
   * Get all issues (errors and warnings)
   */
  getAllIssues(): readonly string[] {
    return [...this.errors, ...this.warnings];
  }
}

// ============================================================================
// Domain Exceptions
// ============================================================================

/**
 * Base exception for Codex domain errors
 */
export class CodexDomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly recoverable: boolean = false
  ) {
    super(message);
    this.name = 'CodexDomainException';
  }
}

/**
 * Exception thrown when Codex CLI is not found
 */
export class CodexCLINotFoundException extends CodexDomainException {
  constructor(message: string = 'Codex CLI not found') {
    super(message, 'CODEX_CLI_NOT_FOUND', true);
    this.name = 'CodexCLINotFoundException';
  }
}

/**
 * Exception thrown when Codex CLI validation fails
 */
export class CodexValidationException extends CodexDomainException {
  constructor(
    message: string,
    public readonly validationResult: CodexValidationResponse
  ) {
    super(message, 'CODEX_VALIDATION_FAILED', true);
    this.name = 'CodexValidationException';
  }
}

/**
 * Exception thrown when template generation fails
 */
export class CodexTemplateGenerationException extends CodexDomainException {
  constructor(
    message: string,
    public readonly templateName?: string
  ) {
    super(message, 'CODEX_TEMPLATE_GENERATION_FAILED', false);
    this.name = 'CodexTemplateGenerationException';
  }
}

/**
 * Exception thrown when configuration is invalid
 */
export class CodexConfigurationException extends CodexDomainException {
  constructor(
    message: string,
    public readonly validation: CodexConfigurationValidation
  ) {
    super(message, 'CODEX_CONFIGURATION_INVALID', true);
    this.name = 'CodexConfigurationException';
  }
}