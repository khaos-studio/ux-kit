/**
 * Unit tests for InitCommand
 * 
 * Tests the initialization command functionality including:
 * - Command execution with various options
 * - Validation of command arguments and options
 * - Error handling and edge cases
 * - Help system functionality
 */

import { InitCommand } from '../../../src/commands/InitCommand';
import { DirectoryService } from '../../../src/services/DirectoryService';
import { TemplateService } from '../../../src/services/TemplateService';
import { IOutput } from '../../../src/contracts/presentation-contracts';

describe('InitCommand', () => {
  let initCommand: InitCommand;
  let mockDirectoryService: jest.Mocked<DirectoryService>;
  let mockTemplateService: jest.Mocked<TemplateService>;
  let mockOutput: jest.Mocked<IOutput>;

  beforeEach(() => {
    // Create mocks
    mockDirectoryService = {
      isUXKitInitialized: jest.fn(),
      createUXKitStructure: jest.fn(),
      createConfigFile: jest.fn(),
      createPrinciplesFile: jest.fn()
    } as any;

    mockTemplateService = {
      copyTemplates: jest.fn()
    } as any;

    mockOutput = {
      writeln: jest.fn(),
      writeErrorln: jest.fn()
    } as any;

    // Create command instance
    initCommand = new InitCommand(
      mockDirectoryService,
      mockTemplateService,
      mockOutput
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Command Properties', () => {
    it('should have correct command properties', () => {
      expect(initCommand.name).toBe('init');
      expect(initCommand.description).toBe('Initialize UX-Kit in the current project');
      expect(initCommand.usage).toBe('uxkit init [options]');
      expect(initCommand.arguments).toEqual([]);
      expect(initCommand.options).toHaveLength(2);
      expect(initCommand.examples).toHaveLength(2);
    });

    it('should have correct options configuration', () => {
      const aiAgentOption = initCommand.options.find(opt => opt.name === 'aiAgent');
      const templateOption = initCommand.options.find(opt => opt.name === 'template');

      expect(aiAgentOption).toBeDefined();
      expect(aiAgentOption?.type).toBe('string');
      expect(aiAgentOption?.required).toBe(false);
      expect(aiAgentOption?.defaultValue).toBe('cursor');
      expect(aiAgentOption?.aliases).toEqual(['a']);

      expect(templateOption).toBeDefined();
      expect(templateOption?.type).toBe('string');
      expect(templateOption?.required).toBe(false);
      expect(templateOption?.defaultValue).toBe('default');
      expect(templateOption?.aliases).toEqual(['t']);
    });
  });

  describe('execute', () => {
    const defaultOptions = {
      projectRoot: '/test/project',
      aiAgent: 'cursor',
      template: 'default'
    };

    it('should successfully initialize UX-Kit when not already initialized', async () => {
      // Arrange
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockDirectoryService.createUXKitStructure.mockResolvedValue(undefined);
      mockDirectoryService.createConfigFile.mockResolvedValue(undefined);
      mockDirectoryService.createPrinciplesFile.mockResolvedValue(undefined);
      mockTemplateService.copyTemplates.mockResolvedValue(undefined);

      // Act
      const result = await initCommand.execute([], defaultOptions);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('UX-Kit initialized successfully in this project');
      expect(result.data).toEqual({
        projectRoot: '/test/project',
        aiAgent: 'cursor',
        template: 'default'
      });

      // Verify service calls
      expect(mockDirectoryService.isUXKitInitialized).toHaveBeenCalledWith('/test/project');
      expect(mockDirectoryService.createUXKitStructure).toHaveBeenCalledWith('/test/project');
      expect(mockDirectoryService.createConfigFile).toHaveBeenCalledWith('/test/project', {
        aiAgent: 'cursor'
      });
      expect(mockDirectoryService.createPrinciplesFile).toHaveBeenCalledWith('/test/project');
      expect(mockTemplateService.copyTemplates).toHaveBeenCalledWith('/test/project', 'default');

      // Verify output messages
      expect(mockOutput.writeln).toHaveBeenCalledWith('Creating .uxkit directory structure...');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Creating configuration file...');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Creating memory/principles.md...');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Copying template files...');
      expect(mockOutput.writeln).toHaveBeenCalledWith('UX-Kit initialized successfully!');
    });

    it('should return success when already initialized', async () => {
      // Arrange
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(true);

      // Act
      const result = await initCommand.execute([], defaultOptions);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('UX-Kit already initialized in this project');

      // Verify only initialization check was called
      expect(mockDirectoryService.isUXKitInitialized).toHaveBeenCalledWith('/test/project');
      expect(mockDirectoryService.createUXKitStructure).not.toHaveBeenCalled();
      expect(mockDirectoryService.createConfigFile).not.toHaveBeenCalled();
      expect(mockDirectoryService.createPrinciplesFile).not.toHaveBeenCalled();
      expect(mockTemplateService.copyTemplates).not.toHaveBeenCalled();
    });

    it('should use process.cwd() when projectRoot is not provided', async () => {
      // Arrange
      const optionsWithoutProjectRoot = { aiAgent: 'cursor', template: 'default' };
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockDirectoryService.createUXKitStructure.mockResolvedValue(undefined);
      mockDirectoryService.createConfigFile.mockResolvedValue(undefined);
      mockDirectoryService.createPrinciplesFile.mockResolvedValue(undefined);
      mockTemplateService.copyTemplates.mockResolvedValue(undefined);

      // Act
      await initCommand.execute([], optionsWithoutProjectRoot);

      // Assert
      expect(mockDirectoryService.isUXKitInitialized).toHaveBeenCalledWith(process.cwd());
    });

    it('should handle custom AI agent and template options', async () => {
      // Arrange
      const customOptions = {
        projectRoot: '/test/project',
        aiAgent: 'codex',
        template: 'custom'
      };
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockDirectoryService.createUXKitStructure.mockResolvedValue(undefined);
      mockDirectoryService.createConfigFile.mockResolvedValue(undefined);
      mockDirectoryService.createPrinciplesFile.mockResolvedValue(undefined);
      mockTemplateService.copyTemplates.mockResolvedValue(undefined);

      // Act
      const result = await initCommand.execute([], customOptions);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        projectRoot: '/test/project',
        aiAgent: 'codex',
        template: 'custom'
      });

      expect(mockDirectoryService.createConfigFile).toHaveBeenCalledWith('/test/project', {
        aiAgent: 'codex'
      });
      expect(mockTemplateService.copyTemplates).toHaveBeenCalledWith('/test/project', 'custom');
    });

    it('should handle errors during directory service operations', async () => {
      // Arrange
      const error = new Error('Directory creation failed');
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockDirectoryService.createUXKitStructure.mockRejectedValue(error);

      // Act
      const result = await initCommand.execute([], defaultOptions);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to initialize UX-Kit: Directory creation failed');
      expect(result.errors).toEqual(['Directory creation failed']);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith('Failed to initialize UX-Kit: Directory creation failed');
    });

    it('should handle errors during template service operations', async () => {
      // Arrange
      const error = new Error('Template copy failed');
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockDirectoryService.createUXKitStructure.mockResolvedValue(undefined);
      mockDirectoryService.createConfigFile.mockResolvedValue(undefined);
      mockDirectoryService.createPrinciplesFile.mockResolvedValue(undefined);
      mockTemplateService.copyTemplates.mockRejectedValue(error);

      // Act
      const result = await initCommand.execute([], defaultOptions);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to initialize UX-Kit: Template copy failed');
      expect(result.errors).toEqual(['Template copy failed']);
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockDirectoryService.createUXKitStructure.mockRejectedValue('String error');

      // Act
      const result = await initCommand.execute([], defaultOptions);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to initialize UX-Kit: Unknown error occurred');
      expect(result.errors).toEqual(['Unknown error occurred']);
    });
  });

  describe('validate', () => {
    it('should return valid result for valid options', async () => {
      // Arrange
      const validOptions = {
        aiAgent: 'cursor',
        template: 'default'
      };

      // Act
      const result = await initCommand.validate([], validOptions);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate AI agent option', async () => {
      // Test valid AI agents
      const validAgents = ['cursor', 'codex', 'custom'];
      
      for (const agent of validAgents) {
        const result = await initCommand.validate([], { aiAgent: agent });
        expect(result.valid).toBe(true);
      }

      // Test invalid AI agent
      const result = await initCommand.validate([], { aiAgent: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toBeDefined();
      expect(result.errors[0]!.field).toBe('aiAgent');
      expect(result.errors[0]!.message).toBe('AI agent must be one of: cursor, codex, custom');
      expect(result.errors[0]!.value).toBe('invalid');
    });

    it('should validate template option type', async () => {
      // Test valid template (string)
      const result1 = await initCommand.validate([], { template: 'default' });
      expect(result1.valid).toBe(true);

      // Test invalid template (non-string)
      const result2 = await initCommand.validate([], { template: 123 });
      expect(result2.valid).toBe(false);
      expect(result2.errors).toHaveLength(1);
      expect(result2.errors[0]).toBeDefined();
      expect(result2.errors[0]!.field).toBe('template');
      expect(result2.errors[0]!.message).toBe('Template must be a string');
      expect(result2.errors[0]!.value).toBe(123);
    });

    it('should handle multiple validation errors', async () => {
      // Arrange
      const invalidOptions = {
        aiAgent: 'invalid',
        template: 123
      };

      // Act
      const result = await initCommand.validate([], invalidOptions);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0]).toBeDefined();
      expect(result.errors[1]).toBeDefined();
      expect(result.errors[0]!.field).toBe('aiAgent');
      expect(result.errors[1]!.field).toBe('template');
    });

    it('should handle empty options', async () => {
      // Act
      const result = await initCommand.validate([], {});

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('showHelp', () => {
    it('should display help information correctly', () => {
      // Act
      initCommand.showHelp();

      // Assert
      expect(mockOutput.writeln).toHaveBeenCalledWith('Usage: uxkit init [options]');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nInitialize UX-Kit in the current project');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nOptions:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  --aiAgent, -a    AI agent provider to use (cursor, codex, custom)');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  --template, -t    Template source to use');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nExamples:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  Initialize with default settings: uxkit init');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  Initialize with specific AI agent: uxkit init --aiAgent codex');
    });
  });
});
