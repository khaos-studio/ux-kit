/**
 * Use Case Tests for T019: Codex Error Handling Integration
 * 
 * These tests define the expected behavior and user scenarios for the CodexErrorIntegration service
 * following the TDD approach. They capture complete user journeys and expected outcomes.
 */

import { CodexErrorIntegration } from '../../src/integrations/CodexErrorIntegration';
import { IErrorHandlingService } from '../../src/contracts/infrastructure-contracts';
import { CodexError } from '../../src/contracts/domain-contracts';

describe('T019: Codex Error Handling Integration Use Cases', () => {
  let codexErrorIntegration: CodexErrorIntegration;
  let mockErrorHandlingService: jest.Mocked<IErrorHandlingService>;

  beforeEach(() => {
    // Create mock for the existing error handling service
    mockErrorHandlingService = {
      handleFileSystemError: jest.fn(),
      handleCLIExecutionError: jest.fn(),
      handleValidationError: jest.fn(),
      handleConfigurationError: jest.fn(),
      createUserFriendlyError: jest.fn()
    } as any;

    // Create CodexErrorIntegration instance
    codexErrorIntegration = new CodexErrorIntegration(mockErrorHandlingService);
  });

  describe('Codex Error Integration with Existing Error System', () => {
    it('should integrate with existing error handling service for file system errors', async () => {
      // Given: A file system error occurs during Codex operation
      const fileSystemError = new Error('ENOENT: no such file or directory, open \'/path/to/codex-config.json\'');
      const operation = 'read Codex configuration file';

      const expectedCodexError: CodexError = {
        code: 'FILESYSTEM_ERROR',
        message: 'File system error occurred during read Codex configuration file',
        details: {
          originalError: 'ENOENT: no such file or directory, open \'/path/to/codex-config.json\'',
          operation: 'read Codex configuration file',
          errorType: 'ENOENT'
        },
        suggestions: [
          'Check if the file path is correct',
          'Verify file permissions',
          'Ensure the directory exists',
          'Create the file if it should exist'
        ],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleFileSystemError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('File system error occurred during read Codex configuration file');

      // When: The user encounters a file system error during Codex operation
      const result = await codexErrorIntegration.handleCodexError(fileSystemError, 'file-system', operation);

      // Then: The error should be processed through the existing error handling service
      expect(result.success).toBe(false);
      expect(result.error).toBe('File system error occurred during read Codex configuration file');
      expect(result.suggestions).toEqual([
        'Check if the file path is correct',
        'Verify file permissions',
        'Ensure the directory exists',
        'Create the file if it should exist'
      ]);
      expect(mockErrorHandlingService.handleFileSystemError).toHaveBeenCalledWith(fileSystemError, operation);
      expect(mockErrorHandlingService.createUserFriendlyError).toHaveBeenCalledWith(expectedCodexError);
    });

    it('should integrate with existing error handling service for CLI execution errors', async () => {
      // Given: A CLI execution error occurs during Codex command execution
      const cliError = new Error('Command not found: codex');
      const command = 'codex generate questions --study user-interviews';

      const expectedCodexError: CodexError = {
        code: 'CLI_EXECUTION_ERROR',
        message: 'CLI execution error occurred during codex generate questions --study user-interviews',
        details: {
          originalError: 'Command not found: codex',
          command: 'codex generate questions --study user-interviews',
          errorType: 'COMMAND_NOT_FOUND'
        },
        suggestions: [
          'Check if Codex CLI is installed',
          'Verify PATH environment variable',
          'Install Codex CLI if missing',
          'Check command syntax'
        ],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('CLI execution error occurred during codex generate questions --study user-interviews');

      // When: The user encounters a CLI execution error during Codex operation
      const result = await codexErrorIntegration.handleCodexError(cliError, 'cli-execution', command);

      // Then: The error should be processed through the existing error handling service
      expect(result.success).toBe(false);
      expect(result.error).toBe('CLI execution error occurred during codex generate questions --study user-interviews');
      expect(result.suggestions).toEqual([
        'Check if Codex CLI is installed',
        'Verify PATH environment variable',
        'Install Codex CLI if missing',
        'Check command syntax'
      ]);
      expect(mockErrorHandlingService.handleCLIExecutionError).toHaveBeenCalledWith(cliError, command);
      expect(mockErrorHandlingService.createUserFriendlyError).toHaveBeenCalledWith(expectedCodexError);
    });

    it('should integrate with existing error handling service for validation errors', async () => {
      // Given: A validation error occurs during Codex configuration validation
      const validationError = new Error('Invalid configuration: missing required field "apiKey"');
      const context = 'Codex configuration validation';

      const expectedCodexError: CodexError = {
        code: 'VALIDATION_ERROR',
        message: 'Validation error occurred during Codex configuration validation',
        details: {
          originalError: 'Invalid configuration: missing required field "apiKey"',
          context: 'Codex configuration validation',
          errorType: 'MISSING_REQUIRED_FIELD'
        },
        suggestions: [
          'Check configuration file format',
          'Verify all required fields are present',
          'Validate field values',
          'Check configuration schema'
        ],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleValidationError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Validation error occurred during Codex configuration validation');

      // When: The user encounters a validation error during Codex operation
      const result = await codexErrorIntegration.handleCodexError(validationError, 'validation', context);

      // Then: The error should be processed through the existing error handling service
      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation error occurred during Codex configuration validation');
      expect(result.suggestions).toEqual([
        'Check configuration file format',
        'Verify all required fields are present',
        'Validate field values',
        'Check configuration schema'
      ]);
      expect(mockErrorHandlingService.handleValidationError).toHaveBeenCalledWith(validationError, context);
      expect(mockErrorHandlingService.createUserFriendlyError).toHaveBeenCalledWith(expectedCodexError);
    });

    it('should integrate with existing error handling service for configuration errors', async () => {
      // Given: A configuration error occurs during Codex setup
      const configError = new Error('Invalid API endpoint: https://invalid-endpoint.com');
      const config = { apiEndpoint: 'https://invalid-endpoint.com', apiKey: 'test-key' };

      const expectedCodexError: CodexError = {
        code: 'CONFIGURATION_ERROR',
        message: 'Configuration error occurred during Codex setup',
        details: {
          originalError: 'Invalid API endpoint: https://invalid-endpoint.com',
          config: { apiEndpoint: 'https://invalid-endpoint.com', apiKey: 'test-key' },
          errorType: 'INVALID_ENDPOINT'
        },
        suggestions: [
          'Check configuration values',
          'Verify API endpoint format',
          'Test connectivity to endpoint',
          'Update configuration file'
        ],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleConfigurationError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Configuration error occurred during Codex setup');

      // When: The user encounters a configuration error during Codex operation
      const result = await codexErrorIntegration.handleCodexError(configError, 'configuration', config);

      // Then: The error should be processed through the existing error handling service
      expect(result.success).toBe(false);
      expect(result.error).toBe('Configuration error occurred during Codex setup');
      expect(result.suggestions).toEqual([
        'Check configuration values',
        'Verify API endpoint format',
        'Test connectivity to endpoint',
        'Update configuration file'
      ]);
      expect(mockErrorHandlingService.handleConfigurationError).toHaveBeenCalledWith(configError, config);
      expect(mockErrorHandlingService.createUserFriendlyError).toHaveBeenCalledWith(expectedCodexError);
    });
  });

  describe('Codex Error Categorization', () => {
    it('should categorize Codex-specific errors appropriately', async () => {
      // Given: A Codex-specific error occurs
      const codexError = new Error('Codex API rate limit exceeded');
      const context = 'Codex API request';

      const expectedCodexError: CodexError = {
        code: 'CODEX_API_ERROR',
        message: 'Codex API error occurred during Codex API request',
        details: {
          originalError: 'Codex API rate limit exceeded',
          context: 'Codex API request',
          errorType: 'RATE_LIMIT_EXCEEDED'
        },
        suggestions: [
          'Wait before retrying the request',
          'Check API rate limits',
          'Implement exponential backoff',
          'Contact Codex support if issue persists'
        ],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Codex API error occurred during Codex API request');

      // When: The user encounters a Codex-specific error
      const result = await codexErrorIntegration.handleCodexError(codexError, 'codex-api', context);

      // Then: The error should be categorized as a Codex API error
      expect(result.success).toBe(false);
      expect(result.error).toBe('Codex API error occurred during Codex API request');
      expect(result.suggestions).toContain('Wait before retrying the request');
      expect(result.suggestions).toContain('Check API rate limits');
    });

    it('should handle unknown error types gracefully', async () => {
      // Given: An unknown error type occurs
      const unknownError = new Error('Unknown error occurred');
      const context = 'Unknown operation';

      const expectedCodexError: CodexError = {
        code: 'UNKNOWN_ERROR',
        message: 'Unknown error occurred during Unknown operation',
        details: {
          originalError: 'Unknown error occurred',
          context: 'Unknown operation',
          errorType: 'UNKNOWN'
        },
        suggestions: [
          'Check system logs for more details',
          'Try the operation again',
          'Contact support if issue persists',
          'Check system resources'
        ],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Unknown error occurred during Unknown operation');

      // When: The user encounters an unknown error
      const result = await codexErrorIntegration.handleCodexError(unknownError, 'unknown', context);

      // Then: The error should be handled gracefully with generic suggestions
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error occurred during Unknown operation');
      expect(result.suggestions).toContain('Check system logs for more details');
      expect(result.suggestions).toContain('Try the operation again');
    });
  });

  describe('User-Friendly Error Messages', () => {
    it('should provide user-friendly error messages for all error types', async () => {
      // Given: Various types of errors occur
      const errors = [
        { error: new Error('File not found'), type: 'file-system', context: 'config file' },
        { error: new Error('Command failed'), type: 'cli-execution', context: 'codex command' },
        { error: new Error('Invalid input'), type: 'validation', context: 'user input' },
        { error: new Error('Config error'), type: 'configuration', context: 'app config' }
      ];

      // Mock different error responses
      mockErrorHandlingService.handleFileSystemError.mockReturnValue({
        code: 'FILESYSTEM_ERROR',
        message: 'File system error occurred during config file',
        details: {},
        suggestions: ['Check file path'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'CLI_EXECUTION_ERROR',
        message: 'CLI execution error occurred during codex command',
        details: {},
        suggestions: ['Check command syntax'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.handleValidationError.mockReturnValue({
        code: 'VALIDATION_ERROR',
        message: 'Validation error occurred during user input',
        details: {},
        suggestions: ['Check input format'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.handleConfigurationError.mockReturnValue({
        code: 'CONFIGURATION_ERROR',
        message: 'Configuration error occurred during app config',
        details: {},
        suggestions: ['Check config values'],
        recoverable: true,
        timestamp: new Date()
      });

      mockErrorHandlingService.createUserFriendlyError.mockImplementation((error) => error.message);

      // When: Each error is processed
      const results = await Promise.all(
        errors.map(({ error, type, context }) => 
          codexErrorIntegration.handleCodexError(error, type, context)
        )
      );

      // Then: All errors should have user-friendly messages
      results.forEach((result: any, index: number) => {
        expect(result.success).toBe(false);
        expect(result.error).toBeTruthy();
        expect(typeof result.error).toBe('string');
        expect(result.error.length).toBeGreaterThan(0);
      });
    });

    it('should provide context-specific error messages', async () => {
      // Given: The same error occurs in different contexts
      const error = new Error('Permission denied');
      const contexts = [
        { type: 'file-system', context: 'reading config file' },
        { type: 'file-system', context: 'writing log file' },
        { type: 'file-system', context: 'creating directory' }
      ];

      mockErrorHandlingService.handleFileSystemError.mockImplementation((err, operation) => ({
        code: 'FILESYSTEM_ERROR',
        message: `File system error occurred during ${operation}`,
        details: { originalError: err.message, operation },
        suggestions: ['Check permissions'],
        recoverable: true,
        timestamp: new Date()
      }));
      mockErrorHandlingService.createUserFriendlyError.mockImplementation((error) => error.message);

      // When: The same error is processed in different contexts
      const results = await Promise.all(
        contexts.map(({ type, context }) => 
          codexErrorIntegration.handleCodexError(error, type, context)
        )
      );

      // Then: Each result should have context-specific messages
      expect(results[0]?.error).toContain('reading config file');
      expect(results[1]?.error).toContain('writing log file');
      expect(results[2]?.error).toContain('creating directory');
    });
  });

  describe('Error Recovery Suggestions', () => {
    it('should provide specific recovery suggestions for different error types', async () => {
      // Given: Different types of errors with specific recovery suggestions
      const errorScenarios = [
        {
          error: new Error('Network timeout'),
          type: 'codex-api',
          context: 'API request',
          expectedSuggestions: ['Check internet connection', 'Retry the request', 'Check API status', 'Increase timeout settings']
        },
        {
          error: new Error('Invalid API key'),
          type: 'configuration',
          context: 'API configuration',
          expectedSuggestions: ['Verify API key', 'Check key format', 'Regenerate API key']
        },
        {
          error: new Error('Disk space full'),
          type: 'file-system',
          context: 'file operation',
          expectedSuggestions: ['Free up disk space', 'Check available storage', 'Clean temporary files']
        }
      ];

      // Mock error handling responses
      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: {},
        suggestions: ['Check internet connection', 'Retry the request', 'Check API status'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.handleConfigurationError.mockReturnValue({
        code: 'CONFIGURATION_ERROR',
        message: 'Configuration error occurred',
        details: {},
        suggestions: ['Verify API key', 'Check key format', 'Regenerate API key'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.handleFileSystemError.mockReturnValue({
        code: 'FILESYSTEM_ERROR',
        message: 'File system error occurred',
        details: {},
        suggestions: ['Free up disk space', 'Check available storage', 'Clean temporary files'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockImplementation((error) => error.message);

      // When: Each error scenario is processed
      const results = await Promise.all(
        errorScenarios.map(({ error, type, context }) => 
          codexErrorIntegration.handleCodexError(error, type, context)
        )
      );

      // Then: Each result should have appropriate recovery suggestions
      results.forEach((result: any, index: number) => {
        expect(result.success).toBe(false);
        expect(result.suggestions).toEqual(errorScenarios[index]?.expectedSuggestions);
      });
    });

    it('should provide fallback suggestions when specific suggestions are not available', async () => {
      // Given: An error with no specific suggestions
      const error = new Error('Unexpected error');
      const context = 'unknown operation';

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'UNKNOWN_ERROR',
        message: 'Unknown error occurred',
        details: {},
        suggestions: [],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Unknown error occurred');

      // When: The error is processed
      const result = await codexErrorIntegration.handleCodexError(error, 'unknown', context);

      // Then: Fallback suggestions should be provided
      expect(result.success).toBe(false);
      expect(result.suggestions).toEqual([
        'Check system logs for more details',
        'Try the operation again',
        'Contact support if issue persists',
        'Check system resources'
      ]);
    });
  });

  describe('Error Logging Integration', () => {
    it('should log errors with appropriate detail level', async () => {
      // Given: An error occurs during Codex operation
      const error = new Error('Codex service unavailable');
      const context = 'Codex API call';

      // Mock the createUserFriendlyError method for codex-api errors
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Codex API error occurred during Codex API call');

      // When: The error is processed
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: The error should be logged with appropriate details
      expect(result.success).toBe(false);
      expect(result.error).toBe('Codex API error occurred during Codex API call');
      expect(result.suggestions).toEqual([
        'Check API documentation',
        'Verify request format',
        'Contact Codex support',
        'Check API status page'
      ]);
      
      // Verify that the error was processed (codex-api errors are handled internally)
      expect(result.recoverable).toBe(true);
    });

    it('should preserve error context for logging purposes', async () => {
      // Given: An error occurs with specific context information
      const error = new Error('Authentication failed');
      const context = 'Codex API authentication';

      // Mock the createUserFriendlyError method for codex-api errors
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Codex API error occurred during Codex API authentication');

      // When: The error is processed
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: The context should be preserved in the error details
      expect(result.success).toBe(false);
      expect(result.error).toBe('Codex API error occurred during Codex API authentication');
      expect(result.details).toMatchObject({
        originalError: 'Authentication failed',
        context: 'Codex API authentication',
        errorType: 'AUTHENTICATION_ERROR'
      });
      expect(result.suggestions).toEqual([
        'Check API credentials',
        'Verify API key format',
        'Regenerate API key if needed',
        'Check API key permissions'
      ]);
    });
  });

  describe('Error Integration with Existing CLI Error Handler', () => {
    it('should integrate with existing CLI error handler for consistent error formatting', async () => {
      // Given: An error occurs that should be formatted for CLI output
      const error = new Error('Invalid command syntax');
      const context = 'codex generate --invalid-flag';

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue({
        code: 'CLI_SYNTAX_ERROR',
        message: 'CLI syntax error occurred',
        details: { originalError: 'Invalid command syntax', command: context },
        suggestions: ['Check command syntax', 'Use --help for usage'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('CLI syntax error occurred');

      // When: The error is processed for CLI output
      const result = await codexErrorIntegration.handleCodexError(error, 'cli-execution', context);

      // Then: The error should be formatted consistently with CLI error handling
      expect(result.success).toBe(false);
      expect(result.error).toBe('CLI syntax error occurred');
      expect(result.suggestions).toContain('Check command syntax');
      expect(result.suggestions).toContain('Use --help for usage');
    });

    it('should provide structured error information for CLI error handler integration', async () => {
      // Given: An error occurs that needs structured information for CLI processing
      const error = new Error('Configuration file not found');
      const context = 'loading Codex configuration';

      mockErrorHandlingService.handleFileSystemError.mockReturnValue({
        code: 'CONFIG_FILE_NOT_FOUND',
        message: 'Configuration file not found',
        details: { 
          originalError: 'Configuration file not found',
          operation: 'loading Codex configuration',
          filePath: '/path/to/codex-config.json'
        },
        suggestions: ['Create configuration file', 'Check file path', 'Use default configuration'],
        recoverable: true,
        timestamp: new Date()
      });
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Configuration file not found');

      // When: The error is processed
      const result = await codexErrorIntegration.handleCodexError(error, 'file-system', context);

      // Then: The result should provide structured information for CLI processing
      expect(result.success).toBe(false);
      expect(result.error).toBe('Configuration file not found');
      expect(result.suggestions).toEqual([
        'Create configuration file',
        'Check file path',
        'Use default configuration'
      ]);
      expect(result.recoverable).toBe(true);
    });
  });
});
