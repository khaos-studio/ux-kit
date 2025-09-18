/**
 * Validation Result
 * 
 * Common types and interfaces for validation results.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
  errorMessage?: string;
}

export interface ValidationOptions {
  strict?: boolean;
  allowEmpty?: boolean;
  customRules?: ValidationRule[];
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function createValidationResult(isValid: boolean, errors: string[] = [], warnings: string[] = []): ValidationResult {
  return {
    isValid,
    errors,
    warnings
  };
}

export function createSuccessResult(): ValidationResult {
  return createValidationResult(true);
}

export function createErrorResult(errors: string[]): ValidationResult {
  return createValidationResult(false, errors);
}
