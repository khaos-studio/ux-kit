# UX-Kit Data Model Specification

## Domain Entities

### Core Research Entities

#### ResearchStudy
```typescript
interface ResearchStudy {
  id: string;                    // UUID v4
  name: string;                  // Human-readable study name
  description: string;           // Study description
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last modification timestamp
  status: StudyStatus;          // Current study status
  metadata: StudyMetadata;      // Additional study information
}

enum StudyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

interface StudyMetadata {
  tags: string[];               // Study tags for categorization
  owner: string;                // Study owner/creator
  team: string[];               // Team members with access
  deadline?: Date;              // Optional study deadline
  priority: Priority;           // Study priority level
}
```

#### ResearchQuestion
```typescript
interface ResearchQuestion {
  id: string;                   // UUID v4
  studyId: string;              // Reference to parent study
  question: string;             // The research question text
  priority: Priority;           // Question priority
  category: QuestionCategory;   // Question categorization
  status: QuestionStatus;       // Question status
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last modification timestamp
  context: QuestionContext;     // Additional context information
}

enum QuestionCategory {
  USER_BEHAVIOR = 'user_behavior',
  USABILITY = 'usability',
  SATISFACTION = 'satisfaction',
  PERFORMANCE = 'performance',
  ACCESSIBILITY = 'accessibility',
  BUSINESS_IMPACT = 'business_impact'
}

enum QuestionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ANSWERED = 'answered',
  DEPRECATED = 'deprecated'
}

interface QuestionContext {
  assumptions: string[];        // Underlying assumptions
  successCriteria: string[];    // Success criteria for the question
  relatedQuestions: string[];   // IDs of related questions
}
```

#### ResearchSource
```typescript
interface ResearchSource {
  id: string;                   // UUID v4
  studyId: string;              // Reference to parent study
  title: string;                // Source title
  url?: string;                 // URL if web source
  filePath?: string;            // Local file path if file source
  type: SourceType;             // Source type classification
  addedAt: Date;                // When source was added
  metadata: SourceMetadata;     // Additional source information
  content?: string;             // Cached content (optional)
}

enum SourceType {
  WEB_ARTICLE = 'web_article',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  DATA_FILE = 'data_file',
  INTERVIEW = 'interview',
  SURVEY = 'survey',
  ANALYTICS = 'analytics'
}

interface SourceMetadata {
  author?: string;              // Source author
  publicationDate?: Date;       // Publication date
  credibility: CredibilityLevel; // Source credibility assessment
  relevance: RelevanceLevel;    // Relevance to study
  tags: string[];               // Source tags
  summary?: string;             // Brief source summary
}

enum CredibilityLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNKNOWN = 'unknown'
}

enum RelevanceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}
```

#### ResearchSummary
```typescript
interface ResearchSummary {
  id: string;                   // UUID v4
  sourceId: string;             // Reference to source
  content: string;              // Summary content
  keyPoints: string[];          // Extracted key points
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last modification timestamp
  metadata: SummaryMetadata;    // Summary metadata
}

interface SummaryMetadata {
  wordCount: number;            // Summary word count
  confidence: number;           // AI confidence score (0-1)
  method: SummaryMethod;        // Method used for summarization
  language: string;             // Summary language
  keyTopics: string[];          // Identified key topics
}

enum SummaryMethod {
  AI_GENERATED = 'ai_generated',
  MANUAL = 'manual',
  HYBRID = 'hybrid'
}
```

#### Interview
```typescript
interface Interview {
  id: string;                   // UUID v4
  studyId: string;              // Reference to parent study
  participantId: string;        // Participant identifier
  transcript: string;           // Interview transcript
  insights: string[];           // Extracted insights
  conductedAt: Date;            // Interview date/time
  metadata: InterviewMetadata;  // Interview metadata
}

interface InterviewMetadata {
  duration: number;             // Interview duration in minutes
  interviewer: string;          // Interviewer name
  method: InterviewMethod;      // Interview method
  language: string;             // Interview language
  quality: QualityRating;       // Interview quality rating
  keyThemes: string[];          // Identified key themes
}

enum InterviewMethod {
  STRUCTURED = 'structured',
  SEMI_STRUCTURED = 'semi_structured',
  UNSTRUCTURED = 'unstructured',
  FOCUS_GROUP = 'focus_group'
}

enum QualityRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}
```

#### ResearchInsight
```typescript
interface ResearchInsight {
  id: string;                   // UUID v4
  studyId: string;              // Reference to parent study
  title: string;                // Insight title
  description: string;          // Detailed insight description
  evidence: string[];           // Supporting evidence
  priority: Priority;           // Insight priority
  category: InsightCategory;    // Insight categorization
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last modification timestamp
  metadata: InsightMetadata;    // Insight metadata
}

enum InsightCategory {
  USER_NEED = 'user_need',
  PAIN_POINT = 'pain_point',
  OPPORTUNITY = 'opportunity',
  BEHAVIOR_PATTERN = 'behavior_pattern',
  PREFERENCE = 'preference',
  BARRIER = 'barrier'
}

interface InsightMetadata {
  confidence: number;           // Confidence score (0-1)
  impact: ImpactLevel;          // Potential impact level
  effort: EffortLevel;          // Implementation effort level
  sourceCount: number;          // Number of supporting sources
  tags: string[];               // Insight tags
  recommendations: string[];    // Actionable recommendations
}

enum ImpactLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

enum EffortLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}
```

### Supporting Types

#### Priority
```typescript
enum Priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}
```

#### ResearchContext
```typescript
interface ResearchContext {
  studyId: string;              // Current study context
  userId: string;               // Current user
  sessionId: string;            // Current session
  timestamp: Date;              // Context timestamp
  metadata: Record<string, any>; // Additional context data
}
```

#### ResearchArtifact
```typescript
type ResearchArtifact = 
  | ResearchQuestion 
  | ResearchSource 
  | ResearchSummary 
  | Interview 
  | ResearchInsight;
```

## Application Layer Models

### Request/Response Models

#### CreateStudyRequest
```typescript
interface CreateStudyRequest {
  name: string;
  description: string;
  metadata?: Partial<StudyMetadata>;
}
```

#### GenerateQuestionsRequest
```typescript
interface GenerateQuestionsRequest {
  studyId: string;
  prompt: string;
  context?: ResearchContext;
  maxQuestions?: number;
  categories?: QuestionCategory[];
}
```

#### ProcessSourcesRequest
```typescript
interface ProcessSourcesRequest {
  studyId: string;
  sources: SourceInput[];
  autoDiscover?: boolean;
  context?: ResearchContext;
}

interface SourceInput {
  title: string;
  url?: string;
  filePath?: string;
  type: SourceType;
  metadata?: Partial<SourceMetadata>;
}
```

#### SummarizeSourceRequest
```typescript
interface SummarizeSourceRequest {
  sourceId: string;
  method?: SummaryMethod;
  maxLength?: number;
  context?: ResearchContext;
}
```

#### FormatInterviewRequest
```typescript
interface FormatInterviewRequest {
  studyId: string;
  participantId: string;
  transcript: string;
  metadata?: Partial<InterviewMetadata>;
  context?: ResearchContext;
}
```

#### SynthesizeInsightsRequest
```typescript
interface SynthesizeInsightsRequest {
  studyId: string;
  artifacts: ResearchArtifact[];
  format?: OutputFormat;
  context?: ResearchContext;
}

enum OutputFormat {
  MARKDOWN = 'markdown',
  JSON = 'json',
  HTML = 'html',
  PDF = 'pdf'
}
```

## Infrastructure Layer Models

### Configuration Models

#### UXKitConfig
```typescript
interface UXKitConfig {
  version: string;
  aiAgent: AIConfig;
  storage: StorageConfig;
  research: ResearchConfig;
  logging: LoggingConfig;
}

interface AIConfig {
  provider: AIProvider;
  settings: Record<string, any>;
  timeout: number;
  retryAttempts: number;
}

interface StorageConfig {
  basePath: string;
  format: StorageFormat;
  compression: boolean;
  encryption: boolean;
}

interface ResearchConfig {
  defaultTemplates: string[];
  autoSave: boolean;
  maxFileSize: number;
  supportedFormats: string[];
}

interface LoggingConfig {
  level: LogLevel;
  format: LogFormat;
  output: LogOutput;
  retention: number;
}

enum AIProvider {
  CURSOR = 'cursor',
  CODEX = 'codex',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  CUSTOM = 'custom'
}

enum StorageFormat {
  MARKDOWN = 'markdown',
  JSON = 'json',
  YAML = 'yaml'
}

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

enum LogFormat {
  JSON = 'json',
  TEXT = 'text'
}

enum LogOutput {
  CONSOLE = 'console',
  FILE = 'file',
  BOTH = 'both'
}
```

### Command Models

#### CommandDefinition
```typescript
interface CommandDefinition {
  name: string;
  description: string;
  arguments: CommandArgument[];
  options: CommandOption[];
  handler: ICommandHandler;
  prerequisites: string[];
  examples: CommandExample[];
}

interface CommandArgument {
  name: string;
  description: string;
  required: boolean;
  type: ArgumentType;
  validation?: ValidationRule[];
}

interface CommandOption {
  name: string;
  description: string;
  short?: string;
  long: string;
  type: OptionType;
  default?: any;
  required: boolean;
  validation?: ValidationRule[];
}

interface CommandExample {
  command: string;
  description: string;
}

enum ArgumentType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  FILE = 'file',
  DIRECTORY = 'directory'
}

enum OptionType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array'
}

interface ValidationRule {
  type: ValidationType;
  value?: any;
  message: string;
}

enum ValidationType {
  REQUIRED = 'required',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
  PATTERN = 'pattern',
  RANGE = 'range',
  CUSTOM = 'custom'
}
```

### Error Models

#### UXKitError
```typescript
class UXKitError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public context?: Record<string, any>,
    public cause?: Error
  ) {
    super(message);
    this.name = 'UXKitError';
  }
}

enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AI_AGENT_ERROR = 'AI_AGENT_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  COMMAND_ERROR = 'COMMAND_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR'
}
```

## Data Validation

### Validation Rules
- All UUIDs must be valid UUID v4 format
- Dates must be valid ISO 8601 format
- Priority levels must be one of the defined enum values
- File paths must be valid and accessible
- URLs must be valid HTTP/HTTPS URLs
- Text fields have appropriate length limits
- Numeric fields have appropriate ranges

### Data Integrity
- Foreign key relationships must be maintained
- Cascade deletion rules for related entities
- Unique constraints on appropriate fields
- Data consistency checks across related entities

This data model provides a comprehensive foundation for the UX-Kit TypeScript CLI implementation, ensuring type safety, data integrity, and extensibility while following clean architecture principles.
