/**
 * Application Layer Contracts
 * 
 * This file defines the application layer interfaces and types for the UX-Kit TypeScript CLI.
 * The application layer orchestrates domain services and handles use cases, following
 * clean architecture principles and protocol-oriented design.
 * 
 * The application layer is inspired by GitHub's spec-kit approach for structured workflows.
 */

import {
  ResearchStudyDirectory,
  ResearchQuestion,
  ResearchSource,
  ResearchSummary,
  Interview,
  ResearchInsight,
  StudyStatus,
  Priority,
  QuestionCategory,
  SourceType,
  InsightCategory,
  ValidationStatus
} from './domain-contracts';

// ============================================================================
// Use Case Interfaces
// ============================================================================

/**
 * Use case for creating a new research study
 */
export interface ICreateStudyUseCase {
  execute(request: CreateStudyRequest): Promise<CreateStudyResponse>;
}

export interface CreateStudyRequest {
  name: string;
  description?: string;
  tags?: string[];
  priority?: Priority;
  teamMembers?: string[];
}

export interface CreateStudyResponse {
  study: ResearchStudyDirectory;
  success: boolean;
  message: string;
}

/**
 * Use case for generating research questions
 */
export interface IGenerateQuestionsUseCase {
  execute(request: GenerateQuestionsRequest): Promise<GenerateQuestionsResponse>;
}

export interface GenerateQuestionsRequest {
  studyId: string;
  prompt: string;
  categories?: QuestionCategory[];
  maxQuestions?: number;
}

export interface GenerateQuestionsResponse {
  questions: ResearchQuestion[];
  success: boolean;
  message: string;
  metadata: {
    prompt: string;
    aiAgent: string;
    processingTime: number;
  };
}

/**
 * Use case for discovering research sources
 */
export interface IDiscoverSourcesUseCase {
  execute(request: DiscoverSourcesRequest): Promise<DiscoverSourcesResponse>;
}

export interface DiscoverSourcesRequest {
  studyId: string;
  query: string;
  types?: SourceType[];
  maxSources?: number;
  autoDiscover?: boolean;
}

export interface DiscoverSourcesResponse {
  sources: ResearchSource[];
  success: boolean;
  message: string;
  metadata: {
    query: string;
    autoDiscovered: boolean;
    aiAgent: string;
    processingTime: number;
  };
}

/**
 * Use case for summarizing research sources
 */
export interface ISummarizeSourceUseCase {
  execute(request: SummarizeSourceRequest): Promise<SummarizeSourceResponse>;
}

export interface SummarizeSourceRequest {
  sourceId: string;
  studyId: string;
  content: string;
  focusAreas?: string[];
  maxLength?: number;
}

export interface SummarizeSourceResponse {
  summary: ResearchSummary;
  success: boolean;
  message: string;
  metadata: {
    sourceId: string;
    aiAgent: string;
    processingTime: number;
    wordCount: number;
  };
}

/**
 * Use case for formatting interview transcripts
 */
export interface IFormatInterviewUseCase {
  execute(request: FormatInterviewRequest): Promise<FormatInterviewResponse>;
}

export interface FormatInterviewRequest {
  studyId: string;
  participantId: string;
  transcript: string;
  participantInfo?: {
    demographics?: any;
    experience?: any;
  };
  focusAreas?: string[];
}

export interface FormatInterviewResponse {
  interview: Interview;
  success: boolean;
  message: string;
  metadata: {
    participantId: string;
    aiAgent: string;
    processingTime: number;
    duration: number;
  };
}

/**
 * Use case for synthesizing research insights
 */
export interface ISynthesizeInsightsUseCase {
  execute(request: SynthesizeInsightsRequest): Promise<SynthesizeInsightsResponse>;
}

export interface SynthesizeInsightsRequest {
  studyId: string;
  artifactIds: string[];
  focusAreas?: string[];
  categories?: InsightCategory[];
  minConfidence?: number;
}

export interface SynthesizeInsightsResponse {
  insights: ResearchInsight[];
  success: boolean;
  message: string;
  metadata: {
    sourceArtifacts: string[];
    aiAgent: string;
    processingTime: number;
    insightCount: number;
  };
}

// ============================================================================
// Command Interfaces
// ============================================================================

/**
 * Base interface for all commands
 */
export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly arguments: CommandArgument[];
  readonly options: CommandOption[];
  execute(args: string[], options: Record<string, any>): Promise<CommandResult>;
}

/**
 * Command argument definition
 */
export interface CommandArgument {
  name: string;
  description: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array';
  defaultValue?: any;
}

/**
 * Command option definition
 */
export interface CommandOption {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  defaultValue?: any;
  aliases?: string[];
}

/**
 * Command execution result
 */
export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
  metadata?: Record<string, any>;
}

/**
 * Command for initializing UX-Kit
 */
export interface IInitCommand extends ICommand {
  execute(args: string[], options: {
    'ai-agent'?: string;
    'template'?: string;
    'force'?: boolean;
  }): Promise<CommandResult>;
}

/**
 * Command for creating research studies
 */
export interface ICreateStudyCommand extends ICommand {
  execute(args: string[], options: {
    'description'?: string;
    'tags'?: string[];
    'priority'?: Priority;
    'team'?: string[];
  }): Promise<CommandResult>;
}

/**
 * Command for generating research questions
 */
export interface IGenerateQuestionsCommand extends ICommand {
  execute(args: string[], options: {
    'study'?: string;
    'categories'?: QuestionCategory[];
    'max-questions'?: number;
  }): Promise<CommandResult>;
}

/**
 * Command for discovering research sources
 */
export interface IDiscoverSourcesCommand extends ICommand {
  execute(args: string[], options: {
    'study'?: string;
    'types'?: SourceType[];
    'max-sources'?: number;
    'auto-discover'?: boolean;
  }): Promise<CommandResult>;
}

/**
 * Command for summarizing research sources
 */
export interface ISummarizeSourceCommand extends ICommand {
  execute(args: string[], options: {
    'study'?: string;
    'focus-areas'?: string[];
    'max-length'?: number;
  }): Promise<CommandResult>;
}

/**
 * Command for formatting interview transcripts
 */
export interface IFormatInterviewCommand extends ICommand {
  execute(args: string[], options: {
    'study'?: string;
    'participant'?: string;
    'focus-areas'?: string[];
  }): Promise<CommandResult>;
}

/**
 * Command for synthesizing research insights
 */
export interface ISynthesizeInsightsCommand extends ICommand {
  execute(args: string[], options: {
    'study'?: string;
    'format'?: string;
    'focus-areas'?: string[];
    'categories'?: InsightCategory[];
    'min-confidence'?: number;
  }): Promise<CommandResult>;
}

// ============================================================================
// Application Services
// ============================================================================

/**
 * Service for managing research workflows
 */
export interface IResearchWorkflowService {
  initializeProject(config: ProjectConfig): Promise<void>;
  createStudy(request: CreateStudyRequest): Promise<ResearchStudyDirectory>;
  generateQuestions(request: GenerateQuestionsRequest): Promise<ResearchQuestion[]>;
  discoverSources(request: DiscoverSourcesRequest): Promise<ResearchSource[]>;
  summarizeSource(request: SummarizeSourceRequest): Promise<ResearchSummary>;
  formatInterview(request: FormatInterviewRequest): Promise<Interview>;
  synthesizeInsights(request: SynthesizeInsightsRequest): Promise<ResearchInsight[]>;
}

/**
 * Service for managing AI agent interactions
 */
export interface IAIAgentService {
  generateQuestions(prompt: string, context: ResearchContext): Promise<ResearchQuestion[]>;
  discoverSources(query: string, context: ResearchContext): Promise<ResearchSource[]>;
  summarizeContent(content: string, context: ResearchContext): Promise<ResearchSummary>;
  formatInterview(transcript: string, context: ResearchContext): Promise<Interview>;
  synthesizeInsights(artifacts: string[], context: ResearchContext): Promise<ResearchInsight[]>;
  isAvailable(): Promise<boolean>;
  getCapabilities(): Promise<AIAgentCapabilities>;
}

/**
 * Service for managing file operations
 */
export interface IFileService {
  createStudyDirectory(study: ResearchStudyDirectory): Promise<void>;
  generateQuestionsFile(studyId: string, questions: ResearchQuestion[]): Promise<string>;
  generateSourcesFile(studyId: string, sources: ResearchSource[]): Promise<string>;
  generateSummaryFile(sourceId: string, summary: ResearchSummary): Promise<string>;
  generateInterviewFile(studyId: string, participantId: string, interview: Interview): Promise<string>;
  generateInsightsFile(studyId: string, insights: ResearchInsight[]): Promise<string>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  createDirectory(path: string): Promise<void>;
}

/**
 * Service for managing templates
 */
export interface ITemplateService {
  loadTemplate(name: string): Promise<string>;
  renderTemplate(template: string, data: Record<string, any>): Promise<string>;
  validateTemplate(template: string): Promise<boolean>;
  getAvailableTemplates(): Promise<TemplateInfo[]>;
  createTemplate(name: string, content: string): Promise<void>;
  updateTemplate(name: string, content: string): Promise<void>;
  deleteTemplate(name: string): Promise<void>;
}

/**
 * Service for managing configuration
 */
export interface IConfigurationService {
  loadConfig(): Promise<UXKitConfig>;
  saveConfig(config: UXKitConfig): Promise<void>;
  getValue(key: string): Promise<any>;
  setValue(key: string, value: any): Promise<void>;
  resetConfig(): Promise<void>;
  validateConfig(config: UXKitConfig): Promise<boolean>;
}

// ============================================================================
// Data Transfer Objects
// ============================================================================

/**
 * Project configuration
 */
export interface ProjectConfig {
  name: string;
  description?: string;
  aiAgent: {
    provider: string;
    settings: Record<string, any>;
  };
  storage: {
    basePath: string;
    format: 'markdown' | 'json' | 'yaml';
  };
  research: {
    defaultTemplates: string[];
    autoSave: boolean;
  };
}

/**
 * UX-Kit configuration
 */
export interface UXKitConfig {
  version: string;
  aiAgent: {
    provider: 'cursor' | 'codex' | 'custom';
    settings: Record<string, any>;
    timeout: number;
    retries: number;
  };
  storage: {
    basePath: string;
    format: 'markdown' | 'json' | 'yaml';
    autoSave: boolean;
    backup: boolean;
  };
  research: {
    defaultTemplates: string[];
    autoDiscovery: boolean;
    qualityThreshold: number;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    verbose: boolean;
    progress: boolean;
  };
}

/**
 * Research context for AI agent operations
 */
export interface ResearchContext {
  studyId: string;
  studyName: string;
  studyDescription?: string;
  existingArtifacts: string[];
  focusAreas?: string[];
  constraints?: Record<string, any>;
}

/**
 * AI agent capabilities
 */
export interface AIAgentCapabilities {
  name: string;
  version: string;
  supportedOperations: string[];
  maxContentLength: number;
  responseTime: number;
  reliability: number;
}

/**
 * Template information
 */
export interface TemplateInfo {
  name: string;
  description: string;
  type: string;
  path: string;
  variables: TemplateVariable[];
  metadata: TemplateMetadata;
}

/**
 * Template variable definition
 */
export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  description: string;
}

/**
 * Template metadata
 */
export interface TemplateMetadata {
  version: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

// ============================================================================
// Application Events
// ============================================================================

/**
 * Base interface for application events
 */
export interface ApplicationEvent {
  readonly id: string;
  readonly type: string;
  readonly timestamp: Date;
  readonly correlationId: string;
}

/**
 * Event fired when a command is executed
 */
export interface CommandExecutedEvent extends ApplicationEvent {
  readonly type: 'CommandExecuted';
  readonly command: string;
  readonly args: string[];
  readonly options: Record<string, any>;
  readonly result: CommandResult;
  readonly executionTime: number;
}

/**
 * Event fired when a use case is executed
 */
export interface UseCaseExecutedEvent extends ApplicationEvent {
  readonly type: 'UseCaseExecuted';
  readonly useCase: string;
  readonly request: any;
  readonly response: any;
  readonly executionTime: number;
}

/**
 * Event fired when AI agent communication occurs
 */
export interface AIAgentCommunicationEvent extends ApplicationEvent {
  readonly type: 'AIAgentCommunication';
  readonly agent: string;
  readonly operation: string;
  readonly request: any;
  readonly response: any;
  readonly executionTime: number;
  readonly success: boolean;
}

/**
 * Event fired when file operations occur
 */
export interface FileOperationEvent extends ApplicationEvent {
  readonly type: 'FileOperation';
  readonly operation: 'create' | 'read' | 'update' | 'delete';
  readonly path: string;
  readonly success: boolean;
  readonly executionTime: number;
}

// ============================================================================
// Application Exceptions
// ============================================================================

/**
 * Base class for application exceptions
 */
export abstract class ApplicationException extends Error {
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
 * Exception thrown when a use case fails
 */
export class UseCaseException extends ApplicationException {
  readonly code = 'USE_CASE_ERROR';
  readonly statusCode = 500;
  
  constructor(useCase: string, operation: string, originalError: Error) {
    super(
      `Use case '${useCase}' failed during '${operation}': ${originalError.message}`,
      { useCase, operation, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when a command fails
 */
export class CommandException extends ApplicationException {
  readonly code = 'COMMAND_ERROR';
  readonly statusCode = 500;
  
  constructor(command: string, args: string[], originalError: Error) {
    super(
      `Command '${command}' failed with args [${args.join(', ')}]: ${originalError.message}`,
      { command, args, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when AI agent communication fails
 */
export class AIAgentCommunicationException extends ApplicationException {
  readonly code = 'AI_AGENT_COMMUNICATION_ERROR';
  readonly statusCode = 502;
  
  constructor(agent: string, operation: string, originalError: Error) {
    super(
      `AI agent '${agent}' communication failed during '${operation}': ${originalError.message}`,
      { agent, operation, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when file operations fail
 */
export class FileOperationException extends ApplicationException {
  readonly code = 'FILE_OPERATION_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, path: string, originalError: Error) {
    super(
      `File operation '${operation}' failed for path '${path}': ${originalError.message}`,
      { operation, path, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when template operations fail
 */
export class TemplateException extends ApplicationException {
  readonly code = 'TEMPLATE_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, template: string, originalError: Error) {
    super(
      `Template operation '${operation}' failed for template '${template}': ${originalError.message}`,
      { operation, template, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when configuration operations fail
 */
export class ConfigurationException extends ApplicationException {
  readonly code = 'CONFIGURATION_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, key: string, originalError: Error) {
    super(
      `Configuration operation '${operation}' failed for key '${key}': ${originalError.message}`,
      { operation, key, originalError: originalError.message }
    );
  }
}