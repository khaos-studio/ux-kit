import { APIDocumentationGenerator } from '../../../src/services/APIDocumentationGenerator';
import { IFileSystemService } from '../../../src/contracts/infrastructure-contracts';

// Mock implementations for testing
class MockFileSystemService implements IFileSystemService {
  public files: Map<string, string> = new Map();
  public directories: Set<string> = new Set();

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
    const files: string[] = [];
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(path)) {
        if (!extension || filePath.endsWith(extension)) {
          files.push(filePath);
        }
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
    const base = path.split('/').pop() || '';
    return ext ? base.replace(ext, '') : base;
  }

  dirname(path: string): string {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/');
  }
}

describe('APIDocumentationGenerator', () => {
  let apiDocGenerator: APIDocumentationGenerator;
  let mockFileSystem: MockFileSystemService;

  beforeEach(() => {
    mockFileSystem = new MockFileSystemService();
    apiDocGenerator = new APIDocumentationGenerator(mockFileSystem);
  });

  describe('generateAPIDocumentation', () => {
    it('should generate API documentation structure', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await apiDocGenerator.generateAPIDocumentation(projectRoot, outputPath);

      // Verify directories were created
      expect(mockFileSystem.directories.has('/docs/api')).toBe(true);

      // Verify API README was generated
      expect(mockFileSystem.files.has('/docs/api/README.md')).toBe(true);
      const apiReadme = mockFileSystem.files.get('/docs/api/README.md');
      expect(apiReadme).toContain('# API Documentation');
      expect(apiReadme).toContain('## Overview');
    });

    it('should handle missing source files gracefully', async () => {
      const projectRoot = '/nonexistent';
      const outputPath = '/docs';

      await apiDocGenerator.generateAPIDocumentation(projectRoot, outputPath);

      // Should still create the documentation structure
      expect(mockFileSystem.directories.has('/docs/api')).toBe(true);
      expect(mockFileSystem.files.has('/docs/api/README.md')).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should generate complete API documentation structure', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await apiDocGenerator.generateAPIDocumentation(projectRoot, outputPath);

      // Verify all expected files and directories are created
      expect(mockFileSystem.directories.has('/docs/api')).toBe(true);
      expect(mockFileSystem.files.has('/docs/api/README.md')).toBe(true);
      expect(mockFileSystem.files.has('/docs/api/services.md')).toBe(true);

      // Verify API README content
      const apiReadme = mockFileSystem.files.get('/docs/api/README.md');
      expect(apiReadme).toContain('# API Documentation');
      expect(apiReadme).toContain('## Overview');
      expect(apiReadme).toContain('## API Structure');
      expect(apiReadme).toContain('## Services');

      // Verify services documentation content
      const servicesDoc = mockFileSystem.files.get('/docs/api/services.md');
      expect(servicesDoc).toContain('# Services');
      expect(servicesDoc).toContain('## StudyService');
      expect(servicesDoc).toContain('### Parameters');
      expect(servicesDoc).toContain('### Return Types');
    });
  });
});
