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

describe('UserGuideGenerator', () => {
  let userGuideGenerator: UserGuideGenerator;
  let mockFileSystem: MockFileSystemService;

  beforeEach(() => {
    mockFileSystem = new MockFileSystemService();
    userGuideGenerator = new UserGuideGenerator(mockFileSystem);
  });

  describe('generateUserGuide', () => {
    it('should generate user guide documentation structure', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await userGuideGenerator.generateUserGuide(projectRoot, outputPath);

      // Verify directories were created
      expect(mockFileSystem.directories.has('/docs/user-guide')).toBe(true);

      // Verify user guide README was generated
      expect(mockFileSystem.files.has('/docs/user-guide/README.md')).toBe(true);
      const userGuideReadme = mockFileSystem.files.get('/docs/user-guide/README.md');
      expect(userGuideReadme).toContain('# User Guide');
      expect(userGuideReadme).toContain('## Examples');
      expect(userGuideReadme).toContain('## Tutorials');
      expect(userGuideReadme).toContain('## Troubleshooting');
    });

    it('should handle missing source files gracefully', async () => {
      const projectRoot = '/nonexistent';
      const outputPath = '/docs';

      await userGuideGenerator.generateUserGuide(projectRoot, outputPath);

      // Should still create the documentation structure
      expect(mockFileSystem.directories.has('/docs/user-guide')).toBe(true);
      expect(mockFileSystem.files.has('/docs/user-guide/README.md')).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should generate complete user guide documentation structure', async () => {
      const projectRoot = '/project';
      const outputPath = '/docs';

      await userGuideGenerator.generateUserGuide(projectRoot, outputPath);

      // Verify all expected files and directories are created
      expect(mockFileSystem.directories.has('/docs/user-guide')).toBe(true);
      expect(mockFileSystem.files.has('/docs/user-guide/README.md')).toBe(true);
      expect(mockFileSystem.files.has('/docs/user-guide/getting-started.md')).toBe(true);
      expect(mockFileSystem.files.has('/docs/user-guide/tutorials.md')).toBe(true);
      expect(mockFileSystem.files.has('/docs/user-guide/examples.md')).toBe(true);
      expect(mockFileSystem.files.has('/docs/user-guide/troubleshooting.md')).toBe(true);

      // Verify user guide README content
      const userGuideReadme = mockFileSystem.files.get('/docs/user-guide/README.md');
      expect(userGuideReadme).toContain('# User Guide');
      expect(userGuideReadme).toContain('## Examples');
      expect(userGuideReadme).toContain('## Tutorials');
      expect(userGuideReadme).toContain('## Troubleshooting');
      expect(userGuideReadme).toContain('## Getting Started');

      // Verify getting started content
      const gettingStarted = mockFileSystem.files.get('/docs/user-guide/getting-started.md');
      expect(gettingStarted).toContain('# Getting Started');
      expect(gettingStarted).toContain('## Prerequisites');
      expect(gettingStarted).toContain('## Installation');

      // Verify tutorials content
      const tutorials = mockFileSystem.files.get('/docs/user-guide/tutorials.md');
      expect(tutorials).toContain('# Tutorials');
      expect(tutorials).toContain('## Creating Your First Study');
      expect(tutorials).toContain('## Setting Up Research Questions');
      expect(tutorials).toContain('## Generating Research Artifacts');

      // Verify examples content
      const examples = mockFileSystem.files.get('/docs/user-guide/examples.md');
      expect(examples).toContain('# Examples');
      expect(examples).toContain('## Example 1: E-commerce User Onboarding Research');

      // Verify troubleshooting content
      const troubleshooting = mockFileSystem.files.get('/docs/user-guide/troubleshooting.md');
      expect(troubleshooting).toContain('# Troubleshooting');
      expect(troubleshooting).toContain('## Common Issues');
      expect(troubleshooting).toContain('## Error Messages');
    });
  });
});
