/**
 * T014: CodexCLIService - Use Case Tests
 * 
 * These tests define the expected behavior for the CodexCLIService
 * before implementing the actual service logic.
 */

import { CodexCLIService } from '../../src/services/codex/CodexCLIService';
import { ICLIExecutionService, CLIExecutionResult } from '../../src/contracts/infrastructure-contracts';
import {
  CodexValidationResponse,
  CodexValidationResult
} from '../../src/contracts/domain-contracts';

// Mock the CLI execution service
jest.mock('../../src/contracts/infrastructure-contracts');

describe('T014: CodexCLIService - Use Cases', () => {
  
  describe('Given a CodexCLIService', () => {
    let codexCLIService: CodexCLIService;
    let mockCLIExecutionService: jest.Mocked<ICLIExecutionService>;

    beforeEach(() => {
      // Create mock CLI execution service
      mockCLIExecutionService = {
        executeCommand: jest.fn(),
        isCommandAvailable: jest.fn(),
        getCommandVersion: jest.fn(),
        executeCommandWithTimeout: jest.fn()
      } as jest.Mocked<ICLIExecutionService>;

      // Create CodexCLIService instance
      codexCLIService = new CodexCLIService(mockCLIExecutionService);
    });

    describe('When validating Codex CLI installation', () => {
      it('Then should return success when Codex CLI is properly installed and working', async () => {
        // Given: Codex CLI is available and working
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: 'Codex CLI v1.0.0',
          stderr: '',
          executionTime: 100,
          success: true
        });

        // When: Validating installation
        const result = await codexCLIService.validateInstallation();

        // Then: Should return success response
        expect(result.result).toBe(CodexValidationResult.SUCCESS);
        expect(result.timestamp).toBeInstanceOf(Date);
      });

      it('Then should return CLI_NOT_FOUND when Codex CLI is not installed', async () => {
        // Given: Codex CLI is not available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

        // When: Validating installation
        const result = await codexCLIService.validateInstallation();

        // Then: Should return CLI_NOT_FOUND response
        expect(result.result).toBe(CodexValidationResult.CLI_NOT_FOUND);
        expect(result.errorMessage).toContain('Codex CLI is not installed');
        expect(result.suggestions).toContain('Install Codex CLI');
      });

      it('Then should return CLI_INVALID when Codex CLI is installed but not working', async () => {
        // Given: Codex CLI is available but not working
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 1,
          stdout: '',
          stderr: 'Codex CLI error: Invalid configuration',
          executionTime: 50,
          success: false,
          error: 'Command failed'
        });

        // When: Validating installation
        const result = await codexCLIService.validateInstallation();

        // Then: Should return CLI_INVALID response
        expect(result.result).toBe(CodexValidationResult.CLI_INVALID);
        expect(result.errorMessage).toContain('Codex CLI is not working properly');
        expect(result.suggestions).toContain('Check Codex CLI installation');
      });

      it('Then should return PERMISSION_DENIED when access is denied', async () => {
        // Given: Codex CLI is available but permission denied
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 13,
          stdout: '',
          stderr: 'Permission denied',
          executionTime: 10,
          success: false,
          error: 'Permission denied'
        });

        // When: Validating installation
        const result = await codexCLIService.validateInstallation();

        // Then: Should return PERMISSION_DENIED response
        expect(result.result).toBe(CodexValidationResult.PERMISSION_DENIED);
        expect(result.errorMessage).toContain('Permission denied');
        expect(result.suggestions).toContain('Check file permissions');
      });

      it('Then should return UNKNOWN_ERROR for unexpected errors', async () => {
        // Given: Codex CLI is available but throws unexpected error
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockRejectedValue(new Error('Unexpected error'));

        // When: Validating installation
        const result = await codexCLIService.validateInstallation();

        // Then: Should return UNKNOWN_ERROR response
        expect(result.result).toBe(CodexValidationResult.UNKNOWN_ERROR);
        expect(result.errorMessage).toContain('Unexpected error');
        expect(result.suggestions).toContain('Check system configuration');
      });

      it('Then should include CLI path and version in success response', async () => {
        // Given: Codex CLI is available and working
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: 'Codex CLI v1.2.3',
          stderr: '',
          executionTime: 100,
          success: true
        });

        // When: Validating installation
        const result = await codexCLIService.validateInstallation();

        // Then: Should include CLI path and version
        expect(result.result).toBe(CodexValidationResult.SUCCESS);
        expect(result.cliPath).toBeDefined();
        expect(result.version).toBeDefined();
      });
    });

    describe('When getting Codex CLI version', () => {
      it('Then should return version when Codex CLI is available', async () => {
        // Given: Codex CLI is available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: 'Codex CLI v2.1.0',
          stderr: '',
          executionTime: 50,
          success: true
        });

        // When: Getting version
        const version = await codexCLIService.getVersion();

        // Then: Should return version
        expect(version).toBe('2.1.0');
      });

      it('Then should return null when Codex CLI is not available', async () => {
        // Given: Codex CLI is not available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

        // When: Getting version
        const version = await codexCLIService.getVersion();

        // Then: Should return null
        expect(version).toBeNull();
      });

      it('Then should return null when version command fails', async () => {
        // Given: Codex CLI is available but version command fails
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 1,
          stdout: '',
          stderr: 'Version command failed',
          executionTime: 10,
          success: false
        });

        // When: Getting version
        const version = await codexCLIService.getVersion();

        // Then: Should return null
        expect(version).toBeNull();
      });

      it('Then should handle version parsing errors gracefully', async () => {
        // Given: Codex CLI returns invalid version format
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: 'Invalid version format',
          stderr: '',
          executionTime: 50,
          success: true
        });

        // When: Getting version
        const version = await codexCLIService.getVersion();

        // Then: Should return null
        expect(version).toBeNull();
      });
    });

    describe('When executing Codex commands', () => {
      it('Then should execute command successfully', async () => {
        // Given: Codex CLI is available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: 'Command executed successfully',
          stderr: '',
          executionTime: 200,
          success: true
        });

        // When: Executing command
        const result = await codexCLIService.executeCodexCommand('create', ['project', '--name', 'test']);

        // Then: Should return success result
        expect(result.success).toBe(true);
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toBe('Command executed successfully');
        expect(result.stderr).toBe('');
        expect(result.executionTime).toBe(200);
      });

      it('Then should handle command execution errors', async () => {
        // Given: Codex CLI is available but command fails
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 1,
          stdout: '',
          stderr: 'Command failed: Invalid arguments',
          executionTime: 100,
          success: false,
          error: 'Command failed'
        });

        // When: Executing command
        const result = await codexCLIService.executeCodexCommand('create', ['invalid']);

        // Then: Should return error result
        expect(result.success).toBe(false);
        expect(result.exitCode).toBe(1);
        expect(result.stderr).toBe('Command failed: Invalid arguments');
        expect(result.error).toBe('Command failed');
      });

      it('Then should throw error when Codex CLI is not available', async () => {
        // Given: Codex CLI is not available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

        // When: Executing command
        // Then: Should throw error
        await expect(codexCLIService.executeCodexCommand('create', ['project']))
          .rejects.toThrow('Codex CLI is not available');
      });

      it('Then should handle command execution timeouts', async () => {
        // Given: Codex CLI is available but command times out
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 124,
          stdout: '',
          stderr: 'Command timed out',
          executionTime: 30000,
          success: false,
          error: 'Command timed out'
        });

        // When: Executing command
        const result = await codexCLIService.executeCodexCommand('long-running', ['command']);

        // Then: Should return timeout result
        expect(result.success).toBe(false);
        expect(result.exitCode).toBe(124);
        expect(result.stderr).toBe('Command timed out');
        expect(result.error).toBe('Command timed out');
      });

      it('Then should pass correct arguments to CLI execution service', async () => {
        // Given: Codex CLI is available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: 'Success',
          stderr: '',
          executionTime: 100,
          success: true
        });

        // When: Executing command with specific arguments
        await codexCLIService.executeCodexCommand('generate', ['component', '--name', 'Button']);

        // Then: Should call CLI execution service with correct arguments
        expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(
          'codex',
          ['generate', 'component', '--name', 'Button'],
          expect.objectContaining({
            timeout: expect.any(Number),
            captureOutput: true,
            captureError: true
          })
        );
      });
    });

    describe('When checking Codex CLI availability', () => {
      it('Then should return true when Codex CLI is available', async () => {
        // Given: Codex CLI is available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);

        // When: Checking availability
        const isAvailable = await codexCLIService.isAvailable();

        // Then: Should return true
        expect(isAvailable).toBe(true);
      });

      it('Then should return false when Codex CLI is not available', async () => {
        // Given: Codex CLI is not available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

        // When: Checking availability
        const isAvailable = await codexCLIService.isAvailable();

        // Then: Should return false
        expect(isAvailable).toBe(false);
      });

      it('Then should handle availability check errors gracefully', async () => {
        // Given: Availability check throws error
        mockCLIExecutionService.isCommandAvailable.mockRejectedValue(new Error('Check failed'));

        // When: Checking availability
        const isAvailable = await codexCLIService.isAvailable();

        // Then: Should return false
        expect(isAvailable).toBe(false);
      });
    });

    describe('When getting Codex CLI path', () => {
      it('Then should return CLI path when available', async () => {
        // Given: Codex CLI is available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: '/usr/local/bin/codex',
          stderr: '',
          executionTime: 50,
          success: true
        });

        // When: Getting CLI path
        const path = await codexCLIService.getCLIPath();

        // Then: Should return path
        expect(path).toBe('/usr/local/bin/codex');
      });

      it('Then should return null when Codex CLI is not available', async () => {
        // Given: Codex CLI is not available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

        // When: Getting CLI path
        const path = await codexCLIService.getCLIPath();

        // Then: Should return null
        expect(path).toBeNull();
      });

      it('Then should return null when path command fails', async () => {
        // Given: Codex CLI is available but path command fails
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 1,
          stdout: '',
          stderr: 'Path command failed',
          executionTime: 10,
          success: false
        });

        // When: Getting CLI path
        const path = await codexCLIService.getCLIPath();

        // Then: Should return null
        expect(path).toBeNull();
      });

      it('Then should handle multiple paths and return first one', async () => {
        // Given: Codex CLI is available with multiple paths
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: '/usr/local/bin/codex\n/usr/bin/codex',
          stderr: '',
          executionTime: 50,
          success: true
        });

        // When: Getting CLI path
        const path = await codexCLIService.getCLIPath();

        // Then: Should return first path
        expect(path).toBe('/usr/local/bin/codex');
      });
    });

    describe('When handling CLI service integration', () => {
      it('Then should use CLI execution service for all operations', async () => {
        // Given: Codex CLI is available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: 'Codex CLI v1.0.0',
          stderr: '',
          executionTime: 100,
          success: true
        });

        // When: Performing various operations
        await codexCLIService.validateInstallation();
        await codexCLIService.getVersion();
        await codexCLIService.isAvailable();
        await codexCLIService.getCLIPath();

        // Then: Should use CLI execution service
        expect(mockCLIExecutionService.isCommandAvailable).toHaveBeenCalledWith('codex');
        expect(mockCLIExecutionService.executeCommand).toHaveBeenCalled();
      });

      it('Then should handle CLI execution service errors gracefully', async () => {
        // Given: CLI execution service throws error
        mockCLIExecutionService.isCommandAvailable.mockRejectedValue(new Error('Service error'));

        // When: Checking availability
        const isAvailable = await codexCLIService.isAvailable();

        // Then: Should handle error gracefully
        expect(isAvailable).toBe(false);
      });

      it('Then should provide consistent error handling across all methods', async () => {
        // Given: CLI execution service throws error
        mockCLIExecutionService.isCommandAvailable.mockRejectedValue(new Error('Service error'));

        // When: Calling various methods
        const isAvailable = await codexCLIService.isAvailable();
        const version = await codexCLIService.getVersion();
        const path = await codexCLIService.getCLIPath();

        // Then: Should handle errors consistently
        expect(isAvailable).toBe(false);
        expect(version).toBeNull();
        expect(path).toBeNull();
      });
    });

    describe('When handling edge cases and error scenarios', () => {
      it('Then should handle empty command arguments', async () => {
        // Given: Codex CLI is available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: 'Success',
          stderr: '',
          executionTime: 100,
          success: true
        });

        // When: Executing command with empty arguments
        const result = await codexCLIService.executeCodexCommand('help', []);

        // Then: Should execute successfully
        expect(result.success).toBe(true);
        expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(
          'codex',
          ['help'],
          expect.any(Object)
        );
      });

      it('Then should handle special characters in command arguments', async () => {
        // Given: Codex CLI is available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: 'Success',
          stderr: '',
          executionTime: 100,
          success: true
        });

        // When: Executing command with special characters
        const result = await codexCLIService.executeCodexCommand('create', ['project', '--name', 'test-project_v2']);

        // Then: Should execute successfully
        expect(result.success).toBe(true);
        expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(
          'codex',
          ['create', 'project', '--name', 'test-project_v2'],
          expect.any(Object)
        );
      });

      it('Then should handle very long command outputs', async () => {
        // Given: Codex CLI is available with long output
        const longOutput = 'A'.repeat(10000);
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: longOutput,
          stderr: '',
          executionTime: 1000,
          success: true
        });

        // When: Executing command
        const result = await codexCLIService.executeCodexCommand('list', ['--all']);

        // Then: Should handle long output
        expect(result.success).toBe(true);
        expect(result.stdout).toBe(longOutput);
        expect(result.executionTime).toBe(1000);
      });
    });
  });
});
