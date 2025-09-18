/**
 * Input Validator
 * 
 * Validates user inputs for UX-Kit commands and operations.
 */

import { ValidationResult, createSuccessResult, createErrorResult } from './ValidationResult';

export class InputValidator {
  /**
   * Validate study name
   */
  validateStudyName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Study name is required');
    } else if (name.length > 100) {
      errors.push('Study name must be 100 characters or less');
    } else if (name.length < 3) {
      errors.push('Study name must be at least 3 characters long');
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate study ID
   */
  validateStudyId(id: string): ValidationResult {
    const errors: string[] = [];

    if (!id || id.trim().length === 0) {
      errors.push('Study ID is required');
    } else if (!/^[a-z0-9-]+$/.test(id)) {
      errors.push('Study ID must contain only lowercase letters, numbers, and hyphens');
    } else if (id.length > 50) {
      errors.push('Study ID must be 50 characters or less');
    } else if (id.length < 3) {
      errors.push('Study ID must be at least 3 characters long');
    } else if (id.startsWith('-') || id.endsWith('-')) {
      errors.push('Study ID cannot start or end with a hyphen');
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate file path
   */
  validateFilePath(path: string): ValidationResult {
    const errors: string[] = [];

    if (!path || path.trim().length === 0) {
      errors.push('File path is required');
    } else if (/[<>:"|?*]/.test(path)) {
      errors.push('File path contains invalid characters');
    } else if (path.length > 260) {
      errors.push('File path must be 260 characters or less');
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate command arguments
   */
  validateCommandArgs(args: string[]): ValidationResult {
    const errors: string[] = [];

    if (!args || args.length === 0) {
      errors.push('Command is required');
      return createErrorResult(errors);
    }

    const command = args[0];
    const validCommands = ['questions', 'sources', 'summarize', 'interview', 'synthesize', 'create', 'list', 'show', 'delete'];

    if (command && !validCommands.includes(command)) {
      errors.push(`Invalid command: ${command}`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate URL
   */
  validateUrl(url: string): ValidationResult {
    const errors: string[] = [];

    if (!url || url.trim().length === 0) {
      errors.push('URL is required');
    } else {
      try {
        new URL(url);
      } catch {
        errors.push('Invalid URL format');
      }
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate positive number
   */
  validatePositiveNumber(value: number, fieldName: string = 'Value'): ValidationResult {
    const errors: string[] = [];

    if (typeof value !== 'number' || isNaN(value)) {
      errors.push(`${fieldName} must be a valid number`);
    } else if (value <= 0) {
      errors.push(`${fieldName} must be positive`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate string length
   */
  validateStringLength(value: string, minLength: number, maxLength: number, fieldName: string = 'Value'): ValidationResult {
    const errors: string[] = [];

    if (typeof value !== 'string') {
      errors.push(`${fieldName} must be a string`);
    } else if (value.length < minLength) {
      errors.push(`${fieldName} must be at least ${minLength} characters long`);
    } else if (value.length > maxLength) {
      errors.push(`${fieldName} must be ${maxLength} characters or less`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate required field
   */
  validateRequired(value: any, fieldName: string = 'Field'): ValidationResult {
    const errors: string[] = [];

    if (value === null || value === undefined || value === '') {
      errors.push(`${fieldName} is required`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate pattern match
   */
  validatePattern(value: string, pattern: RegExp, fieldName: string = 'Value', errorMessage?: string): ValidationResult {
    const errors: string[] = [];

    if (typeof value !== 'string') {
      errors.push(`${fieldName} must be a string`);
    } else if (!pattern.test(value)) {
      errors.push(errorMessage || `${fieldName} format is invalid`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }
}
