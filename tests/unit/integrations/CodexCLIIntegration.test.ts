/**
 * Unit Tests for CodexCLIIntegration
 * 
 * Comprehensive unit tests with 100% coverage for the CodexCLIIntegration service.
 * Tests all methods, error scenarios, and edge cases.
 */

import { CodexCLIIntegration } from '../../../src/integrations/CodexCLIIntegration';
import { ICLIExecutionService } from '../../../src/contracts/infrastructure-contracts';
import { ICodexCLIService } from '../../../src/contracts/infrastructure-contracts';
import { IErrorHandlingService } from '../../../src/contracts/infrastructure-contracts';
import { CLIExecutionResult } from '../../../src/contracts/infrastructure-contracts';
import { CodexValidationResponse, CodexValidationResult, CodexCommandTemplate } from '../../../src/contracts/domain-contracts';

describe('CodexCLIIntegration', () => {
  let codexCLIIntegration: CodexCLIIntegration;
  let mockCLIExecutionService: jest.Mocked<ICLIExecutionService>;
  let mockCodexCLIService: jest.Mocked<ICodexCLIService>;
  let mockErrorHandlingService: jest.Mocked<IErrorHandlingService>;

  beforeEach(() => {
    // Create mocks
    mockCLIExecutionService = {
      executeCommand: jest.fn(),
      isCommandAvailable: jest.fn(),
      getCommandVersion: jest.fn(),
      executeCommandWithTimeout: jest.fn()
    } as any;

    mockCodexCLIService = {
      validateInstallation: jest.fn(),
      executeCodexCommand: jest.fn(),
      getVersion: jest.fn(),
      isAvailable: jest.fn(),
      getCLIPath: jest.fn()
    } as any;

    mockErrorHandlingService = {
      handleFileSystemError: jest.fn(),
      handleCLIExecutionError: jest.fn(),
      handleValidationError: jest.fn(),
      handleConfigurationError: jest.fn(),
      createUserFriendlyError: jest.fn()
    } as any;

    // Create CodexCLIIntegration instance
    codexCLIIntegration = new CodexCLIIntegration(
      mockCLIExecutionService,
      mockCodexCLIService,
      mockErrorHandlingService
    );
  });

  describe('Constructor', () => {
    it('should create CodexCLIIntegration instance', () => {
      expect(codexCLIIntegration).toBeInstanceOf(CodexCLIIntegration);
    });
  });

  describe('executeCodexCommand', () => {
    it('should execute Codex CLI command successfully', async () => {
      // Given: A successful CLI execution
      const command = 'codex';
      const args = ['generate', 'questions'];
      const options = { timeout: 30000 };
      
      const executionResult: CLIExecutionResult = {
        success: true,
        exitCode: 0,
        stdout: 'Command executed successfully',
        stderr: '',
        executionTime: 1500
      };

      mockCLIExecutionService.executeCommand.mockResolvedValue(executionResult);

      // When: The command is executed
      const result = await codexCLIIntegration.executeCodexCommand(command, args, options);

      // Then: The command should be executed successfully
      expect(result.success).toBe(true);
      expect(result.output).toBe('Command executed successfully');
      expect(result.executionTime).toBe(1500);
      expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(command, args, options);
    });

    it('should handle CLI execution errors', async () => {
      // Given: A failed CLI execution
      const command = 'codex';
      const args = ['invalid-command'];
      
      const executionResult: CLIExecutionResult = {
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: 'Command not found',
        executionTime: 500
      };

      mockCLIExecutionService.executeCommand.mockResolvedValue(executionResult);
      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'CLI_EXECUTION_ERROR',
        message: 'Command execution failed',
        details: { originalError: 'Command not found' },
        suggestions: ['Check command syntax'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Command execution failed');

      // When: The command is executed
      const result = await codexCLIIntegration.executeCodexCommand(command, args);

      // Then: The error should be handled
      expect(result.success).toBe(false);
      expect(result.error).toBe('Command execution failed');
      expect(mockErrorHandlingService.handleCLIExecutionError).toHaveBeenCalled();
    });

    it('should handle unexpected errors', async () => {
      // Given: An unexpected error during execution
      const command = 'codex';
      const args = ['generate'];
      
      mockCLIExecutionService.executeCommand.mockRejectedValue(new Error('Unexpected error'));
      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'UNEXPECTED_ERROR',
        message: 'Unexpected error occurred',
        details: { originalError: 'Unexpected error' },
        suggestions: ['Check system status'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Unexpected error occurred');

      // When: The command is executed
      const result = await codexCLIIntegration.executeCodexCommand(command, args);

      // Then: The error should be handled
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unexpected error occurred');
      expect(mockErrorHandlingService.handleCLIExecutionError).toHaveBeenCalled();
    });
  });

  describe('executeCodexCommandWithTimeout', () => {
    it('should execute command with timeout successfully', async () => {
      // Given: A successful CLI execution with timeout
      const command = 'codex';
      const args = ['generate', 'questions'];
      const timeout = 10000;
      
      const executionResult: CLIExecutionResult = {
        success: true,
        exitCode: 0,
        stdout: 'Command executed',
        stderr: '',
        executionTime: 2000
      };

      mockCLIExecutionService.executeCommandWithTimeout.mockResolvedValue(executionResult);

      // When: The command is executed with timeout
      const result = await codexCLIIntegration.executeCodexCommandWithTimeout(command, args, timeout);

      // Then: The command should be executed successfully
      expect(result.success).toBe(true);
      expect(result.output).toBe('Command executed');
      expect(result.executionTime).toBe(2000);
      expect(mockCLIExecutionService.executeCommandWithTimeout).toHaveBeenCalledWith(command, args, timeout);
    });

    it('should handle timeout errors', async () => {
      // Given: A timeout error
      const command = 'codex';
      const args = ['long-running-task'];
      const timeout = 5000;
      
      const executionResult: CLIExecutionResult = {
        success: false,
        exitCode: 124,
        stdout: '',
        stderr: 'Command timed out',
        executionTime: 5000
      };

      mockCLIExecutionService.executeCommandWithTimeout.mockResolvedValue(executionResult);
      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'CLI_TIMEOUT_ERROR',
        message: 'Command timed out',
        details: { originalError: 'Command timed out' },
        suggestions: ['Increase timeout', 'Check system resources'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Command timed out');

      // When: The command is executed with timeout
      const result = await codexCLIIntegration.executeCodexCommandWithTimeout(command, args, timeout);

      // Then: The timeout should be handled
      expect(result.success).toBe(false);
      expect(result.error).toBe('Command timed out');
      expect(mockErrorHandlingService.handleCLIExecutionError).toHaveBeenCalled();
    });
  });

  describe('validateCodexInstallation', () => {
    it('should validate Codex CLI installation successfully', async () => {
      // Given: A successful validation
      const validationResponse: CodexValidationResponse = {
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.2.0',
        timestamp: new Date()
      };

      mockCodexCLIService.validateInstallation.mockResolvedValue(validationResponse);

      // When: The installation is validated
      const result = await codexCLIIntegration.validateCodexInstallation();

      // Then: The validation should succeed
      expect(result.success).toBe(true);
      expect(result.output).toContain('Codex CLI validated successfully');
      expect(result.output).toContain('Version: 1.2.0');
      expect(mockCodexCLIService.validateInstallation).toHaveBeenCalled();
    });

    it('should handle validation failures', async () => {
      // Given: A failed validation
      const validationResponse: CodexValidationResponse = {
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found',
        suggestions: ['Install Codex CLI', 'Add to PATH'],
        timestamp: new Date()
      };

      mockCodexCLIService.validateInstallation.mockResolvedValue(validationResponse);

      // When: The installation is validated
      const result = await codexCLIIntegration.validateCodexInstallation();

      // Then: The validation should fail
      expect(result.success).toBe(false);
      expect(result.error).toContain('Codex CLI not found');
      expect(result.suggestions).toContain('Install Codex CLI');
      expect(result.suggestions).toContain('Add to PATH');
    });

    it('should handle validation errors', async () => {
      // Given: A validation error
      mockCodexCLIService.validateInstallation.mockRejectedValue(new Error('Validation failed'));
      mockErrorHandlingService.handleValidationError.mockReturnValue({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { originalError: 'Validation failed' },
        suggestions: ['Check system status'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Validation failed');

      // When: The installation is validated
      const result = await codexCLIIntegration.validateCodexInstallation();

      // Then: The error should be handled
      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed');
      expect(mockErrorHandlingService.handleValidationError).toHaveBeenCalled();
    });
  });

  describe('generateCommandTemplate', () => {
    it('should generate command template successfully', async () => {
      // Given: A valid command template
      const template: CodexCommandTemplate = {
        name: 'research-questions',
        description: 'Generate research questions',
        command: 'codex generate questions',
        parameters: [
          { name: 'study', type: 'string', required: true, description: 'Study name' },
          { name: 'topic', type: 'string', required: true, description: 'Research topic' }
        ],
        examples: ['codex generate questions --study "user-interviews" --topic "usability"'],
        category: 'research',
        version: '1.0.0'
      };

      const executionResult: CLIExecutionResult = {
        success: true,
        exitCode: 0,
        stdout: 'Template generated successfully',
        stderr: '',
        executionTime: 2000
      };

      mockCodexCLIService.executeCodexCommand.mockResolvedValue(executionResult);

      // When: The template is generated
      const result = await codexCLIIntegration.generateCommandTemplate(template);

      // Then: The template should be generated successfully
      expect(result.success).toBe(true);
      expect(result.output).toBe('Template generated successfully');
      expect(result.executionTime).toBe(2000);
      expect(mockCodexCLIService.executeCodexCommand).toHaveBeenCalledWith(
        'codex',
        ['generate', 'questions', '--study', '--topic']
      );
    });

    it('should handle template generation errors', async () => {
      // Given: A template generation error
      const template: CodexCommandTemplate = {
        name: 'invalid-template',
        description: 'Invalid template',
        command: 'codex invalid',
        parameters: [],
        examples: [],
        category: 'invalid',
        version: '1.0.0'
      };

      const executionResult: CLIExecutionResult = {
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: 'Template generation failed',
        executionTime: 1000
      };

      mockCodexCLIService.executeCodexCommand.mockResolvedValue(executionResult);
      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'TEMPLATE_GENERATION_ERROR',
        message: 'Template generation failed',
        details: { originalError: 'Template generation failed' },
        suggestions: ['Check template syntax'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Template generation failed');

      // When: The template is generated
      const result = await codexCLIIntegration.generateCommandTemplate(template);

      // Then: The error should be handled
      expect(result.success).toBe(false);
      expect(result.error).toBe('Template generation failed');
      expect(mockErrorHandlingService.handleCLIExecutionError).toHaveBeenCalled();
    });
  });

  describe('isCodexAvailable', () => {
    it('should return true when Codex is available', async () => {
      // Given: Codex is available
      mockCodexCLIService.isAvailable.mockResolvedValue(true);

      // When: Checking availability
      const result = await codexCLIIntegration.isCodexAvailable();

      // Then: Should return true
      expect(result).toBe(true);
      expect(mockCodexCLIService.isAvailable).toHaveBeenCalled();
    });

    it('should return false when Codex is not available', async () => {
      // Given: Codex is not available
      mockCodexCLIService.isAvailable.mockResolvedValue(false);

      // When: Checking availability
      const result = await codexCLIIntegration.isCodexAvailable();

      // Then: Should return false
      expect(result).toBe(false);
      expect(mockCodexCLIService.isAvailable).toHaveBeenCalled();
    });

    it('should return false when checking availability fails', async () => {
      // Given: Checking availability fails
      mockCodexCLIService.isAvailable.mockRejectedValue(new Error('Check failed'));

      // When: Checking availability
      const result = await codexCLIIntegration.isCodexAvailable();

      // Then: Should return false
      expect(result).toBe(false);
    });
  });

  describe('getCodexVersion', () => {
    it('should return Codex version when available', async () => {
      // Given: Codex version is available
      mockCodexCLIService.getVersion.mockResolvedValue('1.2.0');

      // When: Getting version
      const result = await codexCLIIntegration.getCodexVersion();

      // Then: Should return version
      expect(result).toBe('1.2.0');
      expect(mockCodexCLIService.getVersion).toHaveBeenCalled();
    });

    it('should return null when version is not available', async () => {
      // Given: Version is not available
      mockCodexCLIService.getVersion.mockResolvedValue(null);

      // When: Getting version
      const result = await codexCLIIntegration.getCodexVersion();

      // Then: Should return null
      expect(result).toBe(null);
      expect(mockCodexCLIService.getVersion).toHaveBeenCalled();
    });

    it('should return null when getting version fails', async () => {
      // Given: Getting version fails
      mockCodexCLIService.getVersion.mockRejectedValue(new Error('Version check failed'));

      // When: Getting version
      const result = await codexCLIIntegration.getCodexVersion();

      // Then: Should return null
      expect(result).toBe(null);
    });
  });

  describe('getCodexPath', () => {
    it('should return Codex path when available', async () => {
      // Given: Codex path is available
      mockCodexCLIService.getCLIPath.mockResolvedValue('/usr/local/bin/codex');

      // When: Getting path
      const result = await codexCLIIntegration.getCodexPath();

      // Then: Should return path
      expect(result).toBe('/usr/local/bin/codex');
      expect(mockCodexCLIService.getCLIPath).toHaveBeenCalled();
    });

    it('should return null when path is not available', async () => {
      // Given: Path is not available
      mockCodexCLIService.getCLIPath.mockResolvedValue(null);

      // When: Getting path
      const result = await codexCLIIntegration.getCodexPath();

      // Then: Should return null
      expect(result).toBe(null);
      expect(mockCodexCLIService.getCLIPath).toHaveBeenCalled();
    });

    it('should return null when getting path fails', async () => {
      // Given: Getting path fails
      mockCodexCLIService.getCLIPath.mockRejectedValue(new Error('Path check failed'));

      // When: Getting path
      const result = await codexCLIIntegration.getCodexPath();

      // Then: Should return null
      expect(result).toBe(null);
    });
  });

  describe('executeConcurrentCommands', () => {
    it('should execute multiple commands concurrently', async () => {
      // Given: Multiple commands to execute
      const commands = [
        { command: 'codex', args: ['generate', 'questions'], options: { timeout: 10000 } },
        { command: 'codex', args: ['generate', 'sources'], options: { timeout: 15000 } },
        { command: 'codex', args: ['generate', 'summary'], options: { timeout: 20000 } }
      ];

      // Mock successful executions with unique outputs
      mockCLIExecutionService.executeCommand
        .mockResolvedValueOnce({
          success: true,
          exitCode: 0,
          stdout: 'Task 0 completed',
          stderr: '',
          executionTime: 1000
        })
        .mockResolvedValueOnce({
          success: true,
          exitCode: 0,
          stdout: 'Task 1 completed',
          stderr: '',
          executionTime: 1000
        })
        .mockResolvedValueOnce({
          success: true,
          exitCode: 0,
          stdout: 'Task 2 completed',
          stderr: '',
          executionTime: 1000
        });

      // When: Executing commands concurrently
      const results = await codexCLIIntegration.executeConcurrentCommands(commands);

      // Then: All commands should be executed
      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.output).toBe(`Task ${index} completed`);
        expect(result.performanceMetrics?.concurrent).toBe(true);
      });
    });

    it('should handle concurrent execution errors', async () => {
      // Given: Commands that will fail
      const commands = [
        { command: 'codex', args: ['invalid'], options: {} }
      ];

      mockCLIExecutionService.executeCommand.mockRejectedValue(new Error('Concurrent execution failed'));
      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'CONCURRENT_EXECUTION_ERROR',
        message: 'Concurrent execution failed',
        details: { originalError: 'Concurrent execution failed' },
        suggestions: ['Check command syntax'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Concurrent execution failed');

      // When: Executing commands concurrently
      const results = await codexCLIIntegration.executeConcurrentCommands(commands);

      // Then: Should handle the error
      expect(results).toHaveLength(1);
      expect(results[0]?.success).toBe(false);
      expect(results[0]?.error).toBe('Concurrent execution failed');
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', () => {
      // When: Getting performance metrics
      const metrics = codexCLIIntegration.getPerformanceMetrics();

      // Then: Should return metrics object
      expect(metrics).toHaveProperty('totalExecutions');
      expect(metrics).toHaveProperty('averageExecutionTime');
      expect(metrics).toHaveProperty('successRate');
      expect(metrics).toHaveProperty('errorRate');
    });
  });

  describe('resetPerformanceMetrics', () => {
    it('should reset performance metrics', () => {
      // When: Resetting performance metrics
      expect(() => codexCLIIntegration.resetPerformanceMetrics()).not.toThrow();
    });
  });
});
