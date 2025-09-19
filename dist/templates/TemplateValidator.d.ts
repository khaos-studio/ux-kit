/**
 * TemplateValidator - Validates template syntax and variables
 *
 * This class provides validation for template syntax, variables, and file existence.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
import { TemplateVariables } from './TemplateEngine';
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare class TemplateValidator {
    /**
     * Validates template syntax
     * @param template The template string to validate
     * @returns Validation result with errors if any
     */
    validate(template: string): Promise<ValidationResult>;
    /**
     * Validates that all required variables are provided
     * @param template The template string
     * @param variables The variables object
     * @returns Validation result with missing variables if any
     */
    validateVariables(template: string, variables: TemplateVariables): Promise<ValidationResult>;
    /**
     * Validates that a template file exists and is readable
     * @param templatePath The path to the template file
     * @param fileSystem The file system service
     * @returns Validation result
     */
    validateFile(templatePath: string, fileSystem: IFileSystemService): Promise<ValidationResult>;
    /**
     * Validates template content for common issues
     * @param template The template content
     * @returns Validation result with warnings and errors
     */
    validateContent(template: string): Promise<ValidationResult>;
    /**
     * Checks if a variable exists in the variables object
     * @param variables The variables object
     * @param path The dot-notation path to the variable
     * @returns True if the variable exists, false otherwise
     */
    private hasVariable;
}
