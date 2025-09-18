/**
 * Use Case Tests for Template System Implementation (T006)
 * 
 * These tests define the expected behavior and user scenarios for the template system
 * before any implementation code is written (TDD approach).
 */

import { TemplateEngine } from '../../src/templates/TemplateEngine';
import { TemplateManager } from '../../src/templates/TemplateManager';
import { TemplateValidator } from '../../src/templates/TemplateValidator';
import { IFileSystemService } from '../../src/contracts/infrastructure-contracts';

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
    this.directories.add(path);
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

describe('Template System Use Cases', () => {
  let mockFileSystem: MockFileSystemService;
  let templateEngine: TemplateEngine;
  let templateManager: TemplateManager;
  let templateValidator: TemplateValidator;

  beforeEach(() => {
    mockFileSystem = new MockFileSystemService();
    templateEngine = new TemplateEngine();
    templateManager = new TemplateManager(mockFileSystem);
    templateValidator = new TemplateValidator();
  });

  afterEach(() => {
    mockFileSystem.clear();
  });

  describe('TemplateEngine - Variable Substitution', () => {
    it('should substitute simple variables in template content', async () => {
      // Given: A template with simple variables
      const template = 'Hello {{name}}, welcome to {{project}}!';
      const variables = { name: 'John', project: 'UX-Kit' };

      // When: Rendering the template with variables
      const result = await templateEngine.render(template, variables);

      // Then: Variables should be substituted correctly
      expect(result).toBe('Hello John, welcome to UX-Kit!');
    });

    it('should handle nested object variables', async () => {
      // Given: A template with nested object variables
      const template = 'Study: {{study.name}}, Date: {{study.date}}';
      const variables = { 
        study: { 
          name: 'User Research Study', 
          date: '2024-01-18' 
        } 
      };

      // When: Rendering the template with nested variables
      const result = await templateEngine.render(template, variables);

      // Then: Nested variables should be substituted correctly
      expect(result).toBe('Study: User Research Study, Date: 2024-01-18');
    });

    it('should handle array variables with iteration', async () => {
      // Given: A template with array iteration
      const template = '{{#each questions}}- {{this}}\n{{/each}}';
      const variables = { 
        questions: ['What is the user goal?', 'How do users currently solve this?'] 
      };

      // When: Rendering the template with array variables
      const result = await templateEngine.render(template, variables);

      // Then: Array should be iterated correctly
      expect(result).toBe('- What is the user goal?\n- How do users currently solve this?\n');
    });

    it('should handle conditional blocks', async () => {
      // Given: A template with conditional blocks
      const template = '{{#if hasSources}}Sources found: {{sources.length}}{{else}}No sources{{/if}}';
      const variables = { hasSources: true, sources: ['source1', 'source2'] };

      // When: Rendering the template with conditional variables
      const result = await templateEngine.render(template, variables);

      // Then: Conditional block should be rendered correctly
      expect(result).toBe('Sources found: 2');
    });

    it('should handle missing variables gracefully', async () => {
      // Given: A template with missing variables
      const template = 'Hello {{name}}, missing: {{missing}}';
      const variables = { name: 'John' };

      // When: Rendering the template with missing variables
      const result = await templateEngine.render(template, variables);

      // Then: Missing variables should be handled gracefully
      expect(result).toBe('Hello John, missing: ');
    });

    it('should handle empty template content', async () => {
      // Given: An empty template
      const template = '';
      const variables = { name: 'John' };

      // When: Rendering the empty template
      const result = await templateEngine.render(template, variables);

      // Then: Should return empty string
      expect(result).toBe('');
    });

    it('should handle template with no variables', async () => {
      // Given: A template with no variables
      const template = 'This is a static template with no variables.';
      const variables = {};

      // When: Rendering the template with no variables
      const result = await templateEngine.render(template, variables);

      // Then: Should return the template as-is
      expect(result).toBe('This is a static template with no variables.');
    });
  });

  describe('TemplateManager - Template File Management', () => {
    it('should load template from file system', async () => {
      // Given: A template file exists in the file system
      const templatePath = '/templates/questions-template.md';
      const templateContent = '# Research Questions\n\n{{#each questions}}- {{this}}\n{{/each}}';
      await mockFileSystem.writeFile(templatePath, templateContent);

      // When: Loading the template
      const template = await templateManager.loadTemplate(templatePath);

      // Then: Template content should be loaded correctly
      expect(template).toBe(templateContent);
    });

    it('should save template to file system', async () => {
      // Given: Template content to save
      const templatePath = '/templates/new-template.md';
      const templateContent = '# New Template\n\nContent: {{content}}';

      // When: Saving the template
      await templateManager.saveTemplate(templatePath, templateContent);

      // Then: Template should be saved to file system
      const savedContent = await mockFileSystem.readFile(templatePath);
      expect(savedContent).toBe(templateContent);
    });

    it('should list all available templates', async () => {
      // Given: Multiple template files exist
      await mockFileSystem.writeFile('/templates/questions-template.md', 'content1');
      await mockFileSystem.writeFile('/templates/sources-template.md', 'content2');
      await mockFileSystem.writeFile('/templates/summarize-template.md', 'content3');

      // When: Listing templates
      const templates = await templateManager.listTemplates('/templates');

      // Then: All templates should be listed
      expect(templates).toHaveLength(3);
      expect(templates).toContain('/templates/questions-template.md');
      expect(templates).toContain('/templates/sources-template.md');
      expect(templates).toContain('/templates/summarize-template.md');
    });

    it('should handle template file not found', async () => {
      // Given: A non-existent template file
      const templatePath = '/templates/non-existent.md';

      // When: Loading non-existent template
      // Then: Should throw appropriate error
      await expect(templateManager.loadTemplate(templatePath))
        .rejects.toThrow('Template not found');
    });

    it('should create template directory if it does not exist', async () => {
      // Given: A template path in non-existent directory
      const templatePath = '/new-templates/test-template.md';
      const templateContent = 'Test content';

      // When: Saving template to non-existent directory
      await templateManager.saveTemplate(templatePath, templateContent);

      // Then: Directory should be created and template saved
      expect(await mockFileSystem.pathExists('/new-templates')).toBe(true);
      expect(await mockFileSystem.readFile(templatePath)).toBe(templateContent);
    });
  });

  describe('TemplateValidator - Template Validation', () => {
    it('should validate template syntax', async () => {
      // Given: A valid template
      const template = 'Hello {{name}}, you have {{count}} items.';

      // When: Validating the template
      const result = await templateValidator.validate(template);

      // Then: Template should be valid
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid template syntax', async () => {
      // Given: An invalid template with unclosed braces
      const template = 'Hello {{name, you have {{count}} items.';

      // When: Validating the template
      const result = await templateValidator.validate(template);

      // Then: Template should be invalid with error details
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate template variables', async () => {
      // Given: A template with variables
      const template = 'Hello {{name}}, count: {{count}}';
      const variables = { name: 'John', count: 5 };

      // When: Validating template variables
      const result = await templateValidator.validateVariables(template, variables);

      // Then: Variables should be valid
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required variables', async () => {
      // Given: A template with variables and incomplete variable set
      const template = 'Hello {{name}}, count: {{count}}';
      const variables = { name: 'John' }; // missing 'count'

      // When: Validating template variables
      const result = await templateValidator.validateVariables(template, variables);

      // Then: Should detect missing variables
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required variable: count');
    });

    it('should validate template file exists', async () => {
      // Given: A template file exists
      const templatePath = '/templates/valid-template.md';
      await mockFileSystem.writeFile(templatePath, 'Valid content');

      // When: Validating template file existence
      const result = await templateValidator.validateFile(templatePath, mockFileSystem);

      // Then: File should be valid
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect non-existent template file', async () => {
      // Given: A non-existent template file
      const templatePath = '/templates/non-existent.md';

      // When: Validating non-existent template file
      const result = await templateValidator.validateFile(templatePath, mockFileSystem);

      // Then: File should be invalid
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Template file does not exist');
    });
  });

  describe('Template System Integration', () => {
    it('should render research questions template with real data', async () => {
      // Given: A research questions template and study data
      const templatePath = '/templates/questions-template.md';
      const templateContent = `# Research Questions for {{studyName}}

## Primary Questions
{{#each primaryQuestions}}
- {{this}}
{{/each}}

## Secondary Questions
{{#each secondaryQuestions}}
- {{this}}
{{/each}}

Generated on: {{date}}`;

      const variables = {
        studyName: 'User Onboarding Study',
        primaryQuestions: [
          'How do users discover the onboarding process?',
          'What are the main friction points during onboarding?'
        ],
        secondaryQuestions: [
          'What motivates users to complete onboarding?',
          'How do users feel about the current onboarding flow?'
        ],
        date: '2024-01-18'
      };

      await mockFileSystem.writeFile(templatePath, templateContent);

      // When: Loading template and rendering with data
      const template = await templateManager.loadTemplate(templatePath);
      const rendered = await templateEngine.render(template, variables);

      // Then: Should produce properly formatted research questions
      expect(rendered).toContain('# Research Questions for User Onboarding Study');
      expect(rendered).toContain('- How do users discover the onboarding process?');
      expect(rendered).toContain('- What motivates users to complete onboarding?');
      expect(rendered).toContain('Generated on: 2024-01-18');
    });

    it('should handle template validation errors gracefully', async () => {
      // Given: An invalid template
      const template = 'Invalid template with {{unclosed braces';
      const variables = { name: 'John' };

      // When: Attempting to render invalid template
      // Then: Should handle error gracefully
      await expect(templateEngine.render(template, variables))
        .rejects.toThrow('Template rendering failed');
    });

    it('should support template inheritance and partials', async () => {
      // Given: A base template and partial template
      const baseTemplate = `# {{title}}

{{> header}}

## Content
{{content}}

{{> footer}}`;

      const headerPartial = '**Author**: {{author}}\n**Date**: {{date}}\n';
      const footerPartial = '---\n*Generated by UX-Kit*';

      const variables = {
        title: 'Research Summary',
        content: 'This is the main content',
        author: 'UX Researcher',
        date: '2024-01-18'
      };

      // When: Rendering template with partials
      const result = await templateEngine.renderWithPartials(baseTemplate, {
        header: headerPartial,
        footer: footerPartial
      }, variables);

      // Then: Should render with partials included
      expect(result).toContain('**Author**: UX Researcher');
      expect(result).toContain('**Date**: 2024-01-18');
      expect(result).toContain('*Generated by UX-Kit*');
    });
  });
});
