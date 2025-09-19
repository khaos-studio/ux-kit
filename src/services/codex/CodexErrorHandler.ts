/**
 * CodexErrorHandler Service
 * 
 * Implements comprehensive error handling for Codex integration operations.
 * Provides user-friendly error messages, categorization, and recovery suggestions.
 */

import { IErrorHandlingService } from '../../contracts/infrastructure-contracts';
import { CodexError } from '../../contracts/domain-contracts';

/**
 * Service for handling errors in Codex integration operations
 */
export class CodexErrorHandler implements IErrorHandlingService {
  /**
   * Handle file system errors with appropriate categorization and suggestions
   */
  handleFileSystemError(error: Error, operation: string): CodexError {
    const errorMessage = error.message.toLowerCase();
    const errorType = this.extractErrorType(errorMessage);
    
    let suggestions: string[] = [];
    
    if (errorType === 'ENOENT') {
      suggestions = [
        'Check if the file path is correct',
        'Verify file permissions',
        'Ensure the directory exists',
        'Create the file if it should exist'
      ];
    } else if (errorType === 'EACCES') {
      suggestions = [
        'Check file permissions',
        'Run with appropriate privileges',
        'Verify write access to the directory',
        'Check if file is locked by another process'
      ];
    } else if (errorType === 'ENOSPC') {
      suggestions = [
        'Free up disk space',
        'Check available storage',
        'Try a different location',
        'Clean up temporary files'
      ];
    } else {
      suggestions = [
        'Check file system status',
        'Verify file path format',
        'Try the operation again',
        'Check system resources'
      ];
    }

    return {
      code: 'FILESYSTEM_ERROR',
      message: `File system error occurred during ${operation}`,
      details: {
        originalError: error.message,
        operation,
        errorType
      },
      suggestions,
      recoverable: true,
      timestamp: new Date()
    };
  }

  /**
   * Handle CLI execution errors with appropriate categorization and suggestions
   */
  handleCLIExecutionError(error: Error, command: string): CodexError {
    const errorMessage = error.message.toLowerCase();
    const errorType = this.extractCLIErrorType(errorMessage);
    
    let suggestions: string[] = [];
    
    if (errorType === 'COMMAND_NOT_FOUND') {
      suggestions = [
        'Install the required CLI tool',
        'Check if the command is in PATH',
        'Verify command spelling',
        'Check if the tool is properly installed'
      ];
    } else if (errorType === 'TIMEOUT') {
      suggestions = [
        'Increase timeout value',
        'Check system performance',
        'Try with smaller dataset',
        'Check network connectivity'
      ];
    } else if (errorType === 'EXECUTION_FAILED') {
      suggestions = [
        'Check command arguments',
        'Verify input data',
        'Check command documentation',
        'Try with verbose output for debugging'
      ];
    } else {
      suggestions = [
        'Check command syntax',
        'Verify system requirements',
        'Check command permissions',
        'Review command documentation'
      ];
    }

    return {
      code: 'CLI_EXECUTION_ERROR',
      message: `CLI execution error occurred for command: ${command}`,
      details: {
        originalError: error.message,
        command,
        errorType
      },
      suggestions,
      recoverable: true,
      timestamp: new Date()
    };
  }

  /**
   * Handle validation errors with appropriate categorization and suggestions
   */
  handleValidationError(error: Error, context: string): CodexError {
    const errorMessage = error.message.toLowerCase();
    const errorType = this.extractValidationErrorType(errorMessage);
    
    let suggestions: string[] = [];
    
    if (errorType === 'VALIDATION_FAILED') {
      // Check context to determine specific suggestions
      if (context.toLowerCase().includes('configuration')) {
        suggestions = [
          'Check configuration values',
          'Verify data types and formats',
          'Review configuration schema',
          'Use default configuration as reference'
        ];
      } else if (context.toLowerCase().includes('template')) {
        suggestions = [
          'Check template structure',
          'Verify required fields',
          'Review template schema',
          'Validate template syntax'
        ];
      } else if (context.toLowerCase().includes('path')) {
        suggestions = [
          'Check path format',
          'Remove invalid characters',
          'Use absolute path',
          'Verify path exists'
        ];
      } else {
        suggestions = [
          'Check input data format',
          'Verify validation rules',
          'Review data requirements',
          'Check for missing required fields'
        ];
      }
    } else if (errorType === 'CONFIGURATION_VALIDATION') {
      suggestions = [
        'Check configuration values',
        'Verify data types and formats',
        'Review configuration schema',
        'Use default configuration as reference'
      ];
    } else if (errorType === 'TEMPLATE_VALIDATION') {
      suggestions = [
        'Check template structure',
        'Verify required fields',
        'Review template schema',
        'Validate template syntax'
      ];
    } else if (errorType === 'PATH_VALIDATION') {
      suggestions = [
        'Check path format',
        'Remove invalid characters',
        'Use absolute path',
        'Verify path exists'
      ];
    } else {
      suggestions = [
        'Check input data format',
        'Verify validation rules',
        'Review data requirements',
        'Check for missing required fields'
      ];
    }

    return {
      code: 'VALIDATION_ERROR',
      message: `Validation error occurred in ${context}`,
      details: {
        originalError: error.message,
        context,
        errorType
      },
      suggestions,
      recoverable: true,
      timestamp: new Date()
    };
  }

  /**
   * Handle configuration errors with appropriate categorization and suggestions
   */
  handleConfigurationError(error: Error, config: any): CodexError {
    const errorMessage = error.message.toLowerCase();
    const errorType = this.extractConfigurationErrorType(errorMessage);
    
    let suggestions: string[] = [];
    
    if (errorType === 'PARSE_ERROR') {
      suggestions = [
        'Check configuration file format',
        'Validate JSON syntax',
        'Use default configuration',
        'Check for syntax errors'
      ];
    } else if (errorType === 'SAVE_ERROR') {
      suggestions = [
        'Check file permissions',
        'Verify directory access',
        'Try different location',
        'Check disk space'
      ];
    } else if (errorType === 'LOAD_ERROR') {
      suggestions = [
        'Check file exists',
        'Verify file permissions',
        'Check file format',
        'Use default configuration'
      ];
    } else {
      suggestions = [
        'Check configuration structure',
        'Verify configuration values',
        'Review configuration schema',
        'Reset to default configuration'
      ];
    }

    return {
      code: 'CONFIGURATION_ERROR',
      message: `Configuration error occurred: ${error.message}`,
      details: {
        originalError: error.message,
        config,
        errorType
      },
      suggestions,
      recoverable: true,
      timestamp: new Date()
    };
  }

  /**
   * Create user-friendly error messages from CodexError objects
   */
  createUserFriendlyError(error: CodexError): string {
    let message = `${error.message}\n\n`;
    
    if (error.suggestions && error.suggestions.length > 0) {
      message += 'Suggestions:\n';
      error.suggestions.forEach((suggestion, index) => {
        message += `${index + 1}. ${suggestion}\n`;
      });
      message += '\n';
    }
    
    if (error.recoverable) {
      message += 'This error can be resolved by following the suggestions above.';
    } else {
      message += 'This error requires manual intervention. Please contact support if the issue persists.';
    }
    
    return message;
  }

  /**
   * Extract error type from error message for file system errors
   */
  private extractErrorType(errorMessage: string): string {
    if (errorMessage.includes('enoent')) return 'ENOENT';
    if (errorMessage.includes('eacces')) return 'EACCES';
    if (errorMessage.includes('enospc')) return 'ENOSPC';
    if (errorMessage.includes('eisdir')) return 'EISDIR';
    if (errorMessage.includes('enotdir')) return 'ENOTDIR';
    if (errorMessage.includes('eexist')) return 'EEXIST';
    return 'UNKNOWN';
  }

  /**
   * Extract error type from error message for CLI execution errors
   */
  private extractCLIErrorType(errorMessage: string): string {
    if (errorMessage.includes('not found') || errorMessage.includes('command not found')) {
      return 'COMMAND_NOT_FOUND';
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return 'TIMEOUT';
    }
    if (errorMessage.includes('exit code') || errorMessage.includes('failed')) {
      return 'EXECUTION_FAILED';
    }
    if (errorMessage.includes('permission denied')) {
      return 'PERMISSION_DENIED';
    }
    return 'UNKNOWN';
  }

  /**
   * Extract error type from error message for validation errors
   */
  private extractValidationErrorType(errorMessage: string): string {
    if (errorMessage.includes('validation failed') || errorMessage.includes('invalid')) {
      return 'VALIDATION_FAILED';
    }
    if (errorMessage.includes('configuration')) {
      return 'CONFIGURATION_VALIDATION';
    }
    if (errorMessage.includes('template')) {
      return 'TEMPLATE_VALIDATION';
    }
    if (errorMessage.includes('path') || errorMessage.includes('invalid characters')) {
      return 'PATH_VALIDATION';
    }
    if (errorMessage.includes('required field') || errorMessage.includes('missing')) {
      return 'REQUIRED_FIELD_VALIDATION';
    }
    return 'UNKNOWN';
  }

  /**
   * Extract error type from error message for configuration errors
   */
  private extractConfigurationErrorType(errorMessage: string): string {
    if (errorMessage.includes('parse') || errorMessage.includes('json') || errorMessage.includes('syntax')) {
      return 'PARSE_ERROR';
    }
    if (errorMessage.includes('save') || errorMessage.includes('write')) {
      return 'SAVE_ERROR';
    }
    if (errorMessage.includes('load') || errorMessage.includes('read')) {
      return 'LOAD_ERROR';
    }
    if (errorMessage.includes('invalid') || errorMessage.includes('validation')) {
      return 'VALIDATION_ERROR';
    }
    return 'UNKNOWN';
  }
}
