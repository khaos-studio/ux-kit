/**
 * Unit Tests for CodexCommandGenerator
 * 
 * Tests the CodexCommandGenerator service that creates Codex v2 configuration files
 * in the project root (codex.md and .codex/ directory).
 */

import { CodexCommandGenerator } from '../../../../src/services/codex/CodexCommandGenerator';
import { IFileSystemService } from '../../../../src/contracts/infrastructure-contracts';
import { CodexConfiguration } from '../../../../src/contracts/domain-contracts';

describe('CodexCommandGenerator', () => {
  let codexCommandGenerator: CodexCommandGenerator;
  let mockFileSystemService: jest.Mocked<IFileSystemService>;
  const mockConfig: CodexConfiguration = {
    enabled: true,
    validationEnabled: true,
    fallbackToCustom: true,
    templatePath: '/test/project',
    timeout: 30000
  };

  beforeEach(() => {
    mockFileSystemService = {
      writeFile: jest.fn(),
      readFile: jest.fn(),
      fileExists: jest.fn(),
      pathExists: jest.fn(),
      createDirectory: jest.fn(),
      deleteFile: jest.fn(),
      deleteDirectory: jest.fn(),
      listFiles: jest.fn(),
      listDirectories: jest.fn(),
      copyFile: jest.fn(),
      moveFile: jest.fn(),
      getFileStats: jest.fn(),
      ensureDirectoryExists: jest.fn(),
      joinPaths: jest.fn(),
      dirname: jest.fn(),
      basename: jest.fn()
    } as any;

    codexCommandGenerator = new CodexCommandGenerator(mockFileSystemService);
  });

  describe('Constructor', () => {
    it('should create CodexCommandGenerator instance', () => {
      expect(codexCommandGenerator).toBeInstanceOf(CodexCommandGenerator);
    });
  });

  describe('generateTemplates', () => {

    it('should create codex.md file in project root', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(mockConfig);

      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        '/test/project/codex.md',
        expect.stringContaining('# Codex Configuration for UX-Kit')
      );
    });

    it('should create .codex directory in project root', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(mockConfig);

      expect(mockFileSystemService.pathExists).toHaveBeenCalledWith('/test/project/.codex');
      expect(mockFileSystemService.createDirectory).toHaveBeenCalledWith('/test/project/.codex', true);
    });

    it('should not create .codex directory if it already exists', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(true);
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(mockConfig);

      expect(mockFileSystemService.createDirectory).not.toHaveBeenCalled();
    });

    it('should create prompts directory in .codex', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(mockConfig);

      expect(mockFileSystemService.pathExists).toHaveBeenCalledWith('/test/project/.codex/prompts');
      expect(mockFileSystemService.createDirectory).toHaveBeenCalledWith('/test/project/.codex/prompts', true);
    });

    it('should create UX research prompt files', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(mockConfig);

      // Check that prompt files are created
      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        '/test/project/.codex/prompts/create-study.md',
        expect.stringContaining('# Create UX Research Study')
      );
      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        '/test/project/.codex/prompts/generate-questions.md',
        expect.stringContaining('# Generate Research Questions')
      );
      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        '/test/project/.codex/prompts/synthesize-findings.md',
        expect.stringContaining('# Synthesize Research Findings')
      );
    });

    it('should create README.md in .codex directory', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(mockConfig);

      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        '/test/project/.codex/README.md',
        expect.stringContaining('# Codex Integration for UX-Kit')
      );
    });

    it('should use process.cwd() when templatePath is not provided', async () => {
      const configWithoutPath: CodexConfiguration = {
        enabled: true,
        validationEnabled: true,
        fallbackToCustom: true,
        templatePath: '', // Empty string will trigger process.cwd() fallback
        timeout: 30000
      };

      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(configWithoutPath);

      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/codex.md'),
        expect.any(String)
      );
    });

    it('should handle file system errors gracefully', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockRejectedValue(new Error('Permission denied'));

      await expect(codexCommandGenerator.generateTemplates(mockConfig))
        .rejects.toThrow('Failed to generate Codex v2 configuration: Permission denied');
    });

    it('should handle write file errors gracefully', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockRejectedValue(new Error('Disk full'));

      await expect(codexCommandGenerator.generateTemplates(mockConfig))
        .rejects.toThrow('Failed to generate Codex v2 configuration: Disk full');
    });
  });

  describe('generateCodexConfig', () => {
    it('should generate valid markdown configuration content', () => {
      const config = codexCommandGenerator.generateCodexConfig();

      expect(config).toContain('# Codex Configuration for UX-Kit');
      expect(config).toContain('## Project Overview');
      expect(config).toContain('This is a UX research project using UX-Kit');
      expect(config).toContain('## Available Commands');
      expect(config).toContain('### Study Management');
      expect(config).toContain('### Research Workflow');
      expect(config).toContain('## How to Help');
      expect(config).toContain('## Example Prompts');
      expect(config).toContain('## File Locations');
    });

    it('should include UX research specific commands', () => {
      const config = codexCommandGenerator.generateCodexConfig();

      expect(config).toContain('Create Study');
      expect(config).toContain('Generate Questions');
      expect(config).toContain('Process Interview');
      expect(config).toContain('Synthesize Findings');
      expect(config).toContain('Create Summary');
    });

    it('should include example prompts', () => {
      const config = codexCommandGenerator.generateCodexConfig();

      expect(config).toContain('Create a new study about user onboarding experience');
      expect(config).toContain('Generate interview questions for understanding user pain points');
      expect(config).toContain('Help me synthesize findings from 5 user interviews');
    });

    it('should include file structure information', () => {
      const config = codexCommandGenerator.generateCodexConfig();

      expect(config).toContain('.uxkit/studies/');
      expect(config).toContain('.uxkit/templates/');
      expect(config).toContain('.uxkit/config.yaml');
      expect(config).toContain('codex.md');
    });
  });

  describe('generateCodexReadme', () => {
    it('should generate valid markdown README content', () => {
      const readme = codexCommandGenerator.generateCodexReadme();

      expect(readme).toContain('# Codex Integration for UX-Kit');
      expect(readme).toContain('## What\'s Here');
      expect(readme).toContain('## How It Works');
      expect(readme).toContain('## Getting Started');
      expect(readme).toContain('## Example Usage');
    });

    it('should explain the integration approach', () => {
      const readme = codexCommandGenerator.generateCodexReadme();

      expect(readme).toContain('Codex v2 reads the `codex.md` file in the project root');
      expect(readme).toContain('natural language prompts');
      expect(readme).toContain('configured in your IDE');
      expect(readme).toContain('prompts/');
      expect(readme).toContain('Available Prompts');
    });

    it('should include example usage', () => {
      const readme = codexCommandGenerator.generateCodexReadme();

      expect(readme).toContain('Create a new UX research study about mobile app usability');
      expect(readme).toContain('Generate interview questions for user feedback collection');
      expect(readme).toContain('Help me synthesize findings from user interviews');
    });
  });

  describe('getDefaultTemplates', () => {
    it('should return default template structure', () => {
      const templates = codexCommandGenerator.getDefaultTemplates();

      expect(templates).toBeDefined();
      expect(Array.isArray(templates)).toBe(true);
    });

    it('should include study management templates', () => {
      const templates = codexCommandGenerator.getDefaultTemplates();

      const studyTemplates = templates.filter(t => 
        t.name.includes('study') || t.name.includes('Study')
      );
      expect(studyTemplates.length).toBeGreaterThan(0);
    });

    it('should include research workflow templates', () => {
      const templates = codexCommandGenerator.getDefaultTemplates();

      const researchTemplates = templates.filter(t => 
        t.name.includes('research') || t.name.includes('interview') || t.name.includes('synthesis')
      );
      expect(researchTemplates.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty templatePath', async () => {
      const config: CodexConfiguration = {
        enabled: true,
        validationEnabled: true,
        fallbackToCustom: true,
        templatePath: '',
        timeout: 30000
      };

      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(config);

      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/codex.md'),
        expect.any(String)
      );
    });

    it('should handle null templatePath', async () => {
      const config: CodexConfiguration = {
        enabled: true,
        validationEnabled: true,
        fallbackToCustom: true,
        templatePath: null as any,
        timeout: 30000
      };

      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(config);

      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/codex.md'),
        expect.any(String)
      );
    });

    it('should handle undefined templatePath', async () => {
      const config: CodexConfiguration = {
        enabled: true,
        validationEnabled: true,
        fallbackToCustom: true,
        templatePath: undefined as any,
        timeout: 30000
      };

      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(config);

      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/codex.md'),
        expect.any(String)
      );
    });

    it('should handle non-Error exceptions', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockRejectedValue('String error');

      await expect(codexCommandGenerator.generateTemplates(mockConfig))
        .rejects.toThrow('Failed to generate Codex v2 configuration: Unknown error');
    });
  });

  describe('Integration with File System', () => {
    it('should create all required files in correct order', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      await codexCommandGenerator.generateTemplates(mockConfig);

      // Verify directory creation first
      expect(mockFileSystemService.pathExists).toHaveBeenCalledWith('/test/project/.codex');
      expect(mockFileSystemService.createDirectory).toHaveBeenCalledWith('/test/project/.codex', true);

      // Verify both files are created
      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        '/test/project/codex.md',
        expect.any(String)
      );
      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        '/test/project/.codex/README.md',
        expect.any(String)
      );
    });

    it('should handle partial failures gracefully', async () => {
      mockFileSystemService.pathExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile
        .mockResolvedValueOnce() // First write succeeds
        .mockRejectedValueOnce(new Error('Second write failed')); // Second write fails

      await expect(codexCommandGenerator.generateTemplates(mockConfig))
        .rejects.toThrow('Failed to generate Codex v2 configuration: Second write failed');
    });
  });
});