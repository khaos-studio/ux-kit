/**
 * File Validator
 *
 * Validates files, templates, and file-related operations.
 */
import { ValidationResult } from './ValidationResult';
export declare class FileValidator {
    /**
     * Validate markdown file content
     */
    validateMarkdown(content: string): ValidationResult;
    /**
     * Validate template file content
     */
    validateTemplate(content: string): ValidationResult;
    /**
     * Validate file extension
     */
    validateFileExtension(filePath: string, allowedExtensions: string[]): ValidationResult;
    /**
     * Validate file size
     */
    validateFileSize(content: string, maxSizeBytes: number): ValidationResult;
    /**
     * Validate file permissions (mock implementation)
     */
    validateFilePermissions(filePath: string, requiredPermission: 'read' | 'write'): Promise<ValidationResult>;
    /**
     * Validate file exists
     */
    validateFileExists(filePath: string): Promise<ValidationResult>;
    /**
     * Validate directory exists
     */
    validateDirectoryExists(dirPath: string): Promise<ValidationResult>;
    /**
     * Validate file name
     */
    validateFileName(fileName: string): ValidationResult;
    /**
     * Validate file path format
     */
    validateFilePathFormat(filePath: string): ValidationResult;
    /**
     * Validate JSON file content
     */
    validateJson(content: string): ValidationResult;
    /**
     * Validate YAML file content
     */
    validateYaml(content: string): ValidationResult;
}
