/**
 * InputValidator Unit Tests
 */

import { InputValidator } from '../../../src/validation/InputValidator';

describe('InputValidator', () => {
  let inputValidator: InputValidator;

  beforeEach(() => {
    inputValidator = new InputValidator();
  });

  describe('validateStudyName', () => {
    it('should validate valid study names', () => {
      const result = inputValidator.validateStudyName('User Research Study 2024');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty study names', () => {
      const result = inputValidator.validateStudyName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Study name is required');
    });

    it('should reject study names that are too long', () => {
      const longName = 'a'.repeat(101);
      const result = inputValidator.validateStudyName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Study name must be 100 characters or less');
    });

    it('should reject study names that are too short', () => {
      const result = inputValidator.validateStudyName('ab');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Study name must be at least 3 characters long');
    });
  });

  describe('validateStudyId', () => {
    it('should validate valid study IDs', () => {
      const result = inputValidator.validateStudyId('study-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty study IDs', () => {
      const result = inputValidator.validateStudyId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Study ID is required');
    });

    it('should reject study IDs with invalid characters', () => {
      const result = inputValidator.validateStudyId('invalid id with spaces');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Study ID must contain only lowercase letters, numbers, and hyphens');
    });

    it('should reject study IDs that start or end with hyphens', () => {
      const result1 = inputValidator.validateStudyId('-study-123');
      const result2 = inputValidator.validateStudyId('study-123-');
      
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.errors).toContain('Study ID cannot start or end with a hyphen');
      expect(result2.errors).toContain('Study ID cannot start or end with a hyphen');
    });
  });

  describe('validateFilePath', () => {
    it('should validate valid file paths', () => {
      const result = inputValidator.validateFilePath('/path/to/file.md');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty file paths', () => {
      const result = inputValidator.validateFilePath('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File path is required');
    });

    it('should reject file paths with invalid characters', () => {
      const result = inputValidator.validateFilePath('invalid<>path');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File path contains invalid characters');
    });
  });

  describe('validateCommandArgs', () => {
    it('should validate valid command arguments', () => {
      const result = inputValidator.validateCommandArgs(['questions', 'study-123']);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty command arguments', () => {
      const result = inputValidator.validateCommandArgs([]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Command is required');
    });

    it('should reject invalid commands', () => {
      const result = inputValidator.validateCommandArgs(['invalid-command']);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid command: invalid-command');
    });
  });

  describe('validateEmail', () => {
    it('should validate valid email addresses', () => {
      const result = inputValidator.validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty email addresses', () => {
      const result = inputValidator.validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    it('should reject invalid email formats', () => {
      const result = inputValidator.validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });
  });

  describe('validateUrl', () => {
    it('should validate valid URLs', () => {
      const result = inputValidator.validateUrl('https://example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty URLs', () => {
      const result = inputValidator.validateUrl('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('URL is required');
    });

    it('should reject invalid URL formats', () => {
      const result = inputValidator.validateUrl('not-a-url');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid URL format');
    });
  });

  describe('validatePositiveNumber', () => {
    it('should validate positive numbers', () => {
      const result = inputValidator.validatePositiveNumber(5, 'Count');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-numbers', () => {
      const result = inputValidator.validatePositiveNumber('not-a-number' as any, 'Count');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Count must be a valid number');
    });

    it('should reject negative numbers', () => {
      const result = inputValidator.validatePositiveNumber(-1, 'Count');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Count must be positive');
    });
  });

  describe('validateStringLength', () => {
    it('should validate strings within length limits', () => {
      const result = inputValidator.validateStringLength('Hello', 3, 10, 'Message');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject strings that are too short', () => {
      const result = inputValidator.validateStringLength('Hi', 3, 10, 'Message');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message must be at least 3 characters long');
    });

    it('should reject strings that are too long', () => {
      const result = inputValidator.validateStringLength('This is a very long message', 3, 10, 'Message');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message must be 10 characters or less');
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty values', () => {
      const result = inputValidator.validateRequired('value', 'Field');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null values', () => {
      const result = inputValidator.validateRequired(null, 'Field');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Field is required');
    });

    it('should reject undefined values', () => {
      const result = inputValidator.validateRequired(undefined, 'Field');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Field is required');
    });

    it('should reject empty strings', () => {
      const result = inputValidator.validateRequired('', 'Field');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Field is required');
    });
  });

  describe('validatePattern', () => {
    it('should validate strings that match pattern', () => {
      const result = inputValidator.validatePattern('ABC123', /^[A-Z0-9]+$/, 'Code');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject strings that do not match pattern', () => {
      const result = inputValidator.validatePattern('abc123', /^[A-Z0-9]+$/, 'Code');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Code format is invalid');
    });

    it('should use custom error message', () => {
      const result = inputValidator.validatePattern('invalid', /^[A-Z]+$/, 'Code', 'Code must be uppercase letters only');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Code must be uppercase letters only');
    });
  });
});
