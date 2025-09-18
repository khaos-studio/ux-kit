import { DocumentationGenerator } from '../../src/services/DocumentationGenerator';
import { CommandDocumentationGenerator } from '../../src/services/CommandDocumentationGenerator';
import { ConfigurationDocumentationGenerator } from '../../src/services/ConfigurationDocumentationGenerator';
import { APIDocumentationGenerator } from '../../src/services/APIDocumentationGenerator';
import { UserGuideGenerator } from '../../src/services/UserGuideGenerator';
import { FileSystemService } from '../../src/utils/FileSystemService';
import * as path from 'path';
import * as fs from 'fs/promises';

describe('Documentation Generation Integration Tests', () => {
  let documentationGenerator: DocumentationGenerator;
  let fileSystemService: FileSystemService;
  let tempDir: string;

  beforeEach(async () => {
    fileSystemService = new FileSystemService();
    tempDir = path.join(__dirname, 'temp-docs');
    
    // Clean up any existing temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Directory doesn't exist, that's fine
    }
    
    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });

    const commandDocGenerator = new CommandDocumentationGenerator(fileSystemService);
    const configDocGenerator = new ConfigurationDocumentationGenerator(fileSystemService);
    const apiDocGenerator = new APIDocumentationGenerator(fileSystemService);
    const userGuideGenerator = new UserGuideGenerator(fileSystemService);

    documentationGenerator = new DocumentationGenerator(
      fileSystemService,
      commandDocGenerator,
      configDocGenerator,
      apiDocGenerator,
      userGuideGenerator
    );
  });

  afterEach(async () => {
    // Clean up temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Complete Documentation Generation Workflow', () => {
    it('should generate complete documentation structure', async () => {
      const projectRoot = path.join(__dirname, '..', '..');
      const outputPath = tempDir;

      // Generate all documentation
      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);

      // Verify main documentation structure
      const mainReadmePath = path.join(outputPath, 'README.md');
      expect(await fileSystemService.pathExists(mainReadmePath)).toBe(true);
      
      const mainReadme = await fileSystemService.readFile(mainReadmePath);
      expect(mainReadme).toContain('# UX-Kit Documentation');
      expect(mainReadme).toContain('## Commands');
      expect(mainReadme).toContain('## Configuration');
      expect(mainReadme).toContain('## API Reference');
      expect(mainReadme).toContain('## User Guide');
      expect(mainReadme).toContain('## Examples');

      // Verify all documentation directories exist
      const expectedDirs = [
        'commands',
        'configuration', 
        'api',
        'user-guide',
        'examples',
        'templates'
      ];

      for (const dir of expectedDirs) {
        const dirPath = path.join(outputPath, dir);
        expect(await fileSystemService.pathExists(dirPath)).toBe(true);
        expect(await fileSystemService.isDirectory(dirPath)).toBe(true);
      }
    });

    it('should generate command documentation with all files', async () => {
      const projectRoot = path.join(__dirname, '..', '..');
      const outputPath = tempDir;

      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);

      // Verify command documentation
      const commandsDir = path.join(outputPath, 'commands');
      expect(await fileSystemService.pathExists(commandsDir)).toBe(true);

      const commandsReadme = path.join(commandsDir, 'README.md');
      expect(await fileSystemService.pathExists(commandsReadme)).toBe(true);
      
      const commandsContent = await fileSystemService.readFile(commandsReadme);
      expect(commandsContent).toContain('# CLI Commands');
      expect(commandsContent).toContain('## Available Commands');

      // Verify individual command files
      const initCommand = path.join(commandsDir, 'init.md');
      expect(await fileSystemService.pathExists(initCommand)).toBe(true);
      
      const initContent = await fileSystemService.readFile(initCommand);
      expect(initContent).toContain('# Init Command');
      expect(initContent).toContain('Initializes a new UX-Kit project');
    });

    it('should generate configuration documentation', async () => {
      const projectRoot = path.join(__dirname, '..', '..');
      const outputPath = tempDir;

      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);

      // Verify configuration documentation
      const configDir = path.join(outputPath, 'configuration');
      expect(await fileSystemService.pathExists(configDir)).toBe(true);

      const configReadme = path.join(configDir, 'README.md');
      expect(await fileSystemService.pathExists(configReadme)).toBe(true);
      
      const configContent = await fileSystemService.readFile(configReadme);
      expect(configContent).toContain('# Configuration Guide');
      expect(configContent).toContain('## Configuration Files');
      expect(configContent).toContain('## Quick Start');
    });

    it('should generate API documentation', async () => {
      const projectRoot = path.join(__dirname, '..', '..');
      const outputPath = tempDir;

      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);

      // Verify API documentation
      const apiDir = path.join(outputPath, 'api');
      expect(await fileSystemService.pathExists(apiDir)).toBe(true);

      const apiReadme = path.join(apiDir, 'README.md');
      expect(await fileSystemService.pathExists(apiReadme)).toBe(true);
      
      const apiContent = await fileSystemService.readFile(apiReadme);
      expect(apiContent).toContain('# API Documentation');
      expect(apiContent).toContain('## Overview');
      expect(apiContent).toContain('## Services');

      // Verify services documentation
      const servicesDoc = path.join(apiDir, 'services.md');
      expect(await fileSystemService.pathExists(servicesDoc)).toBe(true);
      
      const servicesContent = await fileSystemService.readFile(servicesDoc);
      expect(servicesContent).toContain('# Services');
      expect(servicesContent).toContain('## StudyService');
    });

    it('should generate user guide documentation', async () => {
      const projectRoot = path.join(__dirname, '..', '..');
      const outputPath = tempDir;

      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);

      // Verify user guide documentation
      const userGuideDir = path.join(outputPath, 'user-guide');
      expect(await fileSystemService.pathExists(userGuideDir)).toBe(true);

      const userGuideReadme = path.join(userGuideDir, 'README.md');
      expect(await fileSystemService.pathExists(userGuideReadme)).toBe(true);
      
      const userGuideContent = await fileSystemService.readFile(userGuideReadme);
      expect(userGuideContent).toContain('# User Guide');
      expect(userGuideContent).toContain('## Examples');
      expect(userGuideContent).toContain('## Tutorials');

      // Verify individual user guide files
      const expectedFiles = [
        'getting-started.md',
        'tutorials.md',
        'examples.md',
        'troubleshooting.md'
      ];

      for (const file of expectedFiles) {
        const filePath = path.join(userGuideDir, file);
        expect(await fileSystemService.pathExists(filePath)).toBe(true);
      }
    });

    it('should generate examples and templates documentation', async () => {
      const projectRoot = path.join(__dirname, '..', '..');
      const outputPath = tempDir;

      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);

      // Verify examples documentation
      const examplesDir = path.join(outputPath, 'examples');
      expect(await fileSystemService.pathExists(examplesDir)).toBe(true);

      const examplesReadme = path.join(examplesDir, 'README.md');
      expect(await fileSystemService.pathExists(examplesReadme)).toBe(true);
      
      const examplesContent = await fileSystemService.readFile(examplesReadme);
      expect(examplesContent).toContain('# Examples');
      expect(examplesContent).toContain('## Basic Usage');

      // Verify templates documentation
      const templatesDir = path.join(outputPath, 'templates');
      expect(await fileSystemService.pathExists(templatesDir)).toBe(true);

      const templatesReadme = path.join(templatesDir, 'README.md');
      expect(await fileSystemService.pathExists(templatesReadme)).toBe(true);
      
      const templatesContent = await fileSystemService.readFile(templatesReadme);
      expect(templatesContent).toContain('# Templates');
      expect(templatesContent).toContain('## Available Templates');
    });

    it('should handle errors gracefully', async () => {
      const invalidProjectRoot = '/nonexistent/project';
      const outputPath = tempDir;

      // Should not throw an error even with invalid project root
      await expect(documentationGenerator.generateAllDocumentation(invalidProjectRoot, outputPath))
        .resolves.not.toThrow();

      // Should still create the basic documentation structure
      expect(await fileSystemService.pathExists(path.join(outputPath, 'README.md'))).toBe(true);
    });

    it('should generate consistent documentation structure', async () => {
      const projectRoot = path.join(__dirname, '..', '..');
      const outputPath = tempDir;

      // Generate documentation twice
      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);
      const firstGeneration = await fileSystemService.readFile(path.join(outputPath, 'README.md'));

      // Clean up and regenerate
      await fs.rm(tempDir, { recursive: true, force: true });
      await fs.mkdir(tempDir, { recursive: true });
      
      await documentationGenerator.generateAllDocumentation(projectRoot, outputPath);
      const secondGeneration = await fileSystemService.readFile(path.join(outputPath, 'README.md'));

      // Should generate consistent content
      expect(firstGeneration).toBe(secondGeneration);
    });
  });
});
