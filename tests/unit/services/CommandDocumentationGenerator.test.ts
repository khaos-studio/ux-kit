import { CommandDocumentationGenerator } from '../../../src/services/CommandDocumentationGenerator';
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

describe('CommandDocumentationGenerator', () => {
  let commandDocGenerator: CommandDocumentationGenerator;
  let mockFileSystem: MockFileSystemService;

  beforeEach(() => {
    mockFileSystem = new MockFileSystemService();
    commandDocGenerator = new CommandDocumentationGenerator(mockFileSystem);
  });

  describe('generateCommandDocumentation', () => {
    it('should generate command documentation structure', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await commandDocGenerator.generateCommandDocumentation(projectRoot, outputPath);

      // Verify directories were created
      expect(mockFileSystem.directories.has('/docs/commands')).toBe(true);

      // Verify main command README was generated
      expect(mockFileSystem.files.has('/docs/commands/README.md')).toBe(true);
      const commandsReadme = mockFileSystem.files.get('/docs/commands/README.md');
      expect(commandsReadme).toContain('# CLI Commands');
      expect(commandsReadme).toContain('## Available Commands');

      // Verify individual command documentation was generated
      expect(mockFileSystem.files.has('/docs/commands/init.md')).toBe(true);
      const initCommand = mockFileSystem.files.get('/docs/commands/init.md');
      expect(initCommand).toContain('# Init Command');
      expect(initCommand).toContain('## Description');
      expect(initCommand).toContain('Initializes a new UX-Kit project');
    });

    it('should handle missing source files gracefully', async () => {
      const projectRoot = '/nonexistent';
      const outputPath = '/docs';

      await commandDocGenerator.generateCommandDocumentation(projectRoot, outputPath);

      // Should still create the documentation structure
      expect(mockFileSystem.directories.has('/docs/commands')).toBe(true);
      expect(mockFileSystem.files.has('/docs/commands/README.md')).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should generate complete command documentation structure', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await commandDocGenerator.generateCommandDocumentation(projectRoot, outputPath);

      // Verify all expected files and directories are created
      expect(mockFileSystem.directories.has('/docs/commands')).toBe(true);
      expect(mockFileSystem.files.has('/docs/commands/README.md')).toBe(true);
      expect(mockFileSystem.files.has('/docs/commands/init.md')).toBe(true);

      // Verify command README content
      const commandsReadme = mockFileSystem.files.get('/docs/commands/README.md');
      expect(commandsReadme).toContain('# CLI Commands');
      expect(commandsReadme).toContain('## Available Commands');
      expect(commandsReadme).toContain('## Getting Started');
      expect(commandsReadme).toContain('## Command Structure');

      // Verify init command content
      const initCommand = mockFileSystem.files.get('/docs/commands/init.md');
      expect(initCommand).toContain('# Init Command');
      expect(initCommand).toContain('## Description');
      expect(initCommand).toContain('Initializes a new UX-Kit project');
      expect(initCommand).toContain('## Usage');
      expect(initCommand).toContain('## Options');
      expect(initCommand).toContain('## Examples');
    });
  });
});
