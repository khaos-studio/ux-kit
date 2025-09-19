/**
 * T011: CodexValidator Service - Use Case Tests
 * 
 * These tests define the expected behavior for the CodexValidator service
 * before implementing the actual service logic.
 */

import { CodexValidator } from '../../src/services/codex/CodexValidator';
import { ICLIExecutionService } from '../../src/contracts/infrastructure-contracts';
import {
  CodexValidationResponse,
  CodexValidationResult,
  CodexError
} from '../../src/contracts/domain-contracts';

// Mock the CLI execution service
jest.mock('../../src/contracts/infrastructure-contracts');

describe('T011: CodexValidator Service - Use Cases', () => {
  
  describe('Given a CodexValidator service', () => {
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

    describe('When validating Codex CLI installation', () => {
      it('Then should return success when Codex CLI is available and working', async () => {
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
        const result: CodexValidationResponse = await codexValidator.validateCodexCLI();

        // Then: Should return success response
        expect(result.result).toBe(CodexValidationResult.SUCCESS);
        expect(result.cliPath).toBeDefined();
        expect(result.version).toBe('1.0.0');
        expect(result.errorMessage).toBeUndefined();
        expect(result.suggestions).toBeUndefined();
        expect(result.timestamp).toBeInstanceOf(Date);
      });

      it('Then should return CLI_NOT_FOUND when Codex CLI is not available', async () => {
        // Given: Codex CLI is not available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

        // When: Validating Codex CLI
        const result: CodexValidationResponse = await codexValidator.validateCodexCLI();

        // Then: Should return CLI_NOT_FOUND response
        expect(result.result).toBe(CodexValidationResult.CLI_NOT_FOUND);
        expect(result.cliPath).toBeUndefined();
        expect(result.version).toBeUndefined();
        expect(result.errorMessage).toBeDefined();
        expect(result.suggestions).toBeDefined();
        expect(result.suggestions).toContain('Install Codex CLI');
        expect(result.timestamp).toBeInstanceOf(Date);
      });

      it('Then should return CLI_INVALID when Codex CLI exists but is not working', async () => {
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
        const result: CodexValidationResponse = await codexValidator.validateCodexCLI();

        // Then: Should return CLI_INVALID response
        expect(result.result).toBe(CodexValidationResult.CLI_INVALID);
        expect(result.errorMessage).toBeDefined();
        expect(result.suggestions).toBeDefined();
        expect(result.suggestions).toContain('Check Codex CLI installation');
        expect(result.timestamp).toBeInstanceOf(Date);
      });

      it('Then should return PERMISSION_DENIED when access is denied', async () => {
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
        const result: CodexValidationResponse = await codexValidator.validateCodexCLI();

        // Then: Should return PERMISSION_DENIED response
        expect(result.result).toBe(CodexValidationResult.PERMISSION_DENIED);
        expect(result.errorMessage).toBeDefined();
        expect(result.suggestions).toBeDefined();
        expect(result.suggestions).toContain('Check file permissions');
        expect(result.timestamp).toBeInstanceOf(Date);
      });

      it('Then should return UNKNOWN_ERROR when unexpected error occurs', async () => {
        // Given: Unexpected error occurs
        mockCLIExecutionService.isCommandAvailable.mockRejectedValue(new Error('Unexpected error'));

        // When: Validating Codex CLI
        const result: CodexValidationResponse = await codexValidator.validateCodexCLI();

        // Then: Should return UNKNOWN_ERROR response
        expect(result.result).toBe(CodexValidationResult.UNKNOWN_ERROR);
        expect(result.errorMessage).toBeDefined();
        expect(result.suggestions).toBeDefined();
        expect(result.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('When checking if Codex is available', () => {
      it('Then should return true when Codex CLI is available', async () => {
        // Given: Codex CLI is available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);

        // When: Checking if Codex is available
        const isAvailable: boolean = await codexValidator.isCodexAvailable();

        // Then: Should return true
        expect(isAvailable).toBe(true);
        expect(mockCLIExecutionService.isCommandAvailable).toHaveBeenCalledWith('codex');
      });

      it('Then should return false when Codex CLI is not available', async () => {
        // Given: Codex CLI is not available
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

        // When: Checking if Codex is available
        const isAvailable: boolean = await codexValidator.isCodexAvailable();

        // Then: Should return false
        expect(isAvailable).toBe(false);
        expect(mockCLIExecutionService.isCommandAvailable).toHaveBeenCalledWith('codex');
      });

      it('Then should return false when error occurs', async () => {
        // Given: Error occurs when checking availability
        mockCLIExecutionService.isCommandAvailable.mockRejectedValue(new Error('Check failed'));

        // When: Checking if Codex is available
        const isAvailable: boolean = await codexValidator.isCodexAvailable();

        // Then: Should return false
        expect(isAvailable).toBe(false);
      });
    });

    describe('When getting Codex CLI path', () => {
      it('Then should return path when Codex CLI is found', async () => {
        // Given: Codex CLI is found at specific path
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: '/usr/local/bin/codex',
          stderr: '',
          executionTime: 50,
          success: true
        });

        // When: Getting Codex CLI path
        const path: string | null = await codexValidator.getCodexPath();

        // Then: Should return the path
        expect(path).toBe('/usr/local/bin/codex');
        expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith('which', ['codex'], expect.any(Object));
      });

      it('Then should return null when Codex CLI is not found', async () => {
        // Given: Codex CLI is not found
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 1,
          stdout: '',
          stderr: 'codex not found',
          executionTime: 50,
          success: false
        });

        // When: Getting Codex CLI path
        const path: string | null = await codexValidator.getCodexPath();

        // Then: Should return null
        expect(path).toBeNull();
      });

      it('Then should return null when error occurs', async () => {
        // Given: Error occurs when getting path
        mockCLIExecutionService.executeCommand.mockRejectedValue(new Error('Path check failed'));

        // When: Getting Codex CLI path
        const path: string | null = await codexValidator.getCodexPath();

        // Then: Should return null
        expect(path).toBeNull();
      });
    });

    describe('When getting Codex CLI version', () => {
      it('Then should return version when Codex CLI is available', async () => {
        // Given: Codex CLI is available with version
        mockCLIExecutionService.getCommandVersion.mockResolvedValue('1.2.3');

        // When: Getting Codex CLI version
        const version: string | null = await codexValidator.getCodexVersion();

        // Then: Should return the version
        expect(version).toBe('1.2.3');
        expect(mockCLIExecutionService.getCommandVersion).toHaveBeenCalledWith('codex');
      });

      it('Then should return null when Codex CLI is not available', async () => {
        // Given: Codex CLI is not available
        mockCLIExecutionService.getCommandVersion.mockResolvedValue(null);

        // When: Getting Codex CLI version
        const version: string | null = await codexValidator.getCodexVersion();

        // Then: Should return null
        expect(version).toBeNull();
      });

      it('Then should return null when error occurs', async () => {
        // Given: Error occurs when getting version
        mockCLIExecutionService.getCommandVersion.mockRejectedValue(new Error('Version check failed'));

        // When: Getting Codex CLI version
        const version: string | null = await codexValidator.getCodexVersion();

        // Then: Should return null
        expect(version).toBeNull();
      });
    });

    describe('When handling timeout scenarios', () => {
      it('Then should handle command execution timeout gracefully', async () => {
        // Given: Command execution times out
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 124, // Timeout exit code
          stdout: '',
          stderr: 'Command timed out',
          executionTime: 30000,
          success: false
        });

        // When: Validating Codex CLI
        const result: CodexValidationResponse = await codexValidator.validateCodexCLI();

        // Then: Should return appropriate error response
        expect(result.result).toBe(CodexValidationResult.UNKNOWN_ERROR);
        expect(result.errorMessage?.toLowerCase()).toContain('timed out');
        expect(result.suggestions).toBeDefined();
      });
    });

    describe('When handling different operating systems', () => {
      it('Then should use correct command for finding CLI path on Unix systems', async () => {
        // Given: Unix-like system
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 0,
          stdout: '/usr/local/bin/codex',
          stderr: '',
          executionTime: 50,
          success: true
        });

        // When: Getting Codex CLI path
        await codexValidator.getCodexPath();

        // Then: Should use 'which' command
        expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith('which', ['codex'], expect.any(Object));
      });

      it('Then should use correct command for finding CLI path on Windows systems', async () => {
        // Given: Windows system (simulated by mocking process.platform)
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
        await codexValidator.getCodexPath();

        // Then: Should use 'where' command
        expect(mockCLIExecutionService.executeCommand).toHaveBeenCalledWith('where', ['codex'], expect.any(Object));

        // Restore original platform
        Object.defineProperty(process, 'platform', {
          value: originalPlatform,
          configurable: true
        });
      });
    });

    describe('When providing helpful error messages and suggestions', () => {
      it('Then should provide installation suggestions for CLI_NOT_FOUND', async () => {
        // Given: Codex CLI is not found
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(false);

        // When: Validating Codex CLI
        const result: CodexValidationResponse = await codexValidator.validateCodexCLI();

        // Then: Should provide helpful suggestions
        expect(result.suggestions).toContain('Install Codex CLI');
        expect(result.suggestions).toContain('Add Codex CLI to your PATH');
        expect(result.suggestions).toContain('Verify Codex CLI installation');
      });

      it('Then should provide troubleshooting suggestions for CLI_INVALID', async () => {
        // Given: Codex CLI exists but is invalid
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 1,
          stdout: '',
          stderr: 'Invalid configuration',
          executionTime: 100,
          success: false
        });

        // When: Validating Codex CLI
        const result: CodexValidationResponse = await codexValidator.validateCodexCLI();

        // Then: Should provide troubleshooting suggestions
        expect(result.suggestions).toContain('Check Codex CLI installation');
        expect(result.suggestions).toContain('Verify Codex CLI configuration');
        expect(result.suggestions).toContain('Try reinstalling Codex CLI');
      });

      it('Then should provide permission suggestions for PERMISSION_DENIED', async () => {
        // Given: Permission denied
        mockCLIExecutionService.isCommandAvailable.mockResolvedValue(true);
        mockCLIExecutionService.executeCommand.mockResolvedValue({
          exitCode: 13,
          stdout: '',
          stderr: 'Permission denied',
          executionTime: 100,
          success: false
        });

        // When: Validating Codex CLI
        const result: CodexValidationResponse = await codexValidator.validateCodexCLI();

        // Then: Should provide permission suggestions
        expect(result.suggestions).toContain('Check file permissions');
        expect(result.suggestions).toContain('Run with appropriate privileges');
        expect(result.suggestions).toContain('Verify user permissions');
      });
    });
  });
});
