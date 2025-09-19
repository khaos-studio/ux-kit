/**
 * Input Validator
 *
 * Validates user inputs for UX-Kit commands and operations.
 */
import { ValidationResult } from './ValidationResult';
export declare class InputValidator {
    /**
     * Validate study name
     */
    validateStudyName(name: string): ValidationResult;
    /**
     * Validate study ID
     */
    validateStudyId(id: string): ValidationResult;
    /**
     * Validate file path
     */
    validateFilePath(path: string): ValidationResult;
    /**
     * Validate command arguments
     */
    validateCommandArgs(args: string[]): ValidationResult;
    /**
     * Validate email address
     */
    validateEmail(email: string): ValidationResult;
    /**
     * Validate URL
     */
    validateUrl(url: string): ValidationResult;
    /**
     * Validate positive number
     */
    validatePositiveNumber(value: number, fieldName?: string): ValidationResult;
    /**
     * Validate string length
     */
    validateStringLength(value: string, minLength: number, maxLength: number, fieldName?: string): ValidationResult;
    /**
     * Validate required field
     */
    validateRequired(value: any, fieldName?: string): ValidationResult;
    /**
     * Validate pattern match
     */
    validatePattern(value: string, pattern: RegExp, fieldName?: string, errorMessage?: string): ValidationResult;
}
