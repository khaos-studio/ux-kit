import { ConfigurationDocumentationGenerator } from '../../../src/services/ConfigurationDocumentationGenerator';
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

describe('ConfigurationDocumentationGenerator', () => {
  let configDocGenerator: ConfigurationDocumentationGenerator;
  let mockFileSystem: MockFileSystemService;

  beforeEach(() => {
    mockFileSystem = new MockFileSystemService();
    configDocGenerator = new ConfigurationDocumentationGenerator(mockFileSystem);
  });

  describe('generateConfigurationDocumentation', () => {
    it('should generate configuration documentation structure', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await configDocGenerator.generateConfigurationDocumentation(projectRoot, outputPath);

      // Verify directories were created
      expect(mockFileSystem.directories.has('/docs/configuration')).toBe(true);

      // Verify configuration README was generated
      expect(mockFileSystem.files.has('/docs/configuration/README.md')).toBe(true);
      const configReadme = mockFileSystem.files.get('/docs/configuration/README.md');
      expect(configReadme).toContain('# Configuration Guide');
      expect(configReadme).toContain('## Configuration Files');
      expect(configReadme).toContain('## Quick Start');
    });

    it('should handle missing source files gracefully', async () => {
      const projectRoot = '/nonexistent';
      const outputPath = '/docs';

      await configDocGenerator.generateConfigurationDocumentation(projectRoot, outputPath);

      // Should still create the documentation structure
      expect(mockFileSystem.directories.has('/docs/configuration')).toBe(true);
      expect(mockFileSystem.files.has('/docs/configuration/README.md')).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should generate complete configuration documentation structure', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await configDocGenerator.generateConfigurationDocumentation(projectRoot, outputPath);

      // Verify all expected files and directories are created
      expect(mockFileSystem.directories.has('/docs/configuration')).toBe(true);
      expect(mockFileSystem.files.has('/docs/configuration/README.md')).toBe(true);

      // Verify configuration README content
      const content = mockFileSystem.files.get('/docs/configuration/README.md');
      expect(content).toContain('# Configuration Guide');
      expect(content).toContain('## Configuration Files');
      expect(content).toContain('## Quick Start');
      expect(content).toContain('## Configuration Sections');
    });
  });
});
