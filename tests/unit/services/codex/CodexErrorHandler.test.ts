/**
 * Unit Tests for CodexErrorHandler Service
 * 
 * Comprehensive unit tests with 100% coverage for the CodexErrorHandler service.
 * Tests all methods, error scenarios, and edge cases.
 */

import { CodexErrorHandler } from '../../../../src/services/codex/CodexErrorHandler';
import { CodexError } from '../../../../src/contracts/domain-contracts';

describe('CodexErrorHandler', () => {
  let errorHandler: CodexErrorHandler;

  beforeEach(() => {
    errorHandler = new CodexErrorHandler();
  });

  describe('handleFileSystemError', () => {
    it('should handle ENOENT errors correctly', () => {
      const error = new Error('ENOENT: no such file or directory, open \'/path/to/file\'');
      const operation = 'read file';
      
      const result = errorHandler.handleFileSystemError(error, operation);
      
      expect(result.code).toBe('FILESYSTEM_ERROR');
      expect(result.message).toContain('File system error occurred during read file');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Check if the file path is correct');
      expect(result.suggestions).toContain('Verify file permissions');
      expect(result.suggestions).toContain('Ensure the directory exists');
      expect(result.suggestions).toContain('Create the file if it should exist');
      expect(result.details.originalError).toBe(error.message);
      expect(result.details.operation).toBe(operation);
      expect(result.details.errorType).toBe('ENOENT');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle EACCES errors correctly', () => {
      const error = new Error('EACCES: permission denied, open \'/protected/file\'');
      const operation = 'write file';
      
      const result = errorHandler.handleFileSystemError(error, operation);
      
      expect(result.code).toBe('FILESYSTEM_ERROR');
      expect(result.message).toContain('File system error occurred during write file');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Check file permissions');
      expect(result.suggestions).toContain('Run with appropriate privileges');
      expect(result.suggestions).toContain('Verify write access to the directory');
      expect(result.suggestions).toContain('Check if file is locked by another process');
      expect(result.details.errorType).toBe('EACCES');
    });

    it('should handle ENOSPC errors correctly', () => {
      const error = new Error('ENOSPC: no space left on device');
      const operation = 'create file';
      
      const result = errorHandler.handleFileSystemError(error, operation);
      
      expect(result.code).toBe('FILESYSTEM_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Free up disk space');
      expect(result.suggestions).toContain('Check available storage');
      expect(result.suggestions).toContain('Try a different location');
      expect(result.suggestions).toContain('Clean up temporary files');
      expect(result.details.errorType).toBe('ENOSPC');
    });

    it('should handle EISDIR errors correctly', () => {
      const error = new Error('EISDIR: illegal operation on a directory');
      const operation = 'read file';
      
      const result = errorHandler.handleFileSystemError(error, operation);
      
      expect(result.code).toBe('FILESYSTEM_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('EISDIR');
    });

    it('should handle ENOTDIR errors correctly', () => {
      const error = new Error('ENOTDIR: not a directory');
      const operation = 'create directory';
      
      const result = errorHandler.handleFileSystemError(error, operation);
      
      expect(result.code).toBe('FILESYSTEM_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('ENOTDIR');
    });

    it('should handle EEXIST errors correctly', () => {
      const error = new Error('EEXIST: file already exists');
      const operation = 'create file';
      
      const result = errorHandler.handleFileSystemError(error, operation);
      
      expect(result.code).toBe('FILESYSTEM_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('EEXIST');
    });

    it('should handle unknown file system errors correctly', () => {
      const error = new Error('Unknown file system error');
      const operation = 'unknown operation';
      
      const result = errorHandler.handleFileSystemError(error, operation);
      
      expect(result.code).toBe('FILESYSTEM_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('UNKNOWN');
      expect(result.suggestions).toContain('Check file system status');
      expect(result.suggestions).toContain('Verify file path format');
      expect(result.suggestions).toContain('Try the operation again');
      expect(result.suggestions).toContain('Check system resources');
    });
  });

  describe('handleCLIExecutionError', () => {
    it('should handle command not found errors correctly', () => {
      const error = new Error('Command \'codex\' not found');
      const command = 'codex --version';
      
      const result = errorHandler.handleCLIExecutionError(error, command);
      
      expect(result.code).toBe('CLI_EXECUTION_ERROR');
      expect(result.message).toContain('CLI execution error occurred for command: codex --version');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Install the required CLI tool');
      expect(result.suggestions).toContain('Check if the command is in PATH');
      expect(result.suggestions).toContain('Verify command spelling');
      expect(result.suggestions).toContain('Check if the tool is properly installed');
      expect(result.details.originalError).toBe(error.message);
      expect(result.details.command).toBe(command);
      expect(result.details.errorType).toBe('COMMAND_NOT_FOUND');
    });

    it('should handle timeout errors correctly', () => {
      const error = new Error('Command timed out after 30 seconds');
      const command = 'codex generate --large';
      
      const result = errorHandler.handleCLIExecutionError(error, command);
      
      expect(result.code).toBe('CLI_EXECUTION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Increase timeout value');
      expect(result.suggestions).toContain('Check system performance');
      expect(result.suggestions).toContain('Try with smaller dataset');
      expect(result.suggestions).toContain('Check network connectivity');
      expect(result.details.errorType).toBe('TIMEOUT');
    });

    it('should handle execution failed errors correctly', () => {
      const error = new Error('Command failed with exit code 1');
      const command = 'codex validate --config invalid.json';
      
      const result = errorHandler.handleCLIExecutionError(error, command);
      
      expect(result.code).toBe('CLI_EXECUTION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Check command arguments');
      expect(result.suggestions).toContain('Verify input data');
      expect(result.suggestions).toContain('Check command documentation');
      expect(result.suggestions).toContain('Try with verbose output for debugging');
      expect(result.details.errorType).toBe('EXECUTION_FAILED');
    });

    it('should handle permission denied errors correctly', () => {
      const error = new Error('Permission denied');
      const command = 'codex install --system';
      
      const result = errorHandler.handleCLIExecutionError(error, command);
      
      expect(result.code).toBe('CLI_EXECUTION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('PERMISSION_DENIED');
    });

    it('should handle unknown CLI execution errors correctly', () => {
      const error = new Error('Unknown CLI error');
      const command = 'codex unknown';
      
      const result = errorHandler.handleCLIExecutionError(error, command);
      
      expect(result.code).toBe('CLI_EXECUTION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('UNKNOWN');
      expect(result.suggestions).toContain('Check command syntax');
      expect(result.suggestions).toContain('Verify system requirements');
      expect(result.suggestions).toContain('Check command permissions');
      expect(result.suggestions).toContain('Review command documentation');
    });
  });

  describe('handleValidationError', () => {
    it('should handle validation failed errors with configuration context', () => {
      const error = new Error('Invalid configuration: timeout must be positive');
      const context = 'Codex configuration validation';
      
      const result = errorHandler.handleValidationError(error, context);
      
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.message).toContain('Validation error occurred in Codex configuration validation');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Check configuration values');
      expect(result.suggestions).toContain('Verify data types and formats');
      expect(result.suggestions).toContain('Review configuration schema');
      expect(result.suggestions).toContain('Use default configuration as reference');
      expect(result.details.originalError).toBe(error.message);
      expect(result.details.context).toBe(context);
      expect(result.details.errorType).toBe('VALIDATION_FAILED');
    });

    it('should handle validation failed errors with template context', () => {
      const error = new Error('Template validation failed: missing required field');
      const context = 'Codex template validation';
      
      const result = errorHandler.handleValidationError(error, context);
      
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Check template structure');
      expect(result.suggestions).toContain('Verify required fields');
      expect(result.suggestions).toContain('Review template schema');
      expect(result.suggestions).toContain('Validate template syntax');
      expect(result.details.errorType).toBe('VALIDATION_FAILED');
    });

    it('should handle validation failed errors with path context', () => {
      const error = new Error('Invalid path: contains invalid characters');
      const context = 'File path validation';
      
      const result = errorHandler.handleValidationError(error, context);
      
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Check path format');
      expect(result.suggestions).toContain('Remove invalid characters');
      expect(result.suggestions).toContain('Use absolute path');
      expect(result.suggestions).toContain('Verify path exists');
      expect(result.details.errorType).toBe('VALIDATION_FAILED');
    });

    it('should handle configuration validation errors correctly', () => {
      const error = new Error('Configuration validation failed');
      const context = 'config validation';
      
      const result = errorHandler.handleValidationError(error, context);
      
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('VALIDATION_FAILED');
    });

    it('should handle template validation errors correctly', () => {
      const error = new Error('Template validation failed');
      const context = 'template validation';
      
      const result = errorHandler.handleValidationError(error, context);
      
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('VALIDATION_FAILED');
    });

    it('should handle path validation errors correctly', () => {
      const error = new Error('Path format error');
      const context = 'path validation';
      
      const result = errorHandler.handleValidationError(error, context);
      
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('PATH_VALIDATION');
    });

    it('should handle required field validation errors correctly', () => {
      const error = new Error('Missing required field: name');
      const context = 'field validation';
      
      const result = errorHandler.handleValidationError(error, context);
      
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('REQUIRED_FIELD_VALIDATION');
    });

    it('should handle unknown validation errors correctly', () => {
      const error = new Error('Unknown validation error');
      const context = 'unknown validation';
      
      const result = errorHandler.handleValidationError(error, context);
      
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('UNKNOWN');
      expect(result.suggestions).toContain('Check input data format');
      expect(result.suggestions).toContain('Verify validation rules');
      expect(result.suggestions).toContain('Review data requirements');
      expect(result.suggestions).toContain('Check for missing required fields');
    });
  });

  describe('handleConfigurationError', () => {
    it('should handle parse errors correctly', () => {
      const error = new Error('Failed to parse configuration file: invalid JSON');
      const config = { invalid: 'json' };
      
      const result = errorHandler.handleConfigurationError(error, config);
      
      expect(result.code).toBe('CONFIGURATION_ERROR');
      expect(result.message).toContain('Configuration error occurred: Failed to parse configuration file: invalid JSON');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Check configuration file format');
      expect(result.suggestions).toContain('Validate JSON syntax');
      expect(result.suggestions).toContain('Use default configuration');
      expect(result.suggestions).toContain('Check for syntax errors');
      expect(result.details.originalError).toBe(error.message);
      expect(result.details.config).toBe(config);
      expect(result.details.errorType).toBe('PARSE_ERROR');
    });

    it('should handle save errors correctly', () => {
      const error = new Error('Failed to save configuration: permission denied');
      const config = { enabled: true };
      
      const result = errorHandler.handleConfigurationError(error, config);
      
      expect(result.code).toBe('CONFIGURATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Check file permissions');
      expect(result.suggestions).toContain('Verify directory access');
      expect(result.suggestions).toContain('Try different location');
      expect(result.suggestions).toContain('Check disk space');
      expect(result.details.errorType).toBe('SAVE_ERROR');
    });

    it('should handle load errors correctly', () => {
      const error = new Error('Failed to load configuration file');
      const config = {};
      
      const result = errorHandler.handleConfigurationError(error, config);
      
      expect(result.code).toBe('CONFIGURATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.suggestions).toContain('Check file exists');
      expect(result.suggestions).toContain('Verify file permissions');
      expect(result.suggestions).toContain('Check file format');
      expect(result.suggestions).toContain('Use default configuration');
      expect(result.details.errorType).toBe('LOAD_ERROR');
    });

    it('should handle validation errors correctly', () => {
      const error = new Error('Invalid configuration format');
      const config = { invalid: true };
      
      const result = errorHandler.handleConfigurationError(error, config);
      
      expect(result.code).toBe('CONFIGURATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('VALIDATION_ERROR');
    });

    it('should handle unknown configuration errors correctly', () => {
      const error = new Error('Unknown configuration error');
      const config = {};
      
      const result = errorHandler.handleConfigurationError(error, config);
      
      expect(result.code).toBe('CONFIGURATION_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.details.errorType).toBe('UNKNOWN');
      expect(result.suggestions).toContain('Check configuration structure');
      expect(result.suggestions).toContain('Verify configuration values');
      expect(result.suggestions).toContain('Review configuration schema');
      expect(result.suggestions).toContain('Reset to default configuration');
    });
  });

  describe('createUserFriendlyError', () => {
    it('should create user-friendly messages for recoverable errors with suggestions', () => {
      const codexError: CodexError = {
        code: 'FILESYSTEM_ERROR',
        message: 'File system error occurred',
        details: { operation: 'read' },
        suggestions: ['Check file path', 'Verify permissions'],
        recoverable: true,
        timestamp: new Date()
      };
      
      const result = errorHandler.createUserFriendlyError(codexError);
      
      expect(result).toContain('File system error occurred');
      expect(result).toContain('Suggestions:');
      expect(result).toContain('1. Check file path');
      expect(result).toContain('2. Verify permissions');
      expect(result).toContain('This error can be resolved by following the suggestions above.');
    });

    it('should create user-friendly messages for non-recoverable errors', () => {
      const codexError: CodexError = {
        code: 'CRITICAL_ERROR',
        message: 'Critical system error occurred',
        details: {},
        suggestions: ['Contact support'],
        recoverable: false,
        timestamp: new Date()
      };
      
      const result = errorHandler.createUserFriendlyError(codexError);
      
      expect(result).toContain('Critical system error occurred');
      expect(result).toContain('1. Contact support');
      expect(result).toContain('This error requires manual intervention. Please contact support if the issue persists.');
    });

    it('should handle errors without suggestions gracefully', () => {
      const codexError: CodexError = {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
        details: {},
        suggestions: [],
        recoverable: true,
        timestamp: new Date()
      };
      
      const result = errorHandler.createUserFriendlyError(codexError);
      
      expect(result).toContain('An unknown error occurred');
      expect(result).not.toContain('Suggestions:');
      expect(result).toContain('This error can be resolved by following the suggestions above.');
    });

    it('should handle errors with undefined suggestions', () => {
      const codexError: CodexError = {
        code: 'TEST_ERROR',
        message: 'Test error occurred',
        details: {},
        suggestions: undefined as any,
        recoverable: true,
        timestamp: new Date()
      };
      
      const result = errorHandler.createUserFriendlyError(codexError);
      
      expect(result).toContain('Test error occurred');
      expect(result).not.toContain('Suggestions:');
      expect(result).toContain('This error can be resolved by following the suggestions above.');
    });
  });

  describe('Error Type Extraction Methods', () => {
    describe('extractErrorType', () => {
      it('should extract ENOENT error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractErrorType('enoent: no such file');
        expect(result).toBe('ENOENT');
      });

      it('should extract EACCES error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractErrorType('eacces: permission denied');
        expect(result).toBe('EACCES');
      });

      it('should extract ENOSPC error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractErrorType('enospc: no space left');
        expect(result).toBe('ENOSPC');
      });

      it('should extract EISDIR error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractErrorType('eisdir: illegal operation');
        expect(result).toBe('EISDIR');
      });

      it('should extract ENOTDIR error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractErrorType('enotdir: not a directory');
        expect(result).toBe('ENOTDIR');
      });

      it('should extract EEXIST error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractErrorType('eexist: file already exists');
        expect(result).toBe('EEXIST');
      });

      it('should return UNKNOWN for unrecognized error types', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractErrorType('unknown error');
        expect(result).toBe('UNKNOWN');
      });
    });

    describe('extractCLIErrorType', () => {
      it('should extract COMMAND_NOT_FOUND error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractCLIErrorType('command not found');
        expect(result).toBe('COMMAND_NOT_FOUND');
      });

      it('should extract TIMEOUT error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractCLIErrorType('command timed out');
        expect(result).toBe('TIMEOUT');
      });

      it('should extract EXECUTION_FAILED error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractCLIErrorType('command failed with exit code 1');
        expect(result).toBe('EXECUTION_FAILED');
      });

      it('should extract PERMISSION_DENIED error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractCLIErrorType('permission denied');
        expect(result).toBe('PERMISSION_DENIED');
      });

      it('should return UNKNOWN for unrecognized CLI error types', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractCLIErrorType('unknown cli error');
        expect(result).toBe('UNKNOWN');
      });
    });

    describe('extractValidationErrorType', () => {
      it('should extract VALIDATION_FAILED error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractValidationErrorType('validation failed');
        expect(result).toBe('VALIDATION_FAILED');
      });

      it('should extract CONFIGURATION_VALIDATION error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractValidationErrorType('configuration error');
        expect(result).toBe('CONFIGURATION_VALIDATION');
      });

      it('should extract TEMPLATE_VALIDATION error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractValidationErrorType('template error');
        expect(result).toBe('TEMPLATE_VALIDATION');
      });

      it('should extract PATH_VALIDATION error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractValidationErrorType('path contains special characters');
        expect(result).toBe('PATH_VALIDATION');
      });

      it('should extract REQUIRED_FIELD_VALIDATION error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractValidationErrorType('missing required field');
        expect(result).toBe('REQUIRED_FIELD_VALIDATION');
      });

      it('should return UNKNOWN for unrecognized validation error types', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractValidationErrorType('unknown validation error');
        expect(result).toBe('UNKNOWN');
      });
    });

    describe('extractConfigurationErrorType', () => {
      it('should extract PARSE_ERROR error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractConfigurationErrorType('failed to parse json');
        expect(result).toBe('PARSE_ERROR');
      });

      it('should extract SAVE_ERROR error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractConfigurationErrorType('failed to save');
        expect(result).toBe('SAVE_ERROR');
      });

      it('should extract LOAD_ERROR error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractConfigurationErrorType('failed to load');
        expect(result).toBe('LOAD_ERROR');
      });

      it('should extract VALIDATION_ERROR error type', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractConfigurationErrorType('invalid configuration');
        expect(result).toBe('VALIDATION_ERROR');
      });

      it('should return UNKNOWN for unrecognized configuration error types', () => {
        const errorHandler = new CodexErrorHandler();
        const result = (errorHandler as any).extractConfigurationErrorType('unknown config error');
        expect(result).toBe('UNKNOWN');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null error messages gracefully', () => {
      const error = new Error('');
      const result = errorHandler.handleFileSystemError(error, 'test');
      
      expect(result.code).toBe('FILESYSTEM_ERROR');
      expect(result.details.errorType).toBe('UNKNOWN');
    });

    it('should handle undefined config in configuration errors', () => {
      const error = new Error('Configuration error');
      const result = errorHandler.handleConfigurationError(error, undefined);
      
      expect(result.code).toBe('CONFIGURATION_ERROR');
      expect(result.details.config).toBeUndefined();
    });

    it('should handle empty context in validation errors', () => {
      const error = new Error('Validation error');
      const result = errorHandler.handleValidationError(error, '');
      
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.details.context).toBe('');
    });

    it('should handle empty command in CLI execution errors', () => {
      const error = new Error('CLI error');
      const result = errorHandler.handleCLIExecutionError(error, '');
      
      expect(result.code).toBe('CLI_EXECUTION_ERROR');
      expect(result.details.command).toBe('');
    });

    it('should handle empty operation in file system errors', () => {
      const error = new Error('File system error');
      const result = errorHandler.handleFileSystemError(error, '');
      
      expect(result.code).toBe('FILESYSTEM_ERROR');
      expect(result.details.operation).toBe('');
    });
  });
});
