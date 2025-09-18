/**
 * Use Case Tests for File Generator Implementation (T007)
 * 
 * These tests define the expected behavior and user scenarios for the file generator system
 * before any implementation code is written (TDD approach).
 */

import { FileGenerator } from '../../src/generators/FileGenerator';
import { MarkdownGenerator } from '../../src/generators/MarkdownGenerator';
import { DirectoryGenerator } from '../../src/generators/DirectoryGenerator';
import { FileValidator } from '../../src/validators/FileValidator';
import { IFileSystemService } from '../../src/contracts/infrastructure-contracts';
import { TemplateEngine } from '../../src/templates/TemplateEngine';

// Mock implementations for testing
class MockFileSystemService implements IFileSystemService {
  private files: Map<string, string> = new Map();
  private directories: Set<string> = new Set();

  clear(): void {
    this.files.clear();
    this.directories.clear();
  }

  async createDirectory(path: string): Promise<void> {
    this.directories.add(path);
  }

  async ensureDirectoryExists(path: string): Promise<void> {
    // Create all parent directories recursively
    const parts = path.split('/').filter(part => part.length > 0);
    let currentPath = '';
    
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      this.directories.add(currentPath);
    }
    
    // Also add all intermediate paths with leading slash for consistency
    if (path.startsWith('/')) {
      this.directories.add(path);
      // Add all intermediate paths with leading slash
      let slashPath = '';
      for (const part of parts) {
        slashPath = slashPath ? `${slashPath}/${part}` : `/${part}`;
        this.directories.add(slashPath);
      }
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    this.files.set(path, content);
  }

  async readFile(path: string): Promise<string> {
    const content = this.files.get(path);
    if (content === undefined) {
      throw new Error(`File not found: ${path}`);
    }
    return content;
  }

  async deleteFile(path: string): Promise<void> {
    this.files.delete(path);
  }

  async deleteDirectory(path: string): Promise<void> {
    this.directories.delete(path);
  }

  async pathExists(path: string): Promise<boolean> {
    return this.files.has(path) || this.directories.has(path);
  }

  async isDirectory(path: string): Promise<boolean> {
    return this.directories.has(path);
  }

  async listFiles(path: string): Promise<string[]> {
    const files: string[] = [];
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(path)) {
        files.push(filePath);
      }
    }
    return files;
  }

  async listDirectories(path: string): Promise<string[]> {
    const directories: string[] = [];
    for (const dirPath of this.directories) {
      if (dirPath.startsWith(path)) {
        directories.push(dirPath);
      }
    }
    return directories;
  }

  joinPaths(...paths: string[]): string {
    return paths.join('/');
  }

  basename(path: string, ext?: string): string {
    const name = path.split('/').pop() || '';
    return ext ? name.replace(ext, '') : name;
  }

  dirname(path: string): string {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/');
  }
}

describe('File Generator Use Cases', () => {
  let mockFileSystem: MockFileSystemService;
  let fileGenerator: FileGenerator;
  let markdownGenerator: MarkdownGenerator;
  let directoryGenerator: DirectoryGenerator;
  let fileValidator: FileValidator;
  let templateEngine: TemplateEngine;

  beforeEach(() => {
    mockFileSystem = new MockFileSystemService();
    templateEngine = new TemplateEngine();
    fileGenerator = new FileGenerator(mockFileSystem, templateEngine);
    markdownGenerator = new MarkdownGenerator(mockFileSystem);
    directoryGenerator = new DirectoryGenerator(mockFileSystem);
    fileValidator = new FileValidator(mockFileSystem);
  });

  afterEach(() => {
    mockFileSystem.clear();
  });

  describe('FileGenerator - Research Artifact Generation', () => {
    it('should generate research questions file from template', async () => {
      // Given: A study configuration and questions template
      const studyConfig = {
        studyId: 'study-001',
        studyName: 'User Onboarding Research',
        researcher: 'John Doe',
        date: '2024-01-18'
      };
      
      const questionsData = {
        primaryQuestions: [
          'How do users discover the onboarding process?',
          'What are the main friction points during onboarding?'
        ],
        secondaryQuestions: [
          'What motivates users to complete onboarding?',
          'How do users feel about the current onboarding flow?'
        ]
      };

      const templatePath = '/templates/questions-template.md';
      const templateContent = `# Research Questions for {{studyName}}

**Study ID**: {{studyId}}  
**Date**: {{date}}  
**Researcher**: {{researcher}}

## Primary Questions
{{#each primaryQuestions}}
- {{this}}
{{/each}}

## Secondary Questions
{{#each secondaryQuestions}}
- {{this}}
{{/each}}`;

      await mockFileSystem.writeFile(templatePath, templateContent);

      // When: Generating research questions file
      const result = await fileGenerator.generateResearchQuestions(
        '/studies/study-001/questions.md',
        templatePath,
        { ...studyConfig, ...questionsData }
      );

      // Then: File should be generated with correct content
      expect(result.success).toBe(true);
      expect(result.filePath).toBe('/studies/study-001/questions.md');
      
      const generatedContent = await mockFileSystem.readFile('/studies/study-001/questions.md');
      expect(generatedContent).toContain('# Research Questions for User Onboarding Research');
      expect(generatedContent).toContain('**Study ID**: study-001');
      expect(generatedContent).toContain('- How do users discover the onboarding process?');
      expect(generatedContent).toContain('- What motivates users to complete onboarding?');
    });

    it('should generate sources file with metadata', async () => {
      // Given: Sources data and template
      const sourcesData = {
        studyId: 'study-001',
        studyName: 'User Onboarding Research',
        researcher: 'John Doe',
        date: '2024-01-18',
        sources: [
          {
            id: 'src-001',
            title: 'Onboarding Best Practices',
            type: 'web',
            url: 'https://example.com/onboarding',
            dateAdded: '2024-01-18',
            description: 'Comprehensive guide to user onboarding',
            tags: ['onboarding', 'ux', 'best-practices']
          }
        ]
      };

      const templatePath = '/templates/sources-template.md';
      const templateContent = `# Research Sources for {{studyName}}

**Study ID**: {{studyId}}  
**Date**: {{date}}  
**Researcher**: {{researcher}}

## Sources
{{#each sources}}
### {{title}}
**Type**: {{type}}  
**URL**: {{url}}  
**ID**: {{id}}  
**Date Added**: {{dateAdded}}
{{#if description}}
**Description**: {{description}}
{{/if}}
{{#if tags}}
**Tags**: {{tags}}
{{/if}}
---
{{/each}}`;

      await mockFileSystem.writeFile(templatePath, templateContent);

      // When: Generating sources file
      const result = await fileGenerator.generateSourcesFile(
        '/studies/study-001/sources.md',
        templatePath,
        sourcesData
      );

      // Then: File should be generated with source metadata
      expect(result.success).toBe(true);
      
      const generatedContent = await mockFileSystem.readFile('/studies/study-001/sources.md');
      expect(generatedContent).toContain('### Onboarding Best Practices');
      expect(generatedContent).toContain('**Type**: web');
      expect(generatedContent).toContain('**URL**: https://example.com/onboarding');
      expect(generatedContent).toContain('**ID**: src-001');
      expect(generatedContent).toContain('**Description**: Comprehensive guide to user onboarding');
      expect(generatedContent).toContain('**Tags**: onboarding,ux,best-practices');
    });

    it('should generate interview file with transcript', async () => {
      // Given: Interview data and template
      const interviewData = {
        interviewId: 'int-001',
        participantId: 'p-001',
        participantName: 'Jane Smith',
        participantRole: 'Product Manager',
        participantExperience: '5 years',
        date: '2024-01-18',
        researcher: 'John Doe',
        duration: '45 minutes',
        method: 'Video Call',
        location: 'Remote',
        transcript: 'Interview transcript content here...',
        keyQuotes: [
          'The onboarding process is too complex',
          'Users need more guidance in the first steps'
        ],
        insights: [
          'Users struggle with initial setup',
          'Clear instructions are essential'
        ],
        painPoints: [
          'Too many steps in onboarding',
          'Unclear navigation'
        ],
        opportunities: [
          'Simplify the onboarding flow',
          'Add progress indicators'
        ]
      };

      const templatePath = '/templates/interview-template.md';
      const templateContent = `# Interview: {{participantName}}

**Interview ID**: {{interviewId}}  
**Participant ID**: {{participantId}}  
**Date**: {{date}}  
**Researcher**: {{researcher}}

## Participant Information
**Name**: {{participantName}}  
**Role**: {{participantRole}}  
**Experience**: {{participantExperience}}

## Interview Details
**Duration**: {{duration}}  
**Method**: {{method}}  
**Location**: {{location}}

## Transcript
{{transcript}}

## Key Quotes
{{#each keyQuotes}}
> "{{this}}"
{{/each}}

## Insights
{{#each insights}}
- {{this}}
{{/each}}`;

      await mockFileSystem.writeFile(templatePath, templateContent);

      // When: Generating interview file
      const result = await fileGenerator.generateInterviewFile(
        '/studies/study-001/interviews/int-001.md',
        templatePath,
        interviewData
      );

      // Then: File should be generated with interview content
      expect(result.success).toBe(true);
      
      const generatedContent = await mockFileSystem.readFile('/studies/study-001/interviews/int-001.md');
      expect(generatedContent).toContain('# Interview: Jane Smith');
      expect(generatedContent).toContain('**Interview ID**: int-001');
      expect(generatedContent).toContain('**Participant ID**: p-001');
      expect(generatedContent).toContain('**Role**: Product Manager');
      expect(generatedContent).toContain('Interview transcript content here...');
      expect(generatedContent).toContain('> "The onboarding process is too complex"');
      expect(generatedContent).toContain('- Users struggle with initial setup');
    });

    it('should handle template file not found error', async () => {
      // Given: Non-existent template path
      const templatePath = '/templates/nonexistent.md';
      const data = { studyName: 'Test Study' };

      // When: Attempting to generate file with non-existent template
      const result = await fileGenerator.generateResearchQuestions(
        '/output/questions.md',
        templatePath,
        data
      );

      // Then: Should return error result
      expect(result.success).toBe(false);
      expect(result.error).toContain('Template not found');
    });

    it('should handle invalid template syntax error', async () => {
      // Given: Template with invalid syntax
      const templatePath = '/templates/invalid.md';
      const templateContent = 'Invalid template with {{unclosed braces';
      await mockFileSystem.writeFile(templatePath, templateContent);
      
      const data = { studyName: 'Test Study' };

      // When: Attempting to generate file with invalid template
      const result = await fileGenerator.generateResearchQuestions(
        '/output/questions.md',
        templatePath,
        data
      );

      // Then: Should return error result
      expect(result.success).toBe(false);
      expect(result.error).toContain('Template rendering failed');
    });
  });

  describe('MarkdownGenerator - Markdown File Operations', () => {
    it('should generate markdown file with proper formatting', async () => {
      // Given: Markdown content
      const content = {
        title: 'Research Summary',
        sections: [
          { heading: 'Introduction', content: 'This is the introduction.' },
          { heading: 'Findings', content: 'Key findings are listed here.' }
        ]
      };

      // When: Generating markdown file
      const result = await markdownGenerator.generateMarkdown(
        '/output/summary.md',
        content
      );

      // Then: File should be generated with proper markdown formatting
      expect(result.success).toBe(true);
      
      const generatedContent = await mockFileSystem.readFile('/output/summary.md');
      expect(generatedContent).toContain('# Research Summary');
      expect(generatedContent).toContain('## Introduction');
      expect(generatedContent).toContain('This is the introduction.');
      expect(generatedContent).toContain('## Findings');
      expect(generatedContent).toContain('Key findings are listed here.');
    });

    it('should generate markdown with tables', async () => {
      // Given: Content with table data
      const content = {
        title: 'Research Data',
        table: {
          headers: ['Metric', 'Value', 'Notes'],
          rows: [
            ['Completion Rate', '85%', 'Above target'],
            ['Time to Complete', '3.2 min', 'Within range']
          ]
        }
      };

      // When: Generating markdown with table
      const result = await markdownGenerator.generateMarkdownWithTable(
        '/output/data.md',
        content
      );

      // Then: File should contain properly formatted table
      expect(result.success).toBe(true);
      
      const generatedContent = await mockFileSystem.readFile('/output/data.md');
      expect(generatedContent).toContain('| Metric | Value | Notes |');
      expect(generatedContent).toContain('| Completion Rate | 85% | Above target |');
      expect(generatedContent).toContain('| Time to Complete | 3.2 min | Within range |');
    });

    it('should generate markdown with code blocks', async () => {
      // Given: Content with code
      const content = {
        title: 'Code Example',
        codeBlocks: [
          { language: 'javascript', code: 'console.log("Hello World");' },
          { language: 'json', code: '{"key": "value"}' }
        ]
      };

      // When: Generating markdown with code blocks
      const result = await markdownGenerator.generateMarkdownWithCode(
        '/output/code.md',
        content
      );

      // Then: File should contain properly formatted code blocks
      expect(result.success).toBe(true);
      
      const generatedContent = await mockFileSystem.readFile('/output/code.md');
      expect(generatedContent).toContain('```javascript');
      expect(generatedContent).toContain('console.log("Hello World");');
      expect(generatedContent).toContain('```');
      expect(generatedContent).toContain('```json');
      expect(generatedContent).toContain('{"key": "value"}');
    });
  });

  describe('DirectoryGenerator - Directory Structure Management', () => {
    it('should create study directory structure', async () => {
      // Given: Study configuration
      const studyConfig = {
        studyId: 'study-001',
        studyName: 'User Onboarding Research'
      };

      // When: Creating study directory structure
      const result = await directoryGenerator.createStudyStructure(
        '/studies/study-001',
        studyConfig
      );

      // Then: Directory structure should be created
      expect(result.success).toBe(true);
      expect(await mockFileSystem.pathExists('/studies/study-001')).toBe(true);
      expect(await mockFileSystem.pathExists('/studies/study-001/interviews')).toBe(true);
      expect(await mockFileSystem.pathExists('/studies/study-001/summaries')).toBe(true);
      expect(await mockFileSystem.pathExists('/studies/study-001/insights')).toBe(true);
    });

    it('should create nested directory structure', async () => {
      // Given: Nested path
      const basePath = '/research/2024/studies/study-001';

      // When: Creating nested directories
      const result = await directoryGenerator.createNestedDirectories(basePath);

      // Then: All parent directories should be created
      expect(result.success).toBe(true);
      expect(await mockFileSystem.pathExists('/research')).toBe(true);
      expect(await mockFileSystem.pathExists('/research/2024')).toBe(true);
      expect(await mockFileSystem.pathExists('/research/2024/studies')).toBe(true);
      expect(await mockFileSystem.pathExists('/research/2024/studies/study-001')).toBe(true);
    });

    it('should handle directory creation errors gracefully', async () => {
      // Given: Invalid path (empty string)
      const invalidPath = '';

      // When: Attempting to create directory with invalid path
      const result = await directoryGenerator.createNestedDirectories(invalidPath);

      // Then: Should return error result
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid path');
    });
  });

  describe('FileValidator - File Validation', () => {
    it('should validate markdown file format', async () => {
      // Given: Valid markdown file
      const markdownContent = '# Title\n\nThis is valid markdown content.';
      await mockFileSystem.writeFile('/test.md', markdownContent);

      // When: Validating markdown file
      const result = await fileValidator.validateMarkdownFile('/test.md');

      // Then: File should be valid
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid markdown format', async () => {
      // Given: Invalid markdown file (missing closing tag)
      const invalidMarkdown = '# Title\n\nThis is **invalid markdown content.';
      await mockFileSystem.writeFile('/invalid.md', invalidMarkdown);

      // When: Validating invalid markdown file
      const result = await fileValidator.validateMarkdownFile('/invalid.md');

      // Then: File should be invalid with error details
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate file size limits', async () => {
      // Given: Large file content
      const largeContent = 'x'.repeat(1000000); // 1MB
      await mockFileSystem.writeFile('/large.md', largeContent);

      // When: Validating large file
      const result = await fileValidator.validateFileSize('/large.md', 500000); // 500KB limit

      // Then: File should exceed size limit
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File size exceeds limit');
    });

    it('should validate file permissions', async () => {
      // Given: File that exists
      await mockFileSystem.writeFile('/test.md', 'content');

      // When: Validating file permissions
      const result = await fileValidator.validateFilePermissions('/test.md');

      // Then: File should have valid permissions
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('File Generator Integration', () => {
    it('should generate complete research study structure', async () => {
      // Given: Complete study data
      const studyData = {
        studyId: 'study-001',
        studyName: 'User Onboarding Research',
        researcher: 'John Doe',
        date: '2024-01-18',
        questions: {
          primary: ['How do users discover onboarding?'],
          secondary: ['What motivates completion?']
        },
        sources: [
          {
            id: 'src-001',
            title: 'Onboarding Guide',
            type: 'web',
            url: 'https://example.com'
          }
        ]
      };

      // When: Generating complete study structure
      const result = await fileGenerator.generateCompleteStudy(
        '/studies/study-001',
        studyData
      );

      // Then: Complete structure should be generated
      expect(result.success).toBe(true);
      expect(await mockFileSystem.pathExists('/studies/study-001')).toBe(true);
      expect(await mockFileSystem.pathExists('/studies/study-001/questions.md')).toBe(true);
      expect(await mockFileSystem.pathExists('/studies/study-001/sources.md')).toBe(true);
      expect(await mockFileSystem.pathExists('/studies/study-001/interviews')).toBe(true);
      expect(await mockFileSystem.pathExists('/studies/study-001/summaries')).toBe(true);
    });

    it('should handle concurrent file generation', async () => {
      // Given: Create template first
      await mockFileSystem.writeFile('/templates/questions.md', '# {{studyName}}');
      
      // Multiple file generation requests
      const requests = [
        fileGenerator.generateResearchQuestions('/output/q1.md', '/templates/questions.md', { studyName: 'Study 1' }),
        fileGenerator.generateResearchQuestions('/output/q2.md', '/templates/questions.md', { studyName: 'Study 2' }),
        fileGenerator.generateResearchQuestions('/output/q3.md', '/templates/questions.md', { studyName: 'Study 3' })
      ];

      // When: Running concurrent file generation
      const results = await Promise.all(requests);

      // Then: All files should be generated successfully
      expect(results.every((r: any) => r.success)).toBe(true);
      expect(await mockFileSystem.pathExists('/output/q1.md')).toBe(true);
      expect(await mockFileSystem.pathExists('/output/q2.md')).toBe(true);
      expect(await mockFileSystem.pathExists('/output/q3.md')).toBe(true);
    });
  });
});
