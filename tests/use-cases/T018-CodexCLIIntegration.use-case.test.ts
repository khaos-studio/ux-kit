/**
 * Use Case Tests for T018: Codex CLI Integration
 * 
 * These tests define the expected behavior and user scenarios for Codex CLI integration
 * following the TDD approach. They capture complete user journeys and expected outcomes
 * when users interact with Codex CLI through the UX-Kit system.
 */

import { CodexCLIIntegration } from '../../src/integrations/CodexCLIIntegration';
import { ICLIExecutionService } from '../../src/contracts/infrastructure-contracts';
import { ICodexCLIService } from '../../src/contracts/infrastructure-contracts';
import { IErrorHandlingService } from '../../src/contracts/infrastructure-contracts';
import { CLIExecutionResult, CLIExecutionOptions } from '../../src/contracts/infrastructure-contracts';
import { CodexValidationResponse, CodexValidationResult, CodexCommandTemplate } from '../../src/contracts/domain-contracts';

describe('T018: Codex CLI Integration Use Cases', () => {
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

  describe('Codex CLI Command Execution', () => {
    it('should execute Codex CLI commands successfully', async () => {
      // Given: A user wants to execute a Codex CLI command
      const command = 'codex';
      const args = ['generate', '--template', 'research-questions'];
      const options: CLIExecutionOptions = {
        workingDirectory: '/test/project',
        timeout: 30000,
        captureOutput: true
      };
      
      const expectedResult: CLIExecutionResult = {
        success: true,
        exitCode: 0,
        stdout: 'Codex command executed successfully',
        stderr: '',
        executionTime: 1500
      };

      mockCLIExecutionService.executeCommand.mockResolvedValue(expectedResult);

      // When: The user executes a Codex CLI command
      const result = await codexCLIIntegration.executeCodexCommand(command, args, options);

      // Then: The command should be executed successfully
      expect(result.success).toBe(true);
      expect(result.output).toBe('Codex command executed successfully');
      expect(result.executionTime).toBe(1500);
      expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(command, args, options);
    });

    it('should handle Codex CLI command execution errors gracefully', async () => {
      // Given: A user executes a Codex CLI command that fails
      const command = 'codex';
      const args = ['invalid-command'];
      const options: CLIExecutionOptions = {
        workingDirectory: '/test/project',
        timeout: 30000
      };
      
      const errorResult: CLIExecutionResult = {
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: 'Command not found: invalid-command',
        executionTime: 500
      };

      mockCLIExecutionService.executeCommand.mockResolvedValue(errorResult);
      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'CLI_EXECUTION_ERROR',
        message: 'Codex CLI command execution failed',
        details: { originalError: 'Command not found: invalid-command' },
        suggestions: ['Check command syntax', 'Verify Codex CLI installation'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Codex CLI command execution failed');

      // When: The user executes an invalid Codex CLI command
      const result = await codexCLIIntegration.executeCodexCommand(command, args, options);

      // Then: The error should be handled gracefully
      expect(result.success).toBe(false);
      expect(result.error).toContain('Codex CLI command execution failed');
      expect(mockErrorHandlingService.handleCLIExecutionError).toHaveBeenCalled();
    });

    it('should handle Codex CLI command timeouts', async () => {
      // Given: A user executes a Codex CLI command that times out
      const command = 'codex';
      const args = ['long-running-task'];
      const options: CLIExecutionOptions = {
        workingDirectory: '/test/project',
        timeout: 5000
      };
      
      const timeoutResult: CLIExecutionResult = {
        success: false,
        exitCode: 124,
        stdout: '',
        stderr: 'Command timed out',
        executionTime: 5000
      };

      mockCLIExecutionService.executeCommandWithTimeout.mockResolvedValue(timeoutResult);
      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'CLI_TIMEOUT_ERROR',
        message: 'Codex CLI command timed out',
        details: { originalError: 'Command timed out', timeout: 5000 },
        suggestions: ['Increase timeout value', 'Check system resources'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Codex CLI command timed out');

      // When: The user executes a long-running Codex CLI command
      const result = await codexCLIIntegration.executeCodexCommandWithTimeout(command, args, 5000);

      // Then: The timeout should be handled gracefully
      expect(result.success).toBe(false);
      expect(result.error).toContain('Codex CLI command timed out');
      expect(mockCLIExecutionService.executeCommandWithTimeout).toHaveBeenCalledWith(command, args, 5000);
    });
  });

  describe('Codex CLI Validation and Setup', () => {
    it('should validate Codex CLI installation successfully', async () => {
      // Given: A user wants to validate Codex CLI installation
      const validationResponse: CodexValidationResponse = {
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.2.0',
        timestamp: new Date()
      };

      mockCodexCLIService.validateInstallation.mockResolvedValue(validationResponse);

      // When: The user validates Codex CLI installation
      const result = await codexCLIIntegration.validateCodexInstallation();

      // Then: The validation should succeed
      expect(result.success).toBe(true);
      expect(result.output).toContain('Codex CLI validated successfully');
      expect(result.output).toContain('Version: 1.2.0');
      expect(mockCodexCLIService.validateInstallation).toHaveBeenCalled();
    });

    it('should handle Codex CLI not found during validation', async () => {
      // Given: A user validates Codex CLI installation but CLI is not found
      const validationResponse: CodexValidationResponse = {
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'Codex CLI not found in PATH',
        suggestions: ['Install Codex CLI', 'Add to PATH'],
        timestamp: new Date()
      };

      mockCodexCLIService.validateInstallation.mockResolvedValue(validationResponse);

      // When: The user validates Codex CLI installation
      const result = await codexCLIIntegration.validateCodexInstallation();

      // Then: The validation should fail with helpful suggestions
      expect(result.success).toBe(false);
      expect(result.error).toContain('Codex CLI not found in PATH');
      expect(result.suggestions).toContain('Install Codex CLI');
      expect(result.suggestions).toContain('Add to PATH');
    });

    it('should handle Codex CLI version incompatibility', async () => {
      // Given: A user validates Codex CLI installation but version is incompatible
      const validationResponse: CodexValidationResponse = {
        result: CodexValidationResult.CLI_INVALID,
        errorMessage: 'Codex CLI version 0.5.0 is incompatible. Required: >= 1.0.0',
        suggestions: ['Update Codex CLI', 'Check version requirements'],
        timestamp: new Date()
      };

      mockCodexCLIService.validateInstallation.mockResolvedValue(validationResponse);

      // When: The user validates Codex CLI installation
      const result = await codexCLIIntegration.validateCodexInstallation();

      // Then: The validation should fail with version information
      expect(result.success).toBe(false);
      expect(result.error).toContain('Codex CLI version 0.5.0 is incompatible');
      expect(result.suggestions).toContain('Update Codex CLI');
    });
  });

  describe('Codex CLI Command Templates', () => {
    it('should generate Codex command templates successfully', async () => {
      // Given: A user wants to generate Codex command templates
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

      mockCodexCLIService.executeCodexCommand.mockResolvedValue({
        success: true,
        exitCode: 0,
        stdout: 'Template generated successfully',
        stderr: '',
        executionTime: 2000
      });

      // When: The user generates a Codex command template
      const result = await codexCLIIntegration.generateCommandTemplate(template);

      // Then: The template should be generated successfully
      expect(result.success).toBe(true);
      expect(result.output).toContain('Template generated successfully');
      expect(mockCodexCLIService.executeCodexCommand).toHaveBeenCalledWith(
        'codex',
        ['generate', 'questions', '--study', '--topic']
      );
    });

    it('should handle template generation errors', async () => {
      // Given: A user tries to generate a Codex command template but it fails
      const template: CodexCommandTemplate = {
        name: 'invalid-template',
        description: 'Invalid template',
        command: 'codex invalid',
        parameters: [],
        examples: [],
        category: 'invalid',
        version: '1.0.0'
      };

      mockCodexCLIService.executeCodexCommand.mockResolvedValue({
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: 'Template generation failed',
        executionTime: 1000
      });

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'TEMPLATE_GENERATION_ERROR',
        message: 'Failed to generate Codex command template',
        details: { originalError: 'Template generation failed' },
        suggestions: ['Check template syntax', 'Verify Codex CLI installation'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Failed to generate Codex command template');

      // When: The user generates an invalid template
      const result = await codexCLIIntegration.generateCommandTemplate(template);

      // Then: The error should be handled gracefully
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to generate Codex command template');
      expect(mockErrorHandlingService.handleCLIExecutionError).toHaveBeenCalled();
    });
  });

  describe('Codex CLI Monitoring and Logging', () => {
    it('should log successful Codex CLI command executions', async () => {
      // Given: A user executes a successful Codex CLI command
      const command = 'codex';
      const args = ['generate', '--template', 'research-questions'];
      const options: CLIExecutionOptions = {
        workingDirectory: '/test/project',
        timeout: 30000
      };
      
      const executionResult: CLIExecutionResult = {
        success: true,
        exitCode: 0,
        stdout: 'Command executed successfully',
        stderr: '',
        executionTime: 1500
      };

      mockCLIExecutionService.executeCommand.mockResolvedValue(executionResult);

      // When: The user executes a Codex CLI command
      const result = await codexCLIIntegration.executeCodexCommand(command, args, options);

      // Then: The execution should be logged
      expect(result.success).toBe(true);
      expect(result.logs).toBeDefined();
      expect(result.logs?.executionTime).toBe(1500);
      expect(result.logs?.command).toBe('codex generate --template research-questions');
    });

    it('should track performance metrics for Codex CLI commands', async () => {
      // Given: A user executes multiple Codex CLI commands
      const commands = [
        { command: 'codex', args: ['generate', 'questions'], expectedTime: 1000 },
        { command: 'codex', args: ['generate', 'sources'], expectedTime: 2000 },
        { command: 'codex', args: ['generate', 'summary'], expectedTime: 1500 }
      ];

      for (const cmd of commands) {
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          success: true,
          exitCode: 0,
          stdout: 'Command executed',
          stderr: '',
          executionTime: cmd.expectedTime
        });
      }

      // When: The user executes multiple commands
      const results = await Promise.all(
        commands.map(cmd => 
          codexCLIIntegration.executeCodexCommand(cmd.command, cmd.args, {})
        )
      );

      // Then: Performance metrics should be tracked
      expect(results).toHaveLength(3);
      results.forEach((result: any, index: number) => {
        expect(result.success).toBe(true);
        expect(result.executionTime).toBeGreaterThan(0);
        expect(result.performanceMetrics).toBeDefined();
      });
    });

    it('should handle logging errors gracefully', async () => {
      // Given: A user executes a Codex CLI command but logging fails
      const command = 'codex';
      const args = ['generate', 'questions'];
      
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        success: true,
        exitCode: 0,
        stdout: 'Command executed',
        stderr: '',
        executionTime: 1000
      });

      // Mock logging error
      const originalConsoleLog = console.log;
      console.log = jest.fn().mockImplementation(() => {
        throw new Error('Logging failed');
      });

      // When: The user executes a command with logging failure
      const result = await codexCLIIntegration.executeCodexCommand(command, args, {});

      // Then: The command should still succeed despite logging failure
      expect(result.success).toBe(true);
      expect(result.output).toBe('Command executed');

      // Restore console.log
      console.log = originalConsoleLog;
    });
  });

  describe('Codex CLI Error Recovery', () => {
    it('should provide recovery suggestions for CLI errors', async () => {
      // Given: A user encounters a Codex CLI error
      const command = 'codex';
      const args = ['invalid-command'];
      
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: 'Command not found',
        executionTime: 500
      });

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'CLI_COMMAND_NOT_FOUND',
        message: 'Codex CLI command not found',
        details: { originalError: 'Command not found' },
        suggestions: [
          'Check command syntax',
          'Verify Codex CLI installation',
          'Update to latest version',
          'Check PATH environment variable'
        ],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Codex CLI command not found');

      // When: The user encounters a CLI error
      const result = await codexCLIIntegration.executeCodexCommand(command, args, {});

      // Then: Recovery suggestions should be provided
      expect(result.success).toBe(false);
      expect(result.error).toContain('Codex CLI command not found');
      expect(result.suggestions).toContain('Check command syntax');
      expect(result.suggestions).toContain('Verify Codex CLI installation');
      expect(result.suggestions).toContain('Update to latest version');
    });

    it('should handle network connectivity issues', async () => {
      // Given: A user executes a Codex CLI command that requires network access
      const command = 'codex';
      const args = ['generate', '--online'];
      
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: 'Network connection failed',
        executionTime: 5000
      });

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        details: { originalError: 'Network connection failed' },
        suggestions: [
          'Check internet connection',
          'Verify network settings',
          'Try offline mode',
          'Contact network administrator'
        ],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Network connection failed');

      // When: The user encounters a network error
      const result = await codexCLIIntegration.executeCodexCommand(command, args, {});

      // Then: Network-specific suggestions should be provided
      expect(result.success).toBe(false);
      expect(result.error).toContain('Network connection failed');
      expect(result.suggestions).toContain('Check internet connection');
      expect(result.suggestions).toContain('Try offline mode');
    });

    it('should handle permission denied errors', async () => {
      // Given: A user executes a Codex CLI command without sufficient permissions
      const command = 'codex';
      const args = ['install', '--global'];
      
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: 'Permission denied',
        executionTime: 1000
      });

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'PERMISSION_DENIED',
        message: 'Permission denied',
        details: { originalError: 'Permission denied' },
        suggestions: [
          'Run with administrator privileges',
          'Check file permissions',
          'Use local installation',
          'Contact system administrator'
        ],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Permission denied');

      // When: The user encounters a permission error
      const result = await codexCLIIntegration.executeCodexCommand(command, args, {});

      // Then: Permission-specific suggestions should be provided
      expect(result.success).toBe(false);
      expect(result.error).toContain('Permission denied');
      expect(result.suggestions).toContain('Run with administrator privileges');
      expect(result.suggestions).toContain('Check file permissions');
    });
  });

  describe('Codex CLI Integration with Existing Services', () => {
    it('should integrate with existing CLI execution service', async () => {
      // Given: A user executes a Codex CLI command through the integration
      const command = 'codex';
      const args = ['generate', 'questions'];
      const options: CLIExecutionOptions = {
        workingDirectory: '/test/project',
        timeout: 30000
      };
      
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        success: true,
        exitCode: 0,
        stdout: 'Questions generated',
        stderr: '',
        executionTime: 2000
      });

      // When: The user executes a command
      const result = await codexCLIIntegration.executeCodexCommand(command, args, options);

      // Then: The existing CLI execution service should be used
      expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(command, args, options);
      expect(result.success).toBe(true);
      expect(result.output).toBe('Questions generated');
    });

    it('should integrate with existing error handling service', async () => {
      // Given: A user encounters an error during Codex CLI execution
      const command = 'codex';
      const args = ['invalid'];
      
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: 'Invalid command',
        executionTime: 500
      });

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'CLI_ERROR',
        message: 'Invalid command',
        details: { originalError: 'Invalid command' },
        suggestions: ['Check command syntax'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Invalid command');

      // When: The user encounters an error
      const result = await codexCLIIntegration.executeCodexCommand(command, args, {});

      // Then: The existing error handling service should be used
      expect(mockErrorHandlingService.handleCLIExecutionError).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid command');
    });

    it('should maintain compatibility with existing Codex CLI service', async () => {
      // Given: A user wants to use existing Codex CLI service functionality
      mockCodexCLIService.isAvailable.mockResolvedValue(true);
      mockCodexCLIService.getVersion.mockResolvedValue('1.2.0');
      // Note: getCommandHelp doesn't exist in ICodexCLIService interface
      // This test will need to be updated when we implement the actual service

      // When: The user checks Codex CLI availability and version
      const isAvailable = await codexCLIIntegration.isCodexAvailable();
      const version = await codexCLIIntegration.getCodexVersion();

      // Then: The existing Codex CLI service should be used
      expect(isAvailable).toBe(true);
      expect(version).toBe('1.2.0');
      expect(mockCodexCLIService.isAvailable).toHaveBeenCalled();
      expect(mockCodexCLIService.getVersion).toHaveBeenCalled();
    });
  });

  describe('Codex CLI Performance and Optimization', () => {
    it('should optimize command execution for better performance', async () => {
      // Given: A user executes multiple Codex CLI commands
      const commands = [
        { command: 'codex', args: ['generate', 'questions'], timeout: 10000 },
        { command: 'codex', args: ['generate', 'sources'], timeout: 15000 },
        { command: 'codex', args: ['generate', 'summary'], timeout: 20000 }
      ];

      for (const cmd of commands) {
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          success: true,
          exitCode: 0,
          stdout: 'Command executed',
          stderr: '',
          executionTime: 1000  // Fixed small execution time
        });
      }

      // When: The user executes multiple commands with optimization
      const results = await Promise.all(
        commands.map(cmd => 
          codexCLIIntegration.executeCodexCommand(cmd.command, cmd.args, { timeout: cmd.timeout })
        )
      );

      // Then: Commands should be optimized for performance
      expect(results).toHaveLength(3);
      results.forEach((result: any, index: number) => {
        expect(result.success).toBe(true);
        expect(result.executionTime).toBeLessThanOrEqual(commands[index]?.timeout || 0);
        expect(result.performanceMetrics?.optimized).toBe(true);
      });
    });

    it('should handle concurrent command execution', async () => {
      // Given: A user executes multiple Codex CLI commands concurrently
      const concurrentCommands = Array.from({ length: 5 }, (_, i) => ({
        command: 'codex',
        args: ['generate', `task-${i}`],
        options: { timeout: 10000 }
      }));

      // Mock unique responses for each command
      mockCLIExecutionService.executeCommand
        .mockResolvedValueOnce({
          success: true,
          exitCode: 0,
          stdout: 'Task task-0 completed',
          stderr: '',
          executionTime: 1000
        })
        .mockResolvedValueOnce({
          success: true,
          exitCode: 0,
          stdout: 'Task task-1 completed',
          stderr: '',
          executionTime: 1000
        })
        .mockResolvedValueOnce({
          success: true,
          exitCode: 0,
          stdout: 'Task task-2 completed',
          stderr: '',
          executionTime: 1000
        })
        .mockResolvedValueOnce({
          success: true,
          exitCode: 0,
          stdout: 'Task task-3 completed',
          stderr: '',
          executionTime: 1000
        })
        .mockResolvedValueOnce({
          success: true,
          exitCode: 0,
          stdout: 'Task task-4 completed',
          stderr: '',
          executionTime: 1000
        });

      // When: The user executes commands concurrently
      const results = await Promise.all(
        concurrentCommands.map(cmd => 
          codexCLIIntegration.executeCodexCommand(cmd.command, cmd.args, cmd.options)
        )
      );

      // Then: All commands should execute successfully
      expect(results).toHaveLength(5);
      results.forEach((result: any, index: number) => {
        expect(result.success).toBe(true);
        expect(result.output).toContain(`Task task-${index} completed`);
        expect(result.performanceMetrics).toBeDefined();
      });
    });
  });
});
