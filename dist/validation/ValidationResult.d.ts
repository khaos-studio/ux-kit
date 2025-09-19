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
export declare class ValidationError extends Error {
    field: string;
    code: string;
    constructor(message: string, field: string, code: string);
}
export declare function createValidationResult(isValid: boolean, errors?: string[], warnings?: string[]): ValidationResult;
export declare function createSuccessResult(): ValidationResult;
export declare function createErrorResult(errors: string[]): ValidationResult;
