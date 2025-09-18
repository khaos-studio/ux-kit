import { DocumentationGenerator } from '../../../src/services/DocumentationGenerator';
import { CommandDocumentationGenerator } from '../../../src/services/CommandDocumentationGenerator';
import { ConfigurationDocumentationGenerator } from '../../../src/services/ConfigurationDocumentationGenerator';
import { APIDocumentationGenerator } from '../../../src/services/APIDocumentationGenerator';
import { UserGuideGenerator } from '../../../src/services/UserGuideGenerator';
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

describe('DocumentationGenerator', () => {
  let documentationGenerator: DocumentationGenerator;
  let mockFileSystem: MockFileSystemService;
  let mockCommandDocGenerator: jest.Mocked<CommandDocumentationGenerator>;
  let mockConfigDocGenerator: jest.Mocked<ConfigurationDocumentationGenerator>;
  let mockApiDocGenerator: jest.Mocked<APIDocumentationGenerator>;
  let mockUserGuideGenerator: jest.Mocked<UserGuideGenerator>;

  beforeEach(() => {
    mockFileSystem = new MockFileSystemService();
    mockCommandDocGenerator = {
      generateCommandDocumentation: jest.fn()
    } as any;
    mockConfigDocGenerator = {
      generateConfigurationDocumentation: jest.fn()
    } as any;
    mockApiDocGenerator = {
      generateAPIDocumentation: jest.fn()
    } as any;
    mockUserGuideGenerator = {
      generateUserGuide: jest.fn()
    } as any;

    documentationGenerator = new DocumentationGenerator(
      mockFileSystem,
      mockCommandDocGenerator,
      mockConfigDocGenerator,
      mockApiDocGenerator,
      mockUserGuideGenerator
    );
  });

  describe('generateAllDocumentation', () => {
    it('should generate all documentation sections', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);

      // Verify main index was generated
      expect(mockFileSystem.files.has('/docs/README.md')).toBe(true);
      const mainIndex = mockFileSystem.files.get('/docs/README.md');
      expect(mainIndex).toContain('# UX-Kit Documentation');
      expect(mainIndex).toContain('## Commands');
      expect(mainIndex).toContain('## Configuration');
      expect(mainIndex).toContain('## API Reference');
      expect(mainIndex).toContain('## User Guide');

      // Verify all generators were called
      expect(mockCommandDocGenerator.generateCommandDocumentation).toHaveBeenCalledWith(projectRoot, outputPath);
      expect(mockConfigDocGenerator.generateConfigurationDocumentation).toHaveBeenCalledWith(projectRoot, outputPath);
      expect(mockApiDocGenerator.generateAPIDocumentation).toHaveBeenCalledWith(projectRoot, outputPath);
      expect(mockUserGuideGenerator.generateUserGuide).toHaveBeenCalledWith(projectRoot, outputPath);

      // Verify directories were created
      expect(mockFileSystem.directories.has('/docs')).toBe(true);
      expect(mockFileSystem.directories.has('/docs/examples')).toBe(true);
      expect(mockFileSystem.directories.has('/docs/templates')).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      mockCommandDocGenerator.generateCommandDocumentation.mockRejectedValue(new Error('Command generation failed'));

      await expect(documentationGenerator.generateAllDocumentation(projectRoot, outputPath))
        .rejects.toThrow('Failed to generate documentation: Command generation failed');
    });
  });

  describe('integration tests', () => {
    it('should generate complete documentation structure', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);

      // Verify all expected files and directories are created
      expect(mockFileSystem.directories.has('/docs')).toBe(true);
      expect(mockFileSystem.directories.has('/docs/examples')).toBe(true);
      expect(mockFileSystem.directories.has('/docs/templates')).toBe(true);
      
      expect(mockFileSystem.files.has('/docs/README.md')).toBe(true);
      expect(mockFileSystem.files.has('/docs/examples/README.md')).toBe(true);
      expect(mockFileSystem.files.has('/docs/templates/README.md')).toBe(true);

      // Verify main documentation content
      const mainReadme = mockFileSystem.files.get('/docs/README.md');
      expect(mainReadme).toContain('# UX-Kit Documentation');
      expect(mainReadme).toContain('## Commands');
      expect(mainReadme).toContain('## Configuration');
      expect(mainReadme).toContain('## API Reference');
      expect(mainReadme).toContain('## User Guide');
      expect(mainReadme).toContain('## Examples');

      // Verify examples content
      const examplesReadme = mockFileSystem.files.get('/docs/examples/README.md');
      expect(examplesReadme).toContain('# Examples');
      expect(examplesReadme).toContain('## Basic Usage');
      expect(examplesReadme).toContain('## Advanced Usage');

      // Verify templates content
      const templatesReadme = mockFileSystem.files.get('/docs/templates/README.md');
      expect(templatesReadme).toContain('# Templates');
      expect(templatesReadme).toContain('## Available Templates');
      expect(templatesReadme).toContain('## Custom Templates');
      expect(templatesReadme).toContain('## Template Variables');
    });
  });
});
