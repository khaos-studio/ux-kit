/**
 * Application Layer Contracts
 * 
 * These interfaces define the application layer contracts
 * for the UX-Kit system. They represent use cases, command
 * handlers, and application services that orchestrate
 * domain logic and infrastructure concerns.
 */

import {
  ResearchStudy,
  ResearchQuestion,
  ResearchSource,
  ResearchSummary,
  Interview,
  ResearchInsight,
  ResearchContext,
  ResearchArtifact,
  Priority,
  QuestionCategory,
  SourceType,
  SummaryMethod,
  InterviewMethod,
  InsightCategory,
  OutputFormat
} from './domain-contracts';

// ============================================================================
// Use Case Contracts
// ============================================================================

export interface ICreateResearchStudyUseCase {
  execute(request: CreateStudyRequest): Promise<CreateStudyResponse>;
}

export interface IGenerateQuestionsUseCase {
  execute(request: GenerateQuestionsRequest): Promise<GenerateQuestionsResponse>;
}

export interface IProcessSourcesUseCase {
  execute(request: ProcessSourcesRequest): Promise<ProcessSourcesResponse>;
}

export interface ISummarizeSourceUseCase {
  execute(request: SummarizeSourceRequest): Promise<SummarizeSourceResponse>;
}

export interface IFormatInterviewUseCase {
  execute(request: FormatInterviewRequest): Promise<FormatInterviewResponse>;
}

export interface ISynthesizeInsightsUseCase {
  execute(request: SynthesizeInsightsRequest): Promise<SynthesizeInsightsResponse>;
}

export interface IListStudiesUseCase {
  execute(request: ListStudiesRequest): Promise<ListStudiesResponse>;
}

export interface IGetStudyUseCase {
  execute(request: GetStudyRequest): Promise<GetStudyResponse>;
}

export interface IUpdateStudyUseCase {
  execute(request: UpdateStudyRequest): Promise<UpdateStudyResponse>;
}

export interface IDeleteStudyUseCase {
  execute(request: DeleteStudyRequest): Promise<DeleteStudyResponse>;
}

// ============================================================================
// Request/Response Models
// ============================================================================

export interface CreateStudyRequest {
  readonly name: string;
  readonly description: string;
  readonly metadata?: Partial<StudyMetadata>;
  readonly context: ResearchContext;
}

export interface CreateStudyResponse {
  readonly success: boolean;
  readonly study?: ResearchStudy;
  readonly error?: ApplicationError;
}

export interface GenerateQuestionsRequest {
  readonly studyId: string;
  readonly prompt: string;
  readonly context?: ResearchContext;
  readonly maxQuestions?: number;
  readonly categories?: QuestionCategory[];
}

export interface GenerateQuestionsResponse {
  readonly success: boolean;
  readonly questions?: ResearchQuestion[];
  readonly error?: ApplicationError;
}

export interface ProcessSourcesRequest {
  readonly studyId: string;
  readonly sources: SourceInput[];
  readonly autoDiscover?: boolean;
  readonly context?: ResearchContext;
}

export interface ProcessSourcesResponse {
  readonly success: boolean;
  readonly sources?: ResearchSource[];
  readonly error?: ApplicationError;
}

export interface SourceInput {
  readonly title: string;
  readonly url?: string;
  readonly filePath?: string;
  readonly type: SourceType;
  readonly metadata?: Partial<SourceMetadata>;
}

export interface SummarizeSourceRequest {
  readonly sourceId: string;
  readonly method?: SummaryMethod;
  readonly maxLength?: number;
  readonly context?: ResearchContext;
}

export interface SummarizeSourceResponse {
  readonly success: boolean;
  readonly summary?: ResearchSummary;
  readonly error?: ApplicationError;
}

export interface FormatInterviewRequest {
  readonly studyId: string;
  readonly participantId: string;
  readonly transcript: string;
  readonly metadata?: Partial<InterviewMetadata>;
  readonly context?: ResearchContext;
}

export interface FormatInterviewResponse {
  readonly success: boolean;
  readonly interview?: Interview;
  readonly error?: ApplicationError;
}

export interface SynthesizeInsightsRequest {
  readonly studyId: string;
  readonly artifacts: ResearchArtifact[];
  readonly format?: OutputFormat;
  readonly context?: ResearchContext;
}

export interface SynthesizeInsightsResponse {
  readonly success: boolean;
  readonly insights?: ResearchInsight[];
  readonly error?: ApplicationError;
}

export interface ListStudiesRequest {
  readonly context: ResearchContext;
  readonly filters?: StudyFilters;
  readonly pagination?: PaginationOptions;
}

export interface ListStudiesResponse {
  readonly success: boolean;
  readonly studies?: ResearchStudy[];
  readonly pagination?: PaginationInfo;
  readonly error?: ApplicationError;
}

export interface GetStudyRequest {
  readonly studyId: string;
  readonly context: ResearchContext;
}

export interface GetStudyResponse {
  readonly success: boolean;
  readonly study?: ResearchStudy;
  readonly error?: ApplicationError;
}

export interface UpdateStudyRequest {
  readonly studyId: string;
  readonly updates: Partial<ResearchStudy>;
  readonly context: ResearchContext;
}

export interface UpdateStudyResponse {
  readonly success: boolean;
  readonly study?: ResearchStudy;
  readonly error?: ApplicationError;
}

export interface DeleteStudyRequest {
  readonly studyId: string;
  readonly context: ResearchContext;
}

export interface DeleteStudyResponse {
  readonly success: boolean;
  readonly error?: ApplicationError;
}

// ============================================================================
// Supporting Types
// ============================================================================

export interface StudyMetadata {
  readonly tags: string[];
  readonly owner: string;
  readonly team: string[];
  readonly deadline?: Date;
  readonly priority: Priority;
}

export interface SourceMetadata {
  readonly author?: string;
  readonly publicationDate?: Date;
  readonly credibility: CredibilityLevel;
  readonly relevance: RelevanceLevel;
  readonly tags: string[];
  readonly summary?: string;
}

export interface InterviewMetadata {
  readonly duration: number;
  readonly interviewer: string;
  readonly method: InterviewMethod;
  readonly language: string;
  readonly quality: QualityRating;
  readonly keyThemes: string[];
}

export enum CredibilityLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNKNOWN = 'unknown'
}

export enum RelevanceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum QualityRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export interface StudyFilters {
  readonly status?: StudyStatus[];
  readonly priority?: Priority[];
  readonly tags?: string[];
  readonly owner?: string;
  readonly team?: string[];
  readonly dateRange?: DateRange;
}

export interface DateRange {
  readonly start: Date;
  readonly end: Date;
}

export interface PaginationOptions {
  readonly page: number;
  readonly limit: number;
  readonly sortBy?: string;
  readonly sortOrder?: SortOrder;
}

export interface PaginationInfo {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum StudyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// ============================================================================
// Application Services
// ============================================================================

export interface IApplicationService {
  readonly name: string;
  readonly version: string;
}

export interface IStudyApplicationService extends IApplicationService {
  createStudy(request: CreateStudyRequest): Promise<CreateStudyResponse>;
  listStudies(request: ListStudiesRequest): Promise<ListStudiesResponse>;
  getStudy(request: GetStudyRequest): Promise<GetStudyResponse>;
  updateStudy(request: UpdateStudyRequest): Promise<UpdateStudyResponse>;
  deleteStudy(request: DeleteStudyRequest): Promise<DeleteStudyResponse>;
}

export interface IResearchApplicationService extends IApplicationService {
  generateQuestions(request: GenerateQuestionsRequest): Promise<GenerateQuestionsResponse>;
  processSources(request: ProcessSourcesRequest): Promise<ProcessSourcesResponse>;
  summarizeSource(request: SummarizeSourceRequest): Promise<SummarizeSourceResponse>;
  formatInterview(request: FormatInterviewRequest): Promise<FormatInterviewResponse>;
  synthesizeInsights(request: SynthesizeInsightsRequest): Promise<SynthesizeInsightsResponse>;
}

// ============================================================================
// Command Handlers
// ============================================================================

export interface ICommandHandler<TRequest, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}

export interface ICommandBus {
  execute<TRequest, TResponse>(
    command: string,
    request: TRequest
  ): Promise<TResponse>;
}

export interface IQueryHandler<TRequest, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}

export interface IQueryBus {
  execute<TRequest, TResponse>(
    query: string,
    request: TRequest
  ): Promise<TResponse>;
}

// ============================================================================
// Event Handlers
// ============================================================================

export interface IEventHandler<TEvent> {
  handle(event: TEvent): Promise<void>;
}

export interface IEventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe<TEvent>(
    eventType: string,
    handler: IEventHandler<TEvent>
  ): void;
  unsubscribe(eventType: string, handler: IEventHandler<any>): void;
}

export interface DomainEvent {
  readonly id: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly data: Record<string, any>;
}

// ============================================================================
// Error Handling
// ============================================================================

export interface ApplicationError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, any>;
  readonly cause?: Error;
}

export class UseCaseError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, any>,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'UseCaseError';
  }
}

export class ValidationError extends UseCaseError {
  constructor(
    message: string,
    public readonly field: string,
    details?: Record<string, any>
  ) {
    super('VALIDATION_ERROR', message, details);
  }
}

export class NotFoundError extends UseCaseError {
  constructor(
    resource: string,
    identifier: string,
    details?: Record<string, any>
  ) {
    super('NOT_FOUND_ERROR', `${resource} with identifier '${identifier}' not found`, details);
  }
}

export class ConflictError extends UseCaseError {
  constructor(
    message: string,
    details?: Record<string, any>
  ) {
    super('CONFLICT_ERROR', message, details);
  }
}

export class UnauthorizedError extends UseCaseError {
  constructor(
    message: string = 'Unauthorized access',
    details?: Record<string, any>
  ) {
    super('UNAUTHORIZED_ERROR', message, details);
  }
}

// ============================================================================
// Progress Tracking
// ============================================================================

export interface IProgressTracker {
  start(taskId: string, description: string): void;
  update(taskId: string, progress: number, message?: string): void;
  complete(taskId: string, message?: string): void;
  fail(taskId: string, error: Error): void;
}

export interface ProgressInfo {
  readonly taskId: string;
  readonly description: string;
  readonly progress: number;
  readonly message?: string;
  readonly status: ProgressStatus;
  readonly startedAt: Date;
  readonly completedAt?: Date;
  readonly error?: Error;
}

export enum ProgressStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// ============================================================================
// Configuration Management
// ============================================================================

export interface IConfigurationManager {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  has(key: string): boolean;
  delete(key: string): void;
  getAll(): Record<string, any>;
  load(configPath: string): Promise<void>;
  save(configPath: string): Promise<void>;
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
