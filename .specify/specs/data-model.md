# UX-Kit Data Model Specification

## Overview

This document defines the data model for the UX-Kit TypeScript CLI implementation, following a simple file-based approach inspired by GitHub's spec-kit. The system generates text files and scripts to support AI agent research workflows in IDEs.

## File Structure Model

### Research Study Directory
Central directory representing a complete research effort.

```typescript
interface ResearchStudyDirectory {
  id: string;                    // UUID v4
  name: string;                  // Human-readable study name
  description?: string;          // Optional study description
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last modification timestamp
  status: StudyStatus;          // Current study status
  path: string;                 // File system path
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
  priority: Priority;           // Study priority level
  estimatedDuration?: number;   // Estimated duration in days
  actualDuration?: number;      // Actual duration in days
  teamMembers: string[];        // Team member identifiers
}

enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
```

### Generated Files

#### Questions File
```typescript
interface QuestionsFile {
  studyId: string;
  generatedAt: Date;
  questions: ResearchQuestion[];
  metadata: {
    prompt: string;
    aiAgent: string;
    version: string;
  };
}

interface ResearchQuestion {
  id: string;
  question: string;
  priority: Priority;
  category: QuestionCategory;
  context?: string;
}

enum QuestionCategory {
  USER_BEHAVIOR = 'user_behavior',
  USABILITY = 'usability',
  ACCESSIBILITY = 'accessibility',
  PERFORMANCE = 'performance',
  CONTENT = 'content',
  NAVIGATION = 'navigation',
  FEEDBACK = 'feedback',
  OTHER = 'other'
}
```

#### Sources File
```typescript
interface SourcesFile {
  studyId: string;
  generatedAt: Date;
  sources: ResearchSource[];
  metadata: {
    autoDiscovered: boolean;
    aiAgent: string;
    version: string;
  };
}

interface ResearchSource {
  id: string;
  title: string;
  url?: string;
  filePath?: string;
  type: SourceType;
  addedAt: Date;
  metadata: SourceMetadata;
}

enum SourceType {
  WEB = 'web',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
  OTHER = 'other'
}

interface SourceMetadata {
  description?: string;
  tags: string[];
  relevance: RelevanceLevel;
  credibility: CredibilityLevel;
}

enum RelevanceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

enum CredibilityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  PEER_REVIEWED = 'peer_reviewed'
}
```

#### Summary File
```typescript
interface SummaryFile {
  sourceId: string;
  studyId: string;
  generatedAt: Date;
  summary: ResearchSummary;
  metadata: {
    aiAgent: string;
    version: string;
    processingTime: number;
  };
}

interface ResearchSummary {
  id: string;
  content: string;
  keyPoints: string[];
  insights: string[];
  recommendations: string[];
  metadata: SummaryMetadata;
}

interface SummaryMetadata {
  wordCount: number;
  readingTime: number;
  confidence: ConfidenceLevel;
  topics: string[];
}

enum ConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

#### Interview File
```typescript
interface InterviewFile {
  studyId: string;
  participantId: string;
  generatedAt: Date;
  interview: Interview;
  metadata: {
    aiAgent: string;
    version: string;
    processingTime: number;
  };
}

interface Interview {
  id: string;
  participantId: string;
  transcript: string;
  insights: string[];
  quotes: InterviewQuote[];
  metadata: InterviewMetadata;
}

interface InterviewQuote {
  id: string;
  text: string;
  timestamp?: number;
  speaker: 'participant' | 'interviewer';
  sentiment: Sentiment;
  importance: Priority;
}

interface InterviewMetadata {
  duration: number;
  participantInfo: ParticipantInfo;
  topics: string[];
  keyThemes: string[];
}

interface ParticipantInfo {
  id: string;
  demographics?: Demographics;
  experience?: Experience;
}

interface Demographics {
  age?: string;
  gender?: string;
  location?: string;
  occupation?: string;
}

interface Experience {
  level: ExperienceLevel;
  domain?: string;
  years?: number;
}

enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

enum Sentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  MIXED = 'mixed'
}
```

#### Insights File
```typescript
interface InsightsFile {
  studyId: string;
  generatedAt: Date;
  insights: ResearchInsight[];
  metadata: {
    aiAgent: string;
    version: string;
    sourceArtifacts: string[];
  };
}

interface ResearchInsight {
  id: string;
  title: string;
  description: string;
  evidence: string[];
  priority: Priority;
  category: InsightCategory;
  confidence: ConfidenceLevel;
  impact: ImpactLevel;
  effort: EffortLevel;
  recommendations: string[];
  metadata: InsightMetadata;
}

enum InsightCategory {
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

enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

enum EffortLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

interface InsightMetadata {
  sourceCount: number;
  evidenceStrength: EvidenceStrength;
  validationStatus: ValidationStatus;
  assignedTo?: string;
  dueDate?: Date;
}

enum EvidenceStrength {
  WEAK = 'weak',
  MODERATE = 'moderate',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong'
}

enum ValidationStatus {
  UNVALIDATED = 'unvalidated',
  IN_PROGRESS = 'in_progress',
  VALIDATED = 'validated',
  REJECTED = 'rejected'
}
```

## Configuration Model

### UX-Kit Configuration
```typescript
interface UXKitConfig {
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
```

### Template Configuration
```typescript
interface TemplateConfig {
  name: string;
  description: string;
  type: TemplateType;
  path: string;
  variables: TemplateVariable[];
  metadata: TemplateMetadata;
}

enum TemplateType {
  QUESTIONS = 'questions',
  SOURCES = 'sources',
  SUMMARY = 'summary',
  INTERVIEW = 'interview',
  INSIGHTS = 'insights',
  CUSTOM = 'custom'
}

interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  description: string;
}

interface TemplateMetadata {
  version: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}
```

## File System Structure

### Directory Layout
```
.uxkit/
├── config.yaml                 # Main configuration file
├── memory/                     # Persistent context
│   ├── principles.md          # Research principles
│   ├── methodologies.md       # Research methodologies
│   └── templates/             # Custom templates
│       ├── questions-template.md
│       ├── sources-template.md
│       ├── summary-template.md
│       ├── interview-template.md
│       └── insights-template.md
└── studies/                    # Research studies
    ├── 001-user-onboarding/
    │   ├── questions.md
    │   ├── sources.md
    │   ├── summaries/
    │   │   ├── source-001-summary.md
    │   │   └── source-002-summary.md
    │   ├── interviews/
    │   │   ├── participant-001-interview.md
    │   │   └── participant-002-interview.md
    │   └── insights.md
    └── 002-checkout-flow/
        ├── questions.md
        ├── sources.md
        └── insights.md
```

### File Naming Conventions
- **Study directories**: `{id}-{kebab-case-name}`
- **Question files**: `questions.md`
- **Source files**: `sources.md`
- **Summary files**: `{source-id}-summary.md`
- **Interview files**: `{participant-id}-interview.md`
- **Insight files**: `insights.md`

## Data Validation

### File Validation Rules
```typescript
interface ValidationRule {
  field: string;
  type: 'required' | 'format' | 'range' | 'enum' | 'custom';
  value?: any;
  message: string;
}

interface FileValidationSchema {
  fileType: string;
  rules: ValidationRule[];
  dependencies?: string[];
}
```

### Validation Schemas
```typescript
const VALIDATION_SCHEMAS: Record<string, FileValidationSchema> = {
  questions: {
    fileType: 'questions',
    rules: [
      { field: 'studyId', type: 'required', message: 'Study ID is required' },
      { field: 'questions', type: 'required', message: 'Questions array is required' },
      { field: 'questions[].question', type: 'required', message: 'Question text is required' }
    ]
  },
  sources: {
    fileType: 'sources',
    rules: [
      { field: 'studyId', type: 'required', message: 'Study ID is required' },
      { field: 'sources', type: 'required', message: 'Sources array is required' },
      { field: 'sources[].title', type: 'required', message: 'Source title is required' }
    ]
  }
  // ... other schemas
};
```

## Data Migration

### Version Management
```typescript
interface DataMigration {
  fromVersion: string;
  toVersion: string;
  description: string;
  steps: MigrationStep[];
}

interface MigrationStep {
  type: 'transform' | 'rename' | 'add' | 'remove';
  description: string;
  action: (data: any) => any;
}
```

### Migration Examples
```typescript
const MIGRATIONS: DataMigration[] = [
  {
    fromVersion: '1.0.0',
    toVersion: '1.1.0',
    description: 'Add metadata to all file types',
    steps: [
      {
        type: 'add',
        description: 'Add metadata field to questions file',
        action: (data) => ({ ...data, metadata: { version: '1.1.0' } })
      }
    ]
  }
];
```

## Summary

This data model provides a simple, file-based approach to managing UX research data that:

1. **Leverages file system**: Uses directories and files instead of complex databases
2. **Supports AI agents**: Generates structured files that AI agents can easily process
3. **Maintains version control**: All files are version-controlled and trackable
4. **Enables collaboration**: Files can be shared and edited by team members
5. **Provides flexibility**: Easy to extend and modify without complex migrations
6. **Follows spec-kit inspiration**: Similar to GitHub's spec-kit approach for structured workflows

The model balances simplicity with functionality, making it easy to implement while providing all necessary features for comprehensive UX research workflows.