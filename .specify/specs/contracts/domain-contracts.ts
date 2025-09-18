/**
 * Domain Layer Contracts
 * 
 * These interfaces define the core business logic contracts
 * for the UX-Kit domain layer. They represent the purest
 * form of business rules and are independent of any
 * external concerns.
 */

// ============================================================================
// Core Domain Entities
// ============================================================================

export interface ResearchStudy {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: StudyStatus;
  readonly metadata: StudyMetadata;
}

export interface StudyMetadata {
  readonly tags: string[];
  readonly owner: string;
  readonly team: string[];
  readonly deadline?: Date;
  readonly priority: Priority;
}

export enum StudyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum Priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// ============================================================================
// Research Question Contracts
// ============================================================================

export interface ResearchQuestion {
  readonly id: string;
  readonly studyId: string;
  readonly question: string;
  readonly priority: Priority;
  readonly category: QuestionCategory;
  readonly status: QuestionStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly context: QuestionContext;
}

export interface QuestionContext {
  readonly assumptions: string[];
  readonly successCriteria: string[];
  readonly relatedQuestions: string[];
}

export enum QuestionCategory {
  USER_BEHAVIOR = 'user_behavior',
  USABILITY = 'usability',
  SATISFACTION = 'satisfaction',
  PERFORMANCE = 'performance',
  ACCESSIBILITY = 'accessibility',
  BUSINESS_IMPACT = 'business_impact'
}

export enum QuestionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ANSWERED = 'answered',
  DEPRECATED = 'deprecated'
}

// ============================================================================
// Research Source Contracts
// ============================================================================

export interface ResearchSource {
  readonly id: string;
  readonly studyId: string;
  readonly title: string;
  readonly url?: string;
  readonly filePath?: string;
  readonly type: SourceType;
  readonly addedAt: Date;
  readonly metadata: SourceMetadata;
  readonly content?: string;
}

export interface SourceMetadata {
  readonly author?: string;
  readonly publicationDate?: Date;
  readonly credibility: CredibilityLevel;
  readonly relevance: RelevanceLevel;
  readonly tags: string[];
  readonly summary?: string;
}

export enum SourceType {
  WEB_ARTICLE = 'web_article',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  DATA_FILE = 'data_file',
  INTERVIEW = 'interview',
  SURVEY = 'survey',
  ANALYTICS = 'analytics'
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

// ============================================================================
// Research Summary Contracts
// ============================================================================

export interface ResearchSummary {
  readonly id: string;
  readonly sourceId: string;
  readonly content: string;
  readonly keyPoints: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly metadata: SummaryMetadata;
}

export interface SummaryMetadata {
  readonly wordCount: number;
  readonly confidence: number;
  readonly method: SummaryMethod;
  readonly language: string;
  readonly keyTopics: string[];
}

export enum SummaryMethod {
  AI_GENERATED = 'ai_generated',
  MANUAL = 'manual',
  HYBRID = 'hybrid'
}

// ============================================================================
// Interview Contracts
// ============================================================================

export interface Interview {
  readonly id: string;
  readonly studyId: string;
  readonly participantId: string;
  readonly transcript: string;
  readonly insights: string[];
  readonly conductedAt: Date;
  readonly metadata: InterviewMetadata;
}

export interface InterviewMetadata {
  readonly duration: number;
  readonly interviewer: string;
  readonly method: InterviewMethod;
  readonly language: string;
  readonly quality: QualityRating;
  readonly keyThemes: string[];
}

export enum InterviewMethod {
  STRUCTURED = 'structured',
  SEMI_STRUCTURED = 'semi_structured',
  UNSTRUCTURED = 'unstructured',
  FOCUS_GROUP = 'focus_group'
}

export enum QualityRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

// ============================================================================
// Research Insight Contracts
// ============================================================================

export interface ResearchInsight {
  readonly id: string;
  readonly studyId: string;
  readonly title: string;
  readonly description: string;
  readonly evidence: string[];
  readonly priority: Priority;
  readonly category: InsightCategory;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly metadata: InsightMetadata;
}

export interface InsightMetadata {
  readonly confidence: number;
  readonly impact: ImpactLevel;
  readonly effort: EffortLevel;
  readonly sourceCount: number;
  readonly tags: string[];
  readonly recommendations: string[];
}

export enum InsightCategory {
  USER_NEED = 'user_need',
  PAIN_POINT = 'pain_point',
  OPPORTUNITY = 'opportunity',
  BEHAVIOR_PATTERN = 'behavior_pattern',
  PREFERENCE = 'preference',
  BARRIER = 'barrier'
}

export enum ImpactLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum EffortLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// ============================================================================
// Domain Value Objects
// ============================================================================

export interface ResearchContext {
  readonly studyId: string;
  readonly userId: string;
  readonly sessionId: string;
  readonly timestamp: Date;
  readonly metadata: Record<string, any>;
}

export type ResearchArtifact = 
  | ResearchQuestion 
  | ResearchSource 
  | ResearchSummary 
  | Interview 
  | ResearchInsight;

// ============================================================================
// Domain Services Contracts
// ============================================================================

export interface IStudyDomainService {
  canCreateStudy(name: string, description: string): boolean;
  canUpdateStudy(study: ResearchStudy, updates: Partial<ResearchStudy>): boolean;
  canDeleteStudy(study: ResearchStudy): boolean;
  validateStudyMetadata(metadata: StudyMetadata): ValidationResult;
}

export interface IQuestionDomainService {
  canCreateQuestion(studyId: string, question: string): boolean;
  canUpdateQuestion(question: ResearchQuestion, updates: Partial<ResearchQuestion>): boolean;
  canDeleteQuestion(question: ResearchQuestion): boolean;
  validateQuestionContext(context: QuestionContext): ValidationResult;
}

export interface ISourceDomainService {
  canAddSource(studyId: string, source: ResearchSource): boolean;
  canUpdateSource(source: ResearchSource, updates: Partial<ResearchSource>): boolean;
  canDeleteSource(source: ResearchSource): boolean;
  validateSourceMetadata(metadata: SourceMetadata): ValidationResult;
}

export interface ISummaryDomainService {
  canCreateSummary(sourceId: string, content: string): boolean;
  canUpdateSummary(summary: ResearchSummary, updates: Partial<ResearchSummary>): boolean;
  canDeleteSummary(summary: ResearchSummary): boolean;
  validateSummaryContent(content: string): ValidationResult;
}

export interface IInterviewDomainService {
  canCreateInterview(studyId: string, participantId: string): boolean;
  canUpdateInterview(interview: Interview, updates: Partial<Interview>): boolean;
  canDeleteInterview(interview: Interview): boolean;
  validateInterviewMetadata(metadata: InterviewMetadata): ValidationResult;
}

export interface IInsightDomainService {
  canCreateInsight(studyId: string, title: string): boolean;
  canUpdateInsight(insight: ResearchInsight, updates: Partial<ResearchInsight>): boolean;
  canDeleteInsight(insight: ResearchInsight): boolean;
  validateInsightMetadata(metadata: InsightMetadata): ValidationResult;
}

// ============================================================================
// Validation Contracts
// ============================================================================

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
// Domain Events
// ============================================================================

export interface DomainEvent {
  readonly id: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly data: Record<string, any>;
}

export interface StudyCreatedEvent extends DomainEvent {
  readonly type: 'StudyCreated';
  readonly data: {
    readonly study: ResearchStudy;
  };
}

export interface StudyUpdatedEvent extends DomainEvent {
  readonly type: 'StudyUpdated';
  readonly data: {
    readonly study: ResearchStudy;
    readonly changes: Record<string, any>;
  };
}

export interface StudyDeletedEvent extends DomainEvent {
  readonly type: 'StudyDeleted';
  readonly data: {
    readonly studyId: string;
  };
}

export interface QuestionGeneratedEvent extends DomainEvent {
  readonly type: 'QuestionGenerated';
  readonly data: {
    readonly studyId: string;
    readonly questions: ResearchQuestion[];
  };
}

export interface SourceAddedEvent extends DomainEvent {
  readonly type: 'SourceAdded';
  readonly data: {
    readonly studyId: string;
    readonly source: ResearchSource;
  };
}

export interface SummaryCreatedEvent extends DomainEvent {
  readonly type: 'SummaryCreated';
  readonly data: {
    readonly sourceId: string;
    readonly summary: ResearchSummary;
  };
}

export interface InterviewFormattedEvent extends DomainEvent {
  readonly type: 'InterviewFormatted';
  readonly data: {
    readonly studyId: string;
    readonly interview: Interview;
  };
}

export interface InsightsSynthesizedEvent extends DomainEvent {
  readonly type: 'InsightsSynthesized';
  readonly data: {
    readonly studyId: string;
    readonly insights: ResearchInsight[];
  };
}

export type UXKitDomainEvent = 
  | StudyCreatedEvent
  | StudyUpdatedEvent
  | StudyDeletedEvent
  | QuestionGeneratedEvent
  | SourceAddedEvent
  | SummaryCreatedEvent
  | InterviewFormattedEvent
  | InsightsSynthesizedEvent;
