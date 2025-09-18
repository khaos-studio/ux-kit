/**
 * Error Handler
 * 
 * Handles and formats errors for CLI application.
 */

import { ValidationError } from '../contracts/presentation-contracts';

export class ErrorHandler {
  handleError(error: Error): { success: boolean; message: string; errors?: string[] } {
    let message = error.message;
    
    // Provide user-friendly messages for common errors
    if (error.message.includes('ENOENT')) {
      message = 'File not found: ' + error.message;
    } else if (error.message.includes('EACCES')) {
      message = 'Permission denied: ' + error.message;
    } else if (error.message.includes('Command not found')) {
      message = 'Command not found: ' + error.message;
    }

    return {
      success: false,
      message: message
    };
  }

  handleValidationErrors(errors: ValidationError[]): { success: boolean; message: string; errors: string[] } {
    const errorMessages = errors.map(error => `${error.field}: ${error.message}`);
    
    return {
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    };
  }

  handleCLIError(error: Error): { success: boolean; message: string } {
    return {
      success: false,
      message: `CLI Error: ${error.message}`
    };
  }

  handleSystemError(error: Error): { success: boolean; message: string } {
    return {
      success: false,
      message: `System Error: ${error.message}`
    };
  }
}
