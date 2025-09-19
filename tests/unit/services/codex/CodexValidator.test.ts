/**
 * Unit tests for CodexValidator service
 * 
 * These tests verify the CodexValidator service works correctly
 * and provide comprehensive coverage for all service methods.
 */

import { CodexValidator } from '../../../../src/services/codex/CodexValidator';
import { ICLIExecutionService } from '../../../../src/contracts/infrastructure-contracts';
import {
  CodexValidationResponse,
  CodexValidationResult
} from '../../../../src/contracts/domain-contracts';

describe('CodexValidator', () => {
  let codexValidator: CodexValidator;
  let mockCLIExecutionService: jest.Mocked<ICLIExecutionService>;

  beforeEach(() => {
    // Create mock CLI execution service
    mockCLIExecutionService = {
      executeCommand: jest.fn(),
      isCommandAvailable: jest.fn(),
      getCommandVersion: jest.fn(),
      executeCommandWithTimeout: jest.fn()
    } as jest.Mocked<ICLIExecutionService>;

    // Create CodexValidator instance
    codexValidator = new CodexValidator(mockCLIExecutionService);
  });

  describe('constructor', () => {
    it('should create instance with CLI execution service', () => {
      expect(codexValidator).toBeInstanceOf(CodexValidator);
    });
  });

  describe('validateCodexCLI', () => {
    it('should return success when Codex CLI is available and working', async () => {
      // Given: Codex CLI is available and working
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
      mockCLIExecutionService.getCommandVersion.mockResolvedValue('1.0.0');
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 0,
        stdout: 'Codex CLI is working',
        stderr: '',
        executionTime: 100,
        success: true
      });

      // When: Validating Codex CLI
      const result = await codexValidator.validateCodexCLI();

      // Then: Should return success response
      expect(result.result).toBe(CodexValidationResult.SUCCESS);
      expect(result.cliPath).toBeDefined();
      expect(result.version).toBe('1.0.0');
      expect(result.errorMessage).toBeUndefined();
      expect(result.suggestions).toBeUndefined();
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return CLI_NOT_FOUND when Codex CLI is not available', async () => {
      // Given: Codex CLI is not available
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

      // When: Validating Codex CLI
      const result = await codexValidator.validateCodexCLI();

      // Then: Should return CLI_NOT_FOUND response
      expect(result.result).toBe(CodexValidationResult.CLI_NOT_FOUND);
      expect(result.cliPath).toBeUndefined();
      expect(result.version).toBeUndefined();
      expect(result.errorMessage).toBe('Codex CLI is not installed or not available in PATH');
      expect(result.suggestions).toEqual([
        'Install Codex CLI',
        'Add Codex CLI to your PATH',
        'Verify Codex CLI installation'
      ]);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return CLI_INVALID when Codex CLI exists but is not working', async () => {
      // Given: Codex CLI exists but is not working
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 1,
        stdout: '',
        stderr: 'Codex CLI error',
        executionTime: 100,
        success: false
      });

      // When: Validating Codex CLI
      const result = await codexValidator.validateCodexCLI();

      // Then: Should return CLI_INVALID response
      expect(result.result).toBe(CodexValidationResult.CLI_INVALID);
      expect(result.errorMessage).toBe('Codex CLI is not working properly: Codex CLI error');
      expect(result.suggestions).toEqual([
        'Check Codex CLI installation',
        'Verify Codex CLI configuration',
        'Try reinstalling Codex CLI'
      ]);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return PERMISSION_DENIED when access is denied', async () => {
      // Given: Codex CLI exists but access is denied
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 13,
        stdout: '',
        stderr: 'Permission denied',
        executionTime: 100,
        success: false
      });

      // When: Validating Codex CLI
      const result = await codexValidator.validateCodexCLI();

      // Then: Should return PERMISSION_DENIED response
      expect(result.result).toBe(CodexValidationResult.PERMISSION_DENIED);
      expect(result.errorMessage).toBe('Permission denied when accessing Codex CLI');
      expect(result.suggestions).toEqual([
        'Check file permissions',
        'Run with appropriate privileges',
        'Verify user permissions'
      ]);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return UNKNOWN_ERROR when unexpected error occurs', async () => {
      // Given: Unexpected error occurs
      mockCLIExecutionService.isCommandAvailable.mockRejectedValue(new Error('Unexpected error'));

      // When: Validating Codex CLI
      const result = await codexValidator.validateCodexCLI();

      // Then: Should return UNKNOWN_ERROR response
      expect(result.result).toBe(CodexValidationResult.UNKNOWN_ERROR);
      expect(result.errorMessage).toBe('Unexpected error during validation: Unexpected error');
      expect(result.suggestions).toEqual([
        'Check system configuration',
        'Verify Codex CLI installation',
        'Try running the command manually'
      ]);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle timeout scenarios', async () => {
      // Given: Command execution times out
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 124,
        stdout: '',
        stderr: 'Command timed out',
        executionTime: 30000,
        success: false
      });

      // When: Validating Codex CLI
      const result = await codexValidator.validateCodexCLI();

      // Then: Should return UNKNOWN_ERROR for timeout
      expect(result.result).toBe(CodexValidationResult.UNKNOWN_ERROR);
      expect(result.errorMessage).toBe('Codex CLI validation timed out: Command timed out');
      expect(result.suggestions).toEqual([
        'Check system configuration',
        'Verify Codex CLI installation',
        'Try running the command manually'
      ]);
    });

    it('should handle permission denied in stderr', async () => {
      // Given: Permission denied in stderr
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 1,
        stdout: '',
        stderr: 'Permission denied',
        executionTime: 100,
        success: false
      });

      // When: Validating Codex CLI
      const result = await codexValidator.validateCodexCLI();

      // Then: Should return PERMISSION_DENIED response
      expect(result.result).toBe(CodexValidationResult.PERMISSION_DENIED);
      expect(result.errorMessage).toBe('Permission denied when accessing Codex CLI');
    });

    it('should call CLI service methods with correct parameters', async () => {
      // Given: Codex CLI is available and working
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
      mockCLIExecutionService.getCommandVersion.mockResolvedValue('1.0.0');
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 0,
        stdout: 'Codex CLI is working',
        stderr: '',
        executionTime: 100,
        success: true
      });

      // When: Validating Codex CLI
      await codexValidator.validateCodexCLI();

      // Then: Should call CLI service methods with correct parameters
      expect(mockCLIExecutionService.isCommandAvailable).toHaveBeenCalledWith('codex');
      expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(
        'codex',
        ['--version'],
        {
          timeout: 10000,
          captureOutput: true,
          captureError: true
        }
      );
    });
  });

  describe('isCodexAvailable', () => {
    it('should return true when Codex CLI is available', async () => {
      // Given: Codex CLI is available
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);

      // When: Checking if Codex is available
      const result = await codexValidator.isCodexAvailable();

      // Then: Should return true
      expect(result).toBe(true);
      expect(mockCLIExecutionService.isCommandAvailable).toHaveBeenCalledWith('codex');
    });

    it('should return false when Codex CLI is not available', async () => {
      // Given: Codex CLI is not available
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

      // When: Checking if Codex is available
      const result = await codexValidator.isCodexAvailable();

      // Then: Should return false
      expect(result).toBe(false);
      expect(mockCLIExecutionService.isCommandAvailable).toHaveBeenCalledWith('codex');
    });

    it('should return false when error occurs', async () => {
      // Given: Error occurs when checking availability
      mockCLIExecutionService.isCommandAvailable.mockRejectedValue(new Error('Check failed'));

      // When: Checking if Codex is available
      const result = await codexValidator.isCodexAvailable();

      // Then: Should return false
      expect(result).toBe(false);
    });
  });

  describe('getCodexPath', () => {
    it('should return path when Codex CLI is found on Unix systems', async () => {
      // Given: Unix system and Codex CLI is found
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        configurable: true
      });

      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 0,
        stdout: '/usr/local/bin/codex',
        stderr: '',
        executionTime: 50,
        success: true
      });

      // When: Getting Codex CLI path
      const result = await codexValidator.getCodexPath();

      // Then: Should return the path
      expect(result).toBe('/usr/local/bin/codex');
      expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(
        'which',
        ['codex'],
        {
          timeout: 10000,
          captureOutput: true,
          captureError: true
        }
      );

      // Restore original platform
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
        configurable: true
      });
    });

    it('should return path when Codex CLI is found on Windows systems', async () => {
      // Given: Windows system and Codex CLI is found
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        configurable: true
      });

      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 0,
        stdout: 'C:\\Program Files\\Codex\\codex.exe',
        stderr: '',
        executionTime: 50,
        success: true
      });

      // When: Getting Codex CLI path
      const result = await codexValidator.getCodexPath();

      // Then: Should return the path
      expect(result).toBe('C:\\Program Files\\Codex\\codex.exe');
      expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(
        'where',
        ['codex'],
        {
          timeout: 10000,
          captureOutput: true,
          captureError: true
        }
      );

      // Restore original platform
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
        configurable: true
      });
    });

    it('should return null when Codex CLI is not found', async () => {
      // Given: Codex CLI is not found
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 1,
        stdout: '',
        stderr: 'codex not found',
        executionTime: 50,
        success: false
      });

      // When: Getting Codex CLI path
      const result = await codexValidator.getCodexPath();

      // Then: Should return null
      expect(result).toBeNull();
    });

    it('should return null when error occurs', async () => {
      // Given: Error occurs when getting path
      mockCLIExecutionService.executeCommand.mockRejectedValue(new Error('Path check failed'));

      // When: Getting Codex CLI path
      const result = await codexValidator.getCodexPath();

      // Then: Should return null
      expect(result).toBeNull();
    });

    it('should return null when stdout is empty', async () => {
      // Given: Command succeeds but stdout is empty
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 0,
        stdout: '',
        stderr: '',
        executionTime: 50,
        success: true
      });

      // When: Getting Codex CLI path
      const result = await codexValidator.getCodexPath();

      // Then: Should return null
      expect(result).toBeNull();
    });

    it('should return null when stdout is only whitespace', async () => {
      // Given: Command succeeds but stdout is only whitespace
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 0,
        stdout: '   \n\t  ',
        stderr: '',
        executionTime: 50,
        success: true
      });

      // When: Getting Codex CLI path
      const result = await codexValidator.getCodexPath();

      // Then: Should return null
      expect(result).toBeNull();
    });
  });

  describe('getCodexVersion', () => {
    it('should return version when Codex CLI is available', async () => {
      // Given: Codex CLI is available with version
      mockCLIExecutionService.getCommandVersion.mockResolvedValue('1.2.3');

      // When: Getting Codex CLI version
      const result = await codexValidator.getCodexVersion();

      // Then: Should return the version
      expect(result).toBe('1.2.3');
      expect(mockCLIExecutionService.getCommandVersion).toHaveBeenCalledWith('codex');
    });

    it('should return null when Codex CLI is not available', async () => {
      // Given: Codex CLI is not available
      mockCLIExecutionService.getCommandVersion.mockResolvedValue(null);

      // When: Getting Codex CLI version
      const result = await codexValidator.getCodexVersion();

      // Then: Should return null
      expect(result).toBeNull();
    });

    it('should return null when error occurs', async () => {
      // Given: Error occurs when getting version
      mockCLIExecutionService.getCommandVersion.mockRejectedValue(new Error('Version check failed'));

      // When: Getting Codex CLI version
      const result = await codexValidator.getCodexVersion();

      // Then: Should return null
      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle non-Error objects in catch blocks', async () => {
      // Given: Non-Error object is thrown
      mockCLIExecutionService.isCommandAvailable.mockRejectedValue('String error');

      // When: Validating Codex CLI
      const result = await codexValidator.validateCodexCLI();

      // Then: Should handle gracefully
      expect(result.result).toBe(CodexValidationResult.UNKNOWN_ERROR);
      expect(result.errorMessage).toBe('Unexpected error during validation: Unknown error');
    });

    it('should handle null/undefined errors', async () => {
      // Given: Null error is thrown
      mockCLIExecutionService.isCommandAvailable.mockRejectedValue(null);

      // When: Validating Codex CLI
      const result = await codexValidator.validateCodexCLI();

      // Then: Should handle gracefully
      expect(result.result).toBe(CodexValidationResult.UNKNOWN_ERROR);
      expect(result.errorMessage).toBe('Unexpected error during validation: Unknown error');
    });
  });

  describe('timeout configuration', () => {
    it('should use correct timeout value', () => {
      // Given: CodexValidator instance
      // When: Accessing timeout (through private property)
      // Then: Should use 10 second timeout
      const timeout = (codexValidator as any).commandTimeout;
      expect(timeout).toBe(10000);
    });
  });

  describe('CLI command parameters', () => {
    it('should use correct command and arguments for version check', async () => {
      // Given: Codex CLI is available
      mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
      mockCLIExecutionService.executeCommand.mockResolvedValue({
        exitCode: 0,
        stdout: 'Codex CLI is working',
        stderr: '',
        executionTime: 100,
        success: true
      });

      // When: Validating Codex CLI
      await codexValidator.validateCodexCLI();

      // Then: Should use correct command and arguments
      expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith(
        'codex',
        ['--version'],
        expect.objectContaining({
          timeout: 10000,
          captureOutput: true,
          captureError: true
        })
      );
    });
  });
});
