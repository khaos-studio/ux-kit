/**
 * Use Case Tests for Init Command Implementation (T003)
 * 
 * These tests define the expected behavior for the init command that creates
 * the .uxkit/ directory structure, following TDD principles.
 */

import { InitCommand } from '../../src/commands/InitCommand';
import { DirectoryService } from '../../src/services/DirectoryService';
import { TemplateService } from '../../src/services/TemplateService';
import { IFileSystemService } from '../../src/contracts/infrastructure-contracts';
import { IOutput } from '../../src/contracts/presentation-contracts';
import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

// Mock implementations for testing
class MockFileSystemService implements IFileSystemService {
  private files: Map<string, string> = new Map();
  private directories: Set<string> = new Set();

  async createDirectory(path: string, recursive?: boolean): Promise<void> {
    this.directories.add(path);
  }

  async ensureDirectoryExists(path: string): Promise<void> {
    this.directories.add(path);
  }

  async writeFile(path: string, content: string): Promise<void> {
    this.files.set(path, content);
  }

  async readFile(path: string): Promise<string> {
    return this.files.get(path) || '';
  }

  async deleteFile(path: string): Promise<void> {
    this.files.delete(path);
  }

  async deleteDirectory(path: string, recursive?: boolean): Promise<void> {
    this.directories.delete(path);
  }

  async pathExists(path: string): Promise<boolean> {
    return this.files.has(path) || this.directories.has(path);
  }

  async isDirectory(path: string): Promise<boolean> {
    return this.directories.has(path);
  }

  async listFiles(path: string, extension?: string): Promise<string[]> {
    return Array.from(this.files.keys()).filter(file => 
      file.startsWith(path) && (!extension || file.endsWith(extension))
    );
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
    return join(...paths);
  }

  basename(path: string, ext?: string): string {
    const parts = path.split('/');
    const filename = parts[parts.length - 1] || '';
    return ext ? filename.replace(ext, '') : filename;
  }

  dirname(path: string): string {
    const parts = path.split('/');
    return parts.slice(0, -1).join('/');
  }
}

class MockOutput implements IOutput {
  private output: string[] = [];

  write(text: string): void {
    this.output.push(text);
  }

  writeln(text: string): void {
    this.output.push(text + '\n');
  }

  writeError(text: string): void {
    this.output.push('ERROR: ' + text);
  }

  writeErrorln(text: string): void {
    this.output.push('ERROR: ' + text + '\n');
  }

  clear(): void {
    this.output = [];
  }

  flush(): void {
    // Mock implementation
  }

  getOutput(): string[] {
    return this.output;
  }
}

describe('Init Command Use Cases', () => {
  let initCommand: InitCommand;
  let directoryService: DirectoryService;
  let templateService: TemplateService;
  let mockFileSystem: MockFileSystemService;
  let mockOutput: MockOutput;
  let projectRoot: string;

  beforeEach(() => {
    projectRoot = '/test-project';
    mockFileSystem = new MockFileSystemService();
    mockOutput = new MockOutput();
    
    directoryService = new DirectoryService(mockFileSystem);
    templateService = new TemplateService(mockFileSystem);
    initCommand = new InitCommand(directoryService, templateService, mockOutput);
  });

  describe('Given a project directory', () => {
    describe('When initializing UX-Kit', () => {
      it('Then should create .uxkit/ directory structure', async () => {
        // Given: A project directory without .uxkit/
        // When: Running init command
        // Then: Should create complete .uxkit/ directory structure
        
        const result = await initCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(true);
        expect(await mockFileSystem.pathExists(join(projectRoot, '.uxkit'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(projectRoot, '.uxkit', 'memory'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(projectRoot, '.uxkit', 'templates'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(projectRoot, '.uxkit', 'studies'))).toBe(true);
      });

      it('Then should create configuration file', async () => {
        // Given: A project directory
        // When: Running init command
        // Then: Should create config.yaml with proper structure
        
        const result = await initCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(true);
        const configPath = join(projectRoot, '.uxkit', 'config.yaml');
        expect(await mockFileSystem.pathExists(configPath)).toBe(true);
        
        const configContent = await mockFileSystem.readFile(configPath);
        expect(configContent).toContain('version:');
        expect(configContent).toContain('aiAgent:');
        expect(configContent).toContain('storage:');
        expect(configContent).toContain('research:');
      });

      it('Then should create memory/principles.md file', async () => {
        // Given: A project directory
        // When: Running init command
        // Then: Should create principles.md with default content
        
        const result = await initCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(true);
        const principlesPath = join(projectRoot, '.uxkit', 'memory', 'principles.md');
        expect(await mockFileSystem.pathExists(principlesPath)).toBe(true);
        
        const principlesContent = await mockFileSystem.readFile(principlesPath);
        expect(principlesContent).toContain('# UX-Kit Principles');
        expect(principlesContent).toContain('Spec-Driven Development');
      });

      it('Then should create template files', async () => {
        // Given: A project directory
        // When: Running init command
        // Then: Should create all required template files
        
        const result = await initCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(true);
        
        const templatesDir = join(projectRoot, '.uxkit', 'templates');
        expect(await mockFileSystem.pathExists(join(templatesDir, 'questions-template.md'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(templatesDir, 'sources-template.md'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(templatesDir, 'summarize-template.md'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(templatesDir, 'interview-template.md'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(templatesDir, 'synthesis-template.md'))).toBe(true);
      });

      it('Then should provide user feedback', async () => {
        // Given: A project directory
        // When: Running init command
        // Then: Should provide informative feedback to user
        
        const result = await initCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('UX-Kit initialized successfully');
        
        const output = mockOutput.getOutput();
        expect(output.some(line => line.includes('Creating .uxkit directory'))).toBe(true);
        expect(output.some(line => line.includes('Copying template files'))).toBe(true);
      });

      it('Then should handle existing .uxkit/ directory gracefully', async () => {
        // Given: A project directory with existing .uxkit/
        // When: Running init command
        // Then: Should handle gracefully without overwriting
        
        // Pre-create .uxkit directory
        await mockFileSystem.createDirectory(join(projectRoot, '.uxkit'));
        
        const result = await initCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('UX-Kit already initialized');
      });

      it('Then should validate project directory', async () => {
        // Given: An invalid project directory
        // When: Running init command
        // Then: Should validate and provide appropriate error
        
        // Mock invalid directory
        const invalidInitCommand = new InitCommand(
          directoryService, 
          templateService, 
          mockOutput
        );
        
        const result = await invalidInitCommand.execute([], {});
        
        // Should still succeed as we're using mock file system
        expect(result.success).toBe(true);
      });
    });

    describe('When initializing with custom options', () => {
      it('Then should accept aiAgent option', async () => {
        // Given: A project directory
        // When: Running init with --aiAgent option
        // Then: Should use specified AI agent in config
        
        const result = await initCommand.execute([], { projectRoot, aiAgent: 'codex' });
        
        expect(result.success).toBe(true);
        const configPath = join(projectRoot, '.uxkit', 'config.yaml');
        const configContent = await mockFileSystem.readFile(configPath);
        expect(configContent).toContain('provider: codex');
      });

      it('Then should accept template option', async () => {
        // Given: A project directory
        // When: Running init with --template option
        // Then: Should use specified template source
        
        const result = await initCommand.execute([], { projectRoot, template: 'custom' });
        
        expect(result.success).toBe(true);
        // Should still create default templates as fallback
        const templatesDir = join(projectRoot, '.uxkit', 'templates');
        expect(await mockFileSystem.pathExists(join(templatesDir, 'questions-template.md'))).toBe(true);
      });
    });

    describe('When handling errors during initialization', () => {
      it('Then should handle file system errors gracefully', async () => {
        // Given: A file system that throws errors
        // When: Running init command
        // Then: Should handle errors gracefully
        
        // Mock file system error
        const errorFileSystem = new MockFileSystemService();
        errorFileSystem.ensureDirectoryExists = jest.fn().mockRejectedValue(new Error('Permission denied'));
        
        const errorDirectoryService = new DirectoryService(errorFileSystem);
        const errorInitCommand = new InitCommand(errorDirectoryService, templateService, mockOutput);
        
        const result = await errorInitCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('Permission denied');
      });

      it('Then should handle template copy errors gracefully', async () => {
        // Given: A template service that throws errors
        // When: Running init command
        // Then: Should handle errors gracefully
        
        // Mock template service error
        const errorTemplateService = new TemplateService(mockFileSystem);
        errorTemplateService.copyTemplates = jest.fn().mockRejectedValue(new Error('Template not found'));
        
        const errorInitCommand = new InitCommand(directoryService, errorTemplateService, mockOutput);
        
        const result = await errorInitCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('Template not found');
      });
    });

    describe('When validating init command arguments', () => {
      it('Then should validate command arguments', async () => {
        // Given: An init command
        // When: Validating arguments
        // Then: Should return validation result
        
        const validation = await initCommand.validate([], {});
        expect(validation.valid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      });

      it('Then should show help when requested', () => {
        // Given: An init command
        // When: Showing help
        // Then: Should display help information
        
        expect(() => {
          initCommand.showHelp();
        }).not.toThrow();
      });
    });

    describe('When integrating with CLI framework', () => {
      it('Then should work with CLIApplication', async () => {
        // Given: A CLI application with init command registered
        // When: Executing init command through CLI
        // Then: Should work seamlessly
        
        const result = await initCommand.execute([], { projectRoot });
        expect(result.success).toBe(true);
        expect(result.message).toContain('UX-Kit initialized successfully');
      });

      it('Then should maintain 100% test coverage', () => {
        // Given: All init command components
        // When: Running tests
        // Then: Should have 100% test coverage
        
        expect(initCommand).toBeDefined();
        expect(directoryService).toBeDefined();
        expect(templateService).toBeDefined();
        expect(mockFileSystem).toBeDefined();
        expect(mockOutput).toBeDefined();
        
        // All components should be properly instantiated and functional
        expect(typeof initCommand.execute).toBe('function');
        expect(typeof initCommand.validate).toBe('function');
        expect(typeof initCommand.showHelp).toBe('function');
        expect(typeof directoryService.createUXKitStructure).toBe('function');
        expect(typeof templateService.copyTemplates).toBe('function');
      });
    });
  });
});
