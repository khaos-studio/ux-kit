/**
 * Application Contracts for Codex Support Integration
 * 
 * These contracts define the application layer interfaces and services for Codex integration,
 * following the existing UX-Kit architecture patterns.
 */

import {
  CodexConfiguration,
  CodexValidationResponse,
  CodexCommandTemplate,
  CodexStatus,
  CodexError,
  ICodexValidator,
  ICodexCommandGenerator,
  ICodexIntegration
} from './domain-contracts';

// ============================================================================
// Application Services
// ============================================================================

/**
 * Application service for managing Codex integration
 */
export interface ICodexIntegrationService {
  /**
   * Initialize Codex integration with configuration
   */
  initializeCodex(config: CodexConfiguration): Promise<void>;
  
  /**
   * Validate Codex setup and configuration
   */
  validateCodexSetup(): Promise<CodexValidationResponse>;
  
  /**
   * Generate Codex command templates
   */
  generateCodexTemplates(): Promise<void>;
  
  /**
   * Get current Codex integration status
   */
  getCodexStatus(): Promise<CodexStatus>;
  
  /**
   * Handle Codex integration errors
   */
  handleCodexError(error: CodexError): Promise<void>;
  
  /**
   * Reset Codex integration
   */
  resetCodexIntegration(): Promise<void>;
}

/**
 * Application service for managing AI agent selection
 */
export interface IAIAgentSelectionService {
  /**
   * Get available AI agent options
   */
  getAvailableAgents(): Promise<readonly string[]>;
  
  /**
   * Validate selected AI agent
   */
  validateAgent(agentType: string): Promise<boolean>;
  
  /**
   * Initialize selected AI agent
   */
  initializeAgent(agentType: string, config: any): Promise<void>;
  
  /**
   * Get agent-specific configuration
   */
  getAgentConfiguration(agentType: string): Promise<any>;
}

/**
 * Application service for command template management
 */
export interface ICommandTemplateService {
  /**
   * Generate templates for specific AI agent
   */
  generateTemplatesForAgent(agentType: string): Promise<void>;
  
  /**
   * Get available templates for agent
   */
  getTemplatesForAgent(agentType: string): Promise<readonly CodexCommandTemplate[]>;
  
  /**
   * Validate template structure
   */
  validateTemplate(template: CodexCommandTemplate): Promise<boolean>;
  
  /**
   * Update template configuration
   */
  updateTemplateConfiguration(agentType: string, config: any): Promise<void>;
}

// ============================================================================
// Application DTOs
// ============================================================================

/**
 * Data Transfer Object for Codex initialization request
 */
export interface CodexInitializationRequest {
  readonly projectPath: string;
  readonly configuration: Partial<CodexConfiguration>;
  readonly skipValidation?: boolean;
  readonly forceReinit?: boolean;
}

/**
 * Data Transfer Object for Codex initialization response
 */
export interface CodexInitializationResponse {
  readonly success: boolean;
  readonly status: CodexStatus;
  readonly error?: CodexError;
  readonly validationResult?: CodexValidationResponse;
}

/**
 * Data Transfer Object for template generation request
 */
export interface TemplateGenerationRequest {
  readonly agentType: string;
  readonly outputPath: string;
  readonly templateFormat: 'markdown' | 'json' | 'yaml';
  readonly includeExamples: boolean;
  readonly includeDocumentation: boolean;
}

/**
 * Data Transfer Object for template generation response
 */
export interface TemplateGenerationResponse {
  readonly success: boolean;
  readonly templatesGenerated: number;
  readonly outputPath: string;
  readonly error?: CodexError;
}

/**
 * Data Transfer Object for validation request
 */
export interface ValidationRequest {
  readonly agentType: string;
  readonly skipCLICheck?: boolean;
  readonly timeout?: number;
}

/**
 * Data Transfer Object for validation response
 */
export interface ValidationResponse {
  readonly success: boolean;
  readonly result: CodexValidationResponse;
  readonly error?: CodexError;
}

// ============================================================================
// Application Commands
// ============================================================================

/**
 * Command for initializing Codex integration
 */
export interface InitializeCodexCommand {
  readonly type: 'InitializeCodex';
  readonly request: CodexInitializationRequest;
  readonly timestamp: Date;
}

/**
 * Command for validating Codex setup
 */
export interface ValidateCodexCommand {
  readonly type: 'ValidateCodex';
  readonly request: ValidationRequest;
  readonly timestamp: Date;
}

/**
 * Command for generating Codex templates
 */
export interface GenerateCodexTemplatesCommand {
  readonly type: 'GenerateCodexTemplates';
  readonly request: TemplateGenerationRequest;
  readonly timestamp: Date;
}

/**
 * Command for resetting Codex integration
 */
export interface ResetCodexCommand {
  readonly type: 'ResetCodex';
  readonly timestamp: Date;
}

// ============================================================================
// Application Queries
// ============================================================================

/**
 * Query for getting Codex status
 */
export interface GetCodexStatusQuery {
  readonly type: 'GetCodexStatus';
  readonly timestamp: Date;
}

/**
 * Query for getting available AI agents
 */
export interface GetAvailableAgentsQuery {
  readonly type: 'GetAvailableAgents';
  readonly timestamp: Date;
}

/**
 * Query for getting templates for agent
 */
export interface GetTemplatesForAgentQuery {
  readonly type: 'GetTemplatesForAgent';
  readonly agentType: string;
  readonly timestamp: Date;
}

// ============================================================================
// Application Events
// ============================================================================

/**
 * Event fired when Codex initialization starts
 */
export interface CodexInitializationStartedEvent {
  readonly eventType: 'CodexInitializationStarted';
  readonly request: CodexInitializationRequest;
  readonly timestamp: Date;
}

/**
 * Event fired when Codex initialization completes
 */
export interface CodexInitializationCompletedEvent {
  readonly eventType: 'CodexInitializationCompleted';
  readonly response: CodexInitializationResponse;
  readonly timestamp: Date;
}

/**
 * Event fired when Codex validation starts
 */
export interface CodexValidationStartedEvent {
  readonly eventType: 'CodexValidationStarted';
  readonly request: ValidationRequest;
  readonly timestamp: Date;
}

/**
 * Event fired when Codex validation completes
 */
export interface CodexValidationCompletedEvent {
  readonly eventType: 'CodexValidationCompleted';
  readonly response: ValidationResponse;
  readonly timestamp: Date;
}

/**
 * Event fired when template generation starts
 */
export interface TemplateGenerationStartedEvent {
  readonly eventType: 'TemplateGenerationStarted';
  readonly request: TemplateGenerationRequest;
  readonly timestamp: Date;
}

/**
 * Event fired when template generation completes
 */
export interface TemplateGenerationCompletedEvent {
  readonly eventType: 'TemplateGenerationCompleted';
  readonly response: TemplateGenerationResponse;
  readonly timestamp: Date;
}

// ============================================================================
// Application Handlers
// ============================================================================

/**
 * Handler for Codex initialization commands
 */
export interface ICodexInitializationHandler {
  handle(command: InitializeCodexCommand): Promise<CodexInitializationResponse>;
}

/**
 * Handler for Codex validation commands
 */
export interface ICodexValidationHandler {
  handle(command: ValidateCodexCommand): Promise<ValidationResponse>;
}

/**
 * Handler for template generation commands
 */
export interface ITemplateGenerationHandler {
  handle(command: GenerateCodexTemplatesCommand): Promise<TemplateGenerationResponse>;
}

/**
 * Handler for Codex reset commands
 */
export interface ICodexResetHandler {
  handle(command: ResetCodexCommand): Promise<void>;
}

// ============================================================================
// Application Query Handlers
// ============================================================================

/**
 * Handler for Codex status queries
 */
export interface ICodexStatusQueryHandler {
  handle(query: GetCodexStatusQuery): Promise<CodexStatus>;
}

/**
 * Handler for available agents queries
 */
export interface IAvailableAgentsQueryHandler {
  handle(query: GetAvailableAgentsQuery): Promise<readonly string[]>;
}

/**
 * Handler for templates queries
 */
export interface ITemplatesQueryHandler {
  handle(query: GetTemplatesForAgentQuery): Promise<readonly CodexCommandTemplate[]>;
}

// ============================================================================
// Application Configuration
// ============================================================================

/**
 * Application configuration for Codex integration
 */
export interface CodexApplicationConfig {
  readonly defaultConfiguration: CodexConfiguration;
  readonly validationTimeout: number;
  readonly templateGenerationTimeout: number;
  readonly maxRetryAttempts: number;
  readonly retryDelay: number;
  readonly enableLogging: boolean;
  readonly logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Configuration for template generation
 */
export interface TemplateGenerationConfig {
  readonly outputDirectory: string;
  readonly templateFormat: 'markdown' | 'json' | 'yaml';
  readonly includeExamples: boolean;
  readonly includeDocumentation: boolean;
  readonly customTemplates: readonly string[];
  readonly validationEnabled: boolean;
}

// ============================================================================
// Application Exceptions
// ============================================================================

/**
 * Base exception for application layer errors
 */
export class CodexApplicationException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly recoverable: boolean = false,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'CodexApplicationException';
  }
}

/**
 * Exception thrown when initialization fails
 */
export class CodexInitializationException extends CodexApplicationException {
  constructor(
    message: string,
    public readonly request: CodexInitializationRequest,
    originalError?: Error
  ) {
    super(message, 'CODEX_INITIALIZATION_FAILED', true, originalError);
    this.name = 'CodexInitializationException';
  }
}

/**
 * Exception thrown when validation fails
 */
export class CodexValidationApplicationException extends CodexApplicationException {
  constructor(
    message: string,
    public readonly request: ValidationRequest,
    originalError?: Error
  ) {
    super(message, 'CODEX_VALIDATION_APPLICATION_FAILED', true, originalError);
    this.name = 'CodexValidationApplicationException';
  }
}

/**
 * Exception thrown when template generation fails
 */
export class TemplateGenerationApplicationException extends CodexApplicationException {
  constructor(
    message: string,
    public readonly request: TemplateGenerationRequest,
    originalError?: Error
  ) {
    super(message, 'TEMPLATE_GENERATION_APPLICATION_FAILED', false, originalError);
    this.name = 'TemplateGenerationApplicationException';
  }
}

// ============================================================================
// Application Utilities
// ============================================================================

/**
 * Utility class for application layer operations
 */
export class CodexApplicationUtils {
  /**
   * Create default Codex configuration
   */
  static createDefaultConfiguration(): CodexConfiguration {
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
  static validateApplicationConfig(config: CodexApplicationConfig): boolean {
    return (
      config.validationTimeout > 0 &&
      config.templateGenerationTimeout > 0 &&
      config.maxRetryAttempts >= 0 &&
      config.retryDelay >= 0
    );
  }
  
  /**
   * Create error response
   */
  static createErrorResponse(error: CodexError): any {
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
  static createSuccessResponse(data: any): any {
    return {
      success: true,
      data,
      timestamp: new Date()
    };
  }
}