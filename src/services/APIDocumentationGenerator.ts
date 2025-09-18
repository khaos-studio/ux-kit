/**
 * API Documentation Generator
 * 
 * Generates comprehensive API documentation for UX-Kit services and interfaces.
 * This includes service documentation, contract definitions, and usage examples.
 */

import { IFileSystemService } from '../contracts/infrastructure-contracts';

export class APIDocumentationGenerator {
  constructor(private fileSystem: IFileSystemService) {}

  /**
   * Generate API documentation
   */
  async generateAPIDocumentation(projectRoot: string, outputPath: string): Promise<void> {
    const apiPath = `${outputPath}/api`;
    await this.fileSystem.ensureDirectoryExists(apiPath);

    // Generate all API documentation
    await Promise.all([
      this.generateAPIReadme(apiPath),
      this.generateServicesDoc(apiPath),
      this.generateContractsDoc(apiPath),
      this.generateExamplesDoc(apiPath)
    ]);
  }

  /**
   * Generate main API README
   */
  private async generateAPIReadme(apiPath: string): Promise<void> {
    const content = `# API Documentation

UX-Kit provides a comprehensive API for programmatic access to research workflows and data management.

## Overview

The UX-Kit API is organized into several layers:

- **Services**: High-level business logic and workflows
- **Contracts**: Interface definitions and data structures
- **Utilities**: Helper functions and common operations
- **Generators**: File and content generation utilities

## API Structure

\`\`\`
src/
├── services/           # Business logic services
│   ├── StudyService.ts
│   ├── ResearchService.ts
│   ├── TemplateService.ts
│   └── DocumentationGenerator.ts
├── contracts/          # Interface definitions
│   ├── infrastructure-contracts.ts
│   └── presentation-contracts.ts
├── generators/         # Content generators
│   ├── FileGenerator.ts
│   ├── MarkdownGenerator.ts
│   └── DirectoryGenerator.ts
└── utils/             # Utility functions
    ├── FileSystemService.ts
    ├── PathUtils.ts
    └── ValidationService.ts
\`\`\`

## Services

### StudyService
Manages research studies and study-related operations.

**Key Methods:**
- \`createStudy(name, description, projectRoot)\`: Create a new study
- \`listStudies(projectRoot)\`: List all studies
- \`getStudy(studyId, projectRoot)\`: Get study details
- \`deleteStudy(studyId, projectRoot)\`: Delete a study

### ResearchService
Handles research workflow operations and artifact generation.

**Key Methods:**
- \`generateQuestions(studyId, projectRoot)\`: Generate research questions
- \`generateSources(studyId, projectRoot)\`: Generate sources template
- \`generateSummary(studyId, projectRoot)\`: Generate research summary
- \`generateInterview(studyId, projectRoot)\`: Generate interview template
- \`generateSynthesis(studyId, projectRoot)\`: Generate research synthesis

### TemplateService
Manages template operations and template rendering.

**Key Methods:**
- \`loadTemplate(templateName, projectRoot)\`: Load template content
- \`renderTemplate(template, data)\`: Render template with data
- \`validateTemplate(template)\`: Validate template syntax
- \`listTemplates(projectRoot)\`: List available templates

## Contracts

### Infrastructure Contracts
Define interfaces for infrastructure layer components.

**Key Interfaces:**
- \`IFileSystemService\`: File system operations
- \`IValidationService\`: Input validation
- \`IConfigurationService\`: Configuration management

### Presentation Contracts
Define interfaces for presentation layer components.

**Key Interfaces:**
- \`IOutput\`: Output formatting and display
- \`IProgressIndicator\`: Progress indication
- \`ITableFormatter\`: Table formatting

## Examples

### Basic Study Management

\`\`\`typescript
import { StudyService } from './services/StudyService';
import { FileSystemService } from './utils/FileSystemService';

const fileSystem = new FileSystemService();
const studyService = new StudyService(fileSystem);

// Create a new study
const study = await studyService.createStudy(
  'User Onboarding Research',
  'Research into improving the new user onboarding flow',
  '/path/to/project'
);

console.log('Created study:', study.id);
\`\`\`

### Research Workflow

\`\`\`typescript
import { ResearchService } from './services/ResearchService';
import { FileGenerator } from './generators/FileGenerator';

const fileSystem = new FileSystemService();
const fileGenerator = new FileGenerator(fileSystem);
const researchService = new ResearchService(fileSystem, fileGenerator);

// Generate research questions
await researchService.generateQuestions('001-user-onboarding-research', '/path/to/project');

// Generate sources template
await researchService.generateSources('001-user-onboarding-research', '/path/to/project');

// Generate summary
await researchService.generateSummary('001-user-onboarding-research', '/path/to/project');
\`\`\`

### Template Operations

\`\`\`typescript
import { TemplateService } from './services/TemplateService';

const templateService = new TemplateService(fileSystem);

// Load and render template
const template = await templateService.loadTemplate('questions-template.md', '/path/to/project');
const rendered = await templateService.renderTemplate(template, {
  studyName: 'User Onboarding Research',
  studyDescription: 'Research into improving the new user onboarding flow',
  createdAt: new Date().toISOString()
});

console.log('Rendered template:', rendered);
\`\`\`

## Error Handling

All API methods return promises and can throw errors. Handle errors appropriately:

\`\`\`typescript
try {
  const study = await studyService.createStudy('My Study', '', '/path/to/project');
  console.log('Study created:', study.id);
} catch (error) {
  console.error('Failed to create study:', error.message);
}
\`\`\`

## TypeScript Support

UX-Kit is built with TypeScript and provides full type definitions:

\`\`\`typescript
import { StudyMetadata } from './services/StudyService';

const study: StudyMetadata = {
  id: '001-user-onboarding-research',
  name: 'User Onboarding Research',
  description: 'Research into improving the new user onboarding flow',
  basePath: '/path/to/project/.uxkit/studies/001-user-onboarding-research',
  createdAt: new Date(),
  updatedAt: new Date()
};
\`\`\`

## Testing

The API includes comprehensive test coverage:

\`\`\`bash
# Run all tests
npm test

# Run specific service tests
npm test -- --testPathPattern=StudyService

# Run with coverage
npm test -- --coverage
\`\`\`

## Contributing

When contributing to the API:

1. **Follow TypeScript best practices**
2. **Add comprehensive tests**
3. **Update documentation**
4. **Maintain backward compatibility**
5. **Follow the existing code style**

## See Also

- [Services Documentation](./services.md) - Detailed service documentation
- [Contracts Documentation](./contracts.md) - Interface definitions
- [Examples](./examples.md) - Usage examples and patterns
`;

    await this.fileSystem.writeFile(`${apiPath}/README.md`, content);
  }

  /**
   * Generate services documentation
   */
  private async generateServicesDoc(apiPath: string): Promise<void> {
    const content = `# Services

This document provides detailed documentation for all UX-Kit services.

## StudyService

Manages research studies and study-related operations.

### Constructor

\`\`\`typescript
constructor(fileSystem: IFileSystemService)
\`\`\`

### Methods

#### createStudy(name, description, projectRoot)

Creates a new research study.

### Parameters
- \`name\` (string): Study name
- \`description\` (string): Study description
- \`projectRoot\` (string): Project root directory

### Return Types
**Returns:** \`Promise<StudyMetadata>\`

**Example:**
\`\`\`typescript
const study = await studyService.createStudy(
  'User Onboarding Research',
  'Research into improving the new user onboarding flow',
  '/path/to/project'
);
\`\`\`

#### listStudies(projectRoot)

Lists all studies in the project.

**Parameters:**
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<StudyMetadata[]>\`

**Example:**
\`\`\`typescript
const studies = await studyService.listStudies('/path/to/project');
console.log('Found studies:', studies.length);
\`\`\`

#### getStudy(studyId, projectRoot)

Gets detailed information about a specific study.

**Parameters:**
- \`studyId\` (string): Study ID or name
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<StudyMetadata | undefined>\`

**Example:**
\`\`\`typescript
const study = await studyService.getStudy('001-user-onboarding-research', '/path/to/project');
if (study) {
  console.log('Study found:', study.name);
}
\`\`\`

#### deleteStudy(studyId, projectRoot)

Deletes a study and all its data.

**Parameters:**
- \`studyId\` (string): Study ID or name
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<void>\`

**Example:**
\`\`\`typescript
await studyService.deleteStudy('001-user-onboarding-research', '/path/to/project');
console.log('Study deleted');
\`\`\`

## ResearchService

Handles research workflow operations and artifact generation.

### Constructor

\`\`\`typescript
constructor(fileSystem: IFileSystemService, fileGenerator: FileGenerator)
\`\`\`

### Methods

#### generateQuestions(studyId, projectRoot)

Generates research questions for a study.

**Parameters:**
- \`studyId\` (string): Study ID or name
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<void>\`

**Example:**
\`\`\`typescript
await researchService.generateQuestions('001-user-onboarding-research', '/path/to/project');
\`\`\`

#### generateSources(studyId, projectRoot)

Generates sources template for a study.

**Parameters:**
- \`studyId\` (string): Study ID or name
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<void>\`

**Example:**
\`\`\`typescript
await researchService.generateSources('001-user-onboarding-research', '/path/to/project');
\`\`\`

#### generateSummary(studyId, projectRoot)

Generates research summary for a study.

**Parameters:**
- \`studyId\` (string): Study ID or name
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<void>\`

**Example:**
\`\`\`typescript
await researchService.generateSummary('001-user-onboarding-research', '/path/to/project');
\`\`\`

#### generateInterview(studyId, projectRoot)

Generates interview template for a study.

**Parameters:**
- \`studyId\` (string): Study ID or name
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<void>\`

**Example:**
\`\`\`typescript
await researchService.generateInterview('001-user-onboarding-research', '/path/to/project');
\`\`\`

#### generateSynthesis(studyId, projectRoot)

Generates research synthesis for a study.

**Parameters:**
- \`studyId\` (string): Study ID or name
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<void>\`

**Example:**
\`\`\`typescript
await researchService.generateSynthesis('001-user-onboarding-research', '/path/to/project');
\`\`\`

## TemplateService

Manages template operations and template rendering.

### Constructor

\`\`\`typescript
constructor(fileSystem: IFileSystemService)
\`\`\`

### Methods

#### loadTemplate(templateName, projectRoot)

Loads template content from file.

**Parameters:**
- \`templateName\` (string): Template file name
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<string>\`

**Example:**
\`\`\`typescript
const template = await templateService.loadTemplate('questions-template.md', '/path/to/project');
\`\`\`

#### renderTemplate(template, data)

Renders template with provided data.

**Parameters:**
- \`template\` (string): Template content
- \`data\` (object): Data to render in template

**Returns:** \`Promise<string>\`

**Example:**
\`\`\`typescript
const rendered = await templateService.renderTemplate(template, {
  studyName: 'User Onboarding Research',
  studyDescription: 'Research into improving the new user onboarding flow',
  createdAt: new Date().toISOString()
});
\`\`\`

#### validateTemplate(template)

Validates template syntax and structure.

**Parameters:**
- \`template\` (string): Template content

**Returns:** \`Promise<boolean>\`

**Example:**
\`\`\`typescript
const isValid = await templateService.validateTemplate(template);
if (!isValid) {
  console.error('Invalid template');
}
\`\`\`

#### listTemplates(projectRoot)

Lists all available templates.

**Parameters:**
- \`projectRoot\` (string): Project root directory

**Returns:** \`Promise<string[]>\`

**Example:**
\`\`\`typescript
const templates = await templateService.listTemplates('/path/to/project');
console.log('Available templates:', templates);
\`\`\`

## FileGenerator

Generates files and manages file operations.

### Constructor

\`\`\`typescript
constructor(fileSystem: IFileSystemService, templateEngine: TemplateEngine)
\`\`\`

### Methods

#### generateFile(templateName, outputPath, data)

Generates a file from a template.

**Parameters:**
- \`templateName\` (string): Template file name
- \`outputPath\` (string): Output file path
- \`data\` (object): Data to render in template

**Returns:** \`Promise<void>\`

**Example:**
\`\`\`typescript
await fileGenerator.generateFile(
  'questions-template.md',
  '/path/to/output/questions.md',
  { studyName: 'User Onboarding Research' }
);
\`\`\`

#### generateDirectory(path)

Creates a directory structure.

**Parameters:**
- \`path\` (string): Directory path

**Returns:** \`Promise<void>\`

**Example:**
\`\`\`typescript
await fileGenerator.generateDirectory('/path/to/study/directory');
\`\`\`

## Error Handling

All services can throw errors. Common error types:

- \`FileNotFoundError\`: Template or configuration file not found
- \`ValidationError\`: Invalid input data
- \`PermissionError\`: File system permission issues
- \`ConfigurationError\`: Invalid configuration

**Example:**
\`\`\`typescript
try {
  const study = await studyService.createStudy('My Study', '', '/path/to/project');
} catch (error) {
  if (error instanceof FileNotFoundError) {
    console.error('Template file not found');
  } else if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
\`\`\`

## Best Practices

1. **Always handle errors**: Use try-catch blocks for all service calls
2. **Validate inputs**: Check input parameters before calling services
3. **Use TypeScript**: Leverage type safety for better development experience
4. **Test thoroughly**: Write comprehensive tests for your service usage
5. **Follow patterns**: Use consistent patterns for service initialization and usage
`;

    await this.fileSystem.writeFile(`${apiPath}/services.md`, content);
  }

  /**
   * Generate contracts documentation
   */
  private async generateContractsDoc(apiPath: string): Promise<void> {
    const content = `# Contracts

This document defines the interface contracts used throughout UX-Kit.

## Infrastructure Contracts

### IFileSystemService

Defines the interface for file system operations.

\`\`\`typescript
interface IFileSystemService {
  createDirectory(path: string, recursive?: boolean): Promise<void>;
  ensureDirectoryExists(path: string): Promise<void>;
  writeFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  deleteDirectory(path: string, recursive?: boolean): Promise<void>;
  pathExists(path: string): Promise<boolean>;
  isDirectory(path: string): Promise<boolean>;
  listFiles(path: string, extension?: string): Promise<string[]>;
  listDirectories(path: string): Promise<string[]>;
  joinPaths(...paths: string[]): string;
  basename(path: string, ext?: string): string;
  dirname(path: string): string;
}
\`\`\`

**Methods:**

- \`createDirectory(path, recursive?)\`: Creates a directory
- \`ensureDirectoryExists(path)\`: Ensures directory exists
- \`writeFile(path, content)\`: Writes content to file
- \`readFile(path)\`: Reads file content
- \`deleteFile(path)\`: Deletes a file
- \`deleteDirectory(path, recursive?)\`: Deletes a directory
- \`pathExists(path)\`: Checks if path exists
- \`isDirectory(path)\`: Checks if path is a directory
- \`listFiles(path, extension?)\`: Lists files in directory
- \`listDirectories(path)\`: Lists directories
- \`joinPaths(...paths)\`: Joins path segments
- \`basename(path, ext?)\`: Gets basename of path
- \`dirname(path)\`: Gets directory name of path

### IValidationService

Defines the interface for input validation.

\`\`\`typescript
interface IValidationService {
  validateInput(input: any, rules: ValidationRule[]): Promise<ValidationResult>;
  validateConfiguration(config: any): Promise<ValidationResult>;
  validateFile(path: string): Promise<ValidationResult>;
}
\`\`\`

**Methods:**

- \`validateInput(input, rules)\`: Validates input data
- \`validateConfiguration(config)\`: Validates configuration
- \`validateFile(path)\`: Validates file content

### IConfigurationService

Defines the interface for configuration management.

\`\`\`typescript
interface IConfigurationService {
  loadConfiguration(path: string): Promise<Configuration>;
  saveConfiguration(config: Configuration, path: string): Promise<void>;
  getDefaultConfiguration(): Configuration;
  validateConfiguration(config: Configuration): Promise<ValidationResult>;
}
\`\`\`

**Methods:**

- \`loadConfiguration(path)\`: Loads configuration from file
- \`saveConfiguration(config, path)\`: Saves configuration to file
- \`getDefaultConfiguration()\`: Gets default configuration
- \`validateConfiguration(config)\`: Validates configuration

## Presentation Contracts

### IOutput

Defines the interface for output formatting and display.

\`\`\`typescript
interface IOutput {
  write(text: string): void;
  writeln(text: string): void;
  writeError(text: string): void;
  writeErrorln(text: string): void;
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
  clear(): void;
  flush(): void;
}
\`\`\`

**Methods:**

- \`write(text)\`: Writes text without newline
- \`writeln(text)\`: Writes text with newline
- \`writeError(text)\`: Writes error text
- \`writeErrorln(text)\`: Writes error text with newline
- \`success(message)\`: Writes success message
- \`error(message)\`: Writes error message
- \`warning(message)\`: Writes warning message
- \`info(message)\`: Writes info message
- \`clear()\`: Clears output
- \`flush()\`: Flushes output buffer

### IProgressIndicator

Defines the interface for progress indication.

\`\`\`typescript
interface IProgressIndicator {
  start(message: string): void;
  update(progress: number, message?: string): void;
  complete(message?: string): void;
  stop(): void;
}
\`\`\`

**Methods:**

- \`start(message)\`: Starts progress indication
- \`update(progress, message?)\`: Updates progress
- \`complete(message?)\`: Completes progress
- \`stop()\`: Stops progress indication

### ITableFormatter

Defines the interface for table formatting.

\`\`\`typescript
interface ITableFormatter {
  formatTable(data: any[], columns: TableColumn[]): string;
  formatTableWithHeaders(data: any[], headers: string[]): string;
  formatSimpleTable(data: any[]): string;
}
\`\`\`

**Methods:**

- \`formatTable(data, columns)\`: Formats table with column definitions
- \`formatTableWithHeaders(data, headers)\`: Formats table with headers
- \`formatSimpleTable(data)\`: Formats simple table

## Data Types

### StudyMetadata

Represents study information.

\`\`\`typescript
interface StudyMetadata {
  id: string;
  name: string;
  description?: string;
  basePath: string;
  createdAt?: Date;
  updatedAt?: Date;
}
\`\`\`

### ValidationResult

Represents validation result.

\`\`\`typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}
\`\`\`

### ValidationError

Represents a validation error.

\`\`\`typescript
interface ValidationError {
  field: string;
  message: string;
  code: string;
}
\`\`\`

### Configuration

Represents configuration data.

\`\`\`typescript
interface Configuration {
  version: string;
  templates: TemplateConfiguration;
  output: OutputConfiguration;
  formatting: FormattingConfiguration;
  logging: LoggingConfiguration;
}
\`\`\`

### TemplateConfiguration

Represents template configuration.

\`\`\`typescript
interface TemplateConfiguration {
  questions: string;
  sources: string;
  summarize: string;
  interview: string;
  synthesis: string;
}
\`\`\`

### OutputConfiguration

Represents output configuration.

\`\`\`typescript
interface OutputConfiguration {
  directory: string;
  format: string;
  includeMetadata: boolean;
}
\`\`\`

### FormattingConfiguration

Represents formatting configuration.

\`\`\`typescript
interface FormattingConfiguration {
  dateFormat: string;
  timeFormat: string;
  includeTimestamps: boolean;
}
\`\`\`

### LoggingConfiguration

Represents logging configuration.

\`\`\`typescript
interface LoggingConfiguration {
  level: string;
  verbose: boolean;
}
\`\`\`

## Usage Examples

### Implementing IFileSystemService

\`\`\`typescript
class CustomFileSystemService implements IFileSystemService {
  async createDirectory(path: string, recursive?: boolean): Promise<void> {
    // Implementation
  }

  async ensureDirectoryExists(path: string): Promise<void> {
    // Implementation
  }

  async writeFile(path: string, content: string): Promise<void> {
    // Implementation
  }

  // ... implement all other methods
}
\`\`\`

### Using IOutput

\`\`\`typescript
class CustomOutput implements IOutput {
  write(text: string): void {
    process.stdout.write(text);
  }

  writeln(text: string): void {
    console.log(text);
  }

  writeError(text: string): void {
    process.stderr.write(text);
  }

  // ... implement all other methods
}
\`\`\`

### Validation Example

\`\`\`typescript
const validationService = new ValidationService();
const result = await validationService.validateInput(
  { name: 'Test Study', description: 'Test description' },
  [
    { field: 'name', required: true, type: 'string' },
    { field: 'description', required: false, type: 'string' }
  ]
);

if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
\`\`\`

## Best Practices

1. **Implement all methods**: Ensure all interface methods are implemented
2. **Handle errors**: Throw appropriate errors for invalid operations
3. **Use TypeScript**: Leverage type safety for better development experience
4. **Document behavior**: Document any implementation-specific behavior
5. **Test thoroughly**: Write comprehensive tests for contract implementations
`;

    await this.fileSystem.writeFile(`${apiPath}/contracts.md`, content);
  }

  /**
   * Generate examples documentation
   */
  private async generateExamplesDoc(apiPath: string): Promise<void> {
    const content = `# API Examples

This document provides practical examples of using the UX-Kit API.

## Basic Study Management

### Creating a Study

\`\`\`typescript
import { StudyService } from './services/StudyService';
import { FileSystemService } from './utils/FileSystemService';

const fileSystem = new FileSystemService();
const studyService = new StudyService(fileSystem);

async function createStudy() {
  try {
    const study = await studyService.createStudy(
      'User Onboarding Research',
      'Research into improving the new user onboarding flow',
      '/path/to/project'
    );
    
    console.log('Study created:', {
      id: study.id,
      name: study.name,
      path: study.basePath
    });
  } catch (error) {
    console.error('Failed to create study:', error.message);
  }
}

createStudy();
\`\`\`

### Listing Studies

\`\`\`typescript
async function listStudies() {
  try {
    const studies = await studyService.listStudies('/path/to/project');
    
    console.log('Found studies:', studies.length);
    studies.forEach(study => {
      console.log(\`- \${study.id}: \${study.name}\`);
    });
  } catch (error) {
    console.error('Failed to list studies:', error.message);
  }
}

listStudies();
\`\`\`

### Getting Study Details

\`\`\`typescript
async function getStudyDetails(studyId: string) {
  try {
    const study = await studyService.getStudy(studyId, '/path/to/project');
    
    if (study) {
      console.log('Study details:', {
        id: study.id,
        name: study.name,
        description: study.description,
        createdAt: study.createdAt,
        updatedAt: study.updatedAt
      });
    } else {
      console.log('Study not found');
    }
  } catch (error) {
    console.error('Failed to get study:', error.message);
  }
}

getStudyDetails('001-user-onboarding-research');
\`\`\`

## Research Workflow

### Complete Research Workflow

\`\`\`typescript
import { ResearchService } from './services/ResearchService';
import { FileGenerator } from './generators/FileGenerator';
import { TemplateEngine } from './templates/TemplateEngine';

const fileSystem = new FileSystemService();
const templateEngine = new TemplateEngine();
const fileGenerator = new FileGenerator(fileSystem, templateEngine);
const researchService = new ResearchService(fileSystem, fileGenerator);

async function completeResearchWorkflow(studyId: string) {
  try {
    console.log('Starting research workflow for study:', studyId);
    
    // Generate research questions
    console.log('Generating research questions...');
    await researchService.generateQuestions(studyId, '/path/to/project');
    
    // Generate sources template
    console.log('Generating sources template...');
    await researchService.generateSources(studyId, '/path/to/project');
    
    // Generate summary
    console.log('Generating research summary...');
    await researchService.generateSummary(studyId, '/path/to/project');
    
    // Generate interview template
    console.log('Generating interview template...');
    await researchService.generateInterview(studyId, '/path/to/project');
    
    // Generate synthesis
    console.log('Generating research synthesis...');
    await researchService.generateSynthesis(studyId, '/path/to/project');
    
    console.log('Research workflow completed successfully');
  } catch (error) {
    console.error('Research workflow failed:', error.message);
  }
}

completeResearchWorkflow('001-user-onboarding-research');
\`\`\`

### Custom Research Workflow

\`\`\`typescript
async function customResearchWorkflow(studyId: string, steps: string[]) {
  try {
    console.log('Starting custom research workflow for study:', studyId);
    
    for (const step of steps) {
      console.log(\`Executing step: \${step}\`);
      
      switch (step) {
        case 'questions':
          await researchService.generateQuestions(studyId, '/path/to/project');
          break;
        case 'sources':
          await researchService.generateSources(studyId, '/path/to/project');
          break;
        case 'summary':
          await researchService.generateSummary(studyId, '/path/to/project');
          break;
        case 'interview':
          await researchService.generateInterview(studyId, '/path/to/project');
          break;
        case 'synthesis':
          await researchService.generateSynthesis(studyId, '/path/to/project');
          break;
        default:
          console.warn(\`Unknown step: \${step}\`);
      }
    }
    
    console.log('Custom research workflow completed');
  } catch (error) {
    console.error('Custom research workflow failed:', error.message);
  }
}

customResearchWorkflow('001-user-onboarding-research', [
  'questions',
  'sources',
  'summary',
  'synthesis'
]);
\`\`\`

## Template Operations

### Loading and Rendering Templates

\`\`\`typescript
import { TemplateService } from './services/TemplateService';

const templateService = new TemplateService(fileSystem);

async function renderTemplate() {
  try {
    // Load template
    const template = await templateService.loadTemplate(
      'questions-template.md',
      '/path/to/project'
    );
    
    // Render template with data
    const rendered = await templateService.renderTemplate(template, {
      studyName: 'User Onboarding Research',
      studyDescription: 'Research into improving the new user onboarding flow',
      createdAt: new Date().toISOString(),
      companyName: 'Your Company',
      researchMethodology: 'Design Thinking'
    });
    
    console.log('Rendered template:', rendered);
  } catch (error) {
    console.error('Failed to render template:', error.message);
  }
}

renderTemplate();
\`\`\`

### Validating Templates

\`\`\`typescript
async function validateTemplate(templateName: string) {
  try {
    const template = await templateService.loadTemplate(templateName, '/path/to/project');
    const isValid = await templateService.validateTemplate(template);
    
    if (isValid) {
      console.log('Template is valid');
    } else {
      console.log('Template is invalid');
    }
  } catch (error) {
    console.error('Failed to validate template:', error.message);
  }
}

validateTemplate('questions-template.md');
\`\`\`

### Listing Templates

\`\`\`typescript
async function listTemplates() {
  try {
    const templates = await templateService.listTemplates('/path/to/project');
    
    console.log('Available templates:', templates);
  } catch (error) {
    console.error('Failed to list templates:', error.message);
  }
}

listTemplates();
\`\`\`

## File Generation

### Generating Files from Templates

\`\`\`typescript
async function generateFile() {
  try {
    await fileGenerator.generateFile(
      'questions-template.md',
      '/path/to/output/questions.md',
      {
        studyName: 'User Onboarding Research',
        studyDescription: 'Research into improving the new user onboarding flow',
        createdAt: new Date().toISOString()
      }
    );
    
    console.log('File generated successfully');
  } catch (error) {
    console.error('Failed to generate file:', error.message);
  }
}

generateFile();
\`\`\`

### Creating Directory Structures

\`\`\`typescript
async function createStudyStructure(studyId: string) {
  try {
    const basePath = \`/path/to/project/.uxkit/studies/\${studyId}\`;
    
    // Create main study directory
    await fileGenerator.generateDirectory(basePath);
    
    // Create subdirectories
    await fileGenerator.generateDirectory(\`\${basePath}/summaries\`);
    await fileGenerator.generateDirectory(\`\${basePath}/interviews\`);
    await fileGenerator.generateDirectory(\`\${basePath}/sources\`);
    
    console.log('Study structure created successfully');
  } catch (error) {
    console.error('Failed to create study structure:', error.message);
  }
}

createStudyStructure('001-user-onboarding-research');
\`\`\`

## Error Handling

### Comprehensive Error Handling

\`\`\`typescript
import { FileNotFoundError, ValidationError, PermissionError } from './errors';

async function handleErrors() {
  try {
    const study = await studyService.createStudy('My Study', '', '/path/to/project');
    console.log('Study created:', study.id);
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      console.error('Template file not found:', error.message);
    } else if (error instanceof ValidationError) {
      console.error('Validation error:', error.message);
      console.error('Field:', error.field);
      console.error('Code:', error.code);
    } else if (error instanceof PermissionError) {
      console.error('Permission error:', error.message);
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
}

handleErrors();
\`\`\`

### Retry Logic

\`\`\`typescript
async function retryOperation(operation: () => Promise<any>, maxRetries: number = 3) {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.log(\`Attempt \${i + 1} failed: \${error.message}\`);
      
      if (i < maxRetries - 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError!;
}

// Usage
async function createStudyWithRetry() {
  try {
    const study = await retryOperation(() => 
      studyService.createStudy('My Study', '', '/path/to/project')
    );
    console.log('Study created:', study.id);
  } catch (error) {
    console.error('Failed to create study after retries:', error.message);
  }
}

createStudyWithRetry();
\`\`\`

## Integration Examples

### CLI Integration

\`\`\`typescript
import { Command } from 'commander';

const program = new Command();

program
  .command('create-study <name>')
  .description('Create a new research study')
  .option('-d, --description <description>', 'Study description')
  .action(async (name, options) => {
    try {
      const study = await studyService.createStudy(
        name,
        options.description || '',
        process.cwd()
      );
      
      console.log(\`Study created: \${study.id}\`);
    } catch (error) {
      console.error('Failed to create study:', error.message);
      process.exit(1);
    }
  });

program.parse();
\`\`\`

### Web API Integration

\`\`\`typescript
import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/studies', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const study = await studyService.createStudy(
      name,
      description || '',
      process.cwd()
    );
    
    res.json({
      success: true,
      data: study
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('API server running on port 3000');
});
\`\`\`

## Best Practices

1. **Always handle errors**: Use try-catch blocks for all async operations
2. **Validate inputs**: Check input parameters before calling services
3. **Use TypeScript**: Leverage type safety for better development experience
4. **Test thoroughly**: Write comprehensive tests for your API usage
5. **Follow patterns**: Use consistent patterns for service initialization and usage
6. **Document behavior**: Document any custom behavior or extensions
7. **Handle edge cases**: Consider edge cases and error scenarios
8. **Use proper logging**: Implement appropriate logging for debugging
`;

    await this.fileSystem.writeFile(`${apiPath}/examples.md`, content);
  }
}
