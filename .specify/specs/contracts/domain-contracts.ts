/**
 * Domain Layer Contracts
 * 
 * This file defines the core domain interfaces and types for the UX-Kit TypeScript CLI.
 * These contracts represent the business logic and entities that are independent of
 * external concerns like infrastructure, presentation, or specific implementations.
 * 
 * The domain layer follows simple architecture principles and protocol-oriented design
 * to ensure extensibility and maintainability, inspired by GitHub's spec-kit approach.
 */

// ============================================================================
// Core Domain Entities
// ============================================================================

/**
 * Represents a research study directory - the central entity in the UX research domain
 */
export interface ResearchStudyDirectory {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: StudyStatus;
  readonly path: string;
  readonly metadata: StudyMetadata;
}

/**
 * Status of a research study
 */
export enum StudyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

/**
 * Additional metadata for a research study
 */
export interface StudyMetadata {
  readonly tags: string[];
  readonly priority: Priority;
  readonly estimatedDuration?: number;
  readonly actualDuration?: number;
  readonly teamMembers: string[];
}

/**
 * Priority levels for research studies and artifacts
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// ============================================================================
// Research Artifacts
// ============================================================================

/**
 * Represents a research question
 */
export interface ResearchQuestion {
  readonly id: string;
  readonly question: string;
  readonly priority: Priority;
  readonly category: QuestionCategory;
  readonly context?: string;
}

/**
 * Categories for research questions
 */
export enum QuestionCategory {
  USER_BEHAVIOR = 'user_behavior',
  USABILITY = 'usability',
  ACCESSIBILITY = 'accessibility',
  PERFORMANCE = 'performance',
  CONTENT = 'content',
  NAVIGATION = 'navigation',
  FEEDBACK = 'feedback',
  OTHER = 'other'
}

/**
 * Represents a research source
 */
export interface ResearchSource {
  readonly id: string;
  readonly title: string;
  readonly url?: string;
  readonly filePath?: string;
  readonly type: SourceType;
  readonly addedAt: Date;
  readonly metadata: SourceMetadata;
}

/**
 * Types of research sources
 */
export enum SourceType {
  WEB = 'web',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
  OTHER = 'other'
}

/**
 * Metadata for research sources
 */
export interface SourceMetadata {
  readonly description?: string;
  readonly tags: string[];
  readonly relevance: RelevanceLevel;
  readonly credibility: CredibilityLevel;
}

/**
 * Relevance levels for sources
 */
export enum RelevanceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Credibility levels for sources
 */
export enum CredibilityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  PEER_REVIEWED = 'peer_reviewed'
}

/**
 * Represents a research summary
 */
export interface ResearchSummary {
  readonly id: string;
  readonly content: string;
  readonly keyPoints: string[];
  readonly insights: string[];
  readonly recommendations: string[];
  readonly metadata: SummaryMetadata;
}

/**
 * Metadata for research summaries
 */
export interface SummaryMetadata {
  readonly wordCount: number;
  readonly readingTime: number;
  readonly confidence: ConfidenceLevel;
  readonly topics: string[];
}

/**
 * Confidence levels for AI-generated content
 */
export enum ConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Represents an interview
 */
export interface Interview {
  readonly id: string;
  readonly participantId: string;
  readonly transcript: string;
  readonly insights: string[];
  readonly quotes: InterviewQuote[];
  readonly metadata: InterviewMetadata;
}

/**
 * Represents a quote from an interview
 */
export interface InterviewQuote {
  readonly id: string;
  readonly text: string;
  readonly timestamp?: number;
  readonly speaker: 'participant' | 'interviewer';
  readonly sentiment: Sentiment;
  readonly importance: Priority;
}

/**
 * Sentiment analysis results
 */
export enum Sentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  MIXED = 'mixed'
}

/**
 * Metadata for interviews
 */
export interface InterviewMetadata {
  readonly duration: number;
  readonly participantInfo: ParticipantInfo;
  readonly topics: string[];
  readonly keyThemes: string[];
}

/**
 * Information about interview participants
 */
export interface ParticipantInfo {
  readonly id: string;
  readonly demographics?: Demographics;
  readonly experience?: Experience;
}

/**
 * Participant demographics
 */
export interface Demographics {
  readonly age?: string;
  readonly gender?: string;
  readonly location?: string;
  readonly occupation?: string;
}

/**
 * Participant experience information
 */
export interface Experience {
  readonly level: ExperienceLevel;
  readonly domain?: string;
  readonly years?: number;
}

/**
 * Experience levels
 */
export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

/**
 * Represents a research insight
 */
export interface ResearchInsight {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly evidence: string[];
  readonly priority: Priority;
  readonly category: InsightCategory;
  readonly confidence: ConfidenceLevel;
  readonly impact: ImpactLevel;
  readonly effort: EffortLevel;
  readonly recommendations: string[];
  readonly metadata: InsightMetadata;
}

/**
 * Categories for research insights
 */
export enum InsightCategory {
  USER_NEED = 'user_need',
  PAIN_POINT = 'pain_point',
  OPPORTUNITY = 'opportunity',
  BEHAVIOR_PATTERN = 'behavior_pattern',
  USABILITY_ISSUE = 'usability_issue',
  ACCESSIBILITY_ISSUE = 'accessibility_issue',
  PERFORMANCE_ISSUE = 'performance_issue',
  CONTENT_ISSUE = 'content_issue',
  OTHER = 'other'
}

/**
 * Impact levels for insights
 */
export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Effort levels for implementing insights
 */
export enum EffortLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

/**
 * Metadata for research insights
 */
export interface InsightMetadata {
  readonly sourceCount: number;
  readonly evidenceStrength: EvidenceStrength;
  readonly validationStatus: ValidationStatus;
  readonly assignedTo?: string;
  readonly dueDate?: Date;
}

/**
 * Evidence strength levels
 */
export enum EvidenceStrength {
  WEAK = 'weak',
  MODERATE = 'moderate',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong'
}

/**
 * Validation status for insights
 */
export enum ValidationStatus {
  UNVALIDATED = 'unvalidated',
  IN_PROGRESS = 'in_progress',
  VALIDATED = 'validated',
  REJECTED = 'rejected'
}

// ============================================================================
// Domain Services
// ============================================================================

/**
 * Service for managing research studies
 */
export interface IStudyService {
  createStudy(name: string, description?: string): Promise<ResearchStudyDirectory>;
  getStudy(id: string): Promise<ResearchStudyDirectory | null>;
  updateStudy(id: string, updates: Partial<ResearchStudyDirectory>): Promise<ResearchStudyDirectory>;
  deleteStudy(id: string): Promise<void>;
  listStudies(): Promise<ResearchStudyDirectory[]>;
}

/**
 * Service for managing research questions
 */
export interface IQuestionService {
  generateQuestions(studyId: string, prompt: string): Promise<ResearchQuestion[]>;
  addQuestion(studyId: string, question: Omit<ResearchQuestion, 'id'>): Promise<ResearchQuestion>;
  updateQuestion(id: string, updates: Partial<ResearchQuestion>): Promise<ResearchQuestion>;
  deleteQuestion(id: string): Promise<void>;
  getQuestions(studyId: string): Promise<ResearchQuestion[]>;
}

/**
 * Service for managing research sources
 */
export interface ISourceService {
  addSource(studyId: string, source: Omit<ResearchSource, 'id' | 'addedAt'>): Promise<ResearchSource>;
  updateSource(id: string, updates: Partial<ResearchSource>): Promise<ResearchSource>;
  deleteSource(id: string): Promise<void>;
  getSources(studyId: string): Promise<ResearchSource[]>;
  discoverSources(studyId: string, query: string): Promise<ResearchSource[]>;
}

/**
 * Service for managing research summaries
 */
export interface ISummaryService {
  generateSummary(sourceId: string, content: string): Promise<ResearchSummary>;
  updateSummary(id: string, updates: Partial<ResearchSummary>): Promise<ResearchSummary>;
  deleteSummary(id: string): Promise<void>;
  getSummary(id: string): Promise<ResearchSummary | null>;
  getSummaries(studyId: string): Promise<ResearchSummary[]>;
}

/**
 * Service for managing interviews
 */
export interface IInterviewService {
  formatInterview(studyId: string, participantId: string, transcript: string): Promise<Interview>;
  updateInterview(id: string, updates: Partial<Interview>): Promise<Interview>;
  deleteInterview(id: string): Promise<void>;
  getInterview(id: string): Promise<Interview | null>;
  getInterviews(studyId: string): Promise<Interview[]>;
}

/**
 * Service for managing research insights
 */
export interface IInsightService {
  synthesizeInsights(studyId: string, artifacts: string[]): Promise<ResearchInsight[]>;
  addInsight(studyId: string, insight: Omit<ResearchInsight, 'id'>): Promise<ResearchInsight>;
  updateInsight(id: string, updates: Partial<ResearchInsight>): Promise<ResearchInsight>;
  deleteInsight(id: string): Promise<void>;
  getInsights(studyId: string): Promise<ResearchInsight[]>;
  validateInsight(id: string, status: ValidationStatus): Promise<ResearchInsight>;
}

// ============================================================================
// Domain Events
// ============================================================================

/**
 * Base interface for domain events
 */
export interface DomainEvent {
  readonly id: string;
  readonly type: string;
  readonly timestamp: Date;
  readonly aggregateId: string;
  readonly version: number;
}

/**
 * Event fired when a study is created
 */
export interface StudyCreatedEvent extends DomainEvent {
  readonly type: 'StudyCreated';
  readonly study: ResearchStudyDirectory;
}

/**
 * Event fired when a study is updated
 */
export interface StudyUpdatedEvent extends DomainEvent {
  readonly type: 'StudyUpdated';
  readonly studyId: string;
  readonly changes: Partial<ResearchStudyDirectory>;
}

/**
 * Event fired when a study is deleted
 */
export interface StudyDeletedEvent extends DomainEvent {
  readonly type: 'StudyDeleted';
  readonly studyId: string;
}

/**
 * Event fired when questions are generated
 */
export interface QuestionsGeneratedEvent extends DomainEvent {
  readonly type: 'QuestionsGenerated';
  readonly studyId: string;
  readonly questions: ResearchQuestion[];
  readonly prompt: string;
}

/**
 * Event fired when sources are discovered
 */
export interface SourcesDiscoveredEvent extends DomainEvent {
  readonly type: 'SourcesDiscovered';
  readonly studyId: string;
  readonly sources: ResearchSource[];
  readonly query: string;
}

/**
 * Event fired when a summary is generated
 */
export interface SummaryGeneratedEvent extends DomainEvent {
  readonly type: 'SummaryGenerated';
  readonly sourceId: string;
  readonly summary: ResearchSummary;
}

/**
 * Event fired when an interview is formatted
 */
export interface InterviewFormattedEvent extends DomainEvent {
  readonly type: 'InterviewFormatted';
  readonly studyId: string;
  readonly participantId: string;
  readonly interview: Interview;
}

/**
 * Event fired when insights are synthesized
 */
export interface InsightsSynthesizedEvent extends DomainEvent {
  readonly type: 'InsightsSynthesized';
  readonly studyId: string;
  readonly insights: ResearchInsight[];
  readonly sourceArtifacts: string[];
}

// ============================================================================
// Domain Exceptions
// ============================================================================

/**
 * Base class for domain exceptions
 */
export abstract class DomainException extends Error {
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
 * Exception thrown when a study is not found
 */
export class StudyNotFoundException extends DomainException {
  readonly code = 'STUDY_NOT_FOUND';
  readonly statusCode = 404;
  
  constructor(studyId: string) {
    super(`Study with ID '${studyId}' not found`, { studyId });
  }
}

/**
 * Exception thrown when a study name is invalid
 */
export class InvalidStudyNameException extends DomainException {
  readonly code = 'INVALID_STUDY_NAME';
  readonly statusCode = 400;
  
  constructor(name: string) {
    super(`Invalid study name: '${name}'`, { name });
  }
}

/**
 * Exception thrown when a study is in an invalid state for an operation
 */
export class InvalidStudyStateException extends DomainException {
  readonly code = 'INVALID_STUDY_STATE';
  readonly statusCode = 400;
  
  constructor(studyId: string, currentState: StudyStatus, requiredState: StudyStatus) {
    super(
      `Study '${studyId}' is in state '${currentState}' but operation requires '${requiredState}'`,
      { studyId, currentState, requiredState }
    );
  }
}

/**
 * Exception thrown when a research artifact is not found
 */
export class ArtifactNotFoundException extends DomainException {
  readonly code = 'ARTIFACT_NOT_FOUND';
  readonly statusCode = 404;
  
  constructor(artifactType: string, artifactId: string) {
    super(`${artifactType} with ID '${artifactId}' not found`, { artifactType, artifactId });
  }
}

/**
 * Exception thrown when AI agent communication fails
 */
export class AIAgentException extends DomainException {
  readonly code = 'AI_AGENT_ERROR';
  readonly statusCode = 502;
  
  constructor(agent: string, operation: string, originalError: Error) {
    super(
      `AI agent '${agent}' failed during '${operation}': ${originalError.message}`,
      { agent, operation, originalError: originalError.message }
    );
  }
}

// ============================================================================
// Value Objects
// ============================================================================

/**
 * Represents a study ID value object
 */
export class StudyId {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new InvalidStudyNameException(value);
    }
  }
  
  private isValid(value: string): boolean {
    return typeof value === 'string' && value.length > 0 && value.length <= 100;
  }
  
  equals(other: StudyId): boolean {
    return this.value === other.value;
  }
  
  toString(): string {
    return this.value;
  }
}

/**
 * Represents a participant ID value object
 */
export class ParticipantId {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid participant ID: ${value}`);
    }
  }
  
  private isValid(value: string): boolean {
    return typeof value === 'string' && value.length > 0 && value.length <= 50;
  }
  
  equals(other: ParticipantId): boolean {
    return this.value === other.value;
  }
  
  toString(): string {
    return this.value;
  }
}

/**
 * Represents a file path value object
 */
export class FilePath {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid file path: ${value}`);
    }
  }
  
  private isValid(value: string): boolean {
    return typeof value === 'string' && value.length > 0;
  }
  
  getDirectory(): string {
    return this.value.substring(0, this.value.lastIndexOf('/'));
  }
  
  getFileName(): string {
    return this.value.substring(this.value.lastIndexOf('/') + 1);
  }
  
  getExtension(): string {
    const fileName = this.getFileName();
    const lastDot = fileName.lastIndexOf('.');
    return lastDot > 0 ? fileName.substring(lastDot + 1) : '';
  }
  
  equals(other: FilePath): boolean {
    return this.value === other.value;
  }
  
  toString(): string {
    return this.value;
  }
}