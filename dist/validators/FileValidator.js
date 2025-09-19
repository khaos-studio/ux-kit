"use strict";
/**
 * FileValidator - Validates file formats and properties
 *
 * This class handles validation of various file types and properties
 * including markdown format, file size, and permissions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidator = void 0;
class FileValidator {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    /**
     * Validates markdown file format
     * @param filePath The path to the markdown file
     * @returns Validation result
     */
    async validateMarkdownFile(filePath) {
        const errors = [];
        try {
            const content = await this.fileSystem.readFile(filePath);
            // Check for basic markdown structure
            if (!content || content.trim().length === 0) {
                errors.push('File is empty');
            }
            // Check for unclosed markdown tags (basic validation)
            const openBold = (content.match(/\*\*/g) || []).length;
            const closeBold = (content.match(/\*\*/g) || []).length;
            if (openBold % 2 !== 0) {
                errors.push('Unclosed bold formatting detected');
            }
            const openItalic = (content.match(/\*/g) || []).length;
            if (openItalic % 2 !== 0) {
                errors.push('Unclosed italic formatting detected');
            }
            // Check for proper heading structure
            const headings = content.match(/^#+\s+/gm) || [];
            if (headings.length === 0) {
                errors.push('No headings found in markdown file');
            }
            return {
                isValid: errors.length === 0,
                errors
            };
        }
        catch (error) {
            return {
                isValid: false,
                errors: ['File could not be read']
            };
        }
    }
    /**
     * Validates file size against limit
     * @param filePath The path to the file
     * @param maxSizeBytes The maximum allowed size in bytes
     * @returns Validation result
     */
    async validateFileSize(filePath, maxSizeBytes) {
        const errors = [];
        try {
            const content = await this.fileSystem.readFile(filePath);
            const fileSize = Buffer.byteLength(content, 'utf8');
            if (fileSize > maxSizeBytes) {
                errors.push('File size exceeds limit');
            }
            return {
                isValid: errors.length === 0,
                errors
            };
        }
        catch (error) {
            return {
                isValid: false,
                errors: ['File could not be read for size validation']
            };
        }
    }
    /**
     * Validates file permissions
     * @param filePath The path to the file
     * @returns Validation result
     */
    async validateFilePermissions(filePath) {
        const errors = [];
        try {
            // Check if file exists and is readable
            const exists = await this.fileSystem.pathExists(filePath);
            if (!exists) {
                errors.push('File does not exist');
            }
            else {
                // Try to read the file to check permissions
                await this.fileSystem.readFile(filePath);
            }
            return {
                isValid: errors.length === 0,
                errors
            };
        }
        catch (error) {
            return {
                isValid: false,
                errors: ['File permissions validation failed']
            };
        }
    }
}
exports.FileValidator = FileValidator;
//# sourceMappingURL=FileValidator.js.map