/**
 * Use Case Tests for T017: InitCommand Codex Integration
 * 
 * These tests define the expected behavior and user scenarios for Codex integration
 * in the InitCommand following the TDD approach. They capture complete user journeys
 * and expected outcomes when users select Codex as their AI agent.
 */

import { InitCommand } from '../../src/commands/InitCommand';
import { DirectoryService } from '../../src/services/DirectoryService';
import { TemplateService } from '../../src/services/TemplateService';
import { CursorCommandGenerator } from '../../src/services/CursorCommandGenerator';
import { InputService } from '../../src/utils/InputService';
import { IOutput } from '../../src/contracts/presentation-contracts';
import { ICodexIntegration } from '../../src/contracts/domain-contracts';
import { CodexConfiguration, CodexValidationResponse, CodexStatus, CodexIntegrationStatus } from '../../src/contracts/domain-contracts';

describe('T017: InitCommand Codex Integration Use Cases', () => {
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

  describe('Codex AI Agent Selection', () => {
    it('should include Codex as an option in AI agent selection', async () => {
      // Given: A user is initializing UX-Kit and needs to select an AI agent
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockInputService.select.mockResolvedValue('codex');
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
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
        status: 'initialized' as any
      });

      // When: The user is prompted to select an AI agent
      const result = await initCommand.execute([], { projectRoot: '/test/project' });

      // Then: Codex should be available as an option and the selection should be processed
      expect(mockInputService.select).toHaveBeenCalledWith(
        expect.stringContaining('AI Agent Configuration'),
        expect.arrayContaining([
          expect.objectContaining({ value: 'codex', label: 'Codex' })
        ]),
        'cursor'
      );
      expect(result.success).toBe(true);
      expect(result.data?.aiAgent).toBe('codex');
    });

    it('should handle Codex selection via command line option', async () => {
      // Given: A user specifies Codex via command line option
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
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
        status: 'initialized' as any
      });

      // When: The user runs init with --aiAgent codex
      const result = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Codex should be selected without prompting
      expect(mockInputService.select).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data?.aiAgent).toBe('codex');
    });

    it('should validate Codex as a valid AI agent option', async () => {
      // Given: A user provides Codex as the AI agent
      const validationResult = await initCommand.validate([], { aiAgent: 'codex' });

      // Then: Codex should be considered valid
      expect(validationResult.valid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
    });
  });

  describe('Codex Initialization Process', () => {
    it('should initialize Codex integration when Codex is selected', async () => {
      // Given: A user selects Codex as their AI agent
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      // When: The initialization process runs
      const result = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Codex integration should be initialized
      expect(mockCodexIntegration.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
          validationEnabled: true,
          fallbackToCustom: true
        })
      );
      expect(result.success).toBe(true);
    });

    it('should validate Codex CLI availability during initialization', async () => {
      // Given: A user selects Codex and the CLI is available
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });

      // When: The initialization process runs
      await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Codex CLI should be validated
      expect(mockCodexIntegration.validate).toHaveBeenCalled();
    });

    it('should generate Codex command templates during initialization', async () => {
      // Given: A user selects Codex and initialization is successful
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();

      // When: The initialization process runs
      await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Codex command templates should be generated
      expect(mockCodexIntegration.generateCommandTemplates).toHaveBeenCalled();
    });
  });

  describe('Codex CLI Validation and Error Handling', () => {
    it('should handle Codex CLI not found gracefully', async () => {
      // Given: A user selects Codex but CLI is not available
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'cli_not_found' as any,
        errorMessage: 'Codex CLI not found in PATH',
        suggestions: ['Install Codex CLI', 'Add to PATH'],
        timestamp: new Date()
      });

      // When: The initialization process runs
      const result = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Should handle the error gracefully and provide helpful feedback
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        expect.stringContaining('Codex CLI not found')
      );
      expect(result.success).toBe(false);
    });

    it('should handle Codex CLI validation failures with suggestions', async () => {
      // Given: A user selects Codex but CLI validation fails
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'cli_invalid' as any,
        errorMessage: 'Codex CLI version is incompatible',
        suggestions: ['Update Codex CLI', 'Check version compatibility'],
        timestamp: new Date()
      });

      // When: The initialization process runs
      const result = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Should provide helpful error messages and suggestions
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        expect.stringContaining('Codex CLI version is incompatible')
      );
      expect(result.success).toBe(false);
    });

    it('should handle Codex initialization errors with fallback', async () => {
      // Given: A user selects Codex but initialization fails
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.initialize.mockRejectedValue(new Error('Initialization failed'));

      // When: The initialization process runs
      const result = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Should handle the error and provide fallback options
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize Codex integration')
      );
      expect(result.success).toBe(false);
    });
  });

  describe('Codex Configuration and Setup', () => {
    it('should create configuration file with Codex settings', async () => {
      // Given: A user selects Codex as their AI agent
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });

      // When: The initialization process runs
      await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Configuration file should be created with Codex settings
      expect(mockDirectoryService.createConfigFile).toHaveBeenCalledWith(
        '/test/project',
        expect.objectContaining({
          aiAgent: 'codex'
        })
      );
    });

    it('should display Codex-specific success messages', async () => {
      // Given: A user successfully initializes with Codex
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: 'initialized' as any
      });

      // When: The initialization process completes successfully
      await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Should display Codex-specific success messages
      expect(mockOutput.writeln).toHaveBeenCalledWith(
        expect.stringContaining('UX-Kit initialized successfully')
      );
    });

    it('should show Codex integration status and next steps', async () => {
      // Given: A user successfully initializes with Codex
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: CodexIntegrationStatus.INITIALIZED
      });

      // When: The initialization process completes
      await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Should show Codex integration status
      expect(mockCodexIntegration.getStatus).toHaveBeenCalled();
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain backward compatibility with existing Cursor integration', async () => {
      // Given: A user selects Cursor (existing functionality)
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCursorCommandGenerator.isCursorAvailable.mockResolvedValue(true);
      mockCursorCommandGenerator.generateCursorCommands.mockResolvedValue();

      // When: The initialization process runs with Cursor
      const result = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'cursor'
      });

      // Then: Existing Cursor functionality should work unchanged
      expect(mockCursorCommandGenerator.isCursorAvailable).toHaveBeenCalled();
      expect(mockCursorCommandGenerator.generateCursorCommands).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data?.aiAgent).toBe('cursor');
    });

    it('should maintain backward compatibility with custom AI agent', async () => {
      // Given: A user selects custom AI agent (existing functionality)
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);

      // When: The initialization process runs with custom
      const result = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'custom'
      });

      // Then: Custom AI agent functionality should work unchanged
      expect(result.success).toBe(true);
      expect(result.data?.aiAgent).toBe('custom');
    });

    it('should not interfere with existing template and directory services', async () => {
      // Given: A user initializes with any AI agent
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);

      // When: The initialization process runs
      await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Existing services should be called as before
      expect(mockDirectoryService.createUXKitStructure).toHaveBeenCalledWith('/test/project');
      expect(mockDirectoryService.createConfigFile).toHaveBeenCalled();
      expect(mockDirectoryService.createPrinciplesFile).toHaveBeenCalledWith('/test/project');
      expect(mockTemplateService.copyTemplates).toHaveBeenCalledWith('/test/project', 'default');
    });
  });

  describe('User Interaction Flows', () => {
    it('should provide clear feedback during Codex initialization steps', async () => {
      // Given: A user selects Codex and initialization is in progress
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });

      // When: The initialization process runs
      await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Should provide clear progress feedback
      expect(mockOutput.write).toHaveBeenCalledWith(
        expect.stringContaining('Creating .uxkit directory structure')
      );
      expect(mockOutput.write).toHaveBeenCalledWith(
        expect.stringContaining('Creating configuration file')
      );
    });

    it('should handle user cancellation gracefully', async () => {
      // Given: A user cancels during AI agent selection
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockInputService.select.mockRejectedValue(new Error('User cancelled'));

      // When: The initialization process is cancelled
      const result = await initCommand.execute([], { projectRoot: '/test/project' });

      // Then: Should handle cancellation gracefully
      expect(result.success).toBe(false);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize UX-Kit')
      );
    });

    it('should provide helpful error messages with actionable suggestions', async () => {
      // Given: A user encounters an error during Codex initialization
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.initialize.mockRejectedValue(new Error('Permission denied'));

      // When: The initialization process fails
      const result = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: Should provide helpful error messages
      expect(result.success).toBe(false);
      expect(result.message).toContain('UX-Kit initialization completed but Codex integration failed');
      expect(result.data?.codexIntegrationFailed).toBe(true);
    });
  });

  describe('Integration with Existing Services', () => {
    it('should integrate Codex services without breaking existing functionality', async () => {
      // Given: A user initializes with Codex
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);
      mockCodexIntegration.initialize.mockResolvedValue();
      mockCodexIntegration.validate.mockResolvedValue({
        result: 'success' as any,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      });
      mockCodexIntegration.generateCommandTemplates.mockResolvedValue();
      mockCodexIntegration.getStatus.mockResolvedValue({
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        errorCount: 0,
        status: 'initialized' as any
      });

      // When: The initialization process runs
      const result = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });

      // Then: All existing services should work alongside Codex integration
      expect(mockDirectoryService.createUXKitStructure).toHaveBeenCalled();
      expect(mockDirectoryService.createConfigFile).toHaveBeenCalled();
      expect(mockDirectoryService.createPrinciplesFile).toHaveBeenCalled();
      expect(mockTemplateService.copyTemplates).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should handle mixed AI agent scenarios correctly', async () => {
      // Given: A user switches between different AI agents
      mockDirectoryService.isUXKitInitialized.mockResolvedValue(false);

      // When: Testing different AI agent selections
      const codexResult = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'codex'
      });
      
      const cursorResult = await initCommand.execute([], { 
        projectRoot: '/test/project',
        aiAgent: 'cursor'
      });

      // Then: Each AI agent should be handled appropriately
      expect(codexResult.data?.aiAgent).toBe('codex');
      expect(cursorResult.data?.aiAgent).toBe('cursor');
    });
  });
});
