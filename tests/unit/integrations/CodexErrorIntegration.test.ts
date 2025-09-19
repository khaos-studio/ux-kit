/**
 * Unit Tests for CodexErrorIntegration
 * 
 * Comprehensive unit tests with 100% coverage for the CodexErrorIntegration service.
 * Tests all methods, error scenarios, and edge cases.
 */

import { CodexErrorIntegration } from '../../../src/integrations/CodexErrorIntegration';
import { IErrorHandlingService } from '../../../src/contracts/infrastructure-contracts';
import { CodexError } from '../../../src/contracts/domain-contracts';

describe('CodexErrorIntegration', () => {
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

  describe('Constructor', () => {
    it('should create CodexErrorIntegration instance', () => {
      expect(codexErrorIntegration).toBeInstanceOf(CodexErrorIntegration);
    });
  });

  describe('handleCodexError', () => {
    it('should handle file system errors', async () => {
      // Given: A file system error
      const error = new Error('File not found');
      const context = 'reading config file';

      const expectedCodexError: CodexError = {
        code: 'FILESYSTEM_ERROR',
        message: 'File system error occurred',
        details: { originalError: 'File not found', operation: context },
        suggestions: ['Check file path'],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleFileSystemError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('File system error occurred');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'file-system', context);

      // Then: The error should be processed correctly
      expect(result.success).toBe(false);
      expect(result.error).toBe('File system error occurred');
      expect(result.suggestions).toEqual(['Check file path']);
      expect(result.recoverable).toBe(true);
      expect(mockErrorHandlingService.handleFileSystemError).toHaveBeenCalledWith(error, context);
      expect(mockErrorHandlingService.createUserFriendlyError).toHaveBeenCalledWith(expectedCodexError);
    });

    it('should handle CLI execution errors', async () => {
      // Given: A CLI execution error
      const error = new Error('Command not found');
      const context = 'codex command';

      const expectedCodexError: CodexError = {
        code: 'CLI_EXECUTION_ERROR',
        message: 'CLI execution error occurred',
        details: { originalError: 'Command not found', command: context },
        suggestions: ['Check command syntax'],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleCLIExecutionError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('CLI execution error occurred');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'cli-execution', context);

      // Then: The error should be processed correctly
      expect(result.success).toBe(false);
      expect(result.error).toBe('CLI execution error occurred');
      expect(result.suggestions).toEqual(['Check command syntax']);
      expect(result.recoverable).toBe(true);
      expect(mockErrorHandlingService.handleCLIExecutionError).toHaveBeenCalledWith(error, context);
      expect(mockErrorHandlingService.createUserFriendlyError).toHaveBeenCalledWith(expectedCodexError);
    });

    it('should handle validation errors', async () => {
      // Given: A validation error
      const error = new Error('Invalid input');
      const context = 'user input validation';

      const expectedCodexError: CodexError = {
        code: 'VALIDATION_ERROR',
        message: 'Validation error occurred',
        details: { originalError: 'Invalid input', context },
        suggestions: ['Check input format'],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleValidationError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Validation error occurred');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'validation', context);

      // Then: The error should be processed correctly
      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation error occurred');
      expect(result.suggestions).toEqual(['Check input format']);
      expect(result.recoverable).toBe(true);
      expect(mockErrorHandlingService.handleValidationError).toHaveBeenCalledWith(error, context);
      expect(mockErrorHandlingService.createUserFriendlyError).toHaveBeenCalledWith(expectedCodexError);
    });

    it('should handle configuration errors', async () => {
      // Given: A configuration error
      const error = new Error('Invalid config');
      const context = { apiKey: 'invalid' };

      const expectedCodexError: CodexError = {
        code: 'CONFIGURATION_ERROR',
        message: 'Configuration error occurred',
        details: { originalError: 'Invalid config', config: context },
        suggestions: ['Check config values'],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleConfigurationError.mockReturnValue(expectedCodexError);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Configuration error occurred');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'configuration', context);

      // Then: The error should be processed correctly
      expect(result.success).toBe(false);
      expect(result.error).toBe('Configuration error occurred');
      expect(result.suggestions).toEqual(['Check config values']);
      expect(result.recoverable).toBe(true);
      expect(mockErrorHandlingService.handleConfigurationError).toHaveBeenCalledWith(error, context);
      expect(mockErrorHandlingService.createUserFriendlyError).toHaveBeenCalledWith(expectedCodexError);
    });

    it('should handle Codex API errors', async () => {
      // Given: A Codex API error
      const error = new Error('Rate limit exceeded');
      const context = 'API request';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Codex API error occurred during API request');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: The error should be processed correctly
      expect(result.success).toBe(false);
      expect(result.error).toBe('Codex API error occurred during API request');
      expect(result.suggestions).toEqual([
        'Wait before retrying the request',
        'Check API rate limits',
        'Implement exponential backoff',
        'Contact Codex support if issue persists'
      ]);
      expect(result.recoverable).toBe(true);
      expect(result.details).toMatchObject({
        originalError: 'Rate limit exceeded',
        context: 'API request',
        errorType: 'RATE_LIMIT_EXCEEDED'
      });
    });

    it('should handle unknown error types', async () => {
      // Given: An unknown error type
      const error = new Error('Unknown error');
      const context = 'unknown operation';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Unknown error occurred during unknown operation');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'unknown', context);

      // Then: The error should be processed correctly
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error occurred during unknown operation');
      expect(result.suggestions).toEqual([
        'Check system logs for more details',
        'Try the operation again',
        'Contact support if issue persists',
        'Check system resources'
      ]);
      expect(result.recoverable).toBe(true);
      expect(result.details).toMatchObject({
        originalError: 'Unknown error',
        context: 'unknown operation',
        errorType: 'UNKNOWN'
      });
    });

    it('should handle errors when error handling service fails', async () => {
      // Given: An error and a failing error handling service
      const error = new Error('Original error');
      const context = 'test operation';

      mockErrorHandlingService.handleFileSystemError.mockImplementation(() => {
        throw new Error('Error handling failed');
      });

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'file-system', context);

      // Then: A safe fallback should be provided
      expect(result.success).toBe(false);
      expect(result.error).toBe('An error occurred while processing the error');
      expect(result.suggestions).toEqual([
        'Check system logs for more details',
        'Try the operation again',
        'Contact support if issue persists',
        'Check system resources'
      ]);
      expect(result.recoverable).toBe(true);
      expect(result.details).toMatchObject({
        originalError: 'Original error',
        handlingError: 'Error handling failed'
      });
    });

    it('should provide fallback suggestions when no suggestions are available', async () => {
      // Given: An error with no suggestions
      const error = new Error('Error with no suggestions');
      const context = 'test operation';

      const codexErrorWithoutSuggestions: CodexError = {
        code: 'ERROR_WITHOUT_SUGGESTIONS',
        message: 'Error occurred',
        details: {},
        suggestions: [],
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleFileSystemError.mockReturnValue(codexErrorWithoutSuggestions);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Error occurred');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'file-system', context);

      // Then: Fallback suggestions should be provided
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error occurred');
      expect(result.suggestions).toEqual([
        'Check system logs for more details',
        'Try the operation again',
        'Contact support if issue persists',
        'Check system resources'
      ]);
    });

    it('should handle null suggestions gracefully', async () => {
      // Given: An error with null suggestions
      const error = new Error('Error with null suggestions');
      const context = 'test operation';

      const codexErrorWithNullSuggestions: CodexError = {
        code: 'ERROR_WITH_NULL_SUGGESTIONS',
        message: 'Error occurred',
        details: {},
        recoverable: true,
        timestamp: new Date()
      };

      mockErrorHandlingService.handleFileSystemError.mockReturnValue(codexErrorWithNullSuggestions);
      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Error occurred');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'file-system', context);

      // Then: Fallback suggestions should be provided
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error occurred');
      expect(result.suggestions).toEqual([
        'Check system logs for more details',
        'Try the operation again',
        'Contact support if issue persists',
        'Check system resources'
      ]);
    });
  });

  describe('Codex API Error Handling', () => {
    it('should categorize rate limit errors correctly', async () => {
      // Given: A rate limit error
      const error = new Error('Rate limit exceeded');
      const context = 'API request';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Rate limit error');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: It should be categorized as rate limit error
      expect(result.details?.errorType).toBe('RATE_LIMIT_EXCEEDED');
      expect(result.suggestions).toContain('Wait before retrying the request');
      expect(result.suggestions).toContain('Check API rate limits');
    });

    it('should categorize authentication errors correctly', async () => {
      // Given: An authentication error
      const error = new Error('Authentication failed');
      const context = 'API authentication';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Authentication error');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: It should be categorized as authentication error
      expect(result.details?.errorType).toBe('AUTHENTICATION_ERROR');
      expect(result.suggestions).toContain('Check API credentials');
      expect(result.suggestions).toContain('Verify API key format');
    });

    it('should categorize connection errors correctly', async () => {
      // Given: A connection error
      const error = new Error('Connection timeout');
      const context = 'API connection';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Connection error');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: It should be categorized as connection error
      expect(result.details?.errorType).toBe('CONNECTION_ERROR');
      expect(result.suggestions).toContain('Check internet connection');
      expect(result.suggestions).toContain('Retry the request');
    });

    it('should categorize not found errors correctly', async () => {
      // Given: A not found error
      const error = new Error('Resource not found');
      const context = 'API resource';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Not found error');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: It should be categorized as resource not found error
      expect(result.details?.errorType).toBe('RESOURCE_NOT_FOUND');
      expect(result.suggestions).toContain('Check API endpoint URL');
      expect(result.suggestions).toContain('Verify resource exists');
    });

    it('should categorize permission errors correctly', async () => {
      // Given: A permission error
      const error = new Error('Permission denied');
      const context = 'API access';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Permission error');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: It should be categorized as permission denied error
      expect(result.details?.errorType).toBe('PERMISSION_DENIED');
      expect(result.suggestions).toContain('Check API documentation');
    });

    it('should categorize invalid request errors correctly', async () => {
      // Given: An invalid request error
      const error = new Error('Invalid request format');
      const context = 'API request';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Invalid request error');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: It should be categorized as invalid request error
      expect(result.details?.errorType).toBe('INVALID_REQUEST');
      expect(result.suggestions).toContain('Check API documentation');
    });

    it('should handle unknown API errors correctly', async () => {
      // Given: An unknown API error
      const error = new Error('Unknown API error');
      const context = 'API call';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Unknown API error');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'codex-api', context);

      // Then: It should be categorized as unknown API error
      expect(result.details?.errorType).toBe('UNKNOWN_API_ERROR');
      expect(result.suggestions).toContain('Check API documentation');
    });
  });

  describe('Error Statistics', () => {
    it('should return error handling statistics', () => {
      // When: Getting error handling statistics
      const stats = codexErrorIntegration.getErrorHandlingStats();

      // Then: Should return statistics object
      expect(stats).toHaveProperty('totalErrors');
      expect(stats).toHaveProperty('errorTypes');
      expect(stats).toHaveProperty('recoverableErrors');
      expect(stats).toHaveProperty('nonRecoverableErrors');
      expect(stats.totalErrors).toBe(0);
      expect(stats.errorTypes).toEqual({});
      expect(stats.recoverableErrors).toBe(0);
      expect(stats.nonRecoverableErrors).toBe(0);
    });

    it('should reset error handling statistics', () => {
      // When: Resetting error handling statistics
      expect(() => codexErrorIntegration.resetErrorHandlingStats()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty error message', async () => {
      // Given: An error with empty message
      const error = new Error('');
      const context = 'test operation';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Unknown error occurred during test operation');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'unknown', context);

      // Then: The error should be handled gracefully
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error occurred during test operation');
      expect(result.recoverable).toBe(true);
    });

    it('should handle null context', async () => {
      // Given: An error with null context
      const error = new Error('Test error');
      const context = null;

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Unknown error occurred during null');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'unknown', context);

      // Then: The error should be handled gracefully
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error occurred during null');
      expect(result.recoverable).toBe(true);
    });

    it('should handle undefined context', async () => {
      // Given: An error with undefined context
      const error = new Error('Test error');
      const context = undefined;

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Unknown error occurred during undefined');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'unknown', context);

      // Then: The error should be handled gracefully
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error occurred during undefined');
      expect(result.recoverable).toBe(true);
    });

    it('should handle non-Error objects', async () => {
      // Given: A non-Error object
      const error = 'String error' as any;
      const context = 'test operation';

      mockErrorHandlingService.createUserFriendlyError.mockReturnValue('Unknown error occurred during test operation');

      // When: The error is handled
      const result = await codexErrorIntegration.handleCodexError(error, 'unknown', context);

      // Then: The error should be handled gracefully
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error occurred during test operation');
      expect(result.recoverable).toBe(true);
    });
  });
});
