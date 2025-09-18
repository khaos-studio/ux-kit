/**
 * Unit Tests for TemplateValidator
 */

import { TemplateValidator } from '../../../src/templates/TemplateValidator';
import { IFileSystemService } from '../../../src/contracts/infrastructure-contracts';

// Mock FileSystemService
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

describe('TemplateValidator Unit Tests', () => {
  let templateValidator: TemplateValidator;
  let mockFileSystem: MockFileSystemService;

  beforeEach(() => {
    templateValidator = new TemplateValidator();
    mockFileSystem = new MockFileSystemService();
  });

  afterEach(() => {
    mockFileSystem.clear();
  });

  describe('Template Syntax Validation', () => {
    it('should validate correct template syntax', async () => {
      const template = 'Hello {{name}}, you have {{count}} items.';
      
      const result = await templateValidator.validate(template);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect unclosed braces', async () => {
      const template = 'Hello {{name, you have {{count}} items.';
      
      const result = await templateValidator.validate(template);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unclosed template braces detected');
    });

    it('should detect mismatched if blocks', async () => {
      const template = '{{#if condition}}Content{{/if}}{{#if another}}More content';
      
      const result = await templateValidator.validate(template);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Mismatched {{#if}} and {{/if}} blocks');
    });

    it('should detect mismatched each blocks', async () => {
      const template = '{{#each items}}Item{{/each}}{{#each more}}More items';
      
      const result = await templateValidator.validate(template);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Mismatched {{#each}} and {{/each}} blocks');
    });

    it('should detect nested braces', async () => {
      const template = 'Hello {{{{name}}}}';
      
      const result = await templateValidator.validate(template);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nested braces detected');
    });
  });

  describe('Variable Validation', () => {
    it('should validate all required variables are provided', async () => {
      const template = 'Hello {{name}}, count: {{count}}';
      const variables = { name: 'John', count: 5 };
      
      const result = await templateValidator.validateVariables(template, variables);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required variables', async () => {
      const template = 'Hello {{name}}, count: {{count}}';
      const variables = { name: 'John' }; // missing 'count'
      
      const result = await templateValidator.validateVariables(template, variables);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required variable: count');
    });

    it('should ignore control structures in variable validation', async () => {
      const template = '{{#if condition}}Hello {{name}}{{/if}}';
      const variables = { name: 'John' }; // missing 'condition' but should be ignored
      
      const result = await templateValidator.validateVariables(template, variables);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should ignore "this" in each blocks', async () => {
      const template = '{{#each items}}{{this}}{{/each}}';
      const variables = { items: ['item1', 'item2'] };
      
      const result = await templateValidator.validateVariables(template, variables);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('File Validation', () => {
    it('should validate existing template file', async () => {
      const templatePath = '/templates/valid.md';
      await mockFileSystem.writeFile(templatePath, 'Valid content');
      
      const result = await templateValidator.validateFile(templatePath, mockFileSystem);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect non-existent template file', async () => {
      const templatePath = '/templates/nonexistent.md';
      
      const result = await templateValidator.validateFile(templatePath, mockFileSystem);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Template file does not exist');
    });

    it('should detect unreadable template file', async () => {
      const templatePath = '/templates/unreadable.md';
      // Create a file that exists but can't be read (simulate permission issue)
      await mockFileSystem.writeFile(templatePath, 'content');
      // Override the readFile method to throw an error
      const originalReadFile = mockFileSystem.readFile;
      mockFileSystem.readFile = async () => {
        throw new Error('Permission denied');
      };
      
      const result = await templateValidator.validateFile(templatePath, mockFileSystem);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Template file is not readable');
      
      // Restore original method
      mockFileSystem.readFile = originalReadFile;
    });
  });

  describe('Content Validation', () => {
    it('should validate non-empty template content', async () => {
      const template = 'This is valid template content.';
      
      const result = await templateValidator.validateContent(template);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect empty template content', async () => {
      const template = '';
      
      const result = await templateValidator.validateContent(template);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Template is empty');
    });

    it('should detect very long lines', async () => {
      const longLine = 'a'.repeat(250);
      const template = `Line 1\n${longLine}\nLine 3`;
      
      const result = await templateValidator.validateContent(template);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Line 2 is very long (250 characters)');
    });

    it('should detect nested each blocks', async () => {
      const template = '{{#each outer}}{{#each inner}}{{this}}{{/each}}{{/each}}';
      
      const result = await templateValidator.validateContent(template);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nested {{#each}} blocks detected - may cause performance issues');
    });
  });
});
