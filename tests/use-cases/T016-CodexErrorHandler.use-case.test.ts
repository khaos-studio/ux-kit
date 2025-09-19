/**
 * Use Case Tests for T016: CodexErrorHandler Service
 * 
 * These tests define the expected behavior and user scenarios for the CodexErrorHandler service
 * following the TDD approach. They capture complete user journeys and expected outcomes.
 */

import { CodexErrorHandler } from '../../src/services/codex/CodexErrorHandler';
import { IErrorHandlingService } from '../../src/contracts/infrastructure-contracts';
import { CodexError } from '../../src/contracts/domain-contracts';

describe('T016: CodexErrorHandler Use Cases', () => {
  let errorHandler: IErrorHandlingService;

  beforeEach(() => {
    errorHandler = new CodexErrorHandler();
  });

  describe('File System Error Handling', () => {
    it('should handle file not found errors with helpful suggestions', async () => {
      // Given: A file system error occurs when trying to read a configuration file
      const fileNotFoundError = new Error('ENOENT: no such file or directory, open \'/path/to/config.json\'');
      const operation = 'read configuration file';

      // When: The error handler processes the file system error
      const codexError = errorHandler.handleFileSystemError(fileNotFoundError, operation);

      // Then: It should return a user-friendly error with helpful suggestions
      expect(codexError.code).toBe('FILESYSTEM_ERROR');
      expect(codexError.message).toContain('File system error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Check if the file path is correct');
      expect(codexError.suggestions).toContain('Verify file permissions');
      expect(codexError.suggestions).toContain('Ensure the directory exists');
      expect(codexError.timestamp).toBeInstanceOf(Date);
    });

    it('should handle permission denied errors with appropriate suggestions', async () => {
      // Given: A permission denied error occurs when trying to write a template file
      const permissionError = new Error('EACCES: permission denied, open \'/protected/template.md\'');
      const operation = 'write template file';

      // When: The error handler processes the permission error
      const codexError = errorHandler.handleFileSystemError(permissionError, operation);

      // Then: It should return a user-friendly error with permission-related suggestions
      expect(codexError.code).toBe('FILESYSTEM_ERROR');
      expect(codexError.message).toContain('File system error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Check file permissions');
      expect(codexError.suggestions).toContain('Run with appropriate privileges');
      expect(codexError.suggestions).toContain('Verify write access to the directory');
    });

    it('should handle disk space errors with storage suggestions', async () => {
      // Given: A disk space error occurs when trying to create a large template file
      const diskSpaceError = new Error('ENOSPC: no space left on device');
      const operation = 'create template file';

      // When: The error handler processes the disk space error
      const codexError = errorHandler.handleFileSystemError(diskSpaceError, operation);

      // Then: It should return a user-friendly error with storage-related suggestions
      expect(codexError.code).toBe('FILESYSTEM_ERROR');
      expect(codexError.message).toContain('File system error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Free up disk space');
      expect(codexError.suggestions).toContain('Check available storage');
      expect(codexError.suggestions).toContain('Try a different location');
    });
  });

  describe('CLI Execution Error Handling', () => {
    it('should handle command not found errors with installation suggestions', async () => {
      // Given: A command not found error occurs when trying to execute codex CLI
      const commandNotFoundError = new Error('Command \'codex\' not found');
      const command = 'codex --version';

      // When: The error handler processes the CLI execution error
      const codexError = errorHandler.handleCLIExecutionError(commandNotFoundError, command);

      // Then: It should return a user-friendly error with installation suggestions
      expect(codexError.code).toBe('CLI_EXECUTION_ERROR');
      expect(codexError.message).toContain('CLI execution error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Install the required CLI tool');
      expect(codexError.suggestions).toContain('Check if the command is in PATH');
      expect(codexError.suggestions).toContain('Verify command spelling');
      expect(codexError.timestamp).toBeInstanceOf(Date);
    });

    it('should handle command timeout errors with timeout suggestions', async () => {
      // Given: A timeout error occurs when executing a long-running CLI command
      const timeoutError = new Error('Command timed out after 30 seconds');
      const command = 'codex generate --large-dataset';

      // When: The error handler processes the timeout error
      const codexError = errorHandler.handleCLIExecutionError(timeoutError, command);

      // Then: It should return a user-friendly error with timeout-related suggestions
      expect(codexError.code).toBe('CLI_EXECUTION_ERROR');
      expect(codexError.message).toContain('CLI execution error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Increase timeout value');
      expect(codexError.suggestions).toContain('Check system performance');
      expect(codexError.suggestions).toContain('Try with smaller dataset');
    });

    it('should handle command execution failures with debugging suggestions', async () => {
      // Given: A command execution fails with a non-zero exit code
      const executionError = new Error('Command failed with exit code 1');
      const command = 'codex validate --config invalid.json';

      // When: The error handler processes the execution error
      const codexError = errorHandler.handleCLIExecutionError(executionError, command);

      // Then: It should return a user-friendly error with debugging suggestions
      expect(codexError.code).toBe('CLI_EXECUTION_ERROR');
      expect(codexError.message).toContain('CLI execution error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Check command arguments');
      expect(codexError.suggestions).toContain('Verify input data');
      expect(codexError.suggestions).toContain('Check command documentation');
    });
  });

  describe('Validation Error Handling', () => {
    it('should handle configuration validation errors with correction suggestions', async () => {
      // Given: A configuration validation error occurs
      const validationError = new Error('Invalid configuration: timeout must be positive');
      const context = 'Codex configuration validation';

      // When: The error handler processes the validation error
      const codexError = errorHandler.handleValidationError(validationError, context);

      // Then: It should return a user-friendly error with correction suggestions
      expect(codexError.code).toBe('VALIDATION_ERROR');
      expect(codexError.message).toContain('Validation error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Check configuration values');
      expect(codexError.suggestions).toContain('Verify data types and formats');
      expect(codexError.suggestions).toContain('Review configuration schema');
      expect(codexError.timestamp).toBeInstanceOf(Date);
    });

    it('should handle template validation errors with template suggestions', async () => {
      // Given: A template validation error occurs
      const templateError = new Error('Template validation failed: missing required field \'name\'');
      const context = 'Codex template validation';

      // When: The error handler processes the template validation error
      const codexError = errorHandler.handleValidationError(templateError, context);

      // Then: It should return a user-friendly error with template-related suggestions
      expect(codexError.code).toBe('VALIDATION_ERROR');
      expect(codexError.message).toContain('Validation error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Check template structure');
      expect(codexError.suggestions).toContain('Verify required fields');
      expect(codexError.suggestions).toContain('Review template schema');
    });

    it('should handle path validation errors with path suggestions', async () => {
      // Given: A path validation error occurs
      const pathError = new Error('Invalid path: contains invalid characters');
      const context = 'File path validation';

      // When: The error handler processes the path validation error
      const codexError = errorHandler.handleValidationError(pathError, context);

      // Then: It should return a user-friendly error with path-related suggestions
      expect(codexError.code).toBe('VALIDATION_ERROR');
      expect(codexError.message).toContain('Validation error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Check path format');
      expect(codexError.suggestions).toContain('Remove invalid characters');
      expect(codexError.suggestions).toContain('Use absolute path');
    });
  });

  describe('Configuration Error Handling', () => {
    it('should handle configuration loading errors with file suggestions', async () => {
      // Given: A configuration loading error occurs
      const configError = new Error('Failed to parse configuration file: invalid JSON');
      const config = { invalid: 'json' };

      // When: The error handler processes the configuration error
      const codexError = errorHandler.handleConfigurationError(configError, config);

      // Then: It should return a user-friendly error with configuration suggestions
      expect(codexError.code).toBe('CONFIGURATION_ERROR');
      expect(codexError.message).toContain('Configuration error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Check configuration file format');
      expect(codexError.suggestions).toContain('Validate JSON syntax');
      expect(codexError.suggestions).toContain('Use default configuration');
      expect(codexError.timestamp).toBeInstanceOf(Date);
    });

    it('should handle configuration save errors with save suggestions', async () => {
      // Given: A configuration save error occurs
      const saveError = new Error('Failed to save configuration: permission denied');
      const config = { enabled: true, timeout: 5000 };

      // When: The error handler processes the configuration save error
      const codexError = errorHandler.handleConfigurationError(saveError, config);

      // Then: It should return a user-friendly error with save-related suggestions
      expect(codexError.code).toBe('CONFIGURATION_ERROR');
      expect(codexError.message).toContain('Configuration error occurred');
      expect(codexError.recoverable).toBe(true);
      expect(codexError.suggestions).toContain('Check file permissions');
      expect(codexError.suggestions).toContain('Verify directory access');
      expect(codexError.suggestions).toContain('Try different location');
    });
  });

  describe('User-Friendly Error Message Creation', () => {
    it('should create user-friendly messages for file system errors', async () => {
      // Given: A file system error with suggestions
      const codexError: CodexError = {
        code: 'FILESYSTEM_ERROR',
        message: 'File system error occurred during read operation',
        details: { operation: 'read', path: '/path/to/file' },
        suggestions: ['Check file path', 'Verify permissions'],
        recoverable: true,
        timestamp: new Date()
      };

      // When: Creating a user-friendly error message
      const userMessage = errorHandler.createUserFriendlyError(codexError);

      // Then: It should return a clear, actionable message
      expect(userMessage).toContain('File system error occurred');
      expect(userMessage).toContain('Check file path');
      expect(userMessage).toContain('Verify permissions');
      expect(userMessage).toContain('This error can be resolved');
    });

    it('should create user-friendly messages for CLI execution errors', async () => {
      // Given: A CLI execution error with suggestions
      const codexError: CodexError = {
        code: 'CLI_EXECUTION_ERROR',
        message: 'CLI execution error occurred',
        details: { command: 'codex --version', exitCode: 1 },
        suggestions: ['Install CLI tool', 'Check PATH'],
        recoverable: true,
        timestamp: new Date()
      };

      // When: Creating a user-friendly error message
      const userMessage = errorHandler.createUserFriendlyError(codexError);

      // Then: It should return a clear, actionable message
      expect(userMessage).toContain('CLI execution error occurred');
      expect(userMessage).toContain('Install CLI tool');
      expect(userMessage).toContain('Check PATH');
      expect(userMessage).toContain('This error can be resolved');
    });

    it('should create user-friendly messages for non-recoverable errors', async () => {
      // Given: A non-recoverable error
      const codexError: CodexError = {
        code: 'CRITICAL_ERROR',
        message: 'Critical system error occurred',
        details: { component: 'core' },
        suggestions: ['Contact support', 'Check system logs'],
        recoverable: false,
        timestamp: new Date()
      };

      // When: Creating a user-friendly error message
      const userMessage = errorHandler.createUserFriendlyError(codexError);

      // Then: It should return a clear message indicating the error is not recoverable
      expect(userMessage).toContain('Critical system error occurred');
      expect(userMessage).toContain('Contact support');
      expect(userMessage).toContain('Check system logs');
      expect(userMessage).toContain('This error requires manual intervention');
    });

    it('should handle errors without suggestions gracefully', async () => {
      // Given: An error without suggestions
      const codexError: CodexError = {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
        details: {},
        suggestions: [],
        recoverable: true,
        timestamp: new Date()
      };

      // When: Creating a user-friendly error message
      const userMessage = errorHandler.createUserFriendlyError(codexError);

      // Then: It should return a message without suggestions section
      expect(userMessage).toContain('An unknown error occurred');
      expect(userMessage).not.toContain('Suggestions:');
      expect(userMessage).toContain('This error can be resolved');
    });
  });

  describe('Error Categorization and Recovery', () => {
    it('should categorize file system errors as recoverable', async () => {
      // Given: Various file system errors
      const errors = [
        new Error('ENOENT: no such file or directory'),
        new Error('EACCES: permission denied'),
        new Error('ENOSPC: no space left on device')
      ];

      // When: Processing each error
      const codexErrors = errors.map(error => 
        errorHandler.handleFileSystemError(error, 'test operation')
      );

      // Then: All should be categorized as recoverable
      codexErrors.forEach(codexError => {
        expect(codexError.recoverable).toBe(true);
        expect(codexError.code).toBe('FILESYSTEM_ERROR');
      });
    });

    it('should categorize CLI execution errors as recoverable', async () => {
      // Given: Various CLI execution errors
      const errors = [
        new Error('Command not found'),
        new Error('Command timed out'),
        new Error('Command failed with exit code 1')
      ];

      // When: Processing each error
      const codexErrors = errors.map(error => 
        errorHandler.handleCLIExecutionError(error, 'test command')
      );

      // Then: All should be categorized as recoverable
      codexErrors.forEach(codexError => {
        expect(codexError.recoverable).toBe(true);
        expect(codexError.code).toBe('CLI_EXECUTION_ERROR');
      });
    });

    it('should categorize validation errors as recoverable', async () => {
      // Given: Various validation errors
      const errors = [
        new Error('Invalid configuration'),
        new Error('Template validation failed'),
        new Error('Invalid path format')
      ];

      // When: Processing each error
      const codexErrors = errors.map(error => 
        errorHandler.handleValidationError(error, 'test context')
      );

      // Then: All should be categorized as recoverable
      codexErrors.forEach(codexError => {
        expect(codexError.recoverable).toBe(true);
        expect(codexError.code).toBe('VALIDATION_ERROR');
      });
    });

    it('should categorize configuration errors as recoverable', async () => {
      // Given: Various configuration errors
      const errors = [
        new Error('Failed to parse configuration'),
        new Error('Invalid configuration format'),
        new Error('Configuration validation failed')
      ];

      // When: Processing each error
      const codexErrors = errors.map(error => 
        errorHandler.handleConfigurationError(error, {})
      );

      // Then: All should be categorized as recoverable
      codexErrors.forEach(codexError => {
        expect(codexError.recoverable).toBe(true);
        expect(codexError.code).toBe('CONFIGURATION_ERROR');
      });
    });
  });

  describe('Error Details and Context Preservation', () => {
    it('should preserve error details in the CodexError object', async () => {
      // Given: A file system error with specific details
      const originalError = new Error('ENOENT: no such file or directory, open \'/path/to/config.json\'');
      const operation = 'read configuration file';

      // When: Processing the error
      const codexError = errorHandler.handleFileSystemError(originalError, operation);

      // Then: Error details should be preserved
      expect(codexError.details).toBeDefined();
      expect(codexError.details.originalError).toBe(originalError.message);
      expect(codexError.details.operation).toBe(operation);
      expect(codexError.details.errorType).toBe('ENOENT');
    });

    it('should preserve CLI command details in error context', async () => {
      // Given: A CLI execution error with command details
      const originalError = new Error('Command \'codex\' not found');
      const command = 'codex --version --verbose';

      // When: Processing the error
      const codexError = errorHandler.handleCLIExecutionError(originalError, command);

      // Then: Command details should be preserved
      expect(codexError.details).toBeDefined();
      expect(codexError.details.originalError).toBe(originalError.message);
      expect(codexError.details.command).toBe(command);
      expect(codexError.details.errorType).toBe('COMMAND_NOT_FOUND');
    });

    it('should preserve validation context in error details', async () => {
      // Given: A validation error with context
      const originalError = new Error('Invalid configuration: timeout must be positive');
      const context = 'Codex configuration validation';

      // When: Processing the error
      const codexError = errorHandler.handleValidationError(originalError, context);

      // Then: Validation context should be preserved
      expect(codexError.details).toBeDefined();
      expect(codexError.details.originalError).toBe(originalError.message);
      expect(codexError.details.context).toBe(context);
      expect(codexError.details.errorType).toBe('VALIDATION_FAILED');
    });
  });
});
