/**
 * Use Case Tests for Documentation Generation Implementation (T017)
 * 
 * These tests define the expected behavior and user scenarios for the documentation generation system
 * before any implementation code is written (TDD approach).
 */

import { DocumentationGenerator } from '../../src/services/DocumentationGenerator';
import { CommandDocumentationGenerator } from '../../src/services/CommandDocumentationGenerator';
import { ConfigurationDocumentationGenerator } from '../../src/services/ConfigurationDocumentationGenerator';
import { APIDocumentationGenerator } from '../../src/services/APIDocumentationGenerator';
import { UserGuideGenerator } from '../../src/services/UserGuideGenerator';
import { IFileSystemService } from '../../src/contracts/infrastructure-contracts';

// Mock implementations for testing
class MockFileSystemService implements IFileSystemService {
  public files: Map<string, string> = new Map();
  public directories: Set<string> = new Set();

  clear(): void {
    this.files.clear();
    this.directories.clear();
  }

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
    const content = this.files.get(path);
    if (content === undefined) {
      throw new Error(`File not found: ${path}`);
    }
    return content;
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
      if (filePath.startsWith(path) && (!extension || filePath.endsWith(extension))) {
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

describe('Documentation Generation Use Cases', () => {
  let documentationGenerator: DocumentationGenerator;
  let commandDocGenerator: CommandDocumentationGenerator;
  let configDocGenerator: ConfigurationDocumentationGenerator;
  let apiDocGenerator: APIDocumentationGenerator;
  let userGuideGenerator: UserGuideGenerator;
  let mockFileSystem: MockFileSystemService;

  beforeEach(() => {
    mockFileSystem = new MockFileSystemService();
    commandDocGenerator = new CommandDocumentationGenerator(mockFileSystem);
    configDocGenerator = new ConfigurationDocumentationGenerator(mockFileSystem);
    apiDocGenerator = new APIDocumentationGenerator(mockFileSystem);
    userGuideGenerator = new UserGuideGenerator(mockFileSystem);
    documentationGenerator = new DocumentationGenerator(
      mockFileSystem,
      commandDocGenerator,
      configDocGenerator,
      apiDocGenerator,
      userGuideGenerator
    );
  });

  afterEach(() => {
    mockFileSystem.clear();
  });

  describe('Given a UX-Kit project with source code', () => {
    const projectRoot = '/test/project';
    const docsOutputPath = '/test/project/docs';

    beforeEach(() => {
      // Set up mock project structure
      mockFileSystem.directories.add('/test/project/src');
      mockFileSystem.directories.add('/test/project/src/cli');
      mockFileSystem.directories.add('/test/project/src/commands');
      mockFileSystem.directories.add('/test/project/src/services');
      mockFileSystem.directories.add('/test/project/config');
      
      // Mock source files
      mockFileSystem.files.set('/test/project/src/cli/CLIApplication.ts', `
        /**
         * CLI Application
         * 
         * Main entry point for the UX-Kit CLI tool.
         */
        export class CLIApplication {
          async run(): Promise<void> {
            // Implementation
          }
        }
      `);
      
      mockFileSystem.files.set('/test/project/src/commands/InitCommand.ts', `
        /**
         * Init Command
         * 
         * Initializes a new UX-Kit project.
         */
        export class InitCommand {
          async execute(args: string[]): Promise<void> {
            // Implementation
          }
        }
      `);
      
      mockFileSystem.files.set('/test/project/config/default-config.yaml', `
        # UX-Kit Default Configuration
        version: 1.0.0
        templates:
          questions: questions-template.md
          sources: sources-template.md
      `);
    });

    describe('When generating CLI command documentation', () => {
      it('Then should create comprehensive command documentation', async () => {
        // Act
        await commandDocGenerator.generateCommandDocumentation(projectRoot, docsOutputPath);

        // Assert
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/commands/README.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/commands/init.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/commands/study.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/commands/research.md`)).toBe(true);

        // Verify command documentation content
        const initDoc = await mockFileSystem.readFile(`${docsOutputPath}/commands/init.md`);
        expect(initDoc).toContain('# Init Command');
        expect(initDoc).toContain('Initializes a new UX-Kit project');
        expect(initDoc).toContain('## Usage');
        expect(initDoc).toContain('## Examples');
        expect(initDoc).toContain('## Options');
      });

      it('Then should include command examples and usage patterns', async () => {
        // Act
        await commandDocGenerator.generateCommandDocumentation(projectRoot, docsOutputPath);

        // Assert
        const readmeDoc = await mockFileSystem.readFile(`${docsOutputPath}/commands/README.md`);
        expect(readmeDoc).toContain('# CLI Commands');
        expect(readmeDoc).toContain('## Available Commands');
        expect(readmeDoc).toContain('### init');
        expect(readmeDoc).toContain('### study');
        expect(readmeDoc).toContain('### research');
        expect(readmeDoc).toContain('## Getting Started');
      });
    });

    describe('When generating configuration documentation', () => {
      it('Then should create comprehensive configuration guide', async () => {
        // Act
        await configDocGenerator.generateConfigurationDocumentation(projectRoot, docsOutputPath);

        // Assert
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/configuration/README.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/configuration/default-config.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/configuration/customization.md`)).toBe(true);

        // Verify configuration documentation content
        const configDoc = await mockFileSystem.readFile(`${docsOutputPath}/configuration/README.md`);
        expect(configDoc).toContain('# Configuration Guide');
        expect(configDoc).toContain('## Default Configuration');
        expect(configDoc).toContain('## Customization');
        expect(configDoc).toContain('## Environment Variables');
      });

      it('Then should document all configuration options with examples', async () => {
        // Act
        await configDocGenerator.generateConfigurationDocumentation(projectRoot, docsOutputPath);

        // Assert
        const defaultConfigDoc = await mockFileSystem.readFile(`${docsOutputPath}/configuration/default-config.md`);
        expect(defaultConfigDoc).toContain('# Default Configuration');
        expect(defaultConfigDoc).toContain('## Templates');
        expect(defaultConfigDoc).toContain('## Version');
        expect(defaultConfigDoc).toContain('```yaml');
      });
    });

    describe('When generating API documentation', () => {
      it('Then should create comprehensive API documentation', async () => {
        // Act
        await apiDocGenerator.generateAPIDocumentation(projectRoot, docsOutputPath);

        // Assert
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/api/README.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/api/services.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/api/contracts.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/api/examples.md`)).toBe(true);

        // Verify API documentation content
        const apiDoc = await mockFileSystem.readFile(`${docsOutputPath}/api/README.md`);
        expect(apiDoc).toContain('# API Documentation');
        expect(apiDoc).toContain('## Services');
        expect(apiDoc).toContain('## Contracts');
        expect(apiDoc).toContain('## Examples');
      });

      it('Then should document all service interfaces and methods', async () => {
        // Act
        await apiDocGenerator.generateAPIDocumentation(projectRoot, docsOutputPath);

        // Assert
        const servicesDoc = await mockFileSystem.readFile(`${docsOutputPath}/api/services.md`);
        expect(servicesDoc).toContain('# Services');
        expect(servicesDoc).toContain('## StudyService');
        expect(servicesDoc).toContain('## ResearchService');
        expect(servicesDoc).toContain('## TemplateService');
        expect(servicesDoc).toContain('### Methods');
        expect(servicesDoc).toContain('### Parameters');
        expect(servicesDoc).toContain('### Return Types');
      });
    });

    describe('When generating user guide', () => {
      it('Then should create comprehensive user guide', async () => {
        // Act
        await userGuideGenerator.generateUserGuide(projectRoot, docsOutputPath);

        // Assert
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/user-guide/README.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/user-guide/getting-started.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/user-guide/examples.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/user-guide/tutorials.md`)).toBe(true);

        // Verify user guide content
        const userGuide = await mockFileSystem.readFile(`${docsOutputPath}/user-guide/README.md`);
        expect(userGuide).toContain('# User Guide');
        expect(userGuide).toContain('## Getting Started');
        expect(userGuide).toContain('## Examples');
        expect(userGuide).toContain('## Tutorials');
        expect(userGuide).toContain('## Troubleshooting');
      });

      it('Then should include step-by-step tutorials', async () => {
        // Act
        await userGuideGenerator.generateUserGuide(projectRoot, docsOutputPath);

        // Assert
        const tutorialsDoc = await mockFileSystem.readFile(`${docsOutputPath}/user-guide/tutorials.md`);
        expect(tutorialsDoc).toContain('# Tutorials');
        expect(tutorialsDoc).toContain('## Creating Your First Study');
        expect(tutorialsDoc).toContain('## Setting Up Research Questions');
        expect(tutorialsDoc).toContain('## Generating Research Artifacts');
        expect(tutorialsDoc).toContain('### Step 1:');
        expect(tutorialsDoc).toContain('### Step 2:');
      });
    });

    describe('When generating complete documentation', () => {
      it('Then should create all documentation sections', async () => {
        // Act
        await documentationGenerator.generateAllDocumentation(projectRoot, docsOutputPath);

        // Assert
        // Verify all documentation directories exist
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/commands`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/configuration`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/api`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/user-guide`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/examples`)).toBe(true);

        // Verify main documentation index
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/README.md`)).toBe(true);
        const mainDoc = await mockFileSystem.readFile(`${docsOutputPath}/README.md`);
        expect(mainDoc).toContain('# UX-Kit Documentation');
        expect(mainDoc).toContain('## Commands');
        expect(mainDoc).toContain('## Configuration');
        expect(mainDoc).toContain('## API Reference');
        expect(mainDoc).toContain('## User Guide');
        expect(mainDoc).toContain('## Examples');
      });

      it('Then should create examples and tutorials', async () => {
        // Act
        await documentationGenerator.generateAllDocumentation(projectRoot, docsOutputPath);

        // Assert
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/examples/README.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/examples/basic-usage.md`)).toBe(true);
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/examples/advanced-usage.md`)).toBe(true);

        // Verify examples content
        const examplesDoc = await mockFileSystem.readFile(`${docsOutputPath}/examples/README.md`);
        expect(examplesDoc).toContain('# Examples');
        expect(examplesDoc).toContain('## Basic Usage');
        expect(examplesDoc).toContain('## Advanced Usage');
        expect(examplesDoc).toContain('## Real-world Scenarios');
      });
    });

    describe('When documentation generation fails', () => {
      it('Then should handle file system errors gracefully', async () => {
        // Arrange
        const errorFileSystem = new MockFileSystemService();
        errorFileSystem.writeFile = jest.fn().mockRejectedValue(new Error('Write failed'));
        
        const errorDocGenerator = new DocumentationGenerator(
          errorFileSystem,
          commandDocGenerator,
          configDocGenerator,
          apiDocGenerator,
          userGuideGenerator
        );

        // Act & Assert
        await expect(errorDocGenerator.generateAllDocumentation(projectRoot, docsOutputPath))
          .rejects.toThrow('Write failed');
      });

      it('Then should handle missing source files gracefully', async () => {
        // Arrange
        const emptyFileSystem = new MockFileSystemService();
        
        const emptyDocGenerator = new DocumentationGenerator(
          emptyFileSystem,
          commandDocGenerator,
          configDocGenerator,
          apiDocGenerator,
          userGuideGenerator
        );

        // Act
        await emptyDocGenerator.generateAllDocumentation(projectRoot, docsOutputPath);

        // Assert
        // Should still create documentation structure even with missing source files
        expect(await emptyFileSystem.pathExists(`${docsOutputPath}/README.md`)).toBe(true);
        expect(await emptyFileSystem.pathExists(`${docsOutputPath}/commands`)).toBe(true);
        expect(await emptyFileSystem.pathExists(`${docsOutputPath}/configuration`)).toBe(true);
        expect(await emptyFileSystem.pathExists(`${docsOutputPath}/api`)).toBe(true);
        expect(await emptyFileSystem.pathExists(`${docsOutputPath}/user-guide`)).toBe(true);
      });
    });
  });

  describe('Given a UX-Kit project with custom templates', () => {
    const projectRoot = '/test/project';
    const docsOutputPath = '/test/project/docs';

    beforeEach(() => {
      // Set up mock project with custom templates
      mockFileSystem.directories.add('/test/project/templates');
      mockFileSystem.files.set('/test/project/templates/custom-template.md', `
        # Custom Template
        This is a custom template for research.
      `);
    });

    describe('When generating template documentation', () => {
      it('Then should document all available templates', async () => {
        // Act
        await documentationGenerator.generateAllDocumentation(projectRoot, docsOutputPath);

        // Assert
        expect(await mockFileSystem.pathExists(`${docsOutputPath}/templates/README.md`)).toBe(true);
        
        const templatesDoc = await mockFileSystem.readFile(`${docsOutputPath}/templates/README.md`);
        expect(templatesDoc).toContain('# Templates');
        expect(templatesDoc).toContain('## Available Templates');
        expect(templatesDoc).toContain('## Custom Templates');
        expect(templatesDoc).toContain('custom-template.md');
      });
    });
  });
});
