/**
 * File Validator
 * 
 * Validates files, templates, and file-related operations.
 */

import { ValidationResult, createSuccessResult, createErrorResult } from './ValidationResult';
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileValidator {
  /**
   * Validate markdown file content
   */
  validateMarkdown(content: string): ValidationResult {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('Markdown content is required');
      return createErrorResult(errors);
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

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate template file content
   */
  validateTemplate(content: string): ValidationResult {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('Template content is required');
      return createErrorResult(errors);
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

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate file extension
   */
  validateFileExtension(filePath: string, allowedExtensions: string[]): ValidationResult {
    const errors: string[] = [];

    if (!filePath || filePath.trim().length === 0) {
      errors.push('File path is required');
      return createErrorResult(errors);
    }

    const extension = path.extname(filePath).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension ${extension} is not allowed`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate file size
   */
  validateFileSize(content: string, maxSizeBytes: number): ValidationResult {
    const errors: string[] = [];

    if (!content) {
      errors.push('Content is required');
      return createErrorResult(errors);
    }

    const sizeBytes = Buffer.byteLength(content, 'utf8');

    if (sizeBytes > maxSizeBytes) {
      const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024) * 100) / 100;
      const actualSizeMB = Math.round(sizeBytes / (1024 * 1024) * 100) / 100;
      errors.push(`File size exceeds maximum allowed size (${actualSizeMB}MB > ${maxSizeMB}MB)`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate file permissions (mock implementation)
   */
  async validateFilePermissions(filePath: string, requiredPermission: 'read' | 'write'): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      if (requiredPermission === 'read') {
        await fs.access(filePath, fs.constants.R_OK);
      } else if (requiredPermission === 'write') {
        await fs.access(filePath, fs.constants.W_OK);
      }
    } catch (error) {
      errors.push(`Insufficient permissions for ${requiredPermission} access`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate file exists
   */
  async validateFileExists(filePath: string): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      await fs.access(filePath);
    } catch (error) {
      errors.push('File does not exist');
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate directory exists
   */
  async validateDirectoryExists(dirPath: string): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        errors.push('Path is not a directory');
      }
    } catch (error) {
      errors.push('Directory does not exist');
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate file name
   */
  validateFileName(fileName: string): ValidationResult {
    const errors: string[] = [];

    if (!fileName || fileName.trim().length === 0) {
      errors.push('File name is required');
      return createErrorResult(errors);
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

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate file path format
   */
  validateFilePathFormat(filePath: string): ValidationResult {
    const errors: string[] = [];

    if (!filePath || filePath.trim().length === 0) {
      errors.push('File path is required');
      return createErrorResult(errors);
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

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate JSON file content
   */
  validateJson(content: string): ValidationResult {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('JSON content is required');
      return createErrorResult(errors);
    }

    try {
      JSON.parse(content);
    } catch (error: any) {
      errors.push(`Invalid JSON: ${error.message}`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate YAML file content
   */
  validateYaml(content: string): ValidationResult {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('YAML content is required');
      return createErrorResult(errors);
    }

    try {
      const yaml = require('js-yaml');
      yaml.load(content);
    } catch (error: any) {
      errors.push(`Invalid YAML: ${error.message}`);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }
}
