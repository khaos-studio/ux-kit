/**
 * FileValidator - Validates file formats and properties
 *
 * This class handles validation of various file types and properties
 * including markdown format, file size, and permissions.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare class FileValidator {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Validates markdown file format
     * @param filePath The path to the markdown file
     * @returns Validation result
     */
    validateMarkdownFile(filePath: string): Promise<ValidationResult>;
    /**
     * Validates file size against limit
     * @param filePath The path to the file
     * @param maxSizeBytes The maximum allowed size in bytes
     * @returns Validation result
     */
    validateFileSize(filePath: string, maxSizeBytes: number): Promise<ValidationResult>;
    /**
     * Validates file permissions
     * @param filePath The path to the file
     * @returns Validation result
     */
    validateFilePermissions(filePath: string): Promise<ValidationResult>;
}
