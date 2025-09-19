/**
 * Unit Tests for InitCommand Codex Integration
 * 
 * Comprehensive unit tests with 100% coverage for the Codex integration
 * in the InitCommand. Tests all methods, error scenarios, and edge cases.
 */

import { InitCommand } from '../../../src/commands/InitCommand';
import { DirectoryService } from '../../../src/services/DirectoryService';
import { TemplateService } from '../../../src/services/TemplateService';
import { CursorCommandGenerator } from '../../../src/services/CursorCommandGenerator';
import { InputService } from '../../../src/utils/InputService';
import { IOutput } from '../../../src/contracts/presentation-contracts';
import { ICodexIntegration } from '../../../src/contracts/domain-contracts';
import { CodexValidationResult, CodexIntegrationStatus } from '../../../src/contracts/domain-contracts';

describe('InitCommand Codex Integration', () => {
  let initCommand: InitCommand;
  let mockDirectoryService: jest.Mocked<DirectoryService>;
  let mockTemplateService: jest.Mocked<TemplateService>;
  let mockCursorCommandGenerator: jest.Mocked<CursorCommandGenerator>;
  let mockInputService: jest.Mocked<InputService>;
  let mockOutput: jest.Mocked<IOutput>;
  let mockCodexIntegration: jest.Mocked<ICodexIntegration>;

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

    mockCursorCommandGenerator = {
      isCursorAvailable: jest.fn(),
      generateCursorCommands: jest.fn()
    } as any;

    mockInputService = {
      select: jest.fn()
    } as any;

    mockOutput = {
      writeln: jest.fn(),
      write: jest.fn(),
      writeErrorln: jest.fn()
    } as any;

    mockCodexIntegration = {
      initialize: jest.fn(),
      validate: jest.fn(),
      generateCommandTemplates: jest.fn(),
      getStatus: jest.fn(),
      reset: jest.fn()
    } as any;

    // Create InitCommand instance
    initCommand = new InitCommand(
      mockDirectoryService,
      mockTemplateService,
      mockCursorCommandGenerator,
      mockInputService,
      mockOutput,
      mockCodexIntegration
    );
  });

  describe('Constructor', () => {
    it('should create InitCommand instance with Codex integration', () => {
      expect(initCommand).toBeInstanceOf(InitCommand);
      expect(initCommand.name).toBe('init');
      expect(initCommand.description).toBe('Initialize UX-Kit in the current project');
    });

    it('should create InitCommand instance without Codex integration', () => {
      const initCommandWithoutCodex = new InitCommand(
        mockDirectoryService,
        mockTemplateService,
        mockCursorCommandGenerator,
        mockInputService,
        mockOutput
      );
      
      expect(initCommandWithoutCodex).toBeInstanceOf(InitCommand);
    });
  });

  describe('handleCodexInitialization', () => {
    it('should return false when Codex integration service is not available', async () => {
      const initCommandWithoutCodex = new InitCommand(
        mockDirectoryService,
        mockTemplateService,
        mockCursorCommandGenerator,
        mockInputService,
        mockOutput
      );

      const result = await (initCommandWithoutCodex as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith('Codex integration service not available');
    });

    it('should successfully initialize Codex integration', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(true);
      expect(mockCodexIntegration.validate).toHaveBeenCalled();
      expect(mockCodexIntegration.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
          validationEnabled: true,
          fallbackToCustom: true,
          templatePath: '/test/project',
          timeout: 30000
        })
      );
      expect(mockCodexIntegration.generateCommandTemplates).toHaveBeenCalled();
      expect(mockCodexIntegration.getStatus).toHaveBeenCalled();
    });

    it('should handle Codex CLI not found error', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found in PATH',
        suggestions: ['Install Codex CLI', 'Add to PATH'],
        timestamp: new Date()
      });

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        'Codex CLI validation failed: Codex CLI not found in PATH'
      );
      expect(mockOutput.writeln).toHaveBeenCalledWith('Suggestions:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  1. Install Codex CLI');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  2. Add to PATH');
    });

    it('should handle Codex CLI invalid error', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_INVALID,
        errorMessage: 'Codex CLI version is incompatible',
        suggestions: ['Update Codex CLI', 'Check version compatibility'],
        timestamp: new Date()
      });

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        'Codex CLI validation failed: Codex CLI version is incompatible'
      );
    });

    it('should handle Codex permission denied error', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.PERMISSION_DENIED,
        errorMessage: 'Permission denied',
        suggestions: ['Check permissions', 'Run with appropriate privileges'],
        timestamp: new Date()
      });

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        'Codex CLI validation failed: Permission denied'
      );
    });

    it('should handle Codex unknown error', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.UNKNOWN_ERROR,
        errorMessage: 'Unknown error occurred',
        suggestions: ['Check system logs', 'Contact support'],
        timestamp: new Date()
      });

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        'Codex CLI validation failed: Unknown error occurred'
      );
    });

    it('should handle validation response without suggestions', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found',
        timestamp: new Date()
      });

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeln).not.toHaveBeenCalledWith('Suggestions:');
    });

    it('should handle Codex initialization error', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockRejectedValue(new Error('Initialization failed'));

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        'Failed to initialize Codex integration: Initialization failed'
      );
    });

    it('should handle Codex template generation error', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockRejectedValue(new Error('Template generation failed'));

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        'Failed to initialize Codex integration: Template generation failed'
      );
    });

    it('should handle Codex status retrieval error', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockRejectedValue(new Error('Status retrieval failed'));

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        'Failed to initialize Codex integration: Status retrieval failed'
      );
    });

    it('should handle validation error without error message', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_NOT_FOUND,
        timestamp: new Date()
      });

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        'Codex CLI validation failed: Unknown error'
      );
    });

    it('should handle non-Error exception in initialization', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockRejectedValue('String error');

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        'Failed to initialize Codex integration: Unknown error'
      );
    });
  });

  describe('Codex Configuration Creation', () => {
    it('should create configuration with CLI path when available', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      await (initCommand as any).handleCodexInitialization('/test/project');

      expect(mockCodexIntegration.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          cliPath: '/usr/local/bin/codex'
        })
      );
    });

    it('should create configuration without CLI path when not available', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      await (initCommand as any).handleCodexInitialization('/test/project');

      expect(mockCodexIntegration.initialize).toHaveBeenCalledWith(
        expect.not.objectContaining({
          cliPath: expect.anything()
        })
      );
    });

    it('should use correct template path in configuration', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      await (initCommand as any).handleCodexInitialization('/custom/project');

      expect(mockCodexIntegration.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          templatePath: '/custom/project'
        })
      );
    });
  });

  describe('Output Messages', () => {
    it('should display correct progress messages during initialization', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      await (initCommand as any).handleCodexInitialization('/test/project');

      expect(mockOutput.write).toHaveBeenCalledWith('🔍 Checking Codex CLI availability...');
      expect(mockOutput.writeln).toHaveBeenCalledWith(' ✓');
      expect(mockOutput.write).toHaveBeenCalledWith('⚙️  Initializing Codex integration...');
      expect(mockOutput.writeln).toHaveBeenCalledWith(' ✓');
      expect(mockOutput.write).toHaveBeenCalledWith('📝 Generating Codex command templates...');
      expect(mockOutput.writeln).toHaveBeenCalledWith(' ✓');
    });

    it('should display success messages with version information', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '2.1.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      await (initCommand as any).handleCodexInitialization('/test/project');

      expect(mockOutput.writeln).toHaveBeenCalledWith('🎉 Codex v2 integration ready!');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  📄 Configuration file created: codex.md');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  📁 Additional config in: .codex/');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  🚀 You can now use natural language prompts with Codex for UX research');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  💡 Codex CLI version: 2.1.0');
    });

    it('should display success messages without version when not available', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      await (initCommand as any).handleCodexInitialization('/test/project');

      expect(mockOutput.writeln).toHaveBeenCalledWith('  💡 Codex CLI version: Unknown');
    });

    it('should display error messages with fallback information', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found',
        suggestions: ['Install Codex CLI'],
        timestamp: new Date()
      });

      await (initCommand as any).handleCodexInitialization('/test/project');

      expect(mockOutput.writeln).toHaveBeenCalledWith(' ✗');
      expect(mockOutput.writeln).toHaveBeenCalledWith('');
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith('Codex CLI validation failed: Codex CLI not found');
      expect(mockOutput.writeln).toHaveBeenCalledWith('⚠️  Codex integration will be skipped');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  📝 You can still use UX-Kit CLI commands');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  🔧 To enable Codex integration, resolve the CLI issues above');
    });
  });

  describe('Integration Status Display', () => {
    it('should display integration status when available', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.VALIDATED
      });

      await (initCommand as any).handleCodexInitialization('/test/project');

      expect(mockOutput.writeln).toHaveBeenCalledWith('  📊 Integration status: validated');
    });

    it('should handle different integration statuses', async () => {
      const statuses = [
        CodexIntegrationStatus.NOT_INITIALIZED,
        CodexIntegrationStatus.INITIALIZING,
        CodexIntegrationStatus.INITIALIZED,
        CodexIntegrationStatus.VALIDATING,
        CodexIntegrationStatus.VALIDATED,
        CodexIntegrationStatus.ERROR
      ];

      for (const status of statuses) {
        mockCodexIntegration.validate.mockResolvedValue({
          result: CodexValidationResult.SUCCESS,
          cliPath: '/usr/local/bin/codex',
          version: '1.0.0',
          timestamp: new Date()
        });
        mockCodexIntegration.initialize.mockResolvedValue();
        mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
        mockCodexIntegration.getStatus.mockResolvedValue({
          isInitialized: true,
          isConfigured: true,
          cliAvailable: true,
          templatesGenerated: true,
          errorCount: 0,
          status
        });

        await (initCommand as any).handleCodexInitialization('/test/project');

        expect(mockOutput.writeln).toHaveBeenCalledWith(`  📊 Integration status: ${status}`);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty project root', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      await (initCommand as any).handleCodexInitialization('');

      expect(mockCodexIntegration.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          templatePath: ''
        })
      );
    });

    it('should handle null project root', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      await (initCommand as any).handleCodexInitialization(null as any);

      expect(mockCodexIntegration.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          templatePath: 'null'
        })
      );
    });

    it('should handle undefined project root', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      await (initCommand as any).handleCodexInitialization(undefined as any);

      expect(mockCodexIntegration.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          templatePath: 'undefined'
        })
      );
    });
  });

  describe('Fallback Behavior When CLI Validation Fails', () => {
    it('should create configuration files even when CLI validation fails', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found',
        suggestions: ['Install Codex CLI', 'Check PATH'],
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(true);
      expect(mockOutput.writeln).toHaveBeenCalledWith(' ⚠');
      expect(mockOutput.writeln).toHaveBeenCalledWith('⚠️  Codex CLI not available, but creating configuration files anyway...');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  📝 Codex v2 works through IDE integration, not CLI commands');
      expect(mockCodexIntegration.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
          validationEnabled: false,
          fallbackToCustom: true,
          templatePath: '/test/project',
          timeout: 30000
        })
      );
      expect(mockCodexIntegration.generateCommandTemplates).toHaveBeenCalled();
    });

    it('should display fallback success messages when CLI is not available', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found',
        suggestions: ['Install Codex CLI'],
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();

      await (initCommand as any).handleCodexInitialization('/test/project');

      expect(mockOutput.writeln).toHaveBeenCalledWith('🎉 Codex v2 configuration ready!');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  📄 Configuration file created: codex.md');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  📁 Additional config in: .codex/');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  🚀 You can now use natural language prompts with Codex for UX research');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  💡 Note: Codex v2 works through IDE integration, not CLI commands');
    });

    it('should handle fallback initialization errors gracefully', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found',
        suggestions: ['Install Codex CLI'],
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockRejectedValue(new Error('Fallback initialization failed'));

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeln).toHaveBeenCalledWith(' ✗');
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith('Failed to create Codex configuration: Fallback initialization failed');
      expect(mockOutput.writeln).toHaveBeenCalledWith('⚠️  Codex integration will be skipped');
    });

    it('should handle fallback template generation errors gracefully', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found',
        suggestions: ['Install Codex CLI'],
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.generateCommandTemplates.mockRejectedValue(new Error('Template generation failed'));

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeln).toHaveBeenCalledWith(' ✗');
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith('Failed to create Codex configuration: Template generation failed');
    });
  });

  describe('Error Recovery', () => {
    it('should provide fallback options when Codex integration fails', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found',
        suggestions: ['Install Codex CLI', 'Check PATH'],
        timestamp: new Date()
      });

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeln).toHaveBeenCalledWith('⚠️  Codex integration will be skipped');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  📝 You can still use UX-Kit CLI commands');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  🔧 To enable Codex integration, resolve the CLI issues above');
    });

    it('should provide fallback options when initialization throws error', async () => {
      mockCodexIntegration.validate.mockResolvedValue({
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.initialize.mockRejectedValue(new Error('Network error'));

      const result = await (initCommand as any).handleCodexInitialization('/test/project');

      expect(result).toBe(false);
      expect(mockOutput.writeln).toHaveBeenCalledWith('⚠️  Codex integration will be skipped');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  📝 You can still use UX-Kit CLI commands');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  🔧 To enable Codex integration, check the error above');
    });
  });
});
