/**
 * Unit Tests for TemplateManager
 */

import { TemplateManager } from '../../../src/templates/TemplateManager';
import { IFileSystemService } from '../../../src/contracts/infrastructure-contracts';

// Mock FileSystemService
class MockFileSystemService implements IFileSystemService {
  private files: Map<string, string> = new Map();
  private directories: Set<string> = new Set();

  clear(): void {
    this.files.clear();
    this.directories.clear();
  }

  async fileExists(path: string): Promise<boolean> {
    return this.files.has(path);
  }

  async directoryExists(path: string): Promise<boolean> {
    return this.directories.has(path);
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

  async getFileStats(path: string): Promise<any> {
    return {
      size: this.files.get(path)?.length || 0,
      created: new Date(),
      modified: new Date(),
      isFile: () => this.files.has(path),
      isDirectory: () => this.directories.has(path),
      permissions: '644'
    };
  }
}

describe('TemplateManager Unit Tests', () => {
  let templateManager: TemplateManager;
  let mockFileSystem: MockFileSystemService;

  beforeEach(() => {
    mockFileSystem = new MockFileSystemService();
    templateManager = new TemplateManager(mockFileSystem);
  });

  afterEach(() => {
    mockFileSystem.clear();
  });

  describe('Template Loading', () => {
    it('should load template from file system', async () => {
      const templatePath = '/templates/test.md';
      const templateContent = '# Test Template\n\nContent: {{content}}';
      
      await mockFileSystem.writeFile(templatePath, templateContent);
      
      const result = await templateManager.loadTemplate(templatePath);
      
      expect(result).toBe(templateContent);
    });

    it('should throw error when template file not found', async () => {
      const templatePath = '/templates/nonexistent.md';
      
      await expect(templateManager.loadTemplate(templatePath))
        .rejects.toThrow('Template not found');
    });
  });

  describe('Template Saving', () => {
    it('should save template to file system', async () => {
      const templatePath = '/templates/new-template.md';
      const templateContent = '# New Template\n\nContent: {{content}}';
      
      await templateManager.saveTemplate(templatePath, templateContent);
      
      const savedContent = await mockFileSystem.readFile(templatePath);
      expect(savedContent).toBe(templateContent);
    });

    it('should create directory if it does not exist', async () => {
      const templatePath = '/new-templates/test.md';
      const templateContent = 'Test content';
      
      await templateManager.saveTemplate(templatePath, templateContent);
      
      expect(await mockFileSystem.pathExists('/new-templates')).toBe(true);
      expect(await mockFileSystem.readFile(templatePath)).toBe(templateContent);
    });
  });

  describe('Template Listing', () => {
    it('should list all templates in directory', async () => {
      await mockFileSystem.writeFile('/templates/template1.md', 'content1');
      await mockFileSystem.writeFile('/templates/template2.md', 'content2');
      await mockFileSystem.writeFile('/templates/template3.md', 'content3');
      
      const templates = await templateManager.listTemplates('/templates');
      
      expect(templates).toHaveLength(3);
      expect(templates).toContain('/templates/template1.md');
      expect(templates).toContain('/templates/template2.md');
      expect(templates).toContain('/templates/template3.md');
    });

    it('should return empty array for non-existent directory', async () => {
      const templates = await templateManager.listTemplates('/nonexistent');
      
      expect(templates).toHaveLength(0);
    });
  });

  describe('Template Existence Check', () => {
    it('should return true for existing template', async () => {
      const templatePath = '/templates/existing.md';
      await mockFileSystem.writeFile(templatePath, 'content');
      
      const exists = await templateManager.templateExists(templatePath);
      
      expect(exists).toBe(true);
    });

    it('should return false for non-existing template', async () => {
      const templatePath = '/templates/nonexistent.md';
      
      const exists = await templateManager.templateExists(templatePath);
      
      expect(exists).toBe(false);
    });
  });

  describe('Template Deletion', () => {
    it('should delete existing template', async () => {
      const templatePath = '/templates/to-delete.md';
      await mockFileSystem.writeFile(templatePath, 'content');
      
      await templateManager.deleteTemplate(templatePath);
      
      expect(await mockFileSystem.pathExists(templatePath)).toBe(false);
    });

    it('should throw error when deleting non-existent template', async () => {
      const templatePath = '/templates/nonexistent.md';
      
      await expect(templateManager.deleteTemplate(templatePath))
        .rejects.toThrow('Failed to delete template');
    });
  });

  describe('Template Copying', () => {
    it('should copy template from source to destination', async () => {
      const sourcePath = '/templates/source.md';
      const destinationPath = '/templates/destination.md';
      const content = 'Template content';
      
      await mockFileSystem.writeFile(sourcePath, content);
      
      await templateManager.copyTemplate(sourcePath, destinationPath);
      
      const copiedContent = await mockFileSystem.readFile(destinationPath);
      expect(copiedContent).toBe(content);
    });

    it('should throw error when copying non-existent template', async () => {
      const sourcePath = '/templates/nonexistent.md';
      const destinationPath = '/templates/destination.md';
      
      await expect(templateManager.copyTemplate(sourcePath, destinationPath))
        .rejects.toThrow('Failed to copy template');
    });
  });
});
