"use strict";
/**
 * File Validator
 *
 * Validates files, templates, and file-related operations.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidator = void 0;
const ValidationResult_1 = require("./ValidationResult");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class FileValidator {
    /**
     * Validate markdown file content
     */
    validateMarkdown(content) {
        const errors = [];
        if (!content || content.trim().length === 0) {
            errors.push('Markdown content is required');
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
        // Check for header
        if (!content.includes('#') && !content.includes('##')) {
            errors.push('Markdown file must have a header');
        }
        // Check for basic markdown structure
        const lines = content.split('\n');
        let hasHeader = false;
        let hasContent = false;
        for (const line of lines) {
            if (line.trim().startsWith('#')) {
                hasHeader = true;
            }
            if (line.trim().length > 0 && !line.trim().startsWith('#')) {
                hasContent = true;
            }
        }
        if (!hasHeader) {
            errors.push('Markdown file must have at least one header');
        }
        if (!hasContent) {
            errors.push('Markdown file must have content beyond headers');
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate template file content
     */
    validateTemplate(content) {
        const errors = [];
        if (!content || content.trim().length === 0) {
            errors.push('Template content is required');
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
        // Check for template variables (Handlebars-style)
        const variablePattern = /\{\{[^}]+\}\}/g;
        const variables = content.match(variablePattern);
        if (!variables || variables.length === 0) {
            errors.push('Template must contain at least one variable');
        }
        // Skip syntax validation for now - focus on basic template structure
        // Check for balanced braces
        const openBraces = (content.match(/\{\{/g) || []).length;
        const closeBraces = (content.match(/\}\}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push('Template has unbalanced braces');
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate file extension
     */
    validateFileExtension(filePath, allowedExtensions) {
        const errors = [];
        if (!filePath || filePath.trim().length === 0) {
            errors.push('File path is required');
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
        const extension = path.extname(filePath).toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            errors.push(`File extension ${extension} is not allowed`);
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate file size
     */
    validateFileSize(content, maxSizeBytes) {
        const errors = [];
        if (!content) {
            errors.push('Content is required');
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
        const sizeBytes = Buffer.byteLength(content, 'utf8');
        if (sizeBytes > maxSizeBytes) {
            const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024) * 100) / 100;
            const actualSizeMB = Math.round(sizeBytes / (1024 * 1024) * 100) / 100;
            errors.push(`File size exceeds maximum allowed size (${actualSizeMB}MB > ${maxSizeMB}MB)`);
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate file permissions (mock implementation)
     */
    async validateFilePermissions(filePath, requiredPermission) {
        const errors = [];
        try {
            if (requiredPermission === 'read') {
                await fs.access(filePath, fs.constants.R_OK);
            }
            else if (requiredPermission === 'write') {
                await fs.access(filePath, fs.constants.W_OK);
            }
        }
        catch (error) {
            errors.push(`Insufficient permissions for ${requiredPermission} access`);
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate file exists
     */
    async validateFileExists(filePath) {
        const errors = [];
        try {
            await fs.access(filePath);
        }
        catch (error) {
            errors.push('File does not exist');
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate directory exists
     */
    async validateDirectoryExists(dirPath) {
        const errors = [];
        try {
            const stats = await fs.stat(dirPath);
            if (!stats.isDirectory()) {
                errors.push('Path is not a directory');
            }
        }
        catch (error) {
            errors.push('Directory does not exist');
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate file name
     */
    validateFileName(fileName) {
        const errors = [];
        if (!fileName || fileName.trim().length === 0) {
            errors.push('File name is required');
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
        // Check for invalid characters
        const invalidChars = /[<>:"|?*\x00-\x1f]/;
        if (invalidChars.test(fileName)) {
            errors.push('File name contains invalid characters');
        }
        // Check for reserved names (Windows)
        const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
        const nameWithoutExt = path.parse(fileName).name.toUpperCase();
        if (reservedNames.includes(nameWithoutExt)) {
            errors.push('File name is reserved');
        }
        // Check length
        if (fileName.length > 255) {
            errors.push('File name must be 255 characters or less');
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate file path format
     */
    validateFilePathFormat(filePath) {
        const errors = [];
        if (!filePath || filePath.trim().length === 0) {
            errors.push('File path is required');
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
        // Check for invalid characters
        const invalidChars = /[<>:"|?*\x00-\x1f]/;
        if (invalidChars.test(filePath)) {
            errors.push('File path contains invalid characters');
        }
        // Check for path traversal
        if (filePath.includes('..') || filePath.includes('~')) {
            errors.push('File path contains path traversal characters');
        }
        // Check length
        if (filePath.length > 260) {
            errors.push('File path must be 260 characters or less');
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate JSON file content
     */
    validateJson(content) {
        const errors = [];
        if (!content || content.trim().length === 0) {
            errors.push('JSON content is required');
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
        try {
            JSON.parse(content);
        }
        catch (error) {
            errors.push(`Invalid JSON: ${error.message}`);
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate YAML file content
     */
    validateYaml(content) {
        const errors = [];
        if (!content || content.trim().length === 0) {
            errors.push('YAML content is required');
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
        try {
            const yaml = require('js-yaml');
            yaml.load(content);
        }
        catch (error) {
            errors.push(`Invalid YAML: ${error.message}`);
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
}
exports.FileValidator = FileValidator;
//# sourceMappingURL=FileValidator.js.map